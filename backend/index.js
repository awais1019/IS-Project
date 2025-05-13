import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js'; 

dotenv.config();
const app = express();

// Middleware to parse JSON
app.use(express.json());

// // Routes
// import authRoutes from './routes/authRoutes.js';
// app.use('/api/auth', authRoutes);


connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
