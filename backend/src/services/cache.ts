import NodeCache from 'node-cache';

/**
 * Cache service for storing API responses
 * TTL: 10 minutes for player data, 1 hour for searches
 */
class CacheService {
  private cache: NodeCache;

  constructor() {
    // stdTTL: standard TTL in seconds, checkperiod: auto-delete check interval
    this.cache = new NodeCache({ stdTTL: 600, checkperiod: 120 });
  }

  /**
   * Get value from cache
   */
  get<T>(key: string): T | undefined {
    return this.cache.get<T>(key);
  }

  /**
   * Set value in cache
   */
  set<T>(key: string, value: T, ttl?: number): boolean {
    return this.cache.set<T>(key, value, ttl || 600);
  }

  /**
   * Delete specific key
   */
  del(key: string): number {
    return this.cache.del(key);
  }

  /**
   * Clear all cache
   */
  flush(): void {
    this.cache.flushAll();
  }

  /**
   * Get cache statistics
   */
  getStats() {
    return this.cache.getStats();
  }

  /**
   * Check if key exists
   */
  has(key: string): boolean {
    return this.cache.has(key);
  }
}

export const cacheService = new CacheService();
