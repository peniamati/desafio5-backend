const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      requred: true,
    },
    password: {
      type: String,
    },
    name: {
      type: String,
    },
    lastname: {
      type: String,
    },
    age: {
      type: String,
    },
    role: {
      type: String,
      default: "user",
    },
    cart: {
      type: {
        cart: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "carts",
        },
      },
      required: true,
    },
  },
);

const User = mongoose.model('users', UserSchema); 

module.exports = User;
