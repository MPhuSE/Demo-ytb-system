import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { VideoController } from './modules/video.controller.js';
import { VideoService } from './modules/video.service.js';
import { TranscodeQueue } from './transcoding/queue.js';
import { createVideoRouter } from './modules/video.routes.js';
import { cdnManager } from './infra/cdn.js';

export function createApp(storageDir: string) {
  const app = express();

  // Setup services
  const queue = new TranscodeQueue(storageDir);
  const service = new VideoService(storageDir, queue);
  const controller = new VideoController(service);

  // Middlewares
  app.use(cors({
    origin: '*', // Allow frontend dev server
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Range', 'x-request-id'],
    exposedHeaders: ['Content-Length', 'Content-Range', 'X-Cache-Status', 'X-CDN-Edge-Node'],
  }));

  app.use(express.json());

  // Request ID middleware
  app.use((req: Request, res: Response, next: NextFunction) => {
    const reqId = (req.headers['x-request-id'] as string) || `req_${uuidv4().slice(0, 8)}`;
    res.setHeader('x-request-id', reqId);
    next();
  });

  // Media static delivery (Video Path) with CDN Edge Caching simulation
  app.use('/media', cdnManager.getMiddleware(storageDir), express.static(storageDir));

  // Control / API Path
  app.use('/api/v1', createVideoRouter(controller, storageDir));

  // Central Error Handler
  app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
    const requestId = res.getHeader('x-request-id') || 'req_error';

    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        res.status(413).json({
          error: {
            code: 'UPLOAD_TOO_LARGE',
            message: 'Uploaded file exceeds maximum allowed limit (100MB)',
            requestId,
          },
        });
        return;
      }
    }

    if (err.message && err.message.startsWith('UNSUPPORTED_MEDIA')) {
      res.status(415).json({
        error: {
          code: 'UNSUPPORTED_MEDIA',
          message: err.message,
          requestId,
        },
      });
      return;
    }

    console.error(`[Error] ${req.method} ${req.url}:`, err);

    res.status(err.status || 500).json({
      error: {
        code: err.code || 'INTERNAL_ERROR',
        message: err.message || 'Internal server error',
        requestId,
      },
    });
  });

  return { app, service, queue };
}
