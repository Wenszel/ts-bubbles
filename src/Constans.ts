export const COLORS = ['red', 'green', 'yellow', 'blue', 'purple', 'grey', 'black', 'pink', 'orange'];
export enum TIME {
    always,
    clear,
}
export enum PATH_COLORS {
    hint = 'pink',
    drawed = 'grey',
}
export const arrayOfCords: Array<[number, number, number]> = [
    [0, 1, 0],
    [0, -1, 0],
    [1, 0, 1],
    [1, 0, -1],
    [2, -1, 1],
    [2, 1, -1],
    [3, -1, -1],
    [3, 1, 1],
];
