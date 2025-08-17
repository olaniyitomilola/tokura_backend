const express = require('express');
const {
  getOrder,
  getOrderAdmin,
  listOrders,
  changeOrderStatus
} = require('../controllers/OrdersController');

const router = express.Router();

// USER endpoint
router.get('/track', getOrder);

// ADMIN endpoints
router.get('/', listOrders);               // list all orders
router.get('/:orderId', getOrderAdmin);   // fetch order by ID
router.patch('/status', changeOrderStatus);

module.exports = router;
