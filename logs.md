CodeMore extension activating...
=================================
Starting Context Daemon...
Extension path: c:\Code\codemore
Daemon path: c:\Code\codemore\daemon\dist\index.js
Forking daemon process...
Daemon process forked (PID: 27840)
Waiting for daemon ready signal...
CodeMore extension activated successfully
Webview message: ready
Webview message: ready
[Daemon] [Daemon] Context Daemon starting...
Daemon started successfully (PID: 27840)
=================================
Initializing daemon with workspace: c:\Users\krupa\OneDrive\Documents
RPC -> initialize
[Daemon] [Daemon] Context Daemon ready
[Daemon] [Daemon] Handling: initialize
[Daemon] Initializing with workspace: c:\Users\krupa\OneDrive\Documents
[AiService] Gemini model initialized
[FileWatcher] Starting watch on: c:\Users\krupa\OneDrive\Documents
[Daemon] [ContextMap] Scanning workspace: c:\Users\krupa\OneDrive\Documents
No handlers for notification: daemon/fileDiscovery
[Daemon] [ContextMap] Found 53 files across 6 file types
[Daemon] Initialization complete
Daemon initialized successfully: v1.0.0
RPC -> getMetrics
RPC -> getAllIssues
[Daemon] [Daemon] Handling: getMetrics
[Daemon] Handling: getAllIssues
Webview message: analyzeWorkspace
RPC -> analyzeWorkspace
[Daemon] [Daemon] Handling: analyzeWorkspace
[Daemon] Starting workspace analysis...
[Daemon] [AnalysisQueue] Processing: c:\Users\krupa\OneDrive\Documents\clock javascrit.js
Analysis started: 53 files
[Daemon] [SuggestionEngine] Analyzing: c:\Users\krupa\OneDrive\Documents\clock javascrit.js
[Daemon] [AiService] Gemini response received, parsing...
[Daemon] [AiService] Gemini found 1 issues
[AnalysisQueue] Processing: c:\Users\krupa\OneDrive\Documents\clock.css
[AnalysisQueue] Processing: c:\Users\krupa\OneDrive\Documents\clock.html
[AnalysisQueue] Processing: c:\Users\krupa\OneDrive\Documents\COMPUTER NETWORKS\EchoClient.java
[SuggestionEngine] Analyzing: c:\Users\krupa\OneDrive\Documents\clock.css
[SuggestionEngine] Analyzing: c:\Users\krupa\OneDrive\Documents\clock.html
[SuggestionEngine] Analyzing: c:\Users\krupa\OneDrive\Documents\COMPUTER NETWORKS\EchoClient.java
Webview message: requestSuggestions
RPC -> getSuggestions
[Daemon] [Daemon] Handling: getSuggestions
[Daemon] [AiService] Gemini response received, parsing...
[AiService] Gemini found 2 issues
[Daemon] [AiService] Gemini response received, parsing...
[AiService] Gemini found 2 issues
Webview message: applySuggestion
RPC -> getSuggestionById
[Daemon] [Daemon] Handling: getSuggestionById
RPC -> invalidateFile
[Daemon] [Daemon] Handling notification: invalidateFile
[Daemon] [AiService] Gemini response received, parsing...
[AiService] Gemini found 3 issues
[AnalysisQueue] Processing: c:\Users\krupa\OneDrive\Documents\COMPUTER NETWORKS\EchoServer.java
[AnalysisQueue] Processing: c:\Users\krupa\OneDrive\Documents\final clock.html
[AnalysisQueue] Processing: c:\Users\krupa\OneDrive\Documents\GROUP PROJECT.html
[SuggestionEngine] Analyzing: c:\Users\krupa\OneDrive\Documents\COMPUTER NETWORKS\EchoServer.java
[SuggestionEngine] Analyzing: c:\Users\krupa\OneDrive\Documents\final clock.html
[SuggestionEngine] Analyzing: c:\Users\krupa\OneDrive\Documents\GROUP PROJECT.html
RPC -> invalidateFile
[Daemon] [Daemon] Handling notification: invalidateFile
[Daemon] [Daemon] File changed: c:\Users\krupa\OneDrive\Documents\clock javascrit.js
RPC -> invalidateFile
[Daemon] [Daemon] Handling notification: invalidateFile
[Daemon] [AiService] Gemini response received, parsing...
[Daemon Error] [AiService] Failed to parse Gemini JSON: SyntaxError: Bad escaped character in JSON at position 473 (line 9 column 23)
    at JSON.parse (<anonymous>)
    at AiService.callGemini (c:\Code\codemore\daemon\dist\index.js:249:41)
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
    at async AiService.callAiApi (c:\Code\codemore\daemon\dist\index.js:116:24)
    at async AiService.analyzeCode (c:\Code\codemore\daemon\dist\index.js:74:28)
    at async SuggestionEngine.analyzeFile (c:\Code\codemore\daemon\dist\index.js:1805:24)
    at async AnalysisQueue.processItem (c:\Code\codemore\daemon\dist\index.js:617:28)
    at async Promise.all (index 0)
    at async AnalysisQueue.startProcessing (c:\Code\codemore\daemon\dist\index.js:596:13)
