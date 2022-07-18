export function vector(data: any, { x, y, ...options }?: {
    x: any;
    y: any;
}): Vector;
export function vectorX(data: any, { x, ...options }?: {
    x?: {
        transform: (d: any) => any;
    } | undefined;
}): Vector;
export function vectorY(data: any, { y, ...options }?: {
    y?: {
        transform: (d: any) => any;
    } | undefined;
}): Vector;
export class Vector extends Mark {
    constructor(data: any, options?: {});
    length: any;
    rotate: any;
    anchor: string;
    frameAnchor: string;
    render(index: any, scales: any, channels: any, dimensions: any, context: any): any;
}
import { Mark } from "../plot.js";
