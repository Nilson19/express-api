import dotenv from 'dotenv';
dotenv.config();

export const env = {
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET!,
  db: {
    host: process.env.DB_HOST!,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER!,
    password: process.env.DB_PASS!,
    name: process.env.DB_NAME!,
  },
  redisUrl: process.env.REDIS_URL!
};
