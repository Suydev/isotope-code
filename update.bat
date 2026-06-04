@echo off
setlocal enabledelayedexpansion

echo.
echo IsotopeAI update
echo.

if not exist .git (
  echo ERROR: This directory is not a Git repository.
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
if errorlevel 1 (
  echo ERROR: Uncommitted changes detected. Commit or stash before updating.
  pause
  exit /b 1
)
git diff --cached --quiet
if errorlevel 1 (
  echo ERROR: Staged changes detected. Commit or stash before updating.
  pause
  exit /b 1
)

for /f %%b in ('git rev-parse --abbrev-ref HEAD') do set BRANCH=%%b
git fetch origin %BRANCH%
if errorlevel 1 (
  pause
  exit /b 1
)
git merge --ff-only origin/%BRANCH%
if errorlevel 1 (
  pause
  exit /b 1
)

if exist package.json (
  where pnpm >nul 2>nul
  if not errorlevel 1 (
    pnpm install
  ) else (
    where npm >nul 2>nul
    if not errorlevel 1 npm install
  )
)

node -e "const cp=require('child_process'),fs=require('fs');const sha=cp.execSync('git rev-parse HEAD').toString().trim();const message=cp.execSync('git log -1 --pretty=%%s').toString().trim();fs.writeFileSync('VERSION',JSON.stringify({sha,message,updated_at:new Date().toISOString()},null,2));"
node --check server.mjs
if errorlevel 1 (
  pause
  exit /b 1
)

echo.
echo Update complete. Restart your process manager, or stop and start: node server.mjs
pause
