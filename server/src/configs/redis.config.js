const redis = require('redis');
require('dotenv').config();

let redisClient;

async function getRedisClient() {
  if (!redisClient) {
    redisClient = redis.createClient({
      socket: {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379,
      },
    });

    // Event listeners
    redisClient.on('connect', () => {
      console.log('Connected to Redis.');
    });

    redisClient.on('error', (err) => {
      console.error('Redis error:', err);
    });

    // Connect to Redis
    try {
      await redisClient.connect();
    } catch (err) {
      console.error('Failed to connect to Redis:', err);
      throw err;
    }
  }

  return redisClient;
}

// Graceful shutdown
process.on('SIGINT', async () => {
  if (redisClient) {
    console.log('Closing Redis connection...');
    await redisClient.quit();
  }
  process.exit(0);
});

module.exports = getRedisClient;