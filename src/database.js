import pkg from 'pg';
import "dotenv/config";

const { Pool } = pkg;

export const pool = new Pool({
  user: "nico",
  host: "20.111.12.5",
  database: "mspr",
  password: "Jvubc2v@lpdmta!",
  port: 5432,
});

pool.connect;

export default pool;