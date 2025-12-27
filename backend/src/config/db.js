import pkg from 'pg';
import { env } from './env.js';

const { Pool } = pkg;

export const pool = new Pool({
  connectionString: env.dbUrl,
  ssl: { rejectUnauthorized: false } // Neon / cloud Postgres ke liye
});

export async function connectDB() {
  try {
    await pool.query('SELECT 1');
    console.log('Postgres connected');

    // Initialize Tables
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(50) PRIMARY KEY,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'viewer'
      );

      CREATE TABLE IF NOT EXISTS projects (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        owner_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS project_members (
        project_id VARCHAR(50) REFERENCES projects(id) ON DELETE CASCADE,
        user_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
        role VARCHAR(20) NOT NULL,
        PRIMARY KEY (project_id, user_id)
      );

      CREATE TABLE IF NOT EXISTS job_results (
        id SERIAL PRIMARY KEY,
        job_id VARCHAR(100) NOT NULL,
        status VARCHAR(20) NOT NULL,
        output TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS refresh_tokens (
        token TEXT PRIMARY KEY,
        user_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
        expires_at TIMESTAMP NOT NULL
      );
    `);
    console.log('Database tables initialized');
  } catch (err) {
    console.error('Database connection error:', err);
    process.exit(1);
  }
}
