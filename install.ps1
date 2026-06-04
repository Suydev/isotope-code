param(
  [int]$Port = 5000
)

$ErrorActionPreference = "Stop"

function Fail($Message) {
  Write-Error $Message
  exit 1
}

function Get-EnvValue($Key) {
  if (-not (Test-Path ".env")) { return "" }
  foreach ($raw in Get-Content ".env") {
    $line = $raw.Trim()
    if (-not $line -or $line.StartsWith("#") -or -not $line.Contains("=")) { continue }
    $idx = $line.IndexOf("=")
    if ($line.Substring(0, $idx).Trim() -eq $Key) {
      return $line.Substring($idx + 1).Trim().Trim('"').Trim("'")
    }
  }
  return ""
}

function Set-EnvValue($Key, $Value) {
  $lines = @()
  if (Test-Path ".env") { $lines = @(Get-Content ".env") }
  $seen = $false
  $next = foreach ($line in $lines) {
    $trim = $line.Trim()
    if (-not $trim -or $trim.StartsWith("#") -or -not $line.Contains("=")) {
      $line
      continue
    }
    $idx = $line.IndexOf("=")
    if ($line.Substring(0, $idx).Trim() -eq $Key) {
      $seen = $true
      "$Key=$Value"
    } else {
      $line
    }
  }
  if (-not $seen) { $next += "$Key=$Value" }
  Set-Content -Path ".env" -Value $next
}

Write-Host ""
Write-Host "Isotope PowerShell setup"
Write-Host "Working directory: $(Get-Location)"
Write-Host ""

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  Fail "Node.js 18+ is required. Install it from https://nodejs.org"
}

$nodeMajor = node -e "process.stdout.write(process.versions.node.split('.')[0])"
if ([int]$nodeMajor -lt 18) {
  Fail "Node.js 18+ is required."
}

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
  Write-Host "Git was not found. Updates from GitHub require Git."
}

if ((Test-Path "package.json") -and (Get-Command npm -ErrorAction SilentlyContinue)) {
  npm install
}

if (-not (Test-Path ".env")) {
  if (-not (Test-Path ".env.example")) {
    Fail ".env.example is missing."
  }
  Copy-Item ".env.example" ".env"
  Write-Host "Created .env from .env.example."
}

Write-Host "Normal user mode needs only Supabase URL and anon key."
if (-not (Get-EnvValue "SUPABASE_URL")) {
  Set-EnvValue "SUPABASE_URL" (Read-Host "Supabase URL")
}
if (-not (Get-EnvValue "SUPABASE_ANON_KEY")) {
  Set-EnvValue "SUPABASE_ANON_KEY" (Read-Host "Supabase anon key")
}

node -e "const fs=require('fs');const txt=fs.readFileSync('.env','utf8');const get=k=>{for(const raw of txt.split(/\r?\n/)){const l=raw.trim();if(!l||l.startsWith('#'))continue;const i=l.indexOf('=');if(i<1)continue;if(l.slice(0,i).trim()===k)return l.slice(i+1).trim().replace(/^['\"]|['\"]$/g,'')}return''};const missing=['SUPABASE_URL','SUPABASE_ANON_KEY'].filter(k=>!get(k)||get(k).includes('...')||get(k).includes('your-project-ref'));if(missing.length){console.error('Missing or placeholder values: '+missing.join(', '));process.exit(1)}"
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

node --check server.mjs
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host ""
Write-Host "Setup checks complete."
Write-Host "Start the server with: `$env:PORT=$Port; node server.mjs"
Write-Host "Open: http://localhost:$Port"
Write-Host "Admin mode is optional. Leave admin fields blank for normal use."
