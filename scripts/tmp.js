import glob from "glob";
import path from "path";

const decs = glob.sync(`${path.resolve("./types")}/**/*.d.ts`);

for (const dec of decs) {
  const name = "plot" + path.basename(dec, "d.ts").split(".").map(cap).join("");

  console.log(`import ${name} from "${dec.replace("/Users/duane/Development", "")}";`);
}
for (const dec of decs) {
  const name = "plot" + path.basename(dec, "d.ts").split(".").map(cap).join("");

  console.log(`fsMap.set("${dec.replace("/Users/duane/Development/plot/types", "/plot")}", ${name});`);
}

function cap(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
