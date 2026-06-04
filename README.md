# SkinSenseAI

Aplikasi web analisis kondisi kulit wajah berbasis Artificial Intelligence. User cukup mengunggah foto wajah, lalu sistem akan mendeteksi kondisi tipe kulit (seperti kering, berminyak, berjerawat, dan normal) dan memberikan rekomendasi bahan aktif untuk perawatan yang sesuai.

**React + Vite** (frontend) · **Node.js / Express** · **PostgreSQL**  (backend) · **FastAPI** (AI service) · **Cloudinary** (opsional)

---

## 📁 Struktur Proyek

```
SkinSenseAI/
├── frontend/        # React + Vite + Tailwind CSS
├── backend/         # Node.js + Express + PostgreSQL
└── (ai-service)     # FastAPI — repo terpisah
```

---

## 🧴 Cara Menggunakan Aplikasi

1. **Buka aplikasi** di browser dan kunjungi URL frontend [`https://skin-sense-ai-mu.vercel.app/`].
2. **Daftar atau login** — buat akun baru atau masuk dengan akun yang sudah ada.
3. **Masuk ke halaman Skin Check** — klik menu atau tombol "Analisis" di navigasi.
4. **Unggah foto wajah** — pilih gambar wajah/ambil gambar wajah yang jelas, pencahayaan cukup, dan menghadap ke depan.
5. **Mulai analisis** — klik tombol "Analisis" dan tunggu beberapa saat.
6. **Lihat hasil** — sistem akan menampilkan:
   - Tipe kulit yang terdeteksi (kering, berminyak, berjerawat, atau normal)
   - Rekomendasi bahan aktif perawatan yang sesuai
   - Setiap hasil analisis dapat di download dokumen pdfnya
7. **Riwayat analisis** — hasil setiap analisis tersimpan dan bisa dilihat kembali di halaman History.

---

## ⚙️ Setup Environment Variables

### Backend (`backend/.env`)

Salin `backend/.env.example` lalu isi:

```bash
cp backend/.env.example backend/.env
```

| Variabel | Keterangan |
|---|---|
| `DB_HOST` | Host PostgreSQL |
| `DB_PORT` | Port PostgreSQL, default `5432` |
| `DB_USER` | Username database |
| `DB_PASSWORD` | Password database |
| `DB_NAME` | Nama database |
| `DATABASE_URL` | Full connection string (opsional, Railway) |
| `JWT_SECRET` | String rahasia untuk signing JWT — **ganti wajib!** |
| `CLOUDINARY_CLOUD_NAME` | Cloud name dari dashboard Cloudinary (opsional) |
| `CLOUDINARY_API_KEY` | API Key Cloudinary (opsional) |
| `CLOUDINARY_API_SECRET` | API Secret Cloudinary (opsional) |
| `AI_SERVICE_URL` | URL ke layanan FastAPI model AI |
| `PORT` | Port server Express, default `3000` |

### Frontend (`frontend/.env`)

```bash
cp frontend/.env.example frontend/.env
```

| Variabel | Keterangan |
|---|---|
| `VITE_API_URL` | URL backend API, contoh `http://localhost:3000` |
| `VITE_GOOGLE_CLIENT_ID` | Client ID Google, contoh `2962587162648179..` |

---

## 🤖 Model AI

Layanan AI berjalan sebagai service FastAPI terpisah.

- **Repository AI:** sesuaikan `AI_SERVICE_URL` di `.env`.
- **Endpoint yang dipakai:** `POST /analyze` — menerima `multipart/form-data` dengan field `file` (gambar wajah), mengembalikan JSON hasil analisis kulit.
- Model dilatih untuk mendeteksi kondisi tipe kulit seperti kering, berminyak, berjerawat, dan normal.

---

## 🚀 Cara Menjalankan Aplikasi

### Prasyarat

- Node.js >= 18
- PostgreSQL (lokal atau Railway)
- Akun Cloudinary (gratis, opsional)
- AI service berjalan (lokal atau hosted)

---

### 1. Clone Repo

```bash
git clone https://github.com/your-username/SkinSenseAI.git
cd SkinSenseAI
```

### 2. Jalankan Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env sesuai konfigurasi
npm run migrate    # Buat tabel di database
npm run dev        # Development (nodemon)
# atau
npm start          # Production
```

Backend akan berjalan di `http://localhost:3000`.

### 3. Jalankan Frontend

```bash
cd frontend
npm install
cp .env.example .env
# Edit sesuai konfigurasi
npm run dev
```

Frontend akan berjalan di `http://localhost:5173`.

### 4. Akses Aplikasi

Buka browser dan kunjungi `http://localhost:5173`.

---

## 📄 API Docs

Dokumentasi endpoint backend tersedia di [`backend/API_DOCS.md`](./backend/API_DOCS.md).
