# CodeMore

**Developer-Centric Code Intelligence Tool** - A VS Code extension that provides AI-powered code quality analysis, intelligent suggestions, and automated refactoring.

## Features

- 🔍 **Real-time Code Analysis** - Automatic detection of bugs, code smells, performance issues, and security vulnerabilities.
- 🤖 **Targeted AI Suggestions** - On-demand, context-aware fixes for specific issues.
- ⚡ **Local-First Architecture** - Most analysis happens locally on your machine for maximum speed and privacy.
- 📊 **Code Quality Dashboard** - Visual health metrics and issue tracking.
- 🛠️ **Zero-Friction Setup** - Comes with industry-standard tools pre-bundled (Biome, Ruff, Semgrep).

---

## How It Works

CodeMore uses a **multi-layered analysis pipeline** to provide immediate feedback while keeping your code secure.

### Layer 1: Fast Local Analysis (No Data Sent Out)
When you open a file or save changes, CodeMore runs high-performance local tools:
1.  **External Tools**: We bundle optimized binaries for industry-standard tools:
    *   **Biome**: Ultra-fast linter/formatter for JavaScript/TypeScript.
    *   **Ruff**: Lightning-fast Python linter.
    *   **Semgrep**: Static analysis for security vulnerabilities (SAST) supporting 30+ languages.
    *   **TFLint/Checkov**: Infrastructure-as-Code analysis.
2.  **Built-in Static Analysis**: Our custom engine analyzes TypeScript ASTs for complexity and structural issues.

**✅ Privacy Note:** layers 1 & 2 run entirely on your local machine. No code leaves your computer.

### Layer 2: Targeted AI Analysis (On-Demand)
AI is used **only when you request it**. We believe in keeping costs low and privacy high.

*   **Trigger**: You select a specific issue in the dashboard and click **"Generate AI Fix"**.
*   **What happens**: 
    1.  CodeMore gathers code context around the issue.
    2.  It identifies related files (imports, dependencies) to give the AI proper context.
    3.  This **focused context** is sent to the configured AI provider (e.g., Gemini).
    4.  The AI returns tailored fix suggestions.

**✅ Privacy Note:** Your code is only sent to the AI provider when you explicitly request a fix for a specific issue.

---

## Privacy & Data Usage

We take your code privacy seriously. Here is exactly how data is handled:

| Data Type | Handling | Location |
| :--- | :--- | :--- |
| **Source Code** | Analyzed locally by default. Sent to AI provider **only** during "Generate AI Fix". | Local Machine (unless AI invoked) |
| **Analysis Results** | Stored in memory / local workspace storage. | Local Machine |
| **AI Prompts** | Sent to your configured provider (e.g., Google Gemini) via HTTPS. | External (AI Provider) |
| **API Keys** | Stored securely in VS Code's Secret Storage. | Local Machine |

**We do not collect or store your source code on our servers.**

---

## Getting Started

### Installation

1.  **Install the Extension**: Install CodeMore from the VS Code Marketplace.
2.  **Zero Setup**: The extension comes with all necessary analysis tools pre-packaged. It works out of the box for JS/TS, Python, and more.
3.  **Configure AI (Optional)**: To enable AI fix generation:
    *   Open VS Code Settings.
    *   Search for `codemore.aiProvider` and select your provider (e.g., `gemini`).
    *   Enter your API Key in `codemore.apiKey`.

### Building from Source

If you are a developer contributing to CodeMore:

1.  Clone the repository:
    ```bash
    git clone https://github.com/codemore/codemore-vscode.git
    cd codemore-vscode
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  **Binaries**: 
    *   For local dev, the extension will use system-installed tools (like `ruff` or `biome`) if available.
    *   To simulate the user experience, download the bundled binaries:
        ```bash
        npm run download-binaries
        ```
4.  Build and Run:
    ```bash
    npm run compile
    # Press F5 to launch the Extension Host
    ```

---

## Architecture

CodeMore uses a daemon architecture to keep the VS Code UI fast and responsive.

```
┌─────────────────┐       IPC        ┌──────────────────────┐
│  VS Code Ext    │◄────────────────►│    Context Daemon    │
│  (UI Thread)    │                  │      (Node.js)       │
└────────┬────────┘                  └──────────┬───────────┘
         │                                      │
         │                         ┌────────────┼─────────────┐
         ▼                         │            │             │
┌─────────────────┐          ┌─────▼──────┐ ┌───▼────┐  ┌─────▼─────┐
│   Webview UI    │          │ Ext. Tools │ │ AI Svc │  │ Analysis  │
│     (React)     │          │ (Binaries) │ │ (HTTP) │  │  Queue    │
└─────────────────┘          └────────────┘ └────────┘  └───────────┘
```

*   **Extension Host**: Handles UI, commands, and file events.
*   **Context Daemon**: A separate Node.js process that runs analysis tools and manages the AI service. This prevents heavy analysis from freezing your editor.
