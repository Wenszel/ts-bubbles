import MapObject from './interfaces/MapObject';
import GameMap from './GameMap';
import Bubble from './Bubble';
import ShortesPath from './ShortesPath';
import { PATH_COLORS, TIME } from './Constans';

/** Element of the map */
class MapNode implements MapObject {
    /** Reference to parent, map object */
    private map: GameMap;
    /** X cordinate */
    public x: number;
    /** Y cordinate */
    public y: number;
    /** HTML representation of this object */
    public nodeEl: HTMLElement;
    /**
     * All MapNodes around this
     * it is used for the pathfinding algorithm
     */
    public neighbors: Array<MapNode>;

    constructor(x: number, y: number, map: GameMap) {
        this.x = x;
        this.y = y;
        this.map = map;
        // Creates an html element and adds listeners
        this.nodeEl = document.createElement('div');
        this.nodeEl.className = 'map-el';
        this.nodeEl.onclick = () => this.handleClick();
        this.nodeEl.onmouseenter = () => this.handleMouseMove(TIME.always);
        this.nodeEl.onmouseleave = () => this.handleMouseMove(TIME.clear);
        this.map.gameMapEl.append(this.nodeEl);
    }
    /** Function handle selecting and unselecting bubbles on the map */
    private handleClick(): void {
        const bubble = this.findBubble();
        // Select bubble if there is no selected
        if (!this.map.selectedBubble) {
            // Checks if the bubble has possible move to do
            if (bubble && bubble.canMakeMove()) {
                this.map.selectedBubble = bubble;
                this.map.selectedBubble.reselect();
            }
        }
        // If this bubble is selected unselect it
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
                this.map.colorPath(this.map.path.path, PATH_COLORS.drawed, 1000);
                this.map.selectedBubble.moveBubble(this.map.path.path[0]);
                this.map.game.nextRound();
            }
        }
    }
    /**
     * Function handle mouse move depends on time argument:
     * TIME.always - mouseenter - adds path
     * TIME.clear - mouseleave - deletes path
     * @param time - how long path will exists on the map
     */
    private handleMouseMove(time: TIME): void {
        // If any bubble is selected and current node isn't filled with bubble
        if (this.map.selectedBubble && !this.findBubble()) {
            this.map.path = new ShortesPath(this.map.selectedBubble.mapNode, this, this.map);
            this.map.colorPath(this.map.path.path, PATH_COLORS.hint, time);
        }
    }
    /**
     * Function responsible for finding all MapNodes
     * It is executed for every node on the map after map initialization
     */
    public findNeighbors(): void {
        const { x, y, map } = this;
        this.neighbors = [
            map.listOfNodes.find(i => i.x === x - 1 && i.y === y),
            map.listOfNodes.find(i => i.x === x + 1 && i.y === y),
            map.listOfNodes.find(i => i.y === y - 1 && i.x === x),
            map.listOfNodes.find(i => i.y === y + 1 && i.x === x),
        ].filter(n => n); // Checks if node exists
    }
    /** Finds bubble which is in this node
     * @returns bubble object
     */
    public findBubble(): Bubble {
        return this.map.bubblesOnMap.find(i => i.mapNode === this);
    }
}
export default MapNode;
