export function rect(data: any, options: any): Rect;
export function rectX(data: any, options?: {
    y: (d: any, i: any) => any;
    interval: number;
    x2: {
        transform: (d: any) => any;
    };
}): Rect;
export function rectY(data: any, options?: {
    x: (d: any, i: any) => any;
    interval: number;
    y2: {
        transform: (d: any) => any;
    };
}): Rect;
export class Rect extends Mark {
    constructor(data: any, options?: {});
    insetTop: any;
    insetRight: any;
    insetBottom: any;
    insetLeft: any;
    rx: any;
    ry: any;
    render(index: any, scales: any, channels: any, dimensions: any, context: any): any;
}
import { Mark } from "../plot.js";
