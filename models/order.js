const db = require('../db');

class Order {
  constructor({ clientId, items, totalAmount, createdAt }) {
    this.clientId = clientId;
    this.items = items;
    this.totalAmount = totalAmount;
    this.createdAt = createdAt;
  }

  async save() {
    // Example: Save to DB (replace with your DB logic)
    const result = await db.query('INSERT INTO orders (clientId, items, totalAmount, createdAt) VALUES (?, ?, ?, ?)', [
      this.clientId,
      JSON.stringify(this.items),
      this.totalAmount,
      this.createdAt
    ]);
    this.id = result.insertId;
    return this;
  }
}

module.exports = Order;
