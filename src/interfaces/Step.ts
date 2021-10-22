import MapNode from '../MapNode';

export default interface Step{
    node: MapNode;
    parent: MapNode;
}