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

## Documentación API
La documentación de la API está disponible en Swagger. Se han creado rutas específicas para trabajar con productos y carritos sin necesidad de autenticación, lo que facilita las pruebas.

Puedes acceder a la documentación en la siguiente URL:

```
http://localhost:8080/apidocs
```

## Uso de Swagger
Para acceder a las rutas de Swagger sin autenticación, simplemente navega a la URL proporcionada arriba. La interfaz de Swagger te permitirá probar los diferentes endpoints de la API sin necesidad de ser admin o user.
