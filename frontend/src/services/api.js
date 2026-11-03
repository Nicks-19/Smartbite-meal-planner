// SmartBite API Service with Full-Stack Backend Sync & Resilient Client-Side Fallback

const API_BASE = window.location.port === '5173' ? 'http://127.0.0.1:8000/api' : '/api';

const INITIAL_RECIPES = [
  {
    id: 1,
    title: "Indo-Chinese Fried Rice",
    description: "Transform cold, leftover cooked rice into a fragrant, restaurant-style wok-tossed fried rice in 12 minutes.",
    category: "Leftover Rice",
    cuisine: "Indo-Chinese",
    prep_time: 5,
    cook_time: 10,
    servings: 2,
    difficulty: "Easy",
    dietary: "Vegetarian",
    calories: 310,
    image_url: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=800&q=80",
    ingredients: [
      { name: "cooked rice", quantity: "2", unit: "cups", is_staple: false },
      { name: "onion", quantity: "1", unit: "medium, chopped", is_staple: false },
      { name: "garlic", quantity: "4", unit: "cloves, minced", is_staple: false },
      { name: "carrot", quantity: "1", unit: "diced", is_staple: false },
      { name: "soy sauce", quantity: "1.5", unit: "tbsp", is_staple: true },
      { name: "green chilli", quantity: "2", unit: "slit", is_staple: false },
      { name: "cooking oil", quantity: "2", unit: "tbsp", is_staple: true },
      { name: "black pepper", quantity: "0.5", unit: "tsp", is_staple: true },
      { name: "salt", quantity: "0.5", unit: "tsp", is_staple: true }
    ],
    steps: [
      { step_number: 1, instruction: "Gently crumble cold leftover rice with clean fingers or a fork so the grains are separate." },
      { step_number: 2, instruction: "Heat oil in a wide pan or wok on high heat. Add minced garlic, green chillies, and onions; stir-fry for 1 minute." },
      { step_number: 3, instruction: "Toss in diced carrots and any leftover vegetables. Stir-fry briskly for 2 minutes on high flame." },
      { step_number: 4, instruction: "Add the leftover rice, drizzle soy sauce, sprinkle black pepper and salt. Toss vigorously for 3 minutes." },
      { step_number: 5, instruction: "Serve immediately garnished with spring onions or fresh coriander." }
    ]
  },
  {
    id: 2,
    title: "Protein-Rich Leftover Dal Paratha",
    description: "Never throw away surplus cooked dal! Knead it with whole wheat flour for fluffy, nutrient-dense spiced flatbreads.",
    category: "Leftover Dal",
    cuisine: "Indian",
    prep_time: 10,
    cook_time: 12,
    servings: 3,
    difficulty: "Easy",
    dietary: "Vegetarian",
    calories: 220,
    image_url: "https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=800&q=80",
    ingredients: [
      { name: "leftover dal", quantity: "1", unit: "cup", is_staple: false },
      { name: "wheat flour", quantity: "2", unit: "cups", is_staple: true },
      { name: "onion", quantity: "1", unit: "finely chopped", is_staple: false },
      { name: "green chilli", quantity: "1", unit: "finely chopped", is_staple: false },
      { name: "ajwain", quantity: "0.5", unit: "tsp", is_staple: true },
      { name: "coriander leaves", quantity: "2", unit: "tbsp, chopped", is_staple: false },
      { name: "ghee or oil", quantity: "1.5", unit: "tbsp", is_staple: true },
      { name: "salt", quantity: "0.5", unit: "tsp", is_staple: true }
    ],
    steps: [
      { step_number: 1, instruction: "In a mixing bowl, combine whole wheat flour, chopped onion, green chillies, ajwain, coriander, and salt." },
      { step_number: 2, instruction: "Pour leftover dal into the flour. Knead into a soft dough without adding extra water. Rest for 5 minutes." },
      { step_number: 3, instruction: "Divide into lemon-sized balls. Roll each ball into a circular flat disc using a rolling pin." },
      { step_number: 4, instruction: "Roast paratha on both sides with ghee or oil on a hot tawa until golden-brown spots appear." },
      { step_number: 5, instruction: "Serve piping hot with curd, pickle, or green chutney." }
    ]
  },
  {
    id: 3,
    title: "Crispy Leftover Rice & Potato Cutlets",
    description: "Crispy outside, soft inside tea-time snacks crafted from cold cooked rice and leftover boiled potatoes.",
    category: "Leftover Rice",
    cuisine: "Indian Snacks",
    prep_time: 10,
    cook_time: 10,
    servings: 4,
    difficulty: "Easy",
    dietary: "Vegetarian",
    calories: 260,
    image_url: "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&w=800&q=80",
    ingredients: [
      { name: "cooked rice", quantity: "1.5", unit: "cups", is_staple: false },
      { name: "boiled potato", quantity: "2", unit: "medium, mashed", is_staple: false },
      { name: "onion", quantity: "1", unit: "finely chopped", is_staple: false },
      { name: "ginger", quantity: "1", unit: "tsp, grated", is_staple: false },
      { name: "garam masala", quantity: "0.5", unit: "tsp", is_staple: true },
      { name: "red chilli powder", quantity: "0.5", unit: "tsp", is_staple: true },
      { name: "cornflour", quantity: "2", unit: "tbsp", is_staple: true },
      { name: "cooking oil", quantity: "2", unit: "tbsp", is_staple: true },
      { name: "salt", quantity: "0.75", unit: "tsp", is_staple: true }
    ],
    steps: [
      { step_number: 1, instruction: "Mash cold leftover rice slightly with a fork in a bowl." },
      { step_number: 2, instruction: "Add mashed potato, chopped onion, ginger, spices, cornflour, and salt. Mix into a firm dough." },
      { step_number: 3, instruction: "Shape into round flat patties with lightly greased hands." },
      { step_number: 4, instruction: "Shallow fry in 2 tbsp oil over medium flame for 3-4 mins each side until crispy and golden." },
      { step_number: 5, instruction: "Drain and serve with green chutney or ketchup." }
    ]
  },
  {
    id: 4,
    title: "Chilli Garlic Chapati Noodles",
    description: "A genius hack turning dry day-old rotis into saucy, spicy street noodles.",
    category: "Leftover Roti",
    cuisine: "Indo-Chinese",
    prep_time: 5,
    cook_time: 8,
    servings: 2,
    difficulty: "Easy",
    dietary: "Vegetarian",
    calories: 240,
    image_url: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80",
    ingredients: [
      { name: "leftover roti", quantity: "4", unit: "chapatis", is_staple: false },
      { name: "onion", quantity: "1", unit: "sliced", is_staple: false },
      { name: "capsicum", quantity: "1", unit: "sliced", is_staple: false },
      { name: "garlic", quantity: "5", unit: "cloves, chopped", is_staple: false },
      { name: "tomato ketchup", quantity: "2", unit: "tbsp", is_staple: true },
      { name: "soy sauce", quantity: "1", unit: "tbsp", is_staple: true },
      { name: "chilli sauce", quantity: "1", unit: "tsp", is_staple: true },
      { name: "cooking oil", quantity: "1.5", unit: "tbsp", is_staple: true },
      { name: "salt", quantity: "0.25", unit: "tsp", is_staple: true }
    ],
    steps: [
      { step_number: 1, instruction: "Roll leftover chapatis tightly and slice into thin noodle-like ribbons." },
      { step_number: 2, instruction: "Sauté garlic and onions in oil on high flame for 1 minute." },
      { step_number: 3, instruction: "Toss in capsicum and cook 1 minute to retain crunch." },
      { step_number: 4, instruction: "Add sauces with 2 tablespoons of water." },
      { step_number: 5, instruction: "Fold in chapati ribbons; toss for 2 minutes until glossy and coated." }
    ]
  },
  {
    id: 5,
    title: "Masala Bread Upma",
    description: "Rescue hard stale bread ends into a comforting, savory breakfast tempered with mustard seeds and crunchy peanuts.",
    category: "Stale Bread",
    cuisine: "South Indian",
    prep_time: 5,
    cook_time: 8,
    servings: 2,
    difficulty: "Easy",
    dietary: "Vegetarian",
    calories: 275,
    image_url: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80",
    ingredients: [
      { name: "bread", quantity: "5", unit: "slices, cubed", is_staple: false },
      { name: "onion", quantity: "1", unit: "chopped", is_staple: false },
      { name: "tomato", quantity: "1", unit: "chopped", is_staple: false },
      { name: "peanuts", quantity: "2", unit: "tbsp", is_staple: false },
      { name: "mustard seeds", quantity: "0.5", unit: "tsp", is_staple: true },
      { name: "turmeric", quantity: "0.25", unit: "tsp", is_staple: true },
      { name: "cooking oil", quantity: "1.5", unit: "tbsp", is_staple: true },
      { name: "salt", quantity: "0.5", unit: "tsp", is_staple: true }
    ],
    steps: [
      { step_number: 1, instruction: "Tear stale bread into bite-sized cubes." },
      { step_number: 2, instruction: "Fry mustard seeds and peanuts in oil until golden." },
      { step_number: 3, instruction: "Add onions, green chillies, and tomatoes; cook until juicy." },
      { step_number: 4, instruction: "Fold in bread cubes, splash 2 spoons water, and toss for 2 minutes." }
    ]
  },
  {
    id: 6,
    title: "Street-Style Anda Bhurji (Egg Scramble)",
    description: "Lightning-fast, high-protein meal made with pantry staple eggs, onions, and ripe tomatoes.",
    category: "Quick Bites",
    cuisine: "Indian Street Food",
    prep_time: 5,
    cook_time: 7,
    servings: 2,
    difficulty: "Easy",
    dietary: "Eggitarian",
    calories: 210,
    image_url: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80",
    ingredients: [
      { name: "eggs", quantity: "3", unit: "large eggs", is_staple: false },
      { name: "onion", quantity: "1", unit: "finely chopped", is_staple: false },
      { name: "tomato", quantity: "1", unit: "chopped", is_staple: false },
      { name: "green chilli", quantity: "2", unit: "chopped", is_staple: false },
      { name: "butter or oil", quantity: "1.5", unit: "tbsp", is_staple: true },
      { name: "turmeric", quantity: "0.25", unit: "tsp", is_staple: true },
      { name: "salt", quantity: "0.5", unit: "tsp", is_staple: true }
    ],
    steps: [
      { step_number: 1, instruction: "Whisk 3 eggs with a pinch of salt in a bowl." },
      { step_number: 2, instruction: "Sauté onions and green chillies in melted butter until lightly golden." },
      { step_number: 3, instruction: "Add tomatoes, turmeric, and cook 2 minutes." },
      { step_number: 4, instruction: "Pour eggs on medium heat; gently fold into soft, creamy curds." }
    ]
  }
];

