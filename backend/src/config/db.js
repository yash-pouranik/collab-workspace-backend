import pkg from 'pg';
import { env } from './env.js';

const { Pool } = pkg;

export const pool = new Pool({
  connectionString: env.dbUrl,
  ssl: { rejectUnauthorized: false } // Neon / cloud Postgres ke liye
});

export async function connectDB() {
  await pool.query('SELECT 1');
  console.log('Postgres connected');
}
