import MapNode from "../MapNode";
export default interface MapNodes extends Array<MapNode> {
    [index: number]: MapNode;
}
