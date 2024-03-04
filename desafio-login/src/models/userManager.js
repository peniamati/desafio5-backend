const User = require("../../public/dao/db/models/user.model");

class UserManager {
  constructor() {
    this.users = [];
  }

  async getUsers() {
    try {
      this.users = await User.find();
      return this.users;
    }
    catch (err) {
      console.error(err);
    }
  }

  async addUser(userData) {
    try {
      const newUser = new User(userData); // Crea una nueva instancia del modelo de usuario
      await newUser.save(); // Guarda el nuevo usuario en la base de datos
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
    }
    catch (err) {
      console.error(err);
    }
  }

  async deleteUser(id) {
    try {
      let res = await User.deleteOne({ _id: id });

      return res;
    }
    catch (err) {
      console.error(err);
    }
  }
}

module.exports = UserManager;
