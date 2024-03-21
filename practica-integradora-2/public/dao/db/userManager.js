const User = require("./models/user.model");
const { createHash } = require("../utils/bcrypts");
const CartManager = require("./cartManager");
const cartManager = new CartManager();

class UserManager {
  constructor() {
    this.users = [];
  }

  async addUser(userData) {
    try {
      const exist = await this.findUser(userData.email);
      if(!exist) {
        const cart = await cartManager.addCart();
        userData.cart = cart._id
      }else{
        if (!exist.cart) {
          const cart = await cartManager.addCart();
          userData.cart = cart._id
        } else {
          const cart = await cartManager.getCartById(exist.cart._id);
          userData.cart = cart._id
        }
      }

      if (userData.email === "admin@coder.com") {
        userData.role = "admin";
      }

      // Crear una nueva instancia de User
      const newUser = new User(userData);

      // Guardar el nuevo usuario en la base de datos
      await newUser.save();

      return newUser;
    } catch (error) {
      console.error('Error al crear usuario:', error);
      throw error;
    }
  }


  async getUserById(id) {
    try {
      let user = await User.findById(id);
      return user;
    } catch (err) {
      console.error(err);
    }
  }

  async deleteUser(id) {
    try {
      let res = await User.deleteOne({ _id: id });
      return res;
    } catch (err) {
      console.error(err);
    }
  }

  async loginWithGitHub(userData) {
    try {
      const exist = await this.findUser(userData.email);
      if (!exist) {
        // Realiza la solicitud para crear un nuevo carrito y espera la respuesta
        const cartResponse = await fetch("http://localhost:8080/api/carts/createCart", {
          method: "POST",
        });
        const cartData = await cartResponse.json(); // Extrae el ID del carrito de la respuesta JSON
        const cartId = cartData._id;

         // Crea un nuevo usuario con el ID del carrito obtenido
         const newUser = new User({
          email: userData.email,
          password: createHash("githubuserpassword"),
          name: userData.name,
          lastname: userData.name, // Revisar si esto es correcto
          age: userData.age,
          cart: cartId,
        });

        if (userData.email === "admin@coder.com"){
          newUser.role = "admin"
        }
       
        await newUser.save();
        delete newUser.password;
        return newUser;
      } else {
        delete exist.password;
        return exist;
      }
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  async findUser(email) {
    try {
      const userFound = await User.findOne({ email: email });
      return userFound ? userFound : false;
    } catch (err) {
      console.error(err);
      return false;
    }
  }
}

module.exports = UserManager;
