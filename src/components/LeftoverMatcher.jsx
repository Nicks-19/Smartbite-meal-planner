import React, { useState } from 'react';
import RecipeCard from './RecipeCard';

export default function LeftoverMatcher({
  onMatch,
  matchedRecipes,
  loading,
  onViewRecipe,
  onScheduleRecipe,
  onAddMissingToGrocery,
  onCookMeal
}) {
  const [ingredients, setIngredients] = useState(['cooked rice', 'onion', 'garlic']);
  const [inputValue, setInputValue] = useState('');
  const [dietaryFilter, setDietaryFilter] = useState('');
  const [maxTime, setMaxTime] = useState(45);
  const [validationError, setValidationError] = useState('');

  const popularLeftovers = [
    'cooked rice', 'leftover dal', 'leftover roti', 'boiled potato',
    'eggs', 'bread', 'tomato', 'onion', 'paneer', 'capsicum', 'cooked pasta'
  ];

  const handleAddIngredient = (item) => {
    const clean = item.trim().toLowerCase();
    if (!clean) return;
    if (ingredients.includes(clean)) {
      setValidationError(`"${clean}" is already added.`);
      return;
    }
    setIngredients([...ingredients, clean]);
    setInputValue('');
    setValidationError('');
  };

  const handleRemoveIngredient = (itemToRemove) => {
    setIngredients(ingredients.filter(item => item !== itemToRemove));
    setValidationError('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddIngredient(inputValue);
    }
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (ingredients.length === 0) {
      setValidationError('Please enter at least one leftover ingredient to find recipes!');
      return;
    }
    setValidationError('');
    onMatch({
      ingredients,
      dietary_filter: dietaryFilter || null,
      max_cook_time: maxTime === 60 ? null : maxTime
    });
  };

  const fillSample = (type) => {
    if (type === 'rice') {
      setIngredients(['cooked rice', 'onion', 'garlic', 'soy sauce']);
      setDietaryFilter('');
    } else if (type === 'dal') {
      setIngredients(['leftover dal', 'wheat flour', 'onion', 'green chilli']);
      setDietaryFilter('Vegetarian');
    } else if (type === 'roti') {
      setIngredients(['leftover roti', 'onion', 'capsicum', 'tomato ketchup']);
      setDietaryFilter('Vegetarian');
    } else if (type === 'eggs') {
      setIngredients(['eggs', 'onion', 'tomato', 'green chilli']);
      setDietaryFilter('Eggitarian');
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Header & Problem Solving Hook */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-800 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/30 px-3 py-1 rounded-full text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <span>✨ Smart Leftover Recipe Engine</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            Turn Fridge Leftovers into Delicious Meals in Minutes.
          </h1>
          <p className="mt-3 text-slate-300 text-sm sm:text-base leading-relaxed">
            Enter the odd cooked leftovers, single veggies, or staples currently sitting in your fridge. 
            Our matching algorithm will calculate the best recipes you can cook right now with zero food waste.
          </p>

          {/* Teacher / Quick Demo Presets */}
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-emerald-300/80 mr-1">Quick Demo Presets:</span>
            <button
              onClick={() => fillSample('rice')}
              className="bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-1 rounded-full text-xs font-medium transition"
            >
              🍚 Leftover Rice Demo
            </button>
            <button
              onClick={() => fillSample('dal')}
              className="bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-1 rounded-full text-xs font-medium transition"
            >
              🍲 Extra Dal Paratha Demo
            </button>
            <button
              onClick={() => fillSample('roti')}
              className="bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-1 rounded-full text-xs font-medium transition"
            >
              🌯 Roti Noodles Demo
            </button>
            <button
              onClick={() => fillSample('eggs')}
              className="bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-1 rounded-full text-xs font-medium transition"
            >
              🥚 Anda Bhurji Demo
            </button>
          </div>
        </div>
      </div>

      {/* Ingredient Input & Filters Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Input Box */}
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-2">
              What leftovers or ingredients do you have?
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type an ingredient (e.g. cooked rice, boiled potato, eggs) and press Enter"
                className="flex-1 bg-slate-50 border border-slate-300 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 rounded-xl px-4 py-3 text-sm text-slate-800 outline-none transition"
              />
              <button
                type="button"
                onClick={() => handleAddIngredient(inputValue)}
                className="bg-slate-900 hover:bg-slate-800 text-white font-medium px-5 py-3 rounded-xl text-sm transition shadow-sm"
              >
                + Add
              </button>
            </div>

            {/* Validation Error Banner */}
            {validationError && (
              <p className="mt-2 text-xs font-semibold text-rose-600 flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {validationError}
              </p>
            )}
          </div>

          {/* Active Ingredients Tags */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Selected Leftovers ({ingredients.length}):
              </span>
              {ingredients.length > 0 && (
                <button
                  type="button"
                  onClick={() => setIngredients([])}
                  className="text-xs text-rose-600 hover:text-rose-700 font-semibold"
                >
                  Clear All
                </button>
              )}
            </div>
            
            {ingredients.length === 0 ? (
              <div className="p-3 bg-slate-50 border border-dashed border-slate-300 rounded-xl text-center text-xs text-slate-500">
                No ingredients added yet. Click on the popular items below or type above.
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {ingredients.map((item, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-300 px-3 py-1 rounded-full text-xs font-semibold shadow-2xs group"
                  >
                    <span>{item}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveIngredient(item)}
                      className="text-emerald-600 hover:text-rose-600 font-bold ml-1 rounded-full p-0.5"
                      title="Remove"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Popular Leftovers Cloud */}
          <div>
            <span className="text-xs font-semibold text-slate-600 block mb-2">
              Common Leftovers & Pantry Items (click to quickly add):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {popularLeftovers.map((item, idx) => {
                const isSelected = ingredients.includes(item);
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => isSelected ? handleRemoveIngredient(item) : handleAddIngredient(item)}
                    className={`text-xs px-2.5 py-1 rounded-lg border transition ${
                      isSelected
                        ? 'bg-emerald-600 text-white border-emerald-600 font-medium'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '} {item}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Filters Row */}
          <div className="pt-4 border-t border-slate-200/80 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Dietary Preference Filter */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Dietary Preference:
              </label>
              <select
                value={dietaryFilter}
                onChange={(e) => setDietaryFilter(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                <option value="">All Diets</option>
                <option value="Vegetarian">Vegetarian</option>
                <option value="Eggitarian">Eggitarian</option>
                <option value="Vegan">Vegan</option>
                <option value="Gluten-Free">Gluten-Free</option>
              </select>
            </div>

            {/* Max Cooking Time */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-slate-700">Max Cook Time:</label>
                <span className="text-xs font-bold text-emerald-700">{maxTime === 60 ? 'Any Time' : `Under ${maxTime} mins`}</span>
              </div>
              <input
                type="range"
                min="10"
                max="60"
                step="5"
                value={maxTime}
                onChange={(e) => setMaxTime(Number(e.target.value))}
                className="w-full accent-emerald-600"
              />
            </div>
          </div>

          {/* Submit Match Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold py-3.5 px-6 rounded-xl shadow-md transition hover:shadow-lg flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                Matching Recipes from Leftovers...
              </span>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span>Find Matched Leftover Recipes</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Matched Results Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-display font-bold text-xl text-slate-900">
              Matched Leftover Recipes
            </h2>
            <p className="text-xs text-slate-500">
              Ranked by ingredient match percentage and least missing grocery items.
            </p>
          </div>
          {matchedRecipes && matchedRecipes.length > 0 && (
            <span className="bg-emerald-100 text-emerald-800 font-bold text-xs px-3 py-1 rounded-full">
              {matchedRecipes.length} recipes found
            </span>
          )}
        </div>

        {matchedRecipes && matchedRecipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matchedRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onViewDetails={onViewRecipe}
                onSchedule={onScheduleRecipe}
                onAddMissingToGrocery={onAddMissingToGrocery}
                onCookMeal={onCookMeal}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="font-bold text-slate-800 text-base">No matched recipes displayed yet</h3>
            <p className="text-slate-500 text-xs max-w-md mx-auto mt-1 mb-4">
              Add your leftover ingredients above (or click one of the Quick Demo Presets) and hit "Find Matched Leftover Recipes".
            </p>
            <button
              onClick={() => fillSample('rice')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition"
            >
              Load Leftover Rice Demo
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
