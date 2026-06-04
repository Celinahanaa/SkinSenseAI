const pool = require('../config/db');

const DAILY_LIMIT = 5;

const checkQuota = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT COUNT(*) AS count
       FROM scan_history
       WHERE user_id = $1
         AND created_at >= NOW() - INTERVAL '1 day'`,
      [userId]
    );

    const used = parseInt(result.rows[0].count, 10);
    const remaining = DAILY_LIMIT - used;

    if (remaining <= 0) {
      return res.status(429).json({
        message: 'Batas analisis harian tercapai. Coba lagi besok.',
        quota: { limit: DAILY_LIMIT, used, remaining: 0 },
      });
    }

    req.quota = { limit: DAILY_LIMIT, used, remaining };
    next();
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getQuota = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT COUNT(*) AS count
       FROM scan_history
       WHERE user_id = $1
         AND created_at >= NOW() - INTERVAL '1 day'`,
      [userId]
    );

    const used = parseInt(result.rows[0].count, 10);
    res.json({ limit: DAILY_LIMIT, used, remaining: DAILY_LIMIT - used });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { checkQuota, getQuota };
