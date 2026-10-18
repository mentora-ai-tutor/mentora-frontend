import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    resolveAlias: {
      // y-monaco@0.1.6 imports the pre-0.53 Monaco ESM path directly, but
      // monaco-editor@0.56 restricts subpaths via its "exports" map. Point it
      // at the matching supported subpath.
      "monaco-editor/esm/vs/editor/editor.api.js": "monaco-editor/editor/editor.api.js",
    },
  },
};

export default nextConfig;
