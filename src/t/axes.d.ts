export function Axes({ x: xScale, y: yScale, fx: fxScale, fy: fyScale }: {
    x: any;
    y: any;
    fx: any;
    fy: any;
}, { x, y, fx, fy, axis, grid, line, label, facet: { axis: facetAxis, grid: facetGrid, label: facetLabel } }?: {
    x?: {} | undefined;
    y?: {} | undefined;
    fx?: {} | undefined;
    fy?: {} | undefined;
    axis?: boolean | undefined;
    grid: any;
    line: any;
    label: any;
    facet?: {
        axis?: any;
        grid: any;
        label?: any;
    } | undefined;
}): any;
export function autoAxisTicks({ x, y, fx, fy }: {
    x: any;
    y: any;
    fx: any;
    fy: any;
}, { x: xAxis, y: yAxis, fx: fxAxis, fy: fyAxis }: {
    x: any;
    y: any;
    fx: any;
    fy: any;
}): void;
export function autoScaleLabels(channels: any, scales: any, { x, y, fx, fy }: {
    x: any;
    y: any;
    fx: any;
    fy: any;
}, dimensions: any, options: any): void;
export function inferFontVariant(scale: any): "tabular-nums" | undefined;
