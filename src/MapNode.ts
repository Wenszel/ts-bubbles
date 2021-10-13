class MapNode {
    x: number;
    y: number;
    points: number = 0;
    type: string;
    nodeEl: HTMLElement | null = null;
    constructor(x: number, y: number, type: string) {
        this.x = x;
        this.y = y;
        this.type = type;
    }
}
export default MapNode;