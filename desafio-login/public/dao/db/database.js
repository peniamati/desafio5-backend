const mongoose = require('mongoose');

module.exports = {
  connect: () => {
    return mongoose.connect('mongodb+srv://peniamati:pass1234@proyectocoder.lbewju8.mongodb.net/ecommerce')
    .then(() => {
      console.log('Base de datos conectada')
    })
    .catch(err => console.log(err))
  }
}