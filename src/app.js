const express = require('express');

const indexRouter = require('./routes/index');

//const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', indexRouter);

app.listen(3000, () =>
  console.log("Server on port", 3000)
);
// pass any unhandled errors to the error handler
//app.use(errorHandler);

module.exports = app;
