import MapObject from "./interfaces/MapObject";
import GameMap from "./GameMap";
import { NODE_TYPES } from "./Constans";

class MapNode implements MapObject {
    map: GameMap;
    public x: number;
    public y: number;
    public type: string;
    public nodeEl: HTMLElement;
    constructor(x: number, y: number, map: GameMap) {
        this.x = x;
        this.y = y;
        this.map = map;
        this.nodeEl = document.createElement("div");
        this.nodeEl.className = "map-el";
        this.nodeEl.addEventListener("click", () => {
            if (!map.startMapNode) {
                this.type = NODE_TYPES.start;
                this.nodeEl.innerHTML = "A";
                this.map.startMapNode = this;
            } else if (!map.endMapNode) {
                this.type = NODE_TYPES.end;
                this.nodeEl.innerHTML = "B";
                this.map.endMapNode = this;
            }
        });
        document.getElementById("map").appendChild(this.nodeEl);
    }
}
export default MapNode;
