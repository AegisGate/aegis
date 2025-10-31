# 🚀 Quick Start Guide

## Step 1: Install Node.js (if not already installed)

Check if you have Node.js:
```bash
node --version
npm --version
```

If not installed, download from: **https://nodejs.org/** (choose LTS version 20+)

After installation, **restart your terminal/PowerShell** to refresh the PATH.

---

## Step 2: Build the Extension

### Option A: Automatic Build (Recommended)

```bash
# From project root
npm install
npm run build
```

This will:
- ✅ Install dependencies
- ✅ Create PNG icons
- ✅ Compile TypeScript to JavaScript
- ✅ Copy all assets to `apps/extension/dist/`

### Option B: Manual Build (if npm not in PATH)

1. **Install TypeScript globally:**
   ```bash
   npm install -g typescript
   ```

2. **Navigate to extension directory:**
   ```bash
   cd apps/extension
   ```

3. **Install extension dependencies:**
   ```bash
   npm install
   ```

4. **Create icons:**
   ```bash
   node scripts/create-simple-icons.js
   ```

5. **Compile TypeScript:**
   ```bash
   tsc
   ```

6. **Copy assets:**
   ```bash
   node scripts/copy-assets.js
   ```

7. **Done!** The `dist/` folder is ready.

---

## Step 3: Load Extension in Browser

### Chrome / Edge / Brave

1. Open extensions page:
   - **Chrome:** `chrome://extensions/`
   - **Edge:** `edge://extensions/`
   - **Brave:** `brave://extensions/`

2. **Enable "Developer mode"** (toggle switch in top-right)

3. Click **"Load unpacked"** button

4. Navigate to and select: `apps/extension/dist/`

5. **Done!** The Prompt Firewall icon should appear in your toolbar 🛡️

### Troubleshooting Extension Load

If you see errors:

- **"Manifest file is missing or unreadable"**
  → Make sure you selected the `dist` folder, not the `apps/extension` folder

- **"Icons not found"**
  → Run icon creation: `node apps/extension/scripts/create-simple-icons.js`

- **"Background service worker error"**
  → Check that TypeScript compiled: verify `dist/background.js` exists

---

## Step 4: Test the Extension

### Quick Test

1. **Open test pages:**
   - Navigate to `test-pages/` folder in your file system
   - Drag and drop `test-1-override.html` into your browser
   - Or right-click → Open with → Chrome/Edge

2. **Check for warning banner:**
   - A red banner should appear at the top: "⚠️ Prompt Firewall: X potential prompt injections detected"

3. **Click the extension icon:**
   - Should show HIGH risk (red)
   - Display detection statistics
   - List detected threats

### Test All Pages

Run through all 5 test pages:

| Test File | Expected Result |
|-----------|----------------|
| test-1-override.html | 🔴 HIGH risk, 2-3 detections |
| test-2-jailbreak.html | 🔴 HIGH risk, 3-4 detections |
| test-3-clean.html | 🟢 SAFE, 0 detections |
| test-4-system-injection.html | 🔴 HIGH risk, 3-5 detections |
| test-5-credentials.html | 🔴 HIGH risk, 2-4 detections |

See `test-pages/README.md` for detailed testing instructions.

---

## Step 5: Try It on Real Websites

Visit any website and:
- The extension scans automatically on page load
- Click the extension icon to see results
- Badge shows number of detections (if any)

**Note:** Most normal websites will show SAFE (green) with 0 detections.

---

## Common Issues & Solutions

### Issue: "npm not recognized"

**Solution:** Add Node.js to your PATH or use full path:
```powershell
# Windows - find npm location
where.exe npm

# Use full path if needed
C:\Program Files\nodejs\npm.cmd install
```

Or restart your terminal after installing Node.js.

### Issue: TypeScript compilation errors

**Solution:** Make sure you're in the correct directory:
```bash
cd apps/extension
npm install
npx tsc
```

### Issue: Extension doesn't scan pages

**Solutions:**
1. Check that protection is enabled (toggle in popup)
2. Refresh the page after loading extension
3. Check console (F12) for errors
4. Verify `dist/content.js` exists

### Issue: No icons visible

**Solution:** Create icons manually:
```bash
cd apps/extension
node scripts/create-simple-icons.js
```

Or create your own 16x16, 48x48, and 128x128 PNG files and place them in `public/icons/`.

---

## Development Mode

For active development with auto-rebuild:

```bash
# Terminal 1: Watch TypeScript
cd apps/extension
npx tsc --watch

# Terminal 2: Your code editor
# Make changes to .ts files

# Browser: After changes
# Go to chrome://extensions/ and click refresh icon on extension
```

---

## Next Steps

✅ **Built and loaded?** Great! Now:

1. **Test all 5 test pages** to verify detection
2. **Visit real websites** to see it in action
3. **Customize rules** in `apps/extension/public/rules/core.json`
4. **Share feedback** or contribute improvements

---

## File Structure Check

After building, your `apps/extension/dist/` should contain:

```
dist/
├── manifest.json          ✅
├── background.js          ✅ (compiled from .ts)
├── content.js             ✅ (compiled from .ts)
├── popup.html             ✅
├── popup.css              ✅
├── popup.js               ✅ (compiled from .ts)
├── utils/
│   ├── types.js           ✅
│   └── scanner.js         ✅
├── icons/
│   ├── icon-16.png        ✅
│   ├── icon-48.png        ✅
│   └── icon-128.png       ✅
└── rules/
    └── core.json          ✅
```

If any files are missing, revisit the build steps.

---

## Getting Help

- **Build issues:** See `BUILD.md`
- **Testing details:** See `apps/extension/TESTING.md`
- **Project overview:** See `SUMMARY.md`
- **Technical docs:** See `README.md`

**Ready to protect AI agents from prompt injections!** 🛡️

