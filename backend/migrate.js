const pool = require('./config/db');

const createTables = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id          SERIAL PRIMARY KEY,
        name        VARCHAR(100) NOT NULL,
        email       VARCHAR(100) UNIQUE NOT NULL,
        password    VARCHAR(255) NOT NULL,
        phone       VARCHAR(20),
        birthdate   DATE,
        avatar_url  VARCHAR(255),
        created_at  TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✓ Table users created');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS skin_profiles (
        id          SERIAL PRIMARY KEY,
        user_id     INT REFERENCES users(id) ON DELETE CASCADE,
        skin_type   VARCHAR(50),
        updated_at  TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✓ Table skin_profiles created');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS skin_concerns (
        id       SERIAL PRIMARY KEY,
        user_id  INT REFERENCES users(id) ON DELETE CASCADE,
        concern  VARCHAR(100)
      );
    `);
    console.log('✓ Table skin_concerns created');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS scan_history (
        id          SERIAL PRIMARY KEY,
        user_id     INT REFERENCES users(id) ON DELETE CASCADE,
        image_url   VARCHAR(255),
        result      JSONB,
        created_at  TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✓ Table scan_history created');

    console.log('\n✅ Semua tabel berhasil dibuat!');
    process.exit(0);
  } catch (err) {
    console.error('Error membuat tabel:', err);
    process.exit(1);
  }
};

createTables();
