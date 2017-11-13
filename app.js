const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');

const mainRoutes = require('./routes');
const cardRoutes = require('./routes/cards');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('static'));
app.set('view engine', 'pug');

app.use(mainRoutes);
app.use('/cards', cardRoutes);

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.locals.error = err;
  res.status(err.status);
  res.render('error');
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log('The application is running on localhost:'+PORT);
});
