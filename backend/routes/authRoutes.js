
import express from 'express';
import  {signup,login,sendOTPToEmail,verifyOTP}  from '../controllers/authControllers.js';
import {protect} from "../middleware/auth.js"


const router = express.Router();


router.post('/signup', signup);
router.post('/login', login);
router.post('/send-otp', sendOTPToEmail);
router.post('/verify-otp', verifyOTP);
export default router;
