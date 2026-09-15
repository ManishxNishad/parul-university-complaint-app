import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeId =
  | 'classic'
  | 'emerald'
  | 'crimson'
  | 'midnight'
  | 'sunset'
  | 'amethyst'
  | 'nordic'
  | 'rosegold'
  | 'sapphire'
  | 'forest'
  | 'solar'
  | 'obsidian'
  | 'synthwave'
  | 'sepia'
  | 'highcontrast'
  | 'matrix'
  | 'lavender'
  | 'coral'
  | 'monochrome'
  | 'royalgold';

export type ThemeCategory = 'all' | 'academic' | 'modern' | 'dark' | 'accessibility';
export type AppearanceMode = 'system' | 'light' | 'dark';
export type FontScale = 'compact' | 'normal' | 'comfortable';
export type BorderRadiusStyle = 'modern' | 'compact' | 'pill';
export type ShadowDepth = 'none' | 'subtle' | 'elevated';
export type HeaderStyle = 'solid' | 'gradient' | 'glass';
export type AccentOverride = 'default' | 'blue' | 'emerald' | 'amber' | 'rose' | 'purple' | 'cyan';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  tagline: string;
  accentLabel: string;
  isDark: boolean;
  category: 'academic' | 'modern' | 'dark' | 'accessibility';
  colors: {
    primary: string;       // Hex for primary buttons & highlights
    primaryHover: string;  // Hex for button hover
    secondary: string;     // Hex for accents
    headerBg: string;      // Header solid or base
    headerFrom: string;    // Gradient start
    headerVia: string;     // Gradient middle
    headerTo: string;      // Gradient end
    accentBadge: string;   // Tailored badge bg
    accentText: string;    // Tailored badge text
    borderAccent: string;  // Ring/border color
    crestShieldPrimary: string;
    crestShieldSecondary: string;
    loginGradientFrom: string;
    loginGradientVia: string;
    loginGradientTo: string;
  };
  classes: {
    header: string;
    buttonPrimary: string;
    buttonOutline: string;
    badge: string;
    activeNav: string;
    cardBg: string;
    cardBorder: string;
    screenBg: string;
    textPrimary: string;
    textSecondary: string;
    fabButton: string;
    inputRing: string;
    quickActionRaise: string;
  };
}

