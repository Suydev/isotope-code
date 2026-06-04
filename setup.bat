@echo off
setlocal enabledelayedexpansion

set PORT_VALUE=5000
if not "%PORT%"=="" set PORT_VALUE=%PORT%
set NO_START=0
if "%1"=="--no-start" set NO_START=1

echo.
echo Isotope local app setup
echo This installs a local server. Supabase provides shared cloud sync.
echo Working directory: %CD%
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js was not found. Trying winget install...
  where winget >nul 2>nul
  if not errorlevel 1 (
    winget install -e --id OpenJS.NodeJS.LTS --accept-package-agreements --accept-source-agreements
  )
)

where git >nul 2>nul
if errorlevel 1 (
  echo Git was not found. Trying winget install...
  where winget >nul 2>nul
  if not errorlevel 1 (
    winget install -e --id Git.Git --accept-package-agreements --accept-source-agreements
  )
)

where node >nul 2>nul
if errorlevel 1 (
  echo ERROR: Node.js 18+ is required. Install it from https://nodejs.org then run setup.bat again.
  pause
  exit /b 1
)

for /f %%v in ('node -e "process.stdout.write(process.versions.node.split('.')[0])"') do set NODE_MAJOR=%%v
if %NODE_MAJOR% LSS 18 (
  echo ERROR: Node.js 18+ is required.
  pause
  exit /b 1
)
node --version

where git >nul 2>nul
if errorlevel 1 (
  echo WARN: Git is not installed. Updates from GitHub will require Git.
) else (
  echo Git ready.
)

if not exist .env (
  if not exist .env.example (
    echo ERROR: .env.example is missing.
    pause
    exit /b 1
  )
  copy .env.example .env >nul
  echo Created .env with the default Isotope cloud sync settings.
)

node -e "const fs=require('fs');const txt=fs.readFileSync('.env','utf8');const get=k=>{for(const raw of txt.split(/\r?\n/)){const l=raw.trim();if(!l||l.startsWith('#'))continue;const i=l.indexOf('=');if(i<1)continue;if(l.slice(0,i).trim()===k)return l.slice(i+1).trim().replace(/^['\"]|['\"]$/g,'')}return''};const url=get('SUPABASE_URL'),anon=get('SUPABASE_ANON_KEY');if(!/^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(url)||anon.split('.').length<3){console.error('Invalid .env Supabase public config. Restore .env.example or edit .env.');process.exit(1)}"
if errorlevel 1 (
  pause
  exit /b 1
)
echo Cloud sync config ready.

if exist package.json (
  where npm >nul 2>nul
  if not errorlevel 1 (
    npm install
  ) else (
    echo WARN: npm not found. The server has no external runtime dependency.
  )
)

node --check server.mjs
if errorlevel 1 (
  pause
  exit /b 1
)

echo.
echo Setup complete.
echo Local URL: http://localhost:%PORT_VALUE%
echo Stop the server with Ctrl+C.
echo.

if "%NO_START%"=="0" (
  set PORT=%PORT_VALUE%
  node server.mjs
) else (
  echo Start later with: set PORT=%PORT_VALUE% ^&^& node server.mjs
  pause
)
