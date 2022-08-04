export function dot(data: any, { x, y, ...options }?: {
    x: any;
    y: any;
}): Dot;
export function dotX(data: any, { x, ...options }?: {
    x?: {
        transform: (d: any) => any;
    } | undefined;
}): Dot;
export function dotY(data: any, { y, ...options }?: {
    y?: {
        transform: (d: any) => any;
    } | undefined;
}): Dot;
export function circle(data: any, options: any): Dot;
export function hexagon(data: any, options: any): Dot;
export class Dot extends Mark {
    constructor(data: any, options?: {});
    r: any;
    rotate: any;
    symbol: any;
    frameAnchor: string;
    render(index: any, scales: any, channels: any, dimensions: any, context: any): any;
}
import { Mark } from "../plot.js";
