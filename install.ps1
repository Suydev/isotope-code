param(
  [int]$Port = 3000,
  [switch]$NoStart
)

$ErrorActionPreference = "Stop"

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
Write-Host "Working directory: $(Get-Location)"
Write-Host ""

if (-not (Test-Path "server.mjs")) {
  Fail "Run install.ps1 from the Isotope project folder."
}

if (-not (HasCommand node)) {
  Write-Host "Node.js was not found. Trying winget install..."
  if (HasCommand winget) {
    winget install -e --id OpenJS.NodeJS.LTS --accept-package-agreements --accept-source-agreements
  }
}

if (-not (HasCommand git)) {
  Write-Host "Git was not found. Trying winget install..."
  if (HasCommand winget) {
    winget install -e --id Git.Git --accept-package-agreements --accept-source-agreements
  }
}

if (-not (HasCommand node)) {
  Fail "Node.js 18+ is required. Install it from https://nodejs.org and run install.ps1 again."
}

$nodeMajor = [int](node -e "process.stdout.write(process.versions.node.split('.')[0])")
if ($nodeMajor -lt 18) { Fail "Node.js 18+ is required." }
Write-Host "Node $(node --version) ready"

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

if ((Test-Path "package.json") -and (HasCommand npm)) {
  npm install
}

node --check server.mjs
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

$isoHome = Join-Path $env:USERPROFILE ".isotope"
$isoBin = Join-Path $env:USERPROFILE "isotope-bin"
New-Item -ItemType Directory -Force -Path $isoHome | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $isoHome "logs") | Out-Null
New-Item -ItemType Directory -Force -Path $isoBin | Out-Null
Set-Content -Path (Join-Path $isoHome "project-path") -Value (Get-Location).Path
Copy-Item "bin\isotope.bat" (Join-Path $isoBin "isotope.bat") -Force

Write-Host ""
Write-Host "Installed command: $(Join-Path $isoBin "isotope.bat")"
Write-Host "Add this folder to PATH if isotope is not recognized: $isoBin"
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
