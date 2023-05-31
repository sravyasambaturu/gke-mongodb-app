const express = require('express');
const mongoose = require('mongoose');
const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');

// Load environment variables from a .env file
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// MongoDB connection URI
const mongoUri = process.env.MONGO_URI;

// Connect to MongoDB
mongoose
  .connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
  });

// Define a sample schema and model
const SampleSchema = new mongoose.Schema({
  name: String,
  value: Number,
});

const SampleModel = mongoose.model('Sample', SampleSchema);

// Retrieve data from MongoDB
app.get('/', async (req, res) => {
  try {
    const data = await SampleModel.find();
    res.json(data);
  } catch (err) {
    console.error('Error retrieving data from MongoDB', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

