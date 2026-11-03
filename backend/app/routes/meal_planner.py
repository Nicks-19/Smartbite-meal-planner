from fastapi import APIRouter, HTTPException, status
from typing import List
from ..database import get_db_connection
from ..models import MealPlanCreate, MealPlanResponse

router = APIRouter(prefix="/api/meal-plan", tags=["Weekly Leftover Meal Planner"])

@router.get("", response_model=List[MealPlanResponse])
def get_meal_plan():
    """Fetches the 7-day scheduled meal plan with joined recipe details."""
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
    SELECT 
        mp.id, mp.day_of_week, mp.meal_type, mp.recipe_id, mp.notes, mp.created_at,
        r.title as recipe_title, r.dietary, r.prep_time, r.cook_time
    FROM meal_plans mp
    JOIN recipes r ON mp.recipe_id = r.id
    ORDER BY 
        CASE mp.day_of_week
            WHEN 'Monday' THEN 1
            WHEN 'Tuesday' THEN 2
            WHEN 'Wednesday' THEN 3
            WHEN 'Thursday' THEN 4
            WHEN 'Friday' THEN 5
            WHEN 'Saturday' THEN 6
            WHEN 'Sunday' THEN 7
        END,
        CASE mp.meal_type
            WHEN 'Breakfast' THEN 1
            WHEN 'Lunch' THEN 2
            WHEN 'Snack' THEN 3
            WHEN 'Dinner' THEN 4
        END
    """)
    rows = cursor.fetchall()
    conn.close()

    return [
        {
            "id": r["id"],
            "day_of_week": r["day_of_week"],
            "meal_type": r["meal_type"],
            "recipe_id": r["recipe_id"],
            "recipe_title": r["recipe_title"],
            "dietary": r["dietary"],
            "prep_time": r["prep_time"],
            "cook_time": r["cook_time"],
            "notes": r["notes"],
            "created_at": str(r["created_at"])
        }
        for r in rows
    ]

@router.post("", response_model=MealPlanResponse, status_code=status.HTTP_201_CREATED)
def schedule_meal(payload: MealPlanCreate):
    """Schedules a leftover recipe for a specific day and meal type with validation."""
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT id, title, dietary, prep_time, cook_time FROM recipes WHERE id = ?", (payload.recipe_id,))
    recipe = cursor.fetchone()
    if not recipe:
        conn.close()
        raise HTTPException(status_code=404, detail="Target recipe does not exist")

    cursor.execute("""
    INSERT INTO meal_plans (day_of_week, meal_type, recipe_id, notes)
    VALUES (?, ?, ?, ?)
    """, (payload.day_of_week.value, payload.meal_type.value, payload.recipe_id, payload.notes or ""))

    plan_id = cursor.lastrowid
    conn.commit()

    cursor.execute("SELECT created_at FROM meal_plans WHERE id = ?", (plan_id,))
    created_at = cursor.fetchone()["created_at"]
    conn.close()

    return {
        "id": plan_id,
        "day_of_week": payload.day_of_week.value,
        "meal_type": payload.meal_type.value,
        "recipe_id": payload.recipe_id,
        "recipe_title": recipe["title"],
        "dietary": recipe["dietary"],
        "prep_time": recipe["prep_time"],
        "cook_time": recipe["cook_time"],
        "notes": payload.notes,
        "created_at": str(created_at)
    }

@router.delete("/{plan_id}")
def delete_scheduled_meal(plan_id: int):
    """Deletes a scheduled meal from calendar."""
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("DELETE FROM meal_plans WHERE id = ?", (plan_id,))
    if cursor.rowcount == 0:
        conn.close()
        raise HTTPException(status_code=404, detail="Meal plan entry not found")

    conn.commit()
    conn.close()
    return {"message": "Scheduled meal entry removed"}
