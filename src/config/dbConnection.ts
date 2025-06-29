import { env } from './env';
import mysql from 'mysql2/promise';

export const mysqlPool = mysql.createPool({
  host: env.db.host,
  port: Number(env.db.port),
  user: env.db.user,
  password: env.db.password,
  database: env.db.name,
});
