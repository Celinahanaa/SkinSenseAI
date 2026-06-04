const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { register, login } = require('../controllers/authController');
const { getProfile, updateProfile, upload } = require('../controllers/profileController');
const { getHistory, getHistoryDetail, deleteHistory } = require('../controllers/historyController');
const { checkQuota, getQuota } = require('../middleware/quota');
const pool = require('../config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const aiRouter = require('./ai');

router.post('/auth/register', register);
router.post('/auth/login', login);
router.use('/ai', aiRouter);

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
router.put('/profile', auth, upload.single('avatar'), updateProfile);

router.get('/quota', auth, getQuota);

router.get('/history', auth, getHistory);
router.get('/history/:id', auth, getHistoryDetail);
router.delete('/history/:id', auth, deleteHistory);

router.post('/history', auth, checkQuota, async (req, res) => {
  try {
    const { skin_type, confidence, probabilities, recommendations, image_url } = req.body;
    
    const result = {
      skin_type,
      confidence,
      probabilities,
      recommendations,
    };

    await pool.query(
      'INSERT INTO scan_history (user_id, result, image_url) VALUES ($1, $2, $3)',
      [req.user.id, JSON.stringify(result), image_url || null]
    );
    res.json({ message: 'History tersimpan' });
  } catch (err) {
    res.status(500).json({ message: 'Gagal simpan history', error: err.message });
  }
});

router.post('/auth/reset-password', async (req, res) => {
  const { email, newPassword } = req.body;
  try {
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (user.rows.length === 0)
      return res.status(404).json({ message: 'Email tidak ditemukan' });

    const hashed = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE users SET password = $1 WHERE email = $2', [hashed, email]);

    res.json({ message: 'Password berhasil diubah' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.post('/auth/check-email', async (req, res) => {
  const { email } = req.body;
  const user = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
  if (user.rows.length === 0)
    return res.status(404).json({ message: 'Email tidak ditemukan' });
  res.json({ message: 'OK' });
});

module.exports = router;
