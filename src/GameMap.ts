import MapNode from "./MapNode";
import Bubble from "./Bubble";
import Game from "./Game";
import ShortesPath from "./ShortesPath";
import MapNodes from "./interfaces/MapNodes";
import Delay from "./decorators/delay";
import { TIME } from "./Constans";

class GameMap {
    public listOfNodes: MapNodes;
    public gameMapEl: HTMLElement;
    public endMapNode: MapNode;
    public bubblesOnMap: Array<Bubble> = [];
    public selectedBubble: Bubble | null;
    public path: ShortesPath;
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
    public generateBubble(arrayOfColors: Array<string>): void {
        arrayOfColors.forEach(color => {
            if (this.bubblesOnMap.length !== this.listOfNodes.length && !this.game.isEnded) {
                let mapNode = this.listOfNodes[Math.floor(Math.random() * this.listOfNodes.length)];
                while (mapNode.findThisNodeBubble()) {
                    mapNode = this.listOfNodes[Math.floor(Math.random() * this.listOfNodes.length)];
                }
                this.bubblesOnMap.push(new Bubble(mapNode, color, this));
            } else if (this.bubblesOnMap.length === this.listOfNodes.length && !this.game.isEnded) this.game.endGame();
        });
    }
    // Function responsible for generating HTML map and array of map nodes
    private generateMap(): void {
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
        listOfNodes.forEach(node => node.findNeighbors());
    }
    public colorPath(path: Array<MapNode>, color: string, time: number | string): void {
        if (time === TIME.always) {
            path.forEach(i => (i.nodeEl.style.backgroundColor = color));
        } else if (time === TIME.clear) {
            path.forEach(i => (i.nodeEl.style.backgroundColor = null));
        } else {
            path.forEach(i => (i.nodeEl.style.backgroundColor = color));
            this.clearPath(path);
        }
    }
    @Delay(1000)
    private clearPath(path: Array<MapNode>) {
        path.forEach(i => (i.nodeEl.style.backgroundColor = null));
    }
    public checkForCrushed(): Boolean {
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
            //y- x+
            iterator = 1;
            while (this.bubblesOnMap.find(j => j.mapNode.y == i.mapNode.y - iterator && j.mapNode.x == i.mapNode.x + iterator)?.color === baseColor) {
                arrayOfSameColor[2].push(this.bubblesOnMap.find(j => j.mapNode.y == i.mapNode.y - iterator && j.mapNode.x == i.mapNode.x + iterator));
                iterator++;
            }
            arrayOfSameColor.forEach(i => {
                i.length >= this.game.quantityToCrush ? answerArray.push(i) : null;
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