[Daemon] [AiService] Gemini response received, parsing...
[AiService] Gemini found 3 issues
RPC -> invalidateFile
[Daemon] [Daemon] Handling notification: invalidateFile
[Daemon] [AiService] Gemini response received, parsing...
[AiService] Gemini found 5 issues
[Daemon] [AnalysisQueue] Processing: c:\Users\krupa\OneDrive\Documents\JAVA\ArrayLength[168].java
[AnalysisQueue] Processing: c:\Users\krupa\OneDrive\Documents\JAVA\BinarySearch[168].java
[AnalysisQueue] Processing: c:\Users\krupa\OneDrive\Documents\JAVA\CopyArrayLoop[168].java
[SuggestionEngine] Analyzing: c:\Users\krupa\OneDrive\Documents\JAVA\ArrayLength[168].java
[SuggestionEngine] Analyzing: c:\Users\krupa\OneDrive\Documents\JAVA\BinarySearch[168].java
[Daemon] [SuggestionEngine] Analyzing: c:\Users\krupa\OneDrive\Documents\JAVA\CopyArrayLoop[168].java
RPC -> invalidateFile
[Daemon] [Daemon] Handling notification: invalidateFile
RPC -> invalidateFile
[Daemon] [Daemon] Handling notification: invalidateFile
RPC -> invalidateFile
[Daemon] [Daemon] Handling notification: invalidateFile
RPC -> invalidateFile
[Daemon] [Daemon] Handling notification: invalidateFile
[Daemon] [AiService] Gemini response received, parsing...
[AiService] Gemini found 1 issues
[Daemon] [AiService] Gemini response received, parsing...
[AiService] Gemini found 1 issues
[Daemon] [AiService] Gemini response received, parsing...
[AiService] Gemini found 1 issues
[Daemon] [AnalysisQueue] Processing: c:\Users\krupa\OneDrive\Documents\JAVA\CopyArrayMethod[168].java
[AnalysisQueue] Processing: c:\Users\krupa\OneDrive\Documents\JAVA\EvenNumbers[168].java
[AnalysisQueue] Processing: c:\Users\krupa\OneDrive\Documents\JAVA\FirstLastElement[168].java
[SuggestionEngine] Analyzing: c:\Users\krupa\OneDrive\Documents\JAVA\CopyArrayMethod[168].java
[SuggestionEngine] Analyzing: c:\Users\krupa\OneDrive\Documents\JAVA\FirstLastElement[168].java
[SuggestionEngine] Analyzing: c:\Users\krupa\OneDrive\Documents\JAVA\EvenNumbers[168].java
RPC -> invalidateFile
[Daemon] [Daemon] Handling notification: invalidateFile
[Daemon] [AiService] Gemini response received, parsing...
[AiService] Gemini found 1 issues
[Daemon] [AiService] Gemini response received, parsing...
[AiService] Gemini found 1 issues
[Daemon] [AiService] Gemini response received, parsing...
[AiService] Gemini found 1 issues
[Daemon] [AnalysisQueue] Processing: c:\Users\krupa\OneDrive\Documents\JAVA\LinearSearch[168].java
[AnalysisQueue] Processing: c:\Users\krupa\OneDrive\Documents\JAVA\PrintArray[168].java
[AnalysisQueue] Processing: c:\Users\krupa\OneDrive\Documents\JAVA\ReverseStringArray[168].java
[SuggestionEngine] Analyzing: c:\Users\krupa\OneDrive\Documents\JAVA\ReverseStringArray[168].java
[Daemon] [SuggestionEngine] Analyzing: c:\Users\krupa\OneDrive\Documents\JAVA\PrintArray[168].java
[SuggestionEngine] Analyzing: c:\Users\krupa\OneDrive\Documents\JAVA\LinearSearch[168].java
RPC -> invalidateFile
[Daemon] [Daemon] Handling notification: invalidateFile
[Daemon] [Daemon] File changed: c:\Users\krupa\OneDrive\Documents\clock javascrit.js
Webview message: requestSuggestions
RPC -> getSuggestions
[Daemon] [Daemon] Handling: getSuggestions
[Daemon] [AiService] Gemini response received, parsing...
[AiService] Gemini found 2 issues
[Daemon] [AiService] Gemini response received, parsing...
[Daemon Error] [AiService] Failed to parse Gemini JSON: SyntaxError: Bad escaped character in JSON at position 409 (line 9 column 23)
    at JSON.parse (<anonymous>)
    at AiService.callGemini (c:\Code\codemore\daemon\dist\index.js:249:41)
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
    at async AiService.callAiApi (c:\Code\codemore\daemon\dist\index.js:116:24)
    at async AiService.analyzeCode (c:\Code\codemore\daemon\dist\index.js:74:28)
    at async SuggestionEngine.analyzeFile (c:\Code\codemore\daemon\dist\index.js:1805:24)
    at async AnalysisQueue.processItem (c:\Code\codemore\daemon\dist\index.js:617:28)
    at async Promise.all (index 0)
    at async AnalysisQueue.startProcessing (c:\Code\codemore\daemon\dist\index.js:596:13)
