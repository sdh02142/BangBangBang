import Redis from 'ioredis';
import { config } from '../../config/config.js';

class RedisManager {
  static #instance;

  constructor() {
    if (RedisManager.#instance) {
      return RedisManager.#instance;
    }

    this.redisClient = new Redis({
      host: config.redis.host,
      port: config.redis.port,
      username: config.redis.username,
      password: config.redis.password,
    });

    this.redisClient.on('connect', () => console.log('Redis에 연결되었습니다.'));
    this.redisClient.on('error', (err) => console.error('Redis 클라이언트 오류:', err));

    RedisManager.#instance = this;
  }

  async setCache(key, value, expiration = 3600) {
    try {
      await this.redisClient.set(key, JSON.stringify(value), 'EX', expiration);
      console.log(`캐시 설정 완료: ${key}`);
    } catch (error) {
      console.error('캐시 설정 중 오류 발생:', error);
    }
  }

  async getCache(key) {
    try {
      const data = await this.redisClient.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('캐시 가져오기 중 오류 발생:', error);
      return null;
    }
  }

  async deleteCache(key) {
    try {
      await this.redisClient.del(key);
      console.log(`캐시 삭제 완료: ${key}`);
    } catch (error) {
      console.error('캐시 삭제 중 오류 발생:', error);
    }
  }

  async updateCacheExpiration(key, expiration) {
    try {
      await this.redisClient.expire(key, expiration);
      console.log(`캐시 만료 시간 업데이트 완료: ${key}`);
    } catch (error) {
      console.error('캐시 만료 시간 업데이트 중 오류 발생:', error);
    }
  }

  static getInstance() {
    if (!RedisManager.#instance) {
      RedisManager.#instance = new RedisManager();
    }

    return RedisManager.#instance;
  }
}

export default RedisManager;
