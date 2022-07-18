/**
 * See the [README](https://github.com/observablehq/plot/blob/v0.5.2/README.md) for more info.
 */
export function plot(options?: {}): any;
export function marks(...marks: any[]): any[];
export class Mark {
    constructor(data: any, channels: any[] | undefined, options: {} | undefined, defaults: any);
    data: any;
    sort: any;
    initializer: any;
    transform: any;
    facet: string | null;
    channels: any[];
    dx: number;
    dy: number;
    clip: string | boolean;
    initialize(facets: any, facetChannels: any): {
        data: any;
        facets: any;
        channels: {};
    };
    filter(index: any, channels: any, values: any): any;
    plot({ marks, ...options }?: {
        marks?: any[] | undefined;
    }): any;
}