Webview message: openFile
[Daemon] [AiService] Gemini response received, parsing...
[AiService] Gemini found 1 issues
[AnalysisQueue] Processing: c:\Users\krupa\OneDrive\Documents\JAVA\SumOfArray[168].java
[AnalysisQueue] Processing: c:\Users\krupa\OneDrive\Documents\jewelry customised.html
[AnalysisQueue] Processing: c:\Users\krupa\OneDrive\Documents\main.html
[SuggestionEngine] Analyzing: c:\Users\krupa\OneDrive\Documents\JAVA\SumOfArray[168].java
[SuggestionEngine] Analyzing: c:\Users\krupa\OneDrive\Documents\main.html
[SuggestionEngine] Analyzing: c:\Users\krupa\OneDrive\Documents\jewelry customised.html
Webview message: applySuggestion
RPC -> getSuggestionById
[Daemon] [Daemon] Handling: getSuggestionById
RPC -> invalidateFile
[Daemon] [Daemon] Handling notification: invalidateFile
RPC -> invalidateFile
[Daemon] [Daemon] Handling notification: invalidateFile
[Daemon] [AiService] Gemini response received, parsing...
[AiService] Gemini found 2 issues
RPC -> invalidateFile
[Daemon] [Daemon] Handling notification: invalidateFile
RPC -> invalidateFile
[Daemon] [Daemon] Handling notification: invalidateFile
[Daemon] [AiService] Gemini response received, parsing...
[Daemon Error] [AiService] Failed to parse Gemini JSON: SyntaxError: Bad escaped character in JSON at position 450 (line 9 column 23)
    at JSON.parse (<anonymous>)
    at AiService.callGemini (c:\Code\codemore\daemon\dist\index.js:249:41)
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
    at async AiService.callAiApi (c:\Code\codemore\daemon\dist\index.js:116:24)
    at async AiService.analyzeCode (c:\Code\codemore\daemon\dist\index.js:74:28)
    at async SuggestionEngine.analyzeFile (c:\Code\codemore\daemon\dist\index.js:1805:24)
    at async AnalysisQueue.processItem (c:\Code\codemore\daemon\dist\index.js:617:28)
    at async Promise.all (index 1)
    at async AnalysisQueue.startProcessing (c:\Code\codemore\daemon\dist\index.js:596:13)
