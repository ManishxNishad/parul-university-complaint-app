import React, { useState, useMemo } from 'react';
import {
  X,
  Check,
  Sparkles,
  Palette,
  Sun,
  Moon,
  Monitor,
  Type,
  Maximize2,
  Sliders,
  RotateCcw,
  Eye,
  ShieldCheck,
  Search,
  CheckCircle2,
  Clock,
  Zap,
  Layers,
  Volume2,
  BookOpen,
  Smartphone,
  Paintbrush,
  Sparkle,
} from 'lucide-react';
import {
  useTheme,
  THEMES,
  ThemeId,
  ThemeCategory,
  AppearanceMode,
  FontScale,
  BorderRadiusStyle,
  ShadowDepth,
  HeaderStyle,
  AccentOverride,
} from '../theme';

interface ThemeSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ModalTab = 'palettes' | 'display' | 'accessibility';

export const ThemeSelectorModal: React.FC<ThemeSelectorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    themeId,
    setThemeId,
    availableThemes,
    theme,
    mode,
    setMode,
    fontScale,
    setFontScale,
    borderRadius,
    setBorderRadius,
    shadowDepth,
    setShadowDepth,
    headerStyle,
    setHeaderStyle,
    accentOverride,
    setAccentOverride,
    reducedMotion,
    setReducedMotion,
    highContrast,
    setHighContrast,
    autoNightMode,
    setAutoNightMode,
    dyslexiaFont,
    setDyslexiaFont,
    oledTrueBlack,
    setOledTrueBlack,
    soundEffects,
    setSoundEffects,
    readingGuide,
    setReadingGuide,
    playSound,
    resetAllThemeSettings,
  } = useTheme();

  const [activeTab, setActiveTab] = useState<ModalTab>('palettes');
  const [selectedCategory, setSelectedCategory] = useState<ThemeCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Filtered themes based on search query and category
  const filteredThemes = useMemo(() => {
    return availableThemes.filter((t) => {
      const matchesCategory =
        selectedCategory === 'all' || t.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        t.name.toLowerCase().includes(q) ||
        t.tagline.toLowerCase().includes(q) ||
        t.accentLabel.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [availableThemes, selectedCategory, searchQuery]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div
        id="theme-selector-modal"
        className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[92vh] sm:max-h-[88vh] overflow-hidden animate-in zoom-in-95 duration-200"
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-xs text-white transition-colors"
              style={{ backgroundColor: theme.colors.primary }}
            >
              <Palette size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                Theme & Appearance Settings
                <Sparkles size={14} className="text-amber-500 fill-amber-500" />
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Customize 20 color themes, header banners, depth & comfort options
              </p>
            </div>
          </div>
          <button
            id="close-theme-modal-btn"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close Settings"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-4 sm:px-5 bg-white dark:bg-slate-900 shrink-0 gap-1 sm:gap-2">
          <button
            id="tab-theme-palettes"
            onClick={() => setActiveTab('palettes')}
            className={`py-3 px-3 sm:px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'palettes'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Palette size={15} />
            <span>Palettes ({availableThemes.length})</span>
          </button>

          <button
            id="tab-theme-display"
            onClick={() => setActiveTab('display')}
            className={`py-3 px-3 sm:px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'display'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Sliders size={15} />
            <span>Display & Styling</span>
          </button>

          <button
            id="tab-theme-accessibility"
            onClick={() => setActiveTab('accessibility')}
            className={`py-3 px-3 sm:px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'accessibility'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Eye size={15} />
            <span>Accessibility & Comfort</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* TAB 1: COLOR PALETTES */}
          {activeTab === 'palettes' && (
            <div className="space-y-3.5">
              {/* Search Bar */}
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  id="theme-search-input"
                  type="text"
                  placeholder="Search 20 themes by name, color, or vibe..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-8 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs p-1"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                {(
                  [
                    { id: 'all', label: 'All Themes', count: availableThemes.length },
                    { id: 'academic', label: 'Academic & Classic', count: 6 },
                    { id: 'modern', label: 'Modern & Vibrant', count: 9 },
                    { id: 'dark', label: 'Dark & OLED', count: 4 },
                    { id: 'accessibility', label: 'High Contrast', count: 1 },
                  ] as const
                ).map((cat) => (
                  <button
                    key={cat.id}
                    id={`theme-filter-${cat.id}`}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all text-xs cursor-pointer ${
                      selectedCategory === cat.id
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {cat.label} ({cat.count})
                  </button>
                ))}
              </div>

              {/* Theme Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {filteredThemes.map((t) => {
                  const isSelected = themeId === t.id;
                  return (
                    <button
                      key={t.id}
                      id={`theme-option-${t.id}`}
                      onClick={() => setThemeId(t.id)}
                      className={`p-3 rounded-2xl border text-left transition-all relative flex flex-col justify-between gap-2.5 cursor-pointer ${
                        isSelected
                          ? 'border-indigo-600 ring-2 ring-indigo-500/20 bg-indigo-50/25 dark:bg-indigo-950/30'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-800/60'
                      }`}
                    >
                      {/* Top row: Swatches & Category Badges */}
                      <div className="flex items-center justify-between w-full">
                        {/* 3 Swatch Dots */}
                        <div className="flex items-center -space-x-1.5">
                          <span
                            className="w-6 h-6 rounded-full shadow-xs ring-2 ring-white dark:ring-slate-900"
                            style={{ backgroundColor: t.colors.headerBg }}
                            title="Header Color"
                          />
                          <span
                            className="w-6 h-6 rounded-full shadow-xs ring-2 ring-white dark:ring-slate-900"
                            style={{ backgroundColor: t.colors.primary }}
                            title="Primary Accent"
                          />
                          <span
                            className="w-6 h-6 rounded-full shadow-xs ring-2 ring-white dark:ring-slate-900"
                            style={{ backgroundColor: t.colors.secondary }}
                            title="Highlight Accent"
                          />
                        </div>

                        {/* Badges */}
                        <div className="flex items-center gap-1">
                          {t.isDark ? (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-slate-800 text-indigo-300 border border-slate-700 flex items-center gap-1">
                              <Moon size={9} /> Dark
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-amber-50 dark:bg-slate-800 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-slate-700 flex items-center gap-1">
                              <Sun size={9} /> Light
                            </span>
                          )}
                          {isSelected && (
                            <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                              <Check size={12} strokeWidth={3} />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Theme Name & Tagline */}
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                            {t.name}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                          {t.tagline}
                        </p>
                      </div>

                      {/* Bottom Accent Chip */}
                      <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800/80">
                        <span className="text-[10px] text-slate-400 font-medium">
                          {t.accentLabel}
                        </span>
                        <span
                          className="text-[10px] font-bold px-1.5 py-0.2 rounded"
                          style={{
                            backgroundColor: t.colors.accentBadge,
                            color: t.colors.accentText,
                          }}
                        >
                          Preview
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {filteredThemes.length === 0 && (
                <div className="py-8 text-center text-slate-400 text-xs">
                  No themes match "{searchQuery}". Try searching "dark", "lime", "coral", "navy", or "gold".
                </div>
              )}
            </div>
          )}

          {/* TAB 2: DISPLAY & STYLING */}
          {activeTab === 'display' && (
            <div className="space-y-5">
              {/* Appearance Mode */}
              <div>
                <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider block mb-2">
                  Appearance Mode
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      {
                        id: 'system',
                        title: 'Auto System',
                        desc: 'Match Device OS',
                        icon: <Monitor size={18} />,
                      },
                      {
                        id: 'light',
                        title: 'Light Mode',
                        desc: 'Bright & Crisp',
                        icon: <Sun size={18} />,
                      },
                      {
                        id: 'dark',
                        title: 'Dark Mode',
                        desc: 'OLED & Night',
                        icon: <Moon size={18} />,
                      },
                    ] as const
                  ).map((m) => {
                    const isSelected = mode === m.id;
                    return (
                      <button
                        key={m.id}
                        id={`mode-option-${m.id}`}
                        onClick={() => setMode(m.id)}
                        className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                          isSelected
                            ? 'border-indigo-600 ring-2 ring-indigo-500/20 bg-indigo-50/30 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold'
                            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                        }`}
                      >
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                            isSelected
                              ? 'bg-indigo-600 text-white'
                              : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          {m.icon}
                        </div>
                        <span className="text-xs font-bold">{m.title}</span>
                        <span className="text-[10px] text-slate-400">{m.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Header Banner Style */}
              <div>
                <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider block mb-2">
                  Header Banner Display Style
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      {
                        id: 'gradient',
                        title: 'Dynamic Gradient',
                        desc: 'Rich multi-tone sweep',
                      },
                      {
                        id: 'solid',
                        title: 'Classic Solid',
                        desc: 'Collegiate academic tone',
                      },
                      {
                        id: 'glass',
                        title: 'Frosted Glass',
                        desc: 'Backdrop blur & sheen',
                      },
                    ] as const
                  ).map((h) => {
                    const isSelected = headerStyle === h.id;
                    return (
                      <button
                        key={h.id}
                        id={`header-style-option-${h.id}`}
                        onClick={() => setHeaderStyle(h.id)}
                        className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                          isSelected
                            ? 'border-indigo-600 ring-2 ring-indigo-500/20 bg-indigo-50/30 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold'
                            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                        }`}
                      >
                        <div
                          className={`w-9 h-6 rounded-lg border flex items-center justify-center ${
                            h.id === 'gradient'
                              ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white'
                              : h.id === 'solid'
                              ? 'bg-slate-900 text-white'
                              : 'bg-slate-200/60 backdrop-blur-xs text-slate-700'
                          }`}
                        >
                          <Sparkle size={12} />
                        </div>
                        <span className="text-xs font-bold">{h.title}</span>
                        <span className="text-[10px] text-slate-400">{h.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Interactive Accent Hue Override */}
              <div>
                <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider block mb-2 flex items-center justify-between">
                  <span>Interactive Accent Tint Override</span>
                  <span className="text-[10px] font-normal text-slate-400 lowercase">
                    personalize buttons & active tabs
                  </span>
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
                  {(
                    [
                      { id: 'default', label: 'Theme Default', color: theme.colors.primary },
                      { id: 'blue', label: 'Royal Blue', color: '#2563eb' },
                      { id: 'emerald', label: 'Emerald Mint', color: '#059669' },
                      { id: 'amber', label: 'Saffron Gold', color: '#d97706' },
                      { id: 'rose', label: 'Crimson Rose', color: '#e11d48' },
                      { id: 'purple', label: 'Ultraviolet', color: '#7c3aed' },
                      { id: 'cyan', label: 'Arctic Cyan', color: '#0891b2' },
                    ] as const
                  ).map((acc) => {
                    const isSelected = accentOverride === acc.id;
                    return (
                      <button
                        key={acc.id}
                        id={`accent-override-${acc.id}`}
                        onClick={() => setAccentOverride(acc.id)}
                        className={`p-2 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                          isSelected
                            ? 'border-indigo-600 ring-2 ring-indigo-500/20 bg-indigo-50/40 dark:bg-indigo-950/40'
                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-800/60'
                        }`}
                        title={acc.label}
                      >
                        <span
                          className="w-5 h-5 rounded-full ring-2 ring-white dark:ring-slate-900 shadow-xs flex items-center justify-center text-white"
                          style={{ backgroundColor: acc.color }}
                        >
                          {isSelected && <Check size={10} strokeWidth={3} />}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-700 dark:text-slate-300 truncate w-full text-center">
                          {acc.label.split(' ')[0]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Text Scale / Density */}
              <div>
                <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider block mb-2">
                  Text Scale & Layout Density
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      {
                        id: 'compact',
                        title: 'Compact',
                        desc: '14.5px • High Density',
                        icon: <Type size={16} />,
                      },
                      {
                        id: 'normal',
                        title: 'Standard',
                        desc: '16.0px • Recommended',
                        icon: <Type size={19} />,
                      },
                      {
                        id: 'comfortable',
                        title: 'Spacious',
                        desc: '17.5px • Easy Read',
                        icon: <Type size={22} />,
                      },
                    ] as const
                  ).map((s) => {
                    const isSelected = fontScale === s.id;
                    return (
                      <button
                        key={s.id}
                        id={`font-scale-option-${s.id}`}
                        onClick={() => setFontScale(s.id)}
                        className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                          isSelected
                            ? 'border-indigo-600 ring-2 ring-indigo-500/20 bg-indigo-50/30 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold'
                            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                        }`}
                      >
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                            isSelected
                              ? 'bg-indigo-600 text-white'
                              : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          {s.icon}
                        </div>
                        <span className="text-xs font-bold">{s.title}</span>
                        <span className="text-[10px] text-slate-400">{s.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Corner Radius Style */}
              <div>
                <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider block mb-2">
                  UI Corner Radius Style
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      {
                        id: 'compact',
                        title: 'Sharp & Clean',
                        desc: 'Crisp 6px edges',
                        previewClass: 'rounded-xs',
                      },
                      {
                        id: 'modern',
                        title: 'Modern Soft',
                        desc: 'Standard 16px',
                        previewClass: 'rounded-xl',
                      },
                      {
                        id: 'pill',
                        title: 'Smooth Pill',
                        desc: 'Curved 28px',
                        previewClass: 'rounded-2xl',
                      },
                    ] as const
                  ).map((r) => {
                    const isSelected = borderRadius === r.id;
                    return (
                      <button
                        key={r.id}
                        id={`radius-option-${r.id}`}
                        onClick={() => setBorderRadius(r.id)}
                        className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                          isSelected
                            ? 'border-indigo-600 ring-2 ring-indigo-500/20 bg-indigo-50/30 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold'
                            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                        }`}
                      >
                        <div
                          className={`w-9 h-9 border-2 border-dashed flex items-center justify-center ${r.previewClass} ${
                            isSelected
                              ? 'border-indigo-600 bg-indigo-100 dark:bg-indigo-900/40'
                              : 'border-slate-400 bg-slate-100 dark:bg-slate-700'
                          }`}
                        >
                          <Maximize2 size={14} />
                        </div>
                        <span className="text-xs font-bold">{r.title}</span>
                        <span className="text-[10px] text-slate-400">{r.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Shadow & Elevation Depth */}
              <div>
                <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider block mb-2">
                  Card Elevation & Shadow Depth
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      {
                        id: 'none',
                        title: 'Flat Minimal',
                        desc: 'No shadows, sharp borders',
                      },
                      {
                        id: 'subtle',
                        title: 'Soft Ambient',
                        desc: 'Crisp balanced glow (default)',
                      },
                      {
                        id: 'elevated',
                        title: 'Elevated 3D',
                        desc: 'Deep dimensional drop shadows',
                      },
                    ] as const
                  ).map((d) => {
                    const isSelected = shadowDepth === d.id;
                    return (
                      <button
                        key={d.id}
                        id={`shadow-depth-option-${d.id}`}
                        onClick={() => setShadowDepth(d.id)}
                        className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                          isSelected
                            ? 'border-indigo-600 ring-2 ring-indigo-500/20 bg-indigo-50/30 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold'
                            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                        }`}
                      >
                        <div
                          className={`w-9 h-9 rounded-xl border flex items-center justify-center ${
                            d.id === 'none'
                              ? 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600'
                              : d.id === 'subtle'
                              ? 'bg-white dark:bg-slate-800 border-slate-200 shadow-sm'
                              : 'bg-white dark:bg-slate-800 border-slate-200 shadow-lg'
                          }`}
                        >
                          <Layers size={14} />
                        </div>
                        <span className="text-xs font-bold">{d.title}</span>
                        <span className="text-[10px] text-slate-400">{d.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ACCESSIBILITY & COMFORT */}
          {activeTab === 'accessibility' && (
            <div className="space-y-3.5">
              {/* Auto Night Shift */}
              <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 flex items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Clock size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      Auto Night Shift (7:00 PM - 6:00 AM)
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Automatically shifts the portal into a low-glare dark palette after sunset.
                    </p>
                  </div>
                </div>
                <button
                  id="toggle-auto-night-btn"
                  onClick={() => setAutoNightMode(!autoNightMode)}
                  className={`w-12 h-6.5 rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${
                    autoNightMode ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'
                  }`}
                  aria-label="Toggle Auto Night Shift"
                >
                  <div
                    className={`w-5.5 h-5.5 rounded-full bg-white shadow-xs transition-transform ${
                      autoNightMode ? 'translate-x-5.5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Dyslexia-Friendly Typography Toggle */}
              <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 flex items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 mt-0.5">
                    <BookOpen size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      Dyslexia-Friendly / Hyper-Legible Font
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Expands letter tracking (0.04em) and sets line-height to 1.75 for effortless reading.
                    </p>
                  </div>
                </div>
                <button
                  id="toggle-dyslexia-font-btn"
                  onClick={() => setDyslexiaFont(!dyslexiaFont)}
                  className={`w-12 h-6.5 rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${
                    dyslexiaFont ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'
                  }`}
                  aria-label="Toggle Dyslexia-Friendly Font"
                >
                  <div
                    className={`w-5.5 h-5.5 rounded-full bg-white shadow-xs transition-transform ${
                      dyslexiaFont ? 'translate-x-5.5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* OLED True Pure Black Toggle */}
              <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 flex items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                    <Smartphone size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      OLED True Pitch-Black Mode
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      In dark mode, turns off pixels by forcing pure #000000 black to maximize mobile battery savings.
                    </p>
                  </div>
                </div>
                <button
                  id="toggle-oled-black-btn"
                  onClick={() => setOledTrueBlack(!oledTrueBlack)}
                  className={`w-12 h-6.5 rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${
                    oledTrueBlack ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'
                  }`}
                  aria-label="Toggle OLED Pitch Black Mode"
                >
                  <div
                    className={`w-5.5 h-5.5 rounded-full bg-white shadow-xs transition-transform ${
                      oledTrueBlack ? 'translate-x-5.5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Audio & Haptic Feedback */}
              <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 flex items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Volume2 size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      Sound Effects & Haptic Audio Feedback
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Plays subtle micro-tones on status changes, complaint submissions, and upvotes.
                    </p>
                  </div>
                </div>
                <button
                  id="toggle-sound-effects-btn"
                  onClick={() => setSoundEffects(!soundEffects)}
                  className={`w-12 h-6.5 rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${
                    soundEffects ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'
                  }`}
                  aria-label="Toggle Sound Effects"
                >
                  <div
                    className={`w-5.5 h-5.5 rounded-full bg-white shadow-xs transition-transform ${
                      soundEffects ? 'translate-x-5.5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Focus Reading Guide */}
              <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 flex items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-orange-50 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Paintbrush size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      Reading Focus Highlight Guide
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Subtly spotlights the active paragraph or complaint response under your cursor.
                    </p>
                  </div>
                </div>
                <button
                  id="toggle-reading-guide-btn"
                  onClick={() => setReadingGuide(!readingGuide)}
                  className={`w-12 h-6.5 rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${
                    readingGuide ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'
                  }`}
                  aria-label="Toggle Reading Guide"
                >
                  <div
                    className={`w-5.5 h-5.5 rounded-full bg-white shadow-xs transition-transform ${
                      readingGuide ? 'translate-x-5.5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Reduced Motion Toggle */}
              <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 flex items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Zap size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      Reduce Motion & Shimmer Animations
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Disables ambient holographic sweeps, floating badges, and heavy transitions.
                    </p>
                  </div>
                </div>
                <button
                  id="toggle-reduced-motion-btn"
                  onClick={() => setReducedMotion(!reducedMotion)}
                  className={`w-12 h-6.5 rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${
                    reducedMotion ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'
                  }`}
                  aria-label="Toggle Reduced Motion"
                >
                  <div
                    className={`w-5.5 h-5.5 rounded-full bg-white shadow-xs transition-transform ${
                      reducedMotion ? 'translate-x-5.5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* High Contrast Mode Toggle */}
              <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 flex items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      High Contrast Card Borders & Outlines
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Enforces reinforced 1.5px element boundaries and enhanced text contrast for maximum readability.
                    </p>
                  </div>
                </div>
                <button
                  id="toggle-high-contrast-btn"
                  onClick={() => setHighContrast(!highContrast)}
                  className={`w-12 h-6.5 rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${
                    highContrast ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'
                  }`}
                  aria-label="Toggle High Contrast"
                >
                  <div
                    className={`w-5.5 h-5.5 rounded-full bg-white shadow-xs transition-transform ${
                      highContrast ? 'translate-x-5.5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* One-click High Contrast Preset Button */}
              <div className="pt-2">
                <button
                  id="select-highcontrast-preset-btn"
                  onClick={() => {
                    setThemeId('highcontrast');
                    setHighContrast(true);
                  }}
                  className="w-full py-2.5 px-4 rounded-xl border-2 border-yellow-400 bg-black text-yellow-300 font-bold text-xs flex items-center justify-center gap-2 hover:bg-neutral-900 transition-colors shadow-xs cursor-pointer"
                >
                  <CheckCircle2 size={16} />
                  <span>Activate Official High-Contrast Mode (WCAG AAA)</span>
                </button>
              </div>
            </div>
          )}

          {/* Live Preview Sample Box */}
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 text-xs">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
              <span className="font-semibold flex items-center gap-1">
                <Eye size={13} /> Active Live Preview:
              </span>
              <span
                className="font-bold text-[11px] px-2 py-0.5 rounded-md"
                style={{
                  backgroundColor: theme.colors.accentBadge,
                  color: theme.colors.accentText,
                }}
              >
                {theme.name}
              </span>
            </div>

            {/* Simulated mini card */}
            <div className={`p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-2 ${
              shadowDepth === 'none' ? 'shadow-none' : shadowDepth === 'elevated' ? 'shadow-xl' : 'shadow-xs'
            }`}>
              {/* Mini simulated header */}
              <div
                className={`p-2 rounded-lg text-white text-[11px] font-bold flex items-center justify-between ${
                  headerStyle === 'gradient'
                    ? 'bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800'
                    : headerStyle === 'solid'
                    ? 'bg-slate-900'
                    : 'bg-slate-800/80 backdrop-blur-md'
                }`}
                style={{
                  backgroundColor: headerStyle === 'solid' ? theme.colors.headerBg : undefined,
                }}
              >
                <span>Parul Grievance Portal</span>
                <span className="text-[9px] px-1.5 py-0.5 bg-white/20 rounded">Preview</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
                  Grievance #PU-88219
                </span>
                <span
                  className="py-0.5 px-2 rounded-md font-bold text-[10px]"
                  style={{
                    backgroundColor: theme.colors.accentBadge,
                    color: theme.colors.accentText,
                  }}
                >
                  Under Review
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => playSound('click')}
                  className="flex-1 py-1.5 px-3 rounded-lg text-white font-semibold text-xs transition-transform active:scale-95 shadow-xs flex items-center justify-center gap-1.5"
                  style={{ backgroundColor: theme.colors.primary }}
                >
                  <Sparkles size={12} /> Primary Button
                </button>
                <button
                  onClick={() => playSound('click')}
                  className="py-1.5 px-3 rounded-lg font-semibold text-xs border transition-colors"
                  style={{
                    borderColor: theme.colors.primary,
                    color: theme.colors.primary,
                  }}
                >
                  Outline
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 flex items-center justify-between gap-3 shrink-0">
          {showResetConfirm ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Reset all settings to default?
              </span>
              <button
                onClick={() => {
                  resetAllThemeSettings();
                  setShowResetConfirm(false);
                }}
                className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                Yes, Reset
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-2 py-1 text-slate-500 hover:text-slate-700 dark:text-slate-400 text-xs cursor-pointer"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              id="theme-reset-all-btn"
              onClick={() => setShowResetConfirm(true)}
              className="text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 font-medium flex items-center gap-1.5 transition-colors cursor-pointer py-1.5 px-2 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-800"
            >
              <RotateCcw size={13} />
              <span>Reset Defaults</span>
            </button>
          )}

          <button
            id="theme-apply-done-btn"
            onClick={() => {
              playSound('success');
              onClose();
            }}
            className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold rounded-xl text-xs transition-all shadow-md cursor-pointer flex items-center gap-1.5 active:scale-95"
          >
            <Check size={14} strokeWidth={2.5} />
            <span>Apply & Close</span>
          </button>
        </div>
      </div>
    </div>
  );
};


