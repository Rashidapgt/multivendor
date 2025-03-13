const nodemailer = require("nodemailer");

// Nodemailer Transporter Setup
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "your-email@gmail.com",
        pass: "your-email-password",
    },
});

// Reusable function to send emails
const sendEmailNotification = async (email, subject, message) => {
    const mailOptions = {
        from: "your-email@gmail.com",
        to: email,
        subject: subject,
        text: message,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent to ${email}`);
    } catch (error) {
        console.error("❌ Error sending email:", error);
    }
};

module.exports = { sendEmailNotification };
