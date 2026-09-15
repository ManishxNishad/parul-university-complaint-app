import React, { useState } from 'react';
import {
  AlertCircle,
  Info,
  CheckCircle2,
  Megaphone,
  Bell,
  Check,
} from 'lucide-react';
import { NotificationItem, ScreenType } from '../types';
import { StatusBar } from './StatusBar';
import { useTheme } from '../theme';

interface AlertsScreenProps {
  notifications: NotificationItem[];
  onNavigate: (screen: ScreenType) => void;
  onSelectComplaintId?: (complaintId: string) => void;
  onMarkAllRead?: () => void;
}

export const AlertsScreen: React.FC<AlertsScreenProps> = ({
  notifications,
  onNavigate,
  onSelectComplaintId,
  onMarkAllRead,
}) => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<'All' | 'Updates'>('All');

  const filtered = notifications.filter((item) => {
    // Exclude reminders from alert section
    if ((item as any).category === 'Reminders' || (item as any).isReminder) return false;
    if (activeTab === 'All') return true;
    return item.category === activeTab;
  });

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'alert':
        return (
          <div className="w-10 h-10 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
            <AlertCircle size={20} />
          </div>
        );
      case 'info':
        return (
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
            style={{
              backgroundColor: theme.colors.accentBadge,
              color: theme.colors.accentText,
            }}
          >
            <Info size={20} />
          </div>
        );
      case 'success':
        return (
          <div className="w-10 h-10 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 size={20} />
          </div>
        );
      case 'event':
        return (
          <div className="w-10 h-10 rounded-full bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
            <Megaphone size={20} />
          </div>
        );
      case 'warning':
      default:
        return (
          <div className="w-10 h-10 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Bell size={20} />
          </div>
        );
    }
  };

  return (
    <div
      id="alerts-screen"
      className={`min-h-full flex flex-col transition-colors duration-300 ${theme.classes.screenBg}`}
    >
      {/* Header */}
      <div
        className="text-white pt-2 pb-4 px-4 sm:px-6 lg:px-8 shadow-sm transition-all duration-300"
        style={{
          background: `linear-gradient(135deg, ${theme.colors.headerFrom} 0%, ${theme.colors.headerVia} 60%, ${theme.colors.headerTo} 100%)`,
        }}
      >
        <StatusBar theme="light" />
        <div className="max-w-5xl mx-auto w-full flex items-center justify-between mt-2">
          <h1 className="text-base sm:text-lg font-semibold text-white">
            Alerts & Notifications
          </h1>
          {onMarkAllRead && (
            <button
              onClick={onMarkAllRead}
              className="text-xs hover:underline flex items-center gap-1 font-medium transition-colors"
              style={{ color: theme.colors.secondary }}
            >
              <Check size={14} />
              <span>Mark read</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div
        className={`px-4 sm:px-6 lg:px-8 py-3 border-b shadow-2xs ${theme.classes.cardBg} ${theme.classes.cardBorder}`}
      >
        <div className="max-w-5xl mx-auto w-full flex items-center gap-2">
          {(['All', 'Updates'] as const).map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                id={`alerts-tab-${tab.toLowerCase()}`}
                onClick={() => setActiveTab(tab)}
                style={{
                  backgroundColor: isActive ? theme.colors.primary : undefined,
                  color: isActive ? '#ffffff' : undefined,
                }}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'text-white shadow-xs'
                    : theme.isDark
                    ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* Notification Cards List */}
      <div className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filtered.map((item) => (
            <div
              key={item.id}
              id={`alert-item-${item.id}`}
              onClick={() => {
                if (item.complaintId) {
                  if (onSelectComplaintId) {
                    onSelectComplaintId(item.complaintId);
                  } else {
                    onNavigate('details');
                  }
                }
              }}
              className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-3.5 ${
                theme.classes.cardBg
              } ${theme.classes.cardBorder} shadow-xs hover:shadow-md ${
                item.complaintId ? 'cursor-pointer active:scale-[0.99]' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                {getIcon(item.type)}
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4
                      className={`text-sm font-semibold leading-tight ${
                        theme.isDark ? 'text-slate-100' : 'text-slate-900'
                      }`}
                    >
                      {item.title}
                    </h4>
                    {item.unread && (
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: theme.colors.primary }}
                      />
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {item.message}
                  </p>
                </div>
              </div>

              <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap shrink-0 mt-0.5">
                {item.timestamp}
              </span>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-slate-400 text-xs">
            No notifications in this category.
          </div>
        )}
      </div>
    </div>
  );
};
