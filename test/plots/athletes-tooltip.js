import * as Plot from "@observablehq/plot";
import * as d3 from "d3";

export async function athletesTooltip() {
  const athletes = await d3.csv("data/athletes.csv", d3.autoType);
  const decade = (d) => `${Math.floor(d.date_of_birth.getUTCFullYear() / 10) * 10}`;
  return Plot.plot({
    grid: true,
    marks: [
      Plot.dot(athletes, {x: "weight", y: "height", fx: "sex", fy: decade}),
      Plot.tooltip(athletes, {x: "weight", y: "height", fx: "sex", fy: decade})
    ]
  });
}
