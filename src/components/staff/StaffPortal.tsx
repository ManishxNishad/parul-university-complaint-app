import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Inbox,
  UserCheck,
  PlayCircle,
  CheckCircle2,
  Flame,
  BarChart3,
  User,
  LogOut,
  Menu,
  X,
  GraduationCap,
  ShieldCheck,
  Bell,
  Search,
  ExternalLink,
  UploadCloud,
  FileSpreadsheet,
  Sparkles,
} from 'lucide-react';
import { ComplaintRecord, StaffAccount, StaffViewTab } from '../../types';
import {
  clearActiveStaffSession,
  cleanAllData,
  getStoredComplaints,
  notifyComplaintsUpdated,
  saveStoredComplaints,
} from '../../data/complaintsStore';
import { StaffDashboard } from './StaffDashboard';
import { StaffAnalytics } from './StaffAnalytics';
import { StaffProfile } from './StaffProfile';
import { StaffComplaintModal } from './StaffComplaintModal';
import { StaffResolutionUpload } from './StaffResolutionUpload';
import { StaffStudentsExcelView } from './StaffStudentsExcelView';
import { BackendStatusBadge } from '../BackendStatusBadge';

interface StaffPortalProps {
  currentStaff: StaffAccount;
  onLogout: () => void;
  onSwitchToStudentPortal: () => void;
}

