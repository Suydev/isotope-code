@echo off
setlocal enabledelayedexpansion

set ISO_HOME=%USERPROFILE%\.isotope
set PROJECT_PATH_FILE=%ISO_HOME%\project-path
set PID_FILE=%ISO_HOME%\isotope.pid
set PORT_FILE=%ISO_HOME%\port
set LOG_DIR=%ISO_HOME%\logs
set SERVER_LOG=%LOG_DIR%\server.log
set UPDATE_LOG=%LOG_DIR%\update.log
set DEFAULT_PORT=3000

if not exist "%ISO_HOME%" mkdir "%ISO_HOME%" >nul 2>nul
if not exist "%LOG_DIR%" mkdir "%LOG_DIR%" >nul 2>nul

set CMD=%1
if "%CMD%"=="" goto usage
if "%CMD%"=="help" goto usage
if "%CMD%"=="--help" goto usage
shift

call :resolve_project
if errorlevel 1 (
  if not "%CMD%"=="open" (
    echo ERROR: Could not find Isotope project. Run setup.bat from the project folder.
    exit /b 1
  )
)

if "%CMD%"=="start" goto start
if "%CMD%"=="stop" goto stop
if "%CMD%"=="restart" goto restart
if "%CMD%"=="update" goto update
if "%CMD%"=="status" goto status
if "%CMD%"=="doctor" goto doctor
if "%CMD%"=="open" goto open
if "%CMD%"=="logs" goto logs
goto usage

:resolve_project
if defined ISOTOPE_PROJECT_DIR (
  if exist "%ISOTOPE_PROJECT_DIR%\server.mjs" (
    set PROJECT_DIR=%ISOTOPE_PROJECT_DIR%
    >"%PROJECT_PATH_FILE%" echo %PROJECT_DIR%
    exit /b 0
  )
)
if exist "%PROJECT_PATH_FILE%" (
  set /p PROJECT_DIR=<"%PROJECT_PATH_FILE%"
  if exist "!PROJECT_DIR!\server.mjs" exit /b 0
)
if exist "%CD%\server.mjs" (
  set PROJECT_DIR=%CD%
  >"%PROJECT_PATH_FILE%" echo %PROJECT_DIR%
  exit /b 0
)
if exist "%USERPROFILE%\isotope\server.mjs" (
  set PROJECT_DIR=%USERPROFILE%\isotope
  >"%PROJECT_PATH_FILE%" echo %PROJECT_DIR%
  exit /b 0
)
exit /b 1

:read_port
set PORT_VALUE=%DEFAULT_PORT%
if exist "%PROJECT_DIR%\.env" (
  for /f "usebackq tokens=1,* delims==" %%a in ("%PROJECT_DIR%\.env") do (
    if "%%a"=="PORT" set PORT_VALUE=%%b
  )
)
if exist "%PORT_FILE%" (
  set /p PORT_VALUE=<"%PORT_FILE%"
)
if "%PORT_VALUE%"=="" set PORT_VALUE=%DEFAULT_PORT%
exit /b 0

:is_running
set RUNNING=0
if exist "%PID_FILE%" (
  set /p PID_VALUE=<"%PID_FILE%"
  if not "!PID_VALUE!"=="" (
    tasklist /FI "PID eq !PID_VALUE!" 2>nul | findstr /R /C:" !PID_VALUE! " >nul && set RUNNING=1
  )
)
exit /b 0

:start
where node >nul 2>nul
if errorlevel 1 (
  echo ERROR: Node.js 18+ is required.
  exit /b 1
)
call :is_running
call :read_port
if "%RUNNING%"=="1" (
  echo Isotope is already running.
  echo PID: %PID_VALUE%
  echo Local URL: http://127.0.0.1:%PORT_VALUE%
  exit /b 0
)
echo Starting Isotope from: %PROJECT_DIR%
echo Logs: %SERVER_LOG%
powershell -NoProfile -ExecutionPolicy Bypass -Command "$p=Start-Process -FilePath 'node' -ArgumentList 'server.mjs' -WorkingDirectory '%PROJECT_DIR%' -RedirectStandardOutput '%SERVER_LOG%' -RedirectStandardError '%SERVER_LOG%.err' -WindowStyle Minimized -PassThru; Set-Content -Path '%PID_FILE%' -Value $p.Id"
if errorlevel 1 exit /b 1
>"%PORT_FILE%" echo %PORT_VALUE%
timeout /t 2 /nobreak >nul
echo Isotope started.
echo Local URL: http://127.0.0.1:%PORT_VALUE%
call :open
exit /b 0

