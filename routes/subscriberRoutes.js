const express = require('express');
const router = express.Router();
const {
  addSubscriber,
  listSubscribers,
  updateStatus
} = require('../controllers/subscriberController');

// Add a subscriber
router.post('/', addSubscriber);

// Get all subscribers
router.get('/', listSubscribers);

// Update subscriber status
router.put('/', updateStatus);

module.exports = router;
