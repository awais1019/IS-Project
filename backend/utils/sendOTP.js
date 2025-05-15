import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

export async function sendOTP(to, otp) {
  const mailOptions = {
    from: process.env.FROM_EMAIL,
    to,
    subject: 'Your OTP Code',
    html: `<h1>Your OTP is: ${otp}</h1><p>It will expire in 10 minutes.</p>`,
  };

  await transporter.sendMail(mailOptions);
}
