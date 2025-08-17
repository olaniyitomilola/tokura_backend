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
  status = 'paid', items
}) => {
  await db.query(
    `INSERT INTO orders (
      order_id, stripe_session_id, stripe_payment_intent_id,
      customer_name, customer_email, customer_phone,
      billing_address, shipping_address, currency,
      total_amount, status, items
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
    [
      orderId,
      stripeSessionId,
      stripePaymentIntentId,
      customerName,
      customerEmail.toLowerCase(),
      customerPhone,
      billingAddress ? JSON.stringify(billingAddress) : null,
      shippingAddress ? JSON.stringify(shippingAddress) : null,
      currency,
      totalAmount,
      status,
    items ? JSON.stringify(items) : null,

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

const updateOrderStatus = async (orderId, { status, tracking_number, tracking_url }) => {
  const fields = [];
  const values = [];
  let idx = 1;

  if (status) {
    fields.push(`status = $${idx++}`);
    values.push(status);
  }
  if (tracking_number !== undefined) {
    fields.push(`tracking_number = $${idx++}`);
    values.push(tracking_number);
  }
  if (tracking_url !== undefined) {
    fields.push(`tracking_url = $${idx++}`);
    values.push(tracking_url);
  }

  if (fields.length === 0) return null;

  values.push(orderId); // last param
  const query = `UPDATE orders SET ${fields.join(', ')}, updated_at = NOW() WHERE order_id = $${idx} RETURNING *`;

  const res = await db.query(query, values);
  return res.rows[0];
};

const getOrderByIdAndEmail = async (orderId, email) => {
  const res = await db.query(
    `SELECT * FROM orders 
     WHERE order_id = $1 AND customer_email = $2`,
    [orderId, email]
  );
  return res.rows[0];
};

module.exports = {
  insertOrder,
  getOrderById,
  getAllOrders,
  getOrderByIdAndEmail,
  updateOrderStatus,
};