export const StaffPortal: React.FC<StaffPortalProps> = ({
  currentStaff,
  onLogout,
  onSwitchToStudentPortal,
}) => {
  const [activeTab, setActiveTab] = useState<StaffViewTab>('dashboard');
  const [complaints, setComplaints] = useState<ComplaintRecord[]>(() => getStoredComplaints());
  const [selectedComplaint, setSelectedComplaint] = useState<ComplaintRecord | null>(null);
  const [preselectedUploadComplaintId, setPreselectedUploadComplaintId] = useState<string | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [staffUser, setStaffUser] = useState<StaffAccount>(currentStaff);

  // Sync state with localStorage on mount and when updates occur
  useEffect(() => {
    const handleStorageUpdate = () => {
      setComplaints(getStoredComplaints());
    };

    window.addEventListener('pu_complaints_updated', handleStorageUpdate);
    window.addEventListener('storage', handleStorageUpdate);

    return () => {
      window.removeEventListener('pu_complaints_updated', handleStorageUpdate);
      window.removeEventListener('storage', handleStorageUpdate);
    };
  }, []);

  const handleComplaintUpdated = (updated: ComplaintRecord) => {
    setSelectedComplaint(updated);
    setComplaints(getStoredComplaints());
  };

  const handleStaffLogout = () => {
    clearActiveStaffSession();
    onLogout();
  };

  const [isCleaning, setIsCleaning] = useState(false);
  const handleCleanData = async () => {
    if (!window.confirm('Clean all complaints and refresh the system to a clean state? This clears test data from both frontend and backend.')) {
      return;
    }
    setIsCleaning(true);
    try {
      await cleanAllData();
      setComplaints([]);
      setSelectedComplaint(null);
    } finally {
      setIsCleaning(false);
    }
  };

  // Badges for sidebar
  const newCount = complaints.filter(
    (c) => c.status === 'Submitted' || c.status === 'Pending'
  ).length;
  const inProgressCount = complaints.filter((c) => c.status === 'In Progress').length;
  const resolvedCount = complaints.filter(
    (c) => c.status === 'Resolved' || c.status === 'Closed'
  ).length;
  const escalatedCount = complaints.filter((c) => c.status === 'Escalated').length;
  const assignedToMeCount = complaints.filter(
    (c) =>
      (c.assignedStaff || '').toLowerCase().includes(staffUser.name.toLowerCase()) ||
      c.assignedStaff === 'Unassigned'
  ).length;

  const sidebarNavItems: {
    id: StaffViewTab;
    label: string;
    icon: React.ReactNode;
    badge?: number;
    badgeColor?: string;
  }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard size={18} />,
    },
    {
      id: 'new',
      label: 'New Complaints',
      icon: <Inbox size={18} />,
      badge: newCount,
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    },
    {
      id: 'assigned',
      label: 'Assigned to Me',
      icon: <UserCheck size={18} />,
      badge: assignedToMeCount,
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
    },
    {
      id: 'progress',
      label: 'In Progress',
      icon: <PlayCircle size={18} />,
      badge: inProgressCount,
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
    },
    {
      id: 'resolved',
      label: 'Resolved',
      icon: <CheckCircle2 size={18} />,
      badge: resolvedCount,
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    },
    {
      id: 'escalated',
      label: 'Escalated',
      icon: <Flame size={18} />,
      badge: escalatedCount,
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
    },
    {
      id: 'upload',
      label: 'Upload Resolution',
      icon: <UploadCloud size={18} />,
      badge: inProgressCount > 0 ? inProgressCount : undefined,
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: <BarChart3 size={18} />,
    },
    {
      id: 'students',
      label: 'Students Excel Sheet',
      icon: <FileSpreadsheet size={18} />,
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: <User size={18} />,
    },
  ];

  return (
    <div
      id="staff-portal-shell"
      className="min-h-screen w-full bg-white text-slate-800 flex flex-col font-sans antialiased"
    >
      {/* 1. TOP HEADER (ADMINISTRATIVE) */}
      <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
        <div className="flex items-center gap-3">
          {/* Mobile Sidebar Toggle Button */}
          <button
            id="staff-mobile-menu-btn"
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            className="md:hidden p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100"
            aria-label="Toggle sidebar"
          >
            {isMobileSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Logo & University Admin Brand */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-amber-50 border border-amber-300 flex items-center justify-center text-amber-700 font-bold text-sm shadow-xs">
              PU
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <span>Parul University</span>
                <span className="text-slate-300">•</span>
                <span className="text-amber-600 font-semibold text-[10px]">Staff Portal</span>
              </div>
              <div className="text-[11px] text-slate-500">
                Administrative Grievance Redressal System
              </div>
            </div>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Live Backend Status */}
          <BackendStatusBadge />

          {/* Clean Data / Fresh State Button */}
          <button
            id="staff-header-clean-data-btn"
            onClick={handleCleanData}
            disabled={isCleaning}
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors shadow-xs cursor-pointer disabled:opacity-50"
            title="Clean all data in frontend and backend to start with a completely fresh state"
          >
            <Sparkles size={13} className={isCleaning ? 'animate-spin' : ''} />
            <span className="hidden sm:inline">{isCleaning ? 'Cleaning...' : 'Clean All Data'}</span>
          </button>

          {/* Quick Access to Students Excel Sheet */}
          <button
            id="staff-header-students-excel-btn"
            onClick={() => setActiveTab('students')}
            className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors shadow-xs cursor-pointer ${
              activeTab === 'students'
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200'
            }`}
            title="View and download student accounts Excel spreadsheet (.xlsx)"
          >
            <FileSpreadsheet size={14} className={activeTab === 'students' ? 'text-white' : 'text-emerald-600'} />
            <span className="hidden md:inline">Students Excel</span>
          </button>

          {/* Quick Switch to Student View */}
          <button
            id="staff-header-switch-to-student-btn"
            onClick={onSwitchToStudentPortal}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border border-slate-200 transition-colors shadow-xs"
            title="Open the student portal to test the student complaint tracking experience"
          >
            <GraduationCap size={15} className="text-blue-600" />
            <span className="hidden sm:inline">Student View</span>
            <ExternalLink size={12} className="text-slate-400" />
          </button>

          {/* Staff Info Pill */}
          <div
            onClick={() => setActiveTab('profile')}
            className="flex items-center gap-2.5 pl-2.5 pr-3 py-1 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 cursor-pointer transition-colors"
          >
            <img
              src={staffUser.avatarUrl}
              alt={staffUser.name}
              className="w-7 h-7 rounded-lg object-cover ring-1 ring-slate-200"
            />
            <div className="hidden lg:block text-left text-xs">
              <div className="font-semibold text-slate-900 truncate max-w-[130px]">
                {staffUser.name}
              </div>
              <div className="text-[10px] text-slate-500 truncate max-w-[130px]">
                {staffUser.designation}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 2. BODY WITH SIDEBAR & MAIN CONTENT */}
      <div className="flex-1 flex overflow-hidden">
        {/* SIDEBAR (Desktop & Mobile Drawer) */}
        <aside
          id="staff-portal-sidebar"
          className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-200 ease-in-out md:translate-x-0 ${
            isMobileSidebarOpen ? 'translate-x-0 top-16 shadow-2xl' : '-translate-x-full'
          }`}
        >
          {/* Sidebar Nav Links */}
          <div className="p-4 space-y-1.5 overflow-y-auto">
            <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Navigation
            </div>

            {sidebarNavItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`staff-sidebar-nav-${item.id}`}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={isActive ? 'text-white' : 'text-slate-500'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                        isActive
                          ? 'bg-white/20 text-white border-white/30'
                          : item.badgeColor || 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Sidebar Footer with Active Staff Info & Logout */}
          <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-3">
            <div className="flex items-center gap-2.5 px-1">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] text-slate-600 font-medium">System Connected</span>
              <span className="text-[10px] text-slate-400 font-mono ml-auto">v2.4</span>
            </div>

            <button
              id="staff-sidebar-logout-btn"
              onClick={handleStaffLogout}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer"
            >
              <LogOut size={15} />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Backdrop for mobile drawer */}
        {isMobileSidebarOpen && (
          <div
            onClick={() => setIsMobileSidebarOpen(false)}
            className="fixed inset-0 bg-black/30 backdrop-blur-xs z-30 md:hidden"
          />
        )}

        {/* MAIN ADMINISTRATIVE CONTENT AREA */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-white">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* View Switching */}
            {activeTab === 'analytics' ? (
              <StaffAnalytics complaints={complaints} />
            ) : activeTab === 'students' ? (
              <StaffStudentsExcelView />
            ) : activeTab === 'profile' ? (
              <StaffProfile
                currentStaff={staffUser}
                onProfileUpdated={(up) => setStaffUser(up)}
              />
            ) : activeTab === 'upload' ? (
              <StaffResolutionUpload
                complaints={complaints}
                currentStaff={staffUser}
                initialComplaintId={preselectedUploadComplaintId}
                onComplaintUpdated={(up) => {
                  handleComplaintUpdated(up);
                }}
                onNavigateToTab={(tab) => setActiveTab(tab)}
              />
            ) : (
              <StaffDashboard
                complaints={complaints}
                currentStaff={staffUser}
                activeTab={activeTab}
                onSelectComplaint={(c) => setSelectedComplaint(c)}
                onNavigateTab={(tab) => setActiveTab(tab)}
                onOpenResolutionUpload={(complaintId) => {
                  setPreselectedUploadComplaintId(complaintId);
                  setActiveTab('upload');
                }}
              />
            )}
          </div>
        </main>
      </div>

      {/* COMPLAINT DETAILS MODAL */}
      {selectedComplaint && (
        <StaffComplaintModal
          complaint={selectedComplaint}
          currentStaff={staffUser}
          onClose={() => setSelectedComplaint(null)}
          onComplaintUpdated={handleComplaintUpdated}
          onOpenResolutionUpload={(complaintId) => {
            setPreselectedUploadComplaintId(complaintId);
            setSelectedComplaint(null);
            setActiveTab('upload');
          }}
        />
      )}
    </div>
  );
};
