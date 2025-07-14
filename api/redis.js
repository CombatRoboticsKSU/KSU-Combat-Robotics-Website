// Load .env for local development
if (!process.env.VERCEL) {
  require('dotenv').config();
}

const Redis = require('ioredis');
const redis = new Redis(process.env.REDIS_URL);
module.exports = redis;