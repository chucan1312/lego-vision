from fastapi import APIRouter
from pydantic import BaseModel
from typing import Dict

from app.services.recipe_service import load_recipes
from app.services.parts_service import load_parts_map
from app.services.match_service import match_builds

router = APIRouter()

class MatchRequest(BaseModel):
    inventory: Dict[str, int]

@router.post("/match-builds")
def match_builds_route(body: MatchRequest):
    recipes = load_recipes()
    parts_map = load_parts_map()
    return match_builds(body.inventory, recipes, parts_map)
