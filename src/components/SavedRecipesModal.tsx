import React from 'react';
import { X, Trash2, Clock, Play, BookOpen, ArrowUpRight } from 'lucide-react';
import { Recipe } from '../types/recipe';

interface SavedRecipesModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedRecipes: Recipe[];
  onSelectRecipe: (recipe: Recipe) => void;
  onDeleteRecipe: (id: string) => void;
}

export const SavedRecipesModal: React.FC<SavedRecipesModalProps> = ({
  isOpen,
  onClose,
  savedRecipes,
  onSelectRecipe,
  onDeleteRecipe,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 max-h-[85vh] flex flex-col relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-700" />
            <h2 className="text-xl font-bold font-display text-stone-900">
              Saved Pantry Recipes ({savedRecipes.length})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          {savedRecipes.length === 0 ? (
            <div className="text-center py-12 text-stone-500 space-y-2">
              <p className="text-sm font-medium">No saved recipes yet.</p>
              <p className="text-xs text-stone-400">
                When you whip up a recipe you love, click "Save Recipe" to keep it here for quick access.
              </p>
            </div>
          ) : (
            savedRecipes.map((rec) => (
              <div
                key={rec.id}
                className="p-4 rounded-2xl border border-stone-200 bg-stone-50 hover:bg-white hover:border-amber-300 transition-all flex items-center justify-between gap-4 group"
              >
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-stone-900 text-sm font-display truncate">
                    {rec.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-stone-500 mt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-stone-400" />
                      <span>{rec.prepTimeMinutes + rec.cookTimeMinutes} mins</span>
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{rec.ingredientsUsed.length} ingredients</span>
                    <span aria-hidden="true">·</span>
                    <span>{rec.difficulty}</span>
                  </div>
                  <p className="text-xs text-stone-500 truncate mt-1">
                    {rec.ingredientsUsed.map((i) => i.name).join(', ')}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      onSelectRecipe(rec);
                      onClose();
                    }}
                    className="px-3.5 py-1.5 bg-stone-900 hover:bg-amber-700 text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>Cook</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onDeleteRecipe(rec.id)}
                    className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Delete recipe"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-stone-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
