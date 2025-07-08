const Redis = require('ioredis');
const redis = new Redis(process.env.REDIS_URL); // Set REDIS_URL in your environment variables
module.exports = redis;