import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LeftoverMatcher from './components/LeftoverMatcher';
import RecipeCard from './components/RecipeCard';
import RecipeModal from './components/RecipeModal';
import AddRecipeModal from './components/AddRecipeModal';
import WeeklyMealPlanner from './components/WeeklyMealPlanner';
import PantryManager from './components/PantryManager';
import GroceryList from './components/GroceryList';
import WasteSavingsStats from './components/WasteSavingsStats';
import PresentationHelper from './components/PresentationHelper';
import { api } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('matcher');
  const [recipes, setRecipes] = useState([]);
  const [matchedRecipes, setMatchedRecipes] = useState([]);
  const [pantryItems, setPantryItems] = useState([]);
  const [mealPlans, setMealPlans] = useState([]);
  const [groceryItems, setGroceryItems] = useState([]);
  const [wasteStats, setWasteStats] = useState(null);

  const [loadingMatch, setLoadingMatch] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showAddRecipeModal, setShowAddRecipeModal] = useState(false);
  const [showDemoHelper, setShowDemoHelper] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [backendOnline, setBackendOnline] = useState(true);

  // Show temporary toast message
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Initial Data Fetch
  const loadInitialData = async () => {
    try {
      const [recData, pantryData, planData, grocData, statsData] = await Promise.all([
        api.getRecipes(),
        api.getPantry(),
        api.getMealPlan(),
        api.getGroceryList(),
        api.getWasteSavings()
      ]);

      setRecipes(recData);
      setPantryItems(pantryData);
      setMealPlans(planData);
      setGroceryItems(grocData);
      setWasteStats(statsData);
      setBackendOnline(true);

      // Perform initial match with default rice leftover
      const initMatch = await api.matchLeftovers({
        ingredients: ['cooked rice', 'onion', 'garlic']
      });
      setMatchedRecipes(initMatch);
    } catch (err) {
      console.warn('Backend not yet reachable on port 8000:', err.message);
      setBackendOnline(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  // Handler: Run Leftover Matcher
  const handleMatch = async (payload) => {
    setLoadingMatch(true);
    try {
      const results = await api.matchLeftovers(payload);
      setMatchedRecipes(results);
      triggerToast(`Found ${results.length} leftover recipes!`);
    } catch (err) {
      triggerToast(`Matching error: ${err.message}`);
    } finally {
      setLoadingMatch(false);
    }
  };

  // Handler: Create Recipe
  const handleCreateRecipe = async (payload) => {
    const created = await api.createRecipe(payload);
    setRecipes([created, ...recipes]);
    triggerToast(`Recipe "${created.title}" published!`);
    // refresh matcher if on matcher
    if (activeTab === 'matcher') {
      handleMatch({ ingredients: ['cooked rice', 'leftover roti', 'eggs'] });
    }
  };

  // Handler: Schedule Meal
  const handleScheduleMeal = async (plan) => {
    const res = await api.scheduleMeal(plan);
    setMealPlans([...mealPlans, res]);
    triggerToast(`Scheduled "${res.recipe_title}" for ${res.day_of_week}!`);
  };

  const handleDeleteMealPlan = async (id) => {
    await api.deleteScheduledMeal(id);
    setMealPlans(mealPlans.filter(p => p.id !== id));
    triggerToast('Meal removed from weekly schedule');
  };

  // Handler: Pantry CRUD
  const handleAddPantryItem = async (item) => {
    const res = await api.addPantryItem(item);
    const existingIdx = pantryItems.findIndex(p => p.name.toLowerCase() === res.name.toLowerCase());
    if (existingIdx >= 0) {
      const updated = [...pantryItems];
      updated[existingIdx] = res;
      setPantryItems(updated);
    } else {
      setPantryItems([res, ...pantryItems]);
    }
    triggerToast(`Added "${res.name}" to fridge inventory!`);
  };

  const handleDeletePantryItem = async (id) => {
    await api.deletePantryItem(id);
    setPantryItems(pantryItems.filter(p => p.id !== id));
    triggerToast('Item removed from fridge');
  };

  const handleMatchFromPantry = (pantryIngredients) => {
    setActiveTab('matcher');
    handleMatch({ ingredients: pantryIngredients });
    triggerToast(`Matching recipes for all ${pantryIngredients.length} fridge items!`);
  };

  // Handler: Grocery CRUD
  const handleAddGroceryItem = async (item) => {
    const res = await api.addGroceryItem(item);
    setGroceryItems([res, ...groceryItems]);
    triggerToast(`Added "${res.item_name}" to grocery list!`);
  };

  const handleAddMissingToGrocery = async (recipeId, missingItems) => {
    await api.addMissingIngredients(recipeId, missingItems);
    const updatedList = await api.getGroceryList();
    setGroceryItems(updatedList);
    triggerToast(`Added ${missingItems.length} missing items to Grocery Checklist!`);
  };

  const handleToggleGroceryItem = async (id) => {
    const updated = await api.toggleGroceryItem(id);
    setGroceryItems(groceryItems.map(g => g.id === id ? updated : g));
  };

  const handleDeleteGroceryItem = async (id) => {
    await api.deleteGroceryItem(id);
    setGroceryItems(groceryItems.filter(g => g.id !== id));
  };

  // Handler: Mark meal as cooked & log waste saved
  const handleCookMeal = async (recipe) => {
    try {
      await api.logCookedMeal({
        recipe_id: recipe.id,
        food_saved_kg: 0.40,
        money_saved_inr: 120.0
      });
      const updatedStats = await api.getWasteSavings();
      setWasteStats(updatedStats);
      triggerToast(`🎉 Cooked "${recipe.title}"! Saved 0.4kg food waste & ₹120!`);
    } catch (err) {
      triggerToast('Logged cooked meal!');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddRecipe={() => setShowAddRecipeModal(true)}
        onOpenDemoHelper={() => setShowDemoHelper(true)}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-xl border border-slate-700 animate-in fade-in slide-in-from-bottom-3 duration-200 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Backend Offline Warning Banner (if FastAPI not running on port 8000) */}
      {!backendOnline && (
        <div className="bg-amber-500 text-slate-950 px-4 py-2 text-xs font-bold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>⚠️ Backend FastAPI service is starting up on http://127.0.0.1:8000...</span>
          </div>
          <button
            onClick={loadInitialData}
            className="bg-slate-900 text-white text-[11px] font-bold px-3 py-1 rounded-md"
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* Main App Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Tab 1: Leftover Matcher */}
        {activeTab === 'matcher' && (
          <LeftoverMatcher
            onMatch={handleMatch}
            matchedRecipes={matchedRecipes}
            loading={loadingMatch}
            onViewRecipe={(rec) => setSelectedRecipe(rec)}
            onScheduleRecipe={(rec) => {
              setSelectedRecipe(rec);
              setActiveTab('planner');
            }}
            onAddMissingToGrocery={handleAddMissingToGrocery}
            onCookMeal={handleCookMeal}
          />
        )}

        {/* Tab 2: Full Recipe Catalog */}
        {activeTab === 'recipes' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
              <div>
                <h2 className="font-display font-bold text-2xl text-slate-900">
                  Leftover Recipe Catalog
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Browse {recipes.length} curated recipes specifically designed to repurpose Indian & Continental household leftovers.
                </p>
              </div>
              <button
                onClick={() => setShowAddRecipeModal(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition shadow-sm self-start sm:self-auto"
              >
                + Add Custom Recipe
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipes.map((rec) => (
                <RecipeCard
                  key={rec.id}
                  recipe={rec}
                  onViewDetails={(r) => setSelectedRecipe(r)}
                  onSchedule={(r) => {
                    setSelectedRecipe(r);
                    setActiveTab('planner');
                  }}
                  onCookMeal={handleCookMeal}
                />
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Weekly Meal Planner */}
        {activeTab === 'planner' && (
          <WeeklyMealPlanner
            mealPlans={mealPlans}
            recipes={recipes}
            onScheduleMeal={handleScheduleMeal}
            onDeleteMealPlan={handleDeleteMealPlan}
            onViewRecipe={(rec) => {
              const full = recipes.find(r => r.id === rec.id) || rec;
              setSelectedRecipe(full);
            }}
          />
        )}

        {/* Tab 4: Fridge & Pantry Leftovers Tracker */}
        {activeTab === 'pantry' && (
          <PantryManager
            pantryItems={pantryItems}
            onAddPantryItem={handleAddPantryItem}
            onDeletePantryItem={handleDeletePantryItem}
            onMatchFromPantry={handleMatchFromPantry}
          />
        )}

        {/* Tab 5: Smart Grocery Checklist */}
        {activeTab === 'grocery' && (
          <GroceryList
            groceryItems={groceryItems}
            onAddGroceryItem={handleAddGroceryItem}
            onToggleGroceryItem={handleToggleGroceryItem}
            onDeleteGroceryItem={handleDeleteGroceryItem}
          />
        )}

        {/* Tab 6: Environmental & Financial Savings Tracker */}
        {activeTab === 'analytics' && (
          <WasteSavingsStats
            stats={wasteStats}
            recipes={recipes}
            onLogCookedMeal={handleCookMeal}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 px-4 sm:px-8 mt-12 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">SmartBite</span>
            <span>—</span>
            <span>Individual Full-Stack Mini Project</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-semibold text-slate-700">Nikita Sharad Pawar</span>
            <span className="text-slate-400">|</span>
            <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-700">PRN: 202401100018</span>
          </div>
        </div>
      </footer>

      {/* Recipe Detail Modal */}
      <RecipeModal
        recipe={selectedRecipe}
        onClose={() => setSelectedRecipe(null)}
        onCookMeal={handleCookMeal}
        onSchedule={(rec) => {
          setSelectedRecipe(rec);
          setActiveTab('planner');
        }}
      />

      {/* Add Custom Recipe Modal */}
      <AddRecipeModal
        isOpen={showAddRecipeModal}
        onClose={() => setShowAddRecipeModal(false)}
        onRecipeCreated={handleCreateRecipe}
      />

      {/* Teacher Demo Guide & Viva Cheat-Sheet */}
      <PresentationHelper
        isOpen={showDemoHelper}
        onClose={() => setShowDemoHelper(false)}
      />

    </div>
  );
}
