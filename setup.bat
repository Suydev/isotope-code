@echo off
setlocal enabledelayedexpansion

echo.
echo Isotope setup
echo Working directory: %CD%
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo ERROR: Node.js 18+ is required. Install it from https://nodejs.org
  pause
  exit /b 1
)

for /f %%v in ('node -e "process.stdout.write(process.versions.node.split('.')[0])"') do set NODE_MAJOR=%%v
if %NODE_MAJOR% LSS 18 (
  echo ERROR: Node.js 18+ is required.
  pause
  exit /b 1
)
node --version

where git >nul 2>nul
if errorlevel 1 (
  echo Git was not found. Updates from GitHub require Git.
) else (
  echo Git found.
)

if exist package.json (
  where npm >nul 2>nul
  if not errorlevel 1 npm install
)

if not exist .env (
  if not exist .env.example (
    echo ERROR: .env.example is missing.
    pause
    exit /b 1
  )
  copy .env.example .env >nul
  echo Created .env from .env.example.
)

node -e "const fs=require('fs');const txt=fs.readFileSync('.env','utf8');const get=k=>{for(const raw of txt.split(/\r?\n/)){const l=raw.trim();if(!l||l.startsWith('#'))continue;const i=l.indexOf('=');if(i<1)continue;if(l.slice(0,i).trim()===k)return l.slice(i+1).trim().replace(/^['\"]|['\"]$/g,'')}return''};const set=(k,v)=>{let lines=txt.split(/\r?\n/),seen=false;lines=lines.map(line=>{const l=line.trim();if(!l||l.startsWith('#')||!line.includes('='))return line;const i=line.indexOf('=');if(line.slice(0,i).trim()!==k)return line;seen=true;return k+'='+v});if(!seen)lines.push(k+'='+v);fs.writeFileSync('.env',lines.join('\n').replace(/\n*$/,'\n'))};let url=get('SUPABASE_URL');let anon=get('SUPABASE_ANON_KEY');if(!url||!anon){process.exit(2)}"
if errorlevel 2 (
  echo Normal user mode needs only Supabase URL and anon key.
  set /p SUPA_URL=Supabase URL: 
  set /p SUPA_ANON=Supabase anon key: 
  node -e "const fs=require('fs');let txt=fs.readFileSync('.env','utf8');const set=(k,v)=>{let lines=txt.split(/\r?\n/),seen=false;lines=lines.map(line=>{const l=line.trim();if(!l||l.startsWith('#')||!line.includes('='))return line;const i=line.indexOf('=');if(line.slice(0,i).trim()!==k)return line;seen=true;return k+'='+v});if(!seen)lines.push(k+'='+v);txt=lines.join('\n').replace(/\n*$/,'\n')};set('SUPABASE_URL',process.env.SUPA_URL||'');set('SUPABASE_ANON_KEY',process.env.SUPA_ANON||'');fs.writeFileSync('.env',txt)"
)

node -e "const fs=require('fs');const txt=fs.readFileSync('.env','utf8');const get=k=>{for(const raw of txt.split(/\r?\n/)){const l=raw.trim();if(!l||l.startsWith('#'))continue;const i=l.indexOf('=');if(i<1)continue;if(l.slice(0,i).trim()===k)return l.slice(i+1).trim().replace(/^['\"]|['\"]$/g,'')}return''};const missing=['SUPABASE_URL','SUPABASE_ANON_KEY'].filter(k=>!get(k)||get(k).includes('...')||get(k).includes('your-project-ref'));if(missing.length){console.error('Missing or placeholder values: '+missing.join(', '));process.exit(1)}"
if errorlevel 1 (
  pause
  exit /b 1
)

node --check server.mjs
if errorlevel 1 (
  pause
  exit /b 1
)

echo.
echo Setup checks complete.
echo Start the server with:
echo   node server.mjs
echo Open:
echo   http://localhost:5000
echo.
echo Admin mode is optional. Leave admin fields blank for normal use.
pause
