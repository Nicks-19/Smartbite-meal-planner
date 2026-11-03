import React from 'react';

export default function RecipeModal({ recipe, onClose, onCookMeal, onSchedule }) {
  if (!recipe) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Header Image */}
        <div className="relative h-56 bg-slate-100 shrink-0">
          <img
            src={recipe.image_url || "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=800&q=80"}
            alt={recipe.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent"></div>
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 backdrop-blur-xs transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="absolute bottom-4 left-6 right-6 text-white">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                {recipe.category}
              </span>
              <span className="bg-white/20 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-0.5 rounded-full">
                {recipe.dietary}
              </span>
              <span className="bg-white/20 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-0.5 rounded-full">
                {recipe.cuisine}
              </span>
            </div>
            <h2 className="font-display font-bold text-2xl drop-shadow-sm">
              {recipe.title}
            </h2>
          </div>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="p-6 overflow-y-auto space-y-6 custom-scrollbar">
          {/* Quick Stats Bar */}
          <div className="grid grid-cols-4 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Prep</span>
              <span className="font-bold text-slate-800">{recipe.prep_time}m</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Cook</span>
              <span className="font-bold text-slate-800">{recipe.cook_time}m</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Servings</span>
              <span className="font-bold text-slate-800">{recipe.servings}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Calories</span>
              <span className="font-bold text-slate-800">{recipe.calories} kcal</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">About Recipe</h4>
            <p className="text-slate-600 text-sm leading-relaxed">{recipe.description}</p>
          </div>

          {/* Ingredients */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Ingredients Needed</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {recipe.ingredients && recipe.ingredients.map((ing, idx) => (
                <div key={idx} className="flex items-center justify-between bg-slate-50 px-3 py-2 rounded-xl text-xs border border-slate-100">
                  <span className="font-medium text-slate-800 capitalize">{ing.name}</span>
                  <span className="text-slate-500 font-mono text-[11px]">{ing.quantity} {ing.unit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Step-by-Step Instructions */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Cooking Instructions</h4>
            <div className="space-y-3">
              {recipe.steps && recipe.steps.map((st) => (
                <div key={st.step_number} className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {st.step_number}
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {st.instruction}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            onClick={() => {
              onSchedule(recipe);
              onClose();
            }}
            className="bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-semibold text-xs px-4 py-2.5 rounded-xl transition"
          >
            📅 Schedule in Meal Plan
          </button>

          <div className="flex gap-2">
            <button
              onClick={() => {
                onCookMeal(recipe);
                onClose();
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition shadow-sm flex items-center gap-1.5"
            >
              <span>✓ I Cooked This Meal!</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
