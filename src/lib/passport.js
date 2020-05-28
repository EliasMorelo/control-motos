const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const pool = require('../database');

passport.use('local.login', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done)=>{
  console.log(req.body);
     const result = await pool.query("SELECT * FROM administradores WHERE username = ?", [username]);
     if (result.length > 0) {
       const user = result[0];
       if (user.password == password){
            done(null, user, req.flash('success', ''));
       }else {
         done(null, false, req.flash('failure', 'Contraseña incorrecta'));
       }
     }else {
       return done(null, false, req.flash('failure', 'Usuario incorrecto, intentelo de nuevo'));
     }
    return done(null, user)
}));

passport.serializeUser((usr, done) =>{
   done(null, usr.id);
});

passport.deserializeUser(async (id, done) => {
   const rows = await pool.query('SELECT * FROM administradores WHERE id =  ?',[id]);
   done(null, rows[0]);
});
