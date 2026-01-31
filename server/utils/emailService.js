const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text) => {
    // For development, we'll just log it if no real SMTP is provided
    if (!process.env.SMTP_HOST) {
        console.log(`[Mock Email] To: ${to}, Subject: ${subject}, Body: ${text}`);
        return;
    }

    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        await transporter.sendMail({
            from: '"Placement Portal" <no-reply@placement.com>',
            to,
            subject,
            text,
        });
        console.log(`Email sent to ${to}`);
    } catch (error) {
        console.error('Email sending failed:', error);
    }
};

module.exports = sendEmail;
