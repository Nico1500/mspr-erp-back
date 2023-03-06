import pkg from 'pg';
import "dotenv/config";

const { Pool } = pkg;

export const pool = new Pool({
  user: "postgres",
  host: "db",
  database: "mspr",
  password: "password",
  port: 5432,
});

pool.connect;

export default pool;