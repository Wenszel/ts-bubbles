class MapNode {
    x: number;
    y: number;
    points: number = 0;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}
function generateMap(xSize: number, ySize: number): Array<MapNode> {
    let array: Array<MapNode> = [];
    for (let i = 0; i < xSize; i++) {
        for (let j = 0; j < ySize; j++) {
            array.push(new MapNode(i, j));
        }
    }
    return array;
}
function findNextMapNode(path: Array<MapNode>, endMapNode: MapNode, map: Array<MapNode>): MapNode {
    let nextNode: MapNode;
    let consideredNodes: Array<MapNode> = [];
    const currentNode = path[path.length - 1];
    const lastNode = path[path.length - 2];
    let xMinus = map.find(i => i.x == currentNode.x - 1 && i.y == currentNode.y);
    let xPlus = map.find(i => i.x == currentNode.x + 1 && i.y == currentNode.y);
    let yMinus = map.find(i => i.y == currentNode.y - 1 && i.x == currentNode.x);
    let yPlus = map.find(i => i.y == currentNode.y + 1 && i.x == currentNode.x);
    xMinus && xMinus != lastNode ? consideredNodes.push(xMinus) : null;
    xPlus && xPlus != lastNode ? consideredNodes.push(xPlus) : null;
    yMinus && yMinus != lastNode ? consideredNodes.push(yMinus) : null;
    yPlus && yPlus != lastNode ? consideredNodes.push(yPlus) : null;
    consideredNodes.forEach(i => {
        i.points = Math.abs(endMapNode.x - i.x) + Math.abs(endMapNode.y - i.y);
    });
    nextNode = consideredNodes.reduce(function (prev, curr) {
        return prev.points < curr.points ? prev : curr;
    });
    return nextNode;
}
const map = generateMap(5, 5);
const startMapNode = new MapNode(0, 0);
const endMapNode = new MapNode(3, 3);
let path: Array<MapNode> = [startMapNode];

while (path[path.length - 1].x !== endMapNode.x || path[path.length - 1].y !== endMapNode.y) {
    path.push(findNextMapNode(path, endMapNode, map));
}
console.log(path);
