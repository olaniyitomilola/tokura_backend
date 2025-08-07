const model = require('../models/productLengthModel');

const getProductLengths = (productId) => model.getByProductId(productId);
const addProductLengths = (productId, lengths) => model.addLengths(productId, lengths);
const editProductLength = (id, data) => model.updateLength(id, data);
const removeProductLength = (id) => model.deleteLength(id);

module.exports = {
  getProductLengths,
  addProductLengths,
  editProductLength,
  removeProductLength,
};
