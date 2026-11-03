import pytest
from fastapi.testclient import TestClient
import os
import sys

# Ensure backend directory is in path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

from backend.app.main import app
from backend.app.database import init_db
from backend.app.seed_data import seed_database

client = TestClient(app)

@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    init_db()
    seed_database()

def test_health_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"
    assert data["developer"]["name"] == "Nikita Sharad Pawar"
    assert data["developer"]["prn"] == "202401100018"

def test_recipes_list_seeded():
    response = client.get("/api/recipes")
    assert response.status_code == 200
    recipes = response.json()
    assert len(recipes) >= 10
    assert any(r["title"] == "Indo-Chinese Fried Rice" for r in recipes)

def test_leftover_matching_algorithm():
    # User provides leftovers: cooked rice, onion, garlic
    payload = {
        "ingredients": ["cooked rice", "onion", "garlic"]
    }
    response = client.post("/api/recipes/match", json=payload)
    assert response.status_code == 200
    matched = response.json()
    assert len(matched) > 0

    top_recipe = matched[0]
    # The top recipe should be one using rice and onion
    assert "Fried Rice" in top_recipe["title"] or "Cutlets" in top_recipe["title"]
    assert top_recipe["match_percentage"] > 50
    assert "cooked rice" in [i.lower() for i in top_recipe["matched_ingredients"]]
    assert len(top_recipe["missing_ingredients"]) >= 0

def test_leftover_matching_with_dietary_filter():
    payload = {
        "ingredients": ["eggs", "onion", "tomato"],
        "dietary_filter": "Eggitarian"
    }
    response = client.post("/api/recipes/match", json=payload)
    assert response.status_code == 200
    results = response.json()
    assert len(results) > 0
    assert all(r["dietary"] == "Eggitarian" for r in results)

def test_validation_rejects_empty_ingredients():
    payload = {
        "ingredients": []
    }
    response = client.post("/api/recipes/match", json=payload)
    # Pydantic validation failure returns HTTP 422
    assert response.status_code == 422

def test_validation_recipe_creation_invalid_data():
    invalid_recipe = {
        "title": "AB", # Too short (min_length=3)
        "description": "Short", # Too short (min_length=10)
        "category": "Test",
        "cuisine": "Test",
        "prep_time": -5, # Negative time (invalid)
        "cook_time": 0,  # ge=1
        "servings": 0,   # ge=1
        "difficulty": "Impossible", # Not in Enum
        "dietary": "Unknown",       # Not in Enum
        "ingredients": [],          # min_items=1
        "steps": []                 # min_items=1
    }
    response = client.post("/api/recipes", json=invalid_recipe)
    assert response.status_code == 422

def test_valid_recipe_creation_and_retrieval():
    new_recipe = {
        "title": "Leftover Rice Kheer (Sweet Pudding)",
        "description": "Simmer leftover boiled rice in sweetened warm milk with cardamom for a royal dessert.",
        "category": "Leftover Rice",
        "cuisine": "Indian Sweet",
        "prep_time": 5,
        "cook_time": 15,
        "servings": 2,
        "difficulty": "Easy",
        "dietary": "Vegetarian",
        "calories": 210,
        "ingredients": [
            {"name": "cooked rice", "quantity": "1", "unit": "cup", "is_staple": False},
            {"name": "milk", "quantity": "2", "unit": "cups", "is_staple": False},
            {"name": "sugar", "quantity": "3", "unit": "tbsp", "is_staple": True},
            {"name": "cardamom", "quantity": "2", "unit": "pods", "is_staple": True}
        ],
        "steps": [
            {"step_number": 1, "instruction": "Bring milk to a gentle boil in a heavy bottomed pan."},
            {"step_number": 2, "instruction": "Add cooked rice and simmer on low flame for 10 minutes, mashing grains slightly."},
            {"step_number": 3, "instruction": "Stir in sugar and crushed cardamom. Serve chilled or warm."}
        ]
    }
    response = client.post("/api/recipes", json=new_recipe)
    assert response.status_code == 201
    created = response.json()
    assert created["id"] > 0
    assert created["title"] == "Leftover Rice Kheer (Sweet Pudding)"
    assert len(created["ingredients"]) == 4

def test_meal_planner_flow():
    # Schedule meal
    plan_data = {
        "day_of_week": "Wednesday",
        "meal_type": "Dinner",
        "recipe_id": 1,
        "notes": "Wednesday family leftover dinner"
    }
    res = client.post("/api/meal-plan", json=plan_data)
    assert res.status_code == 201
    plan_obj = res.json()
    assert plan_obj["day_of_week"] == "Wednesday"
    assert plan_obj["recipe_title"] != ""

    # Get meal plan
    get_res = client.get("/api/meal-plan")
    assert get_res.status_code == 200
    plans = get_res.json()
    assert any(p["id"] == plan_obj["id"] for p in plans)

    # Delete meal plan entry
    del_res = client.delete(f"/api/meal-plan/{plan_obj['id']}")
    assert del_res.status_code == 200

def test_pantry_crud():
    # Add item
    add_res = client.post("/api/pantry", json={
        "name": "leftover paneer",
        "category": "Dairy",
        "quantity": "150g",
        "expiry_days": 2
    })
    assert add_res.status_code == 201
    item = add_res.json()
    assert item["name"] == "leftover paneer"

    # List items
    list_res = client.get("/api/pantry")
    assert list_res.status_code == 200
    assert any(i["id"] == item["id"] for i in list_res.json())

    # Delete item
    del_res = client.delete(f"/api/pantry/{item['id']}")
    assert del_res.status_code == 200

def test_grocery_toggle_and_auto_add():
    # Add missing items
    auto_res = client.post("/api/grocery/add-missing", json={
        "recipe_id": 1,
        "missing_items": ["fresh spring onions", "sesame oil"]
    })
    assert auto_res.status_code == 201

    # List items
    g_res = client.get("/api/grocery")
    items = g_res.json()
    target = next((i for i in items if i["item_name"] == "fresh spring onions"), None)
    assert target is not None
    assert target["is_bought"] is False

    # Toggle bought
    toggle_res = client.patch(f"/api/grocery/{target['id']}/toggle")
    assert toggle_res.status_code == 200
    assert toggle_res.json()["is_bought"] is True

def test_analytics_impact():
    res = client.get("/api/analytics/waste-savings")
    assert res.status_code == 200
    data = res.json()
    assert data["total_meals_rescued"] >= 3
    assert data["total_food_saved_kg"] > 0
    assert data["total_money_saved_inr"] > 0
    assert data["co2_emissions_prevented_kg"] > 0
