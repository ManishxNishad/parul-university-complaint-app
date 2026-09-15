import React, { useState } from 'react';
import {
  ChevronLeft,
  PhoneCall,
  Laptop,
  Building2,
  Bus,
  Info,
  HelpCircle,
  ChevronRight,
  ShieldAlert,
  ExternalLink,
  X,
} from 'lucide-react';
import { EMERGENCY_CONTACTS, SUPPORT_DIRECTORY } from '../data/mockData';
import { StatusBar } from './StatusBar';
import { useTheme } from '../theme';

interface HelpSupportScreenProps {
  onBack: () => void;
  onEmergencyCall: () => void;
}

export const HelpSupportScreen: React.FC<HelpSupportScreenProps> = ({
  onBack,
  onEmergencyCall,
}) => {
  const { theme } = useTheme();
  const [selectedDept, setSelectedDept] = useState<(typeof SUPPORT_DIRECTORY)[0] | null>(null);

  const getDeptIcon = (iconName: string) => {
    switch (iconName) {
      case 'Laptop':
        return <Laptop size={18} />;
      case 'Building2':
        return <Building2 size={18} />;
      case 'Bus':
        return <Bus size={18} />;
      case 'HelpCircle':
      default:
        return <HelpCircle size={18} />;
    }
  };

  return (
    <div
      id="help-support-screen"
      className={`min-h-full flex flex-col transition-colors duration-300 ${theme.classes.screenBg}`}
    >
      {/* Header */}
      <div
        className="text-white pt-2 pb-4 px-4 shadow-sm transition-all duration-300"
        style={{
          background: `linear-gradient(135deg, ${theme.colors.headerFrom} 0%, ${theme.colors.headerVia} 60%, ${theme.colors.headerTo} 100%)`,
        }}
      >
        <StatusBar theme="light" />
        <div className="flex items-center justify-between mt-2">
          <button
            id="support-back-btn"
            onClick={onBack}
            className="p-1.5 -ml-1 text-slate-200 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Go back"
          >
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-base font-semibold text-white">Help & Support</h1>
          <div className="w-8" />
        </div>
      </div>

      {/* Body Content */}
      <div className="flex-1 px-4 py-4 space-y-4 overflow-y-auto">
        {/* Emergency Helpline Red Banner */}
        <div className="bg-rose-500/10 border border-rose-500/25 rounded-2xl p-4 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-rose-500/30">
              <PhoneCall size={20} />
            </div>
            <div className="flex-1">
              <h3
                className={`text-sm font-bold ${
                  theme.isDark ? 'text-rose-300' : 'text-slate-900'
                }`}
              >
                Emergency Helpline
              </h3>
              <p
                className={`text-xs mt-0.5 leading-snug ${
                  theme.isDark ? 'text-slate-300' : 'text-slate-600'
                }`}
              >
                For urgent assistance (Safety, Medical etc.)
              </p>

              <button
                id="emergency-call-now-btn"
                type="button"
                onClick={onEmergencyCall}
                className="mt-3 px-6 py-2.5 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-md shadow-rose-600/30 transition-all flex items-center gap-2"
              >
                <PhoneCall size={14} />
                <span>Call Now</span>
              </button>
            </div>
          </div>
        </div>

        {/* Directory List */}
        <div className="space-y-2.5">
          {SUPPORT_DIRECTORY.map((item) => (
            <div
              key={item.id}
              id={`support-item-${item.id}`}
              onClick={() => setSelectedDept(item)}
              className={`p-3.5 rounded-2xl border shadow-xs hover:shadow-sm transition-all flex items-center justify-between cursor-pointer active:scale-[0.99] ${theme.classes.cardBg} ${theme.classes.cardBorder}`}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{
                    backgroundColor: theme.colors.accentBadge,
                    color: theme.colors.accentText,
                  }}
                >
                  {getDeptIcon(item.icon)}
                </div>
                <div>
                  <h4
                    className={`text-xs sm:text-sm font-semibold ${
                      theme.isDark ? 'text-slate-100' : 'text-slate-900'
                    }`}
                  >
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">{item.email}</p>
                </div>
              </div>

              <ChevronRight size={18} className="text-slate-400 shrink-0" />
            </div>
          ))}
        </div>
      </div>

      {/* Detail Modal for Selected Department */}
      {selectedDept && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className={`w-full max-w-sm rounded-2xl p-5 shadow-2xl border ${theme.classes.cardBg} ${theme.classes.cardBorder}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{
                    backgroundColor: theme.colors.accentBadge,
                    color: theme.colors.accentText,
                  }}
                >
                  {getDeptIcon(selectedDept.icon)}
                </div>
                <div>
                  <h3
                    className={`text-sm font-bold ${
                      theme.isDark ? 'text-slate-100' : 'text-slate-900'
                    }`}
                  >
                    {selectedDept.title}
                  </h3>
                  <p className="text-xs text-slate-400">Official Campus Wing</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedDept(null)}
                className="text-slate-400 hover:text-slate-200 p-1"
              >
                <X size={20} />
              </button>
            </div>

            <p className="text-xs text-slate-400 mt-4 leading-relaxed">
              {selectedDept.description}
            </p>

            <div
              className={`mt-4 p-3 rounded-xl space-y-1.5 text-xs border ${
                theme.isDark
                  ? 'bg-slate-800/80 border-slate-750'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Email:</span>
                <a
                  href={`mailto:${selectedDept.email}`}
                  style={{ color: theme.colors.primary }}
                  className="font-semibold hover:underline"
                >
                  {selectedDept.email}
                </a>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Phone:</span>
                <span
                  className={`font-semibold ${
                    theme.isDark ? 'text-slate-200' : 'text-slate-800'
                  }`}
                >
                  {selectedDept.phone}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedDept(null)}
              style={{ backgroundColor: theme.colors.primary }}
              className="w-full mt-4 py-2.5 text-white font-semibold rounded-xl text-xs shadow-md"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
