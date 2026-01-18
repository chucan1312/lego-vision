from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.routes.health import router as health_router
from app.routes.analyze import router as analyze_router
from app.routes.builds import router as builds_router
from app.routes.recipes import router as recipes_router
from app.utils.image_normalize import normalize_to_rgb


app = FastAPI(title="LEGO Vision API")

# Allow frontend (Vite React) to call backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "LEGO Vision API running"}


app.mount("/static", StaticFiles(directory="../data"), name="static")


app.include_router(recipes_router, prefix="/api")
app.include_router(health_router, prefix="/api")
app.include_router(analyze_router, prefix="/api")
app.include_router(builds_router, prefix="/api")
