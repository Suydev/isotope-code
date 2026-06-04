@echo off
setlocal enabledelayedexpansion

set PORT_VALUE=5000
if not "%PORT%"=="" set PORT_VALUE=%PORT%
set START_AFTER=0
if "%1"=="--start" set START_AFTER=1

echo.
echo Isotope update
echo This preserves your private .env and updates the local app files.
echo.

if not exist .git (
  echo ERROR: This directory is not a Git repository. Download the latest ZIP from GitHub instead.
  pause
  exit /b 1
)

where git >nul 2>nul
if errorlevel 1 (
  echo ERROR: Git is required for updates.
  pause
  exit /b 1
)

git diff --quiet
set DIRTY=%ERRORLEVEL%
git diff --cached --quiet
if not "%ERRORLEVEL%"=="0" set DIRTY=1
if "%DIRTY%"=="1" (
  for /f %%t in ('node -e "const d=new Date();process.stdout.write(d.getFullYear()+String(d.getMonth()+1).padStart(2,'0')+String(d.getDate()).padStart(2,'0')+String(d.getHours()).padStart(2,'0')+String(d.getMinutes()).padStart(2,'0')+String(d.getSeconds()).padStart(2,'0'))"') do set STAMP=%%t
  set STASH_NAME=isotope-auto-stash-!STAMP!
  echo Local changes detected. Saving them as a Git stash: !STASH_NAME!
  git stash push -u -m "!STASH_NAME!"
)

for /f %%b in ('git rev-parse --abbrev-ref HEAD') do set BRANCH=%%b
echo Current branch: %BRANCH%
git fetch origin %BRANCH%
if errorlevel 1 goto fail
git merge --ff-only origin/%BRANCH%
if errorlevel 1 goto fail

if exist package.json (
  where npm >nul 2>nul
  if not errorlevel 1 npm install
)

if not exist .env (
  if exist .env.example copy .env.example .env >nul
)

node --check server.mjs
if errorlevel 1 goto fail
node -e "const cp=require('child_process'),fs=require('fs');const sha=cp.execSync('git rev-parse HEAD').toString().trim();const message=cp.execSync('git log -1 --pretty=%%s').toString().trim();fs.writeFileSync('VERSION',JSON.stringify({sha,message,updated_at:new Date().toISOString()},null,2));"

echo.
echo Update complete.
if defined STASH_NAME echo Previous local changes are saved in stash: !STASH_NAME!
if "%START_AFTER%"=="1" (
  set PORT=%PORT_VALUE%
  node server.mjs
) else (
  echo Restart with: node server.mjs
  pause
)
exit /b 0

:fail
echo ERROR: Update failed. If a stash was created, your changes are safe in git stash.
pause
exit /b 1
