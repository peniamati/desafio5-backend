const passport = require('passport');
const GitHubStrategy = require("passport-github2").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const LocalStrategy = require('passport-local').Strategy; // Importa la estrategia local
const userManager = require("../db/userManager.js");
const UserManager = new userManager();
const { SECRET_KEY } = require("../utils/generateToken.js");
const bcrypt = require("bcrypt");

const cookieExtractor = function (req) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["cookieToken"];
  }
  return token;
};

const initializePassport = () => {
  // Configurar la estrategia JWT
  passport.use(
    "jwt",
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: SECRET_KEY,
      },
      async (jwt_payload, done) => {
        try {
          // Aquí puedes verificar el jwt_payload y encontrar el usuario en la base de datos
          const user = await UserManager.getUserById(jwt_payload.userId);
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

  // Configurar la estrategia GitHub
  passport.use(
    "login_github",
    new GitHubStrategy({
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: 'http://localhost:8080/api/sessions/login_github/callback',
    }, async (accessToken, refreshToken, profile, done) => {
      try {
        const response = await UserManager.loginWithGitHub(profile._json);
        return response
          ? done(null, response)
          : done(null, false, {
              message: "Usuario no encontrado",
            });
      } catch (err) {
        return done(err);
      }
    })
  );

  // Configurar la estrategia local
  passport.use(
    "login_local",
    new LocalStrategy(
      { usernameField: 'email' }, // Define el campo del nombre de usuario
      async (username, password, done) => {
        try {
          const user = await UserManager.findUser(username); // Busca al usuario por su nombre de usuario
          if (!user) {
            return done(null, false, { message: 'Nombre de usuario incorrecto' });
          }
          const match = await bcrypt.compare(password, user.password); // Compara la contraseña
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

initializePassport(); // Llama a la función para inicializar Passport

module.exports = passport; // Exporta Passport directamente