export const THEMES: Record<ThemeId, ThemeConfig> = {
  classic: {
    id: 'classic',
    name: 'Classic Parul Navy',
    tagline: 'Authentic University Royal Blue & Navy',
    accentLabel: 'Royal Navy',
    isDark: false,
    category: 'academic',
    colors: {
      primary: '#2563eb',
      primaryHover: '#1d4ed8',
      secondary: '#3b82f6',
      headerBg: '#1b2143',
      headerFrom: '#161b36',
      headerVia: '#1b2143',
      headerTo: '#12162d',
      accentBadge: '#eff6ff',
      accentText: '#1d4ed8',
      borderAccent: '#3b82f6',
      crestShieldPrimary: '#b91c1c',
      crestShieldSecondary: '#d97706',
      loginGradientFrom: '#161b36',
      loginGradientVia: '#1a2245',
      loginGradientTo: '#12162d',
    },
    classes: {
      header: 'bg-[#1b2143] text-white',
      buttonPrimary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/25',
      buttonOutline: 'border-blue-600 text-blue-600 hover:bg-blue-50',
      badge: 'bg-blue-50 text-blue-700 border-blue-100',
      activeNav: 'text-blue-600 font-semibold',
      cardBg: 'bg-white',
      cardBorder: 'border-slate-100',
      screenBg: 'bg-slate-50',
      textPrimary: 'text-slate-800',
      textSecondary: 'text-slate-500',
      fabButton: 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/40',
      inputRing: 'focus:ring-blue-500',
      quickActionRaise: 'bg-indigo-50 text-indigo-600',
    },
  },
  emerald: {
    id: 'emerald',
    name: 'Eco Campus Emerald',
    tagline: 'Sustainable, Clean Green & Fresh Jade',
    accentLabel: 'Pine & Mint',
    isDark: false,
    category: 'modern',
    colors: {
      primary: '#059669',
      primaryHover: '#047857',
      secondary: '#10b981',
      headerBg: '#064e3b',
      headerFrom: '#063327',
      headerVia: '#064e3b',
      headerTo: '#022c22',
      accentBadge: '#ecfdf5',
      accentText: '#047857',
      borderAccent: '#10b981',
      crestShieldPrimary: '#047857',
      crestShieldSecondary: '#10b981',
      loginGradientFrom: '#04241b',
      loginGradientVia: '#064e3b',
      loginGradientTo: '#021812',
    },
    classes: {
      header: 'bg-[#064e3b] text-white',
      buttonPrimary: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/25',
      buttonOutline: 'border-emerald-600 text-emerald-600 hover:bg-emerald-50',
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-100',
      activeNav: 'text-emerald-600 font-semibold',
      cardBg: 'bg-white',
      cardBorder: 'border-emerald-50',
      screenBg: 'bg-slate-50',
      textPrimary: 'text-slate-800',
      textSecondary: 'text-slate-500',
      fabButton: 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/40',
      inputRing: 'focus:ring-emerald-500',
      quickActionRaise: 'bg-emerald-50 text-emerald-600',
    },
  },
  crimson: {
    id: 'crimson',
    name: 'Royal Heritage Maroon',
    tagline: 'Collegiate Ivy League Burgundy & Amber Gold',
    accentLabel: 'Maroon & Gold',
    isDark: false,
    category: 'academic',
    colors: {
      primary: '#be123c',
      primaryHover: '#9f1239',
      secondary: '#f59e0b',
      headerBg: '#701a2d',
      headerFrom: '#4c0519',
      headerVia: '#701a2d',
      headerTo: '#3b0714',
      accentBadge: '#fff1f2',
      accentText: '#be123c',
      borderAccent: '#f59e0b',
      crestShieldPrimary: '#881337',
      crestShieldSecondary: '#f59e0b',
      loginGradientFrom: '#3f0615',
      loginGradientVia: '#701a2d',
      loginGradientTo: '#2e040f',
    },
    classes: {
      header: 'bg-[#701a2d] text-white',
      buttonPrimary: 'bg-rose-700 hover:bg-rose-800 text-white shadow-rose-700/25',
      buttonOutline: 'border-rose-700 text-rose-700 hover:bg-rose-50',
      badge: 'bg-rose-50 text-rose-800 border-rose-100',
      activeNav: 'text-rose-700 font-semibold',
      cardBg: 'bg-white',
      cardBorder: 'border-rose-50',
      screenBg: 'bg-slate-50',
      textPrimary: 'text-slate-800',
      textSecondary: 'text-slate-500',
      fabButton: 'bg-rose-700 hover:bg-rose-800 shadow-rose-700/40',
      inputRing: 'focus:ring-rose-500',
      quickActionRaise: 'bg-rose-50 text-rose-700',
    },
  },
  midnight: {
    id: 'midnight',
    name: 'Cyber Midnight Dark',
    tagline: 'Sleek OLED High-Tech Obsidian & Electric Indigo',
    accentLabel: 'Midnight Indigo',
    isDark: true,
    category: 'dark',
    colors: {
      primary: '#6366f1',
      primaryHover: '#4f46e5',
      secondary: '#a855f7',
      headerBg: '#090d16',
      headerFrom: '#05070d',
      headerVia: '#090d16',
      headerTo: '#0e1526',
      accentBadge: '#1e1b4b',
      accentText: '#818cf8',
      borderAccent: '#6366f1',
      crestShieldPrimary: '#4f46e5',
      crestShieldSecondary: '#06b6d4',
      loginGradientFrom: '#05070d',
      loginGradientVia: '#0b0f19',
      loginGradientTo: '#020408',
    },
    classes: {
      header: 'bg-[#090d16] text-white border-b border-slate-800',
      buttonPrimary: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30',
      buttonOutline: 'border-indigo-500 text-indigo-400 hover:bg-indigo-950/40',
      badge: 'bg-indigo-950/70 text-indigo-300 border-indigo-800/40',
      activeNav: 'text-indigo-400 font-semibold',
      cardBg: 'bg-[#131b2e]',
      cardBorder: 'border-slate-800',
      screenBg: 'bg-[#0b0f19]',
      textPrimary: 'text-slate-100',
      textSecondary: 'text-slate-400',
      fabButton: 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/50',
      inputRing: 'focus:ring-indigo-500',
      quickActionRaise: 'bg-indigo-950/80 text-indigo-300',
    },
  },
  sunset: {
    id: 'sunset',
    name: 'Sunset Amber Clay',
    tagline: 'Warm Terracotta, Vibrant Clay & Golden Hour',
    accentLabel: 'Warm Amber',
    isDark: false,
    category: 'modern',
    colors: {
      primary: '#ea580c',
      primaryHover: '#c2410c',
      secondary: '#f97316',
      headerBg: '#7c2d12',
      headerFrom: '#431407',
      headerVia: '#7c2d12',
      headerTo: '#331005',
      accentBadge: '#fff7ed',
      accentText: '#c2410c',
      borderAccent: '#f97316',
      crestShieldPrimary: '#9a3412',
      crestShieldSecondary: '#fbbf24',
      loginGradientFrom: '#3f1105',
      loginGradientVia: '#7c2d12',
      loginGradientTo: '#270802',
    },
    classes: {
      header: 'bg-[#7c2d12] text-white',
      buttonPrimary: 'bg-orange-600 hover:bg-orange-700 text-white shadow-orange-600/25',
      buttonOutline: 'border-orange-600 text-orange-600 hover:bg-orange-50',
      badge: 'bg-orange-50 text-orange-700 border-orange-100',
      activeNav: 'text-orange-600 font-semibold',
      cardBg: 'bg-white',
      cardBorder: 'border-orange-50',
      screenBg: 'bg-slate-50',
      textPrimary: 'text-slate-800',
      textSecondary: 'text-slate-500',
      fabButton: 'bg-orange-600 hover:bg-orange-700 shadow-orange-600/40',
      inputRing: 'focus:ring-orange-500',
      quickActionRaise: 'bg-orange-50 text-orange-600',
    },
  },
  amethyst: {
    id: 'amethyst',
    name: 'Imperial Amethyst Luxe',
    tagline: 'Deep Royal Purple, Velvet Plum & Lilac Accents',
    accentLabel: 'Violet & Lilac',
    isDark: false,
    category: 'modern',
    colors: {
      primary: '#7c3aed',
      primaryHover: '#6d28d9',
      secondary: '#a855f7',
      headerBg: '#4c1d95',
      headerFrom: '#3b0764',
      headerVia: '#4c1d95',
      headerTo: '#2e1065',
      accentBadge: '#f5f3ff',
      accentText: '#6d28d9',
      borderAccent: '#8b5cf6',
      crestShieldPrimary: '#6d28d9',
      crestShieldSecondary: '#ec4899',
      loginGradientFrom: '#2e1065',
      loginGradientVia: '#4c1d95',
      loginGradientTo: '#1e0542',
    },
    classes: {
      header: 'bg-[#4c1d95] text-white',
      buttonPrimary: 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-600/25',
      buttonOutline: 'border-purple-600 text-purple-600 hover:bg-purple-50',
      badge: 'bg-purple-50 text-purple-700 border-purple-100',
      activeNav: 'text-purple-600 font-semibold',
      cardBg: 'bg-white',
      cardBorder: 'border-purple-50',
      screenBg: 'bg-slate-50',
      textPrimary: 'text-slate-800',
      textSecondary: 'text-slate-500',
      fabButton: 'bg-purple-600 hover:bg-purple-700 shadow-purple-600/40',
      inputRing: 'focus:ring-purple-500',
      quickActionRaise: 'bg-purple-50 text-purple-600',
    },
  },
  nordic: {
    id: 'nordic',
    name: 'Nordic Frost Teal',
    tagline: 'Deep Arctic Ocean Slate & Polar Glacier Cyan',
    accentLabel: 'Arctic Teal',
    isDark: false,
    category: 'modern',
    colors: {
      primary: '#0891b2',
      primaryHover: '#0e7490',
      secondary: '#06b6d4',
      headerBg: '#155e75',
      headerFrom: '#083344',
      headerVia: '#155e75',
      headerTo: '#042f2e',
      accentBadge: '#ecfeff',
      accentText: '#0e7490',
      borderAccent: '#06b6d4',
      crestShieldPrimary: '#0e7490',
      crestShieldSecondary: '#14b8a6',
      loginGradientFrom: '#083344',
      loginGradientVia: '#155e75',
      loginGradientTo: '#04212e',
    },
    classes: {
      header: 'bg-[#155e75] text-white',
      buttonPrimary: 'bg-cyan-700 hover:bg-cyan-800 text-white shadow-cyan-700/25',
      buttonOutline: 'border-cyan-700 text-cyan-700 hover:bg-cyan-50',
      badge: 'bg-cyan-50 text-cyan-800 border-cyan-100',
      activeNav: 'text-cyan-700 font-semibold',
      cardBg: 'bg-white',
      cardBorder: 'border-cyan-50',
      screenBg: 'bg-slate-50',
      textPrimary: 'text-slate-800',
      textSecondary: 'text-slate-500',
      fabButton: 'bg-cyan-700 hover:bg-cyan-800 shadow-cyan-700/40',
      inputRing: 'focus:ring-cyan-500',
      quickActionRaise: 'bg-cyan-50 text-cyan-700',
    },
  },
  rosegold: {
    id: 'rosegold',
    name: 'Blossom Rose & Pearl',
    tagline: 'Delicate Petal Rose, Soft Champagne & Warm Crimson',
    accentLabel: 'Rose & Pearl',
    isDark: false,
    category: 'modern',
    colors: {
      primary: '#e11d48',
      primaryHover: '#be123c',
      secondary: '#fb7185',
      headerBg: '#881337',
      headerFrom: '#4c0519',
      headerVia: '#881337',
      headerTo: '#5c0920',
      accentBadge: '#fff1f2',
      accentText: '#9f1239',
      borderAccent: '#fb7185',
      crestShieldPrimary: '#be123c',
      crestShieldSecondary: '#fecdd3',
      loginGradientFrom: '#4c0519',
      loginGradientVia: '#881337',
      loginGradientTo: '#360412',
    },
    classes: {
      header: 'bg-[#881337] text-white',
      buttonPrimary: 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/25',
      buttonOutline: 'border-rose-600 text-rose-600 hover:bg-rose-50',
      badge: 'bg-rose-50 text-rose-700 border-rose-100',
      activeNav: 'text-rose-600 font-semibold',
      cardBg: 'bg-white',
      cardBorder: 'border-rose-100/60',
      screenBg: 'bg-rose-50/30',
      textPrimary: 'text-slate-800',
      textSecondary: 'text-slate-500',
      fabButton: 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/40',
      inputRing: 'focus:ring-rose-500',
      quickActionRaise: 'bg-rose-50 text-rose-600',
    },
  },
  sapphire: {
    id: 'sapphire',
    name: 'Ocean Sapphire Azure',
    tagline: 'Deep Pacific Cobalt, Electric Azure & Cerulean Sky',
    accentLabel: 'Ocean Sapphire',
    isDark: false,
    category: 'modern',
    colors: {
      primary: '#0284c7',
      primaryHover: '#0369a1',
      secondary: '#38bdf8',
      headerBg: '#0c4a6e',
      headerFrom: '#082f49',
      headerVia: '#0c4a6e',
      headerTo: '#072438',
      accentBadge: '#f0f9ff',
      accentText: '#0369a1',
      borderAccent: '#38bdf8',
      crestShieldPrimary: '#0369a1',
      crestShieldSecondary: '#38bdf8',
      loginGradientFrom: '#082f49',
      loginGradientVia: '#0c4a6e',
      loginGradientTo: '#041a29',
    },
    classes: {
      header: 'bg-[#0c4a6e] text-white',
      buttonPrimary: 'bg-sky-600 hover:bg-sky-700 text-white shadow-sky-600/25',
      buttonOutline: 'border-sky-600 text-sky-600 hover:bg-sky-50',
      badge: 'bg-sky-50 text-sky-700 border-sky-100',
      activeNav: 'text-sky-600 font-semibold',
      cardBg: 'bg-white',
      cardBorder: 'border-sky-50',
      screenBg: 'bg-slate-50',
      textPrimary: 'text-slate-800',
      textSecondary: 'text-slate-500',
      fabButton: 'bg-sky-600 hover:bg-sky-700 shadow-sky-600/40',
      inputRing: 'focus:ring-sky-500',
      quickActionRaise: 'bg-sky-50 text-sky-600',
    },
  },
  forest: {
    id: 'forest',
    name: 'Botanical Forest & Sage',
    tagline: 'Deep Evergreen Canopy, Moss & Calming Herbal Sage',
    accentLabel: 'Forest & Sage',
    isDark: false,
    category: 'modern',
    colors: {
      primary: '#15803d',
      primaryHover: '#166534',
      secondary: '#4ade80',
      headerBg: '#14532d',
      headerFrom: '#052e16',
      headerVia: '#14532d',
      headerTo: '#093319',
      accentBadge: '#f0fdf4',
      accentText: '#166534',
      borderAccent: '#22c55e',
      crestShieldPrimary: '#166534',
      crestShieldSecondary: '#86efac',
      loginGradientFrom: '#052e16',
      loginGradientVia: '#14532d',
      loginGradientTo: '#031c0e',
    },
    classes: {
      header: 'bg-[#14532d] text-white',
      buttonPrimary: 'bg-green-700 hover:bg-green-800 text-white shadow-green-700/25',
      buttonOutline: 'border-green-700 text-green-700 hover:bg-green-50',
      badge: 'bg-green-50 text-green-800 border-green-100',
      activeNav: 'text-green-700 font-semibold',
      cardBg: 'bg-white',
      cardBorder: 'border-green-50',
      screenBg: 'bg-slate-50',
      textPrimary: 'text-slate-800',
      textSecondary: 'text-slate-500',
      fabButton: 'bg-green-700 hover:bg-green-800 shadow-green-700/40',
      inputRing: 'focus:ring-green-500',
      quickActionRaise: 'bg-green-50 text-green-700',
    },
  },
  solar: {
    id: 'solar',
    name: 'Solar Saffron & Amber',
    tagline: 'Vibrant Academic Saffron, Warm Honey & Golden Slate',
    accentLabel: 'Saffron Gold',
    isDark: false,
    category: 'academic',
    colors: {
      primary: '#d97706',
      primaryHover: '#b45309',
      secondary: '#fbbf24',
      headerBg: '#451a03',
      headerFrom: '#290e02',
      headerVia: '#451a03',
      headerTo: '#1f0a01',
      accentBadge: '#fffbeb',
      accentText: '#b45309',
      borderAccent: '#f59e0b',
      crestShieldPrimary: '#b45309',
      crestShieldSecondary: '#fde68a',
      loginGradientFrom: '#290e02',
      loginGradientVia: '#451a03',
      loginGradientTo: '#170700',
    },
    classes: {
      header: 'bg-[#451a03] text-white',
      buttonPrimary: 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/25',
      buttonOutline: 'border-amber-600 text-amber-600 hover:bg-amber-50',
      badge: 'bg-amber-50 text-amber-800 border-amber-100',
      activeNav: 'text-amber-600 font-semibold',
      cardBg: 'bg-white',
      cardBorder: 'border-amber-50',
      screenBg: 'bg-slate-50',
      textPrimary: 'text-slate-800',
      textSecondary: 'text-slate-500',
      fabButton: 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/40',
      inputRing: 'focus:ring-amber-500',
      quickActionRaise: 'bg-amber-50 text-amber-600',
    },
  },
  obsidian: {
    id: 'obsidian',
    name: 'Carbon Stealth Obsidian',
    tagline: 'Matte Carbon Graphite, Deep OLED Black & Titanium Gray',
    accentLabel: 'Graphite & Silver',
    isDark: true,
    category: 'dark',
    colors: {
      primary: '#94a3b8',
      primaryHover: '#cbd5e1',
      secondary: '#e2e8f0',
      headerBg: '#0f172a',
      headerFrom: '#020617',
      headerVia: '#0f172a',
      headerTo: '#090d16',
      accentBadge: '#1e293b',
      accentText: '#cbd5e1',
      borderAccent: '#64748b',
      crestShieldPrimary: '#475569',
      crestShieldSecondary: '#94a3b8',
      loginGradientFrom: '#020617',
      loginGradientVia: '#0f172a',
      loginGradientTo: '#000208',
    },
    classes: {
      header: 'bg-[#0f172a] text-white border-b border-slate-800',
      buttonPrimary: 'bg-slate-700 hover:bg-slate-600 text-white shadow-slate-700/30',
      buttonOutline: 'border-slate-500 text-slate-300 hover:bg-slate-800',
      badge: 'bg-slate-800 text-slate-300 border-slate-700',
      activeNav: 'text-slate-300 font-semibold',
      cardBg: 'bg-[#1e293b]/70',
      cardBorder: 'border-slate-800',
      screenBg: 'bg-[#090d16]',
      textPrimary: 'text-slate-100',
      textSecondary: 'text-slate-400',
      fabButton: 'bg-slate-700 hover:bg-slate-600 shadow-slate-700/50',
      inputRing: 'focus:ring-slate-400',
      quickActionRaise: 'bg-slate-800 text-slate-300',
    },
  },
  synthwave: {
    id: 'synthwave',
    name: 'Neon Synthwave Dark',
    tagline: 'Cyberpunk Neon Fuchsia, Violet Glow & Electric Cyan',
    accentLabel: 'Neon Fuchsia',
    isDark: true,
    category: 'dark',
    colors: {
      primary: '#d946ef',
      primaryHover: '#c026d3',
      secondary: '#06b6d4',
      headerBg: '#2e1065',
      headerFrom: '#170530',
      headerVia: '#2e1065',
      headerTo: '#100223',
      accentBadge: '#4a044e',
      accentText: '#f0abfc',
      borderAccent: '#d946ef',
      crestShieldPrimary: '#c026d3',
      crestShieldSecondary: '#06b6d4',
      loginGradientFrom: '#170530',
      loginGradientVia: '#2e1065',
      loginGradientTo: '#0c021a',
    },
    classes: {
      header: 'bg-[#2e1065] text-white border-b border-fuchsia-950',
      buttonPrimary: 'bg-fuchsia-600 hover:bg-fuchsia-500 text-white shadow-fuchsia-600/35',
      buttonOutline: 'border-fuchsia-500 text-fuchsia-400 hover:bg-fuchsia-950/40',
      badge: 'bg-fuchsia-950/80 text-fuchsia-300 border-fuchsia-800/40',
      activeNav: 'text-fuchsia-400 font-semibold',
      cardBg: 'bg-[#1e1035]',
      cardBorder: 'border-purple-900/50',
      screenBg: 'bg-[#0e0719]',
      textPrimary: 'text-slate-100',
      textSecondary: 'text-slate-400',
      fabButton: 'bg-fuchsia-600 hover:bg-fuchsia-500 shadow-fuchsia-500/50',
      inputRing: 'focus:ring-fuchsia-500',
      quickActionRaise: 'bg-fuchsia-950 text-fuchsia-300',
    },
  },
  sepia: {
    id: 'sepia',
    name: 'Heritage Campus Parchment',
    tagline: 'Warm Academic Parchment, Deep Mocha & Burnished Brass',
    accentLabel: 'Mocha & Brass',
    isDark: false,
    category: 'academic',
    colors: {
      primary: '#854d0e',
      primaryHover: '#713f12',
      secondary: '#ca8a04',
      headerBg: '#3a2618',
      headerFrom: '#26180f',
      headerVia: '#3a2618',
      headerTo: '#1f140c',
      accentBadge: '#fefce8',
      accentText: '#854d0e',
      borderAccent: '#ca8a04',
      crestShieldPrimary: '#713f12',
      crestShieldSecondary: '#fde047',
      loginGradientFrom: '#26180f',
      loginGradientVia: '#3a2618',
      loginGradientTo: '#180e07',
    },
    classes: {
      header: 'bg-[#3a2618] text-white',
      buttonPrimary: 'bg-amber-800 hover:bg-amber-900 text-white shadow-amber-900/25',
      buttonOutline: 'border-amber-800 text-amber-800 hover:bg-amber-50',
      badge: 'bg-amber-50 text-amber-900 border-amber-200',
      activeNav: 'text-amber-800 font-semibold',
      cardBg: 'bg-[#fffdfa]',
      cardBorder: 'border-amber-100/70',
      screenBg: 'bg-[#fbf9f4]',
      textPrimary: 'text-stone-800',
      textSecondary: 'text-stone-500',
      fabButton: 'bg-amber-800 hover:bg-amber-900 shadow-amber-900/40',
      inputRing: 'focus:ring-amber-700',
      quickActionRaise: 'bg-amber-100/60 text-amber-900',
    },
  },
  highcontrast: {
    id: 'highcontrast',
    name: 'High-Contrast Accessibility',
    tagline: 'Maximum Legibility Signal Yellow, Pure Obsidian & Stark White',
    accentLabel: 'Stark Contrast',
    isDark: true,
    category: 'accessibility',
    colors: {
      primary: '#eab308',
      primaryHover: '#ca8a04',
      secondary: '#ffffff',
      headerBg: '#000000',
      headerFrom: '#000000',
      headerVia: '#0a0a0a',
      headerTo: '#000000',
      accentBadge: '#171717',
      accentText: '#fde047',
      borderAccent: '#eab308',
      crestShieldPrimary: '#eab308',
      crestShieldSecondary: '#ffffff',
      loginGradientFrom: '#000000',
      loginGradientVia: '#0a0a0a',
      loginGradientTo: '#000000',
    },
    classes: {
      header: 'bg-black text-white border-b-2 border-yellow-400',
      buttonPrimary: 'bg-yellow-400 hover:bg-yellow-300 text-black font-extrabold shadow-none ring-2 ring-white',
      buttonOutline: 'border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-950 font-bold',
      badge: 'bg-black text-yellow-300 border-2 border-yellow-400 font-bold',
      activeNav: 'text-yellow-400 font-black',
      cardBg: 'bg-black',
      cardBorder: 'border-2 border-yellow-400/80',
      screenBg: 'bg-neutral-950',
      textPrimary: 'text-white font-medium',
      textSecondary: 'text-yellow-100',
      fabButton: 'bg-yellow-400 hover:bg-yellow-300 text-black ring-2 ring-white',
      inputRing: 'focus:ring-yellow-400 ring-2',
      quickActionRaise: 'bg-yellow-400 text-black font-bold',
    },
  },
  matrix: {
    id: 'matrix',
    name: 'Cyber Matrix Terminal',
    tagline: 'Electric Matrix Lime, Hacker Pitch Black & Digital Phosphor',
    accentLabel: 'Matrix Lime',
    isDark: true,
    category: 'dark',
    colors: {
      primary: '#22c55e',
      primaryHover: '#16a34a',
      secondary: '#4ade80',
      headerBg: '#051b0f',
      headerFrom: '#020b06',
      headerVia: '#051b0f',
      headerTo: '#010704',
      accentBadge: '#052e16',
      accentText: '#4ade80',
      borderAccent: '#22c55e',
      crestShieldPrimary: '#16a34a',
      crestShieldSecondary: '#86efac',
      loginGradientFrom: '#020b06',
      loginGradientVia: '#051b0f',
      loginGradientTo: '#000402',
    },
    classes: {
      header: 'bg-[#051b0f] text-[#4ade80] border-b border-emerald-900/80',
      buttonPrimary: 'bg-emerald-500 hover:bg-emerald-400 text-black font-bold shadow-emerald-500/30',
      buttonOutline: 'border-emerald-500 text-emerald-400 hover:bg-emerald-950/40',
      badge: 'bg-emerald-950/80 text-emerald-300 border-emerald-800/50 font-mono',
      activeNav: 'text-emerald-400 font-bold',
      cardBg: 'bg-[#08150d]',
      cardBorder: 'border-emerald-900/60',
      screenBg: 'bg-[#030a05]',
      textPrimary: 'text-emerald-100',
      textSecondary: 'text-emerald-400/70',
      fabButton: 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-emerald-500/50',
      inputRing: 'focus:ring-emerald-400',
      quickActionRaise: 'bg-emerald-950 text-emerald-300',
    },
  },
  lavender: {
    id: 'lavender',
    name: 'Wisteria Lavender Mist',
    tagline: 'Calming French Violet, Floral Lilac & Cloud White',
    accentLabel: 'Lavender & Lilac',
    isDark: false,
    category: 'modern',
    colors: {
      primary: '#8b5cf6',
      primaryHover: '#7c3aed',
      secondary: '#c084fc',
      headerBg: '#47326b',
      headerFrom: '#301f4c',
      headerVia: '#47326b',
      headerTo: '#25163e',
      accentBadge: '#faf5ff',
      accentText: '#7c3aed',
      borderAccent: '#a855f7',
      crestShieldPrimary: '#7c3aed',
      crestShieldSecondary: '#e9d5ff',
      loginGradientFrom: '#301f4c',
      loginGradientVia: '#47326b',
      loginGradientTo: '#1e1133',
    },
    classes: {
      header: 'bg-[#47326b] text-white',
      buttonPrimary: 'bg-violet-600 hover:bg-violet-700 text-white shadow-violet-500/25',
      buttonOutline: 'border-violet-600 text-violet-600 hover:bg-violet-50',
      badge: 'bg-violet-50 text-violet-700 border-violet-100',
      activeNav: 'text-violet-600 font-semibold',
      cardBg: 'bg-white',
      cardBorder: 'border-violet-100/60',
      screenBg: 'bg-[#faf9fe]',
      textPrimary: 'text-slate-800',
      textSecondary: 'text-slate-500',
      fabButton: 'bg-violet-600 hover:bg-violet-700 shadow-violet-500/40',
      inputRing: 'focus:ring-violet-500',
      quickActionRaise: 'bg-violet-50 text-violet-700',
    },
  },
  coral: {
    id: 'coral',
    name: 'Tropical Coral Reef',
    tagline: 'Vibrant Living Coral, Peach Blush & Ocean Aqua Accents',
    accentLabel: 'Coral & Peach',
    isDark: false,
    category: 'modern',
    colors: {
      primary: '#f43f5e',
      primaryHover: '#e11d48',
      secondary: '#fb7185',
      headerBg: '#881337',
      headerFrom: '#4c0519',
      headerVia: '#881337',
      headerTo: '#360412',
      accentBadge: '#fff1f2',
      accentText: '#e11d48',
      borderAccent: '#f43f5e',
      crestShieldPrimary: '#e11d48',
      crestShieldSecondary: '#fda4af',
      loginGradientFrom: '#4c0519',
      loginGradientVia: '#881337',
      loginGradientTo: '#2e020e',
    },
    classes: {
      header: 'bg-[#881337] text-white',
      buttonPrimary: 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/25',
      buttonOutline: 'border-rose-500 text-rose-500 hover:bg-rose-50',
      badge: 'bg-rose-50 text-rose-700 border-rose-100',
      activeNav: 'text-rose-500 font-semibold',
      cardBg: 'bg-white',
      cardBorder: 'border-rose-50',
      screenBg: 'bg-slate-50',
      textPrimary: 'text-slate-800',
      textSecondary: 'text-slate-500',
      fabButton: 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/40',
      inputRing: 'focus:ring-rose-400',
      quickActionRaise: 'bg-rose-50 text-rose-600',
    },
  },
  monochrome: {
    id: 'monochrome',
    name: 'Editorial Minimalist Zinc',
    tagline: 'Clean Swiss Typographic Slate, Pure Black & Modern White',
    accentLabel: 'Minimalist Zinc',
    isDark: false,
    category: 'academic',
    colors: {
      primary: '#18181b',
      primaryHover: '#27272a',
      secondary: '#71717a',
      headerBg: '#18181b',
      headerFrom: '#09090b',
      headerVia: '#18181b',
      headerTo: '#000000',
      accentBadge: '#f4f4f5',
      accentText: '#18181b',
      borderAccent: '#71717a',
      crestShieldPrimary: '#27272a',
      crestShieldSecondary: '#a1a1aa',
      loginGradientFrom: '#09090b',
      loginGradientVia: '#18181b',
      loginGradientTo: '#000000',
    },
    classes: {
      header: 'bg-zinc-900 text-white',
      buttonPrimary: 'bg-zinc-900 hover:bg-zinc-800 text-white shadow-zinc-900/25',
      buttonOutline: 'border-zinc-900 text-zinc-900 hover:bg-zinc-100',
      badge: 'bg-zinc-100 text-zinc-800 border-zinc-200',
      activeNav: 'text-zinc-900 font-bold',
      cardBg: 'bg-white',
      cardBorder: 'border-zinc-200',
      screenBg: 'bg-[#fafafa]',
      textPrimary: 'text-zinc-900',
      textSecondary: 'text-zinc-500',
      fabButton: 'bg-zinc-900 hover:bg-zinc-800 shadow-zinc-900/40',
      inputRing: 'focus:ring-zinc-600',
      quickActionRaise: 'bg-zinc-100 text-zinc-900',
    },
  },
  royalgold: {
    id: 'royalgold',
    name: 'Imperial Chancellor Gold',
    tagline: 'Prestige Royal Navy, Burnished Gold & Platinum Foil',
    accentLabel: 'Navy & Imperial Gold',
    isDark: false,
    category: 'academic',
    colors: {
      primary: '#d97706',
      primaryHover: '#b45309',
      secondary: '#1e3a8a',
      headerBg: '#0f172a',
      headerFrom: '#020617',
      headerVia: '#0f172a',
      headerTo: '#1e293b',
      accentBadge: '#fef3c7',
      accentText: '#b45309',
      borderAccent: '#f59e0b',
      crestShieldPrimary: '#1e3a8a',
      crestShieldSecondary: '#f59e0b',
      loginGradientFrom: '#020617',
      loginGradientVia: '#0f172a',
      loginGradientTo: '#1e293b',
    },
    classes: {
      header: 'bg-slate-900 text-amber-400 border-b border-amber-500/30',
      buttonPrimary: 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/25',
      buttonOutline: 'border-amber-600 text-amber-700 hover:bg-amber-50',
      badge: 'bg-amber-50 text-amber-800 border-amber-200',
      activeNav: 'text-amber-600 font-bold',
      cardBg: 'bg-white',
      cardBorder: 'border-amber-100',
      screenBg: 'bg-slate-50',
      textPrimary: 'text-slate-900',
      textSecondary: 'text-slate-600',
      fabButton: 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/40',
      inputRing: 'focus:ring-amber-500',
      quickActionRaise: 'bg-amber-50 text-amber-700',
    },
  },
};

