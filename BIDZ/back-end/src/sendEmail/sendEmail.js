import nodemailer from "nodemailer";
import dns from "dns";
import "dotenv/config";

dns.setDefaultResultOrder("ipv4first");

const emailUser = process.env.EMAIL;
const emailPass = process.env.PASSWORD;
let transporter = null;

if (emailUser && emailPass) {
  transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });

  transporter.verify((error) => {
    if (error) {
      console.log("SMTP Error:", error.message);
    } else {
      console.log("Server is ready to send emails");
    }
  });
} else {
  console.warn("SMTP credentials missing; email delivery is disabled for this session.");
}

const sendEmail = async (to, subject, text) => {
  if (!transporter) {
    console.warn("Email not sent because SMTP credentials are not configured.");
    return { skipped: true };
  }

  try {
    const mail = await transporter.sendMail({
      from: emailUser,
      to,
      subject,
      text,
    });

    console.log("message sent:", mail.messageId);
    return mail;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

export default sendEmail;