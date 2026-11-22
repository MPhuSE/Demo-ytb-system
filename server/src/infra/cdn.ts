import { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';

interface CachedItem {
  buffer: Buffer;
  contentType: string;
  cachedAt: number;
}

class CdnEdgeSimulator {
  private cache = new Map<string, CachedItem>();
  private hits: number = 0;
  private misses: number = 0;

  getMiddleware(storageDir: string) {
    return (req: Request, res: Response, next: NextFunction) => {
      const filePath = req.path; // e.g. /videos/<id>/360p_000.ts

      // Only cache media deliverables (.m3u8, .ts)
      const isMedia = filePath.endsWith('.ts') || filePath.endsWith('.m3u8');
      if (!isMedia) {
        return next();
      }

      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('X-CDN-Edge-Node', 'SGN-Edge-Node-01 (Local Edge Simulation)');

      const isManifest = filePath.endsWith('.m3u8');
      const contentType = isManifest ? 'application/vnd.apple.mpegurl' : 'video/MP2T';

      // 1. Check CDN Edge Cache
      const cached = this.cache.get(filePath);
      if (cached) {
        this.hits++;
        res.setHeader('X-Cache-Status', 'HIT');
        res.setHeader('Content-Type', cached.contentType);
        res.setHeader('Cache-Control', isManifest ? 'no-cache' : 'public, max-age=86400');
        res.setHeader('X-CDN-Cached-At', new Date(cached.cachedAt).toISOString());
        res.send(cached.buffer);
        return;
      }

      // 2. Cache MISS: Fetch from Origin Storage
      const fullPath = path.join(storageDir, filePath);
      if (!fs.existsSync(fullPath)) {
        res.setHeader('X-Cache-Status', 'MISS-NOT-FOUND');
        return res.status(404).send('Media chunk not found in Origin Storage');
      }

      try {
        const buffer = fs.readFileSync(fullPath);
        this.misses++;

        // Store in CDN Edge Cache
        this.cache.set(filePath, {
          buffer,
          contentType,
          cachedAt: Date.now(),
        });

        res.setHeader('X-Cache-Status', 'MISS');
        res.setHeader('Content-Type', contentType);
        res.setHeader('Cache-Control', isManifest ? 'no-cache' : 'public, max-age=86400');
        res.send(buffer);
      } catch (err) {
        next(err);
      }
    };
  }

  getStats() {
    const total = this.hits + this.misses;
    const ratio = total > 0 ? ((this.hits / total) * 100).toFixed(1) : '0.0';
    return {
      hits: this.hits,
      misses: this.misses,
      totalRequests: total,
      cacheHitRatio: `${ratio}%`,
      cachedFilesCount: this.cache.size,
      edgeLocation: 'SGN-Edge-Node-01',
    };
  }

  clearCache() {
    this.cache.clear();
    this.hits = 0;
    this.misses = 0;
  }
}

export const cdnManager = new CdnEdgeSimulator();