interface ThemeContextType {
  themeId: ThemeId;
  theme: ThemeConfig;
  setThemeId: (id: ThemeId) => void;
  availableThemes: ThemeConfig[];
  // Extended theme settings
  mode: AppearanceMode;
  setMode: (mode: AppearanceMode) => void;
  fontScale: FontScale;
  setFontScale: (scale: FontScale) => void;
  borderRadius: BorderRadiusStyle;
  setBorderRadius: (radius: BorderRadiusStyle) => void;
  shadowDepth: ShadowDepth;
  setShadowDepth: (depth: ShadowDepth) => void;
  headerStyle: HeaderStyle;
  setHeaderStyle: (style: HeaderStyle) => void;
  accentOverride: AccentOverride;
  setAccentOverride: (accent: AccentOverride) => void;
  reducedMotion: boolean;
  setReducedMotion: (reduced: boolean) => void;
  highContrast: boolean;
  setHighContrast: (contrast: boolean) => void;
  autoNightMode: boolean;
  setAutoNightMode: (auto: boolean) => void;
  dyslexiaFont: boolean;
  setDyslexiaFont: (val: boolean) => void;
  oledTrueBlack: boolean;
  setOledTrueBlack: (val: boolean) => void;
  soundEffects: boolean;
  setSoundEffects: (val: boolean) => void;
  readingGuide: boolean;
  setReadingGuide: (val: boolean) => void;
  playSound: (type?: 'click' | 'success' | 'toggle') => void;
  resetAllThemeSettings: () => void;
}

