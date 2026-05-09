const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { register, login } = require('../controllers/authController');
const { getProfile, updateProfile } = require('../controllers/profileController');
const { getHistory, getHistoryDetail } = require('../controllers/historyController');

router.post('/auth/register', register);
router.post('/auth/login', login);

router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);

router.get('/history', auth, getHistory);
router.get('/history/:id', auth, getHistoryDetail);

router.post('/analyze', auth, (req, res) => {
  res.json({ message: 'Endpoint AI belum tersedia, menunggu tim data science' });
});

module.exports = router;
