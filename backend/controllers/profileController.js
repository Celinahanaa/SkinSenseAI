const pool = require('../config/db');

const getProfile = async (req, res) => {
  try {
    const user = await pool.query(
      `SELECT id, name, email, phone, 
       TO_CHAR(birthdate, 'YYYY-MM-DD') as birthdate,
       avatar_url, created_at FROM users WHERE id = $1`,
      [req.user.id]
    );
    if (user.rows.length === 0)
      return res.status(404).json({ message: 'User tidak ditemukan' });

    const skinProfile = await pool.query(
      'SELECT skin_type FROM skin_profiles WHERE user_id = $1',
      [req.user.id]
    );
    const concerns = await pool.query(
      'SELECT concern FROM skin_concerns WHERE user_id = $1',
      [req.user.id]
    );

    res.json({
      ...user.rows[0],
      skin_type: skinProfile.rows[0]?.skin_type || null,
      skin_concerns: concerns.rows.map(r => r.concern),
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const updateProfile = async (req, res) => {
  const { name, phone, birthdate, skin_type, skin_concerns } = req.body;

  try {
    await pool.query(
      'UPDATE users SET name=$1, phone=$2, birthdate=$3 WHERE id=$4',
      [name, phone, birthdate || null, req.user.id]
    );

    if (skin_type) {
      await pool.query(
        `INSERT INTO skin_profiles (user_id, skin_type) VALUES ($1, $2)
         ON CONFLICT (user_id) DO UPDATE SET skin_type=$2, updated_at=NOW()`,
        [req.user.id, skin_type]
      );
    }

    if (Array.isArray(skin_concerns) && skin_concerns.length > 0) {
      await pool.query('DELETE FROM skin_concerns WHERE user_id = $1', [req.user.id]);
      for (const concern of skin_concerns) {
        await pool.query(
          'INSERT INTO skin_concerns (user_id, concern) VALUES ($1, $2)',
          [req.user.id, concern]
        );
      }
    }

    res.json({ message: 'Profil berhasil diperbarui' });

  } catch (err) {
    console.error('Update profile error:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { getProfile, updateProfile };