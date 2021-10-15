import MapObject from "./interfaces/MapObject";
import GameMap from "./GameMap";
import { TIME } from "./Constans";
class MapNode implements MapObject {
    private map: GameMap;
    public x: number;
    public y: number;
    public nodeEl: HTMLElement;

    constructor(x: number, y: number, map: GameMap) {
        this.x = x;
        this.y = y;
        this.map = map;
        this.nodeEl = document.createElement("div");
        this.nodeEl.className = "map-el";
        this.nodeEl.addEventListener("click", () => {
            // Is any bubble selected
            if (!this.map.selectedBubble) {
                const bubble = this.map.bubblesOnMap.find(i => i.mapNode == this);
                // Checks if the bubble has possible move to do
                if (this.map.findNextMapNode([bubble.mapNode], [])) {
                    this.map.selectedBubble = bubble;
                    this.map.selectedBubble?.bubbleEl.classList.toggle("selected-bubble");
                }
            }
            // If bubble isn't selected
            else if (this == this.map.selectedBubble?.mapNode) {
                this.map.selectedBubble.bubbleEl.classList.remove("selected-bubble");
                this.map.selectedBubble = null;
            }
            // If bubble is selected and clicked on another bubble
            else if (this.map.bubblesOnMap.find(i => i.mapNode == this)) {
                this.map.selectedBubble.bubbleEl.classList.remove("selected-bubble");
                this.map.selectedBubble = this.map.bubblesOnMap.find(i => i.mapNode == this);
                this.map.selectedBubble.bubbleEl.classList.toggle("selected-bubble");
            }
            // If click isn't on other bubble
            else if (!this.map.bubblesOnMap.find(i => i.mapNode == this)) {
                const path = this.map.findPath();
                if (path) {
                    this.map.colorPath(path as Array<MapNode>, "grey", 1000);
                    this.map.selectedBubble.moveBubble();
                    this.map.game.nextRound();
                }
            }
        });
        this.nodeEl.addEventListener("mouseenter", () => {
            this.map.endMapNode = this;
            if (this.map.selectedBubble) {
                const path = this.map.findPath();
                if (path) this.map.colorPath(path as Array<MapNode>, "pink", TIME.always);
            }
        });
        this.nodeEl.addEventListener("mouseleave", () => {
            if (this.map.selectedBubble) {
                this.map.endMapNode = this;
                const path = this.map.findPath();
                if (path) this.map.colorPath(path as Array<MapNode>, "pink", TIME.clear);
            }
        });
        document.getElementById("map").appendChild(this.nodeEl);
    }
}
export default MapNode;