RPC -> invalidateFile
[Daemon] [Daemon] Handling notification: invalidateFile
RPC -> invalidateFile
[Daemon] [Daemon] Handling notification: invalidateFile
[Daemon] [AiService] Gemini response received, parsing...
[AnalysisQueue] Processing: c:\Users\krupa\OneDrive\Documents\new 1.html
[AnalysisQueue] Processing: c:\Users\krupa\OneDrive\Documents\online quiz.html
[AnalysisQueue] Processing: c:\Users\krupa\OneDrive\Documents\php.html
[Daemon Error] [AiService] Failed to parse Gemini JSON: SyntaxError: Bad escaped character in JSON at position 531 (line 9 column 23)
    at JSON.parse (<anonymous>)
    at AiService.callGemini (c:\Code\codemore\daemon\dist\index.js:249:41)
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
    at async AiService.callAiApi (c:\Code\codemore\daemon\dist\index.js:116:24)
    at async AiService.analyzeCode (c:\Code\codemore\daemon\dist\index.js:74:28)
    at async SuggestionEngine.analyzeFile (c:\Code\codemore\daemon\dist\index.js:1805:24)
    at async AnalysisQueue.processItem (c:\Code\codemore\daemon\dist\index.js:617:28)
    at async Promise.all (index 2)
    at async AnalysisQueue.startProcessing (c:\Code\codemore\daemon\dist\index.js:596:13)