const INITIAL_PANTRY = [
  { id: 1, name: "cooked rice", category: "Leftover Grains", quantity: "2 cups", expiry_days: 2, added_at: "Today" },
  { id: 2, name: "eggs", category: "Dairy & Poultry", quantity: "4 eggs", expiry_days: 7, added_at: "Yesterday" },
  { id: 3, name: "onion", category: "Vegetables", quantity: "3 medium", expiry_days: 10, added_at: "Today" },
  { id: 4, name: "leftover dal", category: "Cooked Curries", quantity: "1 bowl", expiry_days: 1, added_at: "Today" },
  { id: 5, name: "bread", category: "Bakery", quantity: "4 slices", expiry_days: 2, added_at: "Today" }
];

const INITIAL_MEAL_PLANS = [
  { id: 1, day_of_week: "Monday", meal_type: "Dinner", recipe_id: 1, recipe_title: "Indo-Chinese Fried Rice", dietary: "Vegetarian", prep_time: 5, cook_time: 10, notes: "Quick dinner using yesterday night rice" },
  { id: 2, day_of_week: "Tuesday", meal_type: "Breakfast", recipe_id: 2, recipe_title: "Protein-Rich Leftover Dal Paratha", dietary: "Vegetarian", prep_time: 10, cook_time: 12, notes: "High protein breakfast from leftover dal" }
];