// Web Audio micro-sound generator for feedback
const triggerTone = (type: 'click' | 'success' | 'toggle' = 'click') => {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;
    if (type === 'click') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.04);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.04);
      osc.start(now);
      osc.stop(now + 0.04);
    } else if (type === 'success') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.06); // E5
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.14);
      osc.start(now);
      osc.stop(now + 0.14);
    } else if (type === 'toggle') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(350, now);
      osc.frequency.exponentialRampToValueAtTime(580, now + 0.05);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
    }
  } catch {
    // ignore
  }
};

const ThemeContext = createContext<ThemeContextType>({
  themeId: 'classic',
  theme: THEMES.classic,
  setThemeId: () => {},
  availableThemes: Object.values(THEMES),
  mode: 'system',
  setMode: () => {},
  fontScale: 'normal',
  setFontScale: () => {},
  borderRadius: 'modern',
  setBorderRadius: () => {},
  shadowDepth: 'subtle',
  setShadowDepth: () => {},
  headerStyle: 'gradient',
  setHeaderStyle: () => {},
  accentOverride: 'default',
  setAccentOverride: () => {},
  reducedMotion: false,
  setReducedMotion: () => {},
  highContrast: false,
  setHighContrast: () => {},
  autoNightMode: false,
  setAutoNightMode: () => {},
  dyslexiaFont: false,
  setDyslexiaFont: () => {},
  oledTrueBlack: false,
  setOledTrueBlack: () => {},
  soundEffects: false,
  setSoundEffects: () => {},
  readingGuide: false,
  setReadingGuide: () => {},
  playSound: () => {},
  resetAllThemeSettings: () => {},
});

