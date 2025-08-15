const express = require('express');
const controller = require('../controllers/checkoutController');
const router = express.Router();

router.post('/', controller.createCheckoutSession);
router.get('/session-status', controller.getCheckoutSession);
// router.get('/status', controller.checkStatus);

module.exports = router;