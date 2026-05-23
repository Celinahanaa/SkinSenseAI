from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
import os, io
from tensorflow.keras.models import load_model
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
from PIL import Image
import numpy as np
import pandas as pd
import pickle

app = FastAPI(title="Skincare API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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
# Mapping label
# =====================
LABEL_MAP = {
    'Kering':     'Dry',
    'Berminyak':  'Oily',
    'Normal':     'Normal',
    'Berjerawat': 'Acne',
}

def to_english(label: str) -> str:
    return LABEL_MAP.get(label, label)

# =====================
# Endpoint: Predict gambar
# =====================
@app.post("/predict-kulit")
async def predict_kulit(file: UploadFile = File(...)):
    contents = await file.read()
    img = Image.open(io.BytesIO(contents)).convert("RGB").resize((224, 224))
    img_array = preprocess_input(np.expand_dims(np.array(img), axis=0))

    pred = model_gambar.predict(img_array)
    class_idx = np.argmax(pred)
    jenis_kulit = class_names[class_idx].capitalize()

    return {
        "skin_type": to_english(jenis_kulit),
        "confidence": round(float(np.max(pred)), 3),
        "probabilities": {
            to_english(class_names[i].capitalize()): round(float(pred[0][i]), 3)
            for i in range(len(class_names))
        }
    }

# =====================
# Endpoint: Rekomendasi
# =====================
@app.post("/rekomendasi")
async def rekomendasi(jenis_kulit: str, top_n: int = 5):
    valid_kulit = list(kulit_enc.classes_)
    reverse_map = {v: k for k, v in LABEL_MAP.items()}
    jenis_kulit_id = reverse_map.get(jenis_kulit.capitalize(), jenis_kulit.capitalize())

    if jenis_kulit_id not in valid_kulit:
        return {"error": f"Jenis kulit tidak valid. Pilih: {valid_kulit}"}

    kulit_encoded = kulit_enc.transform([jenis_kulit_id])[0]
    pred = model_rekomendasi.predict(np.array([[kulit_encoded]]), verbose=0)[0]
    top_indices = pred.argsort()[-min(top_n, len(pred)):][::-1]
    top_bahan = bahan_enc.inverse_transform(top_indices)

    hasil = (
        df_rekomendasi[df_rekomendasi['Bahan_Aktif'].isin(top_bahan)]
        [['Bahan_Aktif', 'Kategori_Fungsi']]
        .drop_duplicates(subset='Bahan_Aktif')
        .reset_index(drop=True)
    )

    return {
        "skin_type": to_english(jenis_kulit_id),
        "recommendations": [
            {"Bahan_Standar": row["Bahan_Aktif"].lower(), "Kategori_Fungsi": row["Kategori_Fungsi"]}
            for _, row in hasil.iterrows()
        ]
    }

# =====================
# Endpoint: Analyze (predict + rekomendasi)
# =====================
@app.post("/analyze")
async def analyze(file: UploadFile = File(...), top_n: int = 5):
    contents = await file.read()
    img = Image.open(io.BytesIO(contents)).convert("RGB").resize((224, 224))
    img_array = preprocess_input(np.expand_dims(np.array(img), axis=0))

    pred_gambar = model_gambar.predict(img_array)
    class_idx = np.argmax(pred_gambar)
    jenis_kulit_id = class_names[class_idx].capitalize()
    jenis_kulit_en = to_english(jenis_kulit_id)
    confidence = float(np.max(pred_gambar))

    kulit_encoded = kulit_enc.transform([jenis_kulit_id])[0]
    pred_rekomendasi = model_rekomendasi.predict(np.array([[kulit_encoded]]), verbose=0)[0]
    top_indices = pred_rekomendasi.argsort()[-top_n:][::-1]
    top_bahan = bahan_enc.inverse_transform(top_indices)

    hasil = (
        df_rekomendasi[df_rekomendasi['Bahan_Aktif'].isin(top_bahan)]
        [['Bahan_Aktif', 'Kategori_Fungsi']]
        .drop_duplicates(subset='Bahan_Aktif')
        .reset_index(drop=True)
    )

    return {
        "skin_type": jenis_kulit_en,
        "confidence": round(confidence, 3),
        "probabilities": {
            to_english(class_names[i].capitalize()): round(float(pred_gambar[0][i]), 3)
            for i in range(len(class_names))
        },
        "recommendations": [
            {"Bahan_Standar": row["Bahan_Aktif"].lower(), "Kategori_Fungsi": row["Kategori_Fungsi"]}
            for _, row in hasil.iterrows()
        ]
    }

# =====================
# Health Check & Frontend
# =====================
@app.get("/", response_class=HTMLResponse)
def root():
    if os.path.exists("index.html"):
        with open("index.html", "r", encoding="utf-8") as f:
            return HTMLResponse(content=f.read())
    return HTMLResponse(content="<h1>Frontend tidak ditemukan!</h1>", status_code=404)

@app.get("/health")
def health():
    return {"status": "API Skincare berjalan ✅"}