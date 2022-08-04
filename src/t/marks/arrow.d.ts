export function arrow(data: any, { x, x1, x2, y, y1, y2, ...options }?: {
    x: any;
    x1: any;
    x2: any;
    y: any;
    y1: any;
    y2: any;
}): Arrow;
export class Arrow extends Mark {
    constructor(data: any, options?: {});
    bend: number;
    headAngle: number;
    headLength: number;
    insetStart: number;
    insetEnd: number;
    render(index: any, scales: any, channels: any, dimensions: any, context: any): any;
}
import { Mark } from "../plot.js";
