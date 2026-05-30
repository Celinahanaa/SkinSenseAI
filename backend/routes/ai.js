const express = require('express');
const router = express.Router();
const multer = require('multer');
const FormData = require('form-data');
const fetch = require('node-fetch');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/analyze', upload.single('file'), async (req, res) => {
  try {
    console.log('AI analyze called');
    console.log('req.file:', req.file);
    console.log('AI_SERVICE_URL:', process.env.AI_SERVICE_URL);
    
    const formData = new FormData();
    formData.append('file', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    const response = await fetch(`${process.env.AI_SERVICE_URL}/analyze`, {
      method: 'POST',
      body: formData,
      headers: formData.getHeaders(),
    });

    console.log('FastAPI response status:', response.status);
    const result = await response.json();
    res.json(result);
  } catch (err) {
    console.error('AI route error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
