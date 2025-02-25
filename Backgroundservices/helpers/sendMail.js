const sgMail = require('@sendgrid/mail');
const dotenv = require("dotenv");

dotenv.config();

// Set your SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendMail = async (messageOption) => {
    try {
        const msg = {
            to: messageOption.to, // Recipient email from the messageOption
            from: process.env.EMAIL, // Your verified SendGrid sender email
            subject: messageOption.subject,
            text: messageOption.text,
        };

        const info = await sgMail.send(msg);
        console.log("Email sent successfully:", info[0].statusCode);
        return info;
    } catch (error) {
        console.error("Error sending email:", error);
        if (error.response) {
            console.error(error.response.body);
        }
        throw error;
    }
};

module.exports = sendMail;