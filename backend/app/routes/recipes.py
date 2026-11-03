from fastapi import APIRouter, HTTPException, Query, status
from typing import List, Optional
import sqlite3

from ..database import get_db_connection
from ..models import (
    RecipeCreate, RecipeResponse, MatchedRecipeResponse,
    MatchRequest, IngredientSchema, StepSchema
)

router = APIRouter(prefix="/api/recipes", tags=["Recipes & Leftover Matcher"])

def normalize_text(text: str) -> str:
    """Normalizes string for robust ingredient matching."""
    t = text.lower().strip()
    # Basic singularization / synonym normalization
    synonyms = {
        "eggs": "egg",
        "onions": "onion",
        "tomatoes": "tomato",
        "potatoes": "potato",
        "carrots": "carrot",
        "chapati": "roti",
        "chapatis": "roti",
        "rotis": "roti",
        "leftover roti": "roti",
        "leftover rice": "cooked rice",
        "rice": "cooked rice",
        "dal": "leftover dal",
        "lentils": "leftover dal",
        "breads": "bread",
        "bread slices": "bread",
        "capsicums": "capsicum",
        "bell pepper": "capsicum",
        "oil": "cooking oil"
    }
    return synonyms.get(t, t)

def is_ingredient_matched(recipe_ing: str, user_ingredients: List[str]) -> bool:
    """Checks if a recipe ingredient is satisfied by user's available items."""
    r_norm = normalize_text(recipe_ing)
    for u_ing in user_ingredients:
        u_norm = normalize_text(u_ing)
        if u_norm in r_norm or r_norm in u_norm:
            return True
    return False

@router.post("/match", response_model=List[MatchedRecipeResponse])
def match_leftovers(payload: MatchRequest):
    """
    Intelligent Leftover Matching Algorithm:
    Evaluates available ingredients against recipe database, calculates match percentage,
    identifies missing ingredients vs common pantry staples, and ranks by relevance.
    """
    conn = get_db_connection()
    cursor = conn.cursor()

    query = "SELECT * FROM recipes"
    params = []
    conditions = []

    if payload.dietary_filter:
        conditions.append("dietary = ?")
        params.append(payload.dietary_filter)

    if payload.max_cook_time:
        conditions.append("(prep_time + cook_time) <= ?")
        params.append(payload.max_cook_time)

    if conditions:
        query += " WHERE " + " AND ".join(conditions)

    cursor.execute(query, params)
    recipes = cursor.fetchall()

    matched_results = []

    for r in recipes:
        recipe_id = r["id"]

        # Fetch ingredients
        cursor.execute("SELECT * FROM recipe_ingredients WHERE recipe_id = ?", (recipe_id,))
        raw_ingredients = cursor.fetchall()

        # Fetch steps
        cursor.execute("SELECT * FROM recipe_steps WHERE recipe_id = ? ORDER BY step_number ASC", (recipe_id,))
        raw_steps = cursor.fetchall()

        matched_names = []
        missing_items = []
        staple_items = []

        non_staple_count = 0

        for ing in raw_ingredients:
            ing_name = ing["name"]
            is_staple = bool(ing["is_staple"])
            ing_obj = IngredientSchema(
                name=ing_name,
                quantity=ing["quantity"],
                unit=ing["unit"],
                is_staple=is_staple
            )

            if is_ingredient_matched(ing_name, payload.ingredients):
                matched_names.append(ing_name)
            else:
                if is_staple:
                    staple_items.append(ing_obj)
                else:
                    missing_items.append(ing_obj)

            if not is_staple:
                non_staple_count += 1

        # Match percentage calculation (based on core/non-staple ingredients)
        total_key = max(non_staple_count, 1)
        matched_key_count = sum(1 for name in matched_names if not any(
            ing["name"] == name and ing["is_staple"] for ing in raw_ingredients
        ))

        # Overall percentage
        if total_key > 0:
            pct = int(round((matched_key_count / total_key) * 100))
        else:
            pct = 100

        # Cap at 100
        pct = min(pct, 100)

        # Include recipe if at least one ingredient matches or if pct >= 20%
        if matched_key_count > 0:
            ingredients_list = [
                IngredientSchema(name=i["name"], quantity=i["quantity"], unit=i["unit"], is_staple=bool(i["is_staple"]))
                for i in raw_ingredients
            ]
            steps_list = [
                StepSchema(step_number=s["step_number"], instruction=s["instruction"])
                for s in raw_steps
            ]

            matched_results.append({
                "id": r["id"],
                "title": r["title"],
                "description": r["description"],
                "category": r["category"],
                "cuisine": r["cuisine"],
                "prep_time": r["prep_time"],
                "cook_time": r["cook_time"],
                "servings": r["servings"],
                "difficulty": r["difficulty"],
                "dietary": r["dietary"],
                "calories": r["calories"],
                "image_url": r["image_url"],
                "created_at": str(r["created_at"]),
                "ingredients": ingredients_list,
                "steps": steps_list,
                "match_percentage": pct,
                "matched_ingredients": matched_names,
                "missing_ingredients": missing_items,
                "staples_needed": staple_items
            })

    conn.close()

    # Sort descending by match_percentage, then by lower cooking time
    matched_results.sort(key=lambda x: (x["match_percentage"], -(x["prep_time"] + x["cook_time"])), reverse=True)
    return matched_results

