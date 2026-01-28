# Binary Download Quick Start

## For Extension Users

**Good news**: You don't need to do anything! The extension comes with pre-compiled binaries for all analysis tools bundled inside.

When you install CodeMore, you get:
- ✅ Semgrep (security scanning)
- ✅ Biome (JS/TS linting)
- ✅ Ruff (Python linting)
- ✅ TFLint (Terraform linting)

**Zero configuration. Zero installation. It just works.**

## For Extension Developers

### First Time Setup

After cloning the repository:

```bash
# Install dependencies
npm install

# This creates directory structure (binaries not downloaded yet)
# Download happens automatically before packaging
```

### Downloading Binaries

Binaries are automatically downloaded when you:

```bash
# Package the extension
npm run vsce:package

# Or manually download
npm run download-binaries
```

### Development Workflow

1. **During Development**: 
   - Binaries are not required for compilation
   - The extension will use system-installed tools if available
   - Or fall back to built-in static analysis

2. **Before Publishing**:
   - Run `npm run vsce:package` to download and bundle binaries
   - This ensures users get a complete, zero-install experience

### Directory Structure

```
bin/
├── darwin-arm64/    # macOS Apple Silicon binaries
│   ├── semgrep
│   ├── biome
│   ├── ruff
│   └── tflint
├── darwin-x64/      # macOS Intel binaries
├── linux-x64/       # Linux binaries
└── win32-x64/       # Windows binaries
```

### Updating Tool Versions

To update to newer versions:

1. Edit `scripts/download-binaries.js`
2. Update version numbers in the TOOLS configuration
3. Update download URLs from GitHub releases
4. Test: `npm run download-binaries`
5. Package: `npm run vsce:package`

## Architecture Benefits

### Why Bundle Binaries?

1. **Zero Install Experience**: Users install extension → immediately get all features
2. **Consistent Behavior**: Same tool versions across all installations
3. **Offline Support**: Works without internet connection after initial install
4. **Performance**: Native binaries = instant analysis (no Node.js overhead)

### Fallback Strategy

The extension is smart about finding tools:

1. **First**: Use bundled binaries (in extension's bin/ folder)
2. **Second**: Check system PATH for installed tools
3. **Third**: Use built-in TypeScript-based static analysis

This ensures the extension always works, even if:
- Binary download fails
- User has tools installed globally
- Platform isn't supported

## Technical Details

### Download Script

The `scripts/download-binaries.js` script:
- Downloads from official GitHub releases
- Supports all platforms (macOS, Linux, Windows)
- Extracts archives (zip, tar.gz)
- Sets executable permissions
- Cleans up temporary files

### Size Considerations

Total binary size: ~200-300 MB (across all platforms)

Per-platform size:
- Semgrep: ~80-100 MB
- Biome: ~20 MB
- Ruff: ~15 MB
- TFLint: ~20 MB

The extension only includes binaries for all platforms, but only loads the one matching the user's OS at runtime.

### Security

All binaries are:
- Downloaded from official GitHub releases
- Verified by GitHub's infrastructure
- From reputable, widely-used open-source projects
- Updatable by the extension maintainer

## Troubleshooting

### "Binary not found" errors

```bash
# Re-download binaries
npm run download-binaries

# Check permissions
chmod +x bin/darwin-arm64/*  # or your platform
```

### Download failures

- Check internet connection
- Verify URLs in `scripts/download-binaries.js` are current
- GitHub releases pages may have moved URLs

### Testing Without Binaries

The extension works without binaries:

```bash
# Compile without downloading
npm run compile

# Extension uses system tools or built-in analysis
```

## License Compliance

Each bundled tool has its own license:
- Semgrep: LGPL 2.1
- Biome: MIT
- Ruff: MIT  
- TFLint: MPL 2.0

See `bin/README.md` for full license details and links.
