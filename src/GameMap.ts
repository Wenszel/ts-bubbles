import MapNode from "./MapNode";
import Bubble from "./Bubble";
import Game from "./Game";
import ShortesPath from "./ShortesPath";
import MapNodes from "./interfaces/MapNodes";
import Delay from "./decorators/delay";
import { TIME } from "./Constans";

/** Class representation of a map */
class GameMap {
    /** Stores all map elements */
    public listOfNodes: MapNodes = [];
    /** Stores all bubbles that are currently on map */
    public bubblesOnMap: Array<Bubble> = [];
    public gameMapEl: HTMLElement = document.getElementById("map");
    /** Currently selected bubble that can make move */
    public selectedBubble: Bubble | null;
    /** Point where selected bubble will be moved */
    public endMapNode: MapNode;
    /** Currently drawed path on map */
    public path: ShortesPath;
    /** Reference to parent, game object */
    public game: Game;
    /** Size of map */
    private xSize: number;
    private ySize: number;

    constructor(xSize: number, ySize: number, game: Game) {
        this.xSize = xSize;
        this.ySize = ySize;
        this.game = game;
        this.generateMap();
    }
    /**
     * Generates bubbles on map
     * @param arrayOfColor array of colors of bubbles that will be generated on map
     */
    public generateBubbles(arrayOfColors: Array<string>): void {
        // For each color creates bubble on map
        arrayOfColors.forEach(color => {
            // Checks if game isn't already ended
            // We need to check it because forEach loop can't be stopped when all nodes are filled with bubbles
            if (!this.game.isEnded) {
                // If, while adding a bubble to the map, a situation occurs in which there are no more empty nodes on the map
                // ends the game
                if (this.bubblesOnMap.length !== this.listOfNodes.length) {
                    let mapNode: MapNode;
                    // While drawed node is currently full draw another node
                    do {
                        mapNode = this.listOfNodes[Math.floor(Math.random() * this.listOfNodes.length)];
                    } while (mapNode.findNodeBubble());
                    this.bubblesOnMap.push(new Bubble(mapNode, color, this));
                } else {
                    this.game.gameOver();
                }
            }
        });
        // After generating bubbles on map we have to check if there is any bubbles to crush
        // because can happen that bubbles will form row of 5 after generating them
        this.checkForCrushed();
    }
    /** Function responsible for generating HTML map and array of map nodes */
    private generateMap(): void {
        for (let x = 0; x < this.xSize; x++) {
            for (let y = 0; y < this.ySize; y++) {
                this.listOfNodes.push(new MapNode(x, y, this));
            }
        }
        // After generating all of the nodes adds their neighbors to object variable
        // It can't be run until all of the nodes have been generated
        this.listOfNodes.forEach(node => node.findNeighbors());
    }
    /**
     * Function responsible for drawing path on map
     * @param path Array of nodes that path contains
     * @param color The color of the path to be colored
     * @param time After what time should the given path be removed from the map
     */
    public colorPath(path: Array<MapNode>, color: string, time: number | string): void {
        switch (time) {
            case TIME.always:
                path.forEach(i => (i.nodeEl.style.backgroundColor = color));
                break;
            case TIME.clear:
                path.forEach(i => (i.nodeEl.style.backgroundColor = null));
                break;
            default:
                path.forEach(i => (i.nodeEl.style.backgroundColor = color));
                this.clearPath(path);
        }
    }
    @Delay(1000)
    /**
     * Function responsible for clearing the path from map
     * @param path array of nodes to be cleared
     */
    private clearPath(path: Array<MapNode>) {
        path.forEach(i => (i.nodeEl.style.backgroundColor = null));
    }
    /**
     * Function responsible for checking if any bubbles were crushed
     * @returns If any bubbles had been crushed
     */
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
                    this.game.updateScoreEl();
                    this.bubblesOnMap.splice(index, 1);
                    returnValue = true;
                }
            });
        });
        return returnValue;
    }
}
export default GameMap;
