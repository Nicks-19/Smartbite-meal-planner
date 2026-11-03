import sqlite3
import os
from typing import Generator

if os.environ.get("VERCEL"):
    DB_PATH = "/tmp/smartbite.db"
else:
    DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "smartbite.db")

def get_db_connection() -> sqlite3.Connection:
    """Returns a SQLite connection with dict-like row access."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON;")
    return conn

def init_db():
    """Initializes SQLite database tables and indexes."""
    conn = get_db_connection()
    cursor = conn.cursor()

    # Recipes Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS recipes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        category TEXT NOT NULL,
        cuisine TEXT NOT NULL,
        prep_time INTEGER NOT NULL CHECK (prep_time >= 0),
        cook_time INTEGER NOT NULL CHECK (cook_time >= 0),
        servings INTEGER NOT NULL CHECK (servings > 0),
        difficulty TEXT NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
        dietary TEXT NOT NULL CHECK (dietary IN ('Vegetarian', 'Vegan', 'Eggitarian', 'Non-Veg', 'Gluten-Free')),
        calories INTEGER DEFAULT 0 CHECK (calories >= 0),
        image_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # Recipe Ingredients Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS recipe_ingredients (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        recipe_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        quantity TEXT NOT NULL,
        unit TEXT NOT NULL,
        is_staple BOOLEAN DEFAULT 0,
        FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
    );
    """)

    # Recipe Cooking Steps Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS recipe_steps (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        recipe_id INTEGER NOT NULL,
        step_number INTEGER NOT NULL,
        instruction TEXT NOT NULL,
        FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
    );
    """)

    # Pantry Items Table (What user currently has in their fridge/shelf)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS pantry_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL COLLATE NOCASE,
        category TEXT NOT NULL,
        quantity TEXT NOT NULL,
        expiry_days INTEGER DEFAULT 3 CHECK (expiry_days >= 0),
        added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # Meal Plan Table (7-Day schedule)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS meal_plans (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        day_of_week TEXT NOT NULL CHECK (day_of_week IN ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')),
        meal_type TEXT NOT NULL CHECK (meal_type IN ('Breakfast', 'Lunch', 'Dinner', 'Snack')),
        recipe_id INTEGER NOT NULL,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
    );
    """)

    # Smart Grocery Checklist Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS grocery_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        item_name TEXT NOT NULL,
        quantity TEXT DEFAULT '1',
        is_bought BOOLEAN DEFAULT 0,
        recipe_id INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE SET NULL
    );
    """)

    # Food Waste & Cost Savings Tracker Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS waste_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        recipe_id INTEGER NOT NULL,
        food_saved_kg REAL NOT NULL CHECK (food_saved_kg > 0),
        money_saved_inr REAL NOT NULL CHECK (money_saved_inr >= 0),
        logged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
    );
    """)

    # Performance Indexes
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_recipes_category ON recipes(category);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_recipes_dietary ON recipes(dietary);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_ingredients_recipe_id ON recipe_ingredients(recipe_id);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_ingredients_name ON recipe_ingredients(name);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_meal_plans_day ON meal_plans(day_of_week);")

    conn.commit()
    conn.close()
