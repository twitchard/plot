export function plot(options?: {}): any;
export function marks(...marks: any[]): any[];
export class Mark {
    constructor(data: any, channels: {} | undefined, options: {} | undefined, defaults: any);
    data: any;
    sort: any;
    initializer: any;
    transform: any;
    facet: string | null;
    channels: {
        [k: string]: any;
    };
    dx: number;
    dy: number;
    clip: string | boolean;
    initialize(facets: any, facetChannels: any): {
        data: any;
        facets: any;
        channels: {
            [k: string]: {
                scale: any;
                type: any;
                value: any;
                label: any;
                filter: any;
                hint: any;
            };
        };
    };
    filter(index: any, channels: any, values: any): any;
    plot({ marks, ...options }?: {
        marks?: any[] | undefined;
    }): any;
}
