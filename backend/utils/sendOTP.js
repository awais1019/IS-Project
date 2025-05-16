import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false, // optional: bypass strict TLS (for dev environments)
  },
});

export async function sendOTP(to, otp) {
  const mailOptions = {
    from: process.env.FROM_EMAIL,
    to,
    subject: 'Your OTP Code',
    html: `<h1>Your OTP is: ${otp}</h1><p>It will expire in 10 minutes.</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw error; 
  }
}
export const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();