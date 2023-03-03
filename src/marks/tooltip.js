import {pointer, select} from "d3";
import {Mark} from "../mark.js";
import {maybeFrameAnchor, maybeTuple} from "../options.js";
import {applyFrameAnchor} from "../style.js";

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
  render(index, {x, y, fx, fy}, {x: X, y: Y, raw: {x: RX, y: RY}}, dimensions, context) {
    // TODO
    // - ✅ Get local coordinates of the pointer
    // - ✅ Register one pointermove listener per plot
    // - ✅ Find the closest point in screen (scaled) coordinates
    // - ✅ Find the closest point across all facets
    // - ✅ Limit the search radius
    // - ✅ Suppress the tooltip on pointerdown
    // - ✅ Display unscaled values in a tooltip
    // - ✅ Handle x or y not existing; respect frameAnchor
    // - ✅ Handle fx or fy not existing (for the entire plot)
    // - Handle faceting being disabled for this mark (facet: null)
    // - [nice to have] Handle multiple dots in the same position (e.g., click to cycle)?
    // - Remove the red dot for testing purposes
    const [cx, cy] = applyFrameAnchor(this, dimensions);
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
            const oxj = fx ? fx(fxj) - marginLeft : 0;
            const oyj = fy ? fy(fyj) - marginTop : 0;
            for (const j of index) {
              const xj = (X ? X[j] : cx) + oxj;
              const yj = (Y ? Y[j] : cy) + oyj;
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
          const text = [];
          if (x) text.push(`${x.label ?? "x"} = ${RX[i]}`);
          if (y) text.push(`${y.label ?? "y"} = ${RY[i]}`);
          if (fx) text.push(`${fx.label ?? "fx"} = ${fxi}`);
          if (fy) text.push(`${fy.label ?? "fy"} = ${fyi}`);
          title.text(text.join("\n"));
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
