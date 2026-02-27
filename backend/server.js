const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));

app.get('/', (req, res) => {
  res.send('Course Management API is running');
});

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });