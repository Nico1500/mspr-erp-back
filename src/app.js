import express from 'express';
import { pool } from './database.js';
import router from './routes/Index.js';



const app = express();

app.use('/', router);

app.get('/', (req, res) => {
    res.send('Hello World!')
});

app.get('/test', async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM users`);
        return res.json(result.rows);
      } catch (error) {
        console.log(
          "🚀 ~ file: users.controller.js ~ line 9 ~ getUsers ~ error",
          error
        );
      }
    res.send('c vu')
});

app.listen(3000, () => console.log(`App listening at port 3000`));

export default app;
