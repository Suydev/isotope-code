<#
.SYNOPSIS
  IsotopeAI CLI (PowerShell) — Windows / PowerShell everywhere.

.DESCRIPTION
  Usage: .\isotope.ps1 <command>   (or: isotope <command> via isotope.cmd shim)

  Commands:
    start       Start the local IsotopeAI server (background)
    stop        Stop the managed local server
    restart     Stop, start, and open the local app
    update      Safely pull the latest GitHub version (main by default)
    status      Show project path, port, version, and config
    doctor      Full diagnostic — checks all dependencies
    open        Open http://127.0.0.1:<PORT> in browser
    logs        Show recent server log lines (secrets redacted)
    version     Print the installed version
    repair      Re-run dependency install and CLI reinstall
    help        Show this message

  Environment:
    ISOTOPE_BRANCH        Git branch used by `update` (default: main)
    ISOTOPE_HOME          Override state dir (~/.isotope)
    ISOTOPE_PROJECT_DIR   Override project dir auto-detection
#>
[CmdletBinding()]
param([string]$Command = '', [Parameter(ValueFromRemainingArguments = $true)]$Rest)

$ErrorActionPreference = 'Stop'

$DEFAULT_PORT = 3000
$ISO_HOME = if ($env:ISOTOPE_HOME) { $env:ISOTOPE_HOME } else { Join-Path $env:USERPROFILE '.isotope' }
$PROJECT_PATH_FILE = Join-Path $ISO_HOME 'project-path'
$PID_FILE = Join-Path $ISO_HOME 'isotope.pid'
$PORT_FILE = Join-Path $ISO_HOME 'port'
$LOG_DIR = Join-Path $ISO_HOME 'logs'
$SERVER_LOG = Join-Path $LOG_DIR 'server.log'
$UPDATE_LOG = Join-Path $LOG_DIR 'update.log'
$PROJECT_DIR = $null

function Write-Info($Msg) { Write-Host $Msg }
function Write-WarnMsg($Msg) { Write-Host "WARN: $Msg" -ForegroundColor Yellow }

function Test-Project($Dir) {
  return ($Dir -and (Test-Path (Join-Path $Dir 'server.mjs')) -and (Test-Path (Join-Path $Dir 'package.json')))
}

function Resolve-Project {
  if ($env:ISOTOPE_PROJECT_DIR -and (Test-Project $env:ISOTOPE_PROJECT_DIR)) {
    return $env:ISOTOPE_PROJECT_DIR
  }
  if (Test-Path $PROJECT_PATH_FILE) {
    $p = (Get-Content $PROJECT_PATH_FILE -TotalCount 1 -ErrorAction SilentlyContinue)
    if (Test-Project $p) { return $p }
  }
  $cwd = (Get-Location).Path
  $dir = $cwd
  while ($dir) {
    if (Test-Project $dir) { return $dir }
    $parent = Split-Path $dir -Parent
    if ($parent -eq $dir) { break }
    $dir = $parent
  }
  foreach ($try in @((Join-Path $env:USERPROFILE 'isotope-code'), (Join-Path $env:USERPROFILE 'isotope'))) {
    if (Test-Project $try) { return $try }
  }
  throw 'Could not find IsotopeAI project. Run setup from the project folder.'
}

function Get-EnvValue($File, $Key) {
  if (-not (Test-Path $File)) { return '' }
  foreach ($line in (Get-Content $File -ErrorAction SilentlyContinue)) {
    $l = $line.Trim()
    if (-not $l -or $l.StartsWith('#')) { continue }
    $i = $l.IndexOf('=')
    if ($i -lt 1) { continue }
    if ($l.Substring(0, $i).Trim() -eq $Key) {
      return $l.Substring($i + 1).Trim().Trim('"').Trim("'")
    }
  }
  return ''
}

function Get-ProjectPort($Dir) {
  $envPort = Get-EnvValue (Join-Path $Dir '.env') 'PORT'
  if ($envPort) { return $envPort }
  if (Test-Path $PORT_FILE) {
    $v = (Get-Content $PORT_FILE -TotalCount 1 -ErrorAction SilentlyContinue)
    if ($v) { return $v }
  }
  return "$DEFAULT_PORT"
}

