# Prompt Firewall

**Serverless browser extension to detect and neutralize prompt injection attacks for AI agents browsing the web.**

## Architecture

```
Browser → Extension (content script) → Background Worker (rules engine) → Visual Warnings
```

- **Extension**: Content script that scrapes visible + hidden text from pages
- **Background Worker**: Service worker that scans text using regex patterns (runs in browser)
- **Rules Engine**: 24+ JSON-based detection rules with severity levels (low, medium, high)
- **100% Local**: All processing happens in your browser, no external servers needed

## Quick Start

### Prerequisites

- Node.js 20+
- npm
- Chrome, Edge, or any Chromium-based browser

### 1. Build the Extension

```bash
npm install
npm run build
```

### 2. Create Icons (One-time setup)

The extension needs icon files. Quick option:
1. Visit https://favicon.io/favicon-converter/
2. Upload `apps/extension/public/icons/icon-128.svg`
3. Download the generated PNGs
4. Place them in `apps/extension/public/icons/`

Or see `apps/extension/public/icons/README.md` for other options.

### 3. Load in Browser

1. Open `chrome://extensions/` (or `edge://extensions/`)
2. Enable "Developer mode" (toggle in top-right)
3. Click "Load unpacked"
4. Select the `apps/extension/dist` folder
5. The Prompt Firewall icon should appear in your toolbar

### 4. Test It

Visit any webpage and click the extension icon to see the scan results!

## Project Structure

```
prompt-firewall/
├── apps/
│   └── extension/           # Browser extension (Manifest V3)
│       ├── manifest.json    # Extension configuration
│       ├── src/
│       │   ├── background/  # Service worker (rules engine)
│       │   ├── content/     # Content script (text extraction)
│       │   ├── popup/       # Popup UI
│       │   └── utils/       # Shared utilities
│       └── public/
│           ├── rules/       # Detection rules (core.json)
│           └── icons/       # Extension icons
└── packages/
    └── rules/               # Shared rule definitions
        └── core.json        # 24+ detection patterns
```

## Features

- ✅ **24+ Detection Rules** covering all major prompt injection categories
- ✅ **Real-time Scanning** on every page load
- ✅ **Visual Warnings** with on-page banners for high-risk content
- ✅ **Detailed Reports** showing matched patterns and severity
- ✅ **Serverless Architecture** - no external dependencies
- ✅ **Privacy-First** - all processing local to your browser
- ✅ **Lightweight** - minimal performance impact
- ✅ **Easy to Customize** - JSON-based rules you can edit

## Detection Categories

The extension detects 24+ types of prompt injections:

1. **Command Injection** - Executable commands (execute, run, delete, etc.)
2. **Instruction Override** - "Ignore previous instructions" patterns
3. **Role Manipulation** - Attempts to change AI identity
4. **Credential Extraction** - Attempts to extract passwords, API keys, etc.
5. **Jailbreak Patterns** - Known bypass techniques (DAN, etc.)
6. **System Message Injection** - Fake system-level commands
7. **Authority Impersonation** - Fake admin/developer claims
8. **Privilege Escalation** - Attempts to gain elevated access
9. **And 16 more...**

See `apps/extension/public/rules/core.json` for the complete rule set.

## Development

```bash
# Build the extension
npm run build

# Watch mode (rebuilds on changes)
npm run watch

# Install extension dependencies only
cd apps/extension && npm install
```

## How It Works

1. **Content Script** runs on every webpage and extracts:
   - Visible text
   - Hidden elements (`display:none`, etc.)
   - HTML comments
   - Meta tags and attributes
   - Script contents

2. **Background Service Worker** receives extracted text and:
   - Matches against 24+ regex patterns
   - Calculates overall risk score
   - Stores results for the popup

3. **Popup UI** displays:
   - Current page risk level
   - Number of threats by severity
   - Detailed detection information
   - Ability to rescan or view all rules

4. **Visual Warning** shows a banner on high/medium risk pages

## Customizing Rules

Edit `apps/extension/public/rules/core.json`:

```json
{
  "rules": [
    {
      "id": "my_rule",
      "name": "My Custom Rule",
      "pattern": "your regex pattern here",
      "severity": "high",
      "description": "What this detects"
    }
  ]
}
```

Then rebuild: `npm run build`

## Security & Privacy

- ✅ All processing happens locally in your browser
- ✅ No data sent to external servers
- ✅ No tracking or telemetry
- ✅ Rules are auditable JSON files
- ✅ Open source (MIT License)

## License

MIT
