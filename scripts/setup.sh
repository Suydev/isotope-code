#!/usr/bin/env bash
set -e
echo "╔══════════════════════════════════════════╗"
echo "║   IsotopeAI Self-Host Setup              ║"
echo "╚══════════════════════════════════════════╝"

# Check Node.js
if ! command -v node &>/dev/null; then
  echo "❌ Node.js not found. Install from https://nodejs.org (v18+)"
  exit 1
fi
NODE_VER=$(node -e "process.exit(parseInt(process.version.slice(1))<18?1:0)" 2>/dev/null; echo $?)
if [ "$NODE_VER" -eq 1 ]; then
  echo "⚠️  Node.js v18+ required. Current: $(node --version)"
fi
echo "✅ Node.js $(node --version)"

# Install deps
if [ ! -d node_modules ]; then
  echo "📦 Installing dependencies..."
  npm install
else
  echo "✅ Dependencies already installed"
fi

# Check .env
if [ ! -f .env ]; then
  echo ""
  echo "📝 Creating .env from template..."
  cp .env.example .env
  echo "⚠️  Edit .env with your keys before starting (see README.md)"
fi

echo ""
echo "✅ Setup complete! Run: npm start"
