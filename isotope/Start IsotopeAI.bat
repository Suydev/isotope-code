@echo off
setlocal EnableDelayedExpansion

:: ─────────────────────────────────────────────────────────────
::  IsotopeAI — Windows Launcher
::  Double-click this file to start the app.
::  Your browser will open automatically.
:: ─────────────────────────────────────────────────────────────

:: Self-relaunch in a minimized window so no ugly terminal pops up
if not "%LAUNCHED%"=="1" (
    set LAUNCHED=1
    start /min "" cmd /c "%~f0"
    exit /b
)

title IsotopeAI
cd /d "%~dp0"

echo.
echo   ┌─────────────────────────────────────────┐
echo   │           IsotopeAI Launcher            │
echo   └─────────────────────────────────────────┘
echo.

:: ── Check for Node.js ──────────────────────────────────────
where node >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo   [!] Node.js not found — attempting auto-install...
    echo.
    call :INSTALL_NODE
    if %ERRORLEVEL% neq 0 (
        echo   [!] Auto-install failed or was cancelled.
        pause
        exit /b 1
    )
)

:: Verify Node works
node --version >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo   [!] Node.js is installed but not responding.
    echo       Please restart your computer and try again.
    pause
    exit /b 1
)

for /f "tokens=*" %%v in ('node --version 2^>nul') do set NODE_VER=%%v
echo   [OK] Node.js %NODE_VER%
echo.

:: ── Check required files ──────────────────────────────────
if not exist "server.mjs" (
    echo   [!] server.mjs not found.
    echo       Make sure you extracted the full ZIP contents here.
    pause
    exit /b 1
)

if not exist "public\assets\" (
    echo   [!] public\assets folder missing.
    echo       Please re-download the ZIP from the releases page.
    pause
    exit /b 1
)

:: ── Open browser after 2 s ───────────────────────────────
echo   [..] Opening browser in 2 seconds...
start /b "" cmd /c "timeout /t 2 /nobreak >nul 2>&1 && start http://localhost:3000"

:: ── Start server ─────────────────────────────────────────
echo   [OK] Server starting — keep this window open while using the app.
echo.
echo         ┌───────────────────────────────────────┐
echo         │  Open your browser to:                │
echo         │  http://localhost:3000                │
echo         │                                       │
echo         │  Close this window to stop the app.   │
echo         └───────────────────────────────────────┘
echo.

node server.mjs
echo.
echo   Server stopped. Press any key to close.
pause >nul
exit /b

:: ════════════════════════════════════════════════════════════
:INSTALL_NODE
:: Auto-download and silently install Node.js LTS
:: Requires internet connection and administrator rights
powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "Add-Type -AssemblyName System.Windows.Forms; ^
   $r = [System.Windows.Forms.MessageBox]::Show( ^
     'Node.js is not installed on this computer.`n`nIsotopeAI needs it to run.`n`n[Yes] — Auto-install Node.js now (needs internet + admin rights)`n[No]  — Open download page to install manually', ^
     'IsotopeAI — Setup Required', ^
     [System.Windows.Forms.MessageBoxButtons]::YesNo, ^
     [System.Windows.Forms.MessageBoxIcon]::Information ^
   ); ^
   if ($r -eq 'Yes') { ^
     Write-Host '  Downloading Node.js LTS...'; ^
     $url = 'https://nodejs.org/dist/v20.19.0/node-v20.19.0-x64.msi'; ^
     $out = \"$env:TEMP\nodejs-setup.msi\"; ^
     (New-Object System.Net.WebClient).DownloadFile($url, $out); ^
     Write-Host '  Installing (may ask for admin rights)...'; ^
     Start-Process msiexec.exe -Wait -ArgumentList \"/i $out /quiet /passive\"; ^
     Remove-Item $out -Force -ErrorAction SilentlyContinue; ^
     Write-Host '  Done.'; ^
     exit 0 ^
   } else { ^
     Start-Process 'https://nodejs.org/en/download/'; ^
     Write-Host '  Opening download page...'; ^
     exit 1 ^
   }"
exit /b %ERRORLEVEL%
