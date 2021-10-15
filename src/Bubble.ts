import MapNode from "./MapNode";
import GameMap from "./GameMap";
class Bubble {
    public mapNode: MapNode;
    public bubbleEl: HTMLElement;
    public color: string;
    private map: GameMap;
    constructor(mapNode: MapNode, color: string, map: GameMap) {
        this.mapNode = mapNode;
        this.color = color;
        this.map = map;
        this.paintOnMap();
    }
    paintOnMap() {
        this.bubbleEl = document.createElement("div");
        this.bubbleEl.className = "bubble";
        this.bubbleEl.style.backgroundColor = this.color;
        this.mapNode.nodeEl.appendChild(this.bubbleEl);
        this.bubbleEl.addEventListener("click", () => {
            if (this.bubbleEl.classList.contains("selected-bubble")) {
                this.bubbleEl.classList.remove("selected-bubble");
            } else {
                this.map.selectedBubble?.bubbleEl.classList.remove("selected-bubble");
                this.bubbleEl.classList.add("selected-bubble");
            }
        });
    }
    moveBubble() {
        this.map.selectedBubble = null;
        this.mapNode.nodeEl.innerHTML = "";
        this.mapNode = this.map.endMapNode;
        this.mapNode.nodeEl.appendChild(this.bubbleEl);
        this.map.endMapNode = null;
    }
}
export default Bubble;
