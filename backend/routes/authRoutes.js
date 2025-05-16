
import express from 'express';
import  {signup,login,verifyOtp,sendOtp,analyzeText,toggle2FA}  from '../controllers/authControllers.js';
import { authenticateJWT } from '../middleware/auth.js';




const router = express.Router();


router.post('/signup', signup);
router.post('/login', login);
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/analyze',authenticateJWT, analyzeText);
router.post('/user/toggle2fa', authenticateJWT, toggle2FA);


export default router;
