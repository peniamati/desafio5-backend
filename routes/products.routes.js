import { Router } from "express";
import ProductManager from "../src/models/productManager.js";

const productManager = new ProductManager("./products.json");

// CRUD PRODUCTOS

const routerProd = Router()

routerProd.get("/", async(req, res) => {
  const { limit } = req.query
  const prods = await productManager.getProducts()
  const products = prods.slice(0, limit)
  res.status(200).send(products)
})

routerProd.get("/:pid", async(req, res) => {
  const { pid } = req.params

  const product = await productManager.getProductById(pid)

  if (product){
    res.status(200).send(product)
  }
  else{
    res.status(404).send({ error: "Producto no encontrado" })
  }
})

routerProd.post("/", async(req, res) => {
  const conf = await productManager.addProduct(req.body)

  if (conf){
    res.status(201).send("Producto creado")
  }
  else{
    res.status(400).send({ error: "Producto ya existente" }) 
  }
})

routerProd.put("/:pid", async(req, res) => {
  const { pid } = req.params

  const conf = await productManager.updateProduct(pid, req.body)

  if (conf){
    res.status(200).send("Producto actualizado")
  }
  else{
    res.status(404).send({ error: "Producto no encontrado" })
  }
})

routerProd.delete("/:pid", async(req, res) => {
  const { pid } = req.params

  const conf = await productManager.deleteProduct(pid)

  if (conf){
    res.status(200).send("Producto eliminado")
  }
  else{
    res.status(404).send({ error: "Producto no encontrado" })
  }
})

module.exports = routerProd