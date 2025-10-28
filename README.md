# Prompt Firewall

**Browser extension + gateway to detect and neutralize prompt injection attacks for Chromium-based agentic browsers.**

## Architecture

```
Browser → Extension (content script) → Gateway → Rules Engine
```

- **Extension**: Content script that scrapes visible + hidden text from pages
- **Gateway**: Local server that scans text using regex patterns
- **Rules Engine**: JSON-based rules with severity levels (low, medium, high)

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- npm

### 1. Install Dependencies

```bash
npm install
```

### 2. Test Basic Structure

```bash
# Verify workspace setup
npm run build:gateway

# Test rules engine (when implemented)
node -e "console.log('Rules loaded:', require('./packages/rules/core.json').rules.length)"
```

**Note**: This initial PR only sets up the project structure. Gateway and extension implementation will follow in subsequent PRs.

## Project Structure

```
prompt-firewall/
├── apps/
│   ├── extension/       # Browser extension (content scripts, popup)
│   └── gateway/         # Node.js server on port 11434
│       └── src/
│           └── index.ts
└── packages/
    └── rules/           # Rule definitions in JSON
        └── core.json
```

## Testing (Current Status)

```bash
# Test workspace setup
npm install
npm run build:gateway

# Test rules loading
node -e "console.log('Rules loaded:', require('./packages/rules/core.json').rules.length)"
```

Expected output:

```
Rules loaded: 4
```

**Note**: Gateway and extension testing will be available after implementation PRs.

## Current Rules

1. **ignore_previous** - "ignore previous instructions" patterns
2. **role_play** - Attempts to make AI impersonate entities
3. **system_override** - System-level command injection
4. **jailbreak_attempt** - Bypass safety restrictions

## Security

- All processing happens locally
- No data leaves your machine
- Rules are JSON-based (easy to audit)

## License

MIT
