const db = require('../config/database');

const findVisit = async (visitDate, ip) => {
  const res = await db.query(
    `SELECT 1 FROM daily_visitors WHERE visit_date = $1 AND ip_address = $2`,
    [visitDate, ip]
  );
  return res.rows.length > 0;
};

const insertVisit = async ({ visitDate, ip, country, city, userAgent }) => {
  await db.query(
    `INSERT INTO daily_visitors (visit_date, ip_address, country, city, user_agent)
     VALUES ($1, $2, $3, $4, $5)`,
    [visitDate, ip, country, city, userAgent]
  );
};


const getAllVisitors = async () => {
  const res = await db.query(`
    SELECT 
      id,
      visit_date,
      ip_address,
      country,
      city,
      user_agent,
      created_at
    FROM daily_visitors
    ORDER BY visit_date DESC
  `);

  return res.rows;
};


module.exports = {
  findVisit,
  insertVisit,
  getAllVisitors
};
