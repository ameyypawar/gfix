# gfix

AI-powered merge conflict resolver.

## Install

```sh
npm install -g gfix
```

Requires Node.js 18 or later. Supports macOS (arm64, x64) and Linux (x64, arm64).

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

The `gfix` npm package is a thin wrapper. On install, npm selects and downloads
the correct prebuilt native binary for your platform via an `optionalDependency`.
No compilation, no postinstall scripts, no network traffic at runtime.

## License

See [LICENSE.txt](https://github.com/ameyypawar/gfix/blob/main/LICENSE.txt).
