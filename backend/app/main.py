from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .sheets import get_plantation, get_factory, get_company
from .models import HarvestFeatures
from .ml import harvest_model

app = FastAPI(title="Palm Oil Ops API")

# Middleware agar API bisa diakses dari frontend (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Palm Oil Dashboard API is running"}

@app.get("/health")
def health():
    return {"ok": True}

@app.get("/data/plantation")
def plantation():
    return get_plantation()

@app.get("/data/factory")
def factory():
    return get_factory()

@app.get("/data/company")
def company():
    return get_company()

@app.post("/predict/harvest")
def predict_harvest(feat: HarvestFeatures):
    y = harvest_model.predict(feat.model_dump())
    return {"predicted_ffb_ton": round(y, 3)}
