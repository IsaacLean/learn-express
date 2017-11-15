const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const mainRoutes = require('./routes');
const cardRoutes = require('./routes/cards');
const authRoutes = require('./routes/auth');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('static'));
app.set('view engine', 'pug');

mongoose.connect('mongodb://localhost:27017/learn-express-mongodb');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

app.use(session({
  saveUninitialized: false,
  secret: 'super secret',
  store: new MongoStore({
    mongooseConnection: db
  }),
  resave: true,
}));

app.use(function(req, res, next) {
  res.locals.currentUser = req.session.userId;
  next();
});

app.use(mainRoutes);
app.use('/cards', cardRoutes);
app.use('/auth', authRoutes);

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
