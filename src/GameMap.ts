import MapNode from "./MapNode";
import { NODE_TYPES } from "./Constans";
class GameMap {
    listOfNodes: Array<MapNode>;
    gameMapEl: HTMLElement;
    startMapNode: MapNode;
    endMapNode: MapNode;
    xSize: number;
    ySize: number;
    wallsArray: Array<MapNode>;
    path: Array<MapNode>;
    constructor(xSize: number, ySize: number, startMapNode: MapNode, endMapNode: MapNode, wallsArray: Array<MapNode>) {
        this.startMapNode = startMapNode;
        this.endMapNode = endMapNode;
        this.xSize = xSize;
        this.ySize = ySize;
        this.wallsArray = wallsArray;
        this.listOfNodes = this.generateListOfNodes();
        this.path = [this.listOfNodes.find(i => (i.type = NODE_TYPES.start))];
        this.gameMapEl = document.createElement("div");
        this.gameMapEl.id = "map";
        document.getElementById("app")?.appendChild(this.gameMapEl);
        this.generateHTML();
        this.findPath();
        this.path.forEach(i => i.nodeEl.classList.add("map-path"));
    }
    generateListOfNodes(): Array<MapNode> {
        let array: Array<MapNode> = [];
        for (let i = 0; i < this.xSize; i++) {
            for (let j = 0; j < this.ySize; j++) {
                if (this.wallsArray.find(w => w.x === i && w.y === j)) {
                    array.push(new MapNode(i, j, NODE_TYPES.wall));
                } else if (this.startMapNode.x == i && this.startMapNode.y == j) {
                    array.push(new MapNode(i, j, NODE_TYPES.start));
                } else if (this.endMapNode.x == i && this.endMapNode.y == j) {
                    array.push(new MapNode(i, j, NODE_TYPES.end));
                } else {
                    array.push(new MapNode(i, j, NODE_TYPES.normal));
                }
            }
        }
        return array;
    }
    generateHTML(): void {
        this.listOfNodes.forEach(i => {
            const nodeEl = document.createElement("div");
            switch (i.type) {
                case NODE_TYPES.normal:
                    nodeEl.innerHTML = `${i.x}, ${i.y}`;
                    break;
                case NODE_TYPES.wall:
                    nodeEl.innerHTML = `WALL`;
                    break;
                case NODE_TYPES.start:
                    nodeEl.innerHTML = `A`;
                    break;
                case NODE_TYPES.end:
                    nodeEl.innerHTML = `B`;
                    break;
            }
            nodeEl.className = "map-el";
            i.nodeEl = nodeEl;
            this.gameMapEl.appendChild(nodeEl);
        });
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
