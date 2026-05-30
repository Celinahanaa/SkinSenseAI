const express = require('express');
const router = express.Router();

router.post('/analyze', async (req, res) => {
  try {
    const response = await fetch(`${process.env.AI_SERVICE_URL}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    const result = await response.json();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;