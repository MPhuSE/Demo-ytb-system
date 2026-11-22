import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import { VideoRepository } from './modules/video.repository.js';
import { Transcoder } from './transcoding/transcoder.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serverRootDir = path.resolve(__dirname, '..');

async function seed() {
  console.log('🌱 Seeding initial demo video...');
  const fixturePath = path.resolve(serverRootDir, '..', 'fixtures', 'sample_720p.mp4');

  if (!fs.existsSync(fixturePath)) {
    console.error('Fixture sample_720p.mp4 not found. Please run the ffmpeg generator first.');
    process.exit(1);
  }

  const existing = VideoRepository.findAll();
  if (existing.some((v) => v.title.includes('Demo Ready Video'))) {
    console.log('Demo video already seeded.');
    process.exit(0);
  }

  const id = uuidv4();
  const storageDir = path.resolve(serverRootDir, 'storage');
  const originalDir = path.join(storageDir, 'originals');
  fs.mkdirSync(originalDir, { recursive: true });

  const destOriginal = path.join(originalDir, `${id}.mp4`);
  fs.copyFileSync(fixturePath, destOriginal);

  // 1. Create record
  VideoRepository.create({
    id,
    title: 'Demo Ready Video (720p HLS)',
    status: 'QUEUED',
    original_path: destOriginal,
  });

  // 2. Probe
  const probe = await Transcoder.probe(destOriginal);
  VideoRepository.updateMetadata(id, {
    duration: probe.duration,
    width: probe.width,
    height: probe.height,
  });

  // 3. Transcode
  const outputDir = path.join(storageDir, 'videos', id);
  console.log(`Transcoding seed video to ${outputDir}...`);

  const result = await Transcoder.transcode(id, destOriginal, outputDir, (progress) => {
    process.stdout.write(`\rTranscoding progress: ${progress}%`);
  });

  console.log('\nTranscoding completed. Adding renditions...');

  for (const r of result.renditions) {
    VideoRepository.addRendition({
      id: uuidv4(),
      video_id: id,
      quality: r.quality,
      width: r.width,
      height: r.height,
      bitrate: r.bandwidth,
      playlist_path: path.join('videos', id, `${r.quality}.m3u8`),
    });
  }

  VideoRepository.updateStatus(id, 'READY', 100);
  console.log(`✅ Seed video ready with ID: ${id}`);
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
