const API_BASE = window.location.port === '5173' ? 'http://127.0.0.1:8000/api' : '/api';

export const api = {
  // Recipes & Matcher
  async getRecipes(params = {}) {
    const query = new URLSearchParams();
    if (params.category) query.append('category', params.category);
    if (params.dietary) query.append('dietary', params.dietary);
    if (params.search) query.append('search', params.search);

    const res = await fetch(`${API_BASE}/recipes?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch recipes');
    return res.json();
  },

  async getRecipeById(id) {
    const res = await fetch(`${API_BASE}/recipes/${id}`);
    if (!res.ok) throw new Error('Failed to fetch recipe details');
    return res.json();
  },

  async matchLeftovers(payload) {
    const res = await fetch(`${API_BASE}/recipes/match`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail?.[0]?.msg || err.detail || 'Failed to match leftovers');
    }
    return res.json();
  },

  async createRecipe(payload) {
    const res = await fetch(`${API_BASE}/recipes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail?.[0]?.msg || err.detail || 'Failed to create recipe');
    }
    return res.json();
  },

  async deleteRecipe(id) {
    const res = await fetch(`${API_BASE}/recipes/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete recipe');
    return res.json();
  },

  // Pantry
  async getPantry() {
    const res = await fetch(`${API_BASE}/pantry`);
    if (!res.ok) throw new Error('Failed to fetch pantry items');
    return res.json();
  },

  async addPantryItem(item) {
    const res = await fetch(`${API_BASE}/pantry`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
    });
    if (!res.ok) throw new Error('Failed to add pantry item');
    return res.json();
  },

  async deletePantryItem(id) {
    const res = await fetch(`${API_BASE}/pantry/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete pantry item');
    return res.json();
  },

  // Meal Planner
  async getMealPlan() {
    const res = await fetch(`${API_BASE}/meal-plan`);
    if (!res.ok) throw new Error('Failed to fetch meal plan');
    return res.json();
  },

  async scheduleMeal(plan) {
    const res = await fetch(`${API_BASE}/meal-plan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(plan)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail?.[0]?.msg || err.detail || 'Failed to schedule meal');
    }
    return res.json();
  },

  async deleteScheduledMeal(id) {
    const res = await fetch(`${API_BASE}/meal-plan/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete scheduled meal');
    return res.json();
  },

  // Grocery
  async getGroceryList() {
    const res = await fetch(`${API_BASE}/grocery`);
    if (!res.ok) throw new Error('Failed to fetch grocery list');
    return res.json();
  },

  async addGroceryItem(item) {
    const res = await fetch(`${API_BASE}/grocery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
    });
    if (!res.ok) throw new Error('Failed to add grocery item');
    return res.json();
  },

  async addMissingIngredients(recipeId, missingItems) {
    const res = await fetch(`${API_BASE}/grocery/add-missing`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recipe_id: recipeId, missing_items: missingItems })
    });
    if (!res.ok) throw new Error('Failed to auto-add missing items');
    return res.json();
  },

  async toggleGroceryItem(id) {
    const res = await fetch(`${API_BASE}/grocery/${id}/toggle`, {
      method: 'PATCH'
    });
    if (!res.ok) throw new Error('Failed to toggle grocery item');
    return res.json();
  },

  async deleteGroceryItem(id) {
    const res = await fetch(`${API_BASE}/grocery/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete grocery item');
    return res.json();
  },

  // Analytics
  async getWasteSavings() {
    const res = await fetch(`${API_BASE}/analytics/waste-savings`);
    if (!res.ok) throw new Error('Failed to fetch analytics');
    return res.json();
  },

  async logCookedMeal(payload) {
    const res = await fetch(`${API_BASE}/analytics/log-cooked`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to log cooked meal');
    return res.json();
  }
};
