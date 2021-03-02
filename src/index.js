const express = require('express');
const morgan = require('morgan');
const path = require('path');
const exphbs = require('express-handlebars');
const session = require('express-session');
const validator = require('express-validator');
const passport = require('passport');
const flash = require('connect-flash');
const MySQLStore = require('express-mysql-session')(session);
const bodyParser = require('body-parser');
const { database } = require('./keys');

const pool = require('./database');
const helpers = require('./lib/helpers');

// Intializations
const app = express();
require('./lib/passport');

// Settings
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
  defaultLayout: 'main',
  layoutsDir: path.join(app.get('views'), 'layouts'),
  partialsDir: path.join(app.get('views'), 'partials'),
  extname: '.hbs',
  helpers: require('./lib/handlebars')
}));
app.set('view engine', '.hbs');

// Middlewares
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(session({
  secret: 'mysqlnodemysql',
  resave: false,
  saveUninitialized: false,
  store: new MySQLStore(database)
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
//app.use(validator());

// Global variables
app.use((req, res, next) => {
  app.locals.message = req.flash('message');
  app.locals.success = req.flash('success');
  app.locals.user = req.user;
  next();
});

// Routes
app.use(require('./routes/index'));
app.use(require('./routes/authentication'));
app.use('/eventoRiesgo', require('./routes/eventoRiesgo'));
app.use('/factorRiesgo', require('./routes/factorRiesgo'));
app.use('/incidente', require('./routes/incidente'));
app.use('/proveedor', require('./routes/proveedor'));
app.use('/evento', require('./routes/evento'));
app.use('/plataforma', require('./routes/plataforma'));
app.use('/usuario', require('./routes/usuario'));
app.use('/bitacora', require('./routes/bitacora'));




// Public
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));



// Starting
app.listen(app.get('port'), () => {
  console.log('Server is in port', app.get('port'));
});


radmin = async ()=>{
  const roladmin = await pool.query('SELECT * FROM users WHERE rol="Admin"');

  if (roladmin[0]==null){
    const fullname= 'Admin';
    const username='Admin';
    const password="Admin123";
    const rol='Admin';
    const email="Admin@gmail.com"
  
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
  
  }
  

}


radmin();

// pool.query('INSERT INTO rols (rol) values ("admin2")');