const {
  insertSubscriber,
  getSubscriberByEmail,
  getAllSubscribers,
  updateSubscriberStatus
} = require('../models/subscribers');
const { sendMail } = require('../services/nodemailerService');
const {logger} = require('../services/logger');


const subscriberEmailTemplate = require('../templates/subscriberEmail');
const addSubscriber = async (req, res) => {
  let { firstName, email } = req.body;

  if (!firstName || !email) {
    return res.status(400).json({ error: 'First name and email are required' });
  }

  // normalize email
  email = email.trim().toLowerCase();

  try {
    const existing = await getSubscriberByEmail(email);
    if (existing) return res.status(409).json({ error: 'Subscriber already exists' });

    // Insert subscriber
    await insertSubscriber({ firstName, email });

    // Send welcome email
    const html = subscriberEmailTemplate({ firstName });
    await sendMail(
      email,
      `${firstName}, Welcome to Tokura Luxury Hair!`,
      html,
      '',
      `Oluwapelumi from Tokura`,
      process.env.SMTP_MARKETING
    );

    res.status(201).json({ firstName, email, status: true });
  } catch (err) {
    console.error('Error adding subscriber:', err);
    logger.error(err, 'Error adding subscriber:');
    res.status(500).json({ error: 'Server error' });
  }
};

const listSubscribers = async (req, res) => {
  try {
    const subscribers = await getAllSubscribers();
    res.json(subscribers);
  } catch (err) {
    console.error('Error fetching subscribers:', err);
    logger.error(err, 'Error fetching subscribers:');
    res.status(500).json({ error: 'Server error' });
  } 
};

const updateStatus = async (req, res) => {
  const { email, status } = req.body;

  if (!email || typeof status !== 'boolean') {
    return res.status(400).json({ error: 'Email and status (true/false) are required' });
  }

  try {
    const subscriber = await updateSubscriberStatus(email, status);
    if (!subscriber) return res.status(404).json({ error: 'Subscriber not found' });

    res.json(subscriber);
  } catch (err) {
    console.error('Error updating subscriber:', err);
    logger.error(err, 'Error updating subscriber:');
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  addSubscriber,
  listSubscribers,
  updateStatus
};
