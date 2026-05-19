import nodemailer from 'nodemailer';

let transporter = null;

const getTransporter = () => {
  if (transporter) return transporter;

  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
    return null;
  }

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  return transporter;
};

export const sendComplaintNotification = async ({ to, subject, html }) => {
  const transport = getTransporter();
  if (!transport) {
    console.log('Email not configured. Skipping notification to:', to);
    return false;
  }

  try {
    await transport.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to,
      subject,
      html,
    });
    return true;
  } catch (err) {
    console.error('Email send failed:', err.message);
    return false;
  }
};

export const buildStatusUpdateEmail = (complaint) => {
  return [
    '<div style="font-family: sans-serif; max-width: 600px;">',
    '<h2 style="color: #4f46e5;">Complaint Status Update</h2>',
    `<p>Hello ${complaint.name},</p>`,
    `<p>Your complaint <strong>"${complaint.title}"</strong> status has been updated to:</p>`,
    `<p style="font-size: 18px; font-weight: bold; color: #4f46e5;">${complaint.status}</p>`,
    `<p><strong>Category:</strong> ${complaint.category}</p>`,
    `<p><strong>Location:</strong> ${complaint.location}</p>`,
    '<p>Thank you for using Smart Complaint Management System.</p>',
    '</div>',
  ].join('');
};

export default { sendComplaintNotification, buildStatusUpdateEmail };
