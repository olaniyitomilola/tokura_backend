const nodemailer = require("nodemailer");

// Create reusable transporter outside function
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendMail = async (to, subject, html, text) => {
  try {
    const info = await transporter.sendMail({
      from: `"Tokura Luxury Order!" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text: text || "",
      html: html || "",
    });

    console.log("✅ Email sent:", info);
  } catch (err) {
    console.error("❌ Error sending email:", err);
  }
};

module.exports = { sendMail };
