@echo off
setlocal enabledelayedexpansion

set PORT_VALUE=3000
set NO_START=0
if not "%PORT%"=="" set PORT_VALUE=%PORT%
if "%1"=="--no-start" set NO_START=1

echo.
echo Isotope local-server setup
echo This is a downloadable local app. Supabase is used only for cloud sync/backend services.
echo Working directory: %CD%
echo.

if not exist server.mjs (
  echo ERROR: Run setup.bat from the Isotope project folder.
  pause
  exit /b 1
)

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js was not found. Trying winget install...
  where winget >nul 2>nul
  if not errorlevel 1 winget install -e --id OpenJS.NodeJS.LTS --accept-package-agreements --accept-source-agreements
)

where git >nul 2>nul
if errorlevel 1 (
  echo Git was not found. Trying winget install...
  where winget >nul 2>nul
  if not errorlevel 1 winget install -e --id Git.Git --accept-package-agreements --accept-source-agreements
)

where node >nul 2>nul
if errorlevel 1 (
  echo ERROR: Node.js 18+ is required. Install it from https://nodejs.org and run setup.bat again.
  pause
  exit /b 1
)

for /f %%v in ('node -e "process.stdout.write(process.versions.node.split('.')[0])"') do set NODE_MAJOR=%%v
if %NODE_MAJOR% LSS 18 (
  echo ERROR: Node.js 18+ is required.
  pause
  exit /b 1
)
echo Node ready.

where npm >nul 2>nul && echo npm ready. || echo WARN: npm not found. npm install will be skipped.
where git >nul 2>nul && echo Git ready. || echo WARN: Git not found. isotope update needs Git.

if not exist .env (
  if not exist .env.example (
    echo ERROR: .env.example is missing.
    pause
    exit /b 1
  )
  copy .env.example .env >nul
  echo Created .env from .env.example.
)

echo.
echo Supabase is used for auth, database, storage, realtime, and community sync.
echo It is not website hosting. The app runs locally through node server.mjs.
echo.
echo Press Enter to keep existing .env values.
set /p NEW_SUPA_URL=SUPABASE_URL: 
if not "%NEW_SUPA_URL%"=="" node -e "const fs=require('fs');const f='.env',k='SUPABASE_URL',v=process.argv[1];let t=fs.readFileSync(f,'utf8').split(/\r?\n/),d=false;t=t.map(l=>{if(l.trim().startsWith(k+'=')){d=true;return k+'='+v}return l});if(!d)t.push(k+'='+v);fs.writeFileSync(f,t.join('\n').replace(/\n*$/,'\n'))" "%NEW_SUPA_URL%"
set /p NEW_ANON=SUPABASE_ANON_KEY: 
if not "%NEW_ANON%"=="" node -e "const fs=require('fs');const f='.env',k='SUPABASE_ANON_KEY',v=process.argv[1];let t=fs.readFileSync(f,'utf8').split(/\r?\n/),d=false;t=t.map(l=>{if(l.trim().startsWith(k+'=')){d=true;return k+'='+v}return l});if(!d)t.push(k+'='+v);fs.writeFileSync(f,t.join('\n').replace(/\n*$/,'\n'))" "%NEW_ANON%"

node -e "const fs=require('fs');const txt=fs.readFileSync('.env','utf8');const get=k=>{for(const raw of txt.split(/\r?\n/)){const l=raw.trim();if(!l||l.startsWith('#'))continue;const i=l.indexOf('=');if(i<1)continue;if(l.slice(0,i).trim()===k)return l.slice(i+1).trim().replace(/^['\"]|['\"]$/g,'')}return''};const url=get('SUPABASE_URL'),anon=get('SUPABASE_ANON_KEY');if(!/^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(url)||anon.split('.').length<3){console.error('Invalid Supabase public config. Edit .env and run setup.bat again.');process.exit(1)}"
if errorlevel 1 (
  pause
  exit /b 1
)
echo Supabase cloud sync config is present. Secrets were not printed.

if exist package.json (
  where npm >nul 2>nul
  if not errorlevel 1 npm install
)

node --check server.mjs
if errorlevel 1 (
  pause
  exit /b 1
)

set ISO_HOME=%USERPROFILE%\.isotope
set ISO_BIN=%USERPROFILE%\isotope-bin
if not exist "%ISO_HOME%" mkdir "%ISO_HOME%" >nul 2>nul
if not exist "%ISO_HOME%\logs" mkdir "%ISO_HOME%\logs" >nul 2>nul
if not exist "%ISO_BIN%" mkdir "%ISO_BIN%" >nul 2>nul
>"%ISO_HOME%\project-path" echo %CD%
copy bin\isotope.bat "%ISO_BIN%\isotope.bat" >nul
echo Installed command: %ISO_BIN%\isotope.bat
echo.
echo Add this folder to PATH if isotope is not recognized:
echo   %ISO_BIN%
echo You can always run:
echo   "%ISO_BIN%\isotope.bat" start

echo.
echo Setup complete.
echo Local URL: http://127.0.0.1:%PORT_VALUE%
echo.

if "%NO_START%"=="0" (
  set PORT=%PORT_VALUE%
  call "%ISO_BIN%\isotope.bat" start
) else (
  echo Start later with: isotope start
  pause
)
