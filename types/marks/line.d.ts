export function line(data: any, { x, y, ...options }?: {
    x: any;
    y: any;
}): Line;
export function lineX(data: any, { x, y, ...options }?: {
    x?: {
        transform: (d: any) => any;
    } | undefined;
    y?: ((d: any, i: any) => any) | undefined;
}): Line;
export function lineY(data: any, { x, y, ...options }?: {
    x?: ((d: any, i: any) => any) | undefined;
    y?: {
        transform: (d: any) => any;
    } | undefined;
}): Line;
export class Line extends Mark {
    constructor(data: any, options?: {});
    z: any;
    curve: import("d3-shape").CurveFactory | import("d3-shape").CurveBundleFactory | import("d3-shape").CurveCardinalFactory | import("d3-shape").CurveCatmullRomFactory;
    filter(index: any): any;
    render(index: any, scales: any, channels: any, dimensions: any, context: any): any;
}
import { Mark } from "../plot.js";
