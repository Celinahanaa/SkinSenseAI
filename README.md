# 🧴 SkinSenseAI

Aplikasi web analisis kondisi kulit wajah berbasis kecerdasan buatan. Pengguna cukup mengunggah foto wajah, lalu sistem akan mendeteksi kondisi kulit (seperti jerawat, komedo, kulit kering, dll.) dan memberikan rekomendasi perawatan yang sesuai.

Stack: **React + Vite** (frontend) · **Node.js / Express** (backend) · **FastAPI + PyTorch/TF** (ML service) · **PostgreSQL** · **Cloudinary**

---

## 📁 Struktur Proyek

```
SkinSenseAI/
├── frontend/        # React + Vite + Tailwind CSS
├── backend/         # Node.js + Express + PostgreSQL
└── (ml-service)     # FastAPI — repo terpisah, lihat tautan di bawah
```

---

## ⚙️ Setup Environment Variables

### Backend (`backend/.env`)

Salin `backend/.env.example` lalu isi:

```bash
cp backend/.env.example backend/.env
```

| Variabel | Keterangan |
|---|---|
| `DB_HOST` | Host PostgreSQL (Railway: `postgres.railway.internal`) |
| `DB_PORT` | Port PostgreSQL, default `5432` |
| `DB_USER` | Username database |
| `DB_PASSWORD` | Password database |
| `DB_NAME` | Nama database, default `railway` |
| `DATABASE_URL` | Full connection string (opsional, auto-dipakai Railway) |
| `JWT_SECRET` | String rahasia untuk signing JWT — **ganti wajib!** |
| `CLOUDINARY_CLOUD_NAME` | Cloud name dari dashboard Cloudinary |
| `CLOUDINARY_API_KEY` | API Key Cloudinary |
| `CLOUDINARY_API_SECRET` | API Secret Cloudinary |
| `AI_SERVICE_URL` | URL ke layanan FastAPI model ML |
| `PORT` | Port server Express, default `3000` |

### Frontend (`frontend/.env`)

```bash
cp frontend/.env.example frontend/.env
```

| Variabel | Keterangan |
|---|---|
| `VITE_API_URL` | URL backend API, contoh `http://localhost:3000` |

---

## 🤖 Model Machine Learning

Layanan ML berjalan sebagai service FastAPI terpisah.

- **Repository ML:** [https://skinsense.ardhiansyah.my.id](https://skinsense.ardhiansyah.my.id) *(atau sesuaikan `AI_SERVICE_URL` di `.env`)*
- **Endpoint yang dipakai:** `POST /analyze` — menerima `multipart/form-data` dengan field `file` (gambar wajah), mengembalikan JSON hasil analisis kulit.
- Model dilatih untuk mendeteksi kondisi kulit seperti jerawat, pori-pori, tekstur, dll.

Untuk menjalankan ML service secara lokal, clone repo ML dan ikuti petunjuk di README-nya, lalu set `AI_SERVICE_URL=http://localhost:8000`.

---

## 🚀 Cara Menjalankan Aplikasi

### Prasyarat

- Node.js >= 18
- PostgreSQL (lokal atau Railway)
- Akun Cloudinary (gratis)
- ML service berjalan (lokal atau hosted)

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
# Edit .env sesuai konfigurasi kamu
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
# Edit VITE_API_URL sesuai URL backend
npm run dev
```

Frontend akan berjalan di `http://localhost:5173`.

### 4. Akses Aplikasi

Buka browser dan kunjungi `http://localhost:5173`.

---

## 🌐 Deployment (Railway)

1. Push repo ke GitHub.
2. Buat project baru di [Railway](https://railway.app), tambahkan service **PostgreSQL** dan service dari repo GitHub.
3. Set semua environment variable di tab **Variables** sesuai tabel di atas.
4. Railway akan otomatis menjalankan `npm start` (termasuk migrasi).

---

## 📄 API Docs

Dokumentasi endpoint backend tersedia di [`backend/API_DOCS.md`](./backend/API_DOCS.md).
