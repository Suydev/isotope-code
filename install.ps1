param(
  [int]$Port = 5000,
  [switch]$NoStart
)

$ErrorActionPreference = "Stop"

function Fail($Message) {
  Write-Error $Message
  exit 1
}

function HasCommand($Name) {
  return [bool](Get-Command $Name -ErrorAction SilentlyContinue)
}

Write-Host ""
Write-Host "Isotope local app setup"
Write-Host "This installs a local server. Supabase provides shared cloud sync."
Write-Host "Working directory: $(Get-Location)"
Write-Host ""

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
  Fail "Node.js 18+ is required. Install it from https://nodejs.org then run install.ps1 again."
}

$nodeMajor = node -e "process.stdout.write(process.versions.node.split('.')[0])"
if ([int]$nodeMajor -lt 18) {
  Fail "Node.js 18+ is required."
}
node --version

if (-not (HasCommand git)) {
  Write-Host "WARN: Git is not installed. Updates from GitHub will require Git."
} else {
  Write-Host "Git ready."
}

if (-not (Test-Path ".env")) {
  if (-not (Test-Path ".env.example")) { Fail ".env.example is missing." }
  Copy-Item ".env.example" ".env"
  Write-Host "Created .env with the default Isotope cloud sync settings."
}

node -e "const fs=require('fs');const txt=fs.readFileSync('.env','utf8');const get=k=>{for(const raw of txt.split(/\r?\n/)){const l=raw.trim();if(!l||l.startsWith('#'))continue;const i=l.indexOf('=');if(i<1)continue;if(l.slice(0,i).trim()===k)return l.slice(i+1).trim().replace(/^['\"]|['\"]$/g,'')}return''};const url=get('SUPABASE_URL'),anon=get('SUPABASE_ANON_KEY');if(!/^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(url)||anon.split('.').length<3){console.error('Invalid .env Supabase public config. Restore .env.example or edit .env.');process.exit(1)}"
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
Write-Host "Cloud sync config ready."

if ((Test-Path "package.json") -and (HasCommand npm)) {
  npm install
}

node --check server.mjs
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host ""
Write-Host "Setup complete."
Write-Host "Local URL: http://localhost:$Port"
Write-Host "Stop the server with Ctrl+C."
Write-Host ""

if (-not $NoStart) {
  $env:PORT = "$Port"
  node server.mjs
} else {
  Write-Host "Start later with: `$env:PORT=$Port; node server.mjs"
}
