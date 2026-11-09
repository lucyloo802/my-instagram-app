/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Utensils,
  ShieldCheck,
  Timer,
  Leaf,
  AlertCircle,
  Smartphone,
  Monitor,
} from 'lucide-react';
import { Header } from './components/Header';
import { IngredientInput } from './components/IngredientInput';
import { RecipeDetail } from './components/RecipeDetail';
import { CookingModeModal } from './components/CookingModeModal';
import { SubstitutionModal } from './components/SubstitutionModal';
import { SavedRecipesModal } from './components/SavedRecipesModal';
import { PhoneSimulator } from './components/PhoneSimulator';
import { MobileBottomNav } from './components/MobileBottomNav';
import { Recipe, StarterKit } from './types/recipe';
import { DEFAULT_RECIPES } from './data/defaultRecipe';

import heroImg from './assets/images/hero_pantry_cooking_1794254980937.jpg';

const STORAGE_SAVED_KEY = 'pantrywhip_saved_recipes';
const STORAGE_PANTRY_KEY = 'pantrywhip_current_pantry';

export default function App() {
  // Mobile phone screen preview mode
  const [viewMode, setViewMode] = useState<'mobile-phone' | 'desktop'>('mobile-phone');
  const [isNativeMobile, setIsNativeMobile] = useState<boolean>(false);

  // Check if browser is already running on a real smartphone screen
  useEffect(() => {
    const checkViewport = () => {
      setIsNativeMobile(window.innerWidth < 640);
    };
    checkViewport();
    window.addEventListener('resize', checkViewport);
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  // Current pantry ingredients
  const [ingredients, setIngredients] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_PANTRY_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return ['eggs', 'pasta', 'garlic', 'olive oil', 'cheddar cheese'];
  });

  // Cooking preferences
  const [strictMode, setStrictMode] = useState<boolean>(true);
  const [maxCookTime, setMaxCookTime] = useState<number>(15);
  const [mealType, setMealType] = useState<string>('any');
  const [servings, setServings] = useState<number>(2);
  const [dietary, setDietary] = useState<string>('none');

  // Generated recipes state (initialized with ready starter recipes for immediate preview)
  const [recipes, setRecipes] = useState<Recipe[]>(DEFAULT_RECIPES);
  const [activeRecipeIndex, setActiveRecipeIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Saved recipes
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_SAVED_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return [];
  });

  // Modals state
  const [cookingModeRecipe, setCookingModeRecipe] = useState<Recipe | null>(null);
  const [substituteIngredient, setSubstituteIngredient] = useState<string | null>(null);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState<boolean>(false);
  const [isRefining, setIsRefining] = useState<boolean>(false);

  // Sync pantry to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PANTRY_KEY, JSON.stringify(ingredients));
    } catch (e) {
      console.warn('Failed to save pantry to local storage:', e);
    }
  }, [ingredients]);

  // Sync saved recipes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_SAVED_KEY, JSON.stringify(savedRecipes));
    } catch (e) {
      console.warn('Failed to save recipes to local storage:', e);
    }
  }, [savedRecipes]);

  // Add / remove ingredient handlers
  const handleAddIngredient = (name: string) => {
    const trimmed = name.trim();
    if (trimmed && !ingredients.some((i) => i.toLowerCase() === trimmed.toLowerCase())) {
      setIngredients((prev) => [...prev, trimmed]);
    }
  };

  const handleRemoveIngredient = (index: number) => {
    setIngredients((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClearAll = () => {
    setIngredients([]);
  };

  const handleLoadStarterKit = (kit: StarterKit) => {
    setIngredients(kit.ingredients);
  };

  // Recipe generation
  const handleGenerate = async () => {
    if (ingredients.length === 0) return;

    setIsLoading(true);
    setError(null);

    // Scroll to results or indicator
    setTimeout(() => {
      const el = document.getElementById('results-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);

    try {
      const res = await fetch('/api/recipe/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ingredients,
          strictMode,
          maxCookTime,
          mealType,
          servings,
          dietary,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Error ${res.status}: Failed to generate recipe`);
      }

      const data = await res.json();
      if (!data.recipes || data.recipes.length === 0) {
        throw new Error('No recipes could be formulated with these exact ingredients.');
      }

      setRecipes(data.recipes);
      setActiveRecipeIndex(0);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred while generating recipes.');
    } finally {
      setIsLoading(false);
    }
  };

  // Refine active recipe
  const handleRefineRecipe = async (instruction: string) => {
    const currentRecipe = recipes[activeRecipeIndex];
    if (!currentRecipe) return;

    setIsRefining(true);
    try {
      const res = await fetch('/api/recipe/refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipe: currentRecipe,
          refinementInstruction: instruction,
          ingredients,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to refine recipe');
      }

      const data = await res.json();
      if (data.recipes && data.recipes.length > 0) {
        const updated = [...recipes];
        updated[activeRecipeIndex] = data.recipes[0];
        setRecipes(updated);
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Could not tweak recipe');
    } finally {
      setIsRefining(false);
    }
  };

  // Toggle save recipe
  const handleToggleSave = (recipe: Recipe) => {
    setSavedRecipes((prev) => {
      const exists = prev.some((r) => r.id === recipe.id || r.title === recipe.title);
      if (exists) {
        return prev.filter((r) => r.id !== recipe.id && r.title !== recipe.title);
      }
      return [recipe, ...prev];
    });
  };

  const handleDeleteSaved = (id: string) => {
    setSavedRecipes((prev) => prev.filter((r) => r.id !== id));
  };

  const isCurrentRecipeSaved = (recipe: Recipe) => {
    return savedRecipes.some((r) => r.id === recipe.id || r.title === recipe.title);
  };

  const activeRecipe = recipes[activeRecipeIndex];

  // Core App UI Content
  const appContent = (
    <div className="min-h-full bg-[#FAFAF7] text-stone-900 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Bar Header */}
      <Header
        onWhipClick={() => {
          const el = document.getElementById('pantry-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onSavedClick={() => setIsSavedModalOpen(true)}
        savedCount={savedRecipes.length}
        onSelectStarter={() => {
          const el = document.getElementById('pantry-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onHowItWorksClick={() => {
          const el = document.getElementById('how-it-works');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        viewMode={viewMode}
        onToggleViewMode={() => setViewMode(viewMode === 'mobile-phone' ? 'desktop' : 'mobile-phone')}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12 space-y-8 sm:space-y-12">
        {/* Hero Section */}
        <section id="home" className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
          <div className="lg:col-span-7 space-y-3 sm:space-y-5">
            <div className="flex items-center gap-2 text-[11px] sm:text-xs font-semibold text-amber-800 uppercase tracking-wider">
              <span>Zero-Waste Cooking</span>
              <span aria-hidden="true">·</span>
              <span>No Grocery Run Needed</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold font-display tracking-tight text-stone-950 leading-[1.15]">
              Tell us what you have. We'll whip up dinner right now.
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-stone-600 leading-relaxed max-w-2xl">
              Tired of recipes demanding 14 exotic spices you don't own? Enter whatever items are sitting in your fridge and pantry. We craft quick, delicious meals strictly using what you have.
            </p>

            {/* Micro Trust Indicators */}
            <div className="pt-1 flex flex-wrap items-center gap-3 sm:gap-6 text-xs text-stone-600">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>Strict pantry enforcement</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Timer className="w-4 h-4 text-amber-700" />
                <span>Built-in interactive timers</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Leaf className="w-4 h-4 text-emerald-700" />
                <span>Zero food waste</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual */}
          <div className="lg:col-span-5 h-48 sm:h-72 lg:h-80 rounded-2xl sm:rounded-3xl overflow-hidden border border-stone-200/90 shadow-sm relative group bg-stone-100">
            <img
              src={heroImg}
              alt="Fresh kitchen ingredients on rustic table"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent flex items-end p-4 sm:p-5">
              <p className="text-xs text-stone-100 font-medium">
                Pantry staples transformed into Michelin-inspired weeknight dishes.
              </p>
            </div>
          </div>
        </section>

        {/* Pantry Tag Input & Controls Section */}
        <IngredientInput
          ingredients={ingredients}
          onAddIngredient={handleAddIngredient}
          onRemoveIngredient={handleRemoveIngredient}
          onClearAll={handleClearAll}
          onLoadStarterKit={handleLoadStarterKit}
          strictMode={strictMode}
          onToggleStrictMode={setStrictMode}
          maxCookTime={maxCookTime}
          onChangeMaxCookTime={setMaxCookTime}
          mealType={mealType}
          onChangeMealType={setMealType}
          servings={servings}
          onChangeServings={setServings}
          dietary={dietary}
          onChangeDietary={setDietary}
          onGenerate={handleGenerate}
          isLoading={isLoading}
        />

        {/* Results / Recipe Display Section */}
        <section id="results-section" className="space-y-6 pt-2">
          {isLoading && (
            <div className="bg-white rounded-3xl border border-stone-200 p-8 sm:p-12 text-center space-y-4 shadow-sm animate-pulse">
              <div className="w-12 h-12 bg-amber-100 text-amber-800 rounded-2xl flex items-center justify-center mx-auto">
                <Utensils className="w-6 h-6 animate-bounce" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold font-display text-stone-900">
                Whipping up your custom dish...
              </h3>
              <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto">
                Analyzing your {ingredients.length} ingredients with strict pantry logic to design the fastest, most delicious meal with zero extra trips to the store.
              </p>
            </div>
          )}

          {error && (
            <div className="bg-rose-50 border border-rose-200 rounded-3xl p-5 sm:p-8 flex items-start gap-4 text-rose-900">
              <AlertCircle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
              <div className="space-y-2 flex-1">
                <h4 className="font-bold text-sm sm:text-base font-display">Could not formulate recipe</h4>
                <p className="text-xs sm:text-sm text-rose-800">{error}</p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleGenerate}
                    className="px-4 py-2 bg-rose-900 hover:bg-rose-800 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          )}

          {recipes.length > 0 && !isLoading && (
            <div className="space-y-5">
              {/* Recipe Selector Tabs (if multiple options generated) */}
              {recipes.length > 1 && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1">
                  <div className="flex items-center gap-1.5 p-1 bg-stone-200/70 rounded-xl overflow-x-auto">
                    {recipes.map((rec, idx) => (
                      <button
                        key={rec.id || idx}
                        type="button"
                        onClick={() => setActiveRecipeIndex(idx)}
                        className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                          activeRecipeIndex === idx
                            ? 'bg-white text-stone-900 shadow-sm'
                            : 'text-stone-600 hover:text-stone-900'
                        }`}
                      >
                        <span>{idx === 0 ? 'Option 1: Fastest' : 'Option 2: Twist'}</span>
                        <span className="ml-1 text-stone-400 font-normal">
                          ({rec.prepTimeMinutes + rec.cookTimeMinutes}m)
                        </span>
                      </button>
                    ))}
                  </div>

                  <span className="text-xs text-stone-500 hidden sm:inline">
                    2 recipe concepts crafted with your ingredients
                  </span>
                </div>
              )}

              {/* Active Recipe Detail View */}
              {activeRecipe && (
                <RecipeDetail
                  recipe={activeRecipe}
                  isSaved={isCurrentRecipeSaved(activeRecipe)}
                  onToggleSave={handleToggleSave}
                  onStartCookingMode={(rec) => setCookingModeRecipe(rec)}
                  onOpenSubstitute={(ingName) => setSubstituteIngredient(ingName)}
                  onRefineRecipe={handleRefineRecipe}
                  isRefining={isRefining}
                />
              )}
            </div>
          )}
        </section>

        {/* How It Works & Culinary Principles Section */}
        <section id="how-it-works" className="pt-8 border-t border-stone-200 space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
              The PantryWhip Philosophy
            </span>
            <h2 className="text-xl sm:text-3xl font-bold font-display text-stone-950">
              Cooking should be fun, quick, and waste-free.
            </h2>
            <p className="text-xs sm:text-sm text-stone-600">
              Three rules that make our recipes actually cookable in real homes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 pt-2">
            <div className="p-5 sm:p-6 rounded-2xl bg-white border border-stone-200/80 shadow-2xs space-y-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold font-display text-xs">
                01
              </div>
              <h3 className="font-bold text-stone-900 text-sm sm:text-base font-display">
                Strict Ingredient Discipline
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                When you activate Strict Mode, we guarantee the recipe won't suddenly ask for shallots, white wine, or heavy cream you don't possess. Only water, salt, and pepper are assumed.
              </p>
            </div>

            <div className="p-5 sm:p-6 rounded-2xl bg-white border border-stone-200/80 shadow-2xs space-y-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold font-display text-xs">
                02
              </div>
              <h3 className="font-bold text-stone-900 text-sm sm:text-base font-display">
                Hands-Free Cooking Assistant
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Every step with heat or simmering features embedded countdown timers with clear auditory chimes. Pop into full-screen Cooking Mode and follow along without greasy screen taps.
              </p>
            </div>

            <div className="p-5 sm:p-6 rounded-2xl bg-white border border-stone-200/80 shadow-2xs space-y-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold font-display text-xs">
                03
              </div>
              <h3 className="font-bold text-stone-900 text-base font-display">
                Smart Dynamic Substitutions
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Run low on an ingredient during cooking? Tap "Swap" beside any item on the checklist to get culinary-approved alternative ratios from your remaining supplies.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200 bg-white mt-12 py-6 mb-16 md:mb-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-stone-800">PantryWhip</span>
            <span>·</span>
            <span>Zero-waste recipes tailored to your kitchen</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-stone-900 transition-colors cursor-pointer"
            >
              Back to top ↑
            </button>
          </div>
        </div>
      </footer>

      {/* Mobile Ergonomic Bottom Tab Bar */}
      <MobileBottomNav
        onPantryClick={() => {
          const el = document.getElementById('pantry-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onWhipClick={handleGenerate}
        onSavedClick={() => setIsSavedModalOpen(true)}
        savedCount={savedRecipes.length}
        ingredientsCount={ingredients.length}
        isLoading={isLoading}
        hasActiveRecipe={!!activeRecipe}
        onCookClick={activeRecipe ? () => setCookingModeRecipe(activeRecipe) : undefined}
      />

      {/* Modals */}
      {cookingModeRecipe && (
        <CookingModeModal
          recipe={cookingModeRecipe}
          isOpen={!!cookingModeRecipe}
          onClose={() => setCookingModeRecipe(null)}
        />
      )}

      {substituteIngredient && (
        <SubstitutionModal
          isOpen={!!substituteIngredient}
          onClose={() => setSubstituteIngredient(null)}
          defaultIngredient={substituteIngredient}
          currentIngredients={ingredients}
        />
      )}

      <SavedRecipesModal
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        savedRecipes={savedRecipes}
        onSelectRecipe={(rec) => {
          setRecipes([rec]);
          setActiveRecipeIndex(0);
          const el = document.getElementById('results-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onDeleteRecipe={handleDeleteSaved}
      />
    </div>
  );

  // If already on a native physical mobile device, render natively without the redundant double chassis
  if (isNativeMobile || viewMode === 'desktop') {
    return (
      <div className="relative">
        {/* Floating Switcher Pill on Desktop to jump into Mobile Phone Screen Simulator */}
        {viewMode === 'desktop' && !isNativeMobile && (
          <div className="fixed bottom-5 right-5 z-40 bg-stone-900/90 hover:bg-stone-900 backdrop-blur-md text-white px-3.5 py-2 rounded-full shadow-xl border border-stone-700/60 flex items-center gap-2 cursor-pointer transition-all hover:scale-105">
            <button
              type="button"
              onClick={() => setViewMode('mobile-phone')}
              className="flex items-center gap-2 text-xs font-semibold cursor-pointer"
            >
              <Smartphone className="w-4 h-4 text-amber-400" />
              <span>Preview in Mobile Phone Screen</span>
            </button>
          </div>
        )}
        {appContent}
      </div>
    );
  }

  // Render inside the realistic flagship smartphone frame
  return (
    <PhoneSimulator onExitMobilePreview={() => setViewMode('desktop')}>
      {appContent}
    </PhoneSimulator>
  );
}
