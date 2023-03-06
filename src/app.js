import express from 'express';
import router from './routes/Index.js';



const app = express();

app.use('/', router);

app.get('/', (req, res) => {
    res.send('Hello World!')
});

app.listen(3000, () => console.log(`App listening at port 3000`));

export { app };