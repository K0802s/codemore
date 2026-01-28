# CodeMore

**Developer-Centric Code Intelligence Tool** - A VS Code extension that provides AI-powered code quality analysis, intelligent suggestions, and automated refactoring.

## Features

- 🔍 **Real-time Code Analysis** - Automatic detection of bugs, code smells, performance issues, and security vulnerabilities
- 🤖 **AI-Powered Suggestions** - Intelligent refactoring suggestions with contextual awareness
- 📊 **Code Quality Dashboard** - Visual health metrics and issue tracking
- ⚡ **Zero-Friction Experience** - One-click installation with automatic background analysis
- 🔄 **Incremental Updates** - Only analyzes changed files for fast performance

## Architecture

```
┌─────────────────┐     ┌─────────────────────┐
│  Extension Host │◄───►│  Context Daemon     │
│  (TypeScript)   │ IPC │  (Node.js)          │
└────────┬────────┘     └──────────┬──────────┘
         │                         │
         │                         ├── AST Parser
         ▼                         ├── Context Map
┌─────────────────┐               ├── AI Service
│  Webview UI     │               └── Analysis Queue
│  (React)        │
└─────────────────┘
```

## Getting Started

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/codemore/codemore-vscode.git
   cd codemore-vscode
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the extension:
   ```bash
   npm run compile
   ```

4. Press F5 in VS Code to launch the Extension Development Host

### Configuration

Configure CodeMore via VS Code settings:

| Setting | Default | Description |
|---------|---------|-------------|
| `codemore.aiProvider` | `openai` | AI provider (openai, anthropic, local) |
| `codemore.apiKey` | `""` | API key for AI provider |
| `codemore.autoAnalyze` | `true` | Auto-analyze on file save |
| `codemore.analysisDelay` | `2000` | Debounce delay in ms |
| `codemore.excludePatterns` | `[...]` | Glob patterns to exclude |
| `codemore.maxFileSizeKB` | `500` | Max file size to analyze |

Install CMD - code --install-extension c:\Code\codemore\codemore-1.0.0.vsix

## Commands

| Command | Keybinding | Description |
|---------|------------|-------------|
| `CodeMore: Open Dashboard` | `Ctrl+Shift+Q` | Open the Code Quality Dashboard |
| `CodeMore: Analyze Workspace` | - | Analyze all files in workspace |
| `CodeMore: Analyze Current File` | `Ctrl+Shift+A` | Analyze the active file |
| `CodeMore: Restart Daemon` | - | Restart the background daemon |
| `CodeMore: Show Logs` | - | Open the output channel |

## Development

### Project Structure

```
codemore/
├── src/                    # Extension Host
│   ├── extension.ts        # Entry point
│   ├── daemon/             # Daemon manager
│   ├── rpc/                # JSON-RPC client
│   └── providers/          # Webview provider
├── daemon/                 # Background Daemon
│   ├── index.ts            # Daemon entry
│   └── services/           # Analysis services
├── shared/                 # Shared types
│   └── protocol.ts         # JSON-RPC protocol
├── webview/                # React UI
│   ├── App.tsx             # Main app
│   └── components/         # UI components
└── test/                   # Tests
```

### Building

```bash
# Full build
npm run compile

# Watch mode
npm run watch

# Package VSIX
npm run vsce:package
```

### Testing

```bash
# Run tests
npm test

# Run unit tests only
npm run test:unit
```

## License

MIT License - see LICENSE file for details.
