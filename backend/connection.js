require('dotenv').config();
const mongoose = require('mongoose');

const connectionString = process.env.URL;

mongoose.connect(connectionString)
  .then(() => console.log('MongoDB connection successful'))
  .catch((err) => console.error('MongoDB connection error:', err));
