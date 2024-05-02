const mongoose = require('mongoose');
require('dotenv').config();

module.exports = {
  connect: () => {
    return mongoose.connect(process.env.MONGO_URI)
    .then(() => {
      console.log('Base de datos conectada')
    })
    .catch(err => console.log(err))
  }
}