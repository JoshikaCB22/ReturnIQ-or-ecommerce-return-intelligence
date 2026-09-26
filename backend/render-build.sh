#!/bin/bash
set -e

echo "🔧 ReturnIQ Backend Build Script"
echo "=================================="

# Upgrade pip
echo "📦 Upgrading pip, setuptools, and wheel..."
pip install --upgrade pip setuptools wheel

# Install dependencies without building from source
echo "📥 Installing Python dependencies..."
pip install --no-build-isolation -r requirements.txt

# Generate demo data
echo "📊 Generating demo dataset..."
python generate_data.py

echo ""
echo "✅ Build complete!"
echo "🚀 Application ready to start"
