import GameMap from "./GameMap";
import MapNode from "./MapNode";
import { NODE_TYPES } from "./Constans";

const wallsArray = [new MapNode(0, 1, NODE_TYPES.wall), new MapNode(1, 1, NODE_TYPES.wall), new MapNode(2, 2, NODE_TYPES.wall)];
const startMapNode = new MapNode(0, 0, NODE_TYPES.start);
const endMapNode = new MapNode(3, 3, NODE_TYPES.end);
const gameMap = new GameMap(5, 5, startMapNode, endMapNode, wallsArray);
