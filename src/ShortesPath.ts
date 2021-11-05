import GameMap from './GameMap';
import MapNode from './MapNode';
import MapNodes from './interfaces/MapNodes';
import Step from './interfaces/Step';
import Performance from './decorators/performance';

/** Class representing the shortest path between nodes on the map */
export default class ShortesPath {
    /** Node where path starts */
    private start: MapNode;
    /** Node where path ends */
    private end: MapNode;
    /**
     * Stores steps from start to end
     * every steps contains current MapNode and previous step MapNode
     */
    private steps: Step[][] = [];
    /** Reference to parent, game object */
    private map: GameMap;
    /** Contains information whether a path between given points exists */
    public isPath: boolean;
    /** Array of MapNodes which path contains */
    public path: MapNodes = [];

    constructor(start: MapNode, end: MapNode, map: GameMap) {
        this.start = start;
        this.end = end;
        this.map = map;
        this.isPath = this.findPath();
    }
    /**
     * Function responsible for finding wholo path and saving it to this.path array
     * Uses Dijkstra's algorithm to find shortest path between two points
     * @returns Boolean: true - path exist, false - path does not exist
     */
    private findPath(): boolean {
        // Adds to steps start node
        this.steps.push([{ node: this.start, parent: null }]);
        // While step doesn't contains end node find next step
        while (!this.steps.find(i => i.find(i => i.node === this.end))) {
            this.findNextSteps();
            // If last step is empty (no more moves can be done) - return false (path doesn't exist)
            if (this.steps[this.steps.length - 1].length === 0) {
                return false;
            }
        }
        // We iterate all the steps
        while (this.steps.length > 0) {
            // We are looking for step with same node as end of path
            let last: Step = this.steps.splice(-1)[0].find(i => i.node === this.end);
            this.path.push(last.node);
            // Each time we shorten the step table, we change the end point to the parent of the last step
            this.end = last.parent;
        }
        return true;
    }
    /** Function responsible for finding next step (array of next possible moves) */
    private findNextSteps(): void {
        // We add a new empty array, which will be filled with steps
        this.steps.push([]);
        // length - 2 => we want to access last filled steps array
        this.steps[this.steps.length - 2].forEach(step => {
            // From all neighbors of the considered node
            // we remove those that are already in our path and those that are already filled with the bubble
            let consideredNodes = step.node.neighbors.filter(node => {
                return !this.steps.flat().find(i => i.node === node) && !node.findBubble();
            });
            // We add the parent which is the previous node from which the current one results
            const stepArray: Array<Step> = consideredNodes.map(i => {
                return { node: i, parent: step.node };
            });
            this.steps[this.steps.length - 1] = this.steps[this.steps.length - 1].concat(stepArray);
        });
    }
}
