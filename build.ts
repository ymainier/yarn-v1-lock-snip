import { build } from "esbuild";

await build({
  entryPoints: ["src/index.ts"],
  bundle: true,
  minify: true,
  platform: "node",
  format: "esm",
  outfile: "dist/index.mjs",
  banner: { js: "#!/usr/bin/env node" },
});
