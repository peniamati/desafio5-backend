class ProductDTO {
  constructor(data) {
    this.title = data.title;
    this.description = data.description;
    this.price = data.price;
    this.stock = data.stock;
    this.category = data.category;
    this.thumbnails = data.thumbnails;
  }
}

module.exports = ProductDTO;