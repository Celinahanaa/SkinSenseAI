const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { register, login } = require('../controllers/authController');
const { getProfile, updateProfile } = require('../controllers/profileController');
const { getHistory, getHistoryDetail } = require('../controllers/historyController');
const pool = require('../config/db');
const jwt = require('jsonwebtoken');
const { getProfile, updateProfile, upload } = require('../controllers/profileController');


router.post('/auth/register', register);
router.post('/auth/login', login);
router.put('/profile', auth, upload.single('avatar'), updateProfile);

router.post('/auth/google', async (req, res) => {
  const { email, name, avatar_url } = req.body;
  try {
    let result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    let user;
    if (result.rows.length === 0) {
      const newUser = await pool.query(
        'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
        [name, email, 'google-oauth']
      );
      user = newUser.rows[0];
      await pool.query('INSERT INTO skin_profiles (user_id) VALUES ($1)', [user.id]);
    } else {
      user = result.rows[0];
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    const { password: _, ...userSafe } = user;
    res.json({ token, user: userSafe });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);

router.get('/history', auth, getHistory);
router.get('/history/:id', auth, getHistoryDetail);

router.post('/analyze', auth, (req, res) => {
  res.json({ message: 'Endpoint AI belum tersedia, menunggu tim data science' });
});

module.exports = router;