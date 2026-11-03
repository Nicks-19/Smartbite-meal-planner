import React, { useState } from 'react';

export default function PantryManager({
  pantryItems,
  onAddPantryItem,
  onDeletePantryItem,
  onMatchFromPantry
}) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Leftover Grains');
  const [quantity, setQuantity] = useState('1 portion');
  const [expiryDays, setExpiryDays] = useState(3);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide an ingredient name.');
      return;
    }
    setError('');
    try {
      await onAddPantryItem({
        name: name.trim().toLowerCase(),
        category,
        quantity: quantity.trim() || '1 portion',
        expiry_days: Number(expiryDays)
      });
      setName('');
      setQuantity('1 portion');
      setExpiryDays(3);
    } catch (err) {
      setError(err.message || 'Failed to add item');
    }
  };

  const getExpiryBadge = (days) => {
    if (days <= 1) {
      return <span className="bg-rose-100 text-rose-700 font-bold px-2 py-0.5 rounded-full text-[10px] border border-rose-200">⚠️ Expiring Soon ({days}d)</span>;
    }
    if (days <= 3) {
      return <span className="bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded-full text-[10px] border border-amber-200">⏳ Use Soon ({days}d)</span>;
    }
    return <span className="bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full text-[10px] border border-emerald-200">Fresh ({days}d)</span>;
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div>
          <h2 className="font-display font-bold text-2xl text-slate-900">
            Fridge & Pantry Leftovers Tracker
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Keep track of open packages, cooked curries, and single vegetables before they spoil.
          </p>
        </div>
        
        {pantryItems.length > 0 && (
          <button
            onClick={() => onMatchFromPantry(pantryItems.map(p => p.name))}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-sm transition flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>⚡ Match All {pantryItems.length} Fridge Items</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add Item Form */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs h-fit">
          <h3 className="font-display font-bold text-base text-slate-900 mb-4 pb-2 border-b border-slate-100">
            Log Fridge / Pantry Item
          </h3>

          {error && (
            <p className="mb-3 text-xs text-rose-600 font-semibold bg-rose-50 p-2 rounded-lg">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Item Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. leftover boiled rice, half capsicum"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:bg-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:bg-white outline-none"
              >
                <option value="Leftover Grains">Leftover Grains (Rice/Pasta)</option>
                <option value="Cooked Curries">Cooked Curries / Dal</option>
                <option value="Vegetables">Vegetables & Herbs</option>
                <option value="Dairy & Poultry">Dairy & Eggs</option>
                <option value="Bakery">Bakery / Bread</option>
                <option value="Aromatics">Aromatics & Spices</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Quantity
                </label>
                <input
                  type="text"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="e.g. 2 bowls"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Days Left
                </label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={expiryDays}
                  onChange={(e) => setExpiryDays(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2.5 rounded-xl transition shadow-sm mt-2"
            >
              + Add to Inventory
            </button>
          </form>
        </div>

        {/* Pantry Items List */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Current Leftovers In Stock ({pantryItems.length})
            </span>
            <span className="text-xs text-slate-400">Sorted by closest expiry</span>
          </div>

          {pantryItems.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500 text-xs">
              Your pantry is empty. Log leftover ingredients using the form on the left.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {pantryItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs hover:shadow-sm transition flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-sm text-slate-900 capitalize">
                          {item.name}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md font-medium">
                        {item.category}
                      </span>
                    </div>
                    <button
                      onClick={() => onDeletePantryItem(item.id)}
                      className="text-slate-400 hover:text-rose-600 font-bold text-xs p-1"
                      title="Delete item"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-600 font-medium">Qty: {item.quantity}</span>
                    {getExpiryBadge(item.expiry_days)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