export const ThemeProvider: React.FC<{
  children: React.ReactNode;
  initialTheme?: ThemeId;
}> = ({ children, initialTheme = 'classic' }) => {
  const [themeId, setThemeIdState] = useState<ThemeId>(() => {
    try {
      const saved = localStorage.getItem('pu_app_theme') as ThemeId;
      if (saved && THEMES[saved]) return saved;
    } catch {
      // ignore
    }
    return initialTheme;
  });

  const [mode, setModeState] = useState<AppearanceMode>(() => {
    try {
      const saved = localStorage.getItem('pu_theme_mode') as AppearanceMode;
      if (saved && ['system', 'light', 'dark'].includes(saved)) return saved;
    } catch {
      // ignore
    }
    return 'system';
  });

  const [fontScale, setFontScaleState] = useState<FontScale>(() => {
    try {
      const saved = localStorage.getItem('pu_theme_font_scale') as FontScale;
      if (saved && ['compact', 'normal', 'comfortable'].includes(saved)) return saved;
    } catch {
      // ignore
    }
    return 'normal';
  });

  const [borderRadius, setBorderRadiusState] = useState<BorderRadiusStyle>(() => {
    try {
      const saved = localStorage.getItem('pu_theme_radius') as BorderRadiusStyle;
      if (saved && ['modern', 'compact', 'pill'].includes(saved)) return saved;
    } catch {
      // ignore
    }
    return 'modern';
  });

  const [shadowDepth, setShadowDepthState] = useState<ShadowDepth>(() => {
    try {
      const saved = localStorage.getItem('pu_theme_shadow_depth') as ShadowDepth;
      if (saved && ['none', 'subtle', 'elevated'].includes(saved)) return saved;
    } catch {
      // ignore
    }
    return 'subtle';
  });

  const [headerStyle, setHeaderStyleState] = useState<HeaderStyle>(() => {
    try {
      const saved = localStorage.getItem('pu_theme_header_style') as HeaderStyle;
      if (saved && ['solid', 'gradient', 'glass'].includes(saved)) return saved;
    } catch {
      // ignore
    }
    return 'gradient';
  });

  const [accentOverride, setAccentOverrideState] = useState<AccentOverride>(() => {
    try {
      const saved = localStorage.getItem('pu_theme_accent_override') as AccentOverride;
      if (saved && ['default', 'blue', 'emerald', 'amber', 'rose', 'purple', 'cyan'].includes(saved)) return saved;
    } catch {
      // ignore
    }
    return 'default';
  });

  const [reducedMotion, setReducedMotionState] = useState<boolean>(() => {
    try {
      return localStorage.getItem('pu_theme_reduced_motion') === 'true';
    } catch {
      return false;
    }
  });

  const [highContrast, setHighContrastState] = useState<boolean>(() => {
    try {
      return localStorage.getItem('pu_theme_high_contrast') === 'true';
    } catch {
      return false;
    }
  });

  const [autoNightMode, setAutoNightModeState] = useState<boolean>(() => {
    try {
      return localStorage.getItem('pu_theme_auto_night') === 'true';
    } catch {
      return false;
    }
  });

  const [dyslexiaFont, setDyslexiaFontState] = useState<boolean>(() => {
    try {
      return localStorage.getItem('pu_theme_dyslexia_font') === 'true';
    } catch {
      return false;
    }
  });

  const [oledTrueBlack, setOledTrueBlackState] = useState<boolean>(() => {
    try {
      return localStorage.getItem('pu_theme_oled_black') === 'true';
    } catch {
      return false;
    }
  });

  const [soundEffects, setSoundEffectsState] = useState<boolean>(() => {
    try {
      return localStorage.getItem('pu_theme_sound_effects') === 'true';
    } catch {
      return false;
    }
  });

  const [readingGuide, setReadingGuideState] = useState<boolean>(() => {
    try {
      return localStorage.getItem('pu_theme_reading_guide') === 'true';
    } catch {
      return false;
    }
  });

  const playSound = (type: 'click' | 'success' | 'toggle' = 'click') => {
    if (soundEffects) {
      triggerTone(type);
    }
  };

  const setThemeId = (id: ThemeId) => {
    setThemeIdState(id);
    playSound('toggle');
    try {
      localStorage.setItem('pu_app_theme', id);
    } catch {}
  };

  // Setter helpers that persist to localStorage
  const setMode = (newMode: AppearanceMode) => {
    setModeState(newMode);
    playSound('toggle');
    try {
      localStorage.setItem('pu_theme_mode', newMode);
    } catch {}
  };

  const setFontScale = (newScale: FontScale) => {
    setFontScaleState(newScale);
    playSound('click');
    try {
      localStorage.setItem('pu_theme_font_scale', newScale);
    } catch {}
  };

  const setBorderRadius = (newRadius: BorderRadiusStyle) => {
    setBorderRadiusState(newRadius);
    playSound('click');
    try {
      localStorage.setItem('pu_theme_radius', newRadius);
    } catch {}
  };

  const setShadowDepth = (newDepth: ShadowDepth) => {
    setShadowDepthState(newDepth);
    playSound('click');
    try {
      localStorage.setItem('pu_theme_shadow_depth', newDepth);
    } catch {}
  };

  const setHeaderStyle = (newStyle: HeaderStyle) => {
    setHeaderStyleState(newStyle);
    playSound('click');
    try {
      localStorage.setItem('pu_theme_header_style', newStyle);
    } catch {}
  };

  const setAccentOverride = (newAccent: AccentOverride) => {
    setAccentOverrideState(newAccent);
    playSound('click');
    try {
      localStorage.setItem('pu_theme_accent_override', newAccent);
    } catch {}
  };

  const setReducedMotion = (val: boolean) => {
    setReducedMotionState(val);
    playSound('toggle');
    try {
      localStorage.setItem('pu_theme_reduced_motion', String(val));
    } catch {}
  };

  const setHighContrast = (val: boolean) => {
    setHighContrastState(val);
    playSound('toggle');
    try {
      localStorage.setItem('pu_theme_high_contrast', String(val));
    } catch {}
  };

  const setAutoNightMode = (val: boolean) => {
    setAutoNightModeState(val);
    playSound('toggle');
    try {
      localStorage.setItem('pu_theme_auto_night', String(val));
    } catch {}
  };

  const setDyslexiaFont = (val: boolean) => {
    setDyslexiaFontState(val);
    playSound('toggle');
    try {
      localStorage.setItem('pu_theme_dyslexia_font', String(val));
    } catch {}
  };

  const setOledTrueBlack = (val: boolean) => {
    setOledTrueBlackState(val);
    playSound('toggle');
    try {
      localStorage.setItem('pu_theme_oled_black', String(val));
    } catch {}
  };

  const setSoundEffects = (val: boolean) => {
    setSoundEffectsState(val);
    if (val) triggerTone('success');
    try {
      localStorage.setItem('pu_theme_sound_effects', String(val));
    } catch {}
  };

  const setReadingGuide = (val: boolean) => {
    setReadingGuideState(val);
    playSound('toggle');
    try {
      localStorage.setItem('pu_theme_reading_guide', String(val));
    } catch {}
  };

  const resetAllThemeSettings = () => {
    setThemeIdState('classic');
    setModeState('system');
    setFontScaleState('normal');
    setBorderRadiusState('modern');
    setShadowDepthState('subtle');
    setHeaderStyleState('gradient');
    setAccentOverrideState('default');
    setReducedMotionState(false);
    setHighContrastState(false);
    setAutoNightModeState(false);
    setDyslexiaFontState(false);
    setOledTrueBlackState(false);
    setSoundEffectsState(false);
    setReadingGuideState(false);
    triggerTone('success');
    try {
      localStorage.removeItem('pu_app_theme');
      localStorage.removeItem('pu_theme_mode');
      localStorage.removeItem('pu_theme_font_scale');
      localStorage.removeItem('pu_theme_radius');
      localStorage.removeItem('pu_theme_shadow_depth');
      localStorage.removeItem('pu_theme_header_style');
      localStorage.removeItem('pu_theme_accent_override');
      localStorage.removeItem('pu_theme_reduced_motion');
      localStorage.removeItem('pu_theme_high_contrast');
      localStorage.removeItem('pu_theme_auto_night');
      localStorage.removeItem('pu_theme_dyslexia_font');
      localStorage.removeItem('pu_theme_oled_black');
      localStorage.removeItem('pu_theme_sound_effects');
      localStorage.removeItem('pu_theme_reading_guide');
    } catch {}
  };

  // Compute effective theme with optional accent override
  const baseTheme = THEMES[themeId] || THEMES.classic;
  const activeTheme = React.useMemo(() => {
    if (accentOverride === 'default') return baseTheme;

    const accentColorMap: Record<AccentOverride, { primary: string; primaryHover: string; secondary: string; borderAccent: string }> = {
      default: { primary: baseTheme.colors.primary, primaryHover: baseTheme.colors.primaryHover, secondary: baseTheme.colors.secondary, borderAccent: baseTheme.colors.borderAccent },
      blue: { primary: '#2563eb', primaryHover: '#1d4ed8', secondary: '#3b82f6', borderAccent: '#3b82f6' },
      emerald: { primary: '#059669', primaryHover: '#047857', secondary: '#10b981', borderAccent: '#10b981' },
      amber: { primary: '#d97706', primaryHover: '#b45309', secondary: '#f59e0b', borderAccent: '#f59e0b' },
      rose: { primary: '#e11d48', primaryHover: '#be123c', secondary: '#fb7185', borderAccent: '#fb7185' },
      purple: { primary: '#7c3aed', primaryHover: '#6d28d9', secondary: '#a855f7', borderAccent: '#8b5cf6' },
      cyan: { primary: '#0891b2', primaryHover: '#0e7490', secondary: '#06b6d4', borderAccent: '#06b6d4' },
    };

    const overrideColors = accentColorMap[accentOverride];
    return {
      ...baseTheme,
      colors: {
        ...baseTheme.colors,
        primary: overrideColors.primary,
        primaryHover: overrideColors.primaryHover,
        secondary: overrideColors.secondary,
        borderAccent: overrideColors.borderAccent,
      },
    };
  }, [baseTheme, accentOverride]);

  useEffect(() => {
    const isSystemDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const currentHour = new Date().getHours();
    const isNightTime = autoNightMode && (currentHour >= 19 || currentHour < 6);

    let shouldBeDark = activeTheme.isDark;

    if (mode === 'dark' || isNightTime) {
      shouldBeDark = true;
    } else if (mode === 'light') {
      shouldBeDark = false;
    } else if (mode === 'system' && !activeTheme.isDark) {
      shouldBeDark = isSystemDark;
    }

    // Apply attributes to document element
    const root = document.documentElement;
    root.classList.toggle('dark', shouldBeDark);
    root.setAttribute('data-font-scale', fontScale);
    root.setAttribute('data-border-radius', borderRadius);
    root.setAttribute('data-shadow-depth', shadowDepth);
    root.setAttribute('data-header-style', headerStyle);
    root.setAttribute('data-accent-override', accentOverride);
    root.setAttribute('data-reduced-motion', String(reducedMotion));
    root.setAttribute('data-high-contrast', String(highContrast));
    root.setAttribute('data-dyslexia-font', String(dyslexiaFont));
    root.setAttribute('data-oled-black', String(oledTrueBlack));
    root.setAttribute('data-reading-guide', String(readingGuide));
  }, [activeTheme.isDark, mode, autoNightMode, fontScale, borderRadius, shadowDepth, headerStyle, accentOverride, reducedMotion, highContrast, dyslexiaFont, oledTrueBlack, readingGuide]);

  const value: ThemeContextType = {
    themeId,
    theme: activeTheme,
    setThemeId,
    availableThemes: Object.values(THEMES),
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
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);

