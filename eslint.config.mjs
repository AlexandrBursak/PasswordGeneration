import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";

import layers from "./eslint.layers.mjs";

const config = [...nextVitals, ...nextTypeScript, ...layers];

export default config;
