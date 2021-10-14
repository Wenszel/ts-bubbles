import MapNode from "./MapNode";
import Bubble from "./Bubble";
import { NODE_TYPES, COLORS } from "./Constans";
class GameMap {
    public listOfNodes: Array<MapNode>;
    public gameMapEl: HTMLElement;
    public startMapNode: MapNode;
    public endMapNode: MapNode;
    public bubblesOnMap: Array<Bubble> = [];
    private xSize: number;
    private ySize: number;
    wallsArray: Array<MapNode>;
    path: Array<MapNode>;
    constructor(xSize: number, ySize: number) {
        this.xSize = xSize;
        this.ySize = ySize;
        this.generateMap();
        this.generateBubble(3);
    }
    generateBubble(amount: number): void {
        for (let i = 0; i < amount; i++) {
            const mapNode = this.listOfNodes[Math.floor(Math.random() * this.listOfNodes.length)];
            const bubble = new Bubble(mapNode, COLORS[Math.floor(Math.random() * COLORS.length)]);
            bubble.paintOnMap();
            this.bubblesOnMap.push(bubble);
        }
    }
    // Function responsible for generating HTML map and array of map nodes
    generateMap(): void {
        this.gameMapEl = document.createElement("div");
        this.gameMapEl.id = "map";
        document.getElementById("app")?.appendChild(this.gameMapEl);
        let listOfNodes: Array<MapNode> = [];
        for (let x = 0; x < this.xSize; x++) {
            for (let y = 0; y < this.ySize; y++) {
                listOfNodes.push(new MapNode(x, y, this));
            }
        }
        this.listOfNodes = listOfNodes;
    }
    // Implementation of A* algorithm
    // Function responsible for finding next node on map based on possible moves and weight of this moves
    findNextMapNode(): MapNode {
        let nextNode: MapNode;
        let consideredNodes: Array<MapNode> = [];
        const { listOfNodes, endMapNode } = this;
        // x, y - cords of current position (last item in path array)
        const { x, y } = this.path[this.path.length - 1];
        /* Array of possible moves
           Looks for: left, right, down, up movement
           Return node if true or undefined if x or y out of range */
        consideredNodes = [
            listOfNodes.find(i => i.x == x - 1 && i.y == y),
            listOfNodes.find(i => i.x == x + 1 && i.y == y),
            listOfNodes.find(i => i.y == y - 1 && i.x == x),
            listOfNodes.find(i => i.y == y + 1 && i.x == x),
        ];
        /* Checks if:
           1) node exist
           2) hasn't already appeared in the path - movement cannot go backwards
           3) node type isn't wall - movement cannot pass through the wall */
        consideredNodes = consideredNodes.filter(node => {
            return node && !this.path.includes(node) && node.type != NODE_TYPES.wall;
        });
        /* Finds the node with the least path to the target based on points
        points are counted by adding up the distance that must be traveled along the X and Y axes avoiding any obstacles
        */
        nextNode = consideredNodes.reduce(function (prev, curr) {
            const previousPoints = Math.abs(endMapNode.x - prev.x) + Math.abs(endMapNode.y - prev.y);
            const currentPoints = Math.abs(endMapNode.x - curr.x) + Math.abs(endMapNode.y - curr.y);
            return previousPoints < currentPoints ? prev : curr;
        });
        return nextNode;
    }
    findPath(): void {
        while (this.path[this.path.length - 1].x !== this.endMapNode.x || this.path[this.path.length - 1].y !== this.endMapNode.y) {
            this.path.push(this.findNextMapNode());
        }
    }
}
export default GameMap;
