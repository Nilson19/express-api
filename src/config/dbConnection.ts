import mysql from 'mysql2/promise';
import { env } from './env';

export const mysqlPool = mysql.createPool({
  host: env.db.host,
  port: Number(env.db.port),
  user: env.db.user,
  password: env.db.password,
  database: env.db.name,
});
