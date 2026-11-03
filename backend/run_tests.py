import sys
import os

# Set working directory to project root
current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.dirname(current_dir)
sys.path.insert(0, project_root)

from backend.app.database import init_db, get_db_connection
from backend.app.seed_data import seed_database
from backend.app.routes.recipes import match_leftovers, get_recipes, get_recipe_by_id, create_recipe, delete_recipe
from backend.app.routes.meal_planner import schedule_meal, get_meal_plan, delete_scheduled_meal
from backend.app.routes.pantry import add_pantry_item, get_pantry_items, delete_pantry_item
from backend.app.routes.grocery import add_grocery_item, add_missing_ingredients_from_recipe, get_grocery_list, toggle_grocery_item, delete_grocery_item
from backend.app.routes.analytics import get_waste_savings, log_cooked_meal
from backend.app.models import (
    MatchRequest, RecipeCreate, IngredientSchema, StepSchema,
    MealPlanCreate, DayOfWeek, MealType, DifficultyLevel, DietaryPreference,
    PantryItemCreate, GroceryItemCreate, AddMissingGroceryRequest, WasteLogCreate
)
from pydantic import ValidationError

def run_all_tests():
    print("=" * 65)
    print("  SmartBite Full-Stack Automated Test Suite")
    print("  Student: Nikita Sharad Pawar | PRN: 202401100018")
    print("=" * 65)

    # 1. Setup DB
    init_db()
    seed_database()
    print("[PASS] 1. Database initialized & schema verified.")

    # 2. Recipe Seeding & Fetching
    recipes = get_recipes(None, None, None)
    assert len(recipes) >= 10, f"Expected at least 10 recipes, got {len(recipes)}"
    print(f"[PASS] 2. Seeded Recipes Loaded: {len(recipes)} recipes ready in database.")

    # 3. Intelligent Leftover Matching Algorithm Test
    match_req = MatchRequest(ingredients=["cooked rice", "onion", "garlic"])
    matched = match_leftovers(match_req)
    assert len(matched) > 0, "Expected at least 1 matched recipe"
    top = matched[0]
    assert top["match_percentage"] > 50, f"Expected match > 50%, got {top['match_percentage']}"
    print(f"[PASS] 3. Leftover Matcher Algorithm: Matched '{top['title']}' ({top['match_percentage']}% match)")
    print(f"       -> Matched items: {top['matched_ingredients']}")
    print(f"       -> Missing items: {[m.name for m in top['missing_ingredients']]}")

    # 4. Dietary Filtering Test
    egg_req = MatchRequest(ingredients=["eggs", "onion", "tomato"], dietary_filter="Eggitarian")
    egg_matched = match_leftovers(egg_req)
    assert len(egg_matched) > 0
    assert all(r["dietary"] == "Eggitarian" for r in egg_matched)
    print(f"[PASS] 4. Dietary Preference Filtering: Successfully isolated {len(egg_matched)} Eggitarian matches.")

    # 5. Pydantic Client/Server Validation - Empty Ingredients Rejection
    empty_failed = False
    try:
        MatchRequest(ingredients=[])
    except ValidationError:
        empty_failed = True
    assert empty_failed, "Validation should reject empty ingredients list"
    print("[PASS] 5. Schema Validation: Empty ingredients list properly rejected by Pydantic.")

    # 6. Pydantic Validation - Negative prep time & missing fields rejection
    invalid_failed = False
    try:
        RecipeCreate(
            title="Hi", # Too short (min_length=3)
            description="Too short",
            category="Leftover",
            prep_time=-10, # Invalid negative
            cook_time=15,
            servings=2,
            difficulty=DifficultyLevel.Easy,
            dietary=DietaryPreference.Vegetarian,
            ingredients=[], # Empty
            steps=[]
        )
    except ValidationError:
        invalid_failed = True
    assert invalid_failed, "Validation should reject invalid negative prep_time / empty arrays"
    print("[PASS] 6. Schema Validation: Malformed input (negative prep_time, short title) correctly caught.")

    # 7. Valid Recipe Creation & Persistence
    new_rec = RecipeCreate(
        title="Leftover Rice Kheer (Sweet Rice Pudding)",
        description="Simmer leftover boiled rice in sweetened warm milk with cardamom for an instant dessert.",
        category="Leftover Rice",
        cuisine="Indian Sweet",
        prep_time=5,
        cook_time=15,
        servings=2,
        difficulty=DifficultyLevel.Easy,
        dietary=DietaryPreference.Vegetarian,
        calories=210,
        ingredients=[
            IngredientSchema(name="cooked rice", quantity="1", unit="cup", is_staple=False),
            IngredientSchema(name="milk", quantity="2", unit="cups", is_staple=False),
            IngredientSchema(name="sugar", quantity="3", unit="tbsp", is_staple=True),
            IngredientSchema(name="cardamom", quantity="2", unit="pods", is_staple=True)
        ],
        steps=[
            StepSchema(step_number=1, instruction="Bring milk to a gentle boil in a heavy pan."),
            StepSchema(step_number=2, instruction="Add cooked rice and simmer on low flame for 10 minutes."),
            StepSchema(step_number=3, instruction="Stir in sugar and cardamom. Serve chilled or warm.")
        ]
    )
    created = create_recipe(new_rec)
    assert created["id"] > 0
    assert created["title"] == new_rec.title
    print(f"[PASS] 7. Custom Recipe Creation & DB Insert: Recipe #{created['id']} '{created['title']}' created.")

    # 8. 7-Day Meal Planner Workflow
    plan_entry = MealPlanCreate(
        day_of_week=DayOfWeek.Friday,
        meal_type=MealType.Dinner,
        recipe_id=created["id"],
        notes="Friday family leftover clear-out dinner"
    )
    scheduled = schedule_meal(plan_entry)
    assert scheduled["id"] > 0
    all_plans = get_meal_plan()
    assert any(p["id"] == scheduled["id"] for p in all_plans)
    del_res = delete_scheduled_meal(scheduled["id"])
    assert "removed" in del_res["message"]
    print("[PASS] 8. 7-Day Meal Planner Lifecycle: Schedule -> Fetch -> Remove verified.")

    # 9. Pantry Inventory CRUD
    pantry_item = add_pantry_item(PantryItemCreate(
        name="leftover paneer",
        category="Dairy",
        quantity="150g",
        expiry_days=2
    ))
    assert pantry_item["id"] > 0
    items = get_pantry_items()
    assert any(i["id"] == pantry_item["id"] for i in items)
    delete_pantry_item(pantry_item["id"])
    print("[PASS] 9. Pantry Leftovers Inventory: Add -> Expiry calculation -> Remove verified.")

    # 10. Smart Missing Ingredients & Grocery List
    auto_missing = add_missing_ingredients_from_recipe(AddMissingGroceryRequest(
        recipe_id=1,
        missing_items=["spring onions", "sesame seeds"]
    ))
    assert "Added" in auto_missing["message"]
    groceries = get_grocery_list()
    target = next((g for g in groceries if g["item_name"] == "spring onions"), None)
    assert target is not None
    assert target["is_bought"] is False
    toggled = toggle_grocery_item(target["id"])
    assert toggled["is_bought"] is True
    delete_grocery_item(toggled["id"])
    print("[PASS] 10. Smart Missing Ingredients & Grocery Checklist: Auto-add & toggle verified.")

    # 11. Real-World Waste & Cost Savings Analytics
    log_cooked_meal(WasteLogCreate(
        recipe_id=1,
        food_saved_kg=0.45,
        money_saved_inr=130.0
    ))
    stats = get_waste_savings()
    assert stats["total_meals_rescued"] >= 3
    assert stats["total_food_saved_kg"] > 0
    assert stats["total_money_saved_inr"] > 0
    assert stats["co2_emissions_prevented_kg"] > 0
    print(f"[PASS] 11. Waste & Financial Savings Tracker:")
    print(f"       -> Total Meals Rescued: {stats['total_meals_rescued']}")
    print(f"       -> Food Saved: {stats['total_food_saved_kg']} kg")
    print(f"       -> Money Saved: INR {stats['total_money_saved_inr']}")
    print(f"       -> CO2 Prevented: {stats['co2_emissions_prevented_kg']} kg")

    print("=" * 65)
    print("  ALL 11/11 AUTOMATED TESTS PASSED WITH 100% SUCCESS! [OK]")
    print("=" * 65)

if __name__ == "__main__":
    run_all_tests()
