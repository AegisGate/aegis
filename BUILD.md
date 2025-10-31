# Building Prompt Firewall Extension

## Prerequisites

- **Node.js 20+** and **npm** must be installed and available in your PATH
- A Chromium-based browser (Chrome, Edge, Brave, etc.)

## Build Steps

### 1. Install Dependencies

From the project root:

```bash
npm install
```

This will install dependencies for all workspaces, including the extension.

### 2. Build the Extension

```bash
npm run build
```

This will:
- Create placeholder PNG icons
- Compile TypeScript to JavaScript
- Copy all assets (manifest.json, HTML, CSS, rules, icons) to `apps/extension/dist/`

### 3. Load in Browser

#### Chrome / Edge / Brave

1. Open your browser's extensions page:
   - Chrome: `chrome://extensions/`
   - Edge: `edge://extensions/`
   - Brave: `brave://extensions/`

2. Enable **"Developer mode"** (toggle switch, usually in top-right corner)

3. Click **"Load unpacked"**

4. Navigate to and select: `apps/extension/dist/`

5. The Prompt Firewall extension should now appear in your toolbar!

### 4. Test It

1. Visit any webpage
2. Click the Prompt Firewall extension icon
3. View the scan results in the popup

## Development Mode

For active development with automatic rebuilds on file changes:

```bash
npm run watch
```

After making changes:
1. Save your files
2. Go to `chrome://extensions/`
3. Click the refresh icon on the Prompt Firewall extension card
4. Test your changes

## Build Output

After building, the `apps/extension/dist/` folder will contain:

```
dist/
├── manifest.json          # Extension configuration
├── background.js          # Service worker (compiled from TypeScript)
├── content.js             # Content script (compiled from TypeScript)
├── popup.html            # Popup HTML
├── popup.css             # Popup styles
├── popup.js              # Popup logic (compiled from TypeScript)
├── utils/                # Utility modules (compiled)
├── icons/                # Extension icons
│   ├── icon-16.png
│   ├── icon-48.png
│   └── icon-128.png
└── rules/                # Detection rules
    └── core.json         # 24+ detection patterns
```

## Troubleshooting

### "npm not found"

Make sure Node.js and npm are installed:

```bash
node --version  # Should show v20.x.x or higher
npm --version   # Should show v10.x.x or higher
```

If not installed, download from: https://nodejs.org/

### "TypeScript not found"

This should be handled by workspace dependencies. If you encounter issues:

```bash
cd apps/extension
npm install
npm run build
```

### Extension doesn't load

1. Check browser console for errors (`F12` → Console tab)
2. Verify all files exist in `apps/extension/dist/`
3. Check that `manifest.json` is valid JSON
4. Make sure PNG icons exist in `dist/icons/`

### Icons are missing or broken

Run the icon generation script manually:

```bash
cd apps/extension
node scripts/create-simple-icons.js
```

Or create your own icons (16x16, 48x48, 128x128 PNG files) and place them in `public/icons/`.

### Changes not reflecting

After editing code:
1. Run `npm run build` (or keep `npm run watch` running)
2. Go to `chrome://extensions/`
3. Click the refresh icon (circular arrow) on the Prompt Firewall card
4. Reload any open tabs where you want to test

### Content script not injecting

- Check that you've granted the extension permission to run on the website
- Some special pages (like `chrome://` URLs) don't allow extensions
- Check the browser console for errors

## Build Scripts Reference

| Script | Command | Description |
|--------|---------|-------------|
| Build extension | `npm run build` | Full build (icons + compile + copy assets) |
| Watch mode | `npm run watch` | Auto-rebuild on file changes |
| Build from extension dir | `cd apps/extension && npm run build` | Same as above, but from extension directory |

## Next Steps

After successfully loading the extension:

1. **Test on different websites** - Try various sites to see detections
2. **Check the popup** - Click the extension icon to view detailed results
3. **Customize rules** - Edit `apps/extension/public/rules/core.json` and rebuild
4. **View console logs** - Check background logs for debugging: `chrome://extensions/` → "Inspect views: Service Worker"

## Production Build

For a production-ready version:

1. **Replace placeholder icons** with professionally designed ones
2. **Test thoroughly** across different websites and browsers
3. **Optimize** rules for false positive rate
4. **Add proper error handling** for edge cases
5. **Package** for Chrome Web Store (requires ZIP of dist folder)

## License

MIT - See LICENSE file


