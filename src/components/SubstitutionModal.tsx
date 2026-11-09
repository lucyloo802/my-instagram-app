import React, { useState } from 'react';
import { X, ArrowRight, Lightbulb, RefreshCw } from 'lucide-react';
import { SubstitutionResult } from '../types/recipe';

interface SubstitutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultIngredient?: string;
  currentIngredients: string[];
}

export const SubstitutionModal: React.FC<SubstitutionModalProps> = ({
  isOpen,
  onClose,
  defaultIngredient = '',
  currentIngredients,
}) => {
  const [ingredientToSwap, setIngredientToSwap] = useState(defaultIngredient);
  const [result, setResult] = useState<SubstitutionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFetchSubstitute = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!ingredientToSwap.trim()) return;

    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/recipe/substitute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ingredient: ingredientToSwap.trim(),
          currentIngredients,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to fetch substitutes');
      }

      const data: SubstitutionResult = await res.json();
      setResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error finding substitutes');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 overflow-hidden relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <Lightbulb className="w-5 h-5 text-amber-600" />
          <h3 className="text-lg font-bold text-stone-900 font-display">
            Smart Ingredient Substitution
          </h3>
        </div>
        <p className="text-xs text-stone-500 mb-4">
          Missing an ingredient? We'll figure out the best pantry swap or culinary technique to keep your recipe delicious.
        </p>

        <form onSubmit={handleFetchSubstitute} className="flex gap-2 mb-5">
          <input
            type="text"
            value={ingredientToSwap}
            onChange={(e) => setIngredientToSwap(e.target.value)}
            placeholder="e.g. butter, eggs, soy sauce, heavy cream..."
            className="flex-1 text-sm bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-amber-600 focus:bg-white"
          />
          <button
            type="submit"
            disabled={!ingredientToSwap.trim() || isLoading}
            className="px-4 py-2 bg-stone-900 hover:bg-stone-800 disabled:opacity-40 text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            {isLoading ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <ArrowRight className="w-3.5 h-3.5" />
            )}
            <span>Find Swaps</span>
          </button>
        </form>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-lg mb-4">
            {error}
          </div>
        )}

        {result && (
          <div className="space-y-3.5 max-h-[380px] overflow-y-auto pr-1">
            <div className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              Recommended Alternatives:
            </div>

            {result.substitutes.map((sub, i) => (
              <div
                key={i}
                className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/70 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-900 text-sm">{sub.name}</span>
                  <span className="text-xs font-mono font-medium text-amber-900 bg-amber-100/80 px-2 py-0.5 rounded">
                    {sub.ratio}
                  </span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">{sub.explanation}</p>
                {sub.isFromCurrentIngredients && (
                  <span className="inline-block text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                    Already in your pantry list!
                  </span>
                )}
              </div>
            ))}

            {result.proTip && (
              <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl text-xs text-amber-950">
                <strong className="font-semibold block mb-0.5 text-amber-900">Chef's Advice:</strong>
                {result.proTip}
              </div>
            )}
          </div>
        )}

        <div className="mt-5 pt-4 border-t border-stone-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
