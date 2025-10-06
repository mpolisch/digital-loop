import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

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

export default pool;