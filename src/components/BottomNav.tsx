import React from 'react';
import { Home, FileText, Bell, User, Plus } from 'lucide-react';
import { ScreenType } from '../types';
import { useTheme } from '../theme';

interface BottomNavProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  unreadAlertsCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentScreen,
  onNavigate,
  unreadAlertsCount = 1,
}) => {
  const { theme } = useTheme();

  return (
    <div
      id="app-bottom-nav"
      className={`md:hidden sticky bottom-0 left-0 right-0 backdrop-blur-md border-t px-3 py-2 z-40 flex items-center justify-around transition-colors duration-300 ${
        theme.isDark
          ? 'bg-slate-900/95 border-slate-800 shadow-[0_-4px_16px_rgba(0,0,0,0.4)]'
          : 'bg-white/95 border-slate-200 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]'
      }`}
    >
      {/* Home */}
      <button
        id="nav-home-btn"
        onClick={() => onNavigate('home')}
        style={{
          color: currentScreen === 'home' ? theme.colors.primary : undefined,
        }}
        className={`flex flex-col items-center justify-center py-1 px-3 transition-colors ${
          currentScreen === 'home'
            ? 'font-semibold'
            : theme.isDark
            ? 'text-slate-400 hover:text-slate-200'
            : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        <Home size={22} strokeWidth={currentScreen === 'home' ? 2.5 : 2} />
        <span className="text-[11px] mt-1">Home</span>
      </button>

      {/* Complaints */}
      <button
        id="nav-complaints-btn"
        onClick={() => onNavigate('complaints')}
        style={{
          color: currentScreen === 'complaints' ? theme.colors.primary : undefined,
        }}
        className={`flex flex-col items-center justify-center py-1 px-3 transition-colors ${
          currentScreen === 'complaints'
            ? 'font-semibold'
            : theme.isDark
            ? 'text-slate-400 hover:text-slate-200'
            : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        <FileText size={22} strokeWidth={currentScreen === 'complaints' ? 2.5 : 2} />
        <span className="text-[11px] mt-1">Complaints</span>
      </button>

      {/* Floating Center (+) Button */}
      <div className="relative -top-4 flex items-center justify-center">
        <button
          id="nav-raise-plus-btn"
          onClick={() => onNavigate('raise')}
          className="w-12 h-12 rounded-full text-white flex items-center justify-center active:scale-95 transition-all shadow-lg border-4"
          style={{
            backgroundColor: theme.colors.primary,
            borderColor: theme.isDark ? '#0f172a' : '#ffffff',
            boxShadow: `0 10px 20px -3px ${theme.colors.primary}66`,
          }}
          title="Raise a Complaint"
          aria-label="Raise a Complaint"
        >
          <Plus size={24} strokeWidth={2.8} />
        </button>
      </div>

      {/* Alerts */}
      <button
        id="nav-alerts-btn"
        onClick={() => onNavigate('alerts')}
        style={{
          color: currentScreen === 'alerts' ? theme.colors.primary : undefined,
        }}
        className={`relative flex flex-col items-center justify-center py-1 px-3 transition-colors ${
          currentScreen === 'alerts'
            ? 'font-semibold'
            : theme.isDark
            ? 'text-slate-400 hover:text-slate-200'
            : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        <div className="relative">
          <Bell size={22} strokeWidth={currentScreen === 'alerts' ? 2.5 : 2} />
          {unreadAlertsCount > 0 && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse" />
          )}
        </div>
        <span className="text-[11px] mt-1">Alerts</span>
      </button>

      {/* Profile */}
      <button
        id="nav-profile-btn"
        onClick={() => onNavigate('profile')}
        style={{
          color: currentScreen === 'profile' ? theme.colors.primary : undefined,
        }}
        className={`flex flex-col items-center justify-center py-1 px-3 transition-colors ${
          currentScreen === 'profile'
            ? 'font-semibold'
            : theme.isDark
            ? 'text-slate-400 hover:text-slate-200'
            : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        <User size={22} strokeWidth={currentScreen === 'profile' ? 2.5 : 2} />
        <span className="text-[11px] mt-1">Profile</span>
      </button>
    </div>
  );
};
