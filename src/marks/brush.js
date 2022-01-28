import {brush as brusher, brushX as brusherX, brushY as brusherY, create} from "d3";
import {identity, maybeTuple} from "../options.js";
import {Mark} from "../plot.js";

// TODO Allow brush styling?
// TODO Disable standard mark channels (e.g., href, title)?
const defaults = {
  fill: null,
  stroke: null
};

// TODO Initial selection?
// TODO Insets?
// TODO Option to select nothing (not everything) when brush is cleared?
// TODO For band scales, select when the brand overlaps the brush.
export class Brush extends Mark {
  constructor(data, {x, y, ...options} = {}) {
    super(
      data,
      [
        {name: "x", value: x, scale: "x", optional: true},
        {name: "y", value: y, scale: "y", optional: true}
      ],
      options,
      defaults
    );
    this.faceted = [];
    this.clears = [];
  }
  render(index, scales, {x: X, y: Y}, dimensions) {
    const {marginLeft, width, marginRight, marginTop, height, marginBottom} = dimensions;
    const left = marginLeft;
    const top = marginTop;
    const right = width - marginRight;
    const bottom = height - marginBottom;
    const {faceted, clears} = this;
    const f = faceted.push(index) - 1;
    const brush = (X && Y ? brusher : X ? brusherX : brusherY)()
    .extent([[left, top], [right, bottom]])
    .on("start brush end", function({selection, sourceEvent, type}) {
      if (!sourceEvent) return; // cleared by a brush in a sister facet
      let S = index;
      if (selection) {
        if (X) {
          const [x0, x1] = Y ? [selection[0][0], selection[1][0]] : selection;
          S = S.filter(i => x0 <= X[i] && X[i] <= x1);
        }
        if (Y) {
          const [y0, y1] = X ? [selection[0][1], selection[1][1]] : selection;
          S = S.filter(i => y0 <= Y[i] && Y[i] <= y1);
        }
        this.selection = S;
      } else {
        this.selection = faceted.flat();
      }
      if (type === "start") {
        for (let i = 0; i < clears.length; i++) if (i !== f) clears[i]();
      }
      this.dispatchEvent(new Event("input", {bubbles: true}));
    });
    const g = create("svg:g")
        .call(brush)
        .property("selection", index);
    clears.push(() => g.call(brush.clear));
    return g.node();
  }
}

export function brush(data, {x, y, ...options} = {}) {
  ([x, y] = maybeTuple(x, y));
  return new Brush(data, {...options, x, y});
}

export function brushX(data, {x = identity, ...options} = {}) {
  return new Brush(data, {...options, x, y: null});
}

export function brushY(data, {y = identity, ...options} = {}) {
  return new Brush(data, {...options, x: null, y});
}
