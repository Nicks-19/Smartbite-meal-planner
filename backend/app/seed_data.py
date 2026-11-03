from .database import get_db_connection

SEED_RECIPES = [
    {
        "title": "Indo-Chinese Fried Rice",
        "description": "Transform cold, leftover cooked rice into a fragrant, restaurant-style wok-tossed fried rice in 12 minutes.",
        "category": "Leftover Rice",
        "cuisine": "Indo-Chinese",
        "prep_time": 5,
        "cook_time": 10,
        "servings": 2,
        "difficulty": "Easy",
        "dietary": "Vegetarian",
        "calories": 310,
        "image_url": "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=800&q=80",
        "ingredients": [
            {"name": "cooked rice", "quantity": "2", "unit": "cups", "is_staple": False},
            {"name": "onion", "quantity": "1", "unit": "medium, chopped", "is_staple": False},
            {"name": "garlic", "quantity": "4", "unit": "cloves, minced", "is_staple": False},
            {"name": "carrot", "quantity": "1", "unit": "diced", "is_staple": False},
            {"name": "soy sauce", "quantity": "1.5", "unit": "tbsp", "is_staple": True},
            {"name": "green chilli", "quantity": "2", "unit": "slit", "is_staple": False},
            {"name": "cooking oil", "quantity": "2", "unit": "tbsp", "is_staple": True},
            {"name": "black pepper", "quantity": "0.5", "unit": "tsp", "is_staple": True},
            {"name": "salt", "quantity": "0.5", "unit": "tsp", "is_staple": True}
        ],
        "steps": [
            {"step_number": 1, "instruction": "Gently crumble cold leftover rice with clean fingers or a fork so the grains are separate."},
            {"step_number": 2, "instruction": "Heat oil in a wide pan or wok on high heat. Add minced garlic, green chillies, and onions; stir-fry for 1 minute until fragrant."},
            {"step_number": 3, "instruction": "Toss in diced carrots and any leftover vegetables. Stir-fry briskly for 2 minutes on high flame to retain crunch."},
            {"step_number": 4, "instruction": "Add the leftover rice, drizzle soy sauce, sprinkle black pepper and salt. Toss vigorously for 3 minutes until steaming hot and well mixed."},
            {"step_number": 5, "instruction": "Serve immediately garnished with spring onions or fresh coriander."}
        ]
    },
    {
        "title": "Protein-Rich Leftover Dal Paratha",
        "description": "Never throw away surplus cooked dal! Knead it with whole wheat flour for fluffy, nutrient-dense spiced flatbreads.",
        "category": "Leftover Dal",
        "cuisine": "Indian",
        "prep_time": 10,
        "cook_time": 12,
        "servings": 3,
        "difficulty": "Easy",
        "dietary": "Vegetarian",
        "calories": 220,
        "image_url": "https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=800&q=80",
        "ingredients": [
            {"name": "leftover dal", "quantity": "1", "unit": "cup", "is_staple": False},
            {"name": "wheat flour", "quantity": "2", "unit": "cups", "is_staple": True},
            {"name": "onion", "quantity": "1", "unit": "finely chopped", "is_staple": False},
            {"name": "green chilli", "quantity": "1", "unit": "finely chopped", "is_staple": False},
            {"name": "ajwain", "quantity": "0.5", "unit": "tsp", "is_staple": True},
            {"name": "coriander leaves", "quantity": "2", "unit": "tbsp, chopped", "is_staple": False},
            {"name": "ghee or oil", "quantity": "1.5", "unit": "tbsp", "is_staple": True},
            {"name": "salt", "quantity": "0.5", "unit": "tsp", "is_staple": True}
        ],
        "steps": [
            {"step_number": 1, "instruction": "In a mixing bowl, combine whole wheat flour, chopped onion, green chillies, ajwain, coriander leaves, and salt."},
            {"step_number": 2, "instruction": "Pour the leftover dal into the flour. Knead into a soft, smooth dough without adding extra water (add water only if dough is too dry). Let rest 5 minutes."},
            {"step_number": 3, "instruction": "Divide into lemon-sized balls. Roll each ball into a circular flat disc using a rolling pin."},
            {"step_number": 4, "instruction": "Heat a tawa / griddle. Roast the paratha on both sides with a brushing of ghee or oil until golden-brown spots appear."},
            {"step_number": 5, "instruction": "Serve piping hot with curd, pickle, or green chutney."}
        ]
    },
    {
        "title": "Crispy Leftover Rice & Potato Cutlets",
        "description": "Crispy outside, soft inside tea-time snacks crafted from cold cooked rice and leftover boiled potatoes.",
        "category": "Leftover Rice",
        "cuisine": "Indian Snacks",
        "prep_time": 10,
        "cook_time": 10,
        "servings": 4,
        "difficulty": "Easy",
        "dietary": "Vegetarian",
        "calories": 260,
        "image_url": "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&w=800&q=80",
        "ingredients": [
            {"name": "cooked rice", "quantity": "1.5", "unit": "cups", "is_staple": False},
            {"name": "boiled potato", "quantity": "2", "unit": "medium, mashed", "is_staple": False},
            {"name": "onion", "quantity": "1", "unit": "finely chopped", "is_staple": False},
            {"name": "ginger", "quantity": "1", "unit": "tsp, grated", "is_staple": False},
            {"name": "garam masala", "quantity": "0.5", "unit": "tsp", "is_staple": True},
            {"name": "red chilli powder", "quantity": "0.5", "unit": "tsp", "is_staple": True},
            {"name": "cornflour or breadcrumbs", "quantity": "2", "unit": "tbsp", "is_staple": True},
            {"name": "cooking oil", "quantity": "2", "unit": "tbsp for shallow frying", "is_staple": True},
            {"name": "salt", "quantity": "0.75", "unit": "tsp", "is_staple": True}
        ],
        "steps": [
            {"step_number": 1, "instruction": "Mash the cold leftover rice slightly with a fork or potato masher in a deep bowl."},
            {"step_number": 2, "instruction": "Add mashed boiled potato, chopped onion, ginger, garam masala, red chilli powder, cornflour, and salt. Mix thoroughly into a cohesive mixture."},
            {"step_number": 3, "instruction": "Shape into round flat patties or cutlets with greased hands."},
            {"step_number": 4, "instruction": "Heat 2 tablespoons of oil in a shallow pan. Shallow fry patties over medium flame for 3-4 minutes each side until deeply golden and crispy."},
            {"step_number": 5, "instruction": "Drain on kitchen paper and serve with tangy tomato ketchup or mint chutney."}
        ]
    },
    {
        "title": "Chilli Garlic Chapati Noodles",
        "description": "A genius, kid-approved hack turning dry day-old rotis into saucy, spicy wok-style street noodles.",
        "category": "Leftover Roti",
        "cuisine": "Indo-Chinese",
        "prep_time": 5,
        "cook_time": 8,
        "servings": 2,
        "difficulty": "Easy",
        "dietary": "Vegetarian",
        "calories": 240,
        "image_url": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80",
        "ingredients": [
            {"name": "leftover roti", "quantity": "4", "unit": "chapatis", "is_staple": False},
            {"name": "onion", "quantity": "1", "unit": "sliced thinly", "is_staple": False},
            {"name": "capsicum", "quantity": "1", "unit": "sliced", "is_staple": False},
            {"name": "garlic", "quantity": "5", "unit": "cloves, chopped", "is_staple": False},
            {"name": "tomato ketchup", "quantity": "2", "unit": "tbsp", "is_staple": True},
            {"name": "soy sauce", "quantity": "1", "unit": "tbsp", "is_staple": True},
            {"name": "chilli sauce", "quantity": "1", "unit": "tsp", "is_staple": True},
            {"name": "cooking oil", "quantity": "1.5", "unit": "tbsp", "is_staple": True},
            {"name": "salt", "quantity": "0.25", "unit": "tsp", "is_staple": True}
        ],
        "steps": [
            {"step_number": 1, "instruction": "Stack the leftover chapatis, roll them tightly into a cylinder, and slice horizontally into thin noodle-like ribbons using a knife."},
            {"step_number": 2, "instruction": "Heat oil in a pan. Sauté chopped garlic and sliced onions on high flame for 1 minute."},
            {"step_number": 3, "instruction": "Add capsicum strips and toss for another minute until half-cooked and crunchy."},
            {"step_number": 4, "instruction": "Whisk ketchup, soy sauce, and chilli sauce together; pour into the pan with 2 tablespoons of water."},
            {"step_number": 5, "instruction": "Toss in the chapati noodle strips. Stir continuously for 2 minutes until the sauces coat the ribbons evenly. Serve hot!"}
        ]
    },
    {
        "title": "Masala Bread Upma",
        "description": "Rescue hard or stale bread ends into a comforting, savory breakfast tempered with mustard seeds and crunchy peanuts.",
        "category": "Stale Bread",
        "cuisine": "South Indian",
        "prep_time": 5,
        "cook_time": 8,
        "servings": 2,
        "difficulty": "Easy",
        "dietary": "Vegetarian",
        "calories": 275,
        "image_url": "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80",
        "ingredients": [
            {"name": "bread", "quantity": "5", "unit": "slices, cubed", "is_staple": False},
            {"name": "onion", "quantity": "1", "unit": "chopped", "is_staple": False},
            {"name": "tomato", "quantity": "1", "unit": "chopped", "is_staple": False},
            {"name": "green chilli", "quantity": "1", "unit": "chopped", "is_staple": False},
            {"name": "peanuts", "quantity": "2", "unit": "tbsp", "is_staple": False},
            {"name": "mustard seeds", "quantity": "0.5", "unit": "tsp", "is_staple": True},
            {"name": "turmeric", "quantity": "0.25", "unit": "tsp", "is_staple": True},
            {"name": "cooking oil", "quantity": "1.5", "unit": "tbsp", "is_staple": True},
            {"name": "salt", "quantity": "0.5", "unit": "tsp", "is_staple": True}
        ],
        "steps": [
            {"step_number": 1, "instruction": "Cut or tear leftover stale bread slices into bite-sized cubes."},
            {"step_number": 2, "instruction": "Heat oil in a kadai. Add mustard seeds and peanuts; fry peanuts until golden brown and crackling."},
            {"step_number": 3, "instruction": "Add chopped onions and green chilli; cook until onions turn translucent."},
            {"step_number": 4, "instruction": "Add chopped tomato, turmeric, and salt. Cook until tomatoes soften into a juicy masala base."},
            {"step_number": 5, "instruction": "Sprinkle bread cubes with a splash of water, fold into the tomato masala, toss on low heat for 2 minutes, and enjoy!"}
        ]
    },
    {
        "title": "Street-Style Anda Bhurji (Egg Scramble)",
        "description": "A lightning-fast, high-protein meal made with pantry staple eggs, onions, and ripe tomatoes.",
        "category": "Quick Bites",
        "cuisine": "Indian Street Food",
        "prep_time": 5,
        "cook_time": 7,
        "servings": 2,
        "difficulty": "Easy",
        "dietary": "Eggitarian",
        "calories": 210,
        "image_url": "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80",
        "ingredients": [
            {"name": "eggs", "quantity": "3", "unit": "large eggs", "is_staple": False},
            {"name": "onion", "quantity": "1", "unit": "finely chopped", "is_staple": False},
            {"name": "tomato", "quantity": "1", "unit": "finely chopped", "is_staple": False},
            {"name": "green chilli", "quantity": "2", "unit": "chopped", "is_staple": False},
            {"name": "turmeric", "quantity": "0.25", "unit": "tsp", "is_staple": True},
            {"name": "red chilli powder", "quantity": "0.5", "unit": "tsp", "is_staple": True},
            {"name": "butter or oil", "quantity": "1.5", "unit": "tbsp", "is_staple": True},
            {"name": "salt", "quantity": "0.5", "unit": "tsp", "is_staple": True}
        ],
        "steps": [
            {"step_number": 1, "instruction": "Whisk 3 eggs with a pinch of salt and a tablespoon of milk or water in a bowl until lightly frothy."},
            {"step_number": 2, "instruction": "Melt butter or heat oil in a pan. Sauté chopped onions and green chillies until lightly golden."},
            {"step_number": 3, "instruction": "Add chopped tomatoes, turmeric, and red chilli powder. Sauté for 2 minutes until soft and mushy."},
            {"step_number": 4, "instruction": "Pour in the whisked eggs on medium-low flame. Gently fold and scramble with a spatula until soft curds form."},
            {"step_number": 5, "instruction": "Remove while still moist. Serve with toasted leftover bread or hot chapatis."}
        ]
    },
    {
        "title": "Crispy Khichdi Handvo (Savory Cake)",
        "description": "Turn soggy leftover khichdi into a golden, sesame-crusted pan cake with a spoonful of gram flour (besan).",
        "category": "Leftover Dal",
        "cuisine": "Gujarati",
        "prep_time": 8,
        "cook_time": 12,
        "servings": 2,
        "difficulty": "Medium",
        "dietary": "Vegetarian",
        "calories": 280,
        "image_url": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
        "ingredients": [
            {"name": "leftover khichdi", "quantity": "1.5", "unit": "cups", "is_staple": False},
            {"name": "besan", "quantity": "3", "unit": "tbsp", "is_staple": True},
            {"name": "ginger", "quantity": "1", "unit": "tsp, grated", "is_staple": False},
            {"name": "green chilli", "quantity": "1", "unit": "minced", "is_staple": False},
            {"name": "mustard seeds", "quantity": "0.5", "unit": "tsp", "is_staple": True},
            {"name": "sesame seeds", "quantity": "1", "unit": "tbsp", "is_staple": True},
            {"name": "cooking oil", "quantity": "2", "unit": "tbsp", "is_staple": True},
            {"name": "salt", "quantity": "0.25", "unit": "tsp", "is_staple": True}
        ],
        "steps": [
            {"step_number": 1, "instruction": "In a bowl, combine leftover khichdi, besan (gram flour), grated ginger, green chillies, and a pinch of salt. Mix into a thick batter."},
            {"step_number": 2, "instruction": "Heat 1 tablespoon oil in a non-stick pan. Add mustard seeds and sesame seeds; let them splutter."},
            {"step_number": 3, "instruction": "Spread the khichdi batter evenly over the seeds like a thick savory pancake."},
            {"step_number": 4, "instruction": "Cover with a lid and cook on low heat for 5-6 minutes until the bottom is crispy and deep golden."},
            {"step_number": 5, "instruction": "Carefully flip, drizzle remaining oil around edges, and crisp the other side for 4 minutes. Cut into wedges."}
        ]
    },
    {
        "title": "Leftover Sabzi Grilled Toastie",
        "description": "Have 2 spoons of leftover dry paneer, potato, or mixed veg curry? Transform it into a gourmet grilled cheese sandwich.",
        "category": "Leftover Sabzi",
        "cuisine": "Fusion",
        "prep_time": 5,
        "cook_time": 6,
        "servings": 1,
        "difficulty": "Easy",
        "dietary": "Vegetarian",
        "calories": 340,
        "image_url": "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80",
        "ingredients": [
            {"name": "bread", "quantity": "2", "unit": "slices", "is_staple": False},
            {"name": "leftover sabzi", "quantity": "0.5", "unit": "cup (paneer/potato/veg)", "is_staple": False},
            {"name": "cheese", "quantity": "1", "unit": "slice or 2 tbsp grated", "is_staple": False},
            {"name": "butter", "quantity": "1", "unit": "tbsp", "is_staple": True},
            {"name": "black pepper", "quantity": "0.25", "unit": "tsp", "is_staple": True}
        ],
        "steps": [
            {"step_number": 1, "instruction": "Mash leftover sabzi lightly so large chunks don't slip out during grilling."},
            {"step_number": 2, "instruction": "Spread the sabzi mixture evenly over one slice of bread. Place a cheese slice on top and dust with cracked black pepper."},
            {"step_number": 3, "instruction": "Cover with the second bread slice and butter the outer sides generously."},
            {"step_number": 4, "instruction": "Toast on a hot skillet or sandwich maker on medium-low heat until crunchy, golden-brown, and cheese has melted."},
            {"step_number": 5, "instruction": "Slice diagonally and serve warm with ketchup."}
        ]
    },
    {
        "title": "Zero-Waste Tomato Pasta Soup",
        "description": "Turn odd ends of leftover cooked pasta and softening tomatoes into an Italian-style soul-warming rustic minestrone.",
        "category": "Leftover Pasta",
        "cuisine": "Italian",
        "prep_time": 5,
        "cook_time": 10,
        "servings": 2,
        "difficulty": "Easy",
        "dietary": "Vegetarian",
        "calories": 215,
        "image_url": "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80",
        "ingredients": [
            {"name": "cooked pasta", "quantity": "1.5", "unit": "cups", "is_staple": False},
            {"name": "tomato", "quantity": "2", "unit": "pureed or chopped", "is_staple": False},
            {"name": "garlic", "quantity": "3", "unit": "cloves, sliced", "is_staple": False},
            {"name": "onion", "quantity": "0.5", "unit": "chopped", "is_staple": False},
            {"name": "mixed herbs", "quantity": "0.5", "unit": "tsp oregano/thyme", "is_staple": True},
            {"name": "olive oil or butter", "quantity": "1", "unit": "tbsp", "is_staple": True},
            {"name": "black pepper", "quantity": "0.5", "unit": "tsp", "is_staple": True},
            {"name": "salt", "quantity": "0.5", "unit": "tsp", "is_staple": True}
        ],
        "steps": [
            {"step_number": 1, "instruction": "Heat olive oil or butter in a pot. Sauté garlic and onion until aromatic and translucent."},
            {"step_number": 2, "instruction": "Add tomato puree, salt, black pepper, and dried herbs. Simmer for 4 minutes until the raw tomato aroma is gone."},
            {"step_number": 3, "instruction": "Pour in 1.5 cups of water or vegetable broth. Bring to a rolling boil."},
            {"step_number": 4, "instruction": "Add the leftover cooked pasta and simmer for 2-3 minutes so pasta absorbs the rich tomato herb broth."},
            {"step_number": 5, "instruction": "Ladle into bowls and top with chili flakes or grated cheese if available."}
        ]
    },
    {
        "title": "Golden Banana Leftover Pancakes",
        "description": "Rescue overripe brown bananas with milk and flour to create naturally sweet, fluffy breakfast pancakes without refined sugar.",
        "category": "Ripe Fruit",
        "cuisine": "American",
        "prep_time": 5,
        "cook_time": 8,
        "servings": 2,
        "difficulty": "Easy",
        "dietary": "Vegetarian",
        "calories": 240,
        "image_url": "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=800&q=80",
        "ingredients": [
            {"name": "ripe banana", "quantity": "2", "unit": "medium, mashed", "is_staple": False},
            {"name": "wheat flour", "quantity": "1", "unit": "cup", "is_staple": True},
            {"name": "milk", "quantity": "0.75", "unit": "cup", "is_staple": False},
            {"name": "baking powder", "quantity": "0.5", "unit": "tsp", "is_staple": True},
            {"name": "cinnamon", "quantity": "0.25", "unit": "tsp", "is_staple": True},
            {"name": "butter", "quantity": "1", "unit": "tbsp for pan", "is_staple": True}
        ],
        "steps": [
            {"step_number": 1, "instruction": "Peel and vigorously mash overripe bananas with a fork in a bowl until liquefied."},
            {"step_number": 2, "instruction": "Pour in milk, then whisk in wheat flour, cinnamon, and baking powder until a thick batter forms."},
            {"step_number": 3, "instruction": "Grease a pan with butter on medium flame. Pour 1/4 cup of batter per pancake."},
            {"step_number": 4, "instruction": "Cook for 2-3 minutes until bubbles burst on the surface; flip and cook the other side for 1-2 minutes until golden."},
            {"step_number": 5, "instruction": "Serve warm with honey, maple syrup, or peanut butter."}
        ]
    }
]