:stop
call :is_running
if not "%RUNNING%"=="1" (
  if exist "%PID_FILE%" del "%PID_FILE%" >nul 2>nul
  echo Isotope is not running.
  exit /b 0
)
echo Stopping Isotope PID %PID_VALUE%...
taskkill /PID %PID_VALUE% >nul 2>nul
timeout /t 2 /nobreak >nul
tasklist /FI "PID eq %PID_VALUE%" 2>nul | findstr /R /C:" %PID_VALUE% " >nul
if not errorlevel 1 taskkill /F /PID %PID_VALUE% >nul 2>nul
if exist "%PID_FILE%" del "%PID_FILE%" >nul 2>nul
echo Isotope stopped.
exit /b 0

:restart
call :stop
call :start
exit /b %ERRORLEVEL%

:update
where git >nul 2>nul
if errorlevel 1 (
  echo ERROR: Git is required for isotope update.
  exit /b 1
)
where node >nul 2>nul
if errorlevel 1 (
  echo ERROR: Node.js 18+ is required.
  exit /b 1
)
call :is_running
set WAS_RUNNING=%RUNNING%
>"%UPDATE_LOG%" echo Isotope update
pushd "%PROJECT_DIR%"
if not exist .git (
  echo ERROR: This project is not a Git checkout.>>"%UPDATE_LOG%"
  type "%UPDATE_LOG%"
  popd
  exit /b 1
)
git diff --quiet
set DIRTY=%ERRORLEVEL%
git diff --cached --quiet
if not "%ERRORLEVEL%"=="0" set DIRTY=1
for /f %%u in ('git ls-files --others --exclude-standard') do set DIRTY=1
if "%DIRTY%"=="1" (
  for /f %%t in ('node -e "const d=new Date();process.stdout.write(d.getFullYear()+String(d.getMonth()+1).padStart(2,'0')+String(d.getDate()).padStart(2,'0')+String(d.getHours()).padStart(2,'0')+String(d.getMinutes()).padStart(2,'0')+String(d.getSeconds()).padStart(2,'0'))"') do set STAMP=%%t
  set STASH_NAME=isotope-auto-stash-!STAMP!
  echo Local changes detected. Saving them as Git stash: !STASH_NAME!>>"%UPDATE_LOG%"
  git stash push -u -m "!STASH_NAME!" >>"%UPDATE_LOG%" 2>&1
)
for /f %%b in ('git rev-parse --abbrev-ref HEAD') do set BRANCH=%%b
echo Fetching origin/%BRANCH%...>>"%UPDATE_LOG%"
git fetch origin %BRANCH% >>"%UPDATE_LOG%" 2>&1
if errorlevel 1 goto update_fail
for /f %%s in ('git rev-parse HEAD') do set LOCAL_SHA=%%s
for /f %%s in ('git rev-parse origin/%BRANCH%') do set REMOTE_SHA=%%s
if "%LOCAL_SHA%"=="%REMOTE_SHA%" (
  echo Already up to date.>>"%UPDATE_LOG%"
) else (
  git merge-base --is-ancestor %LOCAL_SHA% %REMOTE_SHA% >>"%UPDATE_LOG%" 2>&1
  if errorlevel 1 goto update_fail
  git diff --name-only %LOCAL_SHA% %REMOTE_SHA% | findstr /R /C:"^package.json$" /C:"^package-lock.json$" >nul
  set PACKAGE_CHANGED=%ERRORLEVEL%
  git merge --ff-only %REMOTE_SHA% >>"%UPDATE_LOG%" 2>&1
  if errorlevel 1 goto update_fail
  if "%PACKAGE_CHANGED%"=="0" (
    where npm >nul 2>nul
    if not errorlevel 1 npm install >>"%UPDATE_LOG%" 2>&1
  )
)
if not exist .env if exist .env.example copy .env.example .env >nul
node --check server.mjs >>"%UPDATE_LOG%" 2>&1
if errorlevel 1 goto update_fail
node -e "const cp=require('child_process'),fs=require('fs');let sha='unknown',message='';try{sha=cp.execSync('git rev-parse HEAD').toString().trim()}catch{}try{message=cp.execSync('git log -1 --pretty=%%s').toString().trim()}catch{}fs.writeFileSync('VERSION',JSON.stringify({sha,message,updated_at:new Date().toISOString()},null,2)+'\n')"
echo Update complete.>>"%UPDATE_LOG%"
popd
type "%UPDATE_LOG%"
if "%WAS_RUNNING%"=="1" call :restart
if not "%WAS_RUNNING%"=="1" echo Start the app with: isotope start
exit /b 0

