export function image(data: any, { x, y, ...options }?: {
    x: any;
    y: any;
}): Image;
export class Image extends Mark {
    constructor(data: any, options?: {});
    src: any;
    width: any;
    height: any;
    preserveAspectRatio: any;
    crossOrigin: any;
    frameAnchor: string;
    render(index: any, scales: any, channels: any, dimensions: any, context: any): any;
}
import { Mark } from "../plot.js";
