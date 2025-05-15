import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js'; 
import { spawn } from 'child_process';
import authRoutes from './routes/authRoutes.js';
import cors from 'cors';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());


app.use('/api/auth', authRoutes);


app.post("/analyze", (req, res) => {
  let text = req.body.text;
  const maxWords = 512;
  text = text.split(" ").slice(0, maxWords).join(" ");

  const python = spawn("python", ["sentiment.py", text]);

  let result = "";
  let errorOutput = "";

  python.stdout.on("data", (data) => {
    result += data.toString();
  });

  python.stderr.on("data", (data) => {
    errorOutput += data.toString();
  });

  python.on("close", (code) => {
    if (code !== 0) {
      console.error("Python error:", errorOutput);
      return res.status(500).json({ error: "Sentiment analysis failed." });
    }

    try {
      const parsedResult = JSON.parse(result.trim());
      res.json({ result: parsedResult }); 
    } catch (e) {
      console.error("Parsing error:", e);
      res.status(500).json({ error: "Invalid sentiment result format." });
    }
  });
});
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

app.post('/send-otp', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ email, verify: false });
    }

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    await sendOTP(email, otp);

    res.json({ message: 'OTP sent to your email' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ error: 'Email and OTP are required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.verify) return res.json({ message: 'User already verified' });

    if (user.otp !== otp) return res.status(400).json({ error: 'Invalid OTP' });
    if (user.otpExpiry < new Date()) return res.status(400).json({ error: 'OTP expired' });

    user.verify = true;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