def seed_database():
    """Seeds the SQLite database if recipes table is empty."""
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) as count FROM recipes")
    count = cursor.fetchone()["count"]

    if count == 0:
        for r in SEED_RECIPES:
            cursor.execute("""
            INSERT INTO recipes (title, description, category, cuisine, prep_time, cook_time, servings, difficulty, dietary, calories, image_url)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                r["title"], r["description"], r["category"], r["cuisine"],
                r["prep_time"], r["cook_time"], r["servings"], r["difficulty"],
                r["dietary"], r["calories"], r["image_url"]
            ))
            recipe_id = cursor.lastrowid

            for ing in r["ingredients"]:
                cursor.execute("""
                INSERT INTO recipe_ingredients (recipe_id, name, quantity, unit, is_staple)
                VALUES (?, ?, ?, ?, ?)
                """, (recipe_id, ing["name"].lower().strip(), ing["quantity"], ing["unit"], 1 if ing["is_staple"] else 0))

            for stp in r["steps"]:
                cursor.execute("""
                INSERT INTO recipe_steps (recipe_id, step_number, instruction)
                VALUES (?, ?, ?)
                """, (recipe_id, stp["step_number"], stp["instruction"]))

        # Also seed default pantry items for instant demo
        pantry_seed = [
            ("cooked rice", "Leftover Grains", "2 cups", 2),
            ("eggs", "Dairy & Poultry", "4 eggs", 7),
            ("onion", "Vegetables", "3 medium", 10),
            ("leftover dal", "Cooked Curries", "1 bowl", 1),
            ("bread", "Bakery", "4 slices", 2),
            ("tomato", "Vegetables", "2 medium", 5),
            ("garlic", "Aromatics", "1 bulb", 14)
        ]
        for p in pantry_seed:
            cursor.execute("""
            INSERT OR IGNORE INTO pantry_items (name, category, quantity, expiry_days)
            VALUES (?, ?, ?, ?)
            """, p)

        # Seed sample meal plan entry
        cursor.execute("""
        INSERT INTO meal_plans (day_of_week, meal_type, recipe_id, notes)
        VALUES ('Monday', 'Dinner', 1, 'Quick dinner using yesterday night rice')
        """)
        cursor.execute("""
        INSERT INTO meal_plans (day_of_week, meal_type, recipe_id, notes)
        VALUES ('Tuesday', 'Breakfast', 2, 'High protein breakfast from leftover yellow dal')
        """)

        # Seed initial waste log
        cursor.execute("""
        INSERT INTO waste_logs (recipe_id, food_saved_kg, money_saved_inr)
        VALUES (1, 0.45, 120.0), (2, 0.35, 95.0), (3, 0.50, 140.0)
        """)

        conn.commit()

    conn.close()
