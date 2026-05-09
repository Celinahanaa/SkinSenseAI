const pool = require('./config/db');
const bcrypt = require('bcrypt');

const seed = async () => {
  try {
    console.log('Menghapus data lama...');
    await pool.query('DELETE FROM scan_history');
    await pool.query('DELETE FROM skin_concerns');
    await pool.query('DELETE FROM skin_profiles');
    await pool.query('DELETE FROM users');

    console.log('Memasukkan data user...');
    const password1 = await bcrypt.hash('password123', 10);
    const password2 = await bcrypt.hash('password123', 10);

    const user1 = await pool.query(
      `INSERT INTO users (name, email, password, phone, birthdate)
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      ['Anissa Prisilia', 'anissa@email.com', password1, '+62 812 3456 7890', '2003-05-14']
    );

    const user2 = await pool.query(
      `INSERT INTO users (name, email, password, phone, birthdate)
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      ['Budi Santoso', 'budi@email.com', password2, '+62 821 9876 5432', '2000-08-21']
    );

    const uid1 = user1.rows[0].id;
    const uid2 = user2.rows[0].id;

    console.log('Memasukkan data skin profile...');
    await pool.query(
      'INSERT INTO skin_profiles (user_id, skin_type) VALUES ($1, $2)',
      [uid1, 'berminyak']
    );
    await pool.query(
      'INSERT INTO skin_profiles (user_id, skin_type) VALUES ($1, $2)',
      [uid2, 'kombinasi']
    );

    console.log('Memasukkan data skin concerns...');
    const concerns1 = ['jerawat', 'pori-pori', 'minyak berlebih'];
    for (const c of concerns1) {
      await pool.query(
        'INSERT INTO skin_concerns (user_id, concern) VALUES ($1, $2)',
        [uid1, c]
      );
    }

    const concerns2 = ['flek hitam', 'kulit kusam'];
    for (const c of concerns2) {
      await pool.query(
        'INSERT INTO skin_concerns (user_id, concern) VALUES ($1, $2)',
        [uid2, c]
      );
    }

    console.log('Memasukkan data scan history...');
    await pool.query(
      `INSERT INTO scan_history (user_id, image_url, result) VALUES ($1, $2, $3)`,
      [
        uid1,
        '/uploads/scan_anissa_1.jpg',
        JSON.stringify({
          skin_type: 'berminyak',
          conditions: ['jerawat', 'pori-pori besar'],
          score: 65,
          recommendations: [
            'Gunakan niacinamide 10%',
            'Hindari moisturizer berbasis minyak',
            'Gunakan sunscreen non-comedogenic',
          ],
        }),
      ]
    );

    await pool.query(
      `INSERT INTO scan_history (user_id, image_url, result) VALUES ($1, $2, $3)`,
      [
        uid1,
        '/uploads/scan_anissa_2.jpg',
        JSON.stringify({
          skin_type: 'berminyak',
          conditions: ['minyak berlebih'],
          score: 74,
          recommendations: [
            'Lanjutkan penggunaan niacinamide',
            'Tambahkan BHA/salicylic acid',
          ],
        }),
      ]
    );

    await pool.query(
      `INSERT INTO scan_history (user_id, image_url, result) VALUES ($1, $2, $3)`,
      [
        uid2,
        '/uploads/scan_budi_1.jpg',
        JSON.stringify({
          skin_type: 'kombinasi',
          conditions: ['flek hitam', 'kulit kusam'],
          score: 70,
          recommendations: [
            'Gunakan vitamin C serum di pagi hari',
            'Eksfoliasi 2x seminggu dengan AHA',
            'Gunakan sunscreen SPF 50+',
          ],
        }),
      ]
    );

    console.log('\n✅ Seed data berhasil dimasukkan!');
    console.log('\nAkun untuk testing:');
    console.log('  Email: anissa@email.com  | Password: password123');
    console.log('  Email: budi@email.com    | Password: password123');
    process.exit(0);
  } catch (err) {
    console.error('Error seed:', err);
    process.exit(1);
  }
};

seed();