@router.get("", response_model=List[RecipeResponse])
def get_recipes(
    category: Optional[str] = Query(None, description="Filter by category"),
    dietary: Optional[str] = Query(None, description="Filter by dietary preference"),
    search: Optional[str] = Query(None, description="Search query in title or description")
):
    """Fetches all recipes with optional category, dietary, or search filters."""
    conn = get_db_connection()
    cursor = conn.cursor()

    query = "SELECT * FROM recipes"
    params = []
    conditions = []

    if category:
        conditions.append("category = ?")
        params.append(category)
    if dietary:
        conditions.append("dietary = ?")
        params.append(dietary)
    if search:
        conditions.append("(title LIKE ? OR description LIKE ?)")
        params.extend([f"%{search}%", f"%{search}%"])

    if conditions:
        query += " WHERE " + " AND ".join(conditions)

    query += " ORDER BY id DESC"
    cursor.execute(query, params)
    rows = cursor.fetchall()

    results = []
    for r in rows:
        cursor.execute("SELECT * FROM recipe_ingredients WHERE recipe_id = ?", (r["id"],))
        raw_ingredients = cursor.fetchall()
        cursor.execute("SELECT * FROM recipe_steps WHERE recipe_id = ? ORDER BY step_number ASC", (r["id"],))
        raw_steps = cursor.fetchall()

        results.append({
            "id": r["id"],
            "title": r["title"],
            "description": r["description"],
            "category": r["category"],
            "cuisine": r["cuisine"],
            "prep_time": r["prep_time"],
            "cook_time": r["cook_time"],
            "servings": r["servings"],
            "difficulty": r["difficulty"],
            "dietary": r["dietary"],
            "calories": r["calories"],
            "image_url": r["image_url"],
            "created_at": str(r["created_at"]),
            "ingredients": [
                IngredientSchema(name=i["name"], quantity=i["quantity"], unit=i["unit"], is_staple=bool(i["is_staple"]))
                for i in raw_ingredients
            ],
            "steps": [
                StepSchema(step_number=s["step_number"], instruction=s["instruction"])
                for s in raw_steps
            ]
        })

    conn.close()
    return results

@router.get("/{recipe_id}", response_model=RecipeResponse)
def get_recipe_by_id(recipe_id: int):
    """Fetches single recipe by ID with ingredients and steps."""
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM recipes WHERE id = ?", (recipe_id,))
    r = cursor.fetchone()
    if not r:
        conn.close()
        raise HTTPException(status_code=404, detail="Recipe not found")

    cursor.execute("SELECT * FROM recipe_ingredients WHERE recipe_id = ?", (recipe_id,))
    raw_ingredients = cursor.fetchall()
    cursor.execute("SELECT * FROM recipe_steps WHERE recipe_id = ? ORDER BY step_number ASC", (recipe_id,))
    raw_steps = cursor.fetchall()
    conn.close()

    return {
        "id": r["id"],
        "title": r["title"],
        "description": r["description"],
        "category": r["category"],
        "cuisine": r["cuisine"],
        "prep_time": r["prep_time"],
        "cook_time": r["cook_time"],
        "servings": r["servings"],
        "difficulty": r["difficulty"],
        "dietary": r["dietary"],
        "calories": r["calories"],
        "image_url": r["image_url"],
        "created_at": str(r["created_at"]),
        "ingredients": [
            IngredientSchema(name=i["name"], quantity=i["quantity"], unit=i["unit"], is_staple=bool(i["is_staple"]))
            for i in raw_ingredients
        ],
        "steps": [
            StepSchema(step_number=s["step_number"], instruction=s["instruction"])
            for s in raw_steps
        ]
    }

@router.post("", response_model=RecipeResponse, status_code=status.HTTP_201_CREATED)
def create_recipe(payload: RecipeCreate):
    """Creates a new leftover recipe with full server-side validation."""
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
    INSERT INTO recipes (title, description, category, cuisine, prep_time, cook_time, servings, difficulty, dietary, calories, image_url)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        payload.title, payload.description, payload.category, payload.cuisine,
        payload.prep_time, payload.cook_time, payload.servings, payload.difficulty.value,
        payload.dietary.value, payload.calories, payload.image_url or "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=800&q=80"
    ))
    recipe_id = cursor.lastrowid

    for ing in payload.ingredients:
        cursor.execute("""
        INSERT INTO recipe_ingredients (recipe_id, name, quantity, unit, is_staple)
        VALUES (?, ?, ?, ?, ?)
        """, (recipe_id, ing.name.lower().strip(), ing.quantity, ing.unit, 1 if ing.is_staple else 0))

    for idx, stp in enumerate(payload.steps, start=1):
        cursor.execute("""
        INSERT INTO recipe_steps (recipe_id, step_number, instruction)
        VALUES (?, ?, ?)
        """, (recipe_id, idx, stp.instruction.strip()))

    conn.commit()
    conn.close()

    return get_recipe_by_id(recipe_id)

@router.delete("/{recipe_id}", status_code=status.HTTP_200_OK)
def delete_recipe(recipe_id: int):
    """Deletes a recipe and cascaded steps/ingredients."""
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT id FROM recipes WHERE id = ?", (recipe_id,))
    if not cursor.fetchone():
        conn.close()
        raise HTTPException(status_code=404, detail="Recipe not found")

    cursor.execute("DELETE FROM recipes WHERE id = ?", (recipe_id,))
    conn.commit()
    conn.close()

    return {"message": f"Recipe {recipe_id} deleted successfully"}
