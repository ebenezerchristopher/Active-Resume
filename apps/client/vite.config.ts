/// <reference types='vitest' />
import { lingui } from "@lingui/vite-plugin";
import { defineConfig, searchForWorkspaceRoot } from "vite";
import react from "@vitejs/plugin-react";
import { nxViteTsPaths } from "@nx/vite/plugins/nx-tsconfig-paths.plugin";
import { nxCopyAssetsPlugin } from "@nx/vite/plugins/nx-copy-assets.plugin";

// used to keep the websocket alive when tunelling with ngrok
const HMR_HOST = process.env.HMR_HOST || "parchingly-unvitiating-jeanelle.ngrok-free.dev";

export default defineConfig(() => ({
  root: __dirname,
  cacheDir: "../../node_modules/.vite/client",
  define: {
    appVersion: JSON.stringify(process.env.npm_package_version),
  },
  server: {
    port: 4200,
    host: true,
    hmr: {
      host: HMR_HOST,
      protocol: "wss",
      overlay: false,
      clientPort: 443,
    },
    allowedHosts: ["parchingly-unvitiating-jeanelle.ngrok-free.dev"],
    cors: process.env.NODE_ENV === "development" ? true : { origin: false },
    proxy: {
      "/api": {
        target: "http://localhost:7000",
        secure: false,
        configure: (proxy, _options) => {
          proxy.on("proxyReq", (proxyReq, req, _res) => {
            console.log("Sending Request to Target:", req.method, req.url);
          });
          proxy.on("proxyRes", (proxyRes, req, _res) => {
            console.log("Received Response from Target:", proxyRes.statusCode, req.url);
          });
          proxy.on("error", (err, _req, _res) => {
            console.error("Proxy Error:", err);
          });
        },
      },
      "/artboard": {
        target: "http://localhost:6200",
        secure: false,
      },
    },
  },
  preview: {
    port: 4200,
    host: "localhost",
  },
  plugins: [
    react({
      babel: {
        plugins: ["macros"],
      },
    }),
    nxViteTsPaths(),
    lingui(),
    nxCopyAssetsPlugin(["*.md"]),
  ],
  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },
  build: {
    outDir: "../../dist/client",
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  test: {
    watch: false,
    globals: true,
    environment: "jsdom",
    include: ["{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    reporters: ["default"],
    coverage: {
      reportsDirectory: "../../coverage/client",
      provider: "v8" as const,
    },
  },
  resolve: {
    alias: {
      "@client/": `${searchForWorkspaceRoot(process.cwd())}/apps/client/src/`,
    },
  },
}));
