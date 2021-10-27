import MapObject from "./interfaces/MapObject";
import GameMap from "./GameMap";
import Bubble from "./Bubble";
import ShortesPath from "./ShortesPath";
import { TIME } from "./Constans";

class MapNode implements MapObject {
    private map: GameMap;
    public x: number;
    public y: number;
    public nodeEl: HTMLElement;
    public neighbors: Array<MapNode>;

    constructor(x: number, y: number, map: GameMap) {
        this.x = x;
        this.y = y;
        this.map = map;
        this.nodeEl = document.createElement("div");
        this.nodeEl.className = "map-el";
        this.nodeEl.onclick = () => this.handleClick();
        this.nodeEl.onmouseenter = () => this.handleMouseMove(TIME.always);
        this.nodeEl.onmouseleave = () => this.handleMouseMove(TIME.clear);
        document.getElementById("map").append(this.nodeEl);
    }
    private handleClick(): void {
        const bubble = this.findThisNodeBubble();
        this.map.endMapNode = this;
        // select
        if (!this.map.selectedBubble) {
            // Checks if the bubble has possible move to do
            if (bubble && bubble.canMakeMove()) {
                this.map.selectedBubble = bubble;
                this.map.selectedBubble.reselect();
            }
        }
        // unselect
        else if (bubble === this.map.selectedBubble) {
            this.map.selectedBubble.reselect();
            this.map.selectedBubble = null;
        }
        // If bubble is selected and clicked on another bubble
        else if (bubble) {
            this.map.selectedBubble.reselect();
            this.map.selectedBubble = bubble;
            this.map.selectedBubble.reselect();
        }
        // If click isn't on other bubble
        else if (!bubble) {
            this.map.path = new ShortesPath(this.map.selectedBubble.mapNode, this, this.map);
            if (this.map.path.path.length > 0) {
                this.map.colorPath(this.map.path.path, "grey", 1000);
                this.map.selectedBubble.moveBubble();
                this.map.game.nextRound();
            }
        }
    }
    private handleMouseMove(time: string): void {
        if (this.map.selectedBubble && !this.findThisNodeBubble()) {
            this.map.path = new ShortesPath(this.map.selectedBubble.mapNode, this, this.map);
            this.map.colorPath(this.map.path.path, "pink", time);
        }
    }
    // Function responsible for finding all MapNodes
    public findNeighbors(): void {
        const { x, y, map } = this;
        this.neighbors = [
            map.listOfNodes.find(i => i.x === x - 1 && i.y === y),
            map.listOfNodes.find(i => i.x === x + 1 && i.y === y),
            map.listOfNodes.find(i => i.y === y - 1 && i.x === x),
            map.listOfNodes.find(i => i.y === y + 1 && i.x === x),
        ].filter(n => n);
    }
    private findThisNodeBubble(): Bubble {
        return this.map.bubblesOnMap.find(i => i.mapNode === this);
    }
}
export default MapNode;
