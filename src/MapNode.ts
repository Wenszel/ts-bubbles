import MapObject from "./interfaces/MapObject";
import GameMap from "./GameMap";
import { TIME } from "./Constans";
import ShortesPath from "./ShortesPath";
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
        this.nodeEl.addEventListener("click", () => {
            this.map.endMapNode = this;
            // Is any bubble selected
            if (!this.map.selectedBubble) {
                const bubble = this.map.bubblesOnMap.find(i => i.mapNode == this);
                // Checks if the bubble has possible move to do
                if (bubble.canMakeMove()) {
                    this.map.selectedBubble = bubble;
                    this.map.selectedBubble?.bubbleEl.classList.toggle("selected-bubble");
                }
            }
            // If bubble isn't selected
            else if (this == this.map.selectedBubble?.mapNode) {
                this.map.endMapNode = this;
                this.map.selectedBubble.bubbleEl.classList.remove("selected-bubble");
                this.map.selectedBubble = null;
            }
            // If bubble is selected and clicked on another bubble
            else if (this.map.bubblesOnMap.find(i => i.mapNode == this)) {
                this.map.endMapNode = this;
                this.map.selectedBubble.bubbleEl.classList.remove("selected-bubble");
                this.map.selectedBubble = this.map.bubblesOnMap.find(i => i.mapNode == this);
                this.map.selectedBubble.bubbleEl.classList.toggle("selected-bubble");
            }
            // If click isn't on other bubble
            else if (!this.map.bubblesOnMap.find(i => i.mapNode == this)) {
                this.map.endMapNode = this;
                this.map.path = new ShortesPath(this.map.selectedBubble.mapNode, this, this.map);
                if (this.map.path) {
                    this.map.colorPath(this.map.path.path, "grey", 1000);
                    this.map.selectedBubble.moveBubble();
                    this.map.game.nextRound();
                }
            }
        });
        this.nodeEl.addEventListener("mouseenter", () => {
            if (!this.map.bubblesOnMap.find(i => i.mapNode == this)) {
                if (this.map.selectedBubble) {
                    this.map.endMapNode = this;
                    this.map.path = new ShortesPath(this.map.selectedBubble.mapNode, this, this.map);
                    if (this.map.path) this.map.colorPath(this.map.path.path, "pink", TIME.always);
                }
            }
        });
        this.nodeEl.addEventListener("mouseleave", () => {
            if (!this.map.bubblesOnMap.find(i => i.mapNode == this)) {
                if (this.map.selectedBubble) {
                    this.map.endMapNode = this;
                    this.map.path = new ShortesPath(this.map.selectedBubble.mapNode, this, this.map);
                    if (this.map.path) this.map.colorPath(this.map.path.path, "pink", TIME.clear);
                }
            }
        });
        document.getElementById("map").appendChild(this.nodeEl);
    }

    findNeigbors() {
        const { x, y } = this;
        let consideredNeighbors: Array<MapNode> = [
            this.map.listOfNodes.find(i => i.x === x - 1 && i.y === y),
            this.map.listOfNodes.find(i => i.x === x + 1 && i.y === y),
            this.map.listOfNodes.find(i => i.y === y - 1 && i.x === x),
            this.map.listOfNodes.find(i => i.y === y + 1 && i.x === x),
        ];
        consideredNeighbors = consideredNeighbors.filter(n => n);
        this.neighbors = consideredNeighbors;
    }
}
export default MapNode;
