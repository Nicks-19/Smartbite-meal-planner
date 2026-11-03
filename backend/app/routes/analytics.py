from fastapi import APIRouter, status
from pydantic import BaseModel
from ..database import get_db_connection
from ..models import WasteLogCreate

router = APIRouter(prefix="/api/analytics", tags=["Food Waste & Savings Analytics"])

class AnalyticsSummaryResponse(BaseModel):
    total_meals_rescued: int
    total_food_saved_kg: float
    total_money_saved_inr: float
    co2_emissions_prevented_kg: float
    top_rescued_categories: list

@router.get("/waste-savings", response_model=AnalyticsSummaryResponse)
def get_waste_savings():
    """Calculates cumulative food waste diverted, money saved, and carbon footprint reduction."""
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
    SELECT 
        COUNT(id) as total_meals,
        COALESCE(SUM(food_saved_kg), 0) as total_kg,
        COALESCE(SUM(money_saved_inr), 0) as total_inr
    FROM waste_logs
    """)
    totals = cursor.fetchone()

    total_meals = totals["total_meals"] or 0
    total_kg = round(totals["total_kg"] or 0.0, 2)
    total_inr = round(totals["total_inr"] or 0.0, 2)

    # Environmental footprint benchmark: ~2.5 kg CO2e saved per 1 kg food waste diverted
    co2_saved = round(total_kg * 2.5, 2)

    cursor.execute("""
    SELECT r.category, COUNT(w.id) as count
    FROM waste_logs w
    JOIN recipes r ON w.recipe_id = r.id
    GROUP BY r.category
    ORDER BY count DESC
    LIMIT 4
    """)
    category_rows = cursor.fetchall()

    categories = [{"category": row["category"], "count": row["count"]} for row in category_rows]
    conn.close()

    return {
        "total_meals_rescued": total_meals,
        "total_food_saved_kg": total_kg,
        "total_money_saved_inr": total_inr,
        "co2_emissions_prevented_kg": co2_saved,
        "top_rescued_categories": categories
    }

@router.post("/log-cooked", status_code=status.HTTP_201_CREATED)
def log_cooked_meal(payload: WasteLogCreate):
    """Records that a user prepared a meal from leftovers, updating waste reduction impact."""
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
    INSERT INTO waste_logs (recipe_id, food_saved_kg, money_saved_inr)
    VALUES (?, ?, ?)
    """, (payload.recipe_id, payload.food_saved_kg, payload.money_saved_inr))

    conn.commit()
    conn.close()

    return {"message": "Logged meal successfully! Thank you for reducing household food waste."}
