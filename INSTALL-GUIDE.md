# 📦 How to Load the Extension in Chrome

## Step-by-Step Installation

### Step 1: Open Chrome Extensions Page

**Option A:** Type in the address bar:
```
chrome://extensions/
```

**Option B:** Click the menu:
1. Click the three dots (⋮) in top-right corner
2. Click "Extensions"
3. Click "Manage Extensions"

---

### Step 2: Enable Developer Mode

Look at the **top-right corner** of the Extensions page.

You'll see a toggle switch labeled **"Developer mode"**.

Click it to turn it **ON** (it should turn blue).

After enabling, three new buttons will appear:
- "Load unpacked"
- "Pack extension"
- "Update"

---

### Step 3: Click "Load unpacked"

Click the **"Load unpacked"** button (should be on the left side after enabling Developer mode).

A file browser window will open.

---

### Step 4: Navigate to the dist Folder

In the file browser, navigate to:

```
C:\Users\ashut\OneDrive\Documents\GitHub\prompt-firewall\apps\extension\dist
```

**Quick way:**
1. Copy the path above
2. Paste it into the address bar of the file browser
3. Press Enter

**Or navigate manually:**
1. Go to `OneDrive` → `Documents` → `GitHub` → `prompt-firewall`
2. Open `apps` folder
3. Open `extension` folder
4. **Select the `dist` folder** (don't go inside it)

---

### Step 5: Select the Folder

Make sure you're **selecting the `dist` folder itself**, not the files inside it.

Click **"Select Folder"** button.

---

### Step 6: Verify It Loaded

You should now see:

✅ **Extension card appears** on the Extensions page with:
- Name: "Prompt Firewall"
- Version: 0.1.0
- Description: "Detects and neutralizes prompt injection attacks..."
- Icon: Purple/blue shield

✅ **Extension icon** appears in your browser toolbar (top-right, next to address bar)

✅ **No error messages**

---

## 🎉 Success! Now What?

### Test It Immediately

1. **Open File Explorer** and navigate to:
   ```
   C:\Users\ashut\OneDrive\Documents\GitHub\prompt-firewall\test-pages
   ```

2. **Drag and drop** `test-1-override.html` into Chrome

3. **You should see:**
   - 🔴 Red banner at top: "⚠️ Prompt Firewall: X potential prompt injections detected"
   - 🔢 Badge on extension icon showing "2" or "3"

4. **Click the extension icon** to see:
   - HIGH risk indicator (red)
   - Detection statistics
   - List of threats found

---

## 📊 What the Extension Looks Like

### Extension Icon in Toolbar
- Small shield icon (🛡️)
- Badge with number when threats detected
- Click to open popup

### Popup Window
- **Header:** Purple gradient with toggle switch
- **Status:** Color-coded risk indicator
- **Stats:** Total, High, Medium, Low threat counts
- **List:** Detected threats with descriptions
- **Buttons:** Rescan Page, View Rules

### Warning Banner (on threat pages)
- Appears at very top of page
- Red (high risk) or Orange (medium risk)
- Shows threat count
- X button to close

---

## 🧪 Quick Test Checklist

- [ ] Extension appears in `chrome://extensions/`
- [ ] No errors shown
- [ ] Icon visible in toolbar
- [ ] Can click icon and see popup
- [ ] Open `test-1-override.html` → see red banner
- [ ] Badge shows number on icon
- [ ] Popup shows HIGH risk
- [ ] Open `test-3-clean.html` → see SAFE (green)
- [ ] No banner on clean page

---

## 🔧 Troubleshooting

### "Manifest file is missing or unreadable"
**Fix:** You selected the wrong folder. Select `dist` folder, not `apps/extension`.

### No icon appears in toolbar
**Fix:** 
1. Click the puzzle piece icon (🧩) in toolbar
2. Find "Prompt Firewall"
3. Click the pin icon to pin it

### Extension shows errors
**Fix:**
1. Check that all files exist in `dist/` folder
2. Try clicking "Refresh" button on extension card
3. Remove and re-add the extension

### No warning banner on test pages
**Fix:**
1. Check that extension is enabled (toggle in popup is ON)
2. Refresh the test page
3. Check browser console (F12) for errors

### Can't find test pages
**Fix:** They're at:
```
C:\Users\ashut\OneDrive\Documents\GitHub\prompt-firewall\test-pages\
```

---

## 🎯 After Installation

### Try All Test Pages

1. **test-1-override.html** → Should show HIGH risk, 2-3 detections
2. **test-2-jailbreak.html** → Should show HIGH risk, 3-4 detections
3. **test-3-clean.html** → Should show SAFE, 0 detections ✅
4. **test-4-system-injection.html** → Should show HIGH risk, 3-5 detections
5. **test-5-credentials.html** → Should show HIGH risk, 2-4 detections

### Test on Real Websites

Visit normal websites (Wikipedia, news sites, etc.) and verify:
- Extension works without issues
- Most normal sites show SAFE
- No false positives

### Explore Features

- Click "View Rules" to see all 24 detection rules
- Click "Rescan Page" to re-analyze current page
- Toggle protection off/on to test
- Check badge numbers match detection counts

---

## 📝 Notes

- Extension runs automatically on every page
- Badge appears only when threats detected
- All processing happens locally (no internet needed)
- Safe to use on any website
- Can be disabled anytime via toggle in popup

---

## 🆘 Need More Help?

See:
- **START-HERE.md** - Project overview
- **QUICK-START.md** - Build instructions
- **test-pages/README.md** - Testing guide
- **SUMMARY.md** - Technical details

---

**Ready to protect AI agents from prompt injections!** 🛡️

