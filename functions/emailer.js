const nodemailer = require('nodemailer');


const sendSingleMail = async (to, subject) => {
    try {
        // Get email details from the request body
        // const { to, subject, text } = req.body;

        // Create a Nodemailer transporter
        const text = `
        Dear [Seller Name], \n \n
        We are delighted to inform you that your seller account with Tradehind has been successfully activated! \n
        You can now start adding and managing your products, reaching a wider audience, and boosting your sales on our platform. \n
        If you have any questions or need assistance, feel free to contact our support team at support@tradehind.com. \n
        Thank you for choosing TradeHind. We wish you great success as a seller! \n\n
        Best regards, \n\n
        TradeHind Team \n\n `;
        
        const transporter = nodemailer.createTransport({
            service: process.env.email_service,
            auth: {
                user: process.env.email_user,
                pass: process.env.email_pass
            }
        });

        console.log(process.env.email_service, 'process.env.email_service');

        // Setup email data
        const mailOptions = {
            from: process.env.gmail,
            to,
            subject,
            text
        };

        // Send the email
        const info = await transporter.sendMail(mailOptions);

        console.log('Email sent:', info.messageId);

       
    } catch (error) {
        console.error('Error sending email:', error);
       
    }
}

module.exports = {
    sendSingleMail
  };