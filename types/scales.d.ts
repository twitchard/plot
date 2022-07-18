export function Scales(channelsByScale: any, { inset: globalInset, insetTop: globalInsetTop, insetRight: globalInsetRight, insetBottom: globalInsetBottom, insetLeft: globalInsetLeft, round, nice, clamp, zero, align, padding, ...options }?: {
    inset?: number | undefined;
    insetTop?: any;
    insetRight?: any;
    insetBottom?: any;
    insetLeft?: any;
    round: any;
    nice: any;
    clamp: any;
    zero: any;
    align: any;
    padding: any;
}): {};
export function ScaleFunctions(scales: any): {
    [k: string]: any;
};
export function autoScaleRange({ x, y, fx, fy }: {
    x: any;
    y: any;
    fx: any;
    fy: any;
}, dimensions: any): void;
export function normalizeScale(key: any, scale: any, hint: any): any;
export function isTemporalScale({ type }: {
    type: any;
}): boolean;
export function isOrdinalScale({ type }: {
    type: any;
}): boolean;
export function isThresholdScale({ type }: {
    type: any;
}): boolean;
export function isDivergingScale({ type }: {
    type: any;
}): boolean;
export function scaleOrder({ range, domain }: {
    range: any;
    domain?: any;
}): number;
export function isCollapsed(scale: any): boolean;
export function coerceNumbers(values: any): any;
export function coerceNumber(x: any): number;
export function coerceDate(x: any): Date | undefined;
export function scale(options?: {}): any;
export function exposeScales(scaleDescriptors: any): (key: any) => any;
