export function boxX(data: any, { x, y, fill, fillOpacity, stroke, strokeOpacity, strokeWidth, sort, ...options }?: {
    x?: {
        transform: (x: any) => any;
    } | undefined;
    y?: null | undefined;
    fill?: string | undefined;
    fillOpacity: any;
    stroke?: string | undefined;
    strokeOpacity: any;
    strokeWidth?: number | undefined;
    sort: any;
}): any[];
export function boxY(data: any, { y, x, fill, fillOpacity, stroke, strokeOpacity, strokeWidth, sort, ...options }?: {
    y?: {
        transform: (y: any) => any;
    } | undefined;
    x?: null | undefined;
    fill?: string | undefined;
    fillOpacity: any;
    stroke?: string | undefined;
    strokeOpacity: any;
    strokeWidth?: number | undefined;
    sort: any;
}): any[];
