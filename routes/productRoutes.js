const express = require('express');
const controller = require('../controllers/productController');
const router = express.Router();

router.get('/', controller.getAll);
router.post('/', controller.create);
router.get('/:id', controller.getOne);
router.patch(`/:id`, controller.updateProduct)
router.delete('/images/:id',controller.deleteImage)
router.post('/:id/images', express.json(), controller.addImagesByUrl);


module.exports = router;