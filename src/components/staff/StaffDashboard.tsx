import React, { useState } from 'react';
import {
  Search,
  Filter,
  Eye,
  AlertTriangle,
  Flame,
  CheckCircle2,
  PlayCircle,
  Clock,
  RotateCcw,
  User,
  Building,
  FileCheck,
  FileText,
  TrendingUp,
  ArrowUpDown,
  RefreshCw,
  UploadCloud,
  Wrench,
  Sparkles,
} from 'lucide-react';
import { ComplaintRecord, PriorityLevel, StaffAccount, StaffViewTab } from '../../types';
import { loadDemoComplaints } from '../../data/complaintsStore';

interface StaffDashboardProps {
  complaints: ComplaintRecord[];
  currentStaff: StaffAccount;
  activeTab: StaffViewTab;
  onSelectComplaint: (complaint: ComplaintRecord) => void;
  onNavigateTab: (tab: StaffViewTab) => void;
  onOpenResolutionUpload?: (complaintId: string) => void;
}

export const StaffDashboard: React.FC<StaffDashboardProps> = ({
  complaints,
  currentStaff,
  activeTab,
  onSelectComplaint,
  onNavigateTab,
  onOpenResolutionUpload,
}) => {
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<
    'All' | 'New' | 'In Progress' | 'Resolved' | 'Escalated' | 'High Priority'
  >('All');

  // Compute Statistics
  const totalCount = complaints.length;
  const newCount = complaints.filter(
    (c) => c.status === 'Submitted' || c.status === 'Pending'
  ).length;
  const pendingCount = complaints.filter(
    (c) => c.status === 'Accepted' || c.status === 'Under Review' || c.status === 'Submitted'
  ).length;
  const inProgressCount = complaints.filter((c) => c.status === 'In Progress').length;
  const resolvedCount = complaints.filter(
    (c) => c.status === 'Resolved' || c.status === 'Closed'
  ).length;
  const escalatedCount = complaints.filter((c) => c.status === 'Escalated').length;

  // Filter complaints based on Tab selection and Filter/Search
  const displayedComplaints = complaints.filter((c) => {
    // 1. Sidebar tab filter
    if (activeTab === 'new' && c.status !== 'Submitted') return false;
    if (activeTab === 'assigned') {
      const staffName = currentStaff.name.toLowerCase();
      const assigned = (c.assignedStaff || '').toLowerCase();
      if (!assigned.includes(staffName) && assigned !== 'unassigned') {
        // Also allow matching by department if assigned
        return false;
      }
    }
    if (activeTab === 'progress' && c.status !== 'In Progress') return false;
    if (
      activeTab === 'resolved' &&
      c.status !== 'Resolved' &&
      c.status !== 'Closed'
    )
      return false;
    if (activeTab === 'escalated' && c.status !== 'Escalated') return false;

    // 2. Chip Filter (All, New, In Progress, Resolved, Escalated, High Priority)
    if (filterMode === 'New' && c.status !== 'Submitted') return false;
    if (filterMode === 'In Progress' && c.status !== 'In Progress') return false;
    if (filterMode === 'Resolved' && c.status !== 'Resolved' && c.status !== 'Closed') return false;
    if (filterMode === 'Escalated' && c.status !== 'Escalated') return false;
    if (filterMode === 'High Priority' && c.priority !== 'High' && c.priority !== 'Emergency')
      return false;

    // 3. Search Query: Complaint ID, Student name, UG number, Subject
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchesId = c.id.toLowerCase().includes(q);
      const matchesStudent = (c.studentName || '').toLowerCase().includes(q);
      const matchesUg = (c.ugNumber || '').toLowerCase().includes(q);
      const matchesSubject = (c.subject || c.title || '').toLowerCase().includes(q);
      const matchesCategory = (c.category || '').toLowerCase().includes(q);
      if (!matchesId && !matchesStudent && !matchesUg && !matchesSubject && !matchesCategory) {
        return false;
      }
    }

    return true;
  });

  const getPriorityBadge = (p: PriorityLevel) => {
    switch (p) {
      case 'Emergency':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <Flame size={11} /> Emergency
          </span>
        );
      case 'High':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            <AlertTriangle size={11} /> High
          </span>
        );
      case 'Medium':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
            Medium
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
            Low
          </span>
        );
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Resolved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 size={11} /> Resolved
          </span>
        );
      case 'In Progress':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <PlayCircle size={11} /> In Progress
          </span>
        );
      case 'Accepted':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-cyan-50 text-cyan-700 border border-cyan-200">
            <FileCheck size={11} /> Accepted
          </span>
        );
      case 'Escalated':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <Flame size={11} /> Escalated
          </span>
        );
      case 'Reopened':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
            <RotateCcw size={11} /> Reopened
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            <Clock size={11} /> New
          </span>
        );
    }
  };

  return (
    <div id="staff-dashboard-root" className="space-y-6">
      {/* 1. Dashboard Statistics Cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Overview Statistics
          </h2>
          <span className="text-[11px] text-slate-400 font-mono">
            {complaints.length} Records in Registry
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
          {/* Total Complaints */}
          <div
            onClick={() => {
              onNavigateTab('dashboard');
              setFilterMode('All');
            }}
            className="p-4 rounded-xl bg-white border border-slate-200 hover:border-slate-300 hover:shadow-sm cursor-pointer transition-all shadow-xs group"
          >
            <div className="flex items-center justify-between text-slate-500 text-xs">
              <span className="font-semibold">Total</span>
              <FileText size={15} className="text-slate-400 group-hover:text-blue-600" />
            </div>
            <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
              {totalCount}
            </div>
            <div className="text-[10px] text-slate-400 mt-1">All campus issues</div>
          </div>

          {/* New */}
          <div
            onClick={() => {
              onNavigateTab('new');
              setFilterMode('New');
            }}
            className="p-4 rounded-xl bg-white border border-slate-200 hover:border-amber-300 hover:shadow-sm cursor-pointer transition-all shadow-xs group"
          >
            <div className="flex items-center justify-between text-amber-700 text-xs">
              <span className="font-semibold">New</span>
              <Clock size={15} />
            </div>
            <div className="text-2xl font-bold font-mono text-amber-600 mt-1">
              {newCount}
            </div>
            <div className="text-[10px] text-slate-400 mt-1">Needs review</div>
          </div>

          {/* Pending */}
          <div
            onClick={() => setFilterMode('All')}
            className="p-4 rounded-xl bg-white border border-slate-200 hover:border-cyan-300 hover:shadow-sm cursor-pointer transition-all shadow-xs group"
          >
            <div className="flex items-center justify-between text-cyan-700 text-xs">
              <span className="font-semibold">Pending</span>
              <FileCheck size={15} />
            </div>
            <div className="text-2xl font-bold font-mono text-cyan-600 mt-1">
              {pendingCount}
            </div>
            <div className="text-[10px] text-slate-400 mt-1">Under inspection</div>
          </div>

          {/* In Progress */}
          <div
            onClick={() => {
              onNavigateTab('progress');
              setFilterMode('In Progress');
            }}
            className="p-4 rounded-xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-sm cursor-pointer transition-all shadow-xs group"
          >
            <div className="flex items-center justify-between text-blue-700 text-xs">
              <span className="font-semibold">In Progress</span>
              <PlayCircle size={15} />
            </div>
            <div className="text-2xl font-bold font-mono text-blue-600 mt-1">
              {inProgressCount}
            </div>
            <div className="text-[10px] text-slate-400 mt-1">Active repair/work</div>
          </div>

          {/* Resolved */}
          <div
            onClick={() => {
              onNavigateTab('resolved');
              setFilterMode('Resolved');
            }}
            className="p-4 rounded-xl bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-sm cursor-pointer transition-all shadow-xs group"
          >
            <div className="flex items-center justify-between text-emerald-700 text-xs">
              <span className="font-semibold">Resolved</span>
              <CheckCircle2 size={15} />
            </div>
            <div className="text-2xl font-bold font-mono text-emerald-600 mt-1">
              {resolvedCount}
            </div>
            <div className="text-[10px] text-slate-400 mt-1">Closed successfully</div>
          </div>

          {/* Escalated */}
          <div
            onClick={() => {
              onNavigateTab('escalated');
              setFilterMode('Escalated');
            }}
            className="p-4 rounded-xl bg-white border border-slate-200 hover:border-rose-300 hover:shadow-sm cursor-pointer transition-all shadow-xs group"
          >
            <div className="flex items-center justify-between text-rose-700 text-xs">
              <span className="font-semibold">Escalated</span>
              <Flame size={15} />
            </div>
            <div className="text-2xl font-bold font-mono text-rose-600 mt-1">
              {escalatedCount}
            </div>
            <div className="text-[10px] text-slate-400 mt-1">Action required</div>
          </div>
        </div>
      </div>

      {/* 2. Filter & Search Controls Bar */}
      <div className="p-4 bg-white border border-slate-200 rounded-2xl space-y-3 shadow-xs">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search size={16} />
            </div>
            <input
              id="staff-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Complaint ID, Student name, UG number, Subject..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500/30"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 text-xs text-slate-400 hover:text-slate-700"
              >
                Clear
              </button>
            )}
          </div>

          {/* Active Filter Mode Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {(
              [
                'All',
                'New',
                'In Progress',
                'Resolved',
                'Escalated',
                'High Priority',
              ] as const
            ).map((mode) => {
              const active = filterMode === mode;
              return (
                <button
                  key={mode}
                  id={`staff-filter-chip-${mode.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => setFilterMode(mode)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    active
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  {mode}
                </button>
              );
            })}
          </div>
        </div>

        {/* Search Results Summary */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
          <div>
            Showing <strong className="text-slate-900">{displayedComplaints.length}</strong> of{' '}
            {complaints.length} complaints
            {searchQuery && <span> matching &quot;{searchQuery}&quot;</span>}
          </div>

          <div className="text-[11px] text-slate-400">
            Updated in real time from <span className="font-mono text-amber-600">localStorage</span>
          </div>
        </div>
      </div>

      {/* 3. Recent Complaints Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <FileText size={17} className="text-blue-600" />
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              Recent Complaints Registry
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            {activeTab === 'dashboard' ? 'All Departments' : `View: ${activeTab.toUpperCase()}`}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 font-mono">Complaint ID</th>
                <th className="px-4 py-3">Student</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Subject</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayedComplaints.map((item) => (
                <tr
                  key={item.id}
                  id={`staff-table-row-${item.id}`}
                  className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                  onClick={() => onSelectComplaint(item)}
                >
                  {/* Complaint ID */}
                  <td className="px-4 py-3.5 font-mono font-bold text-blue-600 whitespace-nowrap">
                    #{item.id}
                  </td>

                  {/* Student */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <div className="font-semibold text-slate-900">{item.studentName}</div>
                    <div className="text-[10px] text-amber-700 font-mono font-medium">{item.ugNumber}</div>
                  </td>

                  {/* Category */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 text-[11px]">
                      {item.category}
                    </span>
                  </td>

                  {/* Subject */}
                  <td className="px-4 py-3.5 max-w-xs">
                    <div className="font-semibold text-slate-800 line-clamp-1">
                      {item.subject}
                    </div>
                    <div className="text-[11px] text-slate-500 line-clamp-1">
                      {item.description}
                    </div>
                  </td>

                  {/* Date */}
                  <td className="px-4 py-3.5 whitespace-nowrap text-slate-600">
                    <div>{item.date}</div>
                    {item.time && <div className="text-[10px] text-slate-400">{item.time}</div>}
                  </td>

                  {/* Priority */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    {getPriorityBadge(item.priority)}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    {getStatusBadge(item.status)}
                  </td>

                  {/* Action */}
                  <td className="px-4 py-3.5 text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-1.5 justify-end">
                      {onOpenResolutionUpload && (
                        <button
                          id={`staff-upload-btn-${item.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenResolutionUpload(item.id);
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border border-emerald-200 hover:border-emerald-600 text-xs font-semibold inline-flex items-center gap-1 transition-all shadow-2xs cursor-pointer"
                          title="Upload steps and work proof taken to resolve"
                        >
                          <UploadCloud size={13} />
                          <span className="hidden sm:inline">
                            {item.resolutionSteps && item.resolutionSteps.length > 0
                              ? `${item.resolutionSteps.length} Steps`
                              : 'Steps & Proof'}
                          </span>
                        </button>
                      )}
                      <button
                        id={`staff-view-btn-${item.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectComplaint(item);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white border border-blue-200 hover:border-blue-600 text-xs font-semibold inline-flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                      >
                        <Eye size={13} />
                        <span>View</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {displayedComplaints.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-14 text-center">
                    {totalCount === 0 ? (
                      <div className="max-w-md mx-auto space-y-3">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 mx-auto flex items-center justify-center shadow-xs">
                          <CheckCircle2 size={24} />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-800">
                            All Data Clean • Grievance Queue is Fresh
                          </div>
                          <div className="text-xs text-slate-500 mt-1 leading-relaxed">
                            Database and Excel registry are clean with 0 open issues. New student grievances submitted from the portal will appear here in real time.
                          </div>
                        </div>
                        <div className="flex items-center justify-center gap-2 pt-2">
                          <button
                            type="button"
                            onClick={() => onNavigateTab('students')}
                            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                          >
                            View Students Excel
                          </button>
                          <button
                            type="button"
                            onClick={() => loadDemoComplaints()}
                            className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Sparkles size={13} />
                            <span>Load Demo Records</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <div className="text-sm font-semibold text-slate-600">No complaints found</div>
                        <div className="text-xs text-slate-400">
                          Try modifying your search keywords or switching filter modes.
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
