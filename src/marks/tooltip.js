import {least, pointer, select} from "d3";
import {Mark} from "../mark.js";
import {maybeFrameAnchor, maybeTuple} from "../options.js";

export class Tooltip extends Mark {
  constructor(data, options = {}) {
    const {x, y, frameAnchor} = options;
    super(
      data,
      {
        x: {value: x, scale: "x", optional: true},
        y: {value: y, scale: "y", optional: true}
      },
      options
    );
    this.frameAnchor = maybeFrameAnchor(frameAnchor);
    this.indexBySvg = new WeakMap();
  }
  render(index, scales, {x: X, y: Y, fx: FX, fy: FY}, dimensions, context) {
    // TODO
    // - ✅ Use d3.pointer to get local coordinates?
    // - ✅ Look up the closest point in screen (scaled) coordinates?
    // - ✅ Determine the closest point across facets?
    // - Handle multiple dots in the same position (e.g., click to cycle)?
    // - Maybe invert the screen coordinates to abstract coordinates? (probably no)
    // - Only register one pointermove listener per plot (rather than per facet)?
    // - Handle x or y not existing; respect frameAnchor
    // - Handle fx or fy not existing (for the entire plot)
    // - Handle faceting being disabled for this mark (facet: null)
    const {marginLeft, marginTop} = dimensions;
    const svg = context.ownerSVGElement;
    let flatIndex = this.indexBySvg.get(svg);
    if (flatIndex) return void flatIndex.push(...index); // TODO faster?
    flatIndex = Array.from(index); // TODO faster?
    this.indexBySvg.set(svg, flatIndex);
    const dot = select(svg)
      .on("pointermove", (event) => {
        const [x, y] = pointer(event);
        const i = least(flatIndex, (i) => Math.hypot(FX[i] + X[i] - marginLeft - x, FY[i] + Y[i] - y - marginTop));
        dot
          .attr("r", 4.5)
          .attr("cx", FX[i] + X[i] - marginLeft)
          .attr("cy", FY[i] + Y[i] - marginTop);
      })
      .on("pointerleave", () => dot.attr("r", 0))
      .append("circle")
      .attr("r", 0)
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
