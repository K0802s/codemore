CodeMore extension activating...
=================================
Starting Context Daemon...
Extension path: c:\Code\codemore
Daemon path: c:\Code\codemore\daemon\dist\index.js
Forking daemon process...
Daemon process forked (PID: 23240)
Waiting for daemon ready signal...
CodeMore extension activated successfully
Webview message: ready
Webview message: ready
[Daemon] [Daemon] Context Daemon starting...
Daemon started successfully (PID: 23240)
=================================
No workspace folder found, skipping daemon initialization
[Daemon] [Daemon] Context Daemon ready
Webview message: analyzeWorkspace
Restarting Context Daemon...
Stopping Context Daemon...
[Daemon] [Daemon] Received shutdown signal
[Daemon] Cleaning up...
Daemon exited (code: 0, signal: null)
Force kill error: Error: Command failed: taskkill /pid 23240 /T /F
ERROR: The process "23240" not found.

Daemon stopped
=================================
Starting Context Daemon...
Extension path: c:\Code\codemore
Daemon path: c:\Code\codemore\daemon\dist\index.js
Forking daemon process...
Daemon process forked (PID: 27416)
Waiting for daemon ready signal...
[Daemon] [Daemon] Context Daemon starting...
Daemon started successfully (PID: 27416)
=================================
[Daemon] [Daemon] Context Daemon ready
Graceful shutdown timed out, forcing kill
Webview message: analyzeWorkspace
RPC -> analyzeWorkspace
[Daemon] [Daemon] Handling: analyzeWorkspace
[Daemon Error] [Daemon Error] Handler error for analyzeWorkspace Error: Daemon not initialized
    at analyzeWorkspace (c:\Code\codemore\daemon\dist\index.js:210829:19)
    at process.handleMessage (c:\Code\codemore\daemon\dist\index.js:210982:34)
    at process.emit (node:events:531:35)
    at emit (node:internal/child_process:949:14)
    at process.processTicksAndRejections (node:internal/process/task_queues:91:21)
Daemon error: Handler error for analyzeWorkspace
Details: {}
Daemon error: Handler error for analyzeWorkspace
Details: {}