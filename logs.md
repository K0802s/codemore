CodeMore extension activating...
=================================
Starting Context Daemon...
Extension path: c:\Users\krupa\.vscode\extensions\codemore.codemore-1.0.0
Daemon path: c:\Users\krupa\.vscode\extensions\codemore.codemore-1.0.0\daemon\dist\index.js
Forking daemon process...
Daemon process forked (PID: 2584)
Waiting for daemon ready signal...
CodeMore extension activated successfully
[Daemon] [Daemon] Context Daemon starting...
Unknown message type: {"type":"ready"}
Daemon started successfully (PID: 2584)
=================================
RPC -> initialize
[Daemon] [Daemon] Context Daemon ready
[Daemon] [Daemon] Handling: initialize
[Daemon] [Daemon] Initializing with workspace: c:\Code\codemore
[Daemon] [FileWatcher] Starting watch on: c:\Code\codemore
[Daemon] [ContextMap] Scanning workspace: c:\Code\codemore
[Daemon] [ContextMap] Found 26 files
[Daemon] Initialization complete
Daemon initialized: v1.0.0
Webview message: ready
RPC -> getMetrics
[Daemon] [Daemon] Handling: getMetrics
RPC -> getProjectContext
[Daemon] [Daemon] Handling: getProjectContext
Webview message: analyzeWorkspace
RPC -> analyzeWorkspace
[Daemon] [Daemon] Handling: analyzeWorkspace
[Daemon] [Daemon] Starting workspace analysis...
[Daemon] [AnalysisQueue] Processing: c:\Code\codemore\daemon\index.ts
Analysis started: 26 files
[Daemon] [SuggestionEngine] Analyzing: c:\Code\codemore\daemon\index.ts
[Daemon] [AnalysisQueue] Processing: c:\Code\codemore\daemon\services\aiService.ts
[AnalysisQueue] Processing: c:\Code\codemore\daemon\services\analysisQueue.ts
[AnalysisQueue] Processing: c:\Code\codemore\daemon\services\astParser.ts
[Daemon] [SuggestionEngine] Analyzing: c:\Code\codemore\daemon\services\astParser.ts
[Daemon] [SuggestionEngine] Analyzing: c:\Code\codemore\daemon\services\analysisQueue.ts
[Daemon] [SuggestionEngine] Analyzing: c:\Code\codemore\daemon\services\aiService.ts
[Daemon] [AnalysisQueue] Processing: c:\Code\codemore\daemon\services\contextMap.ts
[Daemon] [AnalysisQueue] Processing: c:\Code\codemore\daemon\services\fileWatcher.ts
[AnalysisQueue] Processing: c:\Code\codemore\daemon\services\suggestionEngine.ts
[Daemon] [SuggestionEngine] Analyzing: c:\Code\codemore\daemon\services\fileWatcher.ts
[Daemon] [SuggestionEngine] Analyzing: c:\Code\codemore\daemon\services\contextMap.ts
[Daemon] [SuggestionEngine] Analyzing: c:\Code\codemore\daemon\services\suggestionEngine.ts
[Daemon] [AnalysisQueue] Processing: c:\Code\codemore\shared\protocol.d.ts
[AnalysisQueue] Processing: c:\Code\codemore\shared\protocol.js
[AnalysisQueue] Processing: c:\Code\codemore\shared\protocol.ts
[Daemon] [SuggestionEngine] Analyzing: c:\Code\codemore\shared\protocol.d.ts
[Daemon] [SuggestionEngine] Analyzing: c:\Code\codemore\shared\protocol.js
[Daemon] [SuggestionEngine] Analyzing: c:\Code\codemore\shared\protocol.ts
[Daemon] [AnalysisQueue] Processing: c:\Code\codemore\src\daemon\daemonManager.ts
[AnalysisQueue] Processing: c:\Code\codemore\src\extension.ts
[AnalysisQueue] Processing: c:\Code\codemore\src\providers\webviewProvider.ts
[Daemon] [SuggestionEngine] Analyzing: c:\Code\codemore\src\extension.ts
[Daemon] [SuggestionEngine] Analyzing: c:\Code\codemore\src\daemon\daemonManager.ts
[Daemon] [SuggestionEngine] Analyzing: c:\Code\codemore\src\providers\webviewProvider.ts
[Daemon] [AnalysisQueue] Processing: c:\Code\codemore\src\rpc\rpcClient.ts
[AnalysisQueue] Processing: c:\Code\codemore\test\suite\daemon.test.ts
[AnalysisQueue] Processing: c:\Code\codemore\test\suite\extension.test.ts
[Daemon] [SuggestionEngine] Analyzing: c:\Code\codemore\src\rpc\rpcClient.ts
[Daemon] [SuggestionEngine] Analyzing: c:\Code\codemore\test\suite\daemon.test.ts
[Daemon] [SuggestionEngine] Analyzing: c:\Code\codemore\test\suite\extension.test.ts
[AnalysisQueue] Processing: c:\Code\codemore\test\suite\index.ts
[AnalysisQueue] Processing: c:\Code\codemore\webpack.config.js
[AnalysisQueue] Processing: c:\Code\codemore\webpack.daemon.config.js
[Daemon] [SuggestionEngine] Analyzing: c:\Code\codemore\webpack.config.js
[Daemon] [SuggestionEngine] Analyzing: c:\Code\codemore\webpack.daemon.config.js
[Daemon] [SuggestionEngine] Analyzing: c:\Code\codemore\test\suite\index.ts
[AnalysisQueue] Processing: c:\Code\codemore\webpack.webview.config.js
[AnalysisQueue] Processing: c:\Code\codemore\webview\App.tsx
[AnalysisQueue] Processing: c:\Code\codemore\webview\components\Dashboard.tsx
[Daemon] [SuggestionEngine] Analyzing: c:\Code\codemore\webpack.webview.config.js
[Daemon] [SuggestionEngine] Analyzing: c:\Code\codemore\webview\components\Dashboard.tsx
[Daemon] [SuggestionEngine] Analyzing: c:\Code\codemore\webview\App.tsx
[Daemon] [AnalysisQueue] Processing: c:\Code\codemore\webview\components\DiffPreview.tsx
[Daemon] [AnalysisQueue] Processing: c:\Code\codemore\webview\components\IssueList.tsx
[AnalysisQueue] Processing: c:\Code\codemore\webview\index.tsx
[Daemon] [SuggestionEngine] Analyzing: c:\Code\codemore\webview\components\DiffPreview.tsx
[Daemon] [SuggestionEngine] Analyzing: c:\Code\codemore\webview\components\IssueList.tsx
[Daemon] [SuggestionEngine] Analyzing: c:\Code\codemore\webview\index.tsx
[Daemon] [AnalysisQueue] Processing: c:\Code\codemore\webview\types.ts
[Daemon] [SuggestionEngine] Analyzing: c:\Code\codemore\webview\types.ts
RPC -> invalidateFile
[Daemon] [Daemon] Ignoring non-request message: {"jsonrpc":"2.0","method":"invalidateFile","params":{"filePath":"extension-output-codemore.codemore-#1-CodeMore"}}
RPC -> invalidateFile
[Daemon] [Daemon] Ignoring non-request message: {"jsonrpc":"2.0","method":"invalidateFile","params":{"filePath":"extension-output-codemore.codemore-#1-CodeMore"}}
RPC -> invalidateFile
[Daemon] [Daemon] Ignoring non-request message: {"jsonrpc":"2.0","method":"invalidateFile","params":{"filePath":"extension-output-codemore.codemore-#1-CodeMore"}}
RPC -> invalidateFile
[Daemon] [Daemon] Ignoring non-request message: {"jsonrpc":"2.0","method":"invalidateFile","params":{"filePath":"extension-output-codemore.codemore-#1-CodeMore"}}
RPC -> invalidateFile
[Daemon] [Daemon] Ignoring non-request message: {"jsonrpc":"2.0","method":"invalidateFile","params":{"filePath":"extension-output-codemore.codemore-#1-CodeMore"}}
RPC -> invalidateFile
[Daemon] [Daemon] Ignoring non-request message: {"jsonrpc":"2.0","method":"invalidateFile","params":{"filePath":"extension-output-codemore.codemore-#1-CodeMore"}}
RPC -> invalidateFile
[Daemon] [Daemon] Ignoring non-request message: {"jsonrpc":"2.0","method":"invalidateFile","params":{"filePath":"extension-output-codemore.codemore-#1-CodeMore"}}
RPC -> invalidateFile
[Daemon] [Daemon] Ignoring non-request message: {"jsonrpc":"2.0","method":"invalidateFile","params":{"filePath":"extension-output-codemore.codemore-#1-CodeMore"}}
RPC -> invalidateFile
[Daemon] [Daemon] Ignoring non-request message: {"jsonrpc":"2.0","method":"invalidateFile","params":{"filePath":"extension-output-codemore.codemore-#1-CodeMore"}}
RPC -> invalidateFile
[Daemon] [Daemon] Ignoring non-request message: {"jsonrpc":"2.0","method":"invalidateFile","params":{"filePath":"extension-output-codemore.codemore-#1-CodeMore"}}
RPC -> invalidateFile
[Daemon] [Daemon] Ignoring non-request message: {"jsonrpc":"2.0","method":"invalidateFile","params":{"filePath":"extension-output-codemore.codemore-#1-CodeMore"}}
RPC -> invalidateFile
[Daemon] [Daemon] Ignoring non-request message: {"jsonrpc":"2.0","method":"invalidateFile","params":{"filePath":"extension-output-codemore.codemore-#1-CodeMore"}}
RPC -> invalidateFile
[Daemon] [Daemon] Ignoring non-request message: {"jsonrpc":"2.0","method":"invalidateFile","params":{"filePath":"extension-output-codemore.codemore-#1-CodeMore"}}