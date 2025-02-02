const chai = require('chai');
const expect = chai.expect;
const request = require('supertest-session');
const app = require('../index.js');

describe('Product Router', function() {
  let agent;

  // Aumentar el tiempo de espera para las pruebas
  this.timeout(5000);

  before(async () => {
    // Crear un agente de supertest-session
    agent = request(app);

    // Iniciar sesión como un usuario administrador y guardar la sesión
    await agent
      .post('/api/sessions/login')
      .send({ email: 'adminCoder@coder.com', password: 'Admin1234' });
  });

  it('debería devolver todos los productos', async () => {
    // Realizar una solicitud para obtener todos los productos con la sesión autenticada
    const res = await agent.get('/api/products/allProducts');
    console.log('Contenido obtenido:', res.body); // Mostrar contenido obtenido por pantalla
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('data').that.is.an('array');
  });

  it('debería devolver un producto específico por ID', async () => {
    const productId = '6630189271033ddbeac14620'; 
    const res = await agent.get(`/api/products/prodById/${productId}`);
    console.log('Contenido obtenido:', res.body); // Mostrar contenido obtenido por pantalla
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('data').that.is.an('object');
    expect(res.body.data).to.have.property('_id');
  });

  it('debería crear un nuevo producto de prueba en la base de datos', async () => {
    const newProduct = {
      title: 'Producto Prueba',
      description: 'Descripción del nuevo producto',
      price: 100,
      thumbnail: 'https://via.placeholder.com/150',
      code: '123456789',
      stock: 10,
      status: true,
      category: 'Prueba',
    };
    const res = await agent
      .post('/api/products/createProd')
      .send(newProduct);
    console.log('Contenido obtenido:', res.body); // Mostrar contenido obtenido por pantalla
    expect(res.status).to.equal(201);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('data');
  });
});