function Test-Health($Url) {
  try {
    $r = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 2 -ErrorAction Stop
    return ($r.StatusCode -ge 200 -and $r.StatusCode -lt 500)
  } catch { return $false }
}

function Test-Running {
  if (-not (Test-Path $PID_FILE)) { return $false }
  $pidVal = (Get-Content $PID_FILE -TotalCount 1 -ErrorAction SilentlyContinue)
  if (-not $pidVal) { return $false }
  return [bool](Get-Process -Id $pidVal -ErrorAction SilentlyContinue)
}

function Get-ServerPid {
  if (Test-Path $PID_FILE) { return (Get-Content $PID_FILE -TotalCount 1 -ErrorAction SilentlyContinue) }
  return $null
}

function Open-Url([int]$Port = $DEFAULT_PORT) {
  $url = "http://127.0.0.1:$Port"
  try { Start-Process $url -ErrorAction Stop; return } catch {}
  Write-Info "Open in browser: $url"
}

function Invoke-Redact($Text) {
  return $Text -replace 'eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+', '[redacted-jwt]' `
                 -replace 'sbp_[A-Za-z0-9_-]+', '[redacted-token]' `
                 -replace 'gh[pousr]_[A-Za-z0-9_]+', '[redacted-token]'
}

# ── commands ──────────────────────────────────────────────────────────────────

