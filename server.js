const express = require('express');
const multer = require('multer');
const path = require('path');
const flash = require('connect-flash');
const morgan = require('morgan');
const session = require('express-session');
const passport = require('passport');
const MySQLStore = require('express-mysql-session');
const {database} = require('./src/keys');

//Initializations
app = express();
require('./src/lib/passport');

//Configuations
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, './src/views'));
app.set('view engine', 'ejs');

//Middlewares
app.use(session({
  secret: 'cm-unicorda',
  resave: false,
  saveUnitialized: false,
  store: new MySQLStore(database)
}));
app.use(flash());
app.use(morgan('dev'));
app.use(express.urlencoded({extended:false}));
app.use(passport.initialize());
app.use(passport.session());
app.use(multer({dest: path.join(__dirname, './src/public/img/uploads/')}).single('texto'));


//Global Variables
app.use((req, res, next) =>{
  app.locals.success = req.flash('success');
  app.locals.failure = req.flash('failure');
  next();
});

//Static Files
app.use(express.static(path.join(__dirname, './src/public')));

//Routes
app.use(require('./src/routes/rutas.js'));


//Port
app.listen(app.get('port'), () =>{
  console.log('Servidor escuchando en el puerto', app.get('port'));
});
