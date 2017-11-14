const express = require('express');
const mid = require('../middleware');
const router = express.Router();

const User = require('../models/user');

router.get('/register', mid.loggedOut, (req, res) => {
  res.render('register', { title: 'Register' });
});

router.post('/register', (req, res, next) => {
  if(req.body.email && req.body.name && req.body.password && req.body.confirm_password) {
    if(req.body.password !== req.body.confirm_password) {
      const err = new Error('Passwords do not match.');
      err.status = 400;
      return next(err);
    }

    const userData = {
      email: req.body.email,
      name: req.body.name,
      password: req.body.password,
      catchphrase: req.body.catchphrase
    };

    User.create(userData, function(error, user) {
      if(error) {
        return next(error);
      } else {
        req.session.userId = user._id;
        return res.redirect('/auth/profile');
      }
    });
  } else {
    const err = new Error('All fields required');
    err.status = 400;
    return next(err);
  }
});

router.get('/login', mid.loggedOut, (req, res) => {
  res.render('login', { title: 'Login' });
});

router.post('/login', (req, res, next) => {
  if(req.body.email && req.body.password) {
    User.authenticate(req.body.email, req.body.password, function(error, user) {
      if(error || !user) {
        var err = new Error('Wrong email or password');
        err.status = 401;
        return next(err);
      } else {
        req.session.userId = user._id;
        return res.redirect('/auth/profile');
      }
    });
  } else {
    const err = new Error('Email and password are required.');
    err.status = 401;
    return next(err);
  }
});

router.get('/profile', mid.requiresLogin, (req, res, next) => {
  User.findById(req.session.userId).exec(function(error, user) {
    if(error) {
      return next(error);
    } else {
      return res.render('profile', { title: 'Profile', name: user.name, catchphrase: user.catchphrase });
    }
  });
});

router.get('/logout', function(req, res, next) {
  if(req.session) {
    req.session.destroy(function(err) {
      if(err) {
        return next(err);
      } else {
        return res.redirect('/auth/login');
      }
    });
  }
});

module.exports = router;
