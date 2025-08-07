const db = require('../config/database');

const getByProductId = async (productId) => {
  const res = await db.query(
    'SELECT * FROM product_lengths WHERE product_id = $1',
    [productId]
  );
  return res.rows;
};

const addLengths = async (productId, lengths) => {
  const values = lengths.map(
    ({ size, price, stock }) => `('${productId}', ${size}, ${price ?? 'NULL'}, ${stock ?? 0})`
  ).join(',');

  const query = `
    INSERT INTO product_lengths (product_id, size, price, stock)
    VALUES ${values}
    RETURNING *;
  `;

  const res = await db.query(query);
  return res.rows;
};


const updateLength = async (id, { size, price, stock }) => {
    console.log(id)
  const res = await db.query(
    `UPDATE product_lengths
     SET size = $1, price = $2, stock = $3
     WHERE id = $4
     RETURNING *`,
    [size, price, stock, id]
  );
  return res.rows[0];
};

const deleteLength = async (id) => {
  const res = await db.query(
    'DELETE FROM product_lengths WHERE id = $1 RETURNING *',
    [id]
  );
  return res.rows[0];
};


module.exports = {
  getByProductId,
  addLengths,
  deleteLength,
  updateLength
};
