import pg from 'pg';
import fs from 'fs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the correct path
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const { Pool } = pg;

const isProduction = process.env.ISPROD === 'true';

const pool = new Pool({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: process.env.PGPORT ? Number(process.env.PGPORT) : undefined,
    ssl: isProduction ? {rejectUnauthorized: false}: false,
});

async function run() {
  try {
    // Read the SQL file (schema.sql) from the current directory
    const sql = fs.readFileSync(path.resolve('./src/db/schema.sql'), 'utf-8');

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