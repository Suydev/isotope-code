@echo off
:: ╔══════════════════════════════════════════════════════════════════════════╗
:: ║  IsotopeAI — Windows Installer & Auto-Updater                           ║
:: ║  Credits: Arnav Singh (owner) · Suyash Prabh (developer)               ║
:: ║  Repo:    https://github.com/Suydev/isotope-code                        ║
:: ╚══════════════════════════════════════════════════════════════════════════╝
setlocal enabledelayedexpansion

set "REPO=Suydev/isotope-code"
set "INSTALL_DIR=%USERPROFILE%\.isotope"
set "VERSION_FILE=%INSTALL_DIR%\.version"
set "PORT=3000"
if defined PORT_OVERRIDE set "PORT=%PORT_OVERRIDE%"

echo.
echo  ==========================================
echo   IsotopeAI - Windows Installer v2.0
echo   by Arnav Singh ^& Suyash Prabh
echo  ==========================================
echo.

:: ── Check admin rights ───────────────────────────────────────────────────────
net session >nul 2>&1
if %errorlevel% neq 0 (
  echo [WARN] Not running as Administrator. Some installs may need elevation.
)

:: ── Check winget (Windows Package Manager) ───────────────────────────────────
where winget >nul 2>&1
set "HAS_WINGET=%errorlevel%"

:: ── Install Git ──────────────────────────────────────────────────────────────
where git >nul 2>&1
if %errorlevel% neq 0 (
  echo [INFO] Installing Git...
  if %HAS_WINGET% equ 0 (
    winget install --id Git.Git -e --source winget --accept-package-agreements --accept-source-agreements
  ) else (
    echo [INFO] Downloading Git installer...
    curl -L -o "%TEMP%\git-setup.exe" "https://github.com/git-for-windows/git/releases/download/v2.44.0.windows.1/Git-2.44.0-64-bit.exe"
    "%TEMP%\git-setup.exe" /VERYSILENT /NORESTART
    del "%TEMP%\git-setup.exe"
  )
  :: Refresh PATH
  call RefreshEnv.cmd >nul 2>&1
  set "PATH=%PATH%;C:\Program Files\Git\cmd"
  echo [OK] Git installed
) else (
  echo [OK] Git already installed
)

:: ── Install Node.js ───────────────────────────────────────────────────────────
where node >nul 2>&1
if %errorlevel% neq 0 (
  echo [INFO] Installing Node.js...
  if %HAS_WINGET% equ 0 (
    winget install --id OpenJS.NodeJS.LTS -e --source winget --accept-package-agreements --accept-source-agreements
  ) else (
    echo [INFO] Downloading Node.js installer...
    curl -L -o "%TEMP%\node-setup.msi" "https://nodejs.org/dist/v20.11.0/node-v20.11.0-x64.msi"
    msiexec /i "%TEMP%\node-setup.msi" /quiet /qn /norestart
    del "%TEMP%\node-setup.msi"
    set "PATH=%PATH%;C:\Program Files\nodejs"
  )
  echo [OK] Node.js installed
) else (
  for /f "tokens=*" %%v in ('node -v 2^>nul') do echo [OK] Node.js %%v already installed
)

:: ── Check for updates ─────────────────────────────────────────────────────────
echo [INFO] Checking for updates from GitHub...
for /f "tokens=2 delims=:, " %%v in ('curl -fsSL "https://api.github.com/repos/%REPO%/releases/latest" 2^>nul ^| findstr "tag_name"') do (
  set "LATEST=%%~v"
  set "LATEST=!LATEST:"=!"
  set "LATEST=!LATEST: =!"
  set "LATEST=!LATEST:v=!"
)

set "CURRENT=0.0.0"
if exist "%VERSION_FILE%" (
  set /p CURRENT=<"%VERSION_FILE%"
  set "CURRENT=!CURRENT:v=!"
)

if not defined LATEST (
  echo [WARN] Cannot reach GitHub. Using local install.
  goto :run_app
)

:: ── Install or update ─────────────────────────────────────────────────────────
if not exist "%INSTALL_DIR%\.git" (
  echo [INFO] Installing IsotopeAI...
  if exist "%INSTALL_DIR%" rmdir /s /q "%INSTALL_DIR%"
  git clone --depth 1 "https://github.com/%REPO%.git" "%INSTALL_DIR%"
  echo !LATEST!> "%VERSION_FILE%"
  echo [OK] Installed v!LATEST!
) else if "!LATEST!" neq "!CURRENT!" (
  echo [INFO] Updating v!CURRENT! to v!LATEST!...
  cd /d "%INSTALL_DIR%"
  git fetch --depth 1 origin main
  git reset --hard origin/main
  echo !LATEST!> "%VERSION_FILE%"
  echo [OK] Updated to v!LATEST!
) else (
  echo [OK] Already on latest version v!CURRENT!
)

:: ── Create desktop shortcut ───────────────────────────────────────────────────
echo [INFO] Creating desktop shortcut...
set "SHORTCUT=%USERPROFILE%\Desktop\IsotopeAI.bat"
(
  echo @echo off
  echo title IsotopeAI
  echo echo Starting IsotopeAI on http://localhost:%PORT%
  echo start "" "http://localhost:%PORT%"
  echo timeout /t 2 /nobreak ^>nul
  echo set "PORT=%PORT%"
  echo node "%INSTALL_DIR%\server.mjs"
  echo pause
) > "%SHORTCUT%"
echo [OK] Desktop shortcut created

:run_app
echo.
echo [OK] IsotopeAI is ready!
echo [INFO] Install dir: %INSTALL_DIR%
echo [INFO] Starting on http://localhost:%PORT%
echo.

:: Open browser and start server
timeout /t 2 /nobreak >nul
start "" "http://localhost:%PORT%"
cd /d "%INSTALL_DIR%"
set "PORT=%PORT%"
node server.mjs

endlocal
