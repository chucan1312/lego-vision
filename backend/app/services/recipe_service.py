import json

RECIPES_PATH = "../data/recipes/recipes.json"

def load_recipes():
    with open(RECIPES_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)
    return data["recipes"]
