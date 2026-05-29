#!/usr/bin/env node
/**
 * prepare-packages.mjs
 *
 * Stamps the correct version into all npm package.json files and stages the
 * extracted platform binaries into npm/platforms/<plat>/bin/gfix.
 *
 * Required env:
 *   NPM_VERSION   Version string WITHOUT leading "v"  e.g. "0.1.0-alpha.3"
 *
 * Optional env / args:
 *   TARBALLS_DIR  Directory containing the downloaded .tar.gz files.
 *                 Defaults to "dist" relative to the repo root.
 *                 Can also be passed as the first CLI argument.
 *
 * Tarball naming convention (produced by release.yml):
 *   gfix-v<NPM_VERSION>-<RUST_TRIPLE>.tar.gz
 *   e.g. gfix-v0.1.0-alpha.3-aarch64-apple-darwin.tar.gz
 *
 * Usage:
 *   NPM_VERSION=0.1.0-alpha.3 node npm/scripts/prepare-packages.mjs [tarballs-dir]
 */

import { execSync } from "node:child_process";
import { existsSync, mkdirSync, chmodSync, renameSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "../..");
const npmRoot = path.resolve(__dirname, "..");

const NPM_VERSION = process.env.NPM_VERSION;
if (!NPM_VERSION) {
  console.error("Error: NPM_VERSION env var is required (e.g. 0.1.0-alpha.3)");
  process.exit(1);
}

const tarballsDir = process.argv[2] || process.env.TARBALLS_DIR || path.join(repoRoot, "dist");

// Platform map: npm platform dir -> Rust triple
const PLATFORMS = {
  "darwin-arm64": "aarch64-apple-darwin",
  "darwin-x64":   "x86_64-apple-darwin",
  "linux-x64":    "x86_64-unknown-linux-gnu",
  "linux-arm64":  "aarch64-unknown-linux-gnu",
};

async function setVersion(pkgPath, version, optionalDeps) {
  const raw = await readFile(pkgPath, "utf8");
  const pkg = JSON.parse(raw);
  pkg.version = version;
  if (optionalDeps) {
    for (const dep of optionalDeps) {
      pkg.optionalDependencies[dep] = version;
    }
  }
  await writeFile(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
  console.log(`  versioned: ${pkgPath}`);
}

async function extractBinary(platform, triple) {
  const tarball = path.join(tarballsDir, `gfix-v${NPM_VERSION}-${triple}.tar.gz`);
  if (!existsSync(tarball)) {
    console.error(`Error: tarball not found: ${tarball}`);
    process.exit(1);
  }

  const platformDir = path.join(npmRoot, "platforms", platform);
  const binDir = path.join(platformDir, "bin");
  mkdirSync(binDir, { recursive: true });

  // Extract into a temp subdir to avoid collisions when running in parallel
  const tmpDir = path.join(binDir, ".tmp-extract");
  mkdirSync(tmpDir, { recursive: true });

  execSync(`tar -xzf "${tarball}" -C "${tmpDir}"`, { stdio: "inherit" });

  const extracted = path.join(tmpDir, "gfix");
  const dest = path.join(binDir, "gfix");

  if (!existsSync(extracted)) {
    console.error(`Error: expected 'gfix' at archive root in ${tarball}`);
    process.exit(1);
  }

  renameSync(extracted, dest);
  chmodSync(dest, 0o755);

  // Clean up temp dir
  execSync(`rm -rf "${tmpDir}"`);

  console.log(`  staged:    ${dest}`);
}

async function main() {
  console.log(`Preparing npm packages for version ${NPM_VERSION}`);
  console.log(`Tarballs dir: ${tarballsDir}`);

  // Version the main CLI package and rewrite its optionalDependencies
  const cliPkgPath = path.join(npmRoot, "cli", "package.json");
  const optDeps = Object.keys(PLATFORMS).map((p) => `gfix-${p}`);
  await setVersion(cliPkgPath, NPM_VERSION, optDeps);

  // Version + stage each platform package
  for (const [platform, triple] of Object.entries(PLATFORMS)) {
    const pkgPath = path.join(npmRoot, "platforms", platform, "package.json");
    await setVersion(pkgPath, NPM_VERSION, null);
    await extractBinary(platform, triple);
  }

  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
