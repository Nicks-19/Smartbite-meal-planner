import React, { useState } from 'react';

export default function AddRecipeModal({ isOpen, onClose, onRecipeCreated }) {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Leftover Rice',
    cuisine: 'Indian',
    prep_time: 5,
    cook_time: 10,
    servings: 2,
    difficulty: 'Easy',
    dietary: 'Vegetarian',
    calories: 250,
    image_url: ''
  });

  const [ingredients, setIngredients] = useState([
    { name: '', quantity: '', unit: '', is_staple: false }
  ]);

  const [steps, setSteps] = useState([
    { step_number: 1, instruction: '' }
  ]);

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Client-side validation function
  const validateForm = () => {
    const errs = {};

    if (!formData.title.trim()) {
      errs.title = 'Recipe title is required.';
    } else if (formData.title.trim().length < 3) {
      errs.title = 'Title must be at least 3 characters.';
    }

    if (!formData.description.trim()) {
      errs.description = 'Description is required.';
    } else if (formData.description.trim().length < 10) {
      errs.description = 'Description must be at least 10 characters.';
    }

    if (formData.prep_time <= 0) {
      errs.prep_time = 'Prep time must be a positive number.';
    }

    if (formData.cook_time <= 0) {
      errs.cook_time = 'Cook time must be a positive number.';
    }

    if (formData.servings < 1) {
      errs.servings = 'Servings must be at least 1.';
    }

    // Ingredients validation
    const validIngredients = ingredients.filter(i => i.name.trim() !== '');
    if (validIngredients.length === 0) {
      errs.ingredients = 'Please add at least one ingredient with a valid name.';
    }

    // Steps validation
    const validSteps = steps.filter(s => s.instruction.trim().length >= 5);
    if (validSteps.length === 0) {
      errs.steps = 'Please add at least one cooking instruction (minimum 5 characters).';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleAddIngredientRow = () => {
    setIngredients([...ingredients, { name: '', quantity: '', unit: '', is_staple: false }]);
  };

  const handleRemoveIngredientRow = (index) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((_, idx) => idx !== index));
    }
  };

  const handleIngredientChange = (index, field, value) => {
    const updated = [...ingredients];
    updated[index][field] = value;
    setIngredients(updated);
  };

  const handleAddStepRow = () => {
    setSteps([...steps, { step_number: steps.length + 1, instruction: '' }]);
  };

  const handleRemoveStepRow = (index) => {
    if (steps.length > 1) {
      const updated = steps.filter((_, idx) => idx !== index).map((s, idx) => ({
        ...s,
        step_number: idx + 1
      }));
      setSteps(updated);
    }
  };

  const handleStepChange = (index, value) => {
    const updated = [...steps];
    updated[index].instruction = value;
    setSteps(updated);
  };

  const fillSampleRecipe = () => {
    setFormData({
      title: 'Cheesy Leftover Roti Quesadilla',
      description: 'Stuff day-old leftover chapatis with cheese, sweet corn, and oregano for a 6-minute Mexican style snack.',
      category: 'Leftover Roti',
      cuisine: 'Mexican Fusion',
      prep_time: 4,
      cook_time: 6,
      servings: 2,
      difficulty: 'Easy',
      dietary: 'Vegetarian',
      calories: 270,
      image_url: 'https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?auto=format&fit=crop&w=800&q=80'
    });
    setIngredients([
      { name: 'leftover roti', quantity: '2', unit: 'chapatis', is_staple: false },
      { name: 'cheese', quantity: '0.5', unit: 'cup grated', is_staple: false },
      { name: 'sweet corn', quantity: '2', unit: 'tbsp', is_staple: false },
      { name: 'butter', quantity: '1', unit: 'tsp', is_staple: true },
      { name: 'chilli flakes', quantity: '0.5', unit: 'tsp', is_staple: true }
    ]);
    setSteps([
      { step_number: 1, instruction: 'Place one leftover roti on a clean cutting board.' },
      { step_number: 2, instruction: 'Cover half the roti with grated cheese, sweet corn, and chili flakes.' },
      { step_number: 3, instruction: 'Fold in half into a semi-circle. Toast on a buttered tawa for 2-3 mins each side until crispy and cheese melts.' }
    ]);
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        prep_time: Number(formData.prep_time),
        cook_time: Number(formData.cook_time),
        servings: Number(formData.servings),
        calories: Number(formData.calories),
        ingredients: ingredients
          .filter(i => i.name.trim() !== '')
          .map(i => ({
            name: i.name.trim().toLowerCase(),
            quantity: i.quantity.trim() || '1',
            unit: i.unit.trim() || 'portion',
            is_staple: Boolean(i.is_staple)
          })),
        steps: steps
          .filter(s => s.instruction.trim().length >= 5)
          .map((s, idx) => ({
            step_number: idx + 1,
            instruction: s.instruction.trim()
          }))
      };

      await onRecipeCreated(payload);
      onClose();
    } catch (err) {
      setErrors({ server: err.message || 'Server-side validation failed.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-hidden shadow-2xl flex flex-col border border-slate-200">
        
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display font-bold text-xl">Contribute Leftover Recipe</h2>
              <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                CRUD + Validation
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Input validation active: client-side checks + Pydantic schema validation.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={fillSampleRecipe}
              className="bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-700 text-xs px-3 py-1.5 rounded-lg transition"
            >
              Fill Sample Data
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 custom-scrollbar flex-1">
          
          {/* Top Server Error */}
          {errors.server && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-xl text-xs font-semibold">
              ⚠️ Server validation error: {errors.server}
            </div>
          )}

          {/* Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Recipe Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Masala Roti Noodles"
                className={`w-full bg-slate-50 border ${errors.title ? 'border-rose-500 bg-rose-50/30' : 'border-slate-300'} rounded-xl px-3 py-2 text-xs focus:bg-white outline-none focus:ring-2 focus:ring-emerald-500/20`}
              />
              {errors.title && <p className="text-[11px] text-rose-600 font-medium mt-1">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Leftover Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:bg-white outline-none"
              >
                <option value="Leftover Rice">Leftover Rice</option>
                <option value="Leftover Roti">Leftover Roti / Flatbread</option>
                <option value="Leftover Dal">Leftover Dal / Lentils</option>
                <option value="Stale Bread">Stale Bread</option>
                <option value="Leftover Sabzi">Leftover Cooked Sabzi</option>
                <option value="Leftover Pasta">Leftover Pasta</option>
                <option value="Quick Bites">Quick Bites & Scrambles</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Description & Leftover Hack Concept *
            </label>
            <textarea
              rows="2"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Explain how this recipe rescues leftover food..."
              className={`w-full bg-slate-50 border ${errors.description ? 'border-rose-500 bg-rose-50/30' : 'border-slate-300'} rounded-xl px-3 py-2 text-xs focus:bg-white outline-none focus:ring-2 focus:ring-emerald-500/20`}
            ></textarea>
            {errors.description && <p className="text-[11px] text-rose-600 font-medium mt-1">{errors.description}</p>}
          </div>

          {/* Time, Servings, Dietary Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Prep Time (mins) *</label>
              <input
                type="number"
                min="1"
                value={formData.prep_time}
                onChange={(e) => setFormData({ ...formData, prep_time: Number(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs outline-none"
              />
              {errors.prep_time && <p className="text-[10px] text-rose-600 mt-1">{errors.prep_time}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Cook Time (mins) *</label>
              <input
                type="number"
                min="1"
                value={formData.cook_time}
                onChange={(e) => setFormData({ ...formData, cook_time: Number(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs outline-none"
              />
              {errors.cook_time && <p className="text-[10px] text-rose-600 mt-1">{errors.cook_time}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Servings *</label>
              <input
                type="number"
                min="1"
                value={formData.servings}
                onChange={(e) => setFormData({ ...formData, servings: Number(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs outline-none"
              />
              {errors.servings && <p className="text-[10px] text-rose-600 mt-1">{errors.servings}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Dietary</label>
              <select
                value={formData.dietary}
                onChange={(e) => setFormData({ ...formData, dietary: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs outline-none"
              >
                <option value="Vegetarian">Vegetarian</option>
                <option value="Eggitarian">Eggitarian</option>
                <option value="Vegan">Vegan</option>
                <option value="Gluten-Free">Gluten-Free</option>
                <option value="Non-Veg">Non-Veg</option>
              </select>
            </div>
          </div>

          {/* Dynamic Ingredients Section */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Ingredients List *
              </label>
              <button
                type="button"
                onClick={handleAddIngredientRow}
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700"
              >
                + Add Ingredient
              </button>
            </div>
            {errors.ingredients && <p className="text-[11px] text-rose-600 font-semibold mb-2">{errors.ingredients}</p>}

            <div className="space-y-2">
              {ingredients.map((ing, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={ing.name}
                    onChange={(e) => handleIngredientChange(idx, 'name', e.target.value)}
                    placeholder="Ingredient name (e.g. cooked rice)"
                    className="flex-2 bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs outline-none"
                  />
                  <input
                    type="text"
                    value={ing.quantity}
                    onChange={(e) => handleIngredientChange(idx, 'quantity', e.target.value)}
                    placeholder="Qty (e.g. 2)"
                    className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs outline-none"
                  />
                  <input
                    type="text"
                    value={ing.unit}
                    onChange={(e) => handleIngredientChange(idx, 'unit', e.target.value)}
                    placeholder="Unit (e.g. cups)"
                    className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs outline-none"
                  />
                  <label className="flex items-center gap-1 text-[11px] text-slate-600 whitespace-nowrap cursor-pointer">
                    <input
                      type="checkbox"
                      checked={ing.is_staple}
                      onChange={(e) => handleIngredientChange(idx, 'is_staple', e.target.checked)}
                      className="rounded accent-emerald-600"
                    />
                    <span>Staple</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => handleRemoveIngredientRow(idx)}
                    className="text-slate-400 hover:text-rose-600 text-xs p-1"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Dynamic Cooking Steps Section */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Step-by-Step Instructions *
              </label>
              <button
                type="button"
                onClick={handleAddStepRow}
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700"
              >
                + Add Step
              </button>
            </div>
            {errors.steps && <p className="text-[11px] text-rose-600 font-semibold mb-2">{errors.steps}</p>}

            <div className="space-y-2">
              {steps.map((st, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 font-bold text-[10px] flex items-center justify-center shrink-0 mt-2">
                    {idx + 1}
                  </span>
                  <textarea
                    rows="2"
                    value={st.instruction}
                    onChange={(e) => handleStepChange(idx, e.target.value)}
                    placeholder={`Step ${idx + 1} instruction...`}
                    className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs outline-none"
                  ></textarea>
                  <button
                    type="button"
                    onClick={() => handleRemoveStepRow(idx)}
                    className="text-slate-400 hover:text-rose-600 text-xs p-1 mt-2"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Actions */}
          <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition shadow-sm"
            >
              {submitting ? 'Validating & Saving...' : 'Save & Publish Recipe'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
