#!/usr/bin/env bash
set -e

echo "🚀 Running Mini YouTube Architecture Performance Benchmark..."
API_URL="http://localhost:3001/api/v1/admin/benchmark"

RESPONSE=$(curl -s -X POST "$API_URL" || echo "")

if [ -z "$RESPONSE" ] || [[ "$RESPONSE" == *"Error"* ]]; then
  echo "❌ Error: Could not reach server at $API_URL. Make sure the server is running (npm run dev:server)."
  exit 1
fi

echo "✅ Benchmark Completed Successfully!"
echo ""
echo "📊 WATERFALL BREAKDOWN (TWO-PATH ARCHITECTURE):"
echo "--------------------------------------------------------"
node -e "
  const data = JSON.parse(process.argv[1]);
  const w = data.waterfall;
  const m = data.metric || {};
  console.log('1. API Ingestion (Metadata Path):     ' + w.apiIngestionMs + ' ms');
  console.log('2. Queue Waiting Delay (Completion):  ' + w.queueWaitMs + ' ms');
  console.log('3. FFmpeg Transcoding (Data Path):     ' + w.transcodeLatencyMs + ' ms');
  console.log('--------------------------------------------------------');
  console.log('⭐ TOTAL TIME-TO-READY (End-to-End):  ' + w.totalTimeToReadyMs + ' ms');
  console.log('⚡ Transcode Speed Factor:             ' + (m.transcode_speed_factor || 'N/A') + 'x real-time');
  console.log('📦 Total HLS Output Size:             ' + ((m.output_size_bytes || 0) / 1024).toFixed(1) + ' KB');
" "$RESPONSE"
