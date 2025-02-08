const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// MongoDB connection without .env
mongoose.connect('mongodb+srv://nishant:sirohi123123@listofprofesionals.yabtc.mongodb.net/?retryWrites=true&w=majority&appName=listofprofesionals', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
  keepAlive: true,
  keepAliveInitialDelay: 300000, // 5 minutes
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Connection error:', error));


const professionalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  category: { type: String, required: true },
  agency: { type: Boolean, required: true },
  address: { type: String, required: true },
});

const Professional = mongoose.model('Professional', professionalSchema);

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// Routes
app.post('/submit', async (req, res) => {
  const { name, phone, email, category, agency, address } = req.body;

  // Validation for required fields
  if (!name || !phone || !email || !category || !address || agency === undefined) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const professional = new Professional(req.body);
    await professional.save();
    res.status(200).json({ message: 'Data saved successfully' });
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).json({ error: 'Error saving data' });
  }
});

app.get('/success.html', (req, res) => {
  res.sendFile(__dirname + '/frontend/success.html');
});

app.get('/failure.html', (req, res) => {
  res.sendFile(__dirname + '/frontend/failure.html');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
