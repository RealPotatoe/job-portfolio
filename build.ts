import * as esbuild from "esbuild";

await esbuild.build({
    entryPoints: ["assets/js/main.ts"],
    outdir: "assets/js/dist",
    bundle: false,
    format: "esm",
    target: ["es2020"],
});

esbuild.stop();
console.log("Build complete!");
