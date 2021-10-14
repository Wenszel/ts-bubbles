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
            if (!map.startMapNode) {
                this.nodeEl.innerHTML = "A";
                this.map.startMapNode = this;
            } else if (!map.endMapNode) {
                this.nodeEl.innerHTML = "B";
                this.map.endMapNode = this;
                this.map.findPath();
            }
        });
        document.getElementById("map").appendChild(this.nodeEl);
    }
}
export default MapNode;
