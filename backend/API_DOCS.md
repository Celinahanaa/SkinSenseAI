# SkinSense AI — API Documentation

Base URL produksi: `https://skinsenseai-production.up.railway.app/api`  
Base URL lokal: `http://localhost:3000/api`

Endpoint yang membutuhkan login wajib menyertakan header:
```
Authorization: Bearer <token>
```

---

## Auth

### POST `/auth/register`
Daftarkan user baru.

**Request Body:** `application/json`
```json
{
  "name": "Anissa Prisilia",
  "email": "anissa@email.com",
  "password": "rahasia123"
}
```

**Response 201:**
```json
{
  "token": "eyJhbGci...",
  "user": {
    "id": 1,
    "name": "Anissa Prisilia",
    "email": "anissa@email.com"
  }
}
```

**Response gagal:**
| Status | Pesan |
|--------|-------|
| 400 | Semua field wajib diisi |
| 409 | Email sudah terdaftar |
| 500 | Server error |

---

### POST `/auth/login`
Login user yang sudah terdaftar.

**Request Body:** `application/json`
```json
{
  "email": "anissa@email.com",
  "password": "rahasia123"
}
```

**Response 200:**
```json
{
  "token": "eyJhbGci...",
  "user": {
    "id": 1,
    "name": "Anissa Prisilia",
    "email": "anissa@email.com",
    "phone": null,
    "birthdate": null,
    "avatar_url": null,
    "created_at": "2026-05-09T10:00:00.000Z"
  }
}
```

**Response gagal:**
| Status | Pesan |
|--------|-------|
| 400 | Email dan password wajib diisi |
| 401 | Email atau password salah |
| 500 | Server error |

---

### POST `/auth/google`
Login atau registrasi via Google OAuth. Jika email belum terdaftar, user baru akan dibuat otomatis.

**Request Body:** `application/json`
```json
{
  "email": "anissa@gmail.com",
  "name": "Anissa Prisilia",
  "avatar_url": "https://lh3.googleusercontent.com/..."
}
```

**Response 200:**
```json
{
  "token": "eyJhbGci...",
  "user": {
    "id": 1,
    "name": "Anissa Prisilia",
    "email": "anissa@gmail.com",
    "avatar_url": null,
    "created_at": "2026-05-09T10:00:00.000Z"
  }
}
```

**Response gagal:**
| Status | Pesan |
|--------|-------|
| 500 | Server error |

---

### POST `/auth/check-email`
Cek apakah email sudah terdaftar. Dipakai sebelum alur reset password.

**Request Body:** `application/json`
```json
{
  "email": "anissa@email.com"
}
```

**Response 200:**
```json
{ "message": "OK" }
```

**Response gagal:**
| Status | Pesan |
|--------|-------|
| 404 | Email tidak ditemukan |

---

### POST `/auth/reset-password`
Reset password user berdasarkan email, tanpa token. Pastikan email sudah divalidasi via `/auth/check-email` sebelum memanggil endpoint ini.

**Request Body:** `application/json`
```json
{
  "email": "anissa@email.com",
  "newPassword": "passwordbaru123"
}
```

**Response 200:**
```json
{ "message": "Password berhasil diubah" }
```

**Response gagal:**
| Status | Pesan |
|--------|-------|
| 404 | Email tidak ditemukan |
| 500 | Server error |

---

## Profile

### GET `/profile`
Ambil data profil user yang sedang login.

**Header:** `Authorization: Bearer <token>`

**Response 200:**
```json
{
  "id": 1,
  "name": "Anissa Prisilia",
  "email": "anissa@email.com",
  "phone": "+62 812 3456 7890",
  "birthdate": "2003-05-14",
  "avatar_url": "https://res.cloudinary.com/ddd2gmkb2/image/upload/...",
  "created_at": "2026-05-09T10:00:00.000Z",
  "skin_type": "Oily"
}
```

> `avatar_url` mengarah ke URL Cloudinary di production. `skin_type` bisa `null` jika belum pernah scan.

**Response gagal:**
| Status | Pesan |
|--------|-------|
| 401 | Token tidak ada / tidak valid |
| 404 | User tidak ditemukan |
| 500 | Server error |

---

### PUT `/profile`
Update data profil user. Avatar bersifat opsional — jika tidak dikirim, foto profil tidak berubah.

**Header:** `Authorization: Bearer <token>`  
**Content-Type:** `multipart/form-data`

| Field | Tipe | Wajib | Keterangan |
|-------|------|-------|------------|
| name | string | Ya | Nama lengkap |
| phone | string | Tidak | Nomor telepon |
| birthdate | string | Tidak | Format `YYYY-MM-DD` |
| skin_type | string | Tidak | Tipe kulit hasil scan |
| avatar | file | Tidak | Foto profil (JPG, JPEG, PNG) |

**Response 200:**
```json
{ "message": "Profil berhasil diperbarui" }
```

**Response gagal:**
| Status | Pesan |
|--------|-------|
| 401 | Token tidak ada / tidak valid |
| 500 | Server error |

---

## Upload

### POST `/upload`

> **Base URL berbeda:** `http://localhost:3000/api/upload` (bukan `/api/upload`)

Upload gambar ke Cloudinary dan kembalikan URL-nya. Dipakai untuk menyimpan foto hasil scan sebelum disimpan ke history.

**Header:** `Authorization: Bearer <token>`  
**Content-Type:** `multipart/form-data`

