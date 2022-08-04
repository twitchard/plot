export function area(data: any, options: any): Area;
export function areaX(data: any, options: any): Area;
export function areaY(data: any, options: any): Area;
export class Area extends Mark {
    constructor(data: any, options?: {});
    z: any;
    curve: import("d3-shape").CurveFactory | import("d3-shape").CurveBundleFactory | import("d3-shape").CurveCardinalFactory | import("d3-shape").CurveCatmullRomFactory;
    render(index: any, scales: any, channels: any, dimensions: any, context: any): any;
}
import { Mark } from "../plot.js";
