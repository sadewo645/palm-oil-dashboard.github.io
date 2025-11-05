from fastapi import FastAPI
from app import sheets  # pastikan path ini sesuai struktur proyekmu

app = FastAPI()

@app.get("/")
def root():
    return {"message": "Palm Oil Dashboard API is running"}

@app.get("/get_plantation")
def get_plantation():
    return sheets.get_plantation()

@app.get("/get_factory")
def get_factory():
    return sheets.get_factory()

@app.get("/get_company")
def get_company():
    return sheets.get_company()
