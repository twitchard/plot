export function ruleX(data: any, options: any): RuleX;
export function ruleY(data: any, options: any): RuleY;
export class RuleX extends Mark {
    constructor(data: any, options?: {});
    insetTop: any;
    insetBottom: any;
    render(index: any, scales: any, channels: any, dimensions: any, context: any): any;
}
export class RuleY extends Mark {
    constructor(data: any, options?: {});
    insetRight: any;
    insetLeft: any;
    render(index: any, scales: any, channels: any, dimensions: any, context: any): any;
}
import { Mark } from "../plot.js";
