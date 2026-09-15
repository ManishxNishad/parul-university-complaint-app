import React, { useState } from 'react';
import {
  Menu,
  Bell,
  Search,
  FilePlus,
  Activity,
  Megaphone,
  PhoneCall,
  ChevronRight,
  Home as HomeIcon,
  BookOpen,
  Coffee,
  Palette,
  Building2,
  GraduationCap,
  CalendarDays,
  AlertOctagon,
  MoreHorizontal,
} from 'lucide-react';
import { ComplaintItem, NoticeUpdate, ScreenType, UserProfile } from '../types';
import { StatusBar } from './StatusBar';
import { useTheme } from '../theme';

interface HomeScreenProps {
  user: UserProfile;
  complaints: ComplaintItem[];
  updates?: NoticeUpdate[];
  onOpenDrawer: () => void;
  onNavigate: (screen: ScreenType) => void;
  onSelectComplaint: (complaint: ComplaintItem) => void;
  onEmergencyCall: () => void;
  onOpenThemeSelector?: () => void;
  unreadCount?: number;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  user,
  complaints,
  updates,
  onOpenDrawer,
  onNavigate,
  onSelectComplaint,
  onEmergencyCall,
  onOpenThemeSelector,
  unreadCount = 1,
}) => {
  const { theme, headerStyle } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  // Dynamic header background based on chosen headerStyle
  const headerBackground =
    headerStyle === 'solid'
      ? theme.colors.headerBg
      : headerStyle === 'glass'
      ? `linear-gradient(135deg, ${theme.colors.headerBg}cc, ${theme.colors.headerTo}cc)`
      : `linear-gradient(135deg, ${theme.colors.headerFrom} 0%, ${theme.colors.headerVia} 60%, ${theme.colors.headerTo} 100%)`;

  // Filter complaints based on search
  const filteredComplaints = complaints.filter(
    (c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.studentName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.ugNumber || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.assignedDepartment || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      id="home-screen"
      className={`min-h-full flex flex-col transition-colors duration-300 ${theme.classes.screenBg}`}
    >
      {/* Top Header Banner */}
      <div
        className={`text-white pt-2 pb-6 px-4 sm:px-6 lg:px-8 shadow-md rounded-b-[28px] transition-all duration-300 relative overflow-hidden ${
          headerStyle === 'glass' ? 'backdrop-blur-md' : ''
        }`}
        style={{
          background: headerBackground,
        }}
      >
        {/* Subtle decorative background glow */}
        <div
          className="absolute -top-10 -right-10 w-44 h-44 rounded-full opacity-20 blur-2xl pointer-events-none"
          style={{ backgroundColor: theme.colors.secondary }}
        />

        <StatusBar theme="light" />

        <div className="max-w-6xl mx-auto w-full">
          {/* Top Navbar Row (Mobile only, desktop uses DesktopNavbar) */}
          <div className="flex items-center justify-between mt-2 px-1 relative z-10 md:hidden">
            {/* Menu Button */}
            <button
              id="home-menu-btn"
              onClick={onOpenDrawer}
              className="p-2 text-slate-200 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>

            {/* Title */}
            <h1
              id="home-header-title"
              className="text-base sm:text-lg font-semibold tracking-wide text-white"
            >
              Parul University
            </h1>

            {/* Right Icons: Theme Switcher, Notifications & Profile */}
            <div className="flex items-center gap-1">
              {/* Quick Theme Switcher Button */}
              {onOpenThemeSelector && (
                <button
                  id="home-theme-btn"
                  onClick={onOpenThemeSelector}
                  className="p-2 text-slate-200 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                  title={`Current Theme: ${theme.name}. Click to change.`}
                  aria-label="Change Theme"
                >
                  <Palette size={19} />
                </button>
              )}

              <button
                id="home-notif-btn"
                onClick={() => onNavigate('alerts')}
                className="relative p-2 text-slate-200 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                aria-label="Notifications"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-slate-900" />
                )}
              </button>

              <button
                id="home-profile-avatar-btn"
                onClick={() => onNavigate('profile')}
                className="w-8 h-8 rounded-full ring-2 overflow-hidden ml-0.5"
                style={{ borderColor: theme.colors.secondary }}
                aria-label="Go to Profile"
              >
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              </button>
            </div>
          </div>

          {/* Greeting Section */}
          <div className="mt-3 md:mt-4 px-2 relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-baseline gap-2">
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight">
                    Hello, {user.name.split(' ')[0]}
                  </h2>
                  <span className="text-xl lg:text-2xl">👋</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-200/90 mt-1 max-w-xl leading-relaxed">
                  Report issues, track grievances and help maintain university excellence across all faculties.
                </p>
              </div>

              {/* Active Theme Pill Tag */}
              {onOpenThemeSelector && (
                <button
                  onClick={onOpenThemeSelector}
                  className="self-start sm:self-auto px-3 py-1.5 rounded-full text-xs font-semibold bg-white/15 hover:bg-white/25 text-slate-100 flex items-center gap-2 backdrop-blur-xs transition-colors border border-white/15 shadow-sm"
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: theme.colors.secondary }}
                  />
                  <span>{theme.accentLabel}</span>
                </button>
              )}
            </div>

            {/* Search Bar */}
            <div className="relative mt-4 max-w-2xl">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                id="home-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search issues, departments, complaints..."
                className="w-full pl-10 pr-4 py-2.5 bg-white text-slate-800 placeholder-slate-400 rounded-xl text-xs sm:text-sm shadow-sm focus:outline-none border border-slate-100 transition-all"
                style={{
                  outlineColor: theme.colors.primary,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Body */}
      <div className="flex-1 px-4 sm:px-6 lg:px-8 py-6 space-y-6 overflow-y-auto max-w-6xl mx-auto w-full">
        {/* Responsive 2-column layout on laptop/desktop (lg:) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Column (8 cols on lg): Quick actions + Complaints */}
          <div className="lg:col-span-8 space-y-6">
            {/* 4 Quick Action Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
              {/* Raise a Complaint */}
              <button
                id="quick-action-raise"
                onClick={() => onNavigate('raise')}
                className={`flex flex-col items-center text-center p-3 rounded-2xl border ${theme.classes.cardBg} ${theme.classes.cardBorder} shadow-xs hover:shadow-md transition-all active:scale-95`}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-2 transition-colors"
                  style={{
                    backgroundColor: theme.colors.accentBadge,
                    color: theme.colors.accentText,
                  }}
                >
                  <FilePlus size={22} />
                </div>
                <span
                  className={`text-xs font-semibold leading-tight ${
                    theme.isDark ? 'text-slate-200' : 'text-slate-700'
                  }`}
                >
                  Raise Issue
                </span>
              </button>

              {/* Track Status */}
              <button
                id="quick-action-track"
                onClick={() => onNavigate('complaints')}
                className={`flex flex-col items-center text-center p-3 rounded-2xl border ${theme.classes.cardBg} ${theme.classes.cardBorder} shadow-xs hover:shadow-md transition-all active:scale-95`}
              >
                <div className="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-2">
                  <Activity size={22} />
                </div>
                <span
                  className={`text-xs font-semibold leading-tight ${
                    theme.isDark ? 'text-slate-200' : 'text-slate-700'
                  }`}
                >
                  Track Status
                </span>
              </button>

              {/* View Notices */}
              <button
                id="quick-action-notices"
                onClick={() => onNavigate('alerts')}
                className={`flex flex-col items-center text-center p-3 rounded-2xl border ${theme.classes.cardBg} ${theme.classes.cardBorder} shadow-xs hover:shadow-md transition-all active:scale-95`}
              >
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-2">
                  <Megaphone size={22} />
                </div>
                <span
                  className={`text-xs font-semibold leading-tight ${
                    theme.isDark ? 'text-slate-200' : 'text-slate-700'
                  }`}
                >
                  View Notices
                </span>
              </button>

              {/* Emergency Help */}
              <button
                id="quick-action-emergency"
                onClick={onEmergencyCall}
                className={`flex flex-col items-center text-center p-3 rounded-2xl border ${theme.classes.cardBg} ${theme.classes.cardBorder} shadow-xs hover:shadow-md transition-all active:scale-95`}
              >
                <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-2 animate-pulse">
                  <PhoneCall size={22} />
                </div>
                <span
                  className={`text-xs font-semibold leading-tight ${
                    theme.isDark ? 'text-slate-200' : 'text-slate-700'
                  }`}
                >
                  Emergency
                </span>
              </button>
            </div>

            {/* Section: Campus Complaints & Grievances (Visible to All) */}
            <div>
              <div className="flex items-center justify-between mb-3 px-0.5">
                <div>
                  <div className="flex items-center gap-2">
                    <h3
                      className={`text-base font-bold ${
                        theme.isDark ? 'text-slate-200' : 'text-slate-800'
                      }`}
                    >
                      Campus Complaints Feed
                    </h3>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                      All Users
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Live grievances submitted across university departments
                  </p>
                </div>
                <button
                  id="complaints-view-all-btn"
                  onClick={() => onNavigate('complaints')}
                  className="text-xs font-semibold hover:underline transition-colors shrink-0"
                  style={{ color: theme.colors.primary }}
                >
                  View All ({complaints.length})
                </button>
              </div>

              {/* Complaints List Cards */}
              <div className="space-y-3">
                {filteredComplaints.slice(0, 5).map((item) => {
                  const isHostel = item.category.includes('Hostel');
                  const isLibrary = item.category.includes('Library');
                  const isCampus = item.category.includes('Campus');
                  const isAcademic = item.category.includes('academic') || item.category.includes('Academic');
                  const isEvents = item.category.includes('Events') || item.category.includes('Event');
                  const isHarassment = item.category.includes('Harassment');
                  const isUserComplaint =
                    Boolean(user?.enrollmentNo && item.ugNumber && item.ugNumber.toLowerCase() === user.enrollmentNo.toLowerCase());

                  return (
                    <div
                      key={item.id}
                      id={`home-complaint-${item.id}`}
                      onClick={() => onSelectComplaint(item)}
                      className={`p-4 rounded-2xl border ${theme.classes.cardBg} ${theme.classes.cardBorder} shadow-xs hover:shadow-md transition-all flex items-center justify-between cursor-pointer active:scale-[0.99] relative overflow-hidden`}
                    >
                      {isUserComplaint && (
                        <div
                          className="absolute left-0 top-0 bottom-0 w-1"
                          style={{ backgroundColor: theme.colors.primary }}
                        />
                      )}
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div
                          className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                            isHostel
                              ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
                              : isLibrary
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                              : isCampus
                              ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                              : isAcademic
                              ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                              : isEvents
                              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                              : isHarassment
                              ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                              : 'bg-slate-500/10 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          {isHostel ? (
                            <HomeIcon size={22} />
                          ) : isLibrary ? (
                            <BookOpen size={22} />
                          ) : isCampus ? (
                            <Building2 size={22} />
                          ) : isAcademic ? (
                            <GraduationCap size={22} />
                          ) : isEvents ? (
                            <CalendarDays size={22} />
                          ) : isHarassment ? (
                            <AlertOctagon size={22} />
                          ) : (
                            <MoreHorizontal size={22} />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4
                              className={`text-sm font-semibold leading-snug truncate ${
                                theme.isDark ? 'text-slate-100' : 'text-slate-900'
                              }`}
                            >
                              {item.title}
                            </h4>
                            {isUserComplaint && (
                              <span
                                className="text-[9px] font-bold px-1.5 py-0.2 rounded-full"
                                style={{
                                  backgroundColor: theme.colors.accentBadge,
                                  color: theme.colors.accentText,
                                }}
                              >
                                My Issue
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span className="text-xs text-slate-400 font-mono">
                              #{item.id}
                            </span>
                            <span className="text-[10px] text-slate-400">•</span>
                            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate max-w-[120px]">
                              {item.studentName || item.ugNumber || 'Student'}
                            </span>
                            <span className="text-[10px] text-slate-400">•</span>
                            <span
                              className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                                item.status === 'Resolved'
                                  ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                                  : item.status === 'In Progress'
                                  ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                                  : 'bg-slate-500/15 text-slate-600 dark:text-slate-400 border border-slate-500/20'
                              }`}
                            >
                              {item.status}
                            </span>
                          </div>
                        </div>
                      </div>

                      <ChevronRight size={18} className="text-slate-400 shrink-0 ml-2" />
                    </div>
                  );
                })}

                {filteredComplaints.length === 0 && (
                  <div
                    className={`p-8 rounded-2xl border text-center ${theme.classes.cardBg} ${theme.classes.cardBorder} shadow-xs space-y-3`}
                  >
                    <div className="w-14 h-14 mx-auto rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                      <FilePlus size={24} />
                    </div>
                    <div>
                      <h4
                        className={`text-sm font-bold ${
                          theme.isDark ? 'text-slate-200' : 'text-slate-800'
                        }`}
                      >
                        No Complaints Filed Yet
                      </h4>
                      <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 leading-relaxed">
                        Your complaint history is currently empty. Need assistance with hostel, campus wifi, or academic issues?
                      </p>
                    </div>
                    <button
                      type="button"
                      id="home-raise-empty-btn"
                      onClick={() => onNavigate('raise')}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-white shadow-xs transition-transform active:scale-95 inline-flex items-center gap-1.5"
                      style={{ backgroundColor: theme.colors.primary }}
                    >
                      <FilePlus size={15} /> Raise New Complaint
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Side Column (4 cols on lg): Campus Helplines & Support */}
          <div className="lg:col-span-4 space-y-6">
            {/* Campus 24/7 Helpline & Support Card */}
            <div
              className={`p-5 rounded-2xl border ${theme.classes.cardBg} ${theme.classes.cardBorder} shadow-xs space-y-3.5`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-500 dark:text-rose-400 flex items-center gap-1.5">
                  <PhoneCall size={16} /> Campus Support
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400">
                  24x7 ACTIVE
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Direct hotline for hostel emergencies, medical dispensary, and campus security dispatch.
              </p>
              <button
                type="button"
                onClick={onEmergencyCall}
                className="w-full py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <PhoneCall size={14} />
                <span>Call Emergency Helpline</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
