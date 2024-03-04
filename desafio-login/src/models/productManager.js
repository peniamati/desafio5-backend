const Products = require('../../public/dao/db/models/productManager.model')

class ProductManager {
  constructor() {
    this.products = [];
  }

  async getProducts(limit, page, sort, query) {
    try {
      let sortOrder = sort === 'desc' ? -1 : 1;
  
      let filter = {};
      
      if (query.category) {
        filter.category = query.category;
      }
      if (query.status !== undefined) {
        filter.status = query.status;
      }
  
      let productos = await Products.paginate(
        filter,
        {
          limit: limit ? limit : 10,
          sort: sort ? { price: sortOrder } : null,
          page: page ? page : 1,
        }
      );
  
      productos.docs = productos.docs.map(doc => doc.toObject());
  
      const buildQueryString = (params) => {
        return Object.keys(params)
          .map(key => `${key}=${encodeURIComponent(params[key])}`)
          .join('&');
      };
  
      const queryString = buildQueryString(query);
  
      return {
        success: true,
        message: "Productos obtenidos correctamente",
        payload: productos.docs,
        totalPages: productos.totalPages,
        prevPage: productos.prevPage,
        nextPage: productos.nextPage,
        hasPrevPage: productos.hasPrevPage,
        hasNextPage: productos.hasNextPage,
        prevLink: productos.prevPage ? `http://localhost:8080/api/?${queryString}&page=${productos.prevPage}&limit=${limit}&sort=${sort}` : null,
        nextLink: productos.nextPage ? `http://localhost:8080/api/?${queryString}&page=${productos.nextPage}&limit=${limit}&sort=${sort}` : null
      };
    } catch (error) {
      return { success: false, message: 'Error al obtener los productos.', error: error}
    }
  }
  
  
  async addProduct(product) {
    try {
      this.products = product;
      await Products.create(this.products);
      return product;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  async delProduct(id) {
    try {
      await Products.deleteOne({ _id: id });
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }
  async updateProduct(id, update) {
    try {
      await Products.updateOne({ _id: id }, update);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }
}

module.exports = ProductManager;
