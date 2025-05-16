
import express from 'express';
import  {signup,login,verifyOtp,sendOtp,analyzeText}  from '../controllers/authControllers.js';




const router = express.Router();


router.post('/signup', signup);
router.post('/login', login);
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/analyze', analyzeText);


export default router;
