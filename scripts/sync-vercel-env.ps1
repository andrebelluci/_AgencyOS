# Sync Vercel env: .env -> Production, .env.local -> Preview + Development
# Usage: node scripts/sync-vercel-env.mjs
# Legacy: powershell -File scripts/sync-vercel-env.ps1 (delegates to .mjs)

$ErrorActionPreference = "Stop"
Set-Location (Split-Path $PSScriptRoot -Parent)
node scripts/sync-vercel-env.mjs