[Daemon] [SuggestionEngine] Analyzing: c:\Users\krupa\OneDrive\Documents\php.html
[SuggestionEngine] Analyzing: c:\Users\krupa\OneDrive\Documents\new 1.html
[SuggestionEngine] Analyzing: c:\Users\krupa\OneDrive\Documents\online quiz.html
RPC -> invalidateFile
[Daemon] [Daemon] Handling notification: invalidateFile
Webview message: requestSuggestions
RPC -> getSuggestions
[Daemon] [Daemon] Handling: getSuggestions
Webview message: applySuggestion
RPC -> getSuggestionById
[Daemon] [Daemon] Handling: getSuggestionById
RPC -> invalidateFile
[Daemon] [Daemon] Handling notification: invalidateFile
[Daemon] [AiService] Gemini response received, parsing...
[AiService] Gemini found 3 issues
RPC -> invalidateFile
[Daemon] [Daemon] Handling notification: invalidateFile
[Daemon] [Daemon] File changed: c:\Users\krupa\OneDrive\Documents\JAVA\SumOfArray[168].java
[Daemon] [AiService] Gemini response received, parsing...
[AiService] Gemini found 5 issues
RPC -> invalidateFile
[Daemon] [Daemon] Handling notification: invalidateFile
RPC -> invalidateFile
[Daemon] [Daemon] Handling notification: invalidateFile
[Daemon] [AiService] Gemini response received, parsing...
[Daemon] [AiService] Gemini found 4 issues
[AnalysisQueue] Processing: c:\Users\krupa\OneDrive\Documents\php.php
[AnalysisQueue] Processing: c:\Users\krupa\OneDrive\Documents\python tut\class.py
[AnalysisQueue] Processing: c:\Users\krupa\OneDrive\Documents\python tut\comments.py
[SuggestionEngine] Analyzing: c:\Users\krupa\OneDrive\Documents\php.php
[Daemon] [SuggestionEngine] Analyzing: c:\Users\krupa\OneDrive\Documents\python tut\comments.py
[SuggestionEngine] Analyzing: c:\Users\krupa\OneDrive\Documents\python tut\class.py
RPC -> invalidateFile
[Daemon] [Daemon] Handling notification: invalidateFile
[Daemon] [AiService] Gemini response received, parsing...
[Daemon] [AiService] Gemini found 1 issues
[Daemon] [AiService] Gemini response received, parsing...
[Daemon] [AiService] Gemini found 2 issues
RPC -> invalidateFile
[Daemon] [Daemon] Handling notification: invalidateFile
RPC -> invalidateFile
[Daemon] [Daemon] Handling notification: invalidateFile
[Daemon] [AiService] Gemini response received, parsing...
[AiService] Gemini found 4 issues
[Daemon] [AnalysisQueue] Processing: c:\Users\krupa\OneDrive\Documents\python tut\conditional.py
[AnalysisQueue] Processing: c:\Users\krupa\OneDrive\Documents\python tut\datatypes.py
[AnalysisQueue] Processing: c:\Users\krupa\OneDrive\Documents\python tut\demo1.py
[SuggestionEngine] Analyzing: c:\Users\krupa\OneDrive\Documents\python tut\conditional.py
[Daemon] [SuggestionEngine] Analyzing: c:\Users\krupa\OneDrive\Documents\python tut\demo1.py
[SuggestionEngine] Analyzing: c:\Users\krupa\OneDrive\Documents\python tut\datatypes.py
[Daemon] [AiService] Gemini response received, parsing...
[AiService] Gemini found 2 issues
[Daemon] [AiService] Gemini response received, parsing...
[AiService] Gemini found 2 issues
[Daemon] [AiService] Gemini response received, parsing...
[AiService] Gemini found 3 issues
[Daemon] [AnalysisQueue] Processing: c:\Users\krupa\OneDrive\Documents\python tut\dic.py
[AnalysisQueue] Processing: c:\Users\krupa\OneDrive\Documents\python tut\encapsulation_abstracttion.py
[AnalysisQueue] Processing: c:\Users\krupa\OneDrive\Documents\python tut\error.py
[SuggestionEngine] Analyzing: c:\Users\krupa\OneDrive\Documents\python tut\error.py
[Daemon] [SuggestionEngine] Analyzing: c:\Users\krupa\OneDrive\Documents\python tut\dic.py
[SuggestionEngine] Analyzing: c:\Users\krupa\OneDrive\Documents\python tut\encapsulation_abstracttion.py
[Daemon] [AiService] Gemini response received, parsing...
[Daemon Error] [AiService] Failed to parse Gemini JSON: SyntaxError: Bad escaped character in JSON at position 489 (line 9 column 23)
    at JSON.parse (<anonymous>)
    at AiService.callGemini (c:\Code\codemore\daemon\dist\index.js:249:41)
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
    at async AiService.callAiApi (c:\Code\codemore\daemon\dist\index.js:116:24)
    at async AiService.analyzeCode (c:\Code\codemore\daemon\dist\index.js:74:28)
    at async SuggestionEngine.analyzeFile (c:\Code\codemore\daemon\dist\index.js:1805:24)
    at async AnalysisQueue.processItem (c:\Code\codemore\daemon\dist\index.js:617:28)
    at async Promise.all (index 0)
    at async AnalysisQueue.startProcessing (c:\Code\codemore\daemon\dist\index.js:596:13)
