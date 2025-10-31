@echo off
echo ========================================
echo   Prompt Firewall - Build Script
echo ========================================
echo.

:: Check if Node.js is installed
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed or not in PATH
    echo.
    echo Please install Node.js from: https://nodejs.org/
    echo Choose the LTS version ^(20+^)
    echo.
    echo After installation, restart this terminal and run this script again.
    pause
    exit /b 1
)

:: Show Node.js version
echo [INFO] Node.js version:
node --version
echo.

:: Check if npm is available
where npm >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] npm is not found
    echo Please reinstall Node.js
    pause
    exit /b 1
)

echo [INFO] npm version:
npm --version
echo.

:: Step 1: Install dependencies
echo ========================================
echo Step 1: Installing dependencies...
echo ========================================
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install dependencies
    pause
    exit /b 1
)
echo [SUCCESS] Dependencies installed
echo.

:: Step 2: Build extension
echo ========================================
echo Step 2: Building extension...
echo ========================================
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Build failed
    pause
    exit /b 1
)
echo [SUCCESS] Extension built successfully
echo.

:: Check if dist folder exists
if exist "apps\extension\dist\" (
    echo ========================================
    echo   BUILD COMPLETE!
    echo ========================================
    echo.
    echo Extension is ready at: apps\extension\dist\
    echo.
    echo NEXT STEPS:
    echo 1. Open Chrome/Edge and go to chrome://extensions/
    echo 2. Enable "Developer mode" ^(toggle in top-right^)
    echo 3. Click "Load unpacked"
    echo 4. Select the folder: apps\extension\dist\
    echo 5. Test with files in test-pages\ folder
    echo.
    echo See QUICK-START.md for detailed instructions
    echo.
) else (
    echo [ERROR] dist folder not found - build may have failed
    echo Check the error messages above
    echo.
)

pause


