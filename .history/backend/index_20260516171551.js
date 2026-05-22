const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', require('./routes/index'));

app.get('/', (req, res) => res.json({ message: 'SkinSense AI Backend running' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const path = require('path');
const fs = require('fs');

if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
