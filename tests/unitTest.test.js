import { getUsers } from "../src/controllers/users.controller.js";
import { pool } from "../src/database.js";

describe('Database connection', () => {
  it('should connect to the database', async () => {
    const client = await pool.connect();

    if (client && client.query) {
      console.log('Database connection successful');
    } else {
      throw new Error('Database connection failed');
    }

    await client.release(); // release the client back to the pool
  }, 5000); // set timeout to 5 seconds
});
