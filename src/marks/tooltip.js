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
  render(index, {x, y, fx, fy}, {x: X, y: Y, raw}, dimensions, context) {
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
        let i, xi, yi, fxi, fyi;
        if (event.buttons === 0) {
          const [xp, yp] = pointer(event);
          let ri = maxRadius * maxRadius;
          for (const index of indexes) {
            const fxj = index.fx;
            const fyj = index.fy;
            const oxj = fx(fxj) - marginLeft;
            const oyj = fy(fyj) - marginTop;
            for (const j of index) {
              const xj = X[j] + oxj;
              const yj = Y[j] + oyj;
              const dx = xj - xp;
              const dy = yj - yp;
              const rj = dx * dx + dy * dy;
              if (rj <= ri) (i = j), (ri = rj), (xi = xj), (yi = yj), (fxi = fxj), (fyi = fyj);
            }
          }
        }
        if (i === undefined) {
          dot.attr("display", "none");
        } else {
          dot.attr("display", "inline");
          dot.attr("transform", `translate(${xi},${yi})`);
          title.text(
            [
              `${x.label ?? "x"} = ${raw.x[i]}`,
              `${y.label ?? "y"} = ${raw.y[i]}`,
              `${fx.label ?? "fx"} = ${fxi}`,
              `${fy.label ?? "fy"} = ${fyi}`
            ].join("\n")
          );
        }
      })
      .on("pointerdown pointerleave", () => dot.attr("display", "none"))
      .append("g")
      .attr("display", "none")
      .attr("pointer-events", "all")
      .attr("fill", "none")
      .call((g) => g.append("circle").attr("r", maxRadius).attr("fill", "none"))
      .call((g) => g.append("circle").attr("r", 4.5).attr("stroke", "red").attr("stroke-width", 1.5));
    const title = dot.append("title");
    return null;
  }
}

/** @jsdoc tooltip */
export function tooltip(data, options = {}) {
  let {x, y, ...remainingOptions} = options;
  if (options.frameAnchor === undefined) [x, y] = maybeTuple(x, y);
  return new Tooltip(data, {...remainingOptions, x, y});
}
