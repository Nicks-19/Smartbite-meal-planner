import React from 'react';

export default function WasteSavingsStats({ stats, onLogCookedMeal, recipes }) {
  if (!stats) return null;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-2">
            🌱 Environmental & Economic Impact
          </div>
          <h2 className="font-display font-bold text-2xl text-slate-900">
            Household Waste & Cost Savings Tracker
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Real-time metrics measuring food diverted from landfills, money saved on groceries, and carbon emissions prevented.
          </p>
        </div>

        <button
          onClick={() => {
            if (recipes && recipes.length > 0) {
              onLogCookedMeal(recipes[0]);
            }
          }}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition flex items-center gap-1.5 self-start sm:self-auto"
        >
          <span>+ Log Rescued Meal (+0.4kg saved)</span>
        </button>
      </div>

      {/* 4 Impact Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Meals */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xl shrink-0">
            🍲
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Meals Rescued
            </span>
            <span className="font-display font-extrabold text-2xl text-slate-900">
              {stats.total_meals_rescued}
            </span>
            <span className="text-[10px] text-emerald-600 font-medium block mt-0.5">Cooked from leftovers</span>
          </div>
        </div>

        {/* Card 2: Food Weight */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold text-xl shrink-0">
            ⚖️
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Food Waste Diverted
            </span>
            <span className="font-display font-extrabold text-2xl text-slate-900">
              {stats.total_food_saved_kg} <span className="text-sm font-normal text-slate-500">kg</span>
            </span>
            <span className="text-[10px] text-teal-600 font-medium block mt-0.5">Diverted from landfill</span>
          </div>
        </div>

        {/* Card 3: Money Saved */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xl shrink-0">
            💰
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Estimated Money Saved
            </span>
            <span className="font-display font-extrabold text-2xl text-slate-900">
              ₹{stats.total_money_saved_inr}
            </span>
            <span className="text-[10px] text-amber-600 font-medium block mt-0.5">Saved on restaurant/groceries</span>
          </div>
        </div>

        {/* Card 4: CO2 */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold text-xl shrink-0">
            🌍
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              CO₂e Averted
            </span>
            <span className="font-display font-extrabold text-2xl text-slate-900">
              {stats.co2_emissions_prevented_kg} <span className="text-sm font-normal text-slate-500">kg</span>
            </span>
            <span className="text-[10px] text-sky-600 font-medium block mt-0.5">~2.5 kg CO2e / kg food</span>
          </div>
        </div>
      </div>

      {/* Category Breakdown & Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <h3 className="font-display font-bold text-base text-slate-900 mb-4 pb-2 border-b border-slate-100">
            Top Rescued Leftover Categories
          </h3>
          <div className="space-y-3">
            {stats.top_rescued_categories && stats.top_rescued_categories.map((c, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>{c.category}</span>
                  <span className="text-emerald-700">{c.count} meals rescued</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className="bg-emerald-500 h-2 rounded-full"
                    style={{ width: `${Math.min((c.count / Math.max(stats.total_meals_rescued, 1)) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-display font-bold text-base text-slate-900 mb-2 pb-2 border-b border-slate-100">
              Real-World Problem Justification
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed space-y-2">
              According to the UN Food Waste Index, over 40% of household food waste is caused by forgotten cooked leftovers (such as cold rice, cooked dal, and dry rotis) or perishable staples (potatoes, bread, tomatoes).
            </p>
            <div className="mt-3 p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800">
              💡 <strong>SmartBite Solution:</strong> By matching existing leftovers to simple, fast recipes (like Dal Paratha, Roti Noodles, and Fried Rice), households eliminate food waste, save ₹1,000–₹2,500 monthly, and prevent methane emissions from decomposed organics.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
