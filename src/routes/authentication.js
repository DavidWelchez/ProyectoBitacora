const express = require('express');
const router = express.Router();
const pool = require('../database');
const helpers = require('../lib/helpers');
const passport = require('passport');
const { isLoggedIn,isnotLoggedIn } = require('../lib/auth');
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

// router.post('/signup', passport.authenticate('local.signup', {
//   successRedirect: '/usuario',
//   failureRedirect: '/signup',
//   failureFlash: true
// }));
router.post('/signup', async (req, res) => {
  const { fullname , email,username,password} = req.body;

  const usuario = await pool.query('SELECT * FROM users WHERE username = ? ',username);
  const useemail = await pool.query('SELECT * FROM users WHERE email = ? ',email);


  const rol='General';
  if (usuario[0]==null){
    if (useemail[0]==null){

      let newUser = {
        fullname,
        username,
        password,
        rol,
        email
        
      };
      newUser.password = await helpers.encryptPassword(password);
      // Saving in the Database
      const result = await pool.query('INSERT INTO users SET ? ', newUser);
      req.flash('success', 'Usuario  guardado ');
      res.redirect('/usuario');
    }else{
      req.flash('success', 'Correo en uso ');
      res.redirect('/signup');
    }
  }
  else{
    req.flash('success', 'nombre de usuario');
    res.redirect('/signup');
  }

});


// SINGIN
router.get('/signin',isnotLoggedIn, (req, res) => {
  res.render('auth/signin');
});

router.post('/signin',isnotLoggedIn, (req, res, next) => {

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