import React from 'react';
import { Sparkles, Utensils, Bookmark, ChefHat } from 'lucide-react';

interface MobileBottomNavProps {
  onPantryClick: () => void;
  onWhipClick: () => void;
  onSavedClick: () => void;
  savedCount: number;
  ingredientsCount: number;
  isLoading: boolean;
  hasActiveRecipe: boolean;
  onCookClick?: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  onPantryClick,
  onWhipClick,
  onSavedClick,
  savedCount,
  ingredientsCount,
  isLoading,
  hasActiveRecipe,
  onCookClick,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 px-4 py-2 flex items-center justify-between gap-2 shadow-lg md:hidden">
      {/* Tab 1: Pantry */}
      <button
        type="button"
        onClick={onPantryClick}
        className="flex-1 min-h-[44px] flex flex-col items-center justify-center text-stone-600 hover:text-stone-900 active:scale-95 transition-all cursor-pointer"
      >
        <div className="relative">
          <Utensils className="w-5 h-5 text-stone-700" />
          {ingredientsCount > 0 && (
            <span className="absolute -top-1.5 -right-2 bg-amber-700 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
              {ingredientsCount}
            </span>
          )}
        </div>
        <span className="text-[10px] font-medium tracking-tight mt-1">Pantry</span>
      </button>

      {/* Tab 2 (Center Hero): Whip Up / Cook */}
      {hasActiveRecipe && onCookClick ? (
        <button
          type="button"
          onClick={onCookClick}
          className="flex-2 min-h-[44px] px-3 py-2 bg-amber-700 active:bg-amber-800 text-white rounded-xl shadow-md flex items-center justify-center gap-1.5 active:scale-98 transition-all cursor-pointer"
        >
          <ChefHat className="w-4 h-4" />
          <span className="text-xs font-bold tracking-tight">Cook Mode</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={onWhipClick}
          disabled={ingredientsCount === 0 || isLoading}
          className="flex-2 min-h-[44px] px-3 py-2 bg-stone-900 hover:bg-stone-800 disabled:opacity-40 text-white rounded-xl shadow-md flex items-center justify-center gap-1.5 active:scale-98 transition-all cursor-pointer"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4 text-amber-300" />
          )}
          <span className="text-xs font-bold tracking-tight">Whip Up Recipe</span>
        </button>
      )}

      {/* Tab 3: Saved Recipes */}
      <button
        type="button"
        onClick={onSavedClick}
        className="flex-1 min-h-[44px] flex flex-col items-center justify-center text-stone-600 hover:text-stone-900 active:scale-95 transition-all cursor-pointer"
      >
        <div className="relative">
          <Bookmark className="w-5 h-5 text-stone-700" />
          {savedCount > 0 && (
            <span className="absolute -top-1.5 -right-2 bg-amber-100 text-amber-900 text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center border border-amber-300">
              {savedCount}
            </span>
          )}
        </div>
        <span className="text-[10px] font-medium tracking-tight mt-1">Saved</span>
      </button>
    </nav>
  );
};
