#!/usr/bin/env bash
set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TARGET="${1:-api}"
CONNECTIONS="${2:-100}"
DURATION="${3:-5}"
PORT="${4:-3001}"

export HTTP_PROXY=""
export HTTPS_PROXY=""
export http_proxy=""
export https_proxy=""
export NO_PROXY="*"
export no_proxy="*"

VIDEO_ID=$(sqlite3 "$DIR/server/data/mini_youtube.db" "SELECT id FROM videos WHERE status='READY' LIMIT 1;" 2>/dev/null || echo "03a7292a-bbdc-41f9-b085-5fb6c0f010b0")
if [ -z "$VIDEO_ID" ]; then
  VIDEO_ID="03a7292a-bbdc-41f9-b085-5fb6c0f010b0"
fi
if [ "$TARGET" == "cdn" ]; then
  URL="http://127.0.0.1:$PORT/media/videos/$VIDEO_ID/360p_000.ts"
elif [ "$TARGET" == "status" ]; then
  URL="http://127.0.0.1:$PORT/api/v1/videos/$VIDEO_ID/status"
else
  URL="http://127.0.0.1:$PORT/api/v1/videos"
fi

echo "🔥 Launching Mini YouTube Stress Testing Tool..."
echo "🎯 Target URL:   $URL"
echo "👥 Concurrency:  $CONNECTIONS Virtual Users (VUs)"
echo "⏱️ Duration:     $DURATION seconds"
echo "--------------------------------------------------------"

OUTPUT=$(node "$DIR/scripts/run_autocannon.js" "$URL" "$CONNECTIONS" "$DURATION")

echo ""
echo "📊 KẾT QUẢ ĐO CHỊU TẢI (STRESS TEST RESULTS):"
echo "--------------------------------------------------------"
node -e "
  const d = JSON.parse(process.argv[1]);
  console.log('⚡ THÔNG LƯỢNG (THROUGHPUT):     ' + d.rps.toLocaleString() + ' Requests/Giây (RPS)');
  console.log('📦 TỔNG SỐ REQUESTS HOÀN TẤT:   ' + d.requestsTotal.toLocaleString() + ' requests');
  console.log('⏱️ ĐỘ TRỄ TRUNG BÌNH (LATENCY): ' + d.latency.avgMs + ' ms');
  console.log('   - p50 (Median):               ' + d.latency.p50Ms + ' ms');
  console.log('   - p90:                        ' + d.latency.p90Ms + ' ms');
  console.log('   - p99:                        ' + d.latency.p99Ms + ' ms');
  console.log('🛡️ TỈ LỆ THÀNH CÔNG:             ' + d.successRate);
  console.log('🌐 BĂNG THÔNG MẠNG (THROUGHPUT): ' + d.throughputMBps + ' MB/s');
  console.log('--------------------------------------------------------');
  if (d.errors === 0 && d.timeouts === 0) {
    console.log('✅ Hệ thống hoạt động hoàn hảo dưới tải ' + d.connections + ' VUs (0 errors, 0 timeouts).');
  } else {
    console.log('⚠️ Xuất hiện ' + d.errors + ' errors, ' + d.timeouts + ' timeouts.');
  }
" "$OUTPUT"
