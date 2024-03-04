const express = require("express");

const { Router } = express;

const userManager = require("../src/models/userManager");

const User = new userManager();

const route = new Router();

route.post("/register", async (req, res) => {
  try {
    let userNew = {
      username: req.body.username,
      password: req.body.password,
      name: req.body.name
    };

    // Agregar el usuario con await
    await User.addUser(userNew);

    res.redirect("/");
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    res.status(500).send("Error interno del servidor");
  }
});


route.post("/", async (req, res) => {
  try {
    let userNew = req.body;
    let users = await User.getUsers(); // Espera a que se resuelva la promesa
    let userFound = users.find((user) => user.username === userNew.username && user.password === userNew.password);
    if (userFound) {
      req.session.user = {
        username: userFound.username,
        rol: (userFound.username === "adminCoder@coder.com" && userFound.password === "adminCod3r123") ? "admin" : "usuario",
      };
      res.redirect("/api/products");
    } else {
      res.send("Usuario o contraseña incorrectos");
    }
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).send("Error interno del servidor");
  }
});

route.get("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) {
      res.send("Error en logout");
    }
    else{
      res.redirect("/");
    }
  });
})

module.exports = route;
