// models/orders.js
const db = require('../config/database');

const insertOrder = async ({
  orderId,
  stripeSessionId,
  stripePaymentIntentId,
  customerName,
  customerEmail,
  customerPhone,
  billingAddress,
  shippingAddress,
  currency,
  totalAmount,
  status = 'paid',
}) => {
  await db.query(
    `INSERT INTO orders (
      order_id, stripe_session_id, stripe_payment_intent_id,
      customer_name, customer_email, customer_phone,
      billing_address, shipping_address, currency,
      total_amount, status
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
    [
      orderId,
      stripeSessionId,
      stripePaymentIntentId,
      customerName,
      customerEmail,
      customerPhone,
      billingAddress ? JSON.stringify(billingAddress) : null,
      shippingAddress ? JSON.stringify(shippingAddress) : null,
      currency,
      totalAmount,
      status,
    ]
  );
};

const getOrderById = async (orderId) => {
  const res = await db.query(
    `SELECT * FROM orders WHERE order_id = $1`,
    [orderId]
  );
  return res.rows[0];
};

const getAllOrders = async () => {
  const res = await db.query(
    `SELECT * FROM orders ORDER BY created_at DESC`
  );
  return res.rows;
};

const updateOrderStatus = async (orderId, newStatus) => {
  const res = await db.query(
    `UPDATE orders
     SET status = $1, updated_at = NOW()
     WHERE order_id = $2
     RETURNING *`,
    [newStatus, orderId]
  );
  return res.rows[0];
};

module.exports = {
  insertOrder,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
};
