const express = require('express');
const { Router } = express;

const homeRouter = Router()

homeRouter.get('/', async (req, res) => {
    try {
    
        res.status(200).render("home", { js: "realTimeProducts.js"})

    } catch (error) {
        console.log(`Error obteniendo los productos: ${error}`);
    }
})

module.exports = homeRouter