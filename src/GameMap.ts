import MapNode from "./MapNode";
import Bubble from "./Bubble";
import Game from "./Game";
import { TIME } from "./Constans";
class GameMap {
    public listOfNodes: Array<MapNode>;
    public gameMapEl: HTMLElement;
    public startMapNode: MapNode;
    public endMapNode: MapNode;
    public bubblesOnMap: Array<Bubble> = [];
    public selectedBubble: Bubble | null;
    public game: Game;
    private xSize: number;
    private ySize: number;
    constructor(xSize: number, ySize: number, game: Game) {
        this.xSize = xSize;
        this.ySize = ySize;
        this.game = game;
        this.generateMap();
    }
    // Generates bubbles on map based on given quantity
    generateBubble(arrayOfColors: Array<string>): void {
        arrayOfColors.forEach(color => {
            const mapNode = this.listOfNodes[Math.floor(Math.random() * this.listOfNodes.length)];
            if (!this.bubblesOnMap.find(bubble => bubble.mapNode === mapNode)) {
                this.bubblesOnMap.push(new Bubble(mapNode, color, this));
            }
        });
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
    findNextMapNode(path: Array<MapNode>, exceptions: Array<MapNode>): MapNode | null {
        let nextNode: MapNode;
        let consideredNodes: Array<MapNode> = [];
        const { listOfNodes, endMapNode } = this;
        // x, y - cords of current position (last item in path array)
        const { x, y } = path[path.length - 1];
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
           3) node type isn't bubble - movement cannot pass through the bubble
           4) node isn't in exceptions - to the exceptions we add node that led to the way with no exit */
        consideredNodes = consideredNodes.filter(node => {
            return node && !path.includes(node) && !this.bubblesOnMap.find(bubble => bubble.mapNode === node) && !exceptions.includes(node);
        });
        // Checks if there is at least one candidate
        // If no returns null which is the equivalent of no path
        if (consideredNodes.length > 0) {
            /* Finds the node with the least path to the target based on points
               points are counted by adding up the distance that must be traveled along the X and Y axes avoiding any obstacles */
            nextNode = consideredNodes.reduce(function (prev, curr) {
                const previousPoints = Math.abs(endMapNode.x - prev.x) + Math.abs(endMapNode.y - prev.y);
                const currentPoints = Math.abs(endMapNode.x - curr.x) + Math.abs(endMapNode.y - curr.y);
                return previousPoints < currentPoints ? prev : curr;
            });
        } else {
            return null;
        }
        return nextNode;
    }
    /* Function responsible for finding path between two nodes
       Returns: 
       - false if the two nodes aren't connected
       - Array<MapNode> (path) if the two nodes are connected */
    findPath(): Array<MapNode> | Boolean {
        const path: Array<MapNode> = [this.selectedBubble.mapNode];
        // The array of nodes that have been visited and led to the no-exit road
        const exceptions: Array<MapNode> = [];
        // Until the last element of the path differs from the endpoint
        while (path[path.length - 1]?.x !== this.endMapNode.x || path[path.length - 1]?.y !== this.endMapNode.y) {
            // The path length will be zero when there is no way to the destination
            // because every time we don't find our way, we remove the wrong move from the path
            if (path.length > 0) {
                const newMove = this.findNextMapNode(path, exceptions);
                if (newMove) {
                    path.push(newMove);
                } else {
                    let falseMove = path[path.length - 1];
                    path.splice(path.length - 1, 1);
                    exceptions.push(falseMove);
                }
            } else {
                return false;
            }
        }
        return path;
    }
    colorPath(path: Array<MapNode>, color: string, time: number | string) {
        if (time === TIME.always) {
            path.forEach(i => (i.nodeEl.style.backgroundColor = color));
        } else if (time === TIME.clear) {
            path.forEach(i => (i.nodeEl.style.backgroundColor = null));
        } else {
            path.forEach(i => (i.nodeEl.style.backgroundColor = color));
            setTimeout(() => {
                path.forEach(i => (i.nodeEl.style.backgroundColor = null));
            }, time as number);
        }
    }
    checkForCrushed(): Boolean {
        let returnValue = false;
        const answerArray: Bubble[][] = [];
        this.bubblesOnMap.forEach(i => {
            let arrayOfSameColor: Bubble[][] = [[i], [i], [i], [i]];
            let iterator = 1;
            let baseColor = i.color;
            // x+
            while (this.bubblesOnMap.find(j => j.mapNode.x == i.mapNode.x + iterator && j.mapNode.y === i.mapNode.y)?.color === baseColor) {
                arrayOfSameColor[0].push(this.bubblesOnMap.find(j => j.mapNode.x == i.mapNode.x + iterator && j.mapNode.y === i.mapNode.y));
                iterator++;
            }
            // x-
            iterator = 1;
            while (this.bubblesOnMap.find(j => j.mapNode.x == i.mapNode.x - iterator && j.mapNode.y === i.mapNode.y)?.color === baseColor) {
                arrayOfSameColor[0].push(this.bubblesOnMap.find(j => j.mapNode.x == i.mapNode.x - iterator && j.mapNode.y === i.mapNode.y));
                iterator++;
            }
            // y+
            iterator = 1;
            while (this.bubblesOnMap.find(j => j.mapNode.y == i.mapNode.y + iterator && j.mapNode.x === i.mapNode.x)?.color === baseColor) {
                arrayOfSameColor[1].push(this.bubblesOnMap.find(j => j.mapNode.y == i.mapNode.y + iterator && j.mapNode.x === i.mapNode.x));
                iterator++;
            }
            //y-
            iterator = 1;
            while (this.bubblesOnMap.find(j => j.mapNode.y == i.mapNode.y - iterator && j.mapNode.x === i.mapNode.x)?.color === baseColor) {
                arrayOfSameColor[1].push(this.bubblesOnMap.find(j => j.mapNode.y == i.mapNode.y - iterator && j.mapNode.x === i.mapNode.x));
                iterator++;
            }
            //y+ x-
            iterator = 1;
            while (this.bubblesOnMap.find(j => j.mapNode.y == i.mapNode.y + iterator && j.mapNode.x == i.mapNode.x - iterator)?.color === baseColor) {
                arrayOfSameColor[2].push(this.bubblesOnMap.find(j => j.mapNode.y == i.mapNode.y + iterator && j.mapNode.x == i.mapNode.x - iterator));
                iterator++;
            }
            //y- x-
            iterator = 1;
            while (this.bubblesOnMap.find(j => j.mapNode.y == i.mapNode.y - iterator && j.mapNode.x == i.mapNode.x - iterator)?.color === baseColor) {
                arrayOfSameColor[3].push(this.bubblesOnMap.find(j => j.mapNode.y == i.mapNode.y - iterator && j.mapNode.x == i.mapNode.x - iterator));
                iterator++;
            }
            //y+ x+
            iterator = 1;
            while (this.bubblesOnMap.find(j => j.mapNode.y == i.mapNode.y + iterator && j.mapNode.x == i.mapNode.x + iterator)?.color === baseColor) {
                arrayOfSameColor[3].push(this.bubblesOnMap.find(j => j.mapNode.y == i.mapNode.y + iterator && j.mapNode.x == i.mapNode.x + iterator));
                iterator++;
            }
            //y+ x-
            iterator = 1;
            while (this.bubblesOnMap.find(j => j.mapNode.y == i.mapNode.y + iterator && j.mapNode.x == i.mapNode.x - iterator)?.color === baseColor) {
                arrayOfSameColor[2].push(this.bubblesOnMap.find(j => j.mapNode.y == i.mapNode.y + iterator && j.mapNode.x == i.mapNode.x - iterator));
                iterator++;
            }
            arrayOfSameColor.forEach(i => {
                i.length >= 3 ? answerArray.push(i) : null;
            });
        });
        answerArray.forEach(i => {
            i.forEach(j => {
                j.removeFromMap();
                const index: number = this.bubblesOnMap.indexOf(j);
                if (index != -1) {
                    this.game.increaseScore();
                    this.bubblesOnMap.splice(index, 1);
                    returnValue = true;
                }
            });
        });
        return returnValue;
    }
}
export default GameMap;
