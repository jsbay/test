export default {
  client: {
    host: process.env.EGG_REDIS_HOST || "127.0.0.1",
    port: process.env.EGG_REDIS_PORT || 6379,
    password: process.env.EGG_REDIS_PASSWORD || "",
    db: process.env.EGG_REDIS_DB || "0",
  },
};
