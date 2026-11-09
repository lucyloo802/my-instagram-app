import React from 'react';
import { Sparkles, Bookmark, CookingPot, Smartphone, Monitor } from 'lucide-react';

interface HeaderProps {
  onWhipClick: () => void;
  onSavedClick: () => void;
  savedCount: number;
  onSelectStarter: () => void;
  onHowItWorksClick: () => void;
  viewMode?: 'desktop' | 'mobile-phone';
  onToggleViewMode?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onWhipClick,
  onSavedClick,
  savedCount,
  onSelectStarter,
  onHowItWorksClick,
  viewMode = 'desktop',
  onToggleViewMode,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FAFAF7]/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 sm:gap-8">
        {/* Zone 1: Brand wordmark */}
        <a
          href="#home"
          className="text-xl font-bold tracking-tight text-stone-900 font-display flex items-center gap-2 whitespace-nowrap shrink-0 hover:text-amber-800 transition-colors"
        >
          <CookingPot className="w-5 h-5 text-amber-700" />
          <span>PantryWhip</span>
        </a>

        {/* Zone 2: 4-5 single-line clean navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-600">
          <a
            href="#pantry-section"
            className="hover:text-stone-900 transition-colors whitespace-nowrap shrink-0"
          >
            My Pantry
          </a>
          <button
            onClick={onSelectStarter}
            className="hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 text-left"
          >
            Starter Combos
          </button>
          <button
            onClick={onSavedClick}
            className="hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <Bookmark className="w-3.5 h-3.5 text-stone-500" />
            <span>Saved Recipes</span>
            {savedCount > 0 && (
              <span className="text-xs font-semibold tabular-nums text-amber-800 bg-amber-100 rounded px-1.5 py-0.2">
                {savedCount}
              </span>
            )}
          </button>
          <button
            onClick={onHowItWorksClick}
            className="hover:text-stone-900 transition-colors whitespace-nowrap shrink-0"
          >
            How It Works
          </button>
        </nav>

        {/* Zone 3: 1 primary action + view mode toggle */}
        <div className="flex items-center gap-2 shrink-0">
          {onToggleViewMode && (
            <button
              type="button"
              onClick={onToggleViewMode}
              className="px-2.5 py-1.5 text-xs font-medium text-stone-700 hover:text-stone-950 bg-stone-100 hover:bg-stone-200 border border-stone-200/80 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
              title={viewMode === 'mobile-phone' ? 'Switch to Full Desktop View' : 'Show Mobile Phone Screen View'}
            >
              {viewMode === 'mobile-phone' ? (
                <>
                  <Monitor className="w-3.5 h-3.5 text-stone-600" />
                  <span className="hidden sm:inline">Desktop</span>
                </>
              ) : (
                <>
                  <Smartphone className="w-3.5 h-3.5 text-amber-700" />
                  <span className="hidden sm:inline">Phone View</span>
                </>
              )}
            </button>
          )}

          <button
            onClick={onWhipClick}
            className="px-3.5 sm:px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 active:scale-98 rounded-lg shadow-sm transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Whip Up</span>
          </button>
        </div>
      </div>
    </header>
  );
};