const INITIAL_GROCERY = [
  { id: 1, item_name: "soy sauce", quantity: "1 bottle", is_bought: false },
  { id: 2, item_name: "peanuts", quantity: "100g", is_bought: true }
];

const INITIAL_STATS = {
  total_meals_rescued: 5,
  total_food_saved_kg: 2.20,
  total_money_saved_inr: 615.0,
  co2_emissions_prevented_kg: 5.50,
  top_rescued_categories: [
    { category: "Leftover Rice", count: 2 },
    { category: "Leftover Dal", count: 2 },
    { category: "Leftover Roti", count: 1 }
  ]
};

// Client matching helper
function localMatch(userIngredients, filterDietary) {
  const norm = (s) => s.toLowerCase().trim().replace(/s$/, '').replace('chapatis', 'roti').replace('chapati', 'roti');
  const userNorm = userIngredients.map(norm);

  const results = [];
  INITIAL_RECIPES.forEach(r => {
    if (filterDietary && r.dietary !== filterDietary) return;

    const matchedNames = [];
    const missing = [];
    const staples = [];
    let coreCount = 0;

    r.ingredients.forEach(ing => {
      const iNorm = norm(ing.name);
      const isMatch = userNorm.some(u => u.includes(iNorm) || iNorm.includes(u));

      if (isMatch) {
        matchedNames.push(ing.name);
      } else {
        if (ing.is_staple) staples.push(ing);
        else missing.push(ing);
      }
      if (!ing.is_staple) coreCount++;
    });

    const coreMatches = matchedNames.filter(m => !r.ingredients.find(i => i.name === m)?.is_staple).length;
    const pct = coreCount > 0 ? Math.min(Math.round((coreMatches / coreCount) * 100), 100) : 100;

    if (matchedNames.length > 0) {
      results.push({
        ...r,
        match_percentage: pct,
        matched_ingredients: matchedNames,
        missing_ingredients: missing,
        staples_needed: staples
      });
    }
  });

  return results.sort((a, b) => b.match_percentage - a.match_percentage);
}

