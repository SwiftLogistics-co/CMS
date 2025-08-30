const express = require('express');
const router = express.Router();
const pool = require('../db');
const { placeOrder } = require('../controllers/orderController');

// POST /orders/place (uses controller)
router.post('/place', placeOrder);

// Create new order (legacy/manual)
router.post('/', async (req, res) => {
  const { client_id, product, quantity } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO orders (client_id, product, quantity) VALUES ($1, $2, $3) RETURNING *',
      [client_id, product, quantity]
    );
    res.json({ message: 'Order created', order: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all orders
router.get('/', async (req, res) => {
  const result = await pool.query('SELECT * FROM orders');
  res.json(result.rows);
});

module.exports = router;
