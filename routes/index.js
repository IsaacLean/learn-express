const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('index');
});

router.get('/hello_world', (req, res) => {
  res.send('<h1>Hello, world!</h1>');
});

router.get('/hello', (req, res) => {
  const username = req.cookies.username;

  if(username) {
    res.redirect('/welcome');
  } else {
    res.render('hello', { name: req.cookies.username });
  }
});

router.post('/hello', (req, res) => {
  res.cookie('username', req.body.username);
  res.redirect('/welcome');
});

router.get('/welcome', (req, res) => {
  const username = req.cookies.username;

  if(username) {
    res.render('welcome', { name: req.cookies.username });
  } else {
    res.redirect('/hello');
  }
});

router.post('/goodbye', (req, res) => {
  res.clearCookie('username');
  res.redirect('/hello');
});

module.exports = router;
