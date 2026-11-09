import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  Monitor,
  Wifi,
  Battery,
  RotateCcw,
  Sparkles,
  Layers,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';

interface PhoneSimulatorProps {
  children: React.ReactNode;
  onExitMobilePreview: () => void;
}

type DeviceModel = 'iphone16pro' | 'pixel9' | 'iphoneSE';
type DeviceColor = 'titanium' | 'midnight' | 'gold';

export const PhoneSimulator: React.FC<PhoneSimulatorProps> = ({
  children,
  onExitMobilePreview,
}) => {
  const [deviceModel, setDeviceModel] = useState<DeviceModel>('iphone16pro');
  const [deviceColor, setDeviceColor] = useState<DeviceColor>('titanium');
  const [scale, setScale] = useState<number>(0.92);
  const [currentTime, setCurrentTime] = useState<string>('9:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const formatted = `${hours % 12 || 12}:${minutes < 10 ? '0' : ''}${minutes}`;
      setCurrentTime(formatted);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  // Dimensions based on selected phone model
  const deviceDimensions = {
    iphone16pro: {
      width: 393,
      height: 852,
      name: 'iPhone 16 Pro',
      aspectRatio: '393 / 852',
      hasDynamicIsland: true,
      radius: 'rounded-[50px]',
    },
    pixel9: {
      width: 412,
      height: 915,
      name: 'Google Pixel 9',
      aspectRatio: '412 / 915',
      hasDynamicIsland: false,
      radius: 'rounded-[46px]',
    },
    iphoneSE: {
      width: 375,
      height: 667,
      name: 'Compact (375 × 667)',
      aspectRatio: '375 / 667',
      hasDynamicIsland: false,
      radius: 'rounded-[38px]',
    },
  }[deviceModel];

  const colorStyles = {
    titanium: {
      caseBorder: 'border-[#71717A] bg-[#27272A]',
      frameBg: 'from-[#3F3F46] via-[#27272A] to-[#18181B]',
      accentRing: 'ring-stone-400/30',
    },
    midnight: {
      caseBorder: 'border-[#1E293B] bg-[#0F172A]',
      frameBg: 'from-[#1E293B] via-[#0F172A] to-[#020617]',
      accentRing: 'ring-slate-700/40',
    },
    gold: {
      caseBorder: 'border-[#D97706] bg-[#78350F]',
      frameBg: 'from-[#B45309] via-[#78350F] to-[#451A03]',
      accentRing: 'ring-amber-500/30',
    },
  }[deviceColor];

  return (
    <div className="min-h-screen bg-stone-900 text-stone-100 flex flex-col items-center justify-start pb-16 selection:bg-amber-400 selection:text-stone-950">
      {/* Top Simulator Control Bar */}
      <header className="w-full bg-stone-950/80 backdrop-blur-md border-b border-stone-800 px-4 sm:px-6 py-3 sticky top-0 z-50 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-amber-500/20 text-amber-400 rounded-lg">
            <Smartphone className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-2">
              <span>Mobile Phone Screen Simulator</span>
              <span className="text-[10px] text-amber-400 font-mono bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800/60">
                {deviceDimensions.name} ({deviceDimensions.width}×{deviceDimensions.height}px)
              </span>
            </div>
            <p className="text-[11px] text-stone-400 hidden sm:block">
              Interactive live viewport with iOS/Android thumb navigation & tactile step timers.
            </p>
          </div>
        </div>

        {/* Controls: Device Switcher & Desktop Switch */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Device Model Selector */}
          <div className="flex items-center bg-stone-900 border border-stone-700 rounded-xl p-1 text-xs">
            <button
              type="button"
              onClick={() => setDeviceModel('iphone16pro')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                deviceModel === 'iphone16pro'
                  ? 'bg-stone-800 text-white shadow-xs'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              iPhone 16 Pro
            </button>
            <button
              type="button"
              onClick={() => setDeviceModel('pixel9')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                deviceModel === 'pixel9'
                  ? 'bg-stone-800 text-white shadow-xs'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              Pixel 9
            </button>
            <button
              type="button"
              onClick={() => setDeviceModel('iphoneSE')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer hidden md:block ${
                deviceModel === 'iphoneSE'
                  ? 'bg-stone-800 text-white shadow-xs'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              Compact 375px
            </button>
          </div>

          {/* Zoom / Scale */}
          <div className="hidden lg:flex items-center bg-stone-900 border border-stone-700 rounded-xl p-1 text-xs text-stone-300">
            <button
              type="button"
              onClick={() => setScale((s) => Math.max(0.75, +(s - 0.05).toFixed(2)))}
              className="p-1 hover:text-white cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-1.5 font-mono text-[11px] tabular-nums">
              {Math.round(scale * 100)}%
            </span>
            <button
              type="button"
              onClick={() => setScale((s) => Math.min(1.0, +(s + 0.05).toFixed(2)))}
              className="p-1 hover:text-white cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Switch back to full Desktop view */}
          <button
            type="button"
            onClick={onExitMobilePreview}
            className="px-3.5 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 hover:text-white text-xs font-semibold rounded-xl border border-stone-700 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Full Desktop View</span>
          </button>
        </div>
      </header>

      {/* Simulator Stage */}
      <div className="flex-1 w-full flex items-center justify-center p-4 sm:p-8 overflow-x-auto">
        <div
          className="relative transition-all duration-300 origin-top flex flex-col items-center"
          style={{ transform: `scale(${scale})` }}
        >
          {/* Hardware Chassis Wrap */}
          <div
            className={`relative p-3.5 bg-gradient-to-b ${colorStyles.frameBg} ${deviceDimensions.radius} shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.12)] border-[4px] ${colorStyles.caseBorder}`}
            style={{
              width: `${deviceDimensions.width + 28}px`,
              height: `${deviceDimensions.height + 28}px`,
            }}
          >
            {/* Left Hardware Buttons (Volume & Action) */}
            <div className="absolute -left-1.5 top-28 w-1 h-8 bg-stone-600 rounded-l-xs shadow-xs" />
            <div className="absolute -left-1.5 top-40 w-1 h-14 bg-stone-600 rounded-l-xs shadow-xs" />
            <div className="absolute -left-1.5 top-58 w-1 h-14 bg-stone-600 rounded-l-xs shadow-xs" />
            {/* Right Hardware Button (Power) */}
            <div className="absolute -right-1.5 top-36 w-1 h-20 bg-stone-600 rounded-r-xs shadow-xs" />

            {/* Glass Screen Bezel */}
            <div
              className={`relative w-full h-full bg-[#FAFAF7] text-stone-900 ${deviceDimensions.radius} overflow-hidden shadow-inner flex flex-col ring-1 ring-black/40`}
            >
              {/* Native Mobile Status Bar */}
              <div className="sticky top-0 z-50 h-11 px-7 flex items-center justify-between text-stone-900 bg-[#FAFAF7]/95 backdrop-blur-md select-none shrink-0 border-b border-stone-200/40">
                {/* Time */}
                <span className="font-semibold text-xs tracking-tight font-mono tabular-nums">
                  {currentTime}
                </span>

                {/* Dynamic Island or Camera Punch Hole */}
                {deviceDimensions.hasDynamicIsland ? (
                  <div className="w-24 h-6 bg-black rounded-full flex items-center justify-end px-2 gap-1.5 shadow-md">
                    <div className="w-2.5 h-2.5 rounded-full bg-stone-900 ring-1 ring-stone-800" />
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-900/40" />
                  </div>
                ) : (
                  <div className="w-3.5 h-3.5 bg-black rounded-full ring-2 ring-stone-800" />
                )}

                {/* Status Icons */}
                <div className="flex items-center gap-1.5 text-stone-800">
                  <div className="flex items-end gap-0.5 h-2.5">
                    <div className="w-0.5 h-1 bg-stone-800 rounded-2xs" />
                    <div className="w-0.5 h-1.5 bg-stone-800 rounded-2xs" />
                    <div className="w-0.5 h-2 bg-stone-800 rounded-2xs" />
                    <div className="w-0.5 h-2.5 bg-stone-800 rounded-2xs" />
                  </div>
                  <Wifi className="w-3.5 h-3.5" />
                  <div className="flex items-center gap-0.5">
                    <span className="text-[10px] font-bold font-mono">100</span>
                    <Battery className="w-4 h-4 fill-stone-800" />
                  </div>
                </div>
              </div>

              {/* Touch Scrollable App Content */}
              <div className="flex-1 overflow-y-auto overscroll-contain relative pb-20">
                {children}
              </div>

              {/* iOS Home Indicator Bar */}
              <div className="sticky bottom-0 z-50 h-5 w-full bg-transparent flex items-center justify-center pointer-events-none select-none shrink-0 pb-1">
                <div className="w-32 h-1 bg-stone-900/60 rounded-full" />
              </div>
            </div>
          </div>

          {/* Under-device label */}
          <div className="mt-4 text-center">
            <span className="text-xs text-stone-400 font-medium">
              Interact directly inside the phone screen to test ingredient entry, timers, and cooking mode!
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
