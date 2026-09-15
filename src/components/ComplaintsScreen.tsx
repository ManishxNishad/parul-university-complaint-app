import React, { useState, useEffect, useMemo } from 'react';
import {
  ChevronLeft,
  CheckCircle2,
  Clock,
  PlayCircle,
  FileCheck,
  Building,
  MessageSquare,
  Sparkles,
  Flame,
  RotateCcw,
  User,
  Search,
  X,
  Eye,
  Tag,
  Share2,
} from 'lucide-react';
import { ComplaintItem, ScreenType } from '../types';
import { StatusBar } from './StatusBar';
import { useTheme } from '../theme';
import { getStoredComplaints } from '../data/complaintsStore';

interface ComplaintsScreenProps {
  complaints: ComplaintItem[];
  onBack: () => void;
  onSelectComplaint: (complaint: ComplaintItem) => void;
  onNavigate: (screen: ScreenType) => void;
  studentEnrollment?: string;
}

type TabType = 'All' | 'Ongoing' | 'Resolved' | 'My Submissions';

export const ComplaintsScreen: React.FC<ComplaintsScreenProps> = ({
  complaints: initialComplaints,
  onBack,
  onSelectComplaint,
  onNavigate,
  studentEnrollment,
}) => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<TabType>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [liveComplaints, setLiveComplaints] = useState<ComplaintItem[]>(() => {
    const stored = getStoredComplaints();
    return stored.length > 0 ? stored : initialComplaints;
  });

  // Automatically sync with localStorage so any updates made reflect immediately
  useEffect(() => {
    const handleUpdate = () => {
      const updated = getStoredComplaints();
      setLiveComplaints(updated);
    };

    const fresh = getStoredComplaints();
    if (fresh.length > 0) {
      setLiveComplaints(fresh);
    } else if (initialComplaints && initialComplaints.length > 0) {
      setLiveComplaints(initialComplaints);
    }

    window.addEventListener('pu_complaints_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('pu_complaints_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [initialComplaints]);

  // Counts for each tab
  const counts = useMemo(() => {
    const ongoing = liveComplaints.filter(
      (c) =>
        c.status === 'Submitted' ||
        c.status === 'Accepted' ||
        c.status === 'In Progress' ||
        c.status === 'Pending' ||
        c.status === 'Under Review' ||
        c.status === 'Escalated' ||
        c.status === 'Reopened'
    ).length;

    const resolved = liveComplaints.filter(
      (c) => c.status === 'Resolved' || c.status === 'Closed'
    ).length;

    const my = studentEnrollment
      ? liveComplaints.filter(
          (c) => c.ugNumber?.toLowerCase() === studentEnrollment.toLowerCase()
        ).length
      : 0;

    return { all: liveComplaints.length, ongoing, resolved, my };
  }, [liveComplaints, studentEnrollment]);

  // Filter complaints based on tab and search query - ALL COMPLAINTS VISIBLE TO ALL USERS BY DEFAULT!
  const filtered = useMemo(() => {
    return liveComplaints.filter((item) => {
      // 1. Tab filter
      if (activeTab === 'Ongoing') {
        const isOngoing =
          item.status === 'Submitted' ||
          item.status === 'Accepted' ||
          item.status === 'In Progress' ||
          item.status === 'Pending' ||
          item.status === 'Under Review' ||
          item.status === 'Escalated' ||
          item.status === 'Reopened';
        if (!isOngoing) return false;
      } else if (activeTab === 'Resolved') {
        const isResolved = item.status === 'Resolved' || item.status === 'Closed';
        if (!isResolved) return false;
      } else if (activeTab === 'My Submissions') {
        if (!studentEnrollment) return false;
        if (item.ugNumber?.toLowerCase() !== studentEnrollment.toLowerCase()) {
          return false;
        }
      }

      // 2. Search filter across all grievance fields
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matches =
          (item.id || '').toLowerCase().includes(q) ||
          (item.title || '').toLowerCase().includes(q) ||
          (item.subject || '').toLowerCase().includes(q) ||
          (item.description || '').toLowerCase().includes(q) ||
          (item.category || '').toLowerCase().includes(q) ||
          (item.department || '').toLowerCase().includes(q) ||
          (item.studentName || '').toLowerCase().includes(q) ||
          (item.ugNumber || '').toLowerCase().includes(q) ||
          (item.location || '').toLowerCase().includes(q) ||
          (item.status || '').toLowerCase().includes(q);
        if (!matches) return false;
      }

      return true;
    });
  }, [liveComplaints, activeTab, studentEnrollment, searchQuery]);

  // Status badge styling
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Resolved':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
            <CheckCircle2 size={11} /> Resolved
          </span>
        );
      case 'In Progress':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30 flex items-center gap-1">
            <PlayCircle size={11} /> In Progress
          </span>
        );
      case 'Accepted':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 flex items-center gap-1">
            <FileCheck size={11} /> Accepted
          </span>
        );
      case 'Escalated':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30 flex items-center gap-1">
            <Flame size={11} /> Escalated
          </span>
        );
      case 'Reopened':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30 flex items-center gap-1">
            <RotateCcw size={11} /> Reopened
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center gap-1">
            <Clock size={11} /> Submitted
          </span>
        );
    }
  };

  // 4-Step Progress Tracker: Submitted -> Accepted -> In Progress -> Resolved
  const renderProgressTracker = (status: string) => {
    const steps = ['Submitted', 'Accepted', 'In Progress', 'Resolved'];

    let currentStepIndex = 0;
    if (status === 'Accepted') currentStepIndex = 1;
    else if (status === 'In Progress') currentStepIndex = 2;
    else if (status === 'Resolved' || status === 'Closed') currentStepIndex = 3;
    else if (status === 'Escalated' || status === 'Reopened') currentStepIndex = 2;

    return (
      <div className="w-full pt-3 pb-1">
        <div className="flex items-center justify-between relative">
          {/* Connecting Track */}
          <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2 h-1 bg-slate-200 dark:bg-slate-800 -z-0 rounded-full">
            <div
              className="h-full bg-blue-600 dark:bg-blue-500 rounded-full transition-all duration-300"
              style={{
                width: `${(currentStepIndex / (steps.length - 1)) * 100}%`,
              }}
            />
          </div>

          {steps.map((stepName, idx) => {
            const isCompleted = idx <= currentStepIndex;
            const isCurrent = idx === currentStepIndex;

            return (
              <div
                key={stepName}
                className="flex flex-col items-center relative z-10"
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                    isCompleted
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                  } ${isCurrent ? 'ring-2 ring-blue-400/50' : ''}`}
                >
                  {isCompleted ? <CheckCircle2 size={12} /> : idx + 1}
                </div>
                <span
                  className={`text-[10px] mt-1 font-medium ${
                    isCurrent
                      ? 'font-bold text-blue-600 dark:text-blue-400'
                      : isCompleted
                      ? 'text-slate-700 dark:text-slate-300'
                      : 'text-slate-400 dark:text-slate-500'
                  }`}
                >
                  {stepName}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div
      id="campus-complaints-screen"
      className={`min-h-full flex flex-col transition-colors duration-300 ${theme.classes.screenBg}`}
    >
      {/* Header */}
      <div
        className="text-white pt-2 pb-5 px-4 sm:px-6 lg:px-8 shadow-sm transition-all duration-300"
        style={{
          background: `linear-gradient(135deg, ${theme.colors.headerFrom} 0%, ${theme.colors.headerVia} 60%, ${theme.colors.headerTo} 100%)`,
        }}
      >
        <StatusBar theme="light" />
        <div className="max-w-5xl mx-auto w-full flex items-center justify-between mt-2">
          <button
            id="complaints-back-btn"
            onClick={onBack}
            className="p-1.5 -ml-1 text-slate-200 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Go back"
          >
            <ChevronLeft size={24} />
          </button>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1.5">
              <h1 className="text-base sm:text-lg font-bold text-white">Campus Complaints</h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/20 text-white backdrop-blur-xs">
                Visible to All
              </span>
            </div>
            <p className="text-[11px] text-white/80 mt-0.5">
              University-Wide Grievance Registry & Transparency Feed
            </p>
          </div>
          <div className="w-8" />
        </div>
      </div>

      {/* Search & Transparency Bar */}
      <div
        className={`px-4 sm:px-6 lg:px-8 py-3 border-b shadow-2xs ${theme.classes.cardBg} ${theme.classes.cardBorder}`}
      >
        <div className="max-w-5xl mx-auto w-full space-y-3">
          {/* Quick Search */}
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              id="complaints-search-input"
              type="text"
              placeholder="Search by ID (#PU-2026...), keyword, department, student, or status..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-8 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Filter Tabs Row */}
          <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1">
            <div className="flex items-center gap-1.5 shrink-0">
              {(
                [
                  { id: 'All', label: 'All Complaints', count: counts.all },
                  { id: 'Ongoing', label: 'Ongoing', count: counts.ongoing },
                  { id: 'Resolved', label: 'Resolved', count: counts.resolved },
                  ...(studentEnrollment
                    ? [{ id: 'My Submissions', label: 'My Complaints', count: counts.my }]
                    : []),
                ] as const
              ).map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    id={`complaints-tab-${tab.id.toLowerCase().replace(/\s+/g, '-')}`}
                    onClick={() => setActiveTab(tab.id as TabType)}
                    style={{
                      backgroundColor: isActive ? theme.colors.primary : undefined,
                      color: isActive ? '#ffffff' : undefined,
                    }}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                      isActive
                        ? 'text-white shadow-xs'
                        : theme.isDark
                        ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        isActive
                          ? 'bg-white/25 text-white'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>

            <span className="text-[11px] font-mono text-slate-400 shrink-0 hidden sm:inline">
              Showing {filtered.length} of {liveComplaints.length}
            </span>
          </div>
        </div>
      </div>

      {/* Complaint Cards List */}
      <div className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 overflow-y-auto">
        <div className="grid grid-cols-1 gap-4">
          {filtered.map((item) => {
            const isUserComplaint =
              Boolean(studentEnrollment && item.ugNumber && item.ugNumber.toLowerCase() === studentEnrollment.toLowerCase());

            return (
              <div
                key={item.id}
                id={`complaint-card-${item.id}`}
                onClick={() => onSelectComplaint(item)}
                className={`p-5 rounded-2xl border ${theme.classes.cardBg} ${theme.classes.cardBorder} shadow-xs hover:shadow-md transition-all cursor-pointer space-y-3.5 relative overflow-hidden`}
              >
                {/* Left vertical accent stripe if it's the student's own complaint */}
                {isUserComplaint && (
                  <div
                    className="absolute left-0 top-0 bottom-0 w-1.5"
                    style={{ backgroundColor: theme.colors.primary }}
                  />
                )}

                {/* Header: ID, Submitter, Category & Status */}
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                        #{item.id}
                      </span>
                      <span className="text-slate-400 text-xs">•</span>
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                        {item.category}
                      </span>

                      {/* Submitter Pill */}
                      <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                        <User size={11} className="text-slate-400" />
                        <span>{item.studentName || 'Parul Student'}</span>
                        {item.ugNumber && (
                          <span className="font-mono text-[10px] text-slate-400">
                            ({item.ugNumber})
                          </span>
                        )}
                      </span>

                      {/* "My Complaint" badge if filed by active student */}
                      {isUserComplaint && (
                        <span
                          className="text-[10px] font-bold px-2 py-0.5 rounded-full border shadow-2xs"
                          style={{
                            backgroundColor: theme.colors.accentBadge,
                            color: theme.colors.accentText,
                            borderColor: theme.colors.accentBadge,
                          }}
                        >
                          ★ My Complaint
                        </span>
                      )}
                    </div>

                    <h3
                      className={`text-base font-bold leading-snug ${
                        theme.isDark ? 'text-slate-100' : 'text-slate-900'
                      }`}
                    >
                      {item.subject || item.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {getStatusBadge(item.status)}
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>

                {/* VISUAL PROGRESS TRACKER (Submitted -> Accepted -> In Progress -> Resolved) */}
                <div className="py-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/80">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center justify-between">
                    <span>Tracking Progress</span>
                    <span className="font-mono text-blue-600 dark:text-blue-400 capitalize">
                      {item.status}
                    </span>
                  </div>
                  {renderProgressTracker(item.status)}
                </div>

                {/* Assigned Department, Location & Submitted Date Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs pt-1">
                  {/* Assigned Department / Staff */}
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/60 flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <Building size={14} className="text-blue-500 shrink-0" />
                    <div className="truncate">
                      <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                        Assigned Dept
                      </span>
                      <span className="font-medium text-xs truncate block">
                        {item.assignedDepartment || item.category}
                        {item.assignedStaff && item.assignedStaff !== 'Unassigned'
                          ? ` (${item.assignedStaff})`
                          : ''}
                      </span>
                    </div>
                  </div>

                  {/* Location or Department */}
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/60 flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <Tag size={14} className="text-indigo-500 shrink-0" />
                    <div className="truncate">
                      <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                        Location / Dept
                      </span>
                      <span className="font-medium text-xs truncate block">
                        {item.location || item.department || 'Campus Facilities'}
                      </span>
                    </div>
                  </div>

                  {/* Submitted Date */}
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/60 flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <Clock size={14} className="text-amber-500 shrink-0" />
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                        Submitted Date
                      </span>
                      <span className="font-medium text-xs block">
                        {item.date} {item.time ? `• ${item.time}` : ''}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Staff Remarks Box (If available from Staff portal) */}
                {item.staffRemarks && (
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 font-semibold text-amber-700 dark:text-amber-400 text-[11px]">
                      <MessageSquare size={13} />
                      <span>Official Staff Remark:</span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 italic pl-5">
                      &quot;{item.staffRemarks}&quot;
                    </p>
                  </div>
                )}

                {/* Resolution Box (If resolved by Staff portal) */}
                {item.resolution && (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 font-semibold text-emerald-700 dark:text-emerald-400 text-[11px]">
                      <CheckCircle2 size={13} />
                      <span>Resolution Summary:</span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 pl-5">
                      {item.resolution}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-slate-400 text-xs space-y-3">
            <p>
              {searchQuery
                ? `No complaints matched "${searchQuery}".`
                : `No complaints found under '${activeTab}'.`}
            </p>
            <button
              onClick={() => onNavigate('raise')}
              className="px-4 py-2 rounded-xl text-white font-semibold text-xs transition-transform active:scale-95 shadow-xs inline-flex items-center gap-1.5"
              style={{ backgroundColor: theme.colors.primary }}
            >
              <Sparkles size={13} /> File a New Complaint
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

