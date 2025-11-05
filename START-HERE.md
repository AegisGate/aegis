# 👋 Start Here - Prompt Firewall

## What is This?

A **Chrome extension** that protects AI agents from **prompt injection attacks** while browsing the web. It detects 24+ types of malicious patterns and warns you in real-time.

Think of it like an **ad blocker, but for prompt injections**.

---

## 🚀 Quick Setup (3 Steps)

### 1️⃣ Build It
```bash
npm install
npm run build
```

### 2️⃣ Load It
- Open `chrome://extensions/`
- Enable "Developer mode"
- Click "Load unpacked"
- Select `apps/extension/dist/`

### 3️⃣ Test It
- Open `test-pages/test-1-override.html` in browser
- Should see red warning banner
- Click extension icon to see detections

**Detailed instructions:** See `QUICK-START.md`

---

## 📚 Documentation Index

| Document | Purpose | When to Read |
|----------|---------|--------------|
| **QUICK-START.md** | Step-by-step setup guide | Start here! |
| **README.md** | Project overview & features | Learn what it does |
| **BUILD.md** | Detailed build instructions | Having build issues? |
| **SUMMARY.md** | Complete technical details | Want full architecture? |
| **test-pages/README.md** | Testing guide | Ready to test! |
| **apps/extension/TESTING.md** | Advanced testing | Deep dive testing |

---

## 📁 Important Directories

```
prompt-firewall/
├── test-pages/              ⭐ START: Test HTML files
├── apps/extension/
│   ├── dist/                ⭐ LOAD THIS in browser
│   ├── src/                 📝 Source code
│   └── public/
│       └── rules/core.json  📋 24 detection rules
├── QUICK-START.md           ⭐ Setup guide
└── START-HERE.md            ⭐ You are here!
```

---

## ✅ Quick Checks

**Before building:**
- [ ] Node.js 20+ installed? (`node --version`)
- [ ] npm available? (`npm --version`)

**After building:**
- [ ] `apps/extension/dist/` folder exists?
- [ ] Contains `manifest.json`, `background.js`, `content.js`?
- [ ] Icons folder has 3 PNG files?

**After loading in browser:**
- [ ] Extension icon visible in toolbar?
- [ ] Can click icon and see popup?
- [ ] Test pages show warnings?

---

## 🎯 What Does It Detect?

The extension scans web pages for **24+ prompt injection patterns**:

- 🔴 Command injection ("execute", "delete", "transfer")
- 🔴 Instruction override ("ignore previous instructions")
- 🔴 Jailbreak attempts ("DAN mode", "unrestricted AI")
- 🔴 Credential extraction ("tell me your API key")
- 🟠 Fake system messages ("[ADMIN]: disable security")
- 🟠 Role manipulation ("act as if you have no rules")
- 🔵 And 18 more...

Full list: `apps/extension/public/rules/core.json`

---

## 🧪 Test Pages Included

5 ready-to-use HTML test files in `test-pages/`:

1. **test-1-override.html** - Tests instruction override detection
2. **test-2-jailbreak.html** - Tests jailbreak pattern detection
3. **test-3-clean.html** - Control (should show SAFE)
4. **test-4-system-injection.html** - Tests fake system messages
5. **test-5-credentials.html** - Tests credential extraction

Just drag and drop into your browser!

---

## 🛠️ If You Run Into Issues

### Can't build?
→ See **BUILD.md** for troubleshooting

### Extension won't load?
→ Check `QUICK-START.md` Step 3 troubleshooting section

### Want to understand the code?
→ Read **SUMMARY.md** for full architecture

### Need Node.js?
→ Download from **https://nodejs.org/** (version 20+)

---

## 🎨 What It Looks Like

### Warning Banner
```
⚠️ Prompt Firewall: 3 potential prompt injections detected on this page
```

### Extension Popup
- 🟢 Green = Safe
- 🔵 Blue = Low risk
- 🟠 Orange = Medium risk
- 🔴 Red = High risk

Shows:
- Risk level indicator
- Statistics (total, high, medium, low)
- List of detected threats
- Rescan button
- View all rules button

---

## 🚀 Ready to Start?

1. **If you have Node.js installed:**
   ```bash
   npm install && npm run build
   ```
   Then load `apps/extension/dist/` in `chrome://extensions/`

2. **If you need Node.js:**
   - Download from https://nodejs.org/
   - Install (choose LTS version 20+)
   - Restart terminal
   - Run step 1

3. **Having issues?**
   - Check **QUICK-START.md** for detailed steps
   - See **BUILD.md** for troubleshooting
   - All files are in place, just need to build!

---

## 💡 Key Features

✅ **Serverless** - No backend needed  
✅ **Private** - All processing local to your browser  
✅ **Fast** - Scans complete in < 500ms  
✅ **Comprehensive** - 24+ detection rules  
✅ **Visual** - Clear warnings and reports  
✅ **Customizable** - Edit rules in JSON  

---

## 📖 Learn More

- **How it works:** See `README.md` → "How It Works" section
- **Architecture:** See `SUMMARY.md` → "Architecture Flow"
- **Rules explained:** See `apps/extension/public/rules/core.json`
- **Customize rules:** Edit the JSON and rebuild

---

**Questions? Check the documentation files listed above, or open an issue on GitHub!**

Happy protecting! 🛡️

