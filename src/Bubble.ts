import MapNode from './MapNode';
import GameMap from './GameMap';
/** Class representing bubble on mapNode */
export default class Bubble {
    /** Parent map node */
    public mapNode: MapNode;
    /** Color of the bubble */
    public color: string;
    /** HTML representation of Bubble object*/
    private bubbleEl: HTMLElement;
    /** Reference to parent, map object */
    private map: GameMap;

    constructor(mapNode: MapNode, color: string, map: GameMap) {
        this.mapNode = mapNode;
        this.color = color;
        this.map = map;
        this.paintOnMap();
    }
    /** Add bubble to the HTML */
    private paintOnMap(): void {
        this.bubbleEl = document.createElement('div');
        this.bubbleEl.classList.add('bubble', this.color);
        this.mapNode.nodeEl.appendChild(this.bubbleEl);
    }
    /** Removes from HTML */
    public removeFromMap(): void {
        this.bubbleEl.remove();
    }
    /**
     * Checks if bubble can make move -> if has any neighbor that aren't filled with bubble
     * @returns boolean - can make move
     */
    public canMakeMove(): boolean {
        return this.mapNode.neighbors.some(i => !this.map.bubblesOnMap.find(j => i == j.mapNode));
    }
    /** Handle bubble CSS -> if not selected adds class */
    public reselect(): void {
        this.bubbleEl.classList.toggle('selected-bubble');
    }
    /** Move bubble from one MapNode to another */
    public moveBubble(endMapNode: MapNode): void {
        this.map.selectedBubble = null;
        this.mapNode.nodeEl.innerHTML = '';
        this.mapNode = endMapNode;
        this.mapNode.nodeEl.appendChild(this.bubbleEl);
        this.bubbleEl.classList.remove('selected-bubble');
    }
}
