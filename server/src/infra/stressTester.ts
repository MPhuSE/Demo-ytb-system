import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import { VideoRepository } from '../modules/video.repository.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serverRootDir = path.resolve(__dirname, '..', '..');
const projectRootDir = path.resolve(serverRootDir, '..');

export interface StressTestOptions {
  target?: 'api' | 'cdn' | 'status';
  connections?: number;
  duration?: number;
}

export class StressTester {
  static run(port: number = 3001, options: StressTestOptions = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      const connections = options.connections || 100;
      const duration = options.duration || 5;
      const target = options.target || 'api';

      const videos = VideoRepository.findAll();
      const readyVideo = videos.find((v) => v.status === 'READY') || videos[0];
      const videoId = readyVideo?.id || 'demo';

      let url = `http://127.0.0.1:${port}/api/v1/videos`;
      if (target === 'cdn') {
        url = `http://127.0.0.1:${port}/media/videos/${videoId}/360p_000.ts`;
      } else if (target === 'status') {
        url = `http://127.0.0.1:${port}/api/v1/videos/${videoId}/status`;
      }

      console.log(`[StressTest] Spawning separate worker process for ${url} (VUs: ${connections}, Duration: ${duration}s)`);

      const scriptPath = path.resolve(projectRootDir, 'scripts', 'run_autocannon.js');
      const proc = spawn('node', [
        scriptPath,
        url,
        connections.toString(),
        duration.toString(),
      ], {
        env: {
          ...process.env,
          HTTP_PROXY: '',
          HTTPS_PROXY: '',
          http_proxy: '',
          https_proxy: '',
          NO_PROXY: '*',
          no_proxy: '*',
        },
      });

      let stdout = '';
      let stderr = '';

      proc.stdout.on('data', (d) => {
        stdout += d.toString();
      });

      proc.stderr.on('data', (d) => {
        stderr += d.toString();
      });

      proc.on('close', (code) => {
        if (code !== 0 && !stdout.trim()) {
          return reject(new Error(`Stress test runner exited with code ${code}: ${stderr || stdout}`));
        }

        try {
          const lines = stdout.trim().split('\n').filter(Boolean);
          const lastLine = lines[lines.length - 1];
          const parsed = JSON.parse(lastLine);
          resolve({ target, ...parsed });
        } catch (err) {
          reject(new Error(`Failed to parse stress test output: ${stdout}`));
        }
      });
    });
  }
}
