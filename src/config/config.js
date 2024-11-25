import {
  CLIENT_VERSION,
  DB_HOST,
  DB_NAME,
  DB_PASSWORD,
  DB_PORT,
  DB_USER,
  HOST,
  JWT_SECRET_KEY,
  PORT,
  REDIS_HOST,
  REDIS_PORT,
  REDIS_USERNAME,
  REDIS_PASSWORD,
} from '../constants/env.js';
import {
  PAYLOAD_LENGTH_SIZE,
  PAYLOAD_ONEOF_CASE_SIZE,
  SEQUENCE_SIZE,
  VERSION_LENGTH_SIZE,
} from '../constants/header.js';

export const config = {
  server: {
    port: PORT,
    host: HOST,
  },
  client: {
    version: CLIENT_VERSION,
  },
  header: {
    PAYLOAD_ONEOF_CASE_SIZE,
    VERSION_LENGTH_SIZE,
    SEQUENCE_SIZE,
    PAYLOAD_LENGTH_SIZE,
  },
  database: {
    USER_DB: {
      name: DB_NAME,
      user: DB_USER,
      password: DB_PASSWORD,
      host: DB_HOST,
      port: DB_PORT,
    },
  },
  jwt: {
    SCRET_KEY: JWT_SECRET_KEY,
  },
  redis: {
    host: REDIS_HOST,
    port: REDIS_PORT,
    username: REDIS_USERNAME,
    password: REDIS_PASSWORD,
  },
};
