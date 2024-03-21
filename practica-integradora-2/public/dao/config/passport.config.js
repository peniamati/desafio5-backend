const passport = require('passport');
const GitHubStrategy = require("passport-github2").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const LocalStrategy = require('passport-local').Strategy;
const User = require("../db/models/user.model");
const Cart = require("../db/models/cart.model"); // Importa el modelo de carrito
const UserManager = require("../db/userManager.js");
const userManager = new UserManager();
require('dotenv').config();
const { tokenGenerator, SECRET_KEY } = require("../utils/generateToken.js");
const bcrypt = require("bcrypt");

const cookieExtractor = function (req) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["cookieToken"];
  }
  return token;
};

const initializePassport = () => {
  passport.use(
    "jwt",
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: SECRET_KEY,
      },
      async (jwt_payload, done) => {
        try {
          const user = await userManager.getUserById(jwt_payload.id);
          if (!user) {
            return done(null, false);
          }
          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  passport.use(
    "login_github",
    new GitHubStrategy(
      {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: 'http://localhost:8080/api/sessions/login_github/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Verificar si el usuario ya existe en la base de datos
          let user = await userManager.findUserByGithubId(profile.id);
          if (!user) {
            // Si el usuario no existe, crear uno nuevo
            const newUser = new User({
              email: profile.emails && profile.emails.length > 0 ? profile.emails[0].value : '', // Verifica si hay correos electrónicos en el perfil
              name: profile.displayName || '', // Usa el nombre de pantalla como nombre si está disponible
              lastname: profile.name && profile.name.familyName ? profile.name.familyName : '', // Verifica si hay un apellido en el perfil
              age: profile.age || '', // Verifica si hay una edad en el perfil
              role: "github user",
            });
            
            // Crear un carrito para el nuevo usuario
            const newCart = await Cart.create({ products: [] });
            newUser.cart = { cart: newCart._id }; // Asigna el ID del nuevo carrito al usuario
            
            user = await newUser.save();
          }
          
          // Generar token para el usuario
          const token = tokenGenerator(user);
          
          // Devolver el usuario y el token
          return done(null, { user, token });
        } catch (err) {
          return done(err);
        }
      }
    )
  );
  

  passport.use(
    "login_local",
    new LocalStrategy(
      { usernameField: 'email' },
      async (email, password, done) => {
        try {
          const user = await userManager.findUser(email);
          if (!user) {
            return done(null, false, { message: 'Correo electrónico incorrecto' });
          }
          const match = await bcrypt.compare(password, user.password);
          if (!match) {
            return done(null, false, { message: 'Contraseña incorrecta' });
          }
          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );
};

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

initializePassport();

module.exports = { initializePassport };
