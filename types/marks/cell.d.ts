export function cell(data: any, { x, y, ...options }?: {
    x: any;
    y: any;
}): Cell;
export function cellX(data: any, { x, fill, stroke, ...options }?: {
    x?: ((d: any, i: any) => any) | undefined;
    fill: any;
    stroke: any;
}): Cell;
export function cellY(data: any, { y, fill, stroke, ...options }?: {
    y?: ((d: any, i: any) => any) | undefined;
    fill: any;
    stroke: any;
}): Cell;
export class Cell extends AbstractBar {
    constructor(data: any, { x, y, ...options }?: {
        x: any;
        y: any;
    });
    _transform(selection: any, mark: any): void;
}
import { AbstractBar } from "./bar.js";
