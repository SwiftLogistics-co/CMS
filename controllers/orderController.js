const Order = require('../models/order');

// Place a new order
const placeOrder = async (req, res) => {
  try {
    const { clientId, items, totalAmount } = req.body;
    if (!clientId || !items || !Array.isArray(items) || items.length === 0 || !totalAmount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const order = new Order({
      clientId,
      items,
      totalAmount,
      createdAt: new Date()
    });
    const savedOrder = await order.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


module.exports = { placeOrder };
