import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Point to server/data consistently
const serverRootDir = path.resolve(__dirname, '..', '..');
const dbDir = path.resolve(serverRootDir, 'data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'mini_youtube.db');
export const db = new Database(dbPath);

// Enable WAL mode for better concurrency
db.pragma('journal_mode = WAL');

// Initialize schema
db.exec(`
  CREATE TABLE IF NOT EXISTS videos (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    status TEXT NOT NULL CHECK(status IN ('QUEUED', 'PROCESSING', 'READY', 'FAILED')),
    progress INTEGER DEFAULT 0,
    original_path TEXT NOT NULL,
    duration REAL,
    width INTEGER,
    height INTEGER,
    error_code TEXT,
    error_message TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS renditions (
    id TEXT PRIMARY KEY,
    video_id TEXT NOT NULL,
    quality TEXT NOT NULL,
    width INTEGER NOT NULL,
    height INTEGER NOT NULL,
    bitrate INTEGER NOT NULL,
    playlist_path TEXT NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS performance_metrics (
    id TEXT PRIMARY KEY,
    video_id TEXT NOT NULL,
    file_size_bytes INTEGER NOT NULL,
    video_duration_sec REAL,
    queue_wait_ms INTEGER NOT NULL,
    transcode_latency_ms INTEGER NOT NULL,
    total_time_to_ready_ms INTEGER NOT NULL,
    output_size_bytes INTEGER NOT NULL,
    compression_ratio REAL,
    transcode_speed_factor REAL,
    created_at TEXT NOT NULL,
    FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_videos_status ON videos(status);
  CREATE INDEX IF NOT EXISTS idx_renditions_video_id ON renditions(video_id);
  CREATE INDEX IF NOT EXISTS idx_perf_video_id ON performance_metrics(video_id);
`);
