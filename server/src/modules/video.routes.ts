import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { VideoController } from './video.controller.js';

export function createVideoRouter(controller: VideoController, storageDir: string): Router {
  const router = Router();

  const originalsDir = path.join(storageDir, 'originals');
  if (!fs.existsSync(originalsDir)) {
    fs.mkdirSync(originalsDir, { recursive: true });
  }

  // Multer storage: safe UUID filenames
  const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, originalsDir);
    },
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase() || '.mp4';
      cb(null, `${uuidv4()}${ext}`);
    },
  });

  const upload = multer({
    storage,
    limits: {
      fileSize: 100 * 1024 * 1024, // 100 MB limit
    },
    fileFilter: (_req, file, cb) => {
      if (file.mimetype.startsWith('video/') || file.originalname.endsWith('.mp4') || file.originalname.endsWith('.mov')) {
        cb(null, true);
      } else {
        cb(new Error('UNSUPPORTED_MEDIA: Only video files (MP4, MOV, etc.) are allowed'));
      }
    },
  });

  // Endpoints according to OpenAPI specification
  router.get('/health', controller.getHealth);
  router.get('/videos', controller.getAllVideos);
  router.post('/videos', upload.single('file'), controller.uploadVideo);
  router.get('/videos/:id', controller.getVideoById);
  router.get('/videos/:id/status', controller.getVideoStatus);
  router.get('/videos/:id/playback', controller.getVideoPlayback);
  router.post('/videos/:id/retry', controller.retryVideo);
  router.delete('/videos/:id', controller.deleteVideo);

  // Admin and System Inspection routes
  router.get('/admin/stats', controller.getAdminStats);
  router.get('/admin/videos/:id/files', controller.getVideoFiles);
  router.get('/admin/performance', controller.getPerformanceMetrics);
  router.post('/admin/benchmark', (_req, res, next) => {
    res.locals.fixturesDir = path.resolve(storageDir, '..', '..', 'fixtures');
    controller.runBenchmark(_req, res, next);
  });
  router.post('/admin/stress-test', controller.runStressTest);

  return router;
}