[Daemon] [AiService] Gemini response received, parsing...
[AiService] Gemini found 3 issues
[Daemon] [AiService] Gemini response received, parsing...
[Daemon] [AiService] Gemini found 3 issues
[AnalysisQueue] Processing: c:\Users\krupa\OneDrive\Documents\python tut\fiehandling.py
[AnalysisQueue] Processing: c:\Users\krupa\OneDrive\Documents\python tut\first.py
[AnalysisQueue] Processing: c:\Users\krupa\OneDrive\Documents\python tut\function.py
[SuggestionEngine] Analyzing: c:\Users\krupa\OneDrive\Documents\python tut\fiehandling.py
[Daemon] [SuggestionEngine] Analyzing: c:\Users\krupa\OneDrive\Documents\python tut\first.py
[SuggestionEngine] Analyzing: c:\Users\krupa\OneDrive\Documents\python tut\function.py
Webview message: openSettings
[Daemon] [AiService] Gemini response received, parsing...
[Daemon Error] [AiService] Failed to parse Gemini JSON: SyntaxError: Bad escaped character in JSON at position 579 (line 9 column 23)
    at JSON.parse (<anonymous>)
    at AiService.callGemini (c:\Code\codemore\daemon\dist\index.js:249:41)
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
    at async AiService.callAiApi (c:\Code\codemore\daemon\dist\index.js:116:24)
    at async AiService.analyzeCode (c:\Code\codemore\daemon\dist\index.js:74:28)
    at async SuggestionEngine.analyzeFile (c:\Code\codemore\daemon\dist\index.js:1805:24)
    at async AnalysisQueue.processItem (c:\Code\codemore\daemon\dist\index.js:617:28)
    at async Promise.all (index 0)
    at async AnalysisQueue.startProcessing (c:\Code\codemore\daemon\dist\index.js:596:13)
[Daemon] [AiService] Gemini response received, parsing...
[AiService] Gemini found 1 issues
[Daemon Error] [AiService] Failed to parse Gemini JSON: SyntaxError: Bad escaped character in JSON at position 396 (line 9 column 23)
    at JSON.parse (<anonymous>)
    at AiService.callGemini (c:\Code\codemore\daemon\dist\index.js:249:41)
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
    at async AiService.callAiApi (c:\Code\codemore\daemon\dist\index.js:116:24)
    at async AiService.analyzeCode (c:\Code\codemore\daemon\dist\index.js:74:28)
    at async SuggestionEngine.analyzeFile (c:\Code\codemore\daemon\dist\index.js:1805:24)
    at async AnalysisQueue.processItem (c:\Code\codemore\daemon\dist\index.js:617:28)
    at async Promise.all (index 2)
    at async AnalysisQueue.startProcessing (c:\Code\codemore\daemon\dist\index.js:596:13)
