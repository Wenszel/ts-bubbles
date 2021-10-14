import MapNode from "./MapNode";
class Bubble {
    public mapNode: MapNode;
    public bubbleEl: HTMLElement;
    public color: string;
    constructor(mapNode: MapNode, color: string) {
        this.mapNode = mapNode;
        this.color = color;
    }
    paintOnMap() {
        this.bubbleEl = document.createElement("div");
        this.bubbleEl.className = "bubble";
        this.bubbleEl.style.backgroundColor = this.color;
        this.mapNode.nodeEl.appendChild(this.bubbleEl);
    }
}
export default Bubble;
