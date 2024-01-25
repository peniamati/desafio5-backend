const express = require("express");
const handlebars = require("express-handlebars");
const homeRouter = require("./routes/home.routes");
const routerRealTimeProducts = require("./routes/realTimeProducts.routes")
const http = require("http");
const { Server } = require("socket.io");
const ProductManager = require("./src/models/productManager");

const productManager = new ProductManager("./products.json");

const app = express();
const PORT = 8080 || process.env.PORT;

// Crear el servidor HTTP con Express
const server = http.createServer(app);

// Configurar la carpeta "public" para servir archivos estáticos
app.use(express.static(__dirname + "/public"));

// Configuración del motor de plantillas Handlebars
app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');

// Configurar las rutas
app.use('/home', homeRouter);
app.use('/realtimeproducts', routerRealTimeProducts)

// Crear el servidor de Socket.io asociado al servidor HTTP
const io = new Server(server);

io.on('connection', (socket) =>{

  socket.on("getProducts", async () => {
    try {
      const products = await productManager.getProducts();
      socket.emit("productsData", products);
    } catch (error) {
      console.error("Error al obtener productos:", error.message);
    }
  });

  socket.on("new-product", async (data) => {
    try{
      await productManager.addProduct(data);
      const arrProducts = await productManager.getProducts();
      socket.emit("all-products", arrProducts);
    }
    catch (error) {
      console.error("Error al agregar producto:", error.message);
    }
  });

  socket.on("deleteProduct", async (productId) => {
    try {
      productManager.deleteProduct(productId);
      socket.emit("productDeleted", productId);
    } catch (error) {
      console.error("Error al eliminar producto:", error.message);
    }
  });

})


// Iniciar el servidor HTTP
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
