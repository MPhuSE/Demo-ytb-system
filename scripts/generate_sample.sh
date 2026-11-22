#!/usr/bin/env bash
set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
FIXTURES_DIR="$DIR/fixtures"
mkdir -p "$FIXTURES_DIR"

echo "🎬 Generating 5-second 720p sample video..."
ffmpeg -y \
  -f lavfi -i "testsrc=duration=5:size=1280x720:rate=30" \
  -f lavfi -i "sine=frequency=1000:duration=5" \
  -c:v libx264 -c:a aac -pix_fmt yuv420p \
  "$FIXTURES_DIR/sample_720p.mp4"

echo "✅ Generated: $FIXTURES_DIR/sample_720p.mp4"
