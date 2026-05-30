@echo off
cd /d "%~dp0.."
echo.
echo ╔══════════════════════════════════════╗
echo ║  IsotopeAI Self-Host — Windows       ║
echo ╚══════════════════════════════════════╝
echo.

if exist .env (
  for /f "usebackq tokens=1,* delims==" %%A in (".env") do (
    if not "%%A"=="" if not "%%A:~0,1%"=="#" set "%%A=%%B"
  )
)

if "%PORT%"=="" set PORT=3000
echo Starting on http://localhost:%PORT%
echo.
start "" "http://localhost:%PORT%"
node server.mjs
pause