[Daemon] [AiService] Gemini response received, parsing...
[AnalysisQueue] Processing: c:\Users\krupa\OneDrive\Documents\python tut\inheritance.py
[AnalysisQueue] Processing: c:\Users\krupa\OneDrive\Documents\python tut\jumpingst.py
[AnalysisQueue] Processing: c:\Users\krupa\OneDrive\Documents\python tut\lists.py
[SuggestionEngine] Analyzing: c:\Users\krupa\OneDrive\Documents\python tut\inheritance.py
[SuggestionEngine] Analyzing: c:\Users\krupa\OneDrive\Documents\python tut\jumpingst.py
[SuggestionEngine] Analyzing: c:\Users\krupa\OneDrive\Documents\python tut\lists.py
[Daemon] [AiService] Gemini response received, parsing...
[AiService] Gemini found 1 issues
[Daemon] [AiService] Gemini response received, parsing...
[AiService] Gemini found 2 issues
[Daemon] [AiService] Gemini response received, parsing...
[AiService] Gemini found 4 issues
[Daemon] [AnalysisQueue] Processing: c:\Users\krupa\OneDrive\Documents\python tut\loopingst.py
[AnalysisQueue] Processing: c:\Users\krupa\OneDrive\Documents\python tut\set.py
[AnalysisQueue] Processing: c:\Users\krupa\OneDrive\Documents\python tut\strings.py
[SuggestionEngine] Analyzing: c:\Users\krupa\OneDrive\Documents\python tut\loopingst.py
[Daemon] [SuggestionEngine] Analyzing: c:\Users\krupa\OneDrive\Documents\python tut\strings.py
[SuggestionEngine] Analyzing: c:\Users\krupa\OneDrive\Documents\python tut\set.py
[Daemon] [AiService] Gemini response received, parsing...
[AiService] Gemini found 2 issues
[Daemon] [AiService] Gemini response received, parsing...
[AiService] Gemini found 2 issues
[Daemon] [AiService] Gemini response received, parsing...
[Daemon] [AnalysisQueue] Processing: c:\Users\krupa\OneDrive\Documents\python tut\tuple.py
[AnalysisQueue] Processing: c:\Users\krupa\OneDrive\Documents\python tut\variable.py
[AnalysisQueue] Processing: c:\Users\krupa\OneDrive\Documents\python tut\webscrapping.py
[SuggestionEngine] Analyzing: c:\Users\krupa\OneDrive\Documents\python tut\webscrapping.py
[Daemon Error] [AiService] Failed to parse Gemini JSON: SyntaxError: Bad escaped character in JSON at position 479 (line 9 column 23)
    at JSON.parse (<anonymous>)
    at AiService.callGemini (c:\Code\codemore\daemon\dist\index.js:249:41)
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
    at async AiService.callAiApi (c:\Code\codemore\daemon\dist\index.js:116:24)
    at async AiService.analyzeCode (c:\Code\codemore\daemon\dist\index.js:74:28)
    at async SuggestionEngine.analyzeFile (c:\Code\codemore\daemon\dist\index.js:1805:24)
    at async AnalysisQueue.processItem (c:\Code\codemore\daemon\dist\index.js:617:28)
    at async Promise.all (index 1)
    at async AnalysisQueue.startProcessing (c:\Code\codemore\daemon\dist\index.js:596:13)
[Daemon] [SuggestionEngine] Analyzing: c:\Users\krupa\OneDrive\Documents\python tut\tuple.py
[SuggestionEngine] Analyzing: c:\Users\krupa\OneDrive\Documents\python tut\variable.py
[Daemon] [AiService] Gemini response received, parsing...
[AiService] Gemini found 1 issues
[Daemon] [AiService] Gemini response received, parsing...
[AiService] Gemini found 2 issues
[Daemon] [AiService] Gemini response received, parsing...
[AiService] Gemini found 5 issues
[Daemon] [AnalysisQueue] Processing: c:\Users\krupa\OneDrive\Documents\registration form.css
[AnalysisQueue] Processing: c:\Users\krupa\OneDrive\Documents\registration form.html
[AnalysisQueue] Processing: c:\Users\krupa\OneDrive\Documents\registration form.js
[SuggestionEngine] Analyzing: c:\Users\krupa\OneDrive\Documents\registration form.css
[SuggestionEngine] Analyzing: c:\Users\krupa\OneDrive\Documents\registration form.html
[Daemon] [SuggestionEngine] Analyzing: c:\Users\krupa\OneDrive\Documents\registration form.js
Webview message: stopAnalysis
RPC -> stopAnalysis
[Daemon] [Daemon] Handling: stopAnalysis
[Daemon] Stopping analysis...
No handlers for notification: daemon/analysisStopped
[Daemon] [AiService] Gemini response received, parsing...
[AiService] Gemini found 4 issues
[Daemon] [AiService] Gemini response received, parsing...
[AiService] Gemini found 3 issues
