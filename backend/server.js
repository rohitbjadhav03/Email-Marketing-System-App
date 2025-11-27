require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const templateRoutes = require('./routes/templates');
const emailRoutes = require('./routes/emails');
const userRoutes = require('./routes/users');

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",                           // local dev
      "https://email-marketing-system-app.vercel.app",   // deployed frontend
    ],
    credentials: true,
  })
);

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/emails', emailRoutes);
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error('MongoDB connection error:', err));
