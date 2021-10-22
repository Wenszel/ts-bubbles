import GameMap from "./GameMap";
import MapNode from "./MapNode";
import Step from "./interfaces/Step";

class ShortesPath {
    private start: MapNode;
    private end: MapNode;
    private steps: Array<Array<Step>> = [];
    private map: GameMap;
    public path: Array<MapNode> = [];

    constructor(start: MapNode, end: MapNode, map: GameMap) {
        this.start = start;
        this.end = end;
        this.map = map;
        this.findPath();
    }
    findPath(): boolean {
        this.steps.push([{ node: this.start, parent: null }]);
        while (!this.steps.find(i => i.find(i => i.node === this.end))) {
            this.findNextSteps();
            if (this.steps[this.steps.length - 1].length === 0) {
                return false;
            }
        }
        let last: Step = this.steps[this.steps.length - 1].find(i => i.node === this.end);
        this.steps.splice(this.steps.length - 1, 1);
        let parent: MapNode = null;
        while (this.steps.length > 0) {
            this.path.push(last.node);
            parent = last.parent;
            last = this.steps[this.steps.length - 1].find(i => i.node === parent);
            this.steps.splice(this.steps.length - 1, 1);
        }
        this.path.push(this.start);
        return true;
    }
    findNextSteps(): void {
        this.steps.push([]);
        this.steps[this.steps.length - 2].forEach(step => {
            let consideredNodes = step.node.neighbors.filter(node => {
                return node && !this.steps.flat().find(i => i.node === node) && !this.map.bubblesOnMap.find(bubble => bubble.mapNode === node);
            });
            const stepArray: Array<Step> = consideredNodes.map(i => {
                return { node: i, parent: step.node };
            });
            this.steps[this.steps.length - 1] = this.steps[this.steps.length - 1].concat(stepArray);
        });
    }
}
export default ShortesPath;
