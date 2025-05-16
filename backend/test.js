import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

async function sendTestEmail() {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.FROM_EMAIL,
    to: process.env.FROM_EMAIL,
    subject: 'Test Email',
    text: 'Test email from Nodemailer with app password',
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
  } catch (error) {
    console.error('Failed to send email:', error);
  }
}

sendTestEmail();
