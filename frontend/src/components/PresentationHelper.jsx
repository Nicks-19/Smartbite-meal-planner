import React from 'react';

export default function PresentationHelper({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-hidden shadow-2xl flex flex-col border border-slate-200">
        
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between shrink-0 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🎓</span>
              <h2 className="font-display font-bold text-xl">Teacher Presentation & Viva Cheat-Sheet</h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Student: Nikita Sharad Pawar | PRN: 202401100018 | Subject: Full-Stack Web Development
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 text-base">✕</button>
        </div>

        {/* Content (Scrollable) */}
        <div className="p-6 overflow-y-auto space-y-6 custom-scrollbar text-xs">
          
          {/* Section 1: 6 Evaluation Dimensions Required by Teacher */}
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl">
            <h3 className="font-bold text-sm text-emerald-900 mb-2">
              📋 The 6 Required Evaluation Dimensions (Ready for Teacher Demo)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-emerald-950">
              <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-100">
                <span className="font-bold block text-emerald-800 mb-0.5">1. Problem Statement:</span>
                Households discard 30-40% of leftover cooked food (rice, rotis, dal) due to lack of recipe ideas. SmartBite solves this with an instant leftover ingredient matching engine.
              </div>
              <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-100">
                <span className="font-bold block text-emerald-800 mb-0.5">2. Technologies Used:</span>
                Frontend: React 18 + Vite + Tailwind CSS. Backend: Python FastAPI (REST APIs, async, Pydantic). Database: SQLite (Zero external server config needed).
              </div>
              <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-100">
                <span className="font-bold block text-emerald-800 mb-0.5">3. Major Features:</span>
                Leftover Matching Algorithm (% match), 7-Day Leftover Meal Planner, Fridge & Pantry Expiry Tracker, Smart Missing-Grocery Checklist, and Real-world Food Waste Analytics.
              </div>
              <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-100">
                <span className="font-bold block text-emerald-800 mb-0.5">4. Relational Database:</span>
                SQLite relational schema with 7 tables: `recipes`, `recipe_ingredients`, `recipe_steps`, `pantry_items`, `meal_plans`, `grocery_items`, `waste_logs` with ON DELETE CASCADE and indexes.
              </div>
              <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-100">
                <span className="font-bold block text-emerald-800 mb-0.5">5. Two-Tier Validation:</span>
                Client-Side: React state validation (empty check, non-negative numbers, duplicate pills). Server-Side: Strict Pydantic models (HTTP 422, Enums, Field ranges, string sanitization).
              </div>
              <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-100">
                <span className="font-bold block text-emerald-800 mb-0.5">6. Working Demonstration:</span>
                Seamless end-to-end user flow: Enter leftovers → Match recipes → View missing groceries → Add to weekly plan → Cook and log food waste reduction.
              </div>
            </div>
          </div>

          {/* Section 2: 2-Minute Live Demo Script */}
          <div>
            <h3 className="font-bold text-sm text-slate-800 mb-2">
              ⏱️ Recommended 2-Minute Teacher Live Demo Flow
            </h3>
            <ol className="list-decimal pl-5 space-y-1.5 text-slate-600 leading-relaxed">
              <li><strong>Step 1 (Open Matcher):</strong> Click "Leftover Rice Demo" preset to show instant 60-100% matched recipes. Explain how the algorithm normalizes words (e.g. "eggs" to "egg") and calculates match percentage.</li>
              <li><strong>Step 2 (Missing Ingredients):</strong> Point out how the app separates what the user has from missing ingredients, and click "+ Grocery" to show auto-addition into the Smart Grocery List.</li>
              <li><strong>Step 3 (Form Validation):</strong> Click "Add Leftover Recipe" button. Click "Save & Publish" with blank fields to demonstrate client error highlights, then click "Fill Sample Data" to show successful database insert.</li>
              <li><strong>Step 4 (Weekly Planner):</strong> Switch to "Weekly Meal Plan" tab and show how students/families schedule meals across Monday to Sunday to eliminate food waste.</li>
              <li><strong>Step 5 (Waste Tracker):</strong> Open "Impact & Savings" to showcase real-world impact metrics: Meals rescued, kg food waste diverted, and money saved in INR!</li>
            </ol>
          </div>

          {/* Section 3: Top Teacher Viva Questions & Answers */}
          <div>
            <h3 className="font-bold text-sm text-slate-800 mb-2">
              🎯 Top 4 Teacher Viva Questions & Winning Answers
            </h3>
            <div className="space-y-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <p className="font-bold text-slate-800">Q1: Why did you choose SQLite instead of MongoDB or MySQL?</p>
                <p className="text-slate-600 mt-1">
                  <strong>Answer:</strong> "SQLite is a serverless, zero-configuration relational database stored directly within the application directory. It supports full ACID compliance, foreign keys, and SQL indexing without requiring evaluators to install background database servers. For a mini-project, it is completely portable and reliable."
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <p className="font-bold text-slate-800">Q2: How did you implement validation across the application?</p>
                <p className="text-slate-600 mt-1">
                  <strong>Answer:</strong> "I implemented defense-in-depth validation: client-side validation gives immediate feedback before submitting forms, and server-side validation uses Pydantic schemas in FastAPI to validate data types, string constraints, and valid Enums. If an API call receives invalid payloads, it automatically generates standard HTTP 422 responses."
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <p className="font-bold text-slate-800">Q3: How does the ingredient matching algorithm work?</p>
                <p className="text-slate-600 mt-1">
                  <strong>Answer:</strong> "The matching algorithm normalizes ingredient strings (handling plurals and synonyms like chapati/roti), checks the recipe's ingredient list against the user's available leftovers, distinguishes core ingredients from common pantry staples (like salt and cooking oil), and ranks results descending by match percentage."
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <p className="font-bold text-slate-800">Q4: Where can I see the live API documentation?</p>
                <p className="text-slate-600 mt-1">
                  <strong>Answer:</strong> "FastAPI automatically generates interactive Swagger OpenAPI documentation at <code>http://127.0.0.1:8000/docs</code>, where every endpoint, schema, and request parameter can be tested live."
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-5 py-2 rounded-xl transition"
          >
            Got It, Ready for Demo!
          </button>
        </div>

      </div>
    </div>
  );
}
