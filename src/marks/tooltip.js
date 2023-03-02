import {pointer, select} from "d3";
import {Mark} from "../mark.js";
import {maybeFrameAnchor, maybeTuple} from "../options.js";

export class Tooltip extends Mark {
  constructor(data, options = {}) {
    const {x, y, maxRadius = 40, frameAnchor} = options;
    super(
      data,
      {
        x: {value: x, scale: "x", optional: true},
        y: {value: y, scale: "y", optional: true}
      },
      options
    );
    this.frameAnchor = maybeFrameAnchor(frameAnchor);
    this.indexesBySvg = new WeakMap();
    this.maxRadius = +maxRadius;
  }
  render(index, scales, {x: X, y: Y, fx: FX, fy: FY}, dimensions, context) {
    // TODO
    // - ✅ Get local coordinates of the pointer
    // - ✅ Register one pointermove listener per plot
    // - ✅ Find the closest point in screen (scaled) coordinates
    // - ✅ Find the closest point across all facets
    // - ✅ Limit the search radius
    // - ✅ Suppress the tooltip on pointerdown
    // - Handle multiple dots in the same position (e.g., click to cycle)?
    // - Handle x or y not existing; respect frameAnchor
    // - Handle fx or fy not existing (for the entire plot)
    // - Handle faceting being disabled for this mark (facet: null)
    // - Display the unscaled values in a tooltip
    // - Remove the red dot for testing purposes
    const {maxRadius} = this;
    const {marginLeft, marginTop} = dimensions;
    const svg = context.ownerSVGElement;
    let indexes = this.indexesBySvg.get(svg);
    if (indexes) return void indexes.push(index);
    this.indexesBySvg.set(svg, (indexes = [index]));
    const dot = select(svg)
      .on("pointermove", (event) => {
        let i, xi, yi;
        if (event.buttons === 0) {
          const [xp, yp] = pointer(event);
          let ri = maxRadius * maxRadius;
          for (const index of indexes) {
            for (const j of index) {
              const xj = FX[j] + X[j] - marginLeft;
              const yj = FY[j] + Y[j] - marginTop;
              const dx = xj - xp;
              const dy = yj - yp;
              const rj = dx * dx + dy * dy;
              if (rj <= ri) (i = j), (ri = rj), (xi = xj), (yi = yj);
            }
          }
        }
        if (i === undefined) {
          dot.attr("display", "none");
        } else {
          dot.attr("display", "inline");
          dot.attr("cx", xi);
          dot.attr("cy", yi);
        }
      })
      .on("pointerdown pointerleave", () => dot.attr("display", "none"))
      .append("circle")
      .attr("display", "none")
      .attr("r", 4.5)
      .attr("stroke", "red")
      .attr("fill", "none")
      .attr("stroke-width", 1.5);
    return null;
  }
}

/** @jsdoc tooltip */
export function tooltip(data, options = {}) {
  let {x, y, ...remainingOptions} = options;
  if (options.frameAnchor === undefined) [x, y] = maybeTuple(x, y);
  return new Tooltip(data, {...remainingOptions, x, y});
}
