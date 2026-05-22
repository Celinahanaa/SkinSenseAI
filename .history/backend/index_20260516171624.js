const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();

// Buat folder uploads kalau belum ada
if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api', require('./routes/index'));

app.get('/', (req, res) => res.json({ message: 'SkinSense AI Backend running' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));