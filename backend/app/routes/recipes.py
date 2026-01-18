from fastapi import APIRouter
from app.services.recipe_service import load_recipes

router = APIRouter()

@router.get("/recipes")
def get_recipes():
    return {"recipes": load_recipes()}
