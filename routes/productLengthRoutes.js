const express = require('express');
const controller = require('../controllers/productLengthController');
const router = express.Router();

router.get('/:productId/lengths', controller.getLengths);
router.post('/:productId/lengths', controller.createLengths);
router.put('/lengths', controller.updateLength);
router.delete('/lengths/:id', controller.deleteLength);

module.exports = router;
