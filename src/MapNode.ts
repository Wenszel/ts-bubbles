import MapObject from "./interfaces/MapObject";
import GameMap from "./GameMap";

class MapNode implements MapObject {
    map: GameMap;
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
            if (!this.map.selectedBubble) {
                this.map.selectedBubble = this.map.bubblesOnMap.find(i => i.mapNode == this);
            } else if (!this.map.endMapNode) {
                this.map.endMapNode = this;
                this.map.findPath();
                this.map.selectedBubble.moveBubble();
            }
        });
        document.getElementById("map").appendChild(this.nodeEl);
    }
}
export default MapNode;
