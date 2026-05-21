from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
import os
from tensorflow.keras.models import load_model
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
from PIL import Image
import numpy as np
import pandas as pd
import pickle
import io

app = FastAPI(title="Skincare API")

# CORS agar bisa diakses Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Ganti domain FE saat production
    allow_methods=["*"],
    allow_headers=["*"],
)

# =====================
# Load semua model
# =====================
model_gambar = load_model("models/model_terbaik.keras")

with open("models/class_names.pkl", "rb") as f:
    class_names = pickle.load(f)

model_rekomendasi = load_model("models/model_rekomendasi.keras")

with open("models/encoders_rekomendasi.pkl", "rb") as f:
    encoders = pickle.load(f)

kulit_enc = encoders['kulit_enc']
bahan_enc = encoders['bahan_enc']

df_rekomendasi = pd.read_csv("models/df_rekomendasi.csv")

print("✅ Semua model berhasil diload!")

# =====================
# Mapping label Indonesia → English
# =====================
LABEL_MAP = {
    'Kering':     'Dry',
    'Berminyak':  'Oily',
    'Normal':     'Normal',
    'Berjerawat': 'Acne',
}

def to_english(label: str) -> str:
    """Translate label kulit dari Indonesia ke English."""
    return LABEL_MAP.get(label, label)


# =====================
# Endpoint 1: Prediksi Gambar
# =====================
@app.post("/predict-kulit")
async def predict_kulit(file: UploadFile = File(...)):
    # Baca & proses gambar
    contents = await file.read()
    img = Image.open(io.BytesIO(contents)).convert("RGB")
    img = img.resize((224, 224))
    img_array = np.array(img)
    img_array = preprocess_input(img_array)
    img_array = np.expand_dims(img_array, axis=0)

    # Prediksi
    pred = model_gambar.predict(img_array)
    class_idx = np.argmax(pred)
    jenis_kulit = class_names[class_idx].capitalize()
    confidence = float(np.max(pred))

    return {
        "skin_type": to_english(jenis_kulit),
        "confidence": round(confidence, 3),
        "probabilities": {
            to_english(class_names[i].capitalize()): round(float(pred[0][i]), 3)
            for i in range(len(class_names))
        }
    }


# =====================
# Endpoint 2: Rekomendasi Skincare
# =====================
@app.post("/rekomendasi")
async def rekomendasi(jenis_kulit: str, top_n: int = 5):
    valid_kulit = list(kulit_enc.classes_)

    # Coba cocokkan input (bisa English atau Indonesia)
    reverse_map = {v: k for k, v in LABEL_MAP.items()}
    jenis_kulit_id = reverse_map.get(jenis_kulit.capitalize(), jenis_kulit.capitalize())

    if jenis_kulit_id not in valid_kulit:
        return {
            "error": f"Jenis kulit tidak valid. Pilih: {valid_kulit}"
        }

    # Encode & prediksi (encoder pakai label Indonesia)
    kulit_encoded = kulit_enc.transform([jenis_kulit_id])[0]
    input_data = np.array([[kulit_encoded]])
    pred = model_rekomendasi.predict(input_data, verbose=0)[0]

    # Ambil top N
    top_n = min(top_n, len(pred))
    top_indices = pred.argsort()[-top_n:][::-1]
    top_bahan = bahan_enc.inverse_transform(top_indices)

    # Lookup dari dataframe
    hasil = (
        df_rekomendasi[df_rekomendasi['Bahan_Aktif'].isin(top_bahan)]
        [['Bahan_Aktif', 'Kategori_Fungsi']]
        .drop_duplicates(subset='Bahan_Aktif')
        .reset_index(drop=True)
    )

    rekomendasi_list = [
        {
            "Bahan_Standar": row["Bahan_Aktif"].lower(),
            "Kategori_Fungsi": row["Kategori_Fungsi"]
        }
        for _, row in hasil.iterrows()
    ]

    return {
        "skin_type": to_english(jenis_kulit_id),
        "recommendations": rekomendasi_list
    }


# =====================
# Endpoint 3: Predict + Rekomendasi Sekaligus
# =====================
@app.post("/analyze")
async def analyze(file: UploadFile = File(...), top_n: int = 5):
    # Prediksi gambar
    contents = await file.read()
    img = Image.open(io.BytesIO(contents)).convert("RGB")
    img = img.resize((224, 224))
    img_array = preprocess_input(np.array(img))
    img_array = np.expand_dims(img_array, axis=0)

    pred_gambar = model_gambar.predict(img_array)
    class_idx = np.argmax(pred_gambar)
    jenis_kulit_id = class_names[class_idx].capitalize()  # label Indonesia (untuk encoder)
    jenis_kulit_en = to_english(jenis_kulit_id)           # label English (untuk response)
    confidence = float(np.max(pred_gambar))

    # Rekomendasi — encoder dilatih pakai label Indonesia, jadi tetap pakai jenis_kulit_id
    kulit_encoded = kulit_enc.transform([jenis_kulit_id])[0]
    pred_rekomendasi = model_rekomendasi.predict(
        np.array([[kulit_encoded]]), verbose=0
    )[0]

    top_indices = pred_rekomendasi.argsort()[-top_n:][::-1]
    top_bahan = bahan_enc.inverse_transform(top_indices)

    hasil = (
        df_rekomendasi[df_rekomendasi['Bahan_Aktif'].isin(top_bahan)]
        [['Bahan_Aktif', 'Kategori_Fungsi']]
        .drop_duplicates(subset='Bahan_Aktif')
        .reset_index(drop=True)
    )

    rekomendasi_list = [
        {
            "Bahan_Standar": row["Bahan_Aktif"].lower(),
            "Kategori_Fungsi": row["Kategori_Fungsi"]
        }
        for _, row in hasil.iterrows()
    ]

    probabilities = {
        to_english(class_names[i].capitalize()): round(float(pred_gambar[0][i]), 3)
        for i in range(len(class_names))
    }

    return {
        "skin_type": jenis_kulit_en,
        "confidence": round(confidence, 3),
        "probabilities": probabilities,
        "recommendations": rekomendasi_list
    }


# =====================
# Health Check & Frontend Dashboard
# =====================
@app.get("/", response_class=HTMLResponse)
def root():
    html_path = "index.html"
    if os.path.exists(html_path):
        with open(html_path, "r", encoding="utf-8") as f:
            return HTMLResponse(content=f.read(), status_code=200)
    return HTMLResponse(content="<h1>Frontend index.html tidak ditemukan!</h1>", status_code=404)


@app.get("/health")
def health():
    return {"status": "API Skincare berjalan ✅"}