const express = require('express');
const Product = require('../models/Product');
const jwt = require("jsonwebtoken");
const router = express.Router();

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Acceso denegado" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Token inválido" });
  }
};


// Obtener todos los productos
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener los productos' });
  }
});

// Añadir un producto
router.post('/',authenticate, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "No tienes permisos para crear productos" });
  }
  const { name, price, description, url, quantity } = req.body;
  try {
    const product = new Product({ name, price, description, url, quantity });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: 'Error al añadir el producto' });
  }
});

// Actualizar el stock de un producto
router.patch('/:id/stock', async (req, res) => {
    const { quantityChange } = req.body;
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: 'Producto no encontrado' });
      }
      product.quantity += quantityChange;
      await product.save();
      res.json(product);
    } catch (err) {
      res.status(500).json({ message: 'Error al actualizar el stock' });
    }
  });

module.exports = router;