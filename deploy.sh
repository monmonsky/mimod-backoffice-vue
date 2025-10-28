#!/bin/bash

echo "🚀 Starting deployment..."

# Pull latest code
echo "📦 Pulling from Git..."
git pull origin master

# Install dependencies (optional, hanya jika ada perubahan package)
# echo "📚 Installing dependencies..."
# bun install

# Build project
echo "🔨 Building project..."
bun run build

# Reload PM2 (zero-downtime restart)
echo "♻️  Reloading PM2..."
pm2 reload ecosystem.config.cjs

# Show status
echo "✅ Deployment complete!"
pm2 status
