# SmartBite — Smart Leftover Meal Planner & Zero-Waste Kitchen

[![Python](https://img.shields.io/badge/Python-3.12-blue.svg?logo=python)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688.svg?logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18.3-61DAFB.svg?logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF.svg?logo=vite)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC.svg?logo=tailwind-css)](https://tailwindcss.com)
[![SQLite](https://img.shields.io/badge/Database-SQLite3-003B57.svg?logo=sqlite)](https://sqlite.org)
[![Tests](https://img.shields.io/badge/Automated%20Tests-11%2F11%20Passed-10B981.svg)]()

### Academic Project Details
- **Student Name:** Nikita Sharad Pawar
- **PRN:** 202401100018
- **Project Type:** Individual Full-Stack Mini Project
- **Submission Requirements:** `202401100018_Nikita_Sharad_Pawar_Project.pdf` & `202401100018_Nikita_Sharad_Pawar_Project.zip`

---

## 📌 1. Real-World Problem Statement
According to the **United Nations Food Waste Index**, households generate **over 60% of all food waste**, discarding between **30% and 40% of leftover cooked foods** (such as cooked rice, leftover dal/curries, dry rotis, and boiled vegetables). 

Most households throw away edible food simply due to **lack of recipe inspiration**—not knowing what quick meals can be assembled with random odds and ends without buying additional groceries.

### The Solution: SmartBite
**SmartBite** is an individual full-stack web application designed to eliminate domestic food waste:
1. **Leftover Matching Engine:** Users enter whatever cooked food or pantry items they have, and the system computes recipe match percentages (e.g., 100% ready to cook, 75% match with 1 missing item).
2. **Missing Ingredients & Grocery Auto-List:** Identifies missing items and allows 1-click addition to a smart shopping checklist.
3. **7-Day Meal Scheduler:** Plan weekly leftover repurposing from Monday to Sunday.
4. **Fridge & Pantry Expiry Tracker:** Visual indicators for items nearing expiration.
5. **Impact & Cost Savings Tracker:** Quantifies food waste diverted in kg, money saved in INR, and carbon footprint (CO₂e) averted.

---

## 🚀 2. Quick Start & Execution

### Option A: One-Click Runner (Windows)
Double-click `run.bat` in the project root. It will:
- Initialize the SQLite database and seed 10+ realistic leftover recipes.
- Launch the unified Full-Stack server on `http://127.0.0.1:8000`.
- Automatically open your default browser.

### Option B: Manual Command Line
```bash
# 1. Install Python requirements
pip install -r backend/requirements.txt

# 2. Run automated verification test suite
python backend/run_tests.py

# 3. Start unified server
python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
```
Open **[http://127.0.0.1:8000](http://127.0.0.1:8000)** in your browser.

---

## 🛠️ 3. Technologies Used

| Tier | Technology | Purpose & Rationale |
| :--- | :--- | :--- |
| **Frontend** | React 18, Vite | Component-driven UI, state management, instant HMR |
| **Styling** | Tailwind CSS | Modern responsive cards, badges, and glassmorphic modals |
| **Backend** | Python, FastAPI | Asynchronous REST APIs, native Pydantic validation, OpenAPI Swagger |
| **Database** | SQLite 3 | Serverless, zero-install relational database, ACID-compliant, portable |
| **Validation** | Pydantic v2 (Server) + React State (Client) | Multi-tier input validation, string constraints, and Enum enforcement |
| **Testing** | Custom Test Runner & Pytest | 11 comprehensive automated tests covering all endpoints and edge cases |

---

## 🗄️ 4. Relational Database Schema

The SQLite database (`smartbite.db`) consists of 7 relational tables:

1. **`recipes`**: Stores master recipe metadata (`id`, `title`, `description`, `category`, `cuisine`, `prep_time`, `cook_time`, `servings`, `difficulty`, `dietary`, `calories`, `image_url`).
2. **`recipe_ingredients`**: Foreign key to `recipes(id)` with `ON DELETE CASCADE`. Stores ingredient name, quantity, unit, and `is_staple` flag.
3. **`recipe_steps`**: Foreign key to `recipes(id)` with `ON DELETE CASCADE`. Stores `step_number` and detailed `instruction`.
4. **`pantry_items`**: User's current fridge leftovers with `name`, `category`, `quantity`, and `expiry_days`.
5. **`meal_plans`**: 7-day calendar schedule linked to `recipes(id)` with `day_of_week`, `meal_type` (Breakfast, Lunch, Dinner, Snack), and notes.
6. **`grocery_items`**: Smart checklist with `item_name`, `quantity`, `is_bought` boolean toggle.
7. **`waste_logs`**: Environmental tracker recording `recipe_id`, `food_saved_kg`, and `money_saved_inr`.

---

## 🛡️ 5. Two-Tier Validation Architecture

### Client-Side Validation (React)
- **Immediate Input Feedback:** Empty field detection, length checks (title ≥ 3 chars, description ≥ 10 chars).
- **Duplicate Prevention:** Prevents entering the same ingredient tag multiple times in the Leftover Matcher.
- **Dynamic Array Validation:** Requires at least one valid ingredient and one step before submission.
- **Visual Error Indicators:** Red borders, contextual error messages, and disabled submit states while processing.

### Server-Side Validation (FastAPI & Pydantic)
- **Strict Data Types:** Enforced string lengths, integer bounds (`ge=1`), positive cook times.
- **Enumerations:** `DifficultyLevel` ('Easy', 'Medium', 'Hard'), `DietaryPreference` ('Vegetarian', 'Vegan', 'Eggitarian', 'Non-Veg', 'Gluten-Free'), `DayOfWeek`, `MealType`.
- **String Sanitization:** Automatic trimming and lowercase normalization for ingredient names.
- **HTTP 422 Handling:** Returns standardized, actionable error payloads when malformed data is sent.

---

## 📡 6. REST API Endpoints

Interactive Swagger UI available at: `http://127.0.0.1:8000/docs`

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/recipes/match` | Leftover matching algorithm (ranks recipes by % match) |
| `GET` | `/api/recipes` | List all recipes with category & dietary query filters |
| `GET` | `/api/recipes/{id}` | Detailed recipe with ingredients and cooking steps |
| `POST` | `/api/recipes` | Create custom leftover recipe (validated with Pydantic) |
| `DELETE`| `/api/recipes/{id}` | Delete recipe and cascading steps/ingredients |
| `GET` | `/api/pantry` | List user's current fridge & pantry inventory |
| `POST` | `/api/pantry` | Add or update leftover item in fridge |
| `DELETE`| `/api/pantry/{id}` | Remove item from pantry |
| `GET` | `/api/meal-plan` | Get 7-day scheduled meal plans |
| `POST` | `/api/meal-plan` | Assign recipe to a weekday meal slot |
| `DELETE`| `/api/meal-plan/{id}`| Remove meal from schedule |
| `GET` | `/api/grocery` | Fetch smart grocery checklist |
| `POST` | `/api/grocery/add-missing` | Auto-add missing ingredients from matched recipe |
| `PATCH` | `/api/grocery/{id}/toggle` | Toggle bought/pending status |
| `GET` | `/api/analytics/waste-savings` | Calculate total kg food saved, money saved (INR), CO₂e |
| `POST` | `/api/analytics/log-cooked` | Record cooked meal to update waste impact metrics |

---

## 🧪 7. Automated Verification Results
Run the automated test suite:
```bash
python backend/run_tests.py
```
**Results:** `11/11 Passed (100% Success)`
- ✅ Database Schema & Foreign Key Constraints
- ✅ Seed Data Persistence (10+ realistic recipes)
- ✅ Matching Algorithm Precision & Normalization
- ✅ Dietary Preference Filtering
- ✅ Pydantic HTTP 422 Rejection on Empty/Negative Fields
- ✅ 7-Day Meal Planning Lifecycle
- ✅ Pantry Expiry Calculation
- ✅ Smart Grocery Checklist Auto-Add & Toggle
- ✅ Environmental & Financial Savings Computations

---

## 🎓 8. Teacher Viva & Presentation Guide
A live **"Teacher Viva Guide"** button is built into the top navigation bar of the application. It contains:
- 2-Minute structured presentation script.
- Answers to common examiner questions (database choice, validation defense, matching algorithm logic).
