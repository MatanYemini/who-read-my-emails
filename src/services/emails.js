// services/emailService.js
const nodemailer = require("nodemailer");
const crypto = require("crypto");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  port: process.env.SMTP_PORT,
  secure: false,
});

function generateTrackingId() {
  return crypto.randomBytes(16).toString("hex");
}

async function sendEmail(fastify, recipients, subject, body) {
  const email = {
    subject,
    body,
    sent: new Date(),
    recipients: recipients.map((recipient) => ({
      email: recipient,
      trackingId: generateTrackingId(),
      opens: [],
    })),
  };

  const { insertedId } = await fastify.mongo.db
    .collection("emails")
    .insertOne(email);

  for (const recipient of email.recipients) {
    const trackingPixel = `<img src="http://127.0.0.1/api/tracking/pixel/${recipient.trackingId}" width="1" height="1" />`;
    await transporter.sendMail({
      from: "postmaster@sandbox7180c14c620f40c1b684a3bcc7f1005f.mailgun.org",
      to: recipient.email,
      subject,
      html: body + trackingPixel,
    });
  }

  return insertedId;
}

module.exports = { sendEmail };
