#!/bin/bash

# Prompt Firewall - Build Script (macOS/Linux)

echo "========================================"
echo "  Prompt Firewall - Build Script"
echo "========================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "[ERROR] Node.js is not installed or not in PATH"
    echo ""
    echo "Please install Node.js from: https://nodejs.org/"
    echo "Choose the LTS version (20+)"
    echo ""
    echo "After installation, restart your terminal and run this script again."
    exit 1
fi

# Show Node.js version
echo "[INFO] Node.js version:"
node --version
echo ""

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo "[ERROR] npm is not found"
    echo "Please reinstall Node.js"
    exit 1
fi

echo "[INFO] npm version:"
npm --version
echo ""

# Step 1: Install dependencies
echo "========================================"
echo "Step 1: Installing dependencies..."
echo "========================================"
npm install
if [ $? -ne 0 ]; then
    echo "[ERROR] Failed to install dependencies"
    exit 1
fi
echo "[SUCCESS] Dependencies installed"
echo ""

# Step 2: Build extension
echo "========================================"
echo "Step 2: Building extension..."
echo "========================================"
npm run build
if [ $? -ne 0 ]; then
    echo "[ERROR] Build failed"
    exit 1
fi
echo "[SUCCESS] Extension built successfully"
echo ""

# Check if dist folder exists
if [ -d "apps/extension/dist" ]; then
    echo "========================================"
    echo "  BUILD COMPLETE!"
    echo "========================================"
    echo ""
    echo "Extension is ready at: apps/extension/dist/"
    echo ""
    echo "NEXT STEPS:"
    echo "1. Open Chrome/Edge and go to chrome://extensions/"
    echo "2. Enable 'Developer mode' (toggle in top-right)"
    echo "3. Click 'Load unpacked'"
    echo "4. Select the folder: apps/extension/dist/"
    echo "5. Test with files in test-pages/ folder"
    echo ""
    echo "See QUICK-START.md for detailed instructions"
    echo ""
else
    echo "[ERROR] dist folder not found - build may have failed"
    echo "Check the error messages above"
    echo ""
fi


