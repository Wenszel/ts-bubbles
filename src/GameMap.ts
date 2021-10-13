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
        this.path = [startMapNode];
        this.xSize = xSize;
        this.ySize = ySize;
        this.wallsArray = wallsArray;
        this.listOfNodes = this.generateListOfNodes();
        this.gameMapEl = document.createElement("div");
        this.gameMapEl.id = "map";
        document.getElementById("app")?.appendChild(this.gameMapEl);
        this.findPath();
        this.generateHTML();
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
    generateHTML() {
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
            if (this.path.find(p => p.x === i.x && p.y === i.y)) nodeEl.classList.add("map-path");
            i.nodeEl = nodeEl;
            this.gameMapEl.appendChild(nodeEl);
        });
    }
    findNextMapNode(): MapNode {
        let nextNode: MapNode;
        let consideredNodes: Array<MapNode> = [];
        const currentNode = this.path[this.path.length - 1];
        const lastNode = this.path[this.path.length - 2];
        let xMinus = this.listOfNodes.find(i => i.x == currentNode.x - 1 && i.y == currentNode.y);
        let xPlus = this.listOfNodes.find(i => i.x == currentNode.x + 1 && i.y == currentNode.y);
        let yMinus = this.listOfNodes.find(i => i.y == currentNode.y - 1 && i.x == currentNode.x);
        let yPlus = this.listOfNodes.find(i => i.y == currentNode.y + 1 && i.x == currentNode.x);
        xMinus && xMinus != lastNode && xMinus.type != NODE_TYPES.wall ? consideredNodes.push(xMinus) : null;
        xPlus && xPlus != lastNode && xPlus.type != NODE_TYPES.wall ? consideredNodes.push(xPlus) : null;
        yMinus && yMinus != lastNode && yMinus.type != NODE_TYPES.wall ? consideredNodes.push(yMinus) : null;
        yPlus && yPlus != lastNode && yPlus.type != NODE_TYPES.wall ? consideredNodes.push(yPlus) : null;
        consideredNodes.forEach(i => {
            i.points = Math.abs(this.endMapNode.x - i.x) + Math.abs(this.endMapNode.y - i.y);
        });
        nextNode = consideredNodes.reduce(function (prev, curr) {
            return prev.points < curr.points ? prev : curr;
        });
        return nextNode;
    }
    findPath() {
        while (this.path[this.path.length - 1].x !== this.endMapNode.x || this.path[this.path.length - 1].y !== this.endMapNode.y) {
            this.path.push(this.findNextMapNode());
        }
    }
}
export default GameMap;