:update_fail
echo ERROR: Update failed. Your .env was not deleted.>>"%UPDATE_LOG%"
popd
type "%UPDATE_LOG%"
exit /b 1

:status
call :read_port
call :is_running
echo Project path: %PROJECT_DIR%
if "%RUNNING%"=="1" (echo Server running: yes) else (echo Server running: no)
if "%RUNNING%"=="1" echo PID: %PID_VALUE%
echo Port: %PORT_VALUE%
echo Local URL: http://127.0.0.1:%PORT_VALUE%
for /f %%v in ('node -e "const fs=require('fs');let v='unknown';try{v=JSON.parse(fs.readFileSync('%PROJECT_DIR:\=/%/package.json','utf8')).version}catch{}process.stdout.write(v)"') do echo Version: %%v
if exist "%PROJECT_DIR%\.env" (echo .env exists: yes) else (echo .env exists: no)
findstr /B /C:"SUPABASE_URL=" "%PROJECT_DIR%\.env" >nul 2>nul && echo Supabase URL: configured || echo Supabase URL: missing
findstr /B /C:"SUPABASE_ANON_KEY=" "%PROJECT_DIR%\.env" >nul 2>nul && echo Supabase anon key: configured || echo Supabase anon key: missing
findstr /B /C:"ENABLE_ADMIN_MODE=true" "%PROJECT_DIR%\.env" >nul 2>nul && echo Admin mode enabled: yes || echo Admin mode enabled: no
echo Logs: %SERVER_LOG%
exit /b 0

:doctor
echo Isotope doctor
where node >nul 2>nul && echo [ok] node || echo [missing] node
where npm >nul 2>nul && echo [ok] npm || echo [missing] npm
where git >nul 2>nul && echo [ok] git || echo [missing] git
if exist "%PROJECT_DIR%" (echo [ok] project path %PROJECT_DIR%) else echo [missing] project path
if exist "%PROJECT_DIR%\package.json" (echo [ok] package.json) else echo [missing] package.json
if exist "%PROJECT_DIR%\server.mjs" (echo [ok] server.mjs) else echo [missing] server.mjs
if exist "%PROJECT_DIR%\.env" (echo [ok] .env) else echo [missing] .env
if exist "%PROJECT_DIR%\public\sw.js" (echo [ok] PWA service worker) else echo [missing] PWA service worker
if exist "%PROJECT_DIR%\public\manifest.webmanifest" (echo [ok] PWA manifest) else echo [missing] PWA manifest
pushd "%PROJECT_DIR%"
node --check server.mjs >nul 2>nul && echo [ok] server syntax || echo [fail] server syntax
popd
exit /b 0

:open
call :read_port
call :is_running
if not "%RUNNING%"=="1" (
  echo WARN: Server is not responding on port %PORT_VALUE%. You may see a cached offline page.
  echo WARN: Start the server first with: isotope start
)
set URL=http://127.0.0.1:%PORT_VALUE%
start "" "%URL%" >nul 2>nul
if errorlevel 1 echo Open this in browser: %URL%
exit /b 0

:logs
if not exist "%SERVER_LOG%" (
  echo No server log yet: %SERVER_LOG%
  exit /b 0
)
powershell -NoProfile -Command "Get-Content -Path '%SERVER_LOG%' -Tail 80 | ForEach-Object { $_ -replace 'eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+','[redacted-jwt]' -replace 'sbp_[A-Za-z0-9_-]+','[redacted-token]' -replace 'gh[pousr]_[A-Za-z0-9_]+','[redacted-token]' }"
exit /b 0

:usage
echo Usage: isotope ^<command^>
echo.
echo Commands:
echo   start     Start the local Isotope server
echo   stop      Stop the managed local server
echo   restart   Stop, start, and open the local app
echo   update    Safely pull the latest GitHub version
echo   status    Show project, port, version, and config status
echo   doctor    Check dependencies and local app files
echo   open      Open the local app URL
echo   logs      Show recent server logs
exit /b 1
