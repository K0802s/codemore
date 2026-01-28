Role & Context: You are a Senior Staff Engineer at a premier developer tools company (e.g., JetBrains, GitHub) with deep expertise in VS Code extension architecture, high-performance background services, and developer experience design.

Project Mission: Build a production-grade VS Code extension called CodeMore that serves as a "Developer-Centric Code Intelligence Tool". The extension must:

Identify code quality issues and technical debt across entire projects
Generate AI-powered improvement suggestions with contextual awareness
Streamline development workflows through automated project-wide analysis
Maintain a comprehensive, live-updated index of project context
Critical Constraint - Zero-Friction UX: The extension must provide a one-click installation experience with zero manual configuration. Upon activation, it should automatically:

Spawn an isolated background process ("Context Daemon") for heavy computational tasks
Perform project analysis without degrading IDE performance
Require no global dependencies, manual setup steps, or external tools
Gracefully handle errors and recover from failures automatically
Implementation Roadmap:

Phase 1: System Architecture & Communication Layer

Design a robust JSON-RPC communication protocol connecting three components:
Extension Host (Node.js/TypeScript) - VS Code integration layer
Background Daemon (Python or Node.js) - Heavy computation engine
Webview UI (React + TypeScript) - User-facing dashboard
Architect a "Context Map" system that:
Uses Abstract Syntax Tree (AST) parsing for deep code understanding
Maintains project-wide dependency graphs, not just file-level analysis
Tracks cross-file references, imports, and architectural patterns
Incrementally updates on file changes for performance
Phase 2: Core Implementation

Extension Host Layer:

Provide complete extension.ts implementation that:
Discovers workspace structure and programming language contexts
Manages daemon lifecycle (spawn, health checks, graceful shutdown)
Implements IPC (Inter-Process Communication) bridge
Handles VS Code events (file changes, workspace updates, configuration)
Background Daemon:

Write a high-performance service that:
Watches file system changes with efficient debouncing
Generates and caches ASTs for modified files
Builds incremental "Context Snippets" optimized for LLM consumption
Maintains an in-memory index of project structure
Implements background queue processing for expensive operations
AI Intelligence Layer:

Implement a service that:
Enriches code snippets with surrounding context for LLM API calls
Generates actionable refactoring suggestions with diffs
Prioritizes suggestions by impact and confidence scores
Caches responses to avoid redundant API calls
Phase 3: User Interface (Webview Provider)

Build a polished VS Code Webview that provides:

Code Quality Dashboard:
Real-time visualization of code health metrics
Categorized list of issues (bugs, code smells, performance, security)
Filterable/sortable suggestion list with severity indicators
Interactive Diff Preview:
Side-by-side comparison of original vs. suggested code
Syntax-highlighted diff view
One-click "Apply" action with undo support
Batch apply for multiple related suggestions
Phase 4: Production Readiness

Configuration & Scaffolding:

Complete package.json with:
All contribution points (commands, views, menus, keybindings)
Activation events optimized for lazy loading
Extension dependencies and VS Code engine compatibility
Proper categorization and marketplace metadata
Reliability Engineering:

Implement comprehensive error handling:
Automatic daemon restart on crashes with exponential backoff
Graceful degradation when LLM API is unavailable
User-friendly error messages with actionable recovery steps
Telemetry hooks for monitoring (with privacy considerations)
Testing & Validation:

Include setup for:
Unit tests for core logic
Integration tests for daemon communication
Extension activation/deactivation test scenarios
Deliverable Format:

Provide a complete, production-ready implementation in the following sequence:

Project Structure: Full directory tree with all files and folders
Configuration Files: package.json, tsconfig.json, webpack/build configs
Extension Host: extension.ts and supporting modules
Background Daemon: Complete daemon implementation with entry point
Communication Layer: JSON-RPC protocol definitions and handlers
Webview Provider: React components and webview integration code
Build & Development Setup: Scripts for build, watch, and packaging
Documentation: README with architecture overview and development instructions
Output each file with:

Full file path relative to project root
Complete, runnable source code (no placeholders or TODOs)
Inline comments explaining critical design decisions
Type definitions and interfaces where applicable
The output should enable immediate project initialization and development without requiring additional research or architectural decisions.