function Cmd-Start {
  if (-not (Get-Command node -ErrorAction SilentlyContinue)) { throw 'Node.js 18+ is required.' }
  if (Test-Running) {
    $port = Get-ProjectPort $PROJECT_DIR
    Write-Info "IsotopeAI is already running (PID: $(Get-ServerPid))."
    Write-Info "Local URL: http://127.0.0.1:$port"
    return
  }
  $port = Get-ProjectPort $PROJECT_DIR
  Set-Content -Path $PORT_FILE -Value $port
  Write-Info "Starting IsotopeAI from: $PROJECT_DIR"
  Write-Info "Logs: $SERVER_LOG"
  $p = Start-Process -FilePath 'node' -ArgumentList 'server.mjs' -WorkingDirectory $PROJECT_DIR `
        -RedirectStandardOutput $SERVER_LOG -RedirectStandardError "$SERVER_LOG.err" -WindowStyle Hidden -PassThru
  Set-Content -Path $PID_FILE -Value $p.Id
  for ($i = 0; $i -lt 30; $i++) {
    Start-Sleep -Milliseconds 500
    if (Test-Health "http://127.0.0.1:$port/api/version") {
      Write-Info "IsotopeAI started. PID: $($p.Id)"
      Write-Info "Local URL: http://127.0.0.1:$port"
      Open-Url ([int]$port)
      return
    }
  }
  Write-WarnMsg 'Server did not respond to health checks in time. Check logs: isotope logs'
}

function Cmd-Stop {
  if (-not (Test-Running)) {
    if (Test-Path $PID_FILE) { Remove-Item $PID_FILE -Force }
    Write-Info 'IsotopeAI is not running.'
    return
  }
  $pidVal = Get-ServerPid
  Write-Info "Stopping IsotopeAI (PID $pidVal)..."
  try { Stop-Process -Id $pidVal -ErrorAction Stop } catch {}
  for ($i = 0; $i -lt 20; $i++) {
    Start-Sleep -Milliseconds 500
    if (-not (Get-Process -Id $pidVal -ErrorAction SilentlyContinue)) {
      if (Test-Path $PID_FILE) { Remove-Item $PID_FILE -Force }
      Write-Info 'IsotopeAI stopped.'
      return
    }
  }
  try { Stop-Process -Id $pidVal -Force -ErrorAction Stop } catch {}
  if (Test-Path $PID_FILE) { Remove-Item $PID_FILE -Force }
  Write-Info 'IsotopeAI stopped.'
}

function Cmd-Restart { Cmd-Stop; Cmd-Start }

function Cmd-Version {
  $pkg = Join-Path $PROJECT_DIR 'package.json'
  if (-not (Test-Path $pkg)) { Write-Info 'IsotopeAI (project not found)'; return }
  $ver = try { (Get-Content $pkg -Raw | ConvertFrom-Json).version } catch { 'unknown' }
  $sha = ''
  $vf = Join-Path $PROJECT_DIR 'VERSION'
  if (Test-Path $vf) {
    $sha = try { ' (sha: ' + ((Get-Content $vf -Raw | ConvertFrom-Json).sha.Substring(0, 8)) + ')' } catch { '' }
  }
  Write-Info "IsotopeAI v$ver$sha"
}

function Cmd-Status {
  $port = Get-ProjectPort $PROJECT_DIR
  $envFile = Join-Path $PROJECT_DIR '.env'
  $running = Test-Running
  Write-Info "Project: $PROJECT_DIR"
  if ($running) { Write-Info "Server:  running (PID: $(Get-ServerPid))" } else { Write-Info 'Server:  not running' }
  Write-Info "Port:    $port"
  Write-Info "URL:     http://127.0.0.1:$port"
  Cmd-Version
  Write-Info ".env:    $(if (Test-Path $envFile) { 'present' } else { 'missing' })"
  Write-Info "Supabase URL: $(if (Get-EnvValue $envFile 'SUPABASE_URL') { 'configured' } else { 'missing' })"
  Write-Info "Supabase key: $(if (Get-EnvValue $envFile 'SUPABASE_ANON_KEY') { 'configured' } else { 'missing' })"
  Write-Info "Logs: $SERVER_LOG"
}

function Cmd-Open {
  $port = Get-ProjectPort $PROJECT_DIR
  if (-not (Test-Health "http://127.0.0.1:$port/api/version")) {
    Write-WarnMsg "Server is not responding on port $port. Start it first: isotope start"
    return
  }
  Open-Url ([int]$port)
}

function Cmd-Logs {
  if (-not (Test-Path $SERVER_LOG)) { Write-Info "No server log yet: $SERVER_LOG"; return }
  Get-Content $SERVER_LOG -Tail 80 | ForEach-Object { Invoke-Redact $_ }
}

function Cmd-Doctor {
  Write-Info 'IsotopeAI doctor'
  Write-Info '─────────────────────────────────────'
  $check = {
    param($Ok, $Msg)
    if ($Ok) { Write-Host "[ok]  $Msg" } else { Write-Host "WARN: $Msg" -ForegroundColor Yellow }
  }
  & $check ([bool](Get-Command node -ErrorAction SilentlyContinue)) "node $((node --version 2>$null))"
  & $check ([bool](Get-Command npm -ErrorAction SilentlyContinue)) 'npm'
  & $check ([bool](Get-Command git -ErrorAction SilentlyContinue)) 'git (needed for isotope update)'
  & $check (Test-Path (Join-Path $PROJECT_DIR 'package.json')) 'package.json'
  & $check (Test-Path (Join-Path $PROJECT_DIR 'server.mjs')) 'server.mjs'
  & $check (Test-Path (Join-Path $PROJECT_DIR '.env')) '.env'
  & $check (Test-Path (Join-Path $PROJECT_DIR 'public\sw.js')) 'PWA service worker'
  & $check (Test-Path (Join-Path $PROJECT_DIR 'public\manifest.webmanifest')) 'PWA manifest'
  & $check ([bool](Get-Command isotope -ErrorAction SilentlyContinue)) 'isotope in PATH'
  $running = Test-Running
  if ($running) {
    & $check (Test-Health "http://127.0.0.1:$(Get-ProjectPort $PROJECT_DIR)/api/version") '/api/version responding'
  } else {
    & $check $false 'local server not running (start with: isotope start)'
  }
}

function Cmd-Repair {
  Write-Info 'IsotopeAI repair'
  Write-Info "Project: $PROJECT_DIR"
  $pkg = Join-Path $PROJECT_DIR 'package.json'
  if ((Test-Path $pkg) -and (Get-Command npm -ErrorAction SilentlyContinue)) {
    Push-Location $PROJECT_DIR
    try { npm install } catch { Write-WarnMsg 'npm install had errors.' }
    Pop-Location
  }
  New-Item -ItemType Directory -Force -Path $ISO_HOME, $LOG_DIR | Out-Null
  New-Item -ItemType Directory -Force -Path (Join-Path $env:USERPROFILE 'isotope-bin') | Out-Null
  Copy-Item (Join-Path $PROJECT_DIR 'bin\isotope.bat') (Join-Path $env:USERPROFILE 'isotope-bin\isotope.bat') -Force
  if (Test-Path (Join-Path $PROJECT_DIR 'bin\isotope.ps1')) {
    Copy-Item (Join-Path $PROJECT_DIR 'bin\isotope.ps1') (Join-Path $env:USERPROFILE 'isotope-bin\isotope.ps1') -Force
  }
  Set-Content -Path $PROJECT_PATH_FILE -Value $PROJECT_DIR
  Write-Info 'Repair complete. Run: isotope doctor'
}

function Cmd-Update {
  if (-not (Get-Command git -ErrorAction SilentlyContinue)) { throw 'Git is required for isotope update.' }
  if (-not (Test-Path (Join-Path $PROJECT_DIR '.git'))) { throw 'Not a Git checkout. Clone the repo or download the latest release.' }
  $wasRunning = Test-Running
  Write-Info 'IsotopeAI update'
  Write-Info "Project: $PROJECT_DIR"
  Write-Info 'Your .env will be preserved.'
  Push-Location $PROJECT_DIR
  try {
    $branch = (git rev-parse --abbrev-ref HEAD).Trim()
    if ($branch -eq 'HEAD') { throw 'Detached HEAD. Checkout a branch before updating.' }
    $channel = $env:ISOTOPE_BRANCH
    if (-not $channel) {
      git rev-parse --verify --quiet "refs/remotes/origin/$branch" 2>$null | Out-Null
      if ($LASTEXITCODE -ne 0) {
        $channel = 'main'
        Write-Info "Branch '$branch' has no remote — updating from origin/main (set ISOTOPE_BRANCH to override)."
      } else { $channel = $branch }
    }
    $branch = $channel
    $dirty = $false
    git diff --quiet; if ($LASTEXITCODE -ne 0) { $dirty = $true }
    git diff --cached --quiet; if ($LASTEXITCODE -ne 0) { $dirty = $true }
    $untracked = (git ls-files --others --exclude-standard) | Where-Object { $_ }
    if ($untracked) { $dirty = $true }
    $stashName = ''
    if ($dirty) {
      $stashName = 'isotope-auto-stash-' + (Get-Date -Format 'yyyyMMddHHmmss')
      Write-Info "Local changes detected — stashing as: $stashName"
      git stash push -u -m $stashName | Out-Null
      if ($LASTEXITCODE -ne 0) { throw 'Could not stash local changes.' }
    }
    try {
      Write-Info "Fetching origin/$branch..."
      git fetch origin $branch 2>&1 | Out-Null
      if ($LASTEXITCODE -ne 0) { throw 'git fetch failed. Check internet connection.' }
      $localSha = (git rev-parse HEAD).Trim()
      $remoteSha = (git rev-parse "origin/$branch").Trim()
      if ($localSha -eq $remoteSha) {
        Write-Info 'Already up to date.'
      } else {
        git merge-base --is-ancestor $localSha $remoteSha
        if ($LASTEXITCODE -ne 0) { throw 'Local branch has diverged. Your changes are safe. Update manually with Git.' }
        $pkgChanged = (git diff --name-only $localSha $remoteSha) -match '^(package\.json|package-lock\.json)$'
        Write-Info 'Applying fast-forward update...'
        git merge --ff-only $remoteSha | Out-Null
        if ($LASTEXITCODE -ne 0) { throw 'Fast-forward merge failed.' }
        if ($pkgChanged -and (Get-Command npm -ErrorAction SilentlyContinue)) {
          Write-Info 'Package files changed — running npm install...'
          npm install
        }
      }
    } finally {
      if ($stashName -and ((git stash list) -notmatch $stashName)) {
        Write-Info 'Restoring local changes...'
        git stash pop | Out-Null
      }
    }
    if (-not (Test-Path '.env') -and (Test-Path '.env.example')) {
      Copy-Item '.env.example' '.env'
      Write-Info 'Created .env from .env.example.'
    }
    node --check server.mjs
    if ($LASTEXITCODE -ne 0) { throw 'server.mjs syntax check failed after update.' }
    node -e "const cp=require('child_process'),fs=require('fs');let sha='unknown',message='';try{sha=cp.execSync('git rev-parse HEAD').toString().trim()}catch{}try{message=cp.execSync('git log -1 --pretty=%s').toString().trim()}catch{}let version='0.0.0';try{version=JSON.parse(fs.readFileSync('package.json','utf8')).version}catch{}fs.writeFileSync('VERSION',JSON.stringify({version,sha,message,updated_at:new Date().toISOString()},null,2)+'\n')"
    Write-Info 'Update complete.'
  } finally {
    Pop-Location
  }
  if ($wasRunning) { Cmd-Restart } else { Write-Info 'Start with: isotope start' }
}

# ── usage ─────────────────────────────────────────────────────────────────────

function Show-Usage {
  Write-Host @'
Usage: isotope <command>

Commands:
  start      Start the local IsotopeAI server (background)
  stop       Stop the managed local server
  restart    Stop, start, and open the local app
  update     Safely pull the latest GitHub version (main by default)
  status     Show project path, port, version, and config
  doctor     Full diagnostic — checks all dependencies
  open       Open http://127.0.0.1:<PORT> in browser
  logs       Show recent server log lines (secrets redacted)
  version    Print the installed version
  repair     Re-run dependency install and CLI reinstall
  help       Show this message

Environment:
  ISOTOPE_BRANCH    Git branch used by `update` (default: main)
'@
}

# ── main dispatch ─────────────────────────────────────────────────────────────

try {
  if (-not $Command) { $Command = 'help' }
  switch ($Command.ToLower()) {
    'start' {
      New-Item -ItemType Directory -Force -Path $ISO_HOME, $LOG_DIR | Out-Null
      $PROJECT_DIR = Resolve-Project
      Set-Content -Path $PROJECT_PATH_FILE -Value $PROJECT_DIR
      Cmd-Start
    }
    'stop' {
      New-Item -ItemType Directory -Force -Path $ISO_HOME | Out-Null
      Cmd-Stop
    }
    'restart' {
      New-Item -ItemType Directory -Force -Path $ISO_HOME, $LOG_DIR | Out-Null
      $PROJECT_DIR = Resolve-Project
      Set-Content -Path $PROJECT_PATH_FILE -Value $PROJECT_DIR
      Cmd-Restart
    }
    'update' {
      New-Item -ItemType Directory -Force -Path $ISO_HOME, $LOG_DIR | Out-Null
      $PROJECT_DIR = Resolve-Project
      Set-Content -Path $PROJECT_PATH_FILE -Value $PROJECT_DIR
      Cmd-Update
    }
    'status' {
      New-Item -ItemType Directory -Force -Path $ISO_HOME | Out-Null
      try { $PROJECT_DIR = Resolve-Project } catch { Write-Info 'Project path: missing'; exit 1 }
      Cmd-Status
    }
    'doctor' {
      New-Item -ItemType Directory -Force -Path $ISO_HOME, $LOG_DIR | Out-Null
      try { $PROJECT_DIR = Resolve-Project } catch { Write-Info 'IsotopeAI doctor'; Write-WarnMsg 'project path unknown — run setup first' }
      Cmd-Doctor
    }
    'open' {
      try { $PROJECT_DIR = Resolve-Project } catch { $PROJECT_DIR = (Get-Location).Path }
      Cmd-Open
    }
    'logs' {
      New-Item -ItemType Directory -Force -Path $ISO_HOME, $LOG_DIR | Out-Null
      Cmd-Logs
    }
    'version' {
      try { $PROJECT_DIR = Resolve-Project } catch { Write-Info 'IsotopeAI (project not found)'; exit 0 }
      Cmd-Version
    }
    'repair' {
      New-Item -ItemType Directory -Force -Path $ISO_HOME, $LOG_DIR | Out-Null
      $PROJECT_DIR = Resolve-Project
      Set-Content -Path $PROJECT_PATH_FILE -Value $PROJECT_DIR
      Cmd-Repair
    }
    'help' { Show-Usage }
    default {
      Write-WarnMsg "Unknown command: $Command"
      Show-Usage
      exit 1
    }
  }
} catch {
  Write-Host "ERROR: $_" -ForegroundColor Red
  exit 1
}
