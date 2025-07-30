import pg from 'pg';
import fs from 'fs';
import 'dotenv/config';
import path from 'path';

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // This is important for self-signed certificates
  },
});

async function run() {
  try {
    // Read your SQL file (schema.sql) from disk
    const sql = fs.readFileSync(path.resolve('./db/schema.sql'), 'utf-8');

    // Run the SQL commands
    await pool.query(sql);

    console.log('Database schema created successfully!');
  } catch (error) {
    console.error('Error creating database schema:', error);
  } finally {
    await pool.end();
  }
}

run();