import { Redis } from 'ioredis';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

class RedisClientManager {
  private client: Redis | null = null;
  public isConnected: boolean = false;

  constructor() {
    try {
      this.client = new Redis(REDIS_URL, {
        maxRetriesPerRequest: 1,
        retryStrategy(times: number) {
          if (times > 3) return null; // Stop retrying after 3 attempts if Redis is down
          return Math.min(times * 100, 1000);
        },
        lazyConnect: true,
      });

      this.client.connect().then(() => {
        this.isConnected = true;
        console.log(`🔌 [Redis] Successfully connected to Redis at ${REDIS_URL}`);
      }).catch(() => {
        this.isConnected = false;
        console.log(`⚠️ [Redis] Could not connect to Redis at ${REDIS_URL}. Falling back to In-Memory cache/queue.`);
      });

      this.client.on('error', () => {
        this.isConnected = false;
      });

      this.client.on('connect', () => {
        this.isConnected = true;
      });
    } catch {
      this.isConnected = false;
    }
  }

  async get(key: string): Promise<string | null> {
    if (!this.isConnected || !this.client) return null;
    try {
      return await this.client.get(key);
    } catch {
      return null;
    }
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (!this.isConnected || !this.client) return;
    try {
      if (ttlSeconds) {
        await this.client.set(key, value, 'EX', ttlSeconds);
      } else {
        await this.client.set(key, value);
      }
    } catch {
      // Ignore cache write failure
    }
  }

  async del(key: string): Promise<void> {
    if (!this.isConnected || !this.client) return;
    try {
      await this.client.del(key);
    } catch {
      // Ignore
    }
  }

  async getStatus(): Promise<{ connected: boolean; url: string; mode: string }> {
    return {
      connected: this.isConnected,
      url: REDIS_URL,
      mode: this.isConnected ? 'Redis Cache & Queue' : 'Fallback (In-Memory)',
    };
  }
}

export const redisManager = new RedisClientManager();
