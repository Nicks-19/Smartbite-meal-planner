from pydantic import BaseModel, Field, field_validator
from typing import List, Optional
from enum import Enum

class DifficultyLevel(str, Enum):
    Easy = "Easy"
    Medium = "Medium"
    Hard = "Hard"

class DietaryPreference(str, Enum):
    Vegetarian = "Vegetarian"
    Vegan = "Vegan"
    Eggitarian = "Eggitarian"
    NonVeg = "Non-Veg"
    GlutenFree = "Gluten-Free"

class DayOfWeek(str, Enum):
    Monday = "Monday"
    Tuesday = "Tuesday"
    Wednesday = "Wednesday"
    Thursday = "Thursday"
    Friday = "Friday"
    Saturday = "Saturday"
    Sunday = "Sunday"

class MealType(str, Enum):
    Breakfast = "Breakfast"
    Lunch = "Lunch"
    Dinner = "Dinner"
    Snack = "Snack"

# ================= Ingredient Schema =================
class IngredientSchema(BaseModel):
    name: str = Field(..., min_length=2, max_length=100, description="Name of the ingredient")
    quantity: str = Field(..., min_length=1, max_length=50, description="Amount/portion")
    unit: str = Field(default="", max_length=30, description="Unit of measurement (cup, tsp, grams, etc.)")
    is_staple: bool = Field(default=False, description="Common pantry staple like salt/water/oil")

    @field_validator("name")
    def clean_name(cls, v: str) -> str:
        clean = v.strip().lower()
        if not clean:
            raise ValueError("Ingredient name cannot be empty or just whitespace")
        return clean

# ================= Cooking Step Schema =================
class StepSchema(BaseModel):
    step_number: int = Field(..., ge=1, description="Sequential step number")
    instruction: str = Field(..., min_length=5, max_length=1000, description="Clear cooking instruction")

# ================= Recipe Schemas =================
class RecipeCreate(BaseModel):
    title: str = Field(..., min_length=3, max_length=120, description="Recipe title")
    description: str = Field(..., min_length=10, max_length=1000, description="Short summary/leftover concept")
    category: str = Field(..., min_length=2, max_length=50, description="E.g., Leftover Rice, Stale Bread, Extra Dal")
    cuisine: str = Field(default="Fusion", min_length=2, max_length=50)
    prep_time: int = Field(..., ge=1, le=240, description="Preparation time in minutes")
    cook_time: int = Field(..., ge=1, le=360, description="Cooking time in minutes")
    servings: int = Field(..., ge=1, le=50, description="Number of servings")
    difficulty: DifficultyLevel
    dietary: DietaryPreference
    calories: int = Field(default=250, ge=0, le=5000, description="Estimated calories per serving")
    image_url: Optional[str] = Field(default="", max_length=500)
    ingredients: List[IngredientSchema] = Field(..., min_items=1, description="Must have at least one ingredient")
    steps: List[StepSchema] = Field(..., min_items=1, description="Must have at least one step")

    @field_validator("title")
    def validate_title(cls, v: str) -> str:
        v_clean = v.strip()
        if len(v_clean) < 3:
            raise ValueError("Title must be at least 3 characters long")
        return v_clean

class RecipeResponse(BaseModel):
    id: int
    title: str
    description: str
    category: str
    cuisine: str
    prep_time: int
    cook_time: int
    servings: int
    difficulty: str
    dietary: str
    calories: int
    image_url: Optional[str]
    created_at: str
    ingredients: List[IngredientSchema] = []
    steps: List[StepSchema] = []

# ================= Matching Schemas =================
class MatchRequest(BaseModel):
    ingredients: List[str] = Field(..., min_items=1, description="List of available leftover ingredients")
    dietary_filter: Optional[str] = Field(default=None, description="Optional filter by dietary preference")
    max_cook_time: Optional[int] = Field(default=None, ge=5, le=180, description="Filter by max cooking time")

    @field_validator("ingredients")
    def validate_ingredients(cls, v: List[str]) -> List[str]:
        cleaned = [item.strip().lower() for item in v if item.strip()]
        if not cleaned:
            raise ValueError("Please provide at least one valid ingredient")
        return cleaned

class MatchedRecipeResponse(RecipeResponse):
    match_percentage: int
    matched_ingredients: List[str]
    missing_ingredients: List[IngredientSchema]
    staples_needed: List[IngredientSchema]

# ================= Pantry Schema =================
class PantryItemCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    category: str = Field(default="Leftover", min_length=2, max_length=50)
    quantity: str = Field(default="1 portion", min_length=1, max_length=50)
    expiry_days: int = Field(default=3, ge=1, le=60)

    @field_validator("name")
    def clean_name(cls, v: str) -> str:
        return v.strip().lower()

class PantryItemResponse(BaseModel):
    id: int
    name: str
    category: str
    quantity: str
    expiry_days: int
    added_at: str

# ================= Meal Plan Schema =================
class MealPlanCreate(BaseModel):
    day_of_week: DayOfWeek
    meal_type: MealType
    recipe_id: int = Field(..., ge=1)
    notes: Optional[str] = Field(default="", max_length=200)

class MealPlanResponse(BaseModel):
    id: int
    day_of_week: str
    meal_type: str
    recipe_id: int
    recipe_title: str
    dietary: str
    prep_time: int
    cook_time: int
    notes: Optional[str]
    created_at: str

# ================= Grocery Checklist Schema =================
class GroceryItemCreate(BaseModel):
    item_name: str = Field(..., min_length=2, max_length=100)
    quantity: str = Field(default="1", max_length=50)
    recipe_id: Optional[int] = None

class AddMissingGroceryRequest(BaseModel):
    recipe_id: int
    missing_items: List[str] = Field(..., min_items=1)

# ================= Waste Log Schema =================
class WasteLogCreate(BaseModel):
    recipe_id: int = Field(..., ge=1)
    food_saved_kg: float = Field(default=0.4, gt=0, le=10.0)
    money_saved_inr: float = Field(default=120.0, ge=0)
