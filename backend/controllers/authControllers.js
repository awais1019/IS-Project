import bcrypt from 'bcrypt';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { sendOTP,generateOTP } from '../utils/sendOTP.js';
import { spawn } from 'child_process';
import AnalysisResult from '../models/AnalysisResult.js';


export const signup = async (req, res) => {
  const { name, email, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ msg: 'User already exists' });

  const hashed = await bcrypt.hash(password, 10);
  const newUser = new User({
    name,
    email,
    password: hashed,
    role: 'user', 
  });

  await newUser.save();
  res.status(201).json({ msg: 'User registered. Please verify OTP.' });
};

export const login= async(req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name:user.name,
        role: user.role,
        verify: user.verify,
        is2FAEnabled:user.is2FAEnabled
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const otp = generateOTP(); // utility function to generate 6-digit OTP
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ email, verify: false });
    }

    user.otp = otp;
    user.otpExpires = otpExpiry;
    await user.save();

    await sendOTP(email, otp); // utility function to send email

    res.json({ message: 'OTP sent to your email' });
  } catch (error) {
    console.error('Error in sendOtp:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ error: 'Email and OTP are required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.verify) return res.json({ message: 'User already verified' });

    if (user.otp !== otp) return res.status(400).json({ error: 'Invalid OTP' });
    if (user.otpExpires < new Date()) return res.status(400).json({ error: 'OTP expired' });

    user.verify = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Error in verifyOtp:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};



// export const analyzeText = (req, res) => {
//   let text = req.body.text;
//   if (!text) return res.status(400).json({ error: 'Text is required' });

//   const maxWords = 512;
//   text = text.split(' ').slice(0, maxWords).join(' ');

//   const python = spawn('python', ['sentiment.py', text]);

//   let result = '';
//   let errorOutput = '';

//   python.stdout.on('data', (data) => {
//     result += data.toString();
//   });

//   python.stderr.on('data', (data) => {
//     errorOutput += data.toString();
//   });

//   python.on('close', (code) => {
//     if (code !== 0) {
//       console.error('Python error:', errorOutput);
//       return res.status(500).json({ error: 'Sentiment analysis failed.' });
//     }

//     try {
//       const parsedResult = JSON.parse(result.trim());
//       res.json({
//         user: req.user, 
//         result: parsedResult,
//       });
//     } catch (e) {
//       console.error('Parsing error:', e);
//       res.status(500).json({ error: 'Invalid sentiment result format.' });
//     }
//   });
// };

export const toggle2FA = async (req, res) => {
  try {
    const userId = req.user.id; // From JWT middleware
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ error: 'User not found' });

    user.is2FAEnabled = !user.is2FAEnabled;
    await user.save();

    // Generate a new token with updated is2FAEnabled field
    const updatedToken = jwt.sign(
      { id: user._id, role: user.role, is2FAEnabled: user.is2FAEnabled },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      message: `2FA ${user.is2FAEnabled ? 'enabled' : 'disabled'}`,
      is2FAEnabled: user.is2FAEnabled,
      token: updatedToken // new token with updated 2FA state
    });
  } catch (error) {
    console.error('Error toggling 2FA:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};



export const analyzeText = async (req, res) => {
  let text = req.body.text;
  const user = req.user;

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

  python.on('close', async (code) => {
    if (code !== 0) {
      console.error('Python error:', errorOutput);
      return res.status(500).json({ error: 'Sentiment analysis failed.' });
    }

    try {
      const parsedResult = JSON.parse(result.trim());

     
      if (user?.role === 'user') {
        await AnalysisResult.create({
          userId: user.id,
          text,
          label: parsedResult.label,
          score: parsedResult.score,
        });
      }

      res.json({
        user,
        result: parsedResult,
      });
    } catch (e) {
      console.error('Parsing error:', e);
      res.status(500).json({ error: 'Invalid sentiment result format.' });
    }
  });
};




export const getUserHistory = async (req, res) => {
  const { id } = req.params;
  try {
    const history = await AnalysisResult.find({ userId: id }).sort({ createdAt: -1 });
    res.json(history);
  } catch (err) {
    console.error('Error fetching user history:', err);
    res.status(500).json({ error: 'Failed to get history' });
  }
};


export const getAllHistories = async (req, res) => {
  try {
    const allHistories = await AnalysisResult.find()
      .populate('userId', 'name email role') 
      .sort({ createdAt: -1 });

    res.json(allHistories);
  } catch (err) {
    console.error('Error fetching all histories:', err);
    res.status(500).json({ error: 'Failed to get histories' });
  }
};
