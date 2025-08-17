const db = require('../config/database');

const insertSubscriber = async ({ firstName, email, status = true }) => {
  await db.query(
    `INSERT INTO subscribers (first_name, email, status)
     VALUES ($1, $2, $3)
     ON CONFLICT (email) DO NOTHING`,
    [firstName, email, status]
  );
};

const getSubscriberByEmail = async (email) => {
  const res = await db.query(
    `SELECT first_name, email, status FROM subscribers WHERE email = $1`,
    [email]
  );
  return res.rows[0];
};

const getAllSubscribers = async () => {
  const res = await db.query(
    `SELECT first_name, email, status FROM subscribers ORDER BY created_at DESC`
  );
  return res.rows;
};

const updateSubscriberStatus = async (email, status) => {
  const res = await db.query(
    `UPDATE subscribers
     SET status = $1, updated_at = NOW()
     WHERE email = $2
     RETURNING first_name, email, status`,
    [status, email]
  );
  return res.rows[0];
};

module.exports = {
  insertSubscriber,
  getSubscriberByEmail,
  getAllSubscribers,
  updateSubscriberStatus
};
