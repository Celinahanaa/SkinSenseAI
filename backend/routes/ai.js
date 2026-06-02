const express = require('express');
const router = express.Router();
const multer = require('multer');
const FormData = require('form-data');
const fetch = require('node-fetch');
const upload = multer({ storage: multer.memoryStorage() });

const getSafeRequestHeaders = (headers = {}) => ({
  host: headers.host,
  origin: headers.origin,
  referer: headers.referer,
  'user-agent': headers['user-agent'],
  'content-type': headers['content-type'],
  accept: headers.accept,
});

router.post('/analyze', upload.single('file'), async (req, res) => {
  const requestId = `AI_ROUTE_${Date.now()}`;
  const aiServiceUrl = process.env.AI_SERVICE_URL ? process.env.AI_SERVICE_URL.replace(/\/$/, '') : '';
  const requestHeaders = getSafeRequestHeaders(req.headers);
  const fileInfo = req.file
    ? {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      fieldname: req.file.fieldname,
      encoding: req.file.encoding,
    }
    : null;

  console.log(`[${requestId}] Incoming /api/ai/analyze request`);
  console.log(`[${requestId}] AI_SERVICE_URL=${aiServiceUrl}`);
  console.log(`[${requestId}] request headers:`, requestHeaders);
  console.log(`[${requestId}] req.file present=${Boolean(req.file)}`);
  if (req.file) console.log(`[${requestId}] req.file info:`, fileInfo);

  if (!aiServiceUrl) {
    const message = 'Missing AI_SERVICE_URL environment variable. Set AI_SERVICE_URL to the FastAPI base URL.';
    console.error(`[${requestId}] ${message}`);
    return res.status(500).json({
      error: 'Configuration error',
      detail: message,
      ai_service_url: aiServiceUrl,
      request_headers: requestHeaders,
      timestamp: new Date().toISOString(),
      route: '/api/ai/analyze',
    });
  }

  if (!req.file) {
    const message = 'No file uploaded. Pastikan field multipart/form-data bernama "file" dikirim.';
    console.error(`[${requestId}] ${message}`);
    return res.status(400).json({
      error: 'Bad request',
      detail: message,
      ai_service_url: aiServiceUrl,
      request_headers: requestHeaders,
      timestamp: new Date().toISOString(),
      route: '/api/ai/analyze',
    });
  }

  try {
    const formData = new FormData();
    formData.append('file', req.file.buffer, {
      filename: req.file.originalname || 'upload.jpg',
      contentType: req.file.mimetype || 'application/octet-stream',
    });

    const targetUrl = `${aiServiceUrl}/analyze`;
    console.log(`[${requestId}] Forwarding request to FastAPI: ${targetUrl}`);

    const response = await fetch(targetUrl, {
      method: 'POST',
      body: formData,
      headers: formData.getHeaders(),
    });

    console.log(`[${requestId}] FastAPI response status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      const text = await response.text();
      const snippet = text.length > 1000 ? `${text.slice(0, 1000)}...[truncated]` : text;
      console.error(`[${requestId}] FastAPI error ${response.status}:`, snippet);
      return res.status(response.status).json({
        error: 'AI service request failed',
        detail: `FastAPI returned status ${response.status}`,
        fastapi_status: response.status,
        fastapi_statusText: response.statusText,
        fastapi_body: snippet,
        ai_service_url: aiServiceUrl,
        request_headers: requestHeaders,
        file_info: fileInfo,
        timestamp: new Date().toISOString(),
        route: '/api/ai/analyze',
      });
    }

    const result = await response.json();
    console.log(`[${requestId}] FastAPI returned JSON successfully`);
    return res.json(result);
  } catch (err) {
    console.error(`[${requestId}] Exception forwarding to FastAPI:`, err);
    return res.status(500).json({
      error: 'AI route error',
      detail: err.message,
      name: err.name,
      stack: err.stack,
      ai_service_url: aiServiceUrl,
      request_headers: requestHeaders,
      file_info: fileInfo,
      timestamp: new Date().toISOString(),
      route: '/api/ai/analyze',
    });
  }
});

module.exports = router;
