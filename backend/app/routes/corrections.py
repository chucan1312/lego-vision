from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Dict, Optional

from app.services.recipe_service import load_recipes
from app.services.parts_service import load_parts_map
from app.services.match_service import match_builds

router = APIRouter()

class Detection(BaseModel):
    id: str
    predictedId: str
    correctedId: Optional[str] = None

class CorrectionRequest(BaseModel):
    detections: List[Detection]

@router.post("/apply-corrections")
def apply_corrections(body: CorrectionRequest):
    # Build final inventory from corrected detections
    inventory: Dict[str, int] = {}

    for d in body.detections:
        final_id = d.correctedId or d.predictedId
        inventory[final_id] = inventory.get(final_id, 0) + 1

    recipes = load_recipes()
    parts_map = load_parts_map()

    # returns {"top10": [...]}
    results = match_builds(inventory, recipes, parts_map)

    return {
        "inventory": inventory,
        **results
    }
