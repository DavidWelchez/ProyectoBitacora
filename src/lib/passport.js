const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const pool = require('../database');
const helpers = require('./helpers');

passport.use('local.signin', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, username, password, done) => {
  const rows = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
  if (rows.length > 0) {
    const user = rows[0];
    const validPassword = await helpers.matchPassword(password, user.password)
    if (validPassword) {
      done(null, user, req.flash('success', 'Bienvenido ' + user.username));
    } else {
      done(null, false, req.flash('message', 'Contraseña incorrecta'));
    }
  } else {
    return done(null, false, req.flash('message', 'No existe el usuario.'));
  }
}));

passport.use('local.signup', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, username, password, done) => {
  const { fullname , email} = req.body;

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
      newUser.id = result.insertId;
      return done(null, newUser);

    }else{
      return done(null, false, req.flash('message', 'El correo ya esta en uso.'));
    }
  }
  else{
    return done(null, false, req.flash('message', 'El nombre de usuario ya esta en uso.'));
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const rows = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
  done(null, rows[0]);
});