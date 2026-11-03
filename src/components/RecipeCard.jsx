import React from 'react';

export default function RecipeCard({
  recipe,
  onViewDetails,
  onSchedule,
  onAddMissingToGrocery,
  onCookMeal
}) {
  const isMatchMode = recipe.match_percentage !== undefined;

  const getMatchBadgeColor = (pct) => {
    if (pct >= 80) return 'bg-emerald-500 text-white border-emerald-600';
    if (pct >= 50) return 'bg-amber-500 text-white border-amber-600';
    return 'bg-blue-500 text-white border-blue-600';
  };

  const getDietaryBadge = (diet) => {
    switch (diet) {
      case 'Vegetarian':
        return <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">🟢 Veg</span>;
      case 'Eggitarian':
        return <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">🟡 Egg</span>;
      case 'Vegan':
        return <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">🌱 Vegan</span>;
      default:
        return <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">🥩 Non-Veg</span>;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden group">
      {/* Top Image Banner */}
      <div className="relative h-44 overflow-hidden bg-slate-100">
        <img
          src={recipe.image_url || "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=800&q=80"}
          alt={recipe.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>

        {/* Dietary & Cuisine Tag */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span className="bg-white/90 backdrop-blur-sm text-slate-800 text-[11px] font-medium px-2 py-0.5 rounded-full shadow-sm">
            {recipe.category}
          </span>
          <span className="bg-slate-900/80 backdrop-blur-sm text-white text-[11px] font-medium px-2 py-0.5 rounded-full">
            {recipe.cuisine}
          </span>
        </div>

        {/* Match Percentage Badge */}
        {isMatchMode ? (
          <div className="absolute top-3 right-3">
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold shadow-md border ${getMatchBadgeColor(recipe.match_percentage)} flex items-center gap-1`}>
              <span>{recipe.match_percentage}%</span>
              <span>Match</span>
            </span>
          </div>
        ) : (
          <div className="absolute top-3 right-3">
            {getDietaryBadge(recipe.dietary)}
          </div>
        )}

        {/* Bottom Title Overlay */}
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <h3 className="font-display font-bold text-lg leading-tight drop-shadow-sm line-clamp-1">
            {recipe.title}
          </h3>
          <div className="flex items-center gap-3 text-xs text-slate-200 mt-1">
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {recipe.prep_time + recipe.cook_time} mins
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {recipe.servings} Servings
            </span>
            <span>•</span>
            <span>{recipe.calories} kcal</span>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
          {recipe.description}
        </p>

        {/* Leftover Matcher Details */}
        {isMatchMode && (
          <div className="space-y-2 mb-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs">
            {/* Matched Ingredients */}
            {recipe.matched_ingredients && recipe.matched_ingredients.length > 0 && (
              <div>
                <span className="font-semibold text-emerald-700 block mb-1">
                  ✓ You have ({recipe.matched_ingredients.length}):
                </span>
                <div className="flex flex-wrap gap-1">
                  {recipe.matched_ingredients.map((ing, idx) => (
                    <span key={idx} className="bg-emerald-100 text-emerald-800 text-[10px] px-1.5 py-0.5 rounded font-medium">
                      {ing}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Missing Ingredients */}
            {recipe.missing_ingredients && recipe.missing_ingredients.length > 0 ? (
              <div className="pt-1.5 border-t border-slate-200/60 flex items-center justify-between">
                <div className="text-slate-600">
                  <span className="font-semibold text-rose-600">Missing ({recipe.missing_ingredients.length}):</span>{' '}
                  <span className="text-[11px] text-slate-500">
                    {recipe.missing_ingredients.map(m => m.name).slice(0, 2).join(', ')}
                    {recipe.missing_ingredients.length > 2 ? '...' : ''}
                  </span>
                </div>
                {onAddMissingToGrocery && (
                  <button
                    onClick={() => onAddMissingToGrocery(recipe.id, recipe.missing_ingredients.map(m => m.name))}
                    className="text-[10px] font-bold text-emerald-700 bg-white hover:bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300 transition shadow-2xs"
                    title="Add missing items to your grocery list"
                  >
                    + Grocery
                  </button>
                )}
              </div>
            ) : (
              <div className="pt-1 text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                <span>🎉 100% Ready! No extra groceries needed.</span>
              </div>
            )}
          </div>
        )}

        {/* Card Actions */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
          <button
            onClick={() => onViewDetails(recipe)}
            className="flex-1 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold py-2 px-3 rounded-lg transition text-center shadow-xs"
          >
            Cook & View Steps
          </button>
          
          <button
            onClick={() => onSchedule(recipe)}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium p-2 rounded-lg transition"
            title="Schedule in 7-day meal plan"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </button>

          {onCookMeal && (
            <button
              onClick={() => onCookMeal(recipe)}
              className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-medium p-2 rounded-lg border border-emerald-200 transition"
              title="Mark as cooked & log food saved"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
