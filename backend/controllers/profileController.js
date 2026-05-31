const pool = require('../config/db');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'skinsense-avatars',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation: [{ width: 300, height: 300, crop: 'fill' }],
  },
});

const upload = multer({ storage });

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
    res.json({
      ...user.rows[0],
      skin_type: skinProfile.rows[0]?.skin_type || null,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const updateProfile = async (req, res) => {
  console.log('req.body:', req.body);
  console.log('req.file:', req.file);
  const { name, phone, birthdate, skin_type } = req.body;

  const avatar_url = req.file ? req.file.path : null;

  try {
    if (avatar_url) {
      await pool.query(
        'UPDATE users SET name=$1, phone=$2, birthdate=$3, avatar_url=$4 WHERE id=$5',
        [name, phone, birthdate || null, avatar_url, req.user.id]
      );
    } else {
      await pool.query(
        'UPDATE users SET name=$1, phone=$2, birthdate=$3 WHERE id=$4',
        [name, phone, birthdate || null, req.user.id]
      );
    }
    if (skin_type) {
      await pool.query(
        `INSERT INTO skin_profiles (user_id, skin_type) VALUES ($1, $2)
         ON CONFLICT (user_id) DO UPDATE SET skin_type=$2, updated_at=NOW()`,
        [req.user.id, skin_type]
      );
    }
    res.json({ message: 'Profil berhasil diperbarui' });
  } catch (err) {
    console.error('Update profile error:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { getProfile, updateProfile, upload };
