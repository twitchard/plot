export function linearRegressionX(data: any, { y, x, stroke, fill, ...options }?: {
    y?: ((d: any, i: any) => any) | undefined;
    x?: {
        transform: (d: any) => any;
    } | undefined;
    stroke: any;
    fill?: any;
}): LinearRegressionX;
export function linearRegressionY(data: any, { x, y, stroke, fill, ...options }?: {
    x?: ((d: any, i: any) => any) | undefined;
    y?: {
        transform: (d: any) => any;
    } | undefined;
    stroke: any;
    fill?: any;
}): LinearRegressionY;
declare class LinearRegressionX extends LinearRegression {
    constructor(data: any, options: any);
    _renderBand(I: any, X: any, Y: any): never;
    _renderLine(I: any, X: any, Y: any): string;
}
declare class LinearRegressionY extends LinearRegression {
    constructor(data: any, options: any);
    _renderBand(I: any, X: any, Y: any): never;
    _renderLine(I: any, X: any, Y: any): string;
}
declare class LinearRegression extends Mark {
    constructor(data: any, options?: {});
    z: any;
    ci: number;
    precision: number;
    render(index: any, scales: any, channels: any, dimensions: any, context: any): any;
}
import { Mark } from "../plot.js";
export {};
