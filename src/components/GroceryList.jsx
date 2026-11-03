import React, { useState } from 'react';

export default function GroceryList({
  groceryItems,
  onAddGroceryItem,
  onToggleGroceryItem,
  onDeleteGroceryItem
}) {
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [error, setError] = useState('');

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!itemName.trim()) {
      setError('Item name is required.');
      return;
    }
    setError('');
    try {
      await onAddGroceryItem({
        item_name: itemName.trim(),
        quantity: quantity.trim() || '1'
      });
      setItemName('');
      setQuantity('1');
    } catch (err) {
      setError(err.message || 'Failed to add item');
    }
  };

  const pendingItems = groceryItems.filter(i => !i.is_bought);
  const boughtItems = groceryItems.filter(i => i.is_bought);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div>
          <h2 className="font-display font-bold text-2xl text-slate-900">
            Smart Grocery Checklist
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Missing ingredients from matched leftover recipes are automatically placed here so you only buy what you truly need.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full">
            {pendingItems.length} items to buy
          </span>
          <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full">
            {boughtItems.length} bought
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Add Form */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs h-fit">
          <h3 className="font-display font-bold text-base text-slate-900 mb-4 pb-2 border-b border-slate-100">
            Add Grocery Item
          </h3>

          {error && (
            <p className="mb-3 text-xs text-rose-600 font-semibold bg-rose-50 p-2 rounded-lg">{error}</p>
          )}

          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Item Name *
              </label>
              <input
                type="text"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder="e.g. soy sauce, spring onions"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:bg-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Quantity
              </label>
              <input
                type="text"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="e.g. 1 bottle, 250g"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 rounded-xl transition shadow-sm mt-2"
            >
              + Add to Checklist
            </button>
          </form>
        </div>

        {/* List Section */}
        <div className="lg:col-span-2 space-y-4">
          {/* Pending Items */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 pb-2 border-b border-slate-100 flex items-center justify-between">
              <span>Items To Buy ({pendingItems.length})</span>
              <span className="text-[11px] text-slate-400 font-normal">Click checkmark when purchased</span>
            </h4>

            {pendingItems.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-3 text-center">
                All clear! No missing ingredients pending.
              </p>
            ) : (
              <div className="space-y-2">
                {pendingItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200/80 transition"
                  >
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => onToggleGroceryItem(item.id)}
                        className="w-5 h-5 rounded-md border-2 border-slate-300 hover:border-emerald-500 flex items-center justify-center transition"
                      ></button>
                      <div>
                        <span className="font-semibold text-xs text-slate-800 capitalize block">
                          {item.item_name}
                        </span>
                        <span className="text-[10px] text-slate-400">Qty: {item.quantity}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => onDeleteGroceryItem(item.id)}
                      className="text-slate-400 hover:text-rose-600 font-bold text-xs p-1"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Already Bought Items */}
          {boughtItems.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3 opacity-80">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700 pb-2 border-b border-slate-100">
                Purchased ({boughtItems.length})
              </h4>
              <div className="space-y-2">
                {boughtItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-2.5 bg-emerald-50/50 rounded-xl border border-emerald-100"
                  >
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => onToggleGroceryItem(item.id)}
                        className="w-5 h-5 rounded-md bg-emerald-600 text-white flex items-center justify-center text-xs"
                      >
                        ✓
                      </button>
                      <span className="text-xs text-slate-500 line-through capitalize">
                        {item.item_name} ({item.quantity})
                      </span>
                    </div>
                    <button
                      onClick={() => onDeleteGroceryItem(item.id)}
                      className="text-slate-400 hover:text-rose-600 font-bold text-xs p-1"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
