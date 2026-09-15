import React from 'react';
import {
  X,
  Home,
  FileText,
  PlusCircle,
  Bell,
  HelpCircle,
  Settings,
  Info,
  Palette,
} from 'lucide-react';
import { ScreenType } from '../types';
import { UniversityLogo } from './UniversityLogo';
import { useTheme } from '../theme';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (screen: ScreenType) => void;
  onOpenSettings?: () => void;
  onOpenAbout?: () => void;
  onOpenThemeSelector?: () => void;
  onSwitchToStaffPortal?: () => void;
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onOpenSettings,
  onOpenAbout,
  onOpenThemeSelector,
  onSwitchToStaffPortal,
}) => {
  const { theme } = useTheme();
  if (!isOpen) return null;

  const handleSelect = (screen: ScreenType) => {
    onNavigate(screen);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer content */}
      <div
        id="side-drawer"
        className="relative w-[300px] max-w-[82%] text-white flex flex-col justify-between p-6 shadow-2xl z-10 animate-in slide-in-from-left duration-300 border-r border-white/10"
        style={{
          background: `linear-gradient(to bottom, ${theme.colors.loginGradientFrom}, ${theme.colors.loginGradientVia}, ${theme.colors.loginGradientTo})`,
        }}
      >
        {/* Top Header */}
        <div>
          <div className="flex justify-end mb-3">
            <button
              id="drawer-close-btn"
              onClick={onClose}
              className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Close menu"
            >
              <X size={22} />
            </button>
          </div>

          {/* Crest & University Title */}
          <div className="mb-6 pt-1">
            <UniversityLogo
              variant="drawer"
              subtitle="Learn Today, Lead Tomorrow."
            />
          </div>

          {/* Menu Items */}
          <nav className="space-y-1">
            <button
              id="drawer-home-link"
              onClick={() => handleSelect('home')}
              className="w-full flex items-center gap-3.5 px-4 py-2.5 text-slate-200 hover:text-white hover:bg-white/10 rounded-xl transition-all text-sm font-medium"
            >
              <Home size={19} style={{ color: theme.colors.secondary }} />
              <span>Home</span>
            </button>

            <button
              id="drawer-complaints-link"
              onClick={() => handleSelect('complaints')}
              className="w-full flex items-center gap-3.5 px-4 py-2.5 text-slate-200 hover:text-white hover:bg-white/10 rounded-xl transition-all text-sm font-medium"
            >
              <FileText size={19} style={{ color: theme.colors.secondary }} />
              <span>Campus Complaints</span>
            </button>

            <button
              id="drawer-raise-link"
              onClick={() => handleSelect('raise')}
              className="w-full flex items-center gap-3.5 px-4 py-2.5 text-slate-200 hover:text-white hover:bg-white/10 rounded-xl transition-all text-sm font-medium"
            >
              <PlusCircle size={19} style={{ color: theme.colors.secondary }} />
              <span>Raise a Complaint</span>
            </button>

            <button
              id="drawer-alerts-link"
              onClick={() => handleSelect('alerts')}
              className="w-full flex items-center gap-3.5 px-4 py-2.5 text-slate-200 hover:text-white hover:bg-white/10 rounded-xl transition-all text-sm font-medium"
            >
              <Bell size={19} style={{ color: theme.colors.secondary }} />
              <span>Alerts</span>
            </button>

            {/* Theme Selector Navigation Item */}
            {onOpenThemeSelector && (
              <button
                id="drawer-theme-link"
                onClick={() => {
                  onClose();
                  onOpenThemeSelector();
                }}
                className="w-full flex items-center justify-between px-4 py-2.5 text-slate-200 hover:text-white hover:bg-white/10 rounded-xl transition-all text-sm font-medium border border-white/10 bg-white/5"
              >
                <div className="flex items-center gap-3.5">
                  <Palette size={19} style={{ color: theme.colors.secondary }} />
                  <span>Theme & Colors</span>
                </div>
                <span
                  className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                  style={{
                    backgroundColor: `${theme.colors.secondary}26`,
                    color: theme.colors.secondary,
                  }}
                >
                  {theme.accentLabel}
                </span>
              </button>
            )}

            <button
              id="drawer-support-link"
              onClick={() => handleSelect('support')}
              className="w-full flex items-center gap-3.5 px-4 py-2.5 text-slate-200 hover:text-white hover:bg-white/10 rounded-xl transition-all text-sm font-medium"
            >
              <HelpCircle size={19} style={{ color: theme.colors.secondary }} />
              <span>Help & Support</span>
            </button>

            <button
              id="drawer-university-link"
              onClick={() => handleSelect('university')}
              className="w-full flex items-center gap-3.5 px-4 py-2.5 text-slate-200 hover:text-white hover:bg-white/10 rounded-xl transition-all text-sm font-medium"
            >
              <Info size={19} style={{ color: theme.colors.secondary }} />
              <span>About Parul University</span>
            </button>

            <button
              id="drawer-settings-link"
              onClick={() => {
                if (onOpenSettings) onOpenSettings();
                else handleSelect('profile');
              }}
              className="w-full flex items-center gap-3.5 px-4 py-2.5 text-slate-200 hover:text-white hover:bg-white/10 rounded-xl transition-all text-sm font-medium"
            >
              <Settings size={19} style={{ color: theme.colors.secondary }} />
              <span>Settings</span>
            </button>

            {onSwitchToStaffPortal && (
              <button
                id="drawer-staff-portal-link"
                onClick={() => {
                  onClose();
                  onSwitchToStaffPortal();
                }}
                className="w-full flex items-center gap-3.5 px-4 py-2.5 text-amber-300 hover:text-amber-200 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 rounded-xl transition-all text-sm font-semibold mt-2 shadow-2xs"
              >
                <span>🛡️ Staff / Admin Portal</span>
              </button>
            )}
          </nav>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-white/10 text-center">
          <p className="text-xs text-slate-400 tracking-wider">Version 1.0.0</p>
          <p className="text-[10px] text-slate-400 mt-0.5">
            Parul University Complaint Portal
          </p>
        </div>
      </div>
    </div>
  );
};
