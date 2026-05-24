# gfix

The cross-agent, MCP-native merge resolver. Binary releases live here.

> **Source code is private.** This repo distributes signed binaries and the EULA. The product is the binary. Docs live at <https://github.com/ameyypawar/gitfix-docs>.

## Install

### Homebrew (macOS, Linux)

```sh
brew tap ameyypawar/gfix
brew install gfix
```

### Curl (macOS, Linux)

```sh
curl -fsSL https://gitfix.pro/install | sh
```

### npm wrapper (any Node-equipped machine)

```sh
npm install -g @gitfix/cli
```

All three install paths land the same binary. Pick whichever fits your setup.

## Verify

```sh
gfix --version
```

Then wire into Claude Code:

```sh
claude mcp add --scope user gfix /usr/local/bin/gfix mcp
```

Setup guide: <https://github.com/ameyypawar/gitfix-docs/blob/main/setup.md>

## What is this repo?

This repo is the public distribution surface for `gfix`. The binaries you download via `brew`, `curl`, or `npm` are attached to releases on this repo's [Releases page](https://github.com/ameyypawar/gfix/releases). The **source code is private** -- Amey runs gfix as a closed-source product during alpha. Pricing is free during alpha; a pricing decision lands at v1.0.

Why the split? `gfix` is a four-character indie product with one developer. Hosting binaries publicly while keeping source private is the cheapest way to ship to actual humans without inviting fork-and-flip risk during the brand-formation window. The 5-line EULA in `LICENSE.txt` lets you install on as many machines as you want and use commercially; you just cannot redistribute the binary or reverse-engineer it.

## What is in a release

Each release attaches four tarballs and a SHA256 manifest:

- `gfix-<version>-aarch64-apple-darwin.tar.gz` -- macOS Apple Silicon
- `gfix-<version>-x86_64-apple-darwin.tar.gz` -- macOS Intel
- `gfix-<version>-x86_64-unknown-linux-gnu.tar.gz` -- Linux x86_64
- `gfix-<version>-aarch64-unknown-linux-gnu.tar.gz` -- Linux arm64
- `SHA256SUMS.txt` -- checksums for all four archives

The curl installer and the Homebrew formula both verify against `SHA256SUMS.txt` before installing.

## Reporting bugs

File an issue here. Setup friction, install bugs, "it crashed" -- all welcome. We cannot share source code in repro discussions, so be specific about command + output + OS + version.

For docs typos and content fixes, file on [gitfix-docs](https://github.com/ameyypawar/gitfix-docs/issues) instead.

## License

Proprietary. See [LICENSE.txt](LICENSE.txt). 5 lines, plain English.

## macOS first-run note

The alpha.1 binaries are **unsigned** (Apple Developer ID code signing is on the v1.0 roadmap). On macOS the first launch may show "gfix cannot be opened because it is from an unidentified developer." Workaround:

```sh
xattr -d com.apple.quarantine /usr/local/bin/gfix
```

Then `gfix --version` works. The setup guide walks this in more detail.

