const express = require('express');
const router = express.Router();
const controller = require('../controllers/visitorController');

router.post('/', controller.handleTrackVisit);
router.get('/', controller.getVisitorStats)

module.exports = router;
