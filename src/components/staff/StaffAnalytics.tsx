import React from 'react';
import {
  BarChart3,
  TrendingUp,
  CheckCircle2,
  Clock,
  Flame,
  PieChart,
  ShieldCheck,
  AlertCircle,
  FileText,
  Building,
  RotateCcw,
} from 'lucide-react';
import { ComplaintRecord } from '../../types';

interface StaffAnalyticsProps {
  complaints: ComplaintRecord[];
}

export const StaffAnalytics: React.FC<StaffAnalyticsProps> = ({ complaints }) => {
  // Statistics Calculations from localStorage complaints
  const total = complaints.length;

  const resolvedCount = complaints.filter(
    (c) => c.status === 'Resolved' || c.status === 'Closed'
  ).length;

  const pendingCount = complaints.filter(
    (c) =>
      c.status === 'Submitted' ||
      c.status === 'Pending' ||
      c.status === 'Accepted' ||
      c.status === 'Under Review'
  ).length;

  const inProgressCount = complaints.filter((c) => c.status === 'In Progress').length;
  const escalatedCount = complaints.filter((c) => c.status === 'Escalated').length;
  const reopenedCount = complaints.filter((c) => c.status === 'Reopened').length;

  const resolutionRate = total > 0 ? Math.round((resolvedCount / total) * 100) : 0;

  // Complaints by Category
  const categoryMap: Record<string, number> = {};
  complaints.forEach((c) => {
    const cat = c.category || 'General';
    categoryMap[cat] = (categoryMap[cat] || 0) + 1;
  });

  const categoriesSorted = Object.entries(categoryMap).sort((a, b) => b[1] - a[1]);

  // Complaints by Status
  const statusStats = [
    { label: 'Resolved', count: resolvedCount, color: 'bg-emerald-500', text: 'text-emerald-700' },
    { label: 'In Progress', count: inProgressCount, color: 'bg-blue-500', text: 'text-blue-700' },
    { label: 'Pending / New', count: pendingCount, color: 'bg-amber-500', text: 'text-amber-800' },
    { label: 'Escalated', count: escalatedCount, color: 'bg-rose-500', text: 'text-rose-700' },
    { label: 'Reopened', count: reopenedCount, color: 'bg-purple-500', text: 'text-purple-700' },
  ];

  // Complaints by Priority
  const priorityMap: Record<string, number> = {
    Emergency: 0,
    High: 0,
    Medium: 0,
    Low: 0,
  };
  complaints.forEach((c) => {
    const p = c.priority || 'Medium';
    if (priorityMap[p] !== undefined) {
      priorityMap[p]++;
    }
  });

  return (
    <div id="staff-analytics-view" className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600">
            <BarChart3 size={15} />
            <span>Executive Grievance Analytics</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            Campus Redressal Performance
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time metric telemetry computed from current university registry data.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
          <div className="text-right">
            <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
              Resolution Rate
            </div>
            <div className="text-2xl font-black text-emerald-600 font-mono">
              {resolutionRate}%
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
            <TrendingUp size={24} />
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Total Complaints</span>
            <FileText size={16} className="text-blue-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 mt-2">
            {total}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Registered on campus registry
          </div>
        </div>

        {/* Resolved */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-emerald-700 text-xs font-semibold">
            <span>Resolved Complaints</span>
            <CheckCircle2 size={16} />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-emerald-600 mt-2">
            {resolvedCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {resolutionRate}% successful closure
          </div>
        </div>

        {/* Pending */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-amber-700 text-xs font-semibold">
            <span>Pending & Review</span>
            <Clock size={16} />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-amber-600 mt-2">
            {pendingCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Awaiting inspection or acceptance
          </div>
        </div>

        {/* Escalated */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-rose-700 text-xs font-semibold">
            <span>Escalated Issues</span>
            <Flame size={16} />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-rose-600 mt-2">
            {escalatedCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Assigned to Deans & Committee
          </div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Complaints by Category (Horizontal Bar distribution) */}
        <div className="lg:col-span-7 p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                <BarChart3 size={17} className="text-blue-600" />
                Complaints by Category
              </h3>
              <p className="text-xs text-slate-500">Departmental breakdown of student issues</p>
            </div>
            <span className="text-xs font-mono text-slate-500">{categoriesSorted.length} Categories</span>
          </div>

          <div className="space-y-3.5 pt-1">
            {categoriesSorted.map(([category, count]) => {
              const pct = total > 0 ? Math.round((count / total) * 100) : 0;
              return (
                <div key={category} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800">{category}</span>
                    <span className="font-mono text-slate-500">
                      <strong className="text-slate-900">{count}</strong> ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden flex">
                    <div
                      className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}

            {categoriesSorted.length === 0 && (
              <div className="py-8 text-center text-xs text-slate-400">
                No category data available.
              </div>
            )}
          </div>
        </div>

        {/* Right: Complaints by Status & Priority */}
        <div className="lg:col-span-5 space-y-6">
          {/* Status Breakdown */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                <PieChart size={17} className="text-emerald-600" />
                Complaints by Status
              </h3>
              <span className="text-xs text-slate-500">Live Status</span>
            </div>

            {/* Visual Multi-Segment Bar */}
            <div className="w-full h-4 rounded-full bg-slate-100 overflow-hidden flex shadow-inner">
              {statusStats.map((st) => {
                const widthPct = total > 0 ? (st.count / total) * 100 : 0;
                if (widthPct === 0) return null;
                return (
                  <div
                    key={st.label}
                    title={`${st.label}: ${st.count}`}
                    className={`h-full ${st.color} transition-all duration-500`}
                    style={{ width: `${widthPct}%` }}
                  />
                );
              })}
            </div>

            {/* Legend List */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              {statusStats.map((st) => (
                <div
                  key={st.label}
                  className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${st.color}`} />
                    <span className="text-xs font-medium text-slate-700">{st.label}</span>
                  </div>
                  <span className="text-xs font-bold font-mono text-slate-900">{st.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Priority Distribution */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <AlertCircle size={16} className="text-amber-600" />
              Priority Distribution
            </h3>

            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200">
                <div className="text-[10px] uppercase font-semibold text-rose-700">Emergency</div>
                <div className="text-lg font-bold font-mono text-rose-600 mt-0.5">
                  {priorityMap['Emergency']}
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200">
                <div className="text-[10px] uppercase font-semibold text-amber-800">High</div>
                <div className="text-lg font-bold font-mono text-amber-700 mt-0.5">
                  {priorityMap['High']}
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200">
                <div className="text-[10px] uppercase font-semibold text-blue-700">Medium</div>
                <div className="text-lg font-bold font-mono text-blue-600 mt-0.5">
                  {priorityMap['Medium']}
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-[10px] uppercase font-semibold text-slate-600">Low</div>
                <div className="text-lg font-bold font-mono text-slate-700 mt-0.5">
                  {priorityMap['Low']}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
