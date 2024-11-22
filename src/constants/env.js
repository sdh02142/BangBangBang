import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT || 5555;
export const HOST = process.env.HOST || 'localhost';

export const DB_NAME = process.env.DB_NAME || 'user_db';
export const DB_USER = process.env.DB_USER || 'root';
export const DB_PASSWORD = process.env.DB_PASSWORD || '';
export const DB_HOST = process.env.DB_HOST || 'localhost';
export const DB_PORT = process.env.DB_PORT || 3306;

export const CLIENT_VERSION = process.env.CLIENT_VERSION || '1.0.0';

export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || '';

export const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
export const REDIS_PORT = process.env.REDIS_PORT || 6379;
export const REDIS_USERNAME = process.env.REDIS_USERNAME || 'default';
export const REDIS_PASSWORD = process.env.REDIS_PASSWORD || '';
