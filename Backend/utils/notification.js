// utils/notification.js
const nodemailer = require("nodemailer");

let transporterPromise = nodemailer
  .createTestAccount()
  .then((testAccount) => {
    return nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  })
  .catch((err) => {
    console.error("Failed to create a testing account. " + err.message);
  });

const sendEmail = async (to, subject, text) => {
  try {
    const transporter = await transporterPromise;
    const info = await transporter.sendMail({
      from: '"Mental Health App (Prototype)" <no-reply@prototype.app>',
      to,
      subject,
      text,
    });

    // Log the preview URL so you can view the message in your browser
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error("Error sending prototype email:", error);
  }
};

module.exports = { sendEmail };
