// tsconfig-paths-bootstrap.js
import "tsconfig-paths/register.js";
import { createRequire } from "module";
const require = createRequire(import.meta.url);

require("ts-node").register({
  transpileOnly: true,
  project: "./tsconfig.json",
  loader: "ts-node/esm",
});
