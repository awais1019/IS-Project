import { verify } from 'crypto';
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' }, 
  verify: { type: Boolean, default: false },
  is2FAEnabled: { type: Boolean, default: false },
  otp: { type: String }, // hashed OTP
  otpExpires: { type: Date }
});

export default mongoose.model('User', userSchema);
