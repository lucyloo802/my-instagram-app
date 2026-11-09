import React, { useState, useRef, useEffect } from 'react';
import {
  Plus,
  X,
  Sparkles,
  SlidersHorizontal,
  Flame,
  Clock,
  Users,
  ShieldCheck,
  RotateCcw,
  ChefHat,
  Check,
} from 'lucide-react';
import { POPULAR_INGREDIENTS, STARTER_KITS, StarterKit } from '../types/recipe';

interface IngredientInputProps {
  ingredients: string[];
  onAddIngredient: (name: string) => void;
  onRemoveIngredient: (index: number) => void;
  onClearAll: () => void;
  onLoadStarterKit: (kit: StarterKit) => void;
  strictMode: boolean;
  onToggleStrictMode: (val: boolean) => void;
  maxCookTime: number;
  onChangeMaxCookTime: (val: number) => void;
  mealType: string;
  onChangeMealType: (val: string) => void;
  servings: number;
  onChangeServings: (val: number) => void;
  dietary: string;
  onChangeDietary: (val: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

export const IngredientInput: React.FC<IngredientInputProps> = ({
  ingredients,
  onAddIngredient,
  onRemoveIngredient,
  onClearAll,
  onLoadStarterKit,
  strictMode,
  onToggleStrictMode,
  maxCookTime,
  onChangeMaxCookTime,
  mealType,
  onChangeMealType,
  servings,
  onChangeServings,
  dietary,
  onChangeDietary,
  onGenerate,
  isLoading,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [showPreferences, setShowPreferences] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Suggestions filtered by what user typed and what's not already added
  const suggestions = inputValue.trim()
    ? POPULAR_INGREDIENTS.filter(
        (item) =>
          item.name.toLowerCase().includes(inputValue.toLowerCase()) &&
          !ingredients.some((ing) => ing.toLowerCase() === item.name.toLowerCase())
      ).slice(0, 5)
    : [];

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addCurrentInput();
    } else if (e.key === 'Backspace' && !inputValue && ingredients.length > 0) {
      onRemoveIngredient(ingredients.length - 1);
    }
  };

  const addCurrentInput = () => {
    const trimmed = inputValue.trim().replace(/^,+|,+$/g, '');
    if (trimmed) {
      onAddIngredient(trimmed);
      setInputValue('');
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (name: string) => {
    onAddIngredient(name);
    setInputValue('');
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div id="pantry-section" className="bg-white rounded-2xl border border-stone-200/80 shadow-sm p-6 sm:p-8">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-100">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-display tracking-tight flex items-center gap-2">
            <span>What do you have in your kitchen right now?</span>
          </h2>
          <p className="text-sm text-stone-500 mt-1">
            Type anything in your fridge, pantry, or counter. We'll whip up a real dish with just those items.
          </p>
        </div>

        {ingredients.length > 0 && (
          <button
            onClick={onClearAll}
            className="text-xs font-medium text-stone-500 hover:text-rose-600 transition-colors flex items-center gap-1 self-start sm:self-auto cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear pantry ({ingredients.length})</span>
          </button>
        )}
      </div>

      {/* Main Tag Input Area */}
      <div className="mt-6" ref={containerRef}>
        <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2">
          Your Ingredients List ({ingredients.length} items added)
        </label>

        <div className="min-h-[90px] p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus-within:bg-white focus-within:border-amber-600 focus-within:ring-2 focus-within:ring-amber-500/10 transition-all flex flex-wrap items-center gap-2 relative">
          {ingredients.map((ingredient, idx) => (
            <span
              key={`${ingredient}-${idx}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-stone-300/80 text-stone-800 text-sm font-medium rounded-lg shadow-2xs group"
            >
              <span>{ingredient}</span>
              <button
                type="button"
                onClick={() => onRemoveIngredient(idx)}
                className="text-stone-400 hover:text-stone-700 hover:bg-stone-100 p-0.5 rounded transition-colors cursor-pointer"
                title={`Remove ${ingredient}`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}

          <div className="flex-1 min-w-[160px] relative">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onKeyDown={handleKeyDown}
              placeholder={ingredients.length === 0 ? "e.g., eggs, pasta, garlic, butter, tomatoes..." : "Add another ingredient (press Enter)..."}
              className="w-full bg-transparent px-2 py-1.5 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none"
            />

            {/* Autocomplete Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute left-0 top-full mt-1.5 w-64 bg-white border border-stone-200 rounded-xl shadow-lg z-30 py-1 overflow-hidden">
                <div className="px-3 py-1 text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
                  Suggestions
                </div>
                {suggestions.map((sug) => (
                  <button
                    key={sug.name}
                    type="button"
                    onClick={() => handleSelectSuggestion(sug.name)}
                    className="w-full px-3 py-1.5 text-left text-sm text-stone-700 hover:bg-amber-50 hover:text-amber-900 flex items-center justify-between cursor-pointer"
                  >
                    <span>{sug.name}</span>
                    <span className="text-xs text-stone-400">{sug.category}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={addCurrentInput}
            disabled={!inputValue.trim()}
            className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 disabled:opacity-30 disabled:hover:bg-stone-900 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 cursor-pointer shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>
      </div>

      {/* Quick-Pick Popular Ingredients Strip */}
      <div className="mt-4">
        <div className="text-xs text-stone-500 font-medium mb-2 flex items-center justify-between">
          <span>Tap to quickly add common ingredients:</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {POPULAR_INGREDIENTS.filter(
            (item) => !ingredients.some((ing) => ing.toLowerCase() === item.name.toLowerCase())
          )
            .slice(0, 10)
            .map((item) => (
              <button
                key={item.name}
                type="button"
                onClick={() => onAddIngredient(item.name)}
                className="px-2.5 py-1 text-xs font-medium text-stone-600 bg-stone-100 hover:bg-amber-100 hover:text-amber-900 rounded-md transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3 text-stone-400" />
                <span>{item.name}</span>
              </button>
            ))}
        </div>
      </div>

      {/* Starter Combos / Inspiration */}
      <div className="mt-6 pt-5 border-t border-stone-100">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
            <ChefHat className="w-4 h-4 text-amber-700" />
            <span>Or try a quick test pantry combo</span>
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {STARTER_KITS.map((kit) => (
            <button
              key={kit.id}
              type="button"
              onClick={() => onLoadStarterKit(kit)}
              className="p-3 text-left border border-stone-200 hover:border-amber-400 hover:bg-amber-50/40 rounded-xl transition-all group cursor-pointer"
            >
              <div className="flex items-center justify-between text-xs font-semibold text-stone-900 group-hover:text-amber-900">
                <span className="truncate">{kit.name}</span>
                <span className="text-[11px] text-stone-500 font-normal shrink-0 ml-1">
                  {kit.badge}
                </span>
              </div>
              <p className="text-[11px] text-stone-500 mt-1 line-clamp-1">
                {kit.ingredients.join(', ')}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Strictness Mode & Preferences Drawer */}
      <div className="mt-6 pt-5 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Strict Mode Toggle */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onToggleStrictMode(!strictMode)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              strictMode ? 'bg-emerald-700' : 'bg-stone-300'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                strictMode ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
          <div>
            <div className="text-xs font-semibold text-stone-900 flex items-center gap-1.5">
              <span>Strict Pantry Mode</span>
              {strictMode ? (
                <span className="text-[11px] text-emerald-700 font-medium">Active (Zero extra ingredients)</span>
              ) : (
                <span className="text-[11px] text-stone-500 font-normal">Off (Allow kitchen staples)</span>
              )}
            </div>
            <p className="text-[11px] text-stone-500">
              {strictMode
                ? 'Only uses what you typed + tap water, salt & pepper. No surprise trips to the store!'
                : 'May use standard pantry staples like cooking oil, butter, milk, or basic flour.'}
            </p>
          </div>
        </div>

        {/* Preferences Toggle Button */}
        <button
          type="button"
          onClick={() => setShowPreferences(!showPreferences)}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer ${
            showPreferences
              ? 'bg-stone-100 border-stone-300 text-stone-900'
              : 'border-stone-200 text-stone-600 hover:text-stone-900 hover:bg-stone-50'
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-stone-500" />
          <span>Refine Preferences ({maxCookTime}m · {mealType})</span>
        </button>
      </div>

      {/* Expanded Preferences Panel */}
      {showPreferences && (
        <div className="mt-4 p-4 bg-stone-50 rounded-xl border border-stone-200 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 animate-in fade-in duration-150">
          {/* Max Cook Time */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1 flex items-center gap-1">
              <Clock className="w-3 h-3 text-stone-500" />
              <span>Max Cook Time</span>
            </label>
            <select
              value={maxCookTime}
              onChange={(e) => onChangeMaxCookTime(Number(e.target.value))}
              className="w-full text-xs font-medium bg-white border border-stone-200 rounded-lg px-2.5 py-1.5 text-stone-800 focus:outline-none focus:border-amber-500"
            >
              <option value={10}>10 mins (Flash meal)</option>
              <option value={15}>15 mins (Super quick)</option>
              <option value={20}>20 mins (Standard weeknight)</option>
              <option value={30}>30 mins (Relaxed)</option>
            </select>
          </div>

          {/* Meal Type */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1 flex items-center gap-1">
              <Flame className="w-3 h-3 text-stone-500" />
              <span>Meal Type</span>
            </label>
            <select
              value={mealType}
              onChange={(e) => onChangeMealType(e.target.value)}
              className="w-full text-xs font-medium bg-white border border-stone-200 rounded-lg px-2.5 py-1.5 text-stone-800 focus:outline-none focus:border-amber-500"
            >
              <option value="any">Any Meal</option>
              <option value="dinner">Dinner</option>
              <option value="lunch">Lunch</option>
              <option value="breakfast">Breakfast</option>
              <option value="late-night">Late-Night Munchies</option>
              <option value="snack">Quick Snack</option>
            </select>
          </div>

          {/* Servings */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1 flex items-center gap-1">
              <Users className="w-3 h-3 text-stone-500" />
              <span>Servings</span>
            </label>
            <select
              value={servings}
              onChange={(e) => onChangeServings(Number(e.target.value))}
              className="w-full text-xs font-medium bg-white border border-stone-200 rounded-lg px-2.5 py-1.5 text-stone-800 focus:outline-none focus:border-amber-500"
            >
              <option value={1}>1 Serving (Solo chef)</option>
              <option value={2}>2 Servings (Couple / Leftovers)</option>
              <option value={4}>4 Servings (Family style)</option>
            </select>
          </div>

          {/* Dietary Focus */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-stone-500" />
              <span>Dietary Filter</span>
            </label>
            <select
              value={dietary}
              onChange={(e) => onChangeDietary(e.target.value)}
              className="w-full text-xs font-medium bg-white border border-stone-200 rounded-lg px-2.5 py-1.5 text-stone-800 focus:outline-none focus:border-amber-500"
            >
              <option value="none">No Restrictions</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="vegan">Vegan</option>
              <option value="dairy-free">Dairy-Free</option>
              <option value="high-protein">High Protein</option>
            </select>
          </div>
        </div>
      )}

      {/* Big Action CTA */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-stone-100">
        <div className="text-xs text-stone-500">
          {ingredients.length === 0 ? (
            <span>Add at least 1 ingredient to whip up recipes.</span>
          ) : (
            <span>Ready with <strong className="text-stone-800 font-semibold">{ingredients.length} ingredients</strong>. Average cook time: ~{maxCookTime}m.</span>
          )}
        </div>

        <button
          type="button"
          onClick={onGenerate}
          disabled={ingredients.length === 0 || isLoading}
          className="w-full sm:w-auto px-7 py-3 text-sm font-semibold text-white bg-amber-700 hover:bg-amber-800 disabled:opacity-40 disabled:hover:bg-amber-700 active:scale-98 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Whipping up recipe with Gemini...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>Whip Up Quick Recipe</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
