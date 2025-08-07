const { v4: uuidv4 } = require('uuid');
const model = require('../models/productsModel');

const listProducts = () => model.getAllProducts();
const getProduct = (id) => model.getProductById(id);
const addProduct = (data) => model.createProduct({ id: uuidv4(), ...data });
const addProductImages = (productId, imageUrls) => model.addProductImages(productId, imageUrls);
const removeImage = (id) => model.deleteImageById(id);
const updateProduct = async (id, updates) => {
  return await model.updateProduct(id, updates);
};

module.exports = {
  listProducts,
  getProduct,
  addProduct,
  addProductImages,
  removeImage,
  updateProduct
};

