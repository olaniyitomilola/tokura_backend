const service = require('../services/productLengthService');
const { logger } = require('../services/logger');

const getLengths = async (req, res) => {
  try {
    const { productId } = req.params;
    const lengths = await service.getProductLengths(productId);
    res.json(lengths);
  } catch (error) {
    console.error(error);
      logger.error(error, 'Error fetching product lengths:');
    res.status(500).json({ error: 'Server error' });
  }
};

const createLengths = async (req, res) => {
  try {
    const { productId } = req.params;
    const { lengths } = req.body;

    if (!Array.isArray(lengths)) {
      return res.status(400).json({ error: 'Invalid input. Expected array of lengths.' });
    }

    const created = await service.addProductLengths(productId, lengths);
    //console.log(created)
    res.status(201).json(created);
  } catch (error) {
    console.error(error);
      logger.error(error, 'Error creating product lengths:');
    res.status(500).json({ error: 'Server error' });
  }
};

const updateLength = async (req, res) => {
  try {
    const { size, price, stock,id } = req.body;

    const updated = await service.editProductLength(id, { size, price, stock });

    if (!updated) return res.status(404).json({ error: 'Length not found' });
    res.json(updated);
  } catch (error) {
    console.error(error);
      logger.error(error, 'Error updating product length:');
    res.status(500).json({ error: 'Server error' });
  }
};

const deleteLength = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await service.removeProductLength(id);

    if (!deleted) return res.status(404).json({ error: 'Length not found' });
    res.json({ message: 'Deleted successfully', deleted });
  } catch (error) {
    console.error(error);
      logger.error(error, 'Error deleting product length:');
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  getLengths,
  createLengths,
  updateLength,
  deleteLength,
};
