# IsotopeAI — Windows installer (PowerShell)
# ──────────────────────────────────────────────────────────────────────────────
# One-line install (PowerShell 5.1+, run from anywhere):
#   irm https://raw.githubusercontent.com/Suydev/isotope-code/main/install.ps1 | iex
#
# Or from inside the cloned repo:
#   .\install.ps1 [-Port 3000] [-NoStart] [-Branch main] [-Dir <target>]
#
# What it does:
#   1. Ensures Node.js 18+ and Git are installed (winget when possible)
#   2. Clones (or updates) the repo from GitHub main into ~\isotope-code
#   3. Creates .env from .env.example and validates the Supabase config
#   4. Runs npm install and checks server.mjs syntax
#   5. Installs the `isotope` command (isotope.bat / isotope.ps1) into
#      %USERPROFILE%\isotope-bin and adds it to the user PATH
#   6. Starts the server unless -NoStart is given
# ──────────────────────────────────────────────────────────────────────────────
param(
  [int]$Port = 3000,
  [switch]$NoStart,
  [string]$Branch = 'main',
  [string]$Dir = ''
)

$ErrorActionPreference = "Stop"
$REPO_URL = "https://github.com/Suydev/isotope-code.git"

function HasCommand($Name) {
  return [bool](Get-Command $Name -ErrorAction SilentlyContinue)
}

function Fail($Message) {
  Write-Error $Message
  exit 1
}

Write-Host ""
Write-Host "Isotope local-server setup"
Write-Host "This is a downloadable local app. Supabase is used only for cloud sync/backend services."
Write-Host ""

# ── Locate or clone the project ───────────────────────────────────────────────
$ProjectDir = $Dir
if (-not $ProjectDir) { $ProjectDir = $env:ISOTOPE_INSTALL_DIR }
if (-not $ProjectDir) { $ProjectDir = Join-Path $env:USERPROFILE "isotope-code" }
$ProjectDir = $ProjectDir.TrimEnd('\')

if (Test-Path (Join-Path $ProjectDir "server.mjs")) {
  Write-Host "Project found: $ProjectDir"
} else {
  if (-not (HasCommand git)) {
    Write-Host "Git was not found. Trying winget install..."
    if (HasCommand winget) {
      winget install -e --id Git.Git --accept-package-agreements --accept-source-agreements
    }
  }
  if (-not (HasCommand git)) {
    Fail "Git is required to download the app. Install it from https://git-scm.com and re-run."
  }
  if (Test-Path $ProjectDir) {
    Write-Host "Moving existing non-repo folder $ProjectDir to $ProjectDir.bak"
    Rename-Item $ProjectDir ("$ProjectDir.bak." + (Get-Date -Format "yyyyMMddHHmmss"))
  }
  Write-Host "Downloading IsotopeAI from GitHub ($Branch)..."
  git clone --branch $Branch --depth 20 $REPO_URL $ProjectDir
  if ($LASTEXITCODE -ne 0) { Fail "git clone failed. Check internet and try again." }
  Write-Host "Cloned to $ProjectDir"
}

Set-Location $ProjectDir

if (-not (Test-Path "server.mjs")) {
  Fail "server.mjs is missing after setup. Something went wrong."
}

# ── Node.js ───────────────────────────────────────────────────────────────────
if (-not (HasCommand node)) {
  Write-Host "Node.js was not found. Trying winget install..."
  if (HasCommand winget) {
    winget install -e --id OpenJS.NodeJS.LTS --accept-package-agreements --accept-source-agreements
  }
}

if (-not (HasCommand node)) {
  Fail "Node.js 18+ is required. Install it from https://nodejs.org and run install.ps1 again."
}

$nodeMajor = [int](node -e "process.stdout.write(process.versions.node.split('.')[0])")
if ($nodeMajor -lt 18) { Fail "Node.js 18+ is required." }
Write-Host "Node $(node --version) ready"

# ── .env ──────────────────────────────────────────────────────────────────────
if (Test-Path ".env") {
  Write-Host ".env exists."
} else {
  if (-not (Test-Path ".env.example")) { Fail ".env.example is missing." }
  Copy-Item ".env.example" ".env"
  Write-Host "Created .env from .env.example."
}

Write-Host ""
Write-Host "Supabase is used for auth, database, storage, realtime, and community sync."
Write-Host "It is not website hosting. The app runs locally through node server.mjs."
Write-Host "Edit .env if you want to use your own Supabase project."

node -e "const fs=require('fs');const txt=fs.readFileSync('.env','utf8');const get=k=>{for(const raw of txt.split(/\r?\n/)){const l=raw.trim();if(!l||l.startsWith('#'))continue;const i=l.indexOf('=');if(i<1)continue;if(l.slice(0,i).trim()===k)return l.slice(i+1).trim().replace(/^['\"]|['\"]$/g,'')}return''};const url=get('SUPABASE_URL'),anon=get('SUPABASE_ANON_KEY');if(!/^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(url)||anon.split('.').length<3){console.error('Invalid Supabase public config. Edit .env and run install.ps1 again.');process.exit(1)}"
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
Write-Host "Supabase cloud sync config is present. Secrets were not printed."

# ── npm install + syntax check ────────────────────────────────────────────────
if ((Test-Path "package.json") -and (HasCommand npm)) {
  npm install
}

node --check server.mjs
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

# ── Install the isotope command ───────────────────────────────────────────────
$isoHome = Join-Path $env:USERPROFILE ".isotope"
$isoBin = Join-Path $env:USERPROFILE "isotope-bin"
New-Item -ItemType Directory -Force -Path $isoHome | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $isoHome "logs") | Out-Null
New-Item -ItemType Directory -Force -Path $isoBin | Out-Null
Set-Content -Path (Join-Path $isoHome "project-path") -Value (Get-Location).Path
Copy-Item "bin\isotope.bat" (Join-Path $isoBin "isotope.bat") -Force
if (Test-Path "bin\isotope.ps1") {
  Copy-Item "bin\isotope.ps1" (Join-Path $isoBin "isotope.ps1") -Force
}
if (-not (Test-Path (Join-Path $isoBin "isotope.cmd"))) {
  Set-Content -Path (Join-Path $isoBin "isotope.cmd") -Value "@echo off`r`nsetlocal`r`npowershell -NoProfile -ExecutionPolicy Bypass -File `"%~dp0isotope.ps1`" %*"
}

# Add to user PATH if missing (no manual step needed)
$userPath = [Environment]::GetEnvironmentVariable("Path", "User")
if ($userPath -notlike "*$isoBin*") {
  [Environment]::SetEnvironmentVariable("Path", "$userPath;$isoBin", "User")
  $env:Path = "$env:Path;$isoBin"
  Write-Host "Added to user PATH: $isoBin"
}
# Make sure the current session sees the command
$env:Path = "$env:Path;$isoBin"

Write-Host ""
Write-Host "Installed command: $(Join-Path $isoBin "isotope.bat")"
Write-Host "Commands:"
Write-Host "  isotope start"
Write-Host "  isotope update"
Write-Host "  isotope doctor"
Write-Host ""

if (-not $NoStart) {
  $env:PORT = "$Port"
  & (Join-Path $isoBin "isotope.bat") start
} else {
  Write-Host "Start later with: isotope start"
}
