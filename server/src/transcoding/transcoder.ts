import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

export interface VideoProbeResult {
  duration: number;
  width: number;
  height: number;
  codec: string;
}

export interface RenditionConfig {
  quality: string;
  width: number;
  height: number;
  videoBitrate: string;
  audioBitrate: string;
  bandwidth: number;
}

const ALL_RENDITIONS: RenditionConfig[] = [
  {
    quality: '360p',
    width: 640,
    height: 360,
    videoBitrate: '800k',
    audioBitrate: '96k',
    bandwidth: 896000,
  },
  {
    quality: '720p',
    width: 1280,
    height: 720,
    videoBitrate: '2500k',
    audioBitrate: '128k',
    bandwidth: 2628000,
  },
];

export class Transcoder {
  static probe(filePath: string): Promise<VideoProbeResult> {
    return new Promise((resolve, reject) => {
      const args = [
        '-v', 'quiet',
        '-print_format', 'json',
        '-show_format',
        '-show_streams',
        filePath,
      ];

      const proc = spawn('ffprobe', args);
      let stdout = '';
      let stderr = '';

      proc.on('error', (err) => {
        reject(new Error(`ffprobe failed to spawn: ${err.message}. Make sure ffprobe/ffmpeg is installed and in PATH.`));
      });

      proc.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      proc.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      proc.on('close', (code) => {
        if (code !== 0) {
          return reject(new Error(`ffprobe failed with code ${code}: ${stderr}`));
        }

        try {
          const info = JSON.parse(stdout);
          const videoStream = info.streams?.find((s: any) => s.codec_type === 'video');

          if (!videoStream) {
            return reject(new Error('No video stream found in file'));
          }

          const duration = parseFloat(info.format?.duration || videoStream.duration || '0');
          const width = parseInt(videoStream.width || '0', 10);
          const height = parseInt(videoStream.height || '0', 10);
          const codec = videoStream.codec_name || 'unknown';

          resolve({ duration, width, height, codec });
        } catch (err) {
          reject(new Error(`Failed to parse ffprobe output: ${err}`));
        }
      });
    });
  }

  static async transcode(
    videoId: string,
    originalPath: string,
    outputDir: string,
    onProgress: (progress: number) => void
  ): Promise<{ renditions: RenditionConfig[]; masterPlaylistPath: string }> {
    // 1. Probe source
    const probe = await this.probe(originalPath);

    // 2. Select matching renditions: always 360p; add 720p if source >= 720p
    const targetRenditions = ALL_RENDITIONS.filter((r) => {
      if (r.quality === '360p') return true;
      if (r.quality === '720p') return probe.height >= 720 || probe.width >= 1280;
      return false;
    });

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const totalSteps = targetRenditions.length;
    let completedSteps = 0;

    // 3. Encode each rendition
    for (const rendition of targetRenditions) {
      await this.encodeRendition(originalPath, outputDir, rendition, probe.duration, (stepProgress) => {
        const overall = Math.round(((completedSteps + stepProgress) / totalSteps) * 95);
        onProgress(Math.min(overall, 95));
      });
      completedSteps++;
    }

    // 4. Generate master.m3u8
    const masterPlaylistPath = path.join(outputDir, 'master.m3u8');
    let masterContent = '#EXTM3U\n#EXT-X-VERSION:3\n';

    for (const r of targetRenditions) {
      masterContent += `#EXT-X-STREAM-INF:BANDWIDTH=${r.bandwidth},RESOLUTION=${r.width}x${r.height},NAME="${r.quality}"\n`;
      masterContent += `${r.quality}.m3u8\n`;
    }

    fs.writeFileSync(masterPlaylistPath, masterContent, 'utf-8');

    // 5. Validation: Ensure master.m3u8 and at least one segment exist
    if (!fs.existsSync(masterPlaylistPath)) {
      throw new Error('Validation failed: master.m3u8 was not created');
    }

    for (const r of targetRenditions) {
      const playlist = path.join(outputDir, `${r.quality}.m3u8`);
      if (!fs.existsSync(playlist)) {
        throw new Error(`Validation failed: Playlist ${r.quality}.m3u8 does not exist`);
      }
    }

    onProgress(100);
    return { renditions: targetRenditions, masterPlaylistPath };
  }

  private static encodeRendition(
    originalPath: string,
    outputDir: string,
    rendition: RenditionConfig,
    duration: number,
    onStepProgress: (progress: number) => void
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const playlistPath = path.join(outputDir, `${rendition.quality}.m3u8`);
      const segmentPattern = path.join(outputDir, `${rendition.quality}_%03d.ts`);

      // Scale keeping aspect ratio, padding with black if necessary to exact width:height
      const scaleFilter = `scale=w=${rendition.width}:h=${rendition.height}:force_original_aspect_ratio=decrease,pad=${rendition.width}:${rendition.height}:(ow-iw)/2:(oh-ih)/2`;

      const args = [
        '-i', originalPath,
        '-vf', scaleFilter,
        '-c:v', 'libx264',
        '-b:v', rendition.videoBitrate,
        '-maxrate', rendition.videoBitrate,
        '-bufsize', `${parseInt(rendition.videoBitrate, 10) * 2}k`,
        '-preset', 'veryfast',
        '-g', '48',
        '-keyint_min', '48',
        '-sc_threshold', '0',
        '-c:a', 'aac',
        '-b:a', rendition.audioBitrate,
        '-ac', '2',
        '-f', 'hls',
        '-hls_time', '4',
        '-hls_playlist_type', 'vod',
        '-hls_segment_filename', segmentPattern,
        '-y',
        playlistPath,
      ];

      const proc = spawn('ffmpeg', args);
      let stderr = '';

      proc.on('error', (err) => {
        reject(new Error(`ffmpeg failed to spawn: ${err.message}. Make sure ffmpeg is installed and in PATH.`));
      });

      proc.stderr.on('data', (data) => {
        const text = data.toString();
        stderr += text;

        // Parse time=HH:MM:SS.ms to calculate progress
        const timeMatch = text.match(/time=(\d{2}):(\d{2}):(\d{2}\.\d{2})/);
        if (timeMatch && duration > 0) {
          const hours = parseFloat(timeMatch[1]);
          const minutes = parseFloat(timeMatch[2]);
          const seconds = parseFloat(timeMatch[3]);
          const currentTime = hours * 3600 + minutes * 60 + seconds;
          const ratio = Math.min(currentTime / duration, 1.0);
          onStepProgress(ratio);
        }
      });

      proc.on('close', (code) => {
        if (code !== 0) {
          return reject(new Error(`ffmpeg failed (${rendition.quality}) with code ${code}: ${stderr.slice(-500)}`));
        }
        resolve();
      });
    });
  }
}
