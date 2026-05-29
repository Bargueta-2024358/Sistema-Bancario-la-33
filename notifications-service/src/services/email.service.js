const nodemailer = require('nodemailer');

let transporter = null;

const getTransporter = () => {
  if (transporter) return transporter;

  const enabled = process.env.SMTP_ENABLED === 'true';
  if (!enabled || !process.env.SMTP_USER) {
    return null;
  }

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT || 465),
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  return transporter;
};

const sendEmail = async ({ to, subject, text, html }) => {
  if (!to) {
    return { sent: false, simulated: true, reason: 'NO_EMAIL' };
  }

  const mailer = getTransporter();
  const from = process.env.SMTP_FROM || 'Banco La 33 <noreply@banco33.local>';

  if (!mailer) {
    console.log(`[EMAIL SIMULADO] Para: ${to} | Asunto: ${subject}`);
    console.log(`[EMAIL SIMULADO] ${text}`);
    return { sent: true, simulated: true };
  }

  try {
    await mailer.sendMail({ from, to, subject, text, html: html || `<p>${text}</p>` });
    return { sent: true, simulated: false };
  } catch (error) {
    console.error('[EMAIL] Error SMTP:', error.message);
    return { sent: false, simulated: false, error: error.message };
  }
};

module.exports = { sendEmail };
