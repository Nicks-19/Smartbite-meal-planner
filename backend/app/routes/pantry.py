from fastapi import APIRouter, HTTPException, status
from typing import List
from ..database import get_db_connection
from ..models import PantryItemCreate, PantryItemResponse

router = APIRouter(prefix="/api/pantry", tags=["Pantry & Leftovers Inventory"])

@router.get("", response_model=List[PantryItemResponse])
def get_pantry_items():
    """Lists all current leftover and staple ingredients in user's pantry/fridge."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM pantry_items ORDER BY expiry_days ASC, id DESC")
    rows = cursor.fetchall()
    conn.close()

    return [
        {
            "id": r["id"],
            "name": r["name"],
            "category": r["category"],
            "quantity": r["quantity"],
            "expiry_days": r["expiry_days"],
            "added_at": str(r["added_at"])
        }
        for r in rows
    ]

@router.post("", response_model=PantryItemResponse, status_code=status.HTTP_201_CREATED)
def add_pantry_item(item: PantryItemCreate):
    """Adds a new ingredient to pantry inventory with duplicate check / update."""
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT id FROM pantry_items WHERE name = ?", (item.name,))
    existing = cursor.fetchone()

    if existing:
        cursor.execute("""
        UPDATE pantry_items
        SET quantity = ?, expiry_days = ?, category = ?
        WHERE id = ?
        """, (item.quantity, item.expiry_days, item.category, existing["id"]))
        item_id = existing["id"]
    else:
        cursor.execute("""
        INSERT INTO pantry_items (name, category, quantity, expiry_days)
        VALUES (?, ?, ?, ?)
        """, (item.name, item.category, item.quantity, item.expiry_days))
        item_id = cursor.lastrowid

    conn.commit()
    cursor.execute("SELECT * FROM pantry_items WHERE id = ?", (item_id,))
    row = cursor.fetchone()
    conn.close()

    return {
        "id": row["id"],
        "name": row["name"],
        "category": row["category"],
        "quantity": row["quantity"],
        "expiry_days": row["expiry_days"],
        "added_at": str(row["added_at"])
    }

@router.delete("/{item_id}")
def delete_pantry_item(item_id: int):
    """Removes an ingredient from pantry."""
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("DELETE FROM pantry_items WHERE id = ?", (item_id,))
    if cursor.rowcount == 0:
        conn.close()
        raise HTTPException(status_code=404, detail="Pantry item not found")

    conn.commit()
    conn.close()
    return {"message": "Pantry item removed"}
