# Kiosco App

Este repositorio contiene el código para una tienda similar a un kiosco. La aplicación está diseñada para manejar productos y carritos, y permite a los usuarios navegar y realizar compras. Además, se han creado rutas específicas para pruebas en Swagger sin necesidad de autenticación.

## Configuración del Entorno

Para ejecutar la aplicación, asegúrate de configurar las siguientes variables de entorno en un archivo `.env` en la raíz del proyecto:

```dotenv
APPID=856031
CLIENT_ID=Iv1.f3c57083f19e723d
CLIENT_SECRET=2053bfb342a74dec179e580138b8bfe8c6792bbd
MONGO_URI=mongodb+srv://peniamati:pass1234@proyectocoder.lbewju8.mongodb.net/ecommerce
PORT=8080
JWT_SECRET=32cefa444724189d9e5075aa6ed7ec21f9227afc2c3011fd59fdeb6be13c9b64

# Entorno de desarrollo
LOG_LEVEL_DEV=debug

# Entorno de producción
LOG_LEVEL_PROD=info

MAILADMIN=adminCoder@coder.com
contraseña=Admin1234

MAILPREMIUM=juan@mail.com
pass=Juan1234

EMAIL_USER=matiaspa380@gmail.com
EMAIL_PASS=okfl vxpf blqu mkct 
```

## Scripts Disponibles
### Desarrollo

Para iniciar el entorno de desarrollo, utiliza el siguiente comando:
```
npm run dev
```

### Producción

Para iniciar el entorno de producción, utiliza el siguiente comando:

```
npm start
```

### Test

Para iniciar los tests, utiliza el siguiente comando:

```
npm run test
```

## Documentación API
La documentación de la API está disponible en Swagger. Se han creado rutas específicas para trabajar con productos y carritos sin necesidad de autenticación, lo que facilita las pruebas.

Puedes acceder a la documentación en la siguiente URL:

```
http://localhost:8080/apidocs
```

## Uso de Swagger
Para acceder a las rutas de Swagger sin autenticación, simplemente navega a la URL proporcionada arriba. La interfaz de Swagger te permitirá probar los diferentes endpoints de la API sin necesidad de ser admin o user.

## Rutas disponibles
### Auth
```
// routes/auth.routes.js
POST /api/sessions/register
POST /api/sessions/login
GET /api/sessions/login_github
GET /api/sessions/login_github/callback
POST /api/sessions/logout
GET /api/sessions/current
```

### Carts
```
// routes/carts.routes.js
GET /api/carts/allCarts
GET /api/carts/:cid
POST /api/carts/addProdToCart/:cId/:pId
POST /api/carts/createCart
DELETE /api/carts/:cid/products/:pid
DELETE /api/carts/:cid
POST /api/carts/:cid/products
PUT /api/carts/:cid
PUT /api/carts/:cid/products/:pid
POST /api/carts/:cid/purchase
```

### Chat
```
// routes/chat.routes.js
GET /api/chat/allMessages
POST /api/chat/createMessage
GET /api/chat/
```

### Logger
```
// routes/logger.routes.js
GET /api/loggerTest
```

### Main
```
// routes/main.routes.js
GET /api/sessions/
GET /api/sessions/login
GET /api/sessions/register
GET /api/sessions/profile
```

### Products
```
// routes/products.routes.js
GET /api/products/
GET /api/products/allProducts
GET /api/products/prodById/:productId
GET /api/products/manager/
POST /api/products/createProd
PUT /api/products/updateProd/:id
DELETE /api/products/deleteProd/:id
GET /api/products/mockingproducts
```

### Real Time Products
```
// routes/realTimeProducts.routes.js
GET /api/realTimeProducts/
GET /api/realTimeProducts/realtimeproducts
```

### Users
```
// routes/user.routes.js
GET /api/users/reset-password
POST /api/users/reset-password-email
GET /api/users/reset-password/:token
POST /api/users/reset-password/:token
PUT /api/users/premium/:uid
GET /api/users/all-users-emails
POST /api/users/:uid/documents
```


