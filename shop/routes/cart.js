const express = require('express');
const router = express.Router();
const products = require('../data/products.json');

// GET cart
router.get('/', (req, res) => {
  const cart = req.session.cart || [];
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  res.json({ cart, total: total.toFixed(2) });
});

// POST add item to cart
router.post('/add', (req, res) => {
  const { productId, qty = 1 } = req.body;
  if (!req.session.cart) req.session.cart = [];

  const product = products.find(p => p.id === parseInt(productId));
  if (!product) return res.status(404).json({ error: 'Product not found' });

  const existing = req.session.cart.find(i => i.id === product.id);
  if (existing) {
    existing.qty += parseInt(qty);
  } else {
    req.session.cart.push({ id: product.id, name: product.name, price: product.price, image: product.image, qty: parseInt(qty) });
  }

  res.json({ message: 'Added to cart', cart: req.session.cart });
});

// PUT update qty
router.put('/update', (req, res) => {
  const { productId, qty } = req.body;
  if (!req.session.cart) return res.json({ cart: [] });

  if (parseInt(qty) <= 0) {
    req.session.cart = req.session.cart.filter(i => i.id !== parseInt(productId));
  } else {
    const item = req.session.cart.find(i => i.id === parseInt(productId));
    if (item) item.qty = parseInt(qty);
  }

  res.json({ cart: req.session.cart });
});

// DELETE remove item
router.delete('/remove/:id', (req, res) => {
  if (!req.session.cart) return res.json({ cart: [] });
  req.session.cart = req.session.cart.filter(i => i.id !== parseInt(req.params.id));
  res.json({ cart: req.session.cart });
});

// DELETE clear cart
router.delete('/clear', (req, res) => {
  req.session.cart = [];
  res.json({ message: 'Cart cleared' });
});

// POST checkout (mock)
router.post('/checkout', (req, res) => {
  const { name, email, address } = req.body;
  if (!name || !email || !address) {
    return res.status(400).json({ error: 'Name, email, and address are required' });
  }
  const cart = req.session.cart || [];
  if (cart.length === 0) return res.status(400).json({ error: 'Cart is empty' });

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0).toFixed(2);
  req.session.cart = [];

  res.json({
    message: 'Order placed successfully!',
    order: { name, email, address, items: cart, total, orderId: 'ORD-' + Date.now() }
  });
});

module.exports = router;