export const api = {
  async getRecipes(params = {}) {
    try {
      const res = await fetch(`${API_BASE}/recipes`);
      if (res.ok) return await res.json();
    } catch (e) {}
    return INITIAL_RECIPES;
  },

  async getRecipeById(id) {
    try {
      const res = await fetch(`${API_BASE}/recipes/${id}`);
      if (res.ok) return await res.json();
    } catch (e) {}
    return INITIAL_RECIPES.find(r => r.id === Number(id)) || INITIAL_RECIPES[0];
  },

  async matchLeftovers(payload) {
    try {
      const res = await fetch(`${API_BASE}/recipes/match`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    return localMatch(payload.ingredients || [], payload.dietary_filter);
  },

  async createRecipe(payload) {
    try {
      const res = await fetch(`${API_BASE}/recipes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    const newRec = { ...payload, id: Date.now() };
    INITIAL_RECIPES.unshift(newRec);
    return newRec;
  },

  async getPantry() {
    try {
      const res = await fetch(`${API_BASE}/pantry`);
      if (res.ok) return await res.json();
    } catch (e) {}
    return INITIAL_PANTRY;
  },

  async addPantryItem(item) {
    try {
      const res = await fetch(`${API_BASE}/pantry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    const newItem = { ...item, id: Date.now(), added_at: 'Just now' };
    INITIAL_PANTRY.unshift(newItem);
    return newItem;
  },

  async deletePantryItem(id) {
    try {
      await fetch(`${API_BASE}/pantry/${id}`, { method: 'DELETE' });
    } catch (e) {}
    return { message: 'Deleted' };
  },

  async getMealPlan() {
    try {
      const res = await fetch(`${API_BASE}/meal-plan`);
      if (res.ok) return await res.json();
    } catch (e) {}
    return INITIAL_MEAL_PLANS;
  },

  async scheduleMeal(plan) {
    try {
      const res = await fetch(`${API_BASE}/meal-plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(plan)
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    const rec = INITIAL_RECIPES.find(r => r.id === Number(plan.recipe_id)) || INITIAL_RECIPES[0];
    const newEntry = {
      ...plan,
      id: Date.now(),
      recipe_title: rec.title,
      dietary: rec.dietary,
      prep_time: rec.prep_time,
      cook_time: rec.cook_time
    };
    INITIAL_MEAL_PLANS.push(newEntry);
    return newEntry;
  },

  async deleteScheduledMeal(id) {
    try {
      await fetch(`${API_BASE}/meal-plan/${id}`, { method: 'DELETE' });
    } catch (e) {}
    return { message: 'Deleted' };
  },

  async getGroceryList() {
    try {
      const res = await fetch(`${API_BASE}/grocery`);
      if (res.ok) return await res.json();
    } catch (e) {}
    return INITIAL_GROCERY;
  },

  async addGroceryItem(item) {
    try {
      const res = await fetch(`${API_BASE}/grocery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    const newItem = { ...item, id: Date.now(), is_bought: false };
    INITIAL_GROCERY.unshift(newItem);
    return newItem;
  },

  async addMissingIngredients(recipeId, missingItems) {
    try {
      await fetch(`${API_BASE}/grocery/add-missing`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipe_id: recipeId, missing_items: missingItems })
      });
    } catch (e) {}
    missingItems.forEach(name => {
      INITIAL_GROCERY.unshift({ id: Date.now() + Math.random(), item_name: name, quantity: '1', is_bought: false });
    });
    return { message: 'Added missing items' };
  },

  async toggleGroceryItem(id) {
    try {
      const res = await fetch(`${API_BASE}/grocery/${id}/toggle`, { method: 'PATCH' });
      if (res.ok) return await res.json();
    } catch (e) {}
    const target = INITIAL_GROCERY.find(g => g.id === id);
    if (target) target.is_bought = !target.is_bought;
    return target || { id, is_bought: true };
  },

  async deleteGroceryItem(id) {
    try {
      await fetch(`${API_BASE}/grocery/${id}`, { method: 'DELETE' });
    } catch (e) {}
    return { message: 'Deleted' };
  },

  async getWasteSavings() {
    try {
      const res = await fetch(`${API_BASE}/analytics/waste-savings`);
      if (res.ok) return await res.json();
    } catch (e) {}
    return INITIAL_STATS;
  },

  async logCookedMeal(payload) {
    try {
      await fetch(`${API_BASE}/analytics/log-cooked`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (e) {}
    INITIAL_STATS.total_meals_rescued += 1;
    INITIAL_STATS.total_food_saved_kg = Math.round((INITIAL_STATS.total_food_saved_kg + 0.40) * 100) / 100;
    INITIAL_STATS.total_money_saved_inr += 120.0;
    INITIAL_STATS.co2_emissions_prevented_kg = Math.round((INITIAL_STATS.total_food_saved_kg * 2.5) * 100) / 100;
    return { message: 'Logged' };
  }
};
