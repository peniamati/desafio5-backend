const passport = require('passport');
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;
const GitHubStrategy = require('passport-github').Strategy;
const User = require('../db/models/user.model');

// Configurar Local Strategy
passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
}, async (email, password, done) => {
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return done(null, false, { message: 'Usuario no encontrado' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return done(null, false, { message: 'Contraseña incorrecta' });
    }

    return done(null, user);
  } catch (error) {
    return done(error);
  }
}));

// Configurar GitHub Strategy
passport.use(new GitHubStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: 'http://localhost:8080/api/sessions/callbackGithub',
}, async (req, accessToken, refreshToken, profile, done) => {
  try {
    // Buscar o crear un usuario en tu base de datos utilizando la información de GitHub
    let user = await User.findOne({ username: profile.username });

    if (!user) {
      let email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null;

      // Si el usuario no tiene un correo electrónico asociado, usa el nombre de usuario como nombre de usuario
      let username = email ? email : profile.username;

      // Si el usuario no existe, crea uno nuevo
      user = new User({
        name: profile.displayName || 'Usuario GitHub',
        username: username,
      });
      await user.save();
    }

    // Indicar que la autenticación se ha completado y pasar los datos del usuario
    done(null, user);
  } catch (error) {
    done(error);
  }
}));




// Resto de la configuración Passport
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

module.exports = passport;