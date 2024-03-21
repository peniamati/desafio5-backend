const express = require("express");
const { Router } = express;
const passport = require("../config/passport.config.js");
const route = new Router();
const UserManager = require("../db/userManager.js");
const userManager = new UserManager();
const bcrypt = require("bcrypt");
const saltRounds = 10; // Número de rondas de sal para Bcrypt
const { tokenGenerator } = require("../utils/generateToken.js");

// En la ruta de registro
route.post("/register", async (req, res) => {
  try {
    let userNew = req.body;
    userNew.name = req.body.name;
    userNew.username = req.body.username;

    // Hashear la contraseña antes de almacenarla
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    userNew.password = hashedPassword;

    await userManager.addUser(userNew);
    res.redirect("/");
  } catch (error) {
    console.error(error);
  }
});

// En la ruta de inicio de sesión local
route.get(
  "/login",
  passport.authenticate("jwt", {
    session: false,
    failureRedirect: "/login", // Redirige a la página de inicio de sesión en caso de falla de autenticación
  }),
  (req, res) => {
    let token = tokenGenerator(req.user);
    res.cookie("cookieToken", token, { httpOnly: true });
    res.redirect("/api/products");
  }
);

// En la ruta de inicio de sesión con GitHub
route.get(
  "/login_github",
  passport.authenticate("login_github", {
    session: false,
  }),
  (req, res) => {
    let token = tokenGenerator(req.user);
    res.cookie("cookieToken", token, { httpOnly: true });
    res.redirect("/api/products");
  }
);
// Ruta para el callback exitoso de inicio de sesión con GitHub
route.get('/login_github/callback', passport.authenticate('login_github', {
  session: false,
  successRedirect: '/api/products', // Redirige a la página de productos después del inicio de sesión exitoso
  failureRedirect: '/login' // Redirige a la página de inicio de sesión en caso de falla de autenticación
}));

// Ruta para cerrar sesión
route.get("/logout", (req, res) => {
  res.clearCookie("cookieToken").redirect("/login");
});

// Ruta para current
route.get("/current", passport.authenticate('jwt', { session: false }), (req, res) => {
  if (req.user) {
    res.json({ user: req.user });
  } else {
    res.json({ user: null });
  }
})


module.exports = route;
