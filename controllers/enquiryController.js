const e = require("cors");
const { logger } = require("../services/logger");
const { sendOlanMail } = require("../services/nodemailerService");
const enquiryTemplate = require("../templates/olanEnquiry");

// POST /enquiry
const sendEnquiry = async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Name, email, and message are required" });
  }
  try {
     await sendOlanMail(`New Enquiry from ${name}`, enquiryTemplate({name, email, message}), '',email);
    return res.json({
      success: true,
      message: "Enquiry sent successfully"
    });

  } catch (err) {
    console.error("❌ Error sending enquiry email:", err);
    logger.error(err, "Error sending enquiry email:");
    return res.status(500).json({ error: "Server error while sending enquiry" });
  }
};

module.exports = { sendEnquiry };
