@echo off
setlocal enabledelayedexpansion

set "PROJECT_DIR=%~dp0"
set "PROJECT_DIR=%PROJECT_DIR:~0,-1%"

set "ISO_CMD="
where isotope >nul 2>nul
if not errorlevel 1 (
  set "ISO_CMD=isotope"
  goto :run
)

if exist "%PROJECT_DIR%\bin\isotope.bat" (
  set "ISO_CMD=%PROJECT_DIR%\bin\isotope.bat"
  goto :run
)

echo ERROR: isotope command is not installed.
echo Run setup.bat first to install the global command.
pause
exit /b 1

:run
%ISO_CMD% update
