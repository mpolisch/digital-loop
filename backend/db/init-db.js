import pg from 'pg';
import fs from 'fs';
import 'dotenv/config';
import path from 'path';

const { Pool } = pg;

// Create a new pool instance with the connection string from environment variables
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function run() {
  try {
    // Read the SQL file (schema.sql) from the current directory
    const sql = fs.readFileSync(path.resolve('./db/schema.sql'), 'utf-8');

    // Run the SQL commands
    await pool.query(sql);

    console.log('Database schema created successfully!');
  } catch (error) {
    console.error('Error creating database schema:', error);
  } finally {
    // Close the pool to release resources
    await pool.end();
  }
}

run();