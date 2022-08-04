export function link(data: any, { x, x1, x2, y, y1, y2, ...options }?: {
    x: any;
    x1: any;
    x2: any;
    y: any;
    y1: any;
    y2: any;
}): Link;
export function maybeSameValue(x: any, x1: any, x2: any): any[];
export class Link extends Mark {
    constructor(data: any, options?: {});
    curve: import("d3-shape").CurveFactory | import("d3-shape").CurveBundleFactory | import("d3-shape").CurveCardinalFactory | import("d3-shape").CurveCatmullRomFactory;
    render(index: any, scales: any, channels: any, dimensions: any, context: any): any;
}
import { Mark } from "../plot.js";
