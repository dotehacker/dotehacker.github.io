---
title: Advance MCP Scanner
date: 2025-09-22
category: "Interpretability & Safety"
---

The `Advance MCP Scanner` orchestrates a complex multi-component system that:
- Uploads and processes MCP configuration files
- Discovers and executes MCP tools dynamically
- Uses AI for sequence generation and success analysis
- Provides comprehensive logging and retry mechanisms
- **Stores scan results and metadata in SQLite database for persistence and retrieval**

## Complete Data Flow

```mermaid
graph TB
    subgraph "Client Layer"
        Client[Client Request]
        Client --> |POST /adv_mcp_scan| API
        Client --> |GET /scan/scan_id| APIGet["Scan Retrieval API"]
    end

    subgraph "FastAPI Layer"
        API["FastAPI Endpoint<br/>api.py:831-914"]
        APIGet["Scan Retrieval<br/>api.py:793-829"]
        API --> |File Upload| TempFile["temp.json"]
        API --> |Call| AdvScan["adv_scan()"]
        APIGet --> |Query DB| Database[("SQLite Database<br/>adv_scan.db")]
    end

    subgraph "Advanced Scanner Layer"
        AdvScan --> |UUID Generation| OutputFile["Output File<br/>mcp_scan_output_*.txt"]
        AdvScan --> |Retry Loop| ProcessRunner["run_scanner_process()"]
        ProcessRunner --> |Subprocess| SequenceRunner["sequence_runner.py"]
        ProcessRunner --> |Log Analysis| AnthropicAnalysis1["Anthropic API<br/>Success Analysis"]
    end

    subgraph "Sequence Runner Layer"
        SequenceRunner --> |Initialize| MCPInit["MCP Client Init"]
        MCPInit --> |Connect| MCPServers["MCP Servers"]
        MCPServers --> |Discovery| ToolsDiscovery["Tools Discovery"]
        ToolsDiscovery --> |AI Generation| AnthropicGen["Anthropic API<br/>Sequence Generation"]
        AnthropicGen --> |Execute| ToolExecution["Tool Execution Loop"]
    end

    subgraph "Tool Execution Layer"
        ToolExecution --> |Safety Check| SafetyFilter["Safety Filter"]
        SafetyFilter --> |Call Tools| MCPToolCall["MCP Tool Calls"]
        MCPToolCall --> |Results| ExecutionLogs["Execution Logs"]
    end

    subgraph "Database Layer"
        Database[("SQLite Database<br/>adv_scan.db")]
        DBInit["Database Initialization<br/>init_db()"]
        DBInsert["Insert Scan Results"]
        DBQuery["Query Scan Results"]
    end

    subgraph "Response Layer"
        ExecutionLogs --> |Analysis| AnthropicAnalysis1
        AnthropicAnalysis1 --> |Success Check| RetryLogic["Retry Logic"]
        RetryLogic --> |Parse Output| ParseOutput["parse_mcp_scanner_output()"]
        ParseOutput --> |Store Results| DBInsert
        DBInsert --> |Store in DB| Database
        ParseOutput --> |Response| APIResponse["API Response"]
        DBQuery --> |Retrieve from DB| Database
        DBQuery --> |Return Results| ScanResponse["Scan Retrieval Response"]
    end

    subgraph "External Systems"
        AnthropicAPI["Anthropic API"]
        MCPServers
    end

    AnthropicAnalysis1 -.-> AnthropicAPI
    AnthropicGen -.-> AnthropicAPI
    MCPServers -.-> ExternalMCP["External MCP Servers"]
    DBInit --> |Initialize on Startup| Database
```
