import MapObject from "./interfaces/MapObject";
class MapNode implements MapObject {
    public x: number;
    public y: number;
    public type: string;
    public nodeEl: HTMLElement | null = null;
    constructor(x: number, y: number, type: string) {
        this.x = x;
        this.y = y;
        this.type = type;
    }
}
export default MapNode;
