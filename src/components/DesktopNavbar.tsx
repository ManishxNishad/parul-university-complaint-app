import React from 'react';
import {
  Home,
  FileText,
  PlusCircle,
  Bell,
  HelpCircle,
  Info,
  PhoneCall,
  Palette,
  LogOut,
  ShieldCheck,
} from 'lucide-react';
import { ScreenType, UserProfile } from '../types';
import { useTheme } from '../theme';
import { BackendStatusBadge } from './BackendStatusBadge';

interface DesktopNavbarProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  user: UserProfile | null;
  unreadAlertsCount?: number;
  onOpenEmergency: () => void;
  onOpenThemeSelector: () => void;
  onLogout: () => void;
  onSwitchToStaffPortal?: () => void;
}

export const DesktopNavbar: React.FC<DesktopNavbarProps> = ({
  currentScreen,
  onNavigate,
  user,
  unreadAlertsCount = 0,
  onOpenEmergency,
  onOpenThemeSelector,
  onLogout,
  onSwitchToStaffPortal,
}) => {
  const { theme } = useTheme();

  if (!user) return null;

  const navItems: { id: ScreenType; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Home size={17} /> },
    { id: 'complaints', label: 'Complaints', icon: <FileText size={17} /> },
    { id: 'raise', label: 'Raise Issue', icon: <PlusCircle size={17} /> },
    {
      id: 'alerts',
      label: 'Alerts',
      icon: (
        <div className="relative">
          <Bell size={17} />
          {unreadAlertsCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
              {unreadAlertsCount}
            </span>
          )}
        </div>
      ),
    },
    { id: 'support', label: 'Help & Support', icon: <HelpCircle size={17} /> },
    { id: 'university', label: 'University Info', icon: <Info size={17} /> },
  ];

  return (
    <header
      id="desktop-app-navbar"
      className={`hidden md:block sticky top-0 z-40 border-b backdrop-blur-xl transition-colors duration-300 ${
        theme.isDark
          ? 'bg-slate-900/95 border-slate-800/80 shadow-md'
          : 'bg-white/95 border-slate-200/80 shadow-xs'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Left Brand Area */}
          <div
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3 cursor-pointer group shrink-0"
          >
            {/* University Crest Icon */}
            <div
              className="w-10 h-10 rounded-xl p-1.5 flex items-center justify-center shadow-md ring-2 ring-amber-400/40 relative overflow-hidden transition-transform group-hover:scale-105"
              style={{
                background: `linear-gradient(135deg, ${theme.colors.primary}, #2b0008)`,
              }}
            >
              <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
                <path
                  d="M50 5 L85 20 V52 C85 75 50 95 50 95 C50 95 15 75 15 52 V20 L50 5 Z"
                  fill="#780016"
                  stroke="#FDE68A"
                  strokeWidth="4"
                />
                <path
                  d="M50 12 L78 24 V50 C78 68 50 86 50 86 C50 86 22 68 22 50 V24 L50 12 Z"
                  fill="#F59E0B"
                />
                <path
                  d="M36 32 L42 38 L50 28 L58 38 L64 32 L62 44 H38 L36 32 Z"
                  fill="#FEF3C7"
                />
              </svg>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-base font-extrabold tracking-tight ${
                    theme.isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  Parul University
                </span>
                <span className="px-1.5 py-0.2 rounded-md bg-amber-400 text-slate-950 text-[9px] font-black tracking-wider uppercase shadow-2xs">
                  NAAC A++
                </span>
              </div>
              <p className="text-[11px] text-slate-400 tracking-wide flex items-center gap-1">
                <span>Central Student Grievance Portal</span>
                <span className="text-slate-500">•</span>
                <span className="text-emerald-500 font-semibold flex items-center gap-0.5">
                  <ShieldCheck size={11} /> Verified Portal
                </span>
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-1 lg:gap-1.5 overflow-x-auto">
            {navItems.map((item) => {
              const isActive = currentScreen === item.id;
              return (
                <button
                  key={item.id}
                  id={`desktop-nav-${item.id}`}
                  onClick={() => onNavigate(item.id)}
                  style={{
                    backgroundColor: isActive ? `${theme.colors.primary}18` : undefined,
                    color: isActive
                      ? theme.colors.primary
                      : theme.isDark
                      ? '#94a3b8'
                      : '#64748b',
                    borderColor: isActive ? `${theme.colors.primary}40` : 'transparent',
                  }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition-all whitespace-nowrap ${
                    isActive
                      ? 'shadow-xs font-bold'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span style={{ color: isActive ? theme.colors.primary : undefined }}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Tools: Emergency, Theme Selector, Staff Portal, User Chip */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Real-time Backend Status */}
            <BackendStatusBadge />

            {/* Switch to Staff Portal */}
            {onSwitchToStaffPortal && (
              <button
                id="desktop-switch-staff-portal-btn"
                onClick={onSwitchToStaffPortal}
                className="px-3 py-2 rounded-xl text-xs font-semibold bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 dark:text-amber-400 border border-amber-500/30 flex items-center gap-1.5 transition-all active:scale-95 shadow-2xs"
                title="Switch to Parul University Staff Administrative Portal"
              >
                <ShieldCheck size={15} />
                <span className="hidden lg:inline">Staff Portal</span>
              </button>
            )}

            {/* Emergency Helpline SOS */}
            <button
              id="desktop-emergency-btn"
              onClick={onOpenEmergency}
              className="px-3 py-2 rounded-xl text-xs font-bold bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30 flex items-center gap-2 transition-all active:scale-95"
              title="24/7 Campus Emergency & Ambulance Helplines"
            >
              <PhoneCall size={15} className="animate-pulse" />
              <span className="hidden xl:inline">Helpline</span>
            </button>

            {/* Theme Selector */}
            <button
              id="desktop-theme-btn"
              onClick={onOpenThemeSelector}
              className={`p-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                theme.isDark
                  ? 'bg-slate-800/80 hover:bg-slate-700 text-slate-200 border-slate-700'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
              }`}
              title={`Theme: ${theme.name}. Click to customize.`}
            >
              <Palette size={16} style={{ color: theme.colors.secondary }} />
              <span
                className="w-2.5 h-2.5 rounded-full ring-1 ring-white/30 hidden lg:inline-block"
                style={{ backgroundColor: theme.colors.primary }}
              />
            </button>

            {/* User Profile Chip */}
            <div
              className={`flex items-center gap-2.5 pl-2 pr-1.5 py-1 rounded-xl border ${
                theme.isDark
                  ? 'bg-slate-800/60 border-slate-700'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <button
                onClick={() => onNavigate('profile')}
                className="flex items-center gap-2 text-left"
                title="View Student Profile"
              >
                <div
                  className="w-8 h-8 rounded-full overflow-hidden ring-2 shrink-0"
                  style={{ ringColor: theme.colors.secondary }}
                >
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="hidden lg:block">
                  <div
                    className={`text-xs font-bold leading-tight truncate max-w-[120px] ${
                      theme.isDark ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {user.name}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    {user.enrollmentNo}
                  </div>
                </div>
              </button>

              <button
                id="desktop-logout-btn"
                onClick={onLogout}
                className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-500/10 transition-colors ml-1"
                title="Sign Out"
                aria-label="Sign Out"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
