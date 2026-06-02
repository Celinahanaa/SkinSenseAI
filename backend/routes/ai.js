const express = require('express');
const router = express.Router();
const multer = require('multer');
const FormData = require('form-data');
const fetch = require('node-fetch');
const upload = multer({ storage: multer.memoryStorage() });

router.post('/analyze', upload.single('file'), async (req, res) => {
  const requestId = Date.now();
  console.log(`[AI_ROUTE ${requestId}] Incoming /api/ai/analyze request`);
  console.log(`[AI_ROUTE ${requestId}] AI_SERVICE_URL=${process.env.AI_SERVICE_URL}`);
  console.log(`[AI_ROUTE ${requestId}] req.file present=${Boolean(req.file)}`);

  if (!process.env.AI_SERVICE_URL) {
    const message = 'Missing AI_SERVICE_URL environment variable. Set AI_SERVICE_URL to the FastAPI base URL.';
    console.error(`[AI_ROUTE ${requestId}] ${message}`);
    return res.status(500).json({
      error: 'Configuration error',
      detail: message,
      timestamp: new Date().toISOString(),
      route: '/api/ai/analyze'
    });
  }

  if (!req.file) {
    const message = 'No file uploaded. Pastikan field multipart/form-data bernama "file" dikirim.';
    console.error(`[AI_ROUTE ${requestId}] ${message}`);
    return res.status(400).json({
      error: 'Bad request',
      detail: message,
      timestamp: new Date().toISOString(),
      route: '/api/ai/analyze'
    });
  }

  try {
    const formData = new FormData();
    formData.append('file', req.file.buffer, {
      filename: req.file.originalname || 'upload.jpg',
      contentType: req.file.mimetype || 'application/octet-stream',
    });

    const targetUrl = `${process.env.AI_SERVICE_URL.replace(/\/$/, '')}/analyze`;
    console.log(`[AI_ROUTE ${requestId}] Forwarding request to FastAPI: ${targetUrl}`);

    const response = await fetch(targetUrl, {
      method: 'POST',
      body: formData,
      headers: formData.getHeaders(),
    });

    console.log(`[AI_ROUTE ${requestId}] FastAPI response status: ${response.status}`);

    if (!response.ok) {
      const text = await response.text();
      const snippet = text.length > 1000 ? text.slice(0, 1000) + '...[truncated]' : text;
      console.error(`[AI_ROUTE ${requestId}] FastAPI error ${response.status}: ${snippet}`);
      return res.status(response.status).json({
        error: 'AI service request failed',
        detail: `FastAPI returned status ${response.status}`,
        fastapi_status: response.status,
        fastapi_statusText: response.statusText,
        fastapi_body: snippet,
        ai_service_url: process.env.AI_SERVICE_URL,
        timestamp: new Date().toISOString(),
        route: '/api/ai/analyze'
      });
    }

    const result = await response.json();
    console.log(`[AI_ROUTE ${requestId}] FastAPI returned JSON result successfully`);
    return res.json(result);
  } catch (err) {
    console.error(`[AI_ROUTE ${requestId}] Exception forwarding to FastAPI:`, err);
    return res.status(500).json({
      error: 'AI route error',
      detail: err.message,
      stack: err.stack,
      ai_service_url: process.env.AI_SERVICE_URL,
      timestamp: new Date().toISOString(),
      route: '/api/ai/analyze'
    });
  }
});

module.exports = router;
