export function barX(data: any, options?: {
    y: (d: any, i: any) => any;
    x2: {
        transform: (d: any) => any;
    };
}): BarX;
export function barY(data: any, options?: {
    x: (d: any, i: any) => any;
    y2: {
        transform: (d: any) => any;
    };
}): BarY;
export class AbstractBar extends Mark {
    constructor(data: any, channels: any, options: {} | undefined, defaults: any);
    insetTop: any;
    insetRight: any;
    insetBottom: any;
    insetLeft: any;
    rx: any;
    ry: any;
    render(index: any, scales: any, channels: any, dimensions: any, context: any): any;
    _x(scales: any, { x: X }: {
        x: any;
    }, { marginLeft }: {
        marginLeft: any;
    }): any;
    _y(scales: any, { y: Y }: {
        y: any;
    }, { marginTop }: {
        marginTop: any;
    }): any;
    _width({ x }: {
        x: any;
    }, { x: X }: {
        x: any;
    }, { marginRight, marginLeft, width }: {
        marginRight: any;
        marginLeft: any;
        width: any;
    }): number;
    _height({ y }: {
        y: any;
    }, { y: Y }: {
        y: any;
    }, { marginTop, marginBottom, height }: {
        marginTop: any;
        marginBottom: any;
        height: any;
    }): number;
}
export class BarX extends AbstractBar {
    constructor(data: any, options?: {});
    _transform(selection: any, mark: any, { x }: {
        x: any;
    }): void;
}
export class BarY extends AbstractBar {
    constructor(data: any, options?: {});
    _transform(selection: any, mark: any, { y }: {
        y: any;
    }): void;
}
import { Mark } from "../plot.js";
