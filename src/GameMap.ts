import MapNode from './MapNode';
import Bubble from './Bubble';
import Game from './Game';
import ShortesPath from './ShortesPath';
import MapNodes from './interfaces/MapNodes';
import Delay from './decorators/delay';
import { TIME, arrayOfCords } from './Constans';

/** Class representation of a map */
export default class GameMap {
    /** Stores all map elements */
    public listOfNodes: MapNodes = [];
    /** Stores all bubbles that are currently on map */
    public bubblesOnMap: Array<Bubble> = [];
    public gameMapEl: HTMLElement = document.getElementById('map');
    /** Currently selected bubble that can make move */
    public selectedBubble: Bubble | null;
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
                    } while (mapNode.findBubble());
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
     * @returns true if any bubble had been crushed
     */
    public checkForCrushed(): Boolean {
        // Stores all bubbles which are the result of the algorithm for finding the bubbles to crush
        const arrayToCrush: Bubble[][] = [];
        // For each bubble on the map, check if it has 5 neighbors in a row
        this.bubblesOnMap.forEach(i => {
            // Stores all bubbles which have the same color in specific direction
            // We initialize arrays with current bubble (i element) on index 0 because algorithm below doesn't push this bubble to the array
            const arrayOfSameColor: Bubble[][] = [[i], [i], [i], [i]];
            /**
             * Finds bubble neighbor in specific direction and with the same color
             * @param iteratorX distance from main bubble multiplayed by slope factor:
             * 0 if we want to look only for neighbors on the Y axis
             * -1 if we want to look left from main bubble
             * 1 if we want to look right from main bubble
             * @param iteratorY analogous to the iteratorX
             */
            const findSameColorNeighbor = (iteratorX: number, iteratorY: number) => {
                return this.bubblesOnMap.find(
                    j => j.mapNode.x === i.mapNode.x + iteratorX && j.mapNode.y === i.mapNode.y + iteratorY && j.color === i.color,
                );
            };
            /**
             * While findSameColorNeighbor function finds neighbors this functions pushes bubbles to arrayOfSameColor
             * @param index axis:
             * 0 X
             * 1 Y
             * 2 above X to the left from Y and below X and to the right from Y
             * 3 below X to the left from Y and above X and to the right from Y
             * @param iteratorX slope factor explained in findSameColorNeighbor function
             * @param iteratorY slope factor explained in findSameColorNeighbor function
             */
            const pushSameColorNeighbor = (index: number, iteratorX: number, iteratorY: number) => {
                for (let iterator = 1; findSameColorNeighbor(iterator * iteratorX, iterator * iteratorY); iterator++) {
                    arrayOfSameColor[index].push(findSameColorNeighbor(iterator * iteratorX, iterator * iteratorY));
                }
            };
            // arrayOfCords is in Constans file and it contains array of axis and slope factors explained above
            arrayOfCords.forEach(k => pushSameColorNeighbor(...k));
            // Checks if the array has enough array length (equal or bigger then game.quatityToCrush variable)
            arrayOfSameColor.forEach(i => {
                i.length >= this.game.quantityToCrush ? arrayToCrush.push(i) : null;
            });
        });
        // Variable that becomes true when break occurs
        let returnValue: Boolean = false;
        // Every bubble in arrayToCrush array is removed from map and score is increased
        arrayToCrush.forEach(i => {
            i.forEach(j => {
                j.removeFromMap();
                const index: number = this.bubblesOnMap.indexOf(j);
                if (index !== -1) {
                    this.game.updateScoreEl();
                    this.bubblesOnMap.splice(index, 1);
                    returnValue = true;
                }
            });
        });
        return returnValue;
    }
}
