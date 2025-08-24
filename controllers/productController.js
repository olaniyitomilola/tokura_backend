const service = require('../services/productService')
const { logger } = require('../services/logger');


const getAll = async (req, res) => {
  try {
    const products = await service.listProducts();
    logger.info(`Fetched ${products.length} products`);
    res.json(products);
  } catch (error) {
    console.log(error)
      logger.error(error, 'Error fetching products:');
    res.status(500).json({ error: 'Server error' });
  }
};

const getOne = async (req, res) => {
  try {
    const product = await service.getProduct(req.params.id);
    if (!product) return res.status(404).json({ error: 'Not found' });
    res.json(product);
  } catch (error) {
    console.log(error)
      logger.error( error, 'Error fetching product:');
    res.status(500).json({ error: 'Server error' });
  }
};

const create = async (req, res) => {
  try {
    const product = await service.addProduct(req.body);
    res.status(201).json(product);
  } catch (error) {
    console.log(error)
      logger.error(error, 'Error creating product:');
    res.status(500).json({ error: 'Server error' });
  }
};
const addImagesByUrl = async (req, res) => {
  try {
    const { id: productId } = req.params;
    const { images } = req.body; // expecting: { images: ["url1", "url2", ...] }

    if (!Array.isArray(images) || images.length === 0) {
      return res.status(400).json({ error: "No image URLs provided" });
    }

    const image = await service.addProductImages(productId, images);

    res.status(201).json({success: true, message: "Image URLs added successfully", images:image });
  } catch (error) {
    console.error(error);
    logger.error( error, 'Error adding image URLs:');
    res.status(500).json({ error: "Server error while adding image URLs" });
  }
};
const deleteImage = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await service.removeImage(id);

    if (!deleted) {
      return res.status(404).json({ error: 'Image not found' });
    }

    res.json({success: true, message: 'Image deleted successfully', deleted });
  } catch (err) {
    console.error(err);
    logger.error( err, 'Error deleting image:');
    res.status(500).json({ error: 'Server error' });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updated = await service.updateProduct(id, updates);
    if (!updated) {
      return res.status(404).json({ error: 'Product not found or no fields provided' });
    }

    res.status(200).json(updated);
  } catch (err) {
    console.error(err);
    logger.error( err, 'Error updating product:');
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  getAll,
  getOne,
  create, 
  addImagesByUrl,
  deleteImage,
  updateProduct
};
