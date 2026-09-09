import { defineConfig } from "@playwright/test";
const webServer = process.env.PLAYWRIGHT_EXTERNAL_SERVER ? undefined : { command: "node ../node_modules/vite/bin/vite.js --host 127.0.0.1 --port 5174", cwd: "web", url: "http://127.0.0.1:5174", reuseExistingServer: true, timeout: 30_000 };
export default defineConfig({ testDir: "./e2e", use: { baseURL: "http://127.0.0.1:5174", trace: "retain-on-failure" }, webServer });
