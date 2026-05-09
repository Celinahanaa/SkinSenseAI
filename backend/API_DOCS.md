# SkinSense AI — API Documentation

Base URL: `http://localhost:3000/api`

Endpoint yang butuh login wajib menyertakan header:
```
Authorization: Bearer <token>
```

---

## Auth

### POST `/auth/register`
Daftarkan user baru.

**Request Body:**
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

**Request Body:**
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
    "created_at": "2026-05-09T10:00:00Z"
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
  "avatar_url": "/uploads/avatar1.jpg",
  "created_at": "2026-05-09T10:00:00Z",
  "skin_type": "berminyak",
  "skin_concerns": ["jerawat", "pori-pori"]
}
```

---

### PUT `/profile`
Update data profil user.

**Header:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "Anissa Prisilia",
  "phone": "+62 812 3456 7890",
  "birthdate": "2003-05-14",
  "skin_type": "berminyak",
  "skin_concerns": ["jerawat", "pori-pori", "flek hitam"]
}
```

**Response 200:**
```json
{
  "message": "Profil berhasil diperbarui"
}
```

---

## History

### GET `/history`
Ambil semua riwayat scan milik user.

**Header:** `Authorization: Bearer <token>`

**Response 200:**
```json
[
  {
    "id": 1,
    "image_url": "/uploads/scan1.jpg",
    "result": {
      "skin_type": "berminyak",
      "conditions": ["jerawat", "pori-pori besar"],
      "score": 72,
      "recommendations": ["gunakan niacinamide", "hindari SPF berminyak"]
    },
    "created_at": "2026-05-09T10:00:00Z"
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
  "image_url": "/uploads/scan1.jpg",
  "result": {
    "skin_type": "berminyak",
    "conditions": ["jerawat", "pori-pori besar"],
    "score": 72,
    "recommendations": ["gunakan niacinamide", "hindari SPF berminyak"]
  },
  "created_at": "2026-05-09T10:00:00Z"
}
```

**Response gagal:**
| Status | Pesan |
|--------|-------|
| 404 | Data tidak ditemukan |

---

## Analyze

### POST `/analyze`
Kirim foto kulit untuk dianalisis oleh model AI.

**Header:** `Authorization: Bearer <token>`

**Request:** `multipart/form-data`
| Field | Type | Keterangan |
|-------|------|------------|
| image | file | Foto wajah (JPEG, PNG, WEBP) |

**Response 200** *(format menunggu tim data science)*:
```json
{
  "skin_type": "berminyak",
  "conditions": ["jerawat", "pori-pori besar"],
  "score": 72,
  "recommendations": ["gunakan niacinamide", "hindari SPF berminyak"]
}
```

> **Catatan:** Endpoint ini belum aktif. Akan diintegrasikan setelah model AI dari tim data science tersedia.

---

## Struktur Database

### Tabel `users`
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | SERIAL | Primary key |
| name | VARCHAR(100) | Nama lengkap |
| email | VARCHAR(100) | Unik, untuk login |
| password | VARCHAR(255) | Di-hash dengan bcrypt |
| phone | VARCHAR(20) | Opsional |
| birthdate | DATE | Opsional |
| avatar_url | VARCHAR(255) | Path foto profil |
| created_at | TIMESTAMP | Otomatis diisi |

### Tabel `skin_profiles`
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | SERIAL | Primary key |
| user_id | INT | FK ke users |
| skin_type | VARCHAR(50) | normal/berminyak/kering/kombinasi/sensitif |
| updated_at | TIMESTAMP | Otomatis diisi |

### Tabel `skin_concerns`
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | SERIAL | Primary key |
| user_id | INT | FK ke users |
| concern | VARCHAR(100) | Nama masalah kulit |

### Tabel `scan_history`
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | SERIAL | Primary key |
| user_id | INT | FK ke users |
| image_url | VARCHAR(255) | Path foto yang dianalisis |
| result | JSONB | Hasil analisis AI |
| created_at | TIMESTAMP | Otomatis diisi |