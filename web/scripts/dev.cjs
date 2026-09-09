const { spawn, execFileSync } = require("node:child_process");
const path = require("node:path");

const viteCli = path.resolve(
  path.dirname(require.resolve("vite")),
  "../../bin/vite.js",
);
const viteArgs = [viteCli, "--host", "127.0.0.1", "--port", "5174"];
const vite = spawn(process.execPath, viteArgs, {
  stdio: "inherit",
  windowsHide: false,
});

let cleanedUp = false;

function cleanup() {
  if (cleanedUp || !vite.pid) return;
  cleanedUp = true;

  if (process.platform === "win32") {
    try {
      execFileSync("taskkill", ["/PID", String(vite.pid), "/T", "/F"], {
        stdio: "ignore",
      });
    } catch {
      // The child may already have exited.
    }
  } else {
    vite.kill("SIGTERM");
  }
}

process.once("SIGINT", () => {
  cleanup();
  process.exit(130);
});

process.once("SIGTERM", () => {
  cleanup();
  process.exit(143);
});

process.once("exit", cleanup);

vite.once("exit", (code, signal) => {
  cleanedUp = true;
  process.exit(signal ? 1 : code ?? 0);
});
