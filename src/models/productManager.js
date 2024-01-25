const fs = require('fs/promises');
const crypto = require('crypto');

//crypto.randomBytes(16).toString('hex'); // Id unico

class ProductManager {
  constructor(path) {
    this.path = path;
    this.products = [];
    this.initialize();
  }

  async initialize() {
    try {
      await fs.access(this.path);
      const data = await fs.readFile(this.path, 'utf-8');
      this.products = JSON.parse(data);
    } catch (error) {
      await fs.writeFile(this.path, '[]', 'utf-8');
    }
  }

  async getProducts() {
    try {
      await fs.access(this.path);
      const products = JSON.parse(await fs.readFile(this.path, 'utf-8'));
      return products;
    } catch (error) {
      // Si el archivo no existe, inicializarlo con una lista vacía
      await fs.writeFile(this.path, '[]', 'utf-8');
      return [];
    }
  }
  

  async getProductById(id) {
    const products = JSON.parse(await fs.readFile(this.path, 'utf-8'));
    const product = products.find(product => product.id === id);
    return product || null;
  }

  async addProduct(product) {
    try {
      const exist = this.products.find(p => p.code === product.code);
      if (exist) {
        return false;
      }
      product.id = crypto.randomBytes(16).toString('hex');
      if (product.status == null) {
        product.status = true;
      }
      this.products.push(product);
      await fs.writeFile(this.path, JSON.stringify(this.products), 'utf-8');
      return true;
    } catch (error) {
      console.error('Error al agregar producto:', error);
      return false;
    }
  }
  

  async updateProduct(id, product) {
    const products = JSON.parse(await fs.readFile(this.path, 'utf-8'));
    const prod = products.find(p => p.id === id);
    if (prod){
      prod.title = product.title;
      prod.description = product.description;
      prod.price = product.price;
      prod.stock = product.stock;
      prod.code = product.code;
      prod.status = product.status;
      prod.category = product.category;
      prod.thumbnail = product.thumbnail;
      await fs.writeFile(this.path, JSON.stringify(products));
      return true;
    }
    else{
      return false;
    }
  }

  async deleteProduct(id) {
    const products = JSON.parse(await fs.readFile(this.path, 'utf-8'));
    const product = products.find(p => p.id === id);
    if (product){
      await fs.writeFile(this.path, JSON.stringify(products.filter(p => p.id !== id)));
      return true;
    }
    else{
      return false;
    }
  }
}

module.exports = ProductManager