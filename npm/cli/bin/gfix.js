#!/usr/bin/env node
const { execFileSync } = require("node:child_process");

const PKG = {
  "darwin arm64": "gfix-darwin-arm64",
  "darwin x64":   "gfix-darwin-x64",
  "linux x64":    "gfix-linux-x64",
  "linux arm64":  "gfix-linux-arm64",
};
const key = `${process.platform} ${process.arch}`;
const pkg = PKG[key];
if (!pkg) {
  console.error(`gfix: unsupported platform ${key}. Supported: ${Object.keys(PKG).join(", ")}`);
  process.exit(1);
}
let binPath;
try {
  binPath = require.resolve(`${pkg}/bin/gfix`);
} catch {
  console.error(
    `gfix: platform package "${pkg}" is not installed.\n` +
    `If you used --no-optional or --ignore-scripts, reinstall with: npm install -g gfix`
  );
  process.exit(1);
}
try {
  execFileSync(binPath, process.argv.slice(2), { stdio: "inherit" });
} catch (e) {
  process.exit(typeof e.status === "number" ? e.status : 1);
}
