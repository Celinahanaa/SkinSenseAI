const pool = require('../config/db');

const getHistory = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, image_url, result, created_at FROM scan_history WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getHistoryDetail = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM scan_history WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ message: 'Data tidak ditemukan' });

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const deleteHistory = async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM scan_history WHERE id = $1 AND user_id = $2 RETURNING *',
      [req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'Data tidak ditemukan'
      });
    }

    res.json({
      message: 'History berhasil dihapus'
    });

  } catch (err) {
    res.status(500).json({
      message: 'Server error',
      error: err.message
    });
  }
};

module.exports = { getHistory, getHistoryDetail, deleteHistory };
