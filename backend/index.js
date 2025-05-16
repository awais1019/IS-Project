import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js'; 
import { spawn } from 'child_process';
import authRoutes from './routes/authRoutes.js';
import cors from 'cors';
import User from './models/User.js';
import { sendOTP } from './utils/sendOTP.js';
import { authenticateJWT } from './middleware/auth.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use('/api/auth', authRoutes);

app.post('/analyze', authenticateJWT, (req, res) => {


  let text = req.body.text;
  if (!text) return res.status(400).json({ error: 'Text is required' });

  const maxWords = 512;
  text = text.split(' ').slice(0, maxWords).join(' ');

  const python = spawn('python', ['sentiment.py', text]);

  let result = '';
  let errorOutput = '';

  python.stdout.on('data', (data) => {
    result += data.toString();
  });

  python.stderr.on('data', (data) => {
    errorOutput += data.toString();
  });

  python.on('close', (code) => {
    if (code !== 0) {
      console.error('Python error:', errorOutput);
      return res.status(500).json({ error: 'Sentiment analysis failed.' });
    }

    try {
      const parsedResult = JSON.parse(result.trim());
      res.json({
        user: req.user,  // Optionally send back user info or use it for logging etc.
        result: parsedResult,
      });
    } catch (e) {
      console.error('Parsing error:', e);
      res.status(500).json({ error: 'Invalid sentiment result format.' });
    }
  });
});




const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
