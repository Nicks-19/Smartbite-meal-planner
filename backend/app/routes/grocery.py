from fastapi import APIRouter, HTTPException, status
from typing import List, Optional
from pydantic import BaseModel
from ..database import get_db_connection
from ..models import GroceryItemCreate, AddMissingGroceryRequest

router = APIRouter(prefix="/api/grocery", tags=["Smart Grocery Checklist"])

class GroceryResponse(BaseModel):
    id: int
    item_name: str
    quantity: str
    is_bought: bool
    recipe_id: Optional[int]
    created_at: str

@router.get("", response_model=List[GroceryResponse])
def get_grocery_list():
    """Returns active grocery items with bought/pending status."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM grocery_items ORDER BY is_bought ASC, id DESC")
    rows = cursor.fetchall()
    conn.close()

    return [
        {
            "id": r["id"],
            "item_name": r["item_name"],
            "quantity": r["quantity"],
            "is_bought": bool(r["is_bought"]),
            "recipe_id": r["recipe_id"],
            "created_at": str(r["created_at"])
        }
        for r in rows
    ]

@router.post("", response_model=GroceryResponse, status_code=status.HTTP_201_CREATED)
def add_grocery_item(item: GroceryItemCreate):
    """Adds a manual item to grocery list."""
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
    INSERT INTO grocery_items (item_name, quantity, recipe_id)
    VALUES (?, ?, ?)
    """, (item.item_name.strip(), item.quantity.strip(), item.recipe_id))
    new_id = cursor.lastrowid
    conn.commit()

    cursor.execute("SELECT * FROM grocery_items WHERE id = ?", (new_id,))
    row = cursor.fetchone()
    conn.close()

    return {
        "id": row["id"],
        "item_name": row["item_name"],
        "quantity": row["quantity"],
        "is_bought": bool(row["is_bought"]),
        "recipe_id": row["recipe_id"],
        "created_at": str(row["created_at"])
    }

@router.post("/add-missing", status_code=status.HTTP_201_CREATED)
def add_missing_ingredients_from_recipe(payload: AddMissingGroceryRequest):
    """Automatically adds missing ingredients identified by Leftover Matcher into grocery list."""
    conn = get_db_connection()
    cursor = conn.cursor()

    added_count = 0
    for item in payload.missing_items:
        clean_item = item.strip()
        if clean_item:
            # Check if already present unbought
            cursor.execute("SELECT id FROM grocery_items WHERE LOWER(item_name) = ? AND is_bought = 0", (clean_item.lower(),))
            if not cursor.fetchone():
                cursor.execute("""
                INSERT INTO grocery_items (item_name, quantity, recipe_id)
                VALUES (?, 'As needed', ?)
                """, (clean_item, payload.recipe_id))
                added_count += 1

    conn.commit()
    conn.close()
    return {"message": f"Added {added_count} missing ingredients to grocery checklist"}

@router.patch("/{item_id}/toggle", response_model=GroceryResponse)
def toggle_grocery_item(item_id: int):
    """Toggles purchased status of a grocery item."""
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM grocery_items WHERE id = ?", (item_id,))
    row = cursor.fetchone()
    if not row:
        conn.close()
        raise HTTPException(status_code=404, detail="Grocery item not found")

    new_status = 0 if row["is_bought"] else 1
    cursor.execute("UPDATE grocery_items SET is_bought = ? WHERE id = ?", (new_status, item_id))
    conn.commit()

    cursor.execute("SELECT * FROM grocery_items WHERE id = ?", (item_id,))
    updated = cursor.fetchone()
    conn.close()

    return {
        "id": updated["id"],
        "item_name": updated["item_name"],
        "quantity": updated["quantity"],
        "is_bought": bool(updated["is_bought"]),
        "recipe_id": updated["recipe_id"],
        "created_at": str(updated["created_at"])
    }

@router.delete("/{item_id}")
def delete_grocery_item(item_id: int):
    """Deletes an item from grocery checklist."""
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("DELETE FROM grocery_items WHERE id = ?", (item_id,))
    if cursor.rowcount == 0:
        conn.close()
        raise HTTPException(status_code=404, detail="Grocery item not found")

    conn.commit()
    conn.close()
    return {"message": "Item deleted from grocery checklist"}