| Field | Tipe | Keterangan |
|-------|------|------------|
| file | file | Gambar wajah (JPG, JPEG, PNG) |

**Response 200:**
```json
{
  "url": "https://res.cloudinary.com/ddd2gmkb2/image/upload/v.../skinsense-analysis/abc123.jpg"
}
```

**Response gagal:**
| Status | Pesan |
|--------|-------|
| 500 | Upload error |

---

## AI / Analisis

### POST `/ai/analyze`
Kirim foto wajah untuk dianalisis oleh model ML (FastAPI). Endpoint ini meneruskan gambar ke AI service dan mengembalikan hasilnya langsung.

**Tidak butuh token.**  
**Content-Type:** `multipart/form-data`

| Field | Tipe | Keterangan |
|-------|------|------------|
| file | file | Foto wajah (JPG, JPEG, PNG) |

**Response 200:**
```json
{
  "skin_type": "Oily",
  "confidence": 0.87,
  "probabilities": {
    "Oily": 0.87,
    "Normal": 0.09,
    "Dry": 0.03,
    "Acne": 0.01
  },
  "recommendations": [
    "salicylic acid",
  ]
}
```

> Format response ditentukan oleh AI service (`AI_SERVICE_URL`). Struktur di atas sesuai yang digunakan frontend saat ini.

**Response gagal:**
| Status | Keterangan |
|--------|------------|
| 400 | Tidak ada file yang dikirim |
| 500 | AI_SERVICE_URL tidak dikonfigurasi, atau AI service error |

---

## History

### GET `/history`
Ambil semua riwayat scan milik user, diurutkan dari terbaru.

**Header:** `Authorization: Bearer <token>`

**Response 200:**
```json
[
  {
    "id": 1,
    "image_url": "https://res.cloudinary.com/ddd2gmkb2/image/upload/.../scan.jpg",
    "result": {
      "skin_type": "Oily",
      "confidence": 0.87,
      "probabilities": {
        "Oily": 0.87,
        "Normal": 0.09,
        "Dry": 0.03,
        "Acne": 0.01
      },
      "recommendations": [
        "Gunakan pembersih wajah berbahan salicylic acid"
      ]
    },
    "created_at": "2026-05-09T10:00:00.000Z"
  }
]
```

---

### GET `/history/:id`
Ambil detail satu riwayat scan berdasarkan ID.

**Header:** `Authorization: Bearer <token>`

**Response 200:**
```json
{
  "id": 1,
  "user_id": 1,
  "image_url": "https://res.cloudinary.com/ddd2gmkb2/image/upload/.../scan.jpg",
  "result": {
    "skin_type": "Oily",
    "confidence": 0.87,
    "probabilities": {
      "Oily": 0.87,
      "Normal": 0.09,
      "Dry": 0.03,
      "Acne": 0.01
    },
    "recommendations": [
      "Gunakan pembersih wajah berbahan salicylic acid"
    ]
  },
  "created_at": "2026-05-09T10:00:00.000Z"
}
```

**Response gagal:**
| Status | Pesan |
|--------|-------|
| 404 | Data tidak ditemukan |
| 500 | Server error |

---

### POST `/history`
Simpan hasil scan ke riwayat user.

**Header:** `Authorization: Bearer <token>`  
**Content-Type:** `application/json`

```json
{
  "skin_type": "Oily",
  "confidence": 0.87,
  "probabilities": {
    "Oily": 0.87,
    "Normal": 0.09,
    "Dry": 0.03,
    "Acne": 0.01
  },
  "recommendations": [
    "salicylic acid"
  ],
  "image_url": "https://res.cloudinary.com/ddd2gmkb2/image/upload/.../scan.jpg"
}
```

**Response 200:**
```json
{ "message": "History tersimpan" }
```

**Response gagal:**
| Status | Pesan |
|--------|-------|
| 401 | Token tidak ada / tidak valid |
| 500 | Gagal simpan history |

---

### DELETE `/history/:id`
Hapus satu riwayat scan berdasarkan ID. Hanya bisa menghapus history milik sendiri.

**Header:** `Authorization: Bearer <token>`

**Response 200:**
```json
{ "message": "History berhasil dihapus" }
```

**Response gagal:**
| Status | Pesan |
|--------|-------|
| 404 | Data tidak ditemukan |
| 500 | Server error |

---

## Struktur Database

### Tabel `users`
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | SERIAL | Primary key |
| name | VARCHAR(100) | Nama lengkap |
| email | VARCHAR(100) | Unik, untuk login |
| password | VARCHAR(255) | Di-hash dengan bcrypt (`google-oauth` untuk login Google) |
| phone | VARCHAR(20) | Opsional |
| birthdate | DATE | Opsional |
| avatar_url | VARCHAR(255) | URL Cloudinary foto profil |
| created_at | TIMESTAMP | Otomatis diisi |

### Tabel `skin_profiles`
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | SERIAL | Primary key |
| user_id | INT | FK ke `users`, CASCADE delete |
| skin_type | VARCHAR(50) | Tipe kulit terakhir dari hasil scan |
| updated_at | TIMESTAMP | Otomatis diisi |

### Tabel `scan_history`
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | SERIAL | Primary key |
| user_id | INT | FK ke `users`, CASCADE delete |
| image_url | VARCHAR(255) | URL Cloudinary foto yang dianalisis |
| result | JSONB | Hasil analisis: `skin_type`, `confidence`, `probabilities`, `recommendations` |
| created_at | TIMESTAMP | Otomatis diisi |
