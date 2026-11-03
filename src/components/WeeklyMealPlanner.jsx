import React, { useState } from 'react';

export default function WeeklyMealPlanner({
  mealPlans,
  recipes,
  onScheduleMeal,
  onDeleteMealPlan,
  onViewRecipe
}) {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

  const [selectedDay, setSelectedDay] = useState('Monday');
  const [selectedMealType, setSelectedMealType] = useState('Dinner');
  const [selectedRecipeId, setSelectedRecipeId] = useState('');
  const [notes, setNotes] = useState('');
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [formError, setFormError] = useState('');

  const handleOpenScheduleForSlot = (day, mealType) => {
    setSelectedDay(day);
    setSelectedMealType(mealType);
    setSelectedRecipeId(recipes.length > 0 ? recipes[0].id : '');
    setNotes('');
    setFormError('');
    setShowScheduleModal(true);
  };

  const handleSubmitSchedule = async (e) => {
    e.preventDefault();
    if (!selectedRecipeId) {
      setFormError('Please select a recipe to schedule.');
      return;
    }

    try {
      await onScheduleMeal({
        day_of_week: selectedDay,
        meal_type: selectedMealType,
        recipe_id: Number(selectedRecipeId),
        notes: notes.trim()
      });
      setShowScheduleModal(false);
    } catch (err) {
      setFormError(err.message || 'Failed to schedule meal');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div>
          <h2 className="font-display font-bold text-2xl text-slate-900">
            7-Day Zero-Waste Meal Planner
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Pre-plan your leftover meals across the week to ensure zero groceries spoil and save cooking time.
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedRecipeId(recipes.length > 0 ? recipes[0].id : '');
            setShowScheduleModal(true);
          }}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition flex items-center gap-1.5 self-start sm:self-auto"
        >
          <span>+ Schedule a Meal</span>
        </button>
      </div>

      {/* 7-Day Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
        {days.map((day) => {
          const dayPlans = mealPlans.filter(p => p.day_of_week === day);

          return (
            <div key={day} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col min-h-[300px]">
              {/* Day Header */}
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-100">
                <span className="font-display font-bold text-sm text-slate-900">{day}</span>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  {dayPlans.length} {dayPlans.length === 1 ? 'meal' : 'meals'}
                </span>
              </div>

              {/* Meal Slots List */}
              <div className="flex-1 space-y-2.5">
                {mealTypes.map((mealType) => {
                  const entry = dayPlans.find(p => p.meal_type === mealType);

                  if (entry) {
                    return (
                      <div
                        key={mealType}
                        className="bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 rounded-xl p-2.5 transition group relative"
                      >
                        <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase mb-1">
                          <span className="text-emerald-700">{mealType}</span>
                          <button
                            onClick={() => onDeleteMealPlan(entry.id)}
                            className="text-slate-400 hover:text-rose-600 font-bold"
                            title="Remove from meal plan"
                          >
                            ✕
                          </button>
                        </div>
                        <h4 
                          onClick={() => onViewRecipe({ id: entry.recipe_id, title: entry.recipe_title })}
                          className="font-semibold text-xs text-slate-800 line-clamp-1 cursor-pointer hover:text-emerald-700 transition"
                        >
                          {entry.recipe_title}
                        </h4>
                        {entry.notes && (
                          <p className="text-[10px] text-slate-500 italic mt-0.5 line-clamp-1">
                            "{entry.notes}"
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-1.5 text-[10px] text-slate-400">
                          <span>⏱ {entry.prep_time + entry.cook_time}m</span>
                          <span>•</span>
                          <span>{entry.dietary}</span>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <button
                      key={mealType}
                      onClick={() => handleOpenScheduleForSlot(day, mealType)}
                      className="w-full text-left border border-dashed border-slate-200 hover:border-emerald-400 rounded-xl p-2 text-[11px] text-slate-400 hover:text-emerald-700 hover:bg-emerald-50/30 transition flex items-center justify-between"
                    >
                      <span>{mealType}</span>
                      <span className="text-xs">+</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-display font-bold text-lg text-slate-900">
                Schedule Leftover Meal
              </h3>
              <button onClick={() => setShowScheduleModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            {formError && (
              <p className="mb-3 text-xs font-semibold text-rose-600 bg-rose-50 p-2 rounded-lg">{formError}</p>
            )}

            <form onSubmit={handleSubmitSchedule} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Day of Week</label>
                <select
                  value={selectedDay}
                  onChange={(e) => setSelectedDay(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs outline-none"
                >
                  {days.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Meal Slot</label>
                <select
                  value={selectedMealType}
                  onChange={(e) => setSelectedMealType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs outline-none"
                >
                  {mealTypes.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Choose Recipe</label>
                <select
                  value={selectedRecipeId}
                  onChange={(e) => setSelectedRecipeId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs outline-none"
                >
                  {recipes.map(r => (
                    <option key={r.id} value={r.id}>
                      {r.title} ({r.category})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Leftover Note (Optional)</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Use remaining fried rice or extra boiled dal"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2 rounded-xl transition shadow-sm"
                >
                  Confirm Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
