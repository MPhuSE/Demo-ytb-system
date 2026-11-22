import { Request, Response, NextFunction } from 'express';
import path from 'path';
import { VideoService } from './video.service.js';

export class VideoController {
  private service: VideoService;

  constructor(service: VideoService) {
    this.service = service;
  }

  getHealth = (_req: Request, res: Response): void => {
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
    });
  };

  getAllVideos = (_req: Request, res: Response, next: NextFunction): void => {
    try {
      const videos = this.service.getAllVideos();
      res.status(200).json({
        videos,
        total: videos.length,
      });
    } catch (err) {
      next(err);
    }
  };

  getVideoById = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const id = req.params.id as string;
      const video = this.service.getVideoById(id);
      if (!video) {
        res.status(404).json({
          error: {
            code: 'VIDEO_NOT_FOUND',
            message: `Video with id ${id} not found`,
            requestId: req.headers['x-request-id'] || 'req_local',
          },
        });
        return;
      }
      res.status(200).json(video);
    } catch (err) {
      next(err);
    }
  };

  uploadVideo = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const file = req.file;
      const title = req.body.title || (file ? file.originalname : 'Untitled Video');

      if (!file) {
        res.status(400).json({
          error: {
            code: 'INVALID_REQUEST',
            message: 'A video file is required (field name: "file")',
            requestId: req.headers['x-request-id'] || 'req_local',
          },
        });
        return;
      }

      const result = this.service.createVideo(title, file);
      // HTTP 202 Accepted: asynchronous ingestion
      res.status(202).json(result);
    } catch (err) {
      next(err);
    }
  };

  getVideoStatus = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const id = req.params.id as string;
      const status = this.service.getVideoStatus(id);
      if (!status) {
        res.status(404).json({
          error: {
            code: 'VIDEO_NOT_FOUND',
            message: `Video with id ${id} not found`,
            requestId: req.headers['x-request-id'] || 'req_local',
          },
        });
        return;
      }
      res.status(200).json(status);
    } catch (err) {
      next(err);
    }
  };

  getVideoPlayback = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const id = req.params.id as string;
      const protocol = req.protocol;
      const host = req.get('host') || 'localhost:3001';
      const baseUrl = `${protocol}://${host}`;

      const playback = this.service.getVideoPlayback(id, baseUrl);
      res.status(200).json(playback);
    } catch (err: any) {
      if (err.status) {
        res.status(err.status).json({
          error: {
            code: err.code || 'ERROR',
            message: err.message,
            requestId: req.headers['x-request-id'] || 'req_local',
          },
        });
        return;
      }
      next(err);
    }
  };

  deleteVideo = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const id = req.params.id as string;
      this.service.deleteVideo(id);
      res.status(200).json({ success: true, message: `Video ${id} deleted` });
    } catch (err: any) {
      if (err.status) {
        res.status(err.status).json({
          error: {
            code: err.code || 'ERROR',
            message: err.message,
            requestId: req.headers['x-request-id'] || 'req_local',
          },
        });
        return;
      }
      next(err);
    }
  };

  retryVideo = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const id = req.params.id as string;
      const result = this.service.retryVideo(id);
      res.status(202).json(result);
    } catch (err: any) {
      if (err.status) {
        res.status(err.status).json({
          error: {
            code: err.code || 'ERROR',
            message: err.message,
            requestId: req.headers['x-request-id'] || 'req_local',
          },
        });
        return;
      }
      next(err);
    }
  };

  getAdminStats = (_req: Request, res: Response, next: NextFunction): void => {
    try {
      const stats = this.service.getAdminStats();
      res.status(200).json(stats);
    } catch (err) {
      next(err);
    }
  };

  getVideoFiles = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const id = req.params.id as string;
      const files = this.service.getVideoFiles(id);
      res.status(200).json(files);
    } catch (err: any) {
      if (err.status) {
        res.status(err.status).json({
          error: {
            code: err.code || 'ERROR',
            message: err.message,
            requestId: req.headers['x-request-id'] || 'req_local',
          },
        });
        return;
      }
      next(err);
    }
  };

  getPerformanceMetrics = (_req: Request, res: Response, next: NextFunction): void => {
    try {
      const metrics = this.service.getPerformanceMetrics();
      res.status(200).json(metrics);
    } catch (err) {
      next(err);
    }
  };

  runBenchmark = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const fixturesDir = (res.locals.fixturesDir as string) || path.resolve(process.cwd(), 'fixtures');
      const result = await this.service.runBenchmark(fixturesDir);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };
}
