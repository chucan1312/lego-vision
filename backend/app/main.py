from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.health import router as health_router
from app.routes.analyze import router as analyze_router

app = FastAPI(title="LEGO Vision API")

# Allow frontend (Vite React) to call backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router, prefix="/api")
app.include_router(analyze_router, prefix="/api")

@app.get("/")
def root():
    return {"message": "LEGO Vision API running"}