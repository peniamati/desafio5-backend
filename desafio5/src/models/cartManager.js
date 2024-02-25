import {promises as fs} from 'fs';
import crypto from 'crypto';

export class CartManager {
  constructor(path) {
    this.carts = [];
    this.path = path;
  }

  async getProductsByCartId(cartId) {
    const carts = JSON.parse(await fs.readFile(this.path, 'utf-8'));
    const cart = carts.find(c => c.id === cartId);
    return cart.products || null;
  }

  async addCart(productos) {
    const carts = JSON.parse(await fs.readFile(this.path, 'utf-8'));
    const cart = {id: crypto.randomBytes(16).toString('hex'), products: productos};
    carts.push(cart);
    await fs.writeFile(this.path, JSON.stringify(carts));
    return true;
  }

  async addProductToCart(cartId, idProduct, quantity) {
    const carts = JSON.parse(await fs.readFile(this.path, 'utf-8'));
    const cartExist = carts.find(c => c.id === cartId);
    if (cartExist) {
      const productExist = cartExist.products.find(p => p.id === idProduct);
      if (productExist) {
        productExist.quantity += quantity;
      }
      else {
        cartExist.products.push({id: idProduct, quantity: quantity});
      }
      await fs.writeFile(this.path, JSON.stringify(carts));
      return true;
    }
    else {
      return false;
    }   
  }
}

export default CartManager;