@echo off
setlocal

set ISOTOPE_PROJECT_DIR=%~dp0
if "%ISOTOPE_PROJECT_DIR:~-1%"=="\" set ISOTOPE_PROJECT_DIR=%ISOTOPE_PROJECT_DIR:~0,-1%

where isotope >nul 2>nul
if not errorlevel 1 (
  isotope update
  exit /b %ERRORLEVEL%
)

if exist "%ISOTOPE_PROJECT_DIR%\bin\isotope.bat" (
  call "%ISOTOPE_PROJECT_DIR%\bin\isotope.bat" update
  exit /b %ERRORLEVEL%
)

echo ERROR: isotope command is not installed. Run setup.bat first.
pause
exit /b 1
