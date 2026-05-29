# gfix

AI-powered merge conflict resolver.

## Install

```sh
npm install -g @gitfix/cli@alpha
```

The installed command is `gfix`. Requires Node.js 18 or later. Supports macOS (arm64, x64) and Linux (x64, arm64).

Note: while in alpha the package publishes under the `alpha` dist-tag, so use `@gitfix/cli@alpha` to get the latest release.

## Usage

```sh
# Resolve conflicts in the current git repository
gfix resolve

# Show version
gfix --version

# Show help
gfix --help
```

## How it works

The `@gitfix/cli` npm package is a thin wrapper. On install, npm selects and downloads
the correct prebuilt native binary for your platform via an `optionalDependency`.
No compilation, no postinstall scripts, no network traffic at runtime.

The four platform packages (`gfix-darwin-arm64`, `gfix-darwin-x64`, `gfix-linux-x64`,
`gfix-linux-arm64`) remain unscoped and are listed as `optionalDependencies`.

## License

See [LICENSE.txt](https://github.com/ameyypawar/gfix/blob/main/LICENSE.txt).
