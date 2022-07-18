export function basic({ filter: f1, sort: s1, reverse: r1, transform: t1, initializer: i1, ...options }: {
    filter: any;
    sort: any;
    reverse: any;
    transform: any;
    initializer: any;
} | undefined, t2: any): {
    transform: any;
    sort?: any;
};
export function initializer({ filter: f1, sort: s1, reverse: r1, initializer: i1, ...options }: {
    filter: any;
    sort: any;
    reverse: any;
    initializer: any;
} | undefined, i2: any): {
    initializer: any;
};
export function filter(value: any, options: any): {
    transform: any;
    sort?: any;
} | {
    initializer: any;
};
export function reverse(options: any): {
    sort: null;
    transform: any;
} | {
    sort: null;
    initializer: any;
};
export function shuffle({ seed, ...options }?: {
    seed: any;
}): {
    sort: null;
    transform: any;
} | {
    sort: null;
    initializer: any;
};
export function sort(value: any, options: any): {
    sort: null;
    transform: any;
} | {
    sort: null;
    initializer: any;
};
