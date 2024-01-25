import { Router } from "express";
import CartManager from "../models/cartManager.js";

const cartManager = new CartManager("./carts.json");

// CRUD PRODUCTOS

const routerCart = Router()


routerCart.get("/:cid", async(req, res) => {
  const { cid } = req.params

  const cart = await cartManager.getProductsByCartId(cid)

  if (cart){
    res.status(200).send(cart)
  }
  else{
    res.status(404).send({ error: "Cart no encontrado" })
  }
})

routerCart.post("/", async(req, res) => {
  const conf = await cartManager.addCart(req.body.products)

  if (conf){
    res.status(201).send("Cart creado")
  }
  else{
    res.status(400).send({ error: "Cart ya existente" }) 
  }
})

routerCart.post("/:cid/product/:pid", async(req, res) => {
  const { cid, pid } = req.params

  const conf = await cartManager.addProductToCart(cid, pid, req.body.quantity)

  if (conf){
    res.status(200).send("Cart actualizado")
  }
  else{
    res.status(404).send({ error: "Cart no encontrado" })
  }
})

export default routerCart