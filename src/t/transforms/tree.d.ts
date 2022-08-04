export function treeNode({ path, delimiter, frameAnchor, treeLayout, treeSort, treeSeparation, treeAnchor, ...options }?: {
    path?: {
        transform: (d: any) => any;
    } | undefined;
    delimiter: any;
    frameAnchor: any;
    treeLayout?: typeof tree | undefined;
    treeSort: any;
    treeSeparation: any;
    treeAnchor: any;
}): any;
export function treeLink({ path, delimiter, curve, stroke, strokeWidth, strokeOpacity, treeLayout, treeSort, treeSeparation, treeAnchor, ...options }?: {
    path?: {
        transform: (d: any) => any;
    } | undefined;
    delimiter: any;
    curve?: string | undefined;
    stroke?: string | undefined;
    strokeWidth?: number | undefined;
    strokeOpacity?: number | undefined;
    treeLayout?: typeof tree | undefined;
    treeSort: any;
    treeSeparation: any;
    treeAnchor: any;
}): any;
export function maybeTreeAnchor(anchor?: string): {
    frameAnchor: string;
    dx: number;
    position({ x, y }: {
        x: any;
        y: any;
    }, i: any, X: any, Y: any): void;
};
import { tree } from "d3-hierarchy";
