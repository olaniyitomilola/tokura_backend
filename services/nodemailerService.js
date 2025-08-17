const nodemailer = require("nodemailer");

// Create reusable transporter outside function

const sendMail = async (to, subject, html, text, sendName, user) => {

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: process.env.SMTP_SECURE === "true",
        auth: {
            user: user? user : process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    try {
        const info = await transporter.sendMail({
            from: `"${sendName}" <${user? user: process.env.SMTP_USER}>`,
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
