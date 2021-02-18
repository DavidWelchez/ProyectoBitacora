const express = require('express');
const router = express.Router();

const passport = require('passport');
const { isLoggedIn } = require('../lib/auth');
const { roles ,} = require('../lib/rol'); 


// SIGNUP
router.get('/signup',isLoggedIn,roles, (req, res) => {
  var loginAdmin = false;
    var loginGeneral = false;
    rol = req.user.rol;
    if(rol == "Admin") {
        loginAdmin = true;
        }
        if(rol == "General") {
            loginGeneral = true;
            }
  res.render('auth/signup',{
    layout: "dashboard",
    loginAdmin,
    loginGeneral

  });
});

router.post('/signup', passport.authenticate('local.signup', {
  successRedirect: '/usuario',
  failureRedirect: '/signup',
  failureFlash: true
}));

// SINGIN
router.get('/signin', (req, res) => {
  res.render('auth/signin');
});

router.post('/signin', (req, res, next) => {
  /*req.check('username', 'Username is Required').notEmpty();
  req.check('password', 'Password is Required').notEmpty();
  const errors = req.validationErrors();
  if (errors.length > 0) {
    req.flash('message', errors[0].msg);
    res.redirect('/signin');
  }*/
 passport.authenticate('local.signin', {
    successRedirect: '/profile',
    failureRedirect: '/signin',
    failureFlash: true
  })(req, res, next);
});

router.get('/logout', (req, res) => {
  req.logOut();
  res.redirect('/');
});




router.get('/profile', isLoggedIn, (req, res) => {
  res.render('profile');
});

module.exports = router;