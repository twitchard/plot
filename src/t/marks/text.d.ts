export function text(data: any, { x, y, ...options }?: {
    x: any;
    y: any;
}): Text;
export function textX(data: any, { x, ...options }?: {
    x?: {
        transform: (d: any) => any;
    } | undefined;
}): Text;
export function textY(data: any, { y, ...options }?: {
    y?: {
        transform: (d: any) => any;
    } | undefined;
}): Text;
export class Text extends Mark {
    constructor(data: any, options?: {});
    rotate: any;
    textAnchor: any;
    lineAnchor: string;
    lineHeight: number;
    lineWidth: number;
    monospace: boolean;
    fontFamily: any;
    fontSize: any;
    fontStyle: any;
    fontVariant: any;
    fontWeight: any;
    frameAnchor: string;
    render(index: any, scales: any, channels: any, dimensions: any, context: any): any;
}
import { Mark } from "../plot.js";
