const {
  getOrderByIdAndEmail,
  getOrderById,
  getAllOrders,
  updateOrderStatus
} = require('../models/ordersModel');
const { sendOrderStatusEmail } = require('../services/orderMailer');
const {logger} = require('../services/logger');



// GET /track → user endpoint
const getOrder = async (req, res) => {
  let { orderId, email } = req.query;

  if (!orderId || !email) return res.status(400).json({ error: "Order ID and email are required" });

  try {
    const order = await getOrderByIdAndEmail(orderId, email);

    if (!order) return res.status(404).json({ error: "Order not found" });

    return res.json({
      orderId: order.order_id,
      customerName: order.customer_name,
      customerEmail: order.customer_email,
      customerPhone: order.customer_phone,
      billingAddress: order.billing_address,
      shippingAddress: order.shipping_address,
      currency: order.currency,
      totalAmount: (order.total_amount / 100).toFixed(2),
      status: order.status,
      items: order.items,
      createdAt: order.created_at,
      updatedAt: order.updated_at,
      tracking_number: order.tracking_number || null,
      tracking_url: order.tracking_url || null,
    });
  } catch (err) {

    console.error("❌ Error fetching order:", err);
    logger.error( err, 'Error fetching order:');
    res.status(500).json({ error: "Server error while fetching order" });
  }
};

// GET /admin/orders/:orderId → admin endpoint
const getOrderAdmin = async (req, res) => {
  const { orderId } = req.params;

  if (!orderId) return res.status(400).json({ error: "Order ID is required" });

  try {
    const order = await getOrderById(orderId);

    if (!order) return res.status(404).json({ error: "Order not found" });

    return res.json({
      orderId: order.order_id,
      customerName: order.customer_name,
      customerEmail: order.customer_email,
      customerPhone: order.customer_phone,
      billingAddress: order.billing_address,
      shippingAddress: order.shipping_address,
      currency: order.currency,
      totalAmount: (order.total_amount / 100).toFixed(2),
      status: order.status,
      items: order.items,
      createdAt: order.created_at,
      updatedAt: order.updated_at,
      tracking_number: order.tracking_number || null,
      tracking_url: order.tracking_url || null,
    });
  } catch (err) {
    console.error("❌ Error fetching order (admin):", err);
    logger.error( err, 'Error fetching order (admin):');
    res.status(500).json({ error: "Server error while fetching order" });
  }
};


// List all orders (admin)
const listOrders = async (req, res) => {
  try {
    const orders = await getAllOrders();

    const formatted = orders.map(order => ({
      orderId: order.order_id,
      customerName: order.customer_name,
      customerEmail: order.customer_email,
      totalAmount: (order.total_amount / 100).toFixed(2),
      items: order.items,
      phone: order.customer_phone,
      status: order.status,
      currency: order.currency,
      createdAt: order.created_at,
      updatedAt: order.updated_at,
      shipping_address: order.shipping_address,
      tracking_number: order.tracking_number || null,
        tracking_url: order.tracking_url || null,
    }));

    res.json(formatted);
  } catch (err) {
    console.error("❌ Error fetching orders:", err);
    logger.error( err, 'Error fetching orders:');
    res.status(500).json({ error: "Server error while fetching orders" });
  }
};

// Update order status
const changeOrderStatus = async (req, res) => {
  const { orderId, status, tracking_number, tracking_url, name, email } = req.body;

  if (!orderId) return res.status(400).json({ error: "Order ID is required" });

  if (!status && tracking_number === undefined && tracking_url === undefined) {
    return res.status(400).json({ error: "Nothing to update" });
  }

  try {
    const updatedOrder = await updateOrderStatus(orderId, { status: status.toLowerCase(), tracking_number, tracking_url });

    if (!updatedOrder) return res.status(404).json({ error: "Order not found" });

    await sendOrderStatusEmail({
      email, firstName: name,
      orderId, status: updatedOrder.status,
      trackingNumber: updatedOrder.tracking_number,
      trackingUrl: updatedOrder.tracking_url,
      shippingAddress: updatedOrder.shipping_address? updateOrderStatus.shipping_address : updateOrderStatus.billing_address})

    return res.json({
      orderId: updatedOrder.order_id,
      status: updatedOrder.status,
      tracking_number: updatedOrder.tracking_number,
      tracking_url: updatedOrder.tracking_url,
      updatedAt: updatedOrder.updated_at,
    });
  } catch (err) {
    console.error("❌ Error updating order:", err);
    logger.error( err, 'Error updating order:');
    res.status(500).json({ error: "Server error while updating order" });
  }
};

module.exports = {
  getOrder,
  listOrders,
  changeOrderStatus, getOrderAdmin
};
