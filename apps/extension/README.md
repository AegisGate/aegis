# Prompt Firewall Extension

Browser extension to detect and neutralize prompt injection attacks for AI agents.

## Features

✅ **24+ Detection Rules** - Comprehensive pattern matching for prompt injections  
✅ **Real-time Scanning** - Automatically scans every page you visit  
✅ **Visual Warnings** - Banner notifications for detected threats  
✅ **Detailed Reports** - View exactly what was detected and why  
✅ **100% Local** - All processing happens in your browser, no data sent anywhere  
✅ **Lightweight** - Minimal performance impact

## Installation

### Development Install

1. **Build the extension:**
```bash
npm install
npm run build
```

2. **Load in Chrome/Edge:**
   - Open `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `apps/extension/dist` folder

3. **Test it:**
   - Visit any webpage
   - Click the extension icon to see scan results

### Before First Build

**Note:** You need to create icon files before building. See `public/icons/README.md` for instructions.

Quick option: Visit https://favicon.io/favicon-converter/ and upload `public/icons/icon-128.svg`

## Development

```bash
# Watch mode - rebuilds on changes
npm run watch

# Build once
npm run build
```

## How It Works

1. **Content Script** runs on every page and extracts:
   - Visible text
   - Hidden elements
   - HTML comments
   - Meta tags  
   - Data attributes
   - Script contents

2. **Background Worker** receives the text and:
   - Matches against 24+ regex patterns
   - Calculates risk score
   - Stores results

3. **Popup UI** shows:
   - Risk level indicator
   - Number of threats by severity
   - Detailed list of detections
   - Ability to rescan

## Detection Categories

The extension detects:

- **Command Injection** - Attempts to trigger actions
- **Instruction Override** - "Ignore previous instructions"  
- **Role Manipulation** - Trying to change AI identity
- **Credential Extraction** - Attempting to extract secrets
- **System Message Injection** - Fake system-level commands
- **Jailbreak Patterns** - Known bypass techniques
- **Authority Impersonation** - Fake admin/developer claims
- **And 17 more...**

See `public/rules/core.json` for the complete rule set.

## Architecture

```
┌─────────────┐
│  Web Page   │
└──────┬──────┘
       │ Text extraction
┌──────▼──────┐
│   Content   │
│   Script    │
└──────┬──────┘
       │ Send text
┌──────▼──────┐
│ Background  │◄──── rules/core.json
│   Worker    │
└──────┬──────┘
       │ Results
┌──────▼──────┐
│   Popup UI  │
└─────────────┘
```

## Security & Privacy

- ✅ All processing happens locally in your browser
- ✅ No data is sent to external servers
- ✅ No tracking or analytics
- ✅ Rules are auditable JSON
- ✅ Open source (MIT License)

## Customizing Rules

Edit `public/rules/core.json` to add/modify detection patterns:

```json
{
  "id": "my_custom_rule",
  "name": "My Custom Detection",
  "pattern": "your regex pattern here",
  "severity": "high|medium|low",
  "description": "What this detects"
}
```

Then rebuild: `npm run build`

## License

MIT


