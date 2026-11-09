import React, { useState } from 'react';
import {
  Clock,
  Flame,
  Bookmark,
  BookmarkCheck,
  Share2,
  Play,
  Lightbulb,
  Check,
  RotateCw,
  Sparkles,
  UtensilsCrossed,
  HelpCircle,
  Copy,
  Printer,
} from 'lucide-react';
import { Recipe } from '../types/recipe';
import { CookingTimer } from './CookingTimer';

// Image assets generated via generate_image tool
import pastaImg from '../assets/images/recipe_dish_pasta_1794254980750.jpg';
import bowlImg from '../assets/images/recipe_dish_bowl_1794254981601.jpg';
import soupImg from '../assets/images/recipe_dish_soup_1794254982474.jpg';

interface RecipeDetailProps {
  recipe: Recipe;
  isSaved: boolean;
  onToggleSave: (recipe: Recipe) => void;
  onStartCookingMode: (recipe: Recipe) => void;
  onOpenSubstitute: (ingredientName: string) => void;
  onRefineRecipe: (instruction: string) => void;
  isRefining: boolean;
}

export const RecipeDetail: React.FC<RecipeDetailProps> = ({
  recipe,
  isSaved,
  onToggleSave,
  onStartCookingMode,
  onOpenSubstitute,
  onRefineRecipe,
  isRefining,
}) => {
  const [checkedIngredients, setCheckedIngredients] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [customTweak, setCustomTweak] = useState('');
  const [showTweakInput, setShowTweakInput] = useState(false);

  // Pick suitable dish image based on recipe title
  const getDishImage = (title: string) => {
    const lower = title.toLowerCase();
    if (lower.includes('pasta') || lower.includes('noodle') || lower.includes('spaghetti')) {
      return pastaImg;
    }
    if (lower.includes('soup') || lower.includes('broth') || lower.includes('stew') || lower.includes('bean')) {
      return soupImg;
    }
    return bowlImg;
  };

  const dishImage = getDishImage(recipe.title);

  const toggleIngredient = (name: string) => {
    setCheckedIngredients((prev) =>
      prev.includes(name) ? prev.filter((i) => i !== name) : [...prev, name]
    );
  };

  const handleCopy = () => {
    const text = `🍽️ ${recipe.title}\n${recipe.tagline}\n\nTime: ${recipe.prepTimeMinutes + recipe.cookTimeMinutes} mins | Servings: ${recipe.servings}\n\nIngredients:\n${recipe.ingredientsUsed.map((i) => `- ${i.amount} ${i.name}`).join('\n')}\n\nInstructions:\n${recipe.steps.map((s) => `${s.stepNumber}. ${s.instruction}`).join('\n')}\n\nChef's Secret: ${recipe.chefSecret}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const totalTime = recipe.prepTimeMinutes + recipe.cookTimeMinutes;

  return (
    <article className="bg-white rounded-3xl border border-stone-200/90 shadow-sm overflow-hidden">
      {/* Top Banner / Image Header */}
      <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-stone-900">
        <img
          src={dishImage}
          alt={recipe.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover opacity-90 hover:scale-102 transition-transform duration-700"
        />
        {/* Scrim for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/40 to-transparent" />

        {/* Floating Top Controls */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="p-2.5 bg-black/40 hover:bg-black/60 backdrop-blur-md text-white rounded-xl transition-all cursor-pointer shadow-sm"
            title="Copy Recipe to Clipboard"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="p-2.5 bg-black/40 hover:bg-black/60 backdrop-blur-md text-white rounded-xl transition-all cursor-pointer shadow-sm hidden sm:block"
            title="Print Recipe"
          >
            <Printer className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onToggleSave(recipe)}
            className={`p-2.5 backdrop-blur-md rounded-xl transition-all cursor-pointer shadow-sm flex items-center gap-1.5 text-xs font-semibold ${
              isSaved
                ? 'bg-amber-600 text-white'
                : 'bg-black/40 hover:bg-black/60 text-white'
            }`}
          >
            {isSaved ? (
              <>
                <BookmarkCheck className="w-4 h-4" />
                <span>Saved</span>
              </>
            ) : (
              <>
                <Bookmark className="w-4 h-4" />
                <span>Save Recipe</span>
              </>
            )}
          </button>
        </div>

        {/* Overlay Content */}
        <div className="absolute bottom-6 left-6 right-6 text-white">
          <div className="flex items-center gap-2 text-xs font-medium text-amber-200/90 mb-1">
            <span>Ready in {totalTime} minutes</span>
            <span aria-hidden="true">·</span>
            <span>{recipe.servings} Servings</span>
            {recipe.caloriesEstimate && (
              <>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">~{recipe.caloriesEstimate} kcal</span>
              </>
            )}
            <span aria-hidden="true">·</span>
            <span>{recipe.difficulty}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-white leading-tight">
            {recipe.title}
          </h2>
          <p className="text-xs sm:text-sm text-stone-200 mt-1 max-w-2xl line-clamp-2">
            {recipe.tagline}
          </p>
        </div>
      </div>

      {/* Main Recipe Body */}
      <div className="p-6 sm:p-8 space-y-8">
        {/* Quick Highlights Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-stone-100">
          <div className="flex flex-wrap items-center gap-4 text-xs text-stone-600">
            <div className="flex items-center gap-1.5 font-medium">
              <Clock className="w-4 h-4 text-amber-700" />
              <span>Prep: <strong className="text-stone-900 tabular-nums">{recipe.prepTimeMinutes}m</strong></span>
              <span className="text-stone-300">/</span>
              <span>Cook: <strong className="text-stone-900 tabular-nums">{recipe.cookTimeMinutes}m</strong></span>
            </div>

            {recipe.macroBreakdown && (
              <div className="hidden md:flex items-center gap-2 font-mono text-[11px] text-stone-500 bg-stone-50 px-2.5 py-1 rounded-lg border border-stone-200/70">
                <span>P: {recipe.macroBreakdown.protein}</span>
                <span className="text-stone-300">·</span>
                <span>C: {recipe.macroBreakdown.carbs}</span>
                <span className="text-stone-300">·</span>
                <span>F: {recipe.macroBreakdown.fat}</span>
              </div>
            )}

            {recipe.cleanUpRating && (
              <div className="text-stone-500">
                Clean-up: <strong className="text-stone-800">{recipe.cleanUpRating}</strong>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => onStartCookingMode(recipe)}
            className="px-5 py-2.5 bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold rounded-xl shadow-sm hover:shadow transition-all flex items-center gap-2 cursor-pointer shrink-0"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Start Step-by-Step Cooking Mode</span>
          </button>
        </div>

        {/* 2-Column Split: Ingredients (Left) & Instructions (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Ingredients Column (5 cols) */}
          <div className="lg:col-span-5 bg-stone-50/70 rounded-2xl p-5 border border-stone-200/80 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900 flex items-center gap-2 font-display">
                <UtensilsCrossed className="w-4 h-4 text-amber-700" />
                <span>Ingredients Checklist</span>
              </h3>
              <span className="text-xs text-stone-500 tabular-nums">
                {checkedIngredients.length}/{recipe.ingredientsUsed.length} prepped
              </span>
            </div>

            <p className="text-xs text-stone-500">
              Check off items as you measure and prep them:
            </p>

            <ul className="space-y-2">
              {recipe.ingredientsUsed.map((ing) => {
                const isChecked = checkedIngredients.includes(ing.name);
                return (
                  <li
                    key={ing.name}
                    className={`flex items-start justify-between gap-3 p-2.5 rounded-xl border transition-colors ${
                      isChecked
                        ? 'bg-emerald-50/50 border-emerald-200 text-stone-400'
                        : 'bg-white border-stone-200/90 text-stone-800'
                    }`}
                  >
                    <label className="flex items-start gap-2.5 flex-1 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleIngredient(ing.name)}
                        className="mt-0.5 w-4 h-4 text-amber-700 rounded border-stone-300 focus:ring-amber-500 cursor-pointer"
                      />
                      <div className="text-xs">
                        <span className={`font-semibold ${isChecked ? 'line-through text-stone-400' : 'text-stone-900'}`}>
                          {ing.amount} {ing.name}
                        </span>
                        {ing.notes && (
                          <span className="block text-[11px] text-stone-500 italic mt-0.5">
                            {ing.notes}
                          </span>
                        )}
                        {!ing.isUserIngredient && (
                          <span className="inline-block text-[10px] text-amber-800 font-medium mt-0.5">
                            Standard staple
                          </span>
                        )}
                      </div>
                    </label>

                    <button
                      type="button"
                      onClick={() => onOpenSubstitute(ing.name)}
                      className="text-[11px] text-stone-400 hover:text-amber-800 hover:underline flex items-center gap-0.5 shrink-0 pt-0.5 cursor-pointer"
                      title={`Need a substitute for ${ing.name}?`}
                    >
                      <HelpCircle className="w-3 h-3" />
                      <span>Swap</span>
                    </button>
                  </li>
                );
              })}
            </ul>

            {/* Optional additions if flexible */}
            {recipe.optionalAdditionsIfAvailable && recipe.optionalAdditionsIfAvailable.length > 0 && (
              <div className="pt-3 border-t border-stone-200">
                <span className="text-xs font-semibold text-stone-700 block mb-1.5">
                  Optional Flavor Boosters (If you happen to have them):
                </span>
                <ul className="space-y-1.5 text-xs text-stone-600">
                  {recipe.optionalAdditionsIfAvailable.map((opt, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-amber-700 font-bold">+</span>
                      <span>
                        <strong className="text-stone-800">{opt.name}:</strong> {opt.why}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Steps & Instructions Column (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900 font-display mb-1">
                Preparation & Cooking Steps
              </h3>
              <p className="text-xs text-stone-500">
                Follow each step in sequence. Use the embedded timers for precision:
              </p>
            </div>

            <ol className="space-y-5">
              {recipe.steps.map((step) => (
                <li
                  key={step.stepNumber}
                  className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs hover:border-amber-200 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-stone-900 text-white text-xs font-bold shrink-0 mt-0.5">
                      {step.stepNumber}
                    </span>
                    <div className="flex-1 space-y-2">
                      <p className="text-sm text-stone-800 font-medium leading-relaxed">
                        {step.instruction}
                      </p>

                      {step.tip && (
                        <div className="text-xs text-amber-900 bg-amber-50/70 rounded-lg p-2 border border-amber-200/60">
                          <strong className="font-semibold mr-1">Pro Tip:</strong>
                          <span>{step.tip}</span>
                        </div>
                      )}

                      {/* Embedded Timer */}
                      {step.timerSeconds && step.timerSeconds > 0 && (
                        <CookingTimer
                          initialSeconds={step.timerSeconds}
                          label={`Step ${step.stepNumber} Timer`}
                        />
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ol>

            {/* Chef Secret Callout Box */}
            <div className="p-4 sm:p-5 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/80 rounded-2xl text-stone-900">
              <div className="flex items-center gap-2 mb-1 text-amber-900 font-bold text-sm font-display">
                <Lightbulb className="w-4 h-4 text-amber-700" />
                <span>The Chef's Secret for this Dish</span>
              </div>
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                {recipe.chefSecret}
              </p>
            </div>

            {/* Quick Refine Recipe Strip */}
            <div className="pt-4 border-t border-stone-100">
              <div className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2 flex items-center justify-between">
                <span>Want to tweak this recipe?</span>
                <button
                  type="button"
                  onClick={() => setShowTweakInput(!showTweakInput)}
                  className="text-xs text-amber-800 font-medium hover:underline cursor-pointer"
                >
                  {showTweakInput ? 'Hide custom tweak' : 'Custom tweak'}
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {[
                  'Make it spicier with heat',
                  'Cut cooking time under 10m',
                  'Make it extra crispy',
                  'Make it kid-friendly & mild',
                  'One-pot / zero dishes version',
                ].map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    disabled={isRefining}
                    onClick={() => onRefineRecipe(prompt)}
                    className="px-3 py-1.5 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-amber-100 hover:text-amber-900 rounded-lg transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
                  >
                    <Sparkles className="w-3 h-3 text-amber-700" />
                    <span>{prompt}</span>
                  </button>
                ))}
              </div>

              {showTweakInput && (
                <div className="mt-3 flex gap-2">
                  <input
                    type="text"
                    value={customTweak}
                    onChange={(e) => setCustomTweak(e.target.value)}
                    placeholder="e.g., 'I want a sauce that clings to the pasta' or 'make it crunchier'..."
                    className="flex-1 text-xs bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:border-amber-600 focus:bg-white"
                  />
                  <button
                    type="button"
                    disabled={!customTweak.trim() || isRefining}
                    onClick={() => {
                      if (customTweak.trim()) {
                        onRefineRecipe(customTweak.trim());
                        setCustomTweak('');
                      }
                    }}
                    className="px-4 py-2 bg-stone-900 hover:bg-stone-800 disabled:opacity-40 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer shrink-0"
                  >
                    {isRefining ? 'Tweak in progress...' : 'Apply Tweak'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};
