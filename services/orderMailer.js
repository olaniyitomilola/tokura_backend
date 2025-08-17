// services/orderMailer.js
const { sendMail } = require('./nodemailerService');
const orderShippedEmailTemplate = require('../templates/orderShippedEmail');
const orderDeliveredEmailTemplate = require('../templates/orderDeliveredEmail');

/**
 * Send order status email to customer
 * @param {Object} params
 * @param {string} params.firstName - Customer's first name
 * @param {string} params.email - Customer's email
 * @param {string} params.orderId - Order ID
 * @param {string} params.status - Order status ('shipped' | 'delivered')
 * @param {string} [params.trackingNumber] - Optional tracking number
 * @param {string} [params.trackingUrl] - Optional tracking URL
 */
const sendOrderStatusEmail = async ({
  firstName,
  email,
  orderId,
  status,
  trackingNumber,
  trackingUrl
}) => {
  let subject = '';
  let html = '';

  if (status === 'shipped') {
    subject = `Your order #${orderId} has been shipped!`;
    html = orderShippedEmailTemplate({
      firstName,
      orderId,
      trackingNumber,
      trackingUrl
    });
  } else if (status === 'delivered') {
    subject = `Your order #${orderId} has been delivered!`;
    html = orderDeliveredEmailTemplate({
      firstName,
      orderId
    });
  } else {
    console.warn(`Unsupported order status: ${status}`);
    return;
  }

  try {
    await sendMail(
      email,
      subject,
      html,
      '', // optional plain text
      `Tokura Luxury Order!` // sender name
    );
    console.log(`✅ ${status} email sent to ${email}`);
  } catch (err) {
    console.error(`❌ Failed to send ${status} email to ${email}:`, err);
  }
};

module.exports = { sendOrderStatusEmail };
