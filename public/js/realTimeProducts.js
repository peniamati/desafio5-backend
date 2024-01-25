const socket = io();

let productsArray = [];

document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname.endsWith("/realtimeproducts")) {
    socket.emit("getProducts");

    socket.on("all-products", (products) => {
      productsArray = products;
      renderProducts(products);
    });
  }
});
const renderProducts = (products) => {
  const productsContainer = document.getElementById("productos");
  productsContainer.innerHTML = "";

  products.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.id = product.id;
    productCard.className = "col-md-3 mb-3"; // Utiliza col-md-3 para limitar el ancho

    // Verifica si la propiedad thumbnail es null y asigna una imagen por defecto
    const thumbnailSrc = product.thumbnail ? product.thumbnail : "https://i.ibb.co/txH0LxV/default-image-icon-vector-missing-260nw-2086941550.webp";

    productCard.innerHTML = `
      <div class="card">
        <img src="${thumbnailSrc}" alt="${product.title}" class="card-img-top" width="250" height="250">
        <div class="card-body">
          <h5 class="card-title">${product.title}</h5>
          <p class="card-text">${product.description}</p>
          <p class="card-text"><small class="text-muted">Stock: ${product.stock}</small></p>
          <h2 class="text-gray-200 font-semibold text-3xl mt-2 text-center">
            <span class="gradient-text">$${product.price}</span>
          </h2>
          <div class="w-full h-[1px] bg-gray-500 my-4"></div>
          <button class="btn btn-dark w-full mb-2">Comprar</button>
          <button class="btn btn-danger w-full" onclick="deleteProduct('${product.id}')">Eliminar</button>
        </div>
      </div>
    `;

    productsContainer.appendChild(productCard);
  });
};



const addProduct = () => {
  const product = {
    title : document.getElementById('title').value,
    description : document.getElementById('description').value,
    price : document.getElementById('price').value,
    thumbnail : document.getElementById('thumbnail').value,
    code : document.getElementById('code').value,
    stock : document.getElementById('stock').value,
    status : document.getElementById('status').value,
    category : document.getElementById('category').value
  }
  socket.emit('new-product', product)
  Swal.fire({
    text: "Se agrego el producto correctamente!",
    icon: "success", 
    showConfirmButton: true,
  })
  return false;
}

socket.on("productsData", (products) => {
  productsArray = products
  renderProducts(products);
});

const deleteProduct = (productId) => {
  Swal.fire({
    text: "Se eliminó el producto correctamente!",
    icon: "error",
    showConfirmButton: true,
  });

  socket.emit("deleteProduct", productId);
}

socket.on("productDeleted", (productId) => {
  const deletedProductBox = document.getElementById(productId);

  if (deletedProductBox) {
    deletedProductBox.remove();
  } else {
    console.error("No se encontró el producto para eliminar eliminar");
  }
});