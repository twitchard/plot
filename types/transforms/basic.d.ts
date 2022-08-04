/**
 * Given an *options* object that may specify some basic transforms (*filter*, *sort*, or *reverse*) or a custom *transform* function, composes those transforms if any with the given *transform* function, returning a new *options* object. If a custom *transform* function is present on the given *options*, any basic transforms are ignored. Any additional input *options* are passed through in the returned *options* object. This method facilitates applying the basic transforms prior to applying the given custom *transform* and is used internally by Plot’s built-in transforms.
 */
export function basic(options: {} | undefined, transform: any): {
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
