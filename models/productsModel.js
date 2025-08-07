const db = require('../config/database.js');

const getAllProducts = async () => {
  const res = await db.query(`
    SELECT
      p.id,
      p.name,
      p.type,
      p.category,
      p.widget_link,
      p.additional_note,
      p.specifications,
      p.img,
      p.description,
      pl.id AS length_id,
      pl.size,
      pl.price,
      pl.stock,
      pi.id AS image_id,
      pi.image AS product_image
    FROM products p
    LEFT JOIN product_lengths pl ON p.id = pl.product_id
    LEFT JOIN product_images pi ON p.id = pi.product_id
    WHERE p.is_deleted = false

  `);

  const grouped = {};

  res.rows.forEach(row => {
    const {
      id, name, type, category, img, description,
      length_id, size, price, stock,
      image_id, product_image
    } = row;

    if (!grouped[id]) {
      grouped[id] = {
        id,
        name,
        type,
        category,
        img,
        description,
        lengths: [],
        otherImages: []
      };
    }

    if (size !== null) {
      grouped[id].lengths.push({ id: length_id, size, price, stock });
    }

    if (product_image && image_id && !grouped[id].otherImages.some(img => img.id === image_id)) {
      grouped[id].otherImages.push({ id: image_id, image: product_image });
    }
  });

  return Object.values(grouped);
};


const getProductById = async (id) => {
  const res = await db.query(`
    SELECT 
      p.*,
      pl.id AS length_id,
      pl.size,
      pl.price,
      pl.stock,
      pi.id AS image_id,
      pi.image AS product_image
    FROM products p
    LEFT JOIN product_lengths pl ON p.id = pl.product_id
    LEFT JOIN product_images pi ON p.id = pi.product_id
    WHERE p.id = $1 AND p.is_deleted = false
  `, [id]);

  if (res.rows.length === 0) return null;

  const {
    name,
    type,
    category,
    img,
    description,
    widget_link,
    specifications,
    additional_note
  } = res.rows[0];

  const lengths = [];
  const seenSizes = new Set();
  const otherImagesMap = new Map();

  res.rows.forEach(row => {
    if (row.size && !seenSizes.has(row.size)) {
      lengths.push({ id: row.length_id, size: row.size, price: row.price, stock: row.stock });
      seenSizes.add(row.size);
    }
    if (row.product_image && row.image_id && !otherImagesMap.has(row.image_id)) {
      otherImagesMap.set(row.image_id, { id: row.image_id, image: row.product_image });
    }
  });

  return {
    id,
    name,
    type,
    category,
    img,
    description,
    lengths,
    otherImages: Array.from(otherImagesMap.values()),
     widget_link,
    specifications,
    additional_note
  };
};

const createProduct = async ({ id, name, type, category, img, description, specifications }) => {
  const res = await db.query(
    `INSERT INTO products (id, name, type, category, img, description, specifications)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [id, name, type, category, img, description, specifications || null]
  );
  return res.rows[0];
};
const addProductImages = async (productId, imageUrls) => {
  if (!imageUrls.length) return [];

  const values = imageUrls.map((_, i) => `($1, $${i + 2})`).join(',');
  const params = [productId, ...imageUrls];

  const result = await db.query(
    `INSERT INTO product_images (product_id, image) 
     VALUES ${values} 
     RETURNING id, image`,
    params
  );

  return result.rows; // returns [{ id, image }, ...]
};

const deleteImageById = async (id) => {
  const res = await db.query(
    `DELETE FROM product_images WHERE id = $1 RETURNING *`,
    [id]
  );
  return res.rows[0];
};

const updateProduct = async (id, updates) => {
  const fields = [];
  const values = [];
  let i = 1;

  for (const key in updates) {
    fields.push(`${key} = $${i}`);
    values.push(updates[key]);
    i++;
  }

  if (fields.length === 0) return null; // nothing to update

  values.push(id); // last parameter is product id

  const query = `
    UPDATE products
    SET ${fields.join(', ')}
    WHERE id = $${values.length}
    RETURNING *
  `;

  const res = await db.query(query, values);
  return res.rows[0];
};


module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  addProductImages,
  deleteImageById,
  updateProduct,
};