const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
require('dotenv').config();

const scamRoutes = require('./routes/scamRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

//Connect to MongoDB
connectDB();

//Allowed Origins for CORS
const allowedOrigins = [
  'http://localhost:5173',
  'https://cyber-aware-bharat.vercel.app'
];

// CORS Middleware
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS Not Allowed for this Origin: ' + origin));
    }
  },
  credentials: true
}));

//Security & Middleware
app.use(helmet());
app.use(express.json());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit to 100 requests per window
}));

//API Routes
app.use('/api/scams', scamRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

//Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server error' });
});

//Server Listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
