const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors({
  origin: ['https://skin-sense-ai-mu.vercel.app', 'http://localhost:5173'],
  credentials: true
}));

app.use(express.json());

const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/upload', require('./routes/upload'));

app.use('/api', require('./routes/index'));

app.get('/', (req, res) => res.json({ message: 'SkinSense AI Backend running' }));

app.use('/api/ai', require('./routes/ai'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
