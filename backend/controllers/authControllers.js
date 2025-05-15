import bcrypt from 'bcrypt';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';


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
    verified: false
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
        verified: user.verified
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
export const sendOTPToEmail = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(404).json({ message: 'User not found' });

  const otp = crypto.randomInt(100000, 999999).toString();
  user.otp = otp;
  user.otpExpiry = Date.now() + 10 * 60 * 1000; // valid for 10 mins
  await user.save();

  await sendOTP(email, otp);
  res.json({ message: 'OTP sent to email' });
};

// Verify OTP
export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email });

  if (!user || user.otp !== otp || user.otpExpiry < Date.now()) {
    return res.status(400).json({ message: 'Invalid or expired OTP' });
  }

  user.verified = true;
  user.otp = null;
  user.otpExpiry = null;
  await user.save();

  res.json({ message: 'Account verified successfully' });
};