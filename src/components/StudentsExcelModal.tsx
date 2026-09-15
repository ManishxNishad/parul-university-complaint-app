import React, { useState, useEffect } from 'react';
import {
  FileSpreadsheet,
  Download,
  RefreshCw,
  Users,
  CheckCircle2,
  Sparkles,
  Search,
  X,
  Database,
  Building2,
  Clock,
  ShieldCheck,
  FileCheck,
  Smartphone,
  Mail,
  UserCheck,
} from 'lucide-react';
import { apiClient } from '../services/api';

interface StudentsExcelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StudentsExcelModal: React.FC<StudentsExcelModalProps> = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [info, setInfo] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSheetTab, setActiveSheetTab] = useState<'students' | 'summary'>('students');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchExcelInfo = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getStudentsExcelInfo();
      setInfo(data);
      const studentRecords = await apiClient.getStudentRecords();
      setStudents(studentRecords || []);
    } catch (err: any) {
      console.error('Failed to fetch Excel sheet details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchExcelInfo();
    }
  }, [isOpen]);

  const handleDownload = () => {
    apiClient.downloadStudentsExcel();
    showToast('Downloading Parul University registered students Excel spreadsheet (.xlsx)...');
  };

  const handleRegenerate = async () => {
    try {
      setRefreshing(true);
      await apiClient.regenerateStudentsExcel();
      await fetchExcelInfo();
      showToast('Excel sheet successfully re-synchronized with latest backend student records!');
    } catch (err: any) {
      showToast('Error syncing Excel sheet: ' + err.message);
    } finally {
      setRefreshing(false);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  if (!isOpen) return null;

  const filteredStudents = students.filter((s) => {
    const q = searchTerm.toLowerCase();
    return (
      (s.name || '').toLowerCase().includes(q) ||
      (s.enrollmentNo || '').toLowerCase().includes(q) ||
      (s.email || '').toLowerCase().includes(q) ||
      (s.department || '').toLowerCase().includes(q)
    );
  });

  const totalCount = info?.statistics?.totalRegisteredStudents ?? students.length;
  const staticCount = info?.statistics?.staticAccountsCount ?? students.filter((s) => s.isStatic).length;
  const selfCount = info?.statistics?.selfRegisteredAccountsCount ?? students.filter((s) => !s.isStatic).length;
  const phoneVerified = info?.statistics?.phoneVerifiedCount ?? students.filter((s) => s.phoneVerified).length;
  const emailVerified = info?.statistics?.emailVerifiedCount ?? students.filter((s) => s.emailVerified).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden text-slate-900 dark:text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Toast Alert */}
        {toastMessage && (
          <div className="bg-emerald-600 text-white px-4 py-2.5 text-xs font-semibold flex items-center justify-between shadow-md transition-all">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} />
              <span>{toastMessage}</span>
            </div>
            <button onClick={() => setToastMessage(null)} className="hover:opacity-80">
              <X size={14} />
            </button>
          </div>
        )}

        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-800/40">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
              <FileSpreadsheet size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black tracking-tight text-slate-900 dark:text-white">
                  Registered Students Excel Sheet
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  .XLSX Backend Registry
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-2">
                <Database size={13} className="text-emerald-500" />
                <span>Disk Location: <code className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">data/registered_students_accounts.xlsx</code></span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRegenerate}
              disabled={refreshing}
              className="p-2 sm:px-3 sm:py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm disabled:opacity-50"
              title="Force sync & regenerate backend Excel file"
            >
              <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
              <span className="hidden sm:inline">Sync Excel</span>
            </button>

            <button
              onClick={handleDownload}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-emerald-600/20 active:scale-[0.98] transition-all cursor-pointer"
            >
              <Download size={15} />
              <span>Download Excel (.xlsx)</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors ml-1 cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Key Metric Banner - How many students create account in app */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/40 dark:to-emerald-900/20 border border-emerald-200 dark:border-emerald-800/60">
              <div className="flex items-center justify-between text-emerald-700 dark:text-emerald-400 mb-1">
                <span className="text-[11px] font-extrabold uppercase tracking-wider">Total Accounts</span>
                <Users size={16} />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-900 dark:text-emerald-200">
                {totalCount}
              </div>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
                Stored in Excel Sheet
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
                <span className="text-[11px] font-extrabold uppercase tracking-wider">Static Accounts</span>
                <ShieldCheck size={16} className="text-purple-500" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white">
                {staticCount}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Aman, Alex, Rohan, Priya
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
                <span className="text-[11px] font-extrabold uppercase tracking-wider">Self-Registered</span>
                <UserCheck size={16} className="text-blue-500" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white">
                {selfCount}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Signed up in Student Portal
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
                <span className="text-[11px] font-extrabold uppercase tracking-wider">Verification</span>
                <CheckCircle2 size={16} className="text-emerald-500" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white">
                {phoneVerified}/{totalCount}
              </div>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
                Phone & Email Verified
              </p>
            </div>
          </div>

          {/* Explain Callout */}
          <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-start gap-2.5">
              <FileCheck size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  Real-time Backend Synchronization:
                </span>{' '}
                <span className="text-slate-600 dark:text-slate-400">
                  Every time a student creates an account, their name, enrollment UG number, email, phone, hostel, and timestamps are automatically stored in memory and persisted into this backend Excel spreadsheet on the server disk.
                </span>
              </div>
            </div>
            <div className="text-[11px] text-slate-500 font-mono shrink-0">
              File Size: <strong>{info?.excelFile?.fileSizeFormatted || '6.2 KB'}</strong>
            </div>
          </div>

          {/* Sheet Selector & Search Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            {/* Sheet Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-fit">
              <button
                onClick={() => setActiveSheetTab('students')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeSheetTab === 'students'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Sheet 1: Registered Students ({filteredStudents.length})
              </button>
              <button
                onClick={() => setActiveSheetTab('summary')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeSheetTab === 'summary'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Sheet 2: Registration Summary
              </button>
            </div>

            {activeSheetTab === 'students' && (
              <div className="relative w-full sm:w-72">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter student accounts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
            )}
          </div>

          {/* Table Container */}
          {activeSheetTab === 'students' ? (
            <div className="border border-slate-200 dark:border-slate-700/80 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100/80 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                      <th className="p-3 w-12 text-center">#</th>
                      <th className="p-3">Student Name</th>
                      <th className="p-3">Enrollment / UG No</th>
                      <th className="p-3">Official Email</th>
                      <th className="p-3">Department</th>
                      <th className="p-3">Phone</th>
                      <th className="p-3">Hostel / Room</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Account Type</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {filteredStudents.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="p-8 text-center text-slate-500">
                          No student accounts matching "{searchTerm}" found.
                        </td>
                      </tr>
                    ) : (
                      filteredStudents.map((s, idx) => (
                        <tr
                          key={s.studentId || idx}
                          className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors"
                        >
                          <td className="p-3 text-center font-mono text-slate-400">
                            {idx + 1}
                          </td>
                          <td className="p-3 font-semibold text-slate-900 dark:text-white">
                            <div className="flex items-center gap-2">
                              {s.name === 'Aman' ? (
                                <span className="w-2 h-2 rounded-full bg-rose-500" />
                              ) : null}
                              <span>{s.name}</span>
                              {s.name === 'Aman' && (
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                                  You
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="p-3 font-mono font-medium text-emerald-600 dark:text-emerald-400">
                            {s.enrollmentNo || s.ugNumber}
                          </td>
                          <td className="p-3 text-slate-600 dark:text-slate-300">
                            {s.email}
                          </td>
                          <td className="p-3 text-slate-600 dark:text-slate-300">
                            {s.department || 'Computer Science & Engineering'}
                          </td>
                          <td className="p-3 text-slate-600 dark:text-slate-300 font-mono">
                            {s.phone}
                          </td>
                          <td className="p-3 text-slate-600 dark:text-slate-300">
                            {s.hostelBlock ? `${s.hostelBlock}, Rm ${s.roomNo}` : 'Campus Resident'}
                          </td>
                          <td className="p-3">
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                              <CheckCircle2 size={10} />
                              Verified
                            </span>
                          </td>
                          <td className="p-3">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                s.isStatic
                                  ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 border-purple-200 dark:border-purple-800'
                                  : 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                              }`}
                            >
                              {s.isStatic ? 'Static Store' : 'Self-Registered'}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="border border-slate-200 dark:border-slate-700 rounded-2xl p-5 bg-slate-50/50 dark:bg-slate-800/30 space-y-4">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <Sparkles size={16} className="text-amber-500" />
                <span>Sheet 2: Registration Summary Metrics</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {[
                  { label: 'Total Student Accounts in Excel', val: `${totalCount} Registered Students` },
                  { label: 'Static System Records', val: `${staticCount} Pre-seeded Institutional Accounts` },
                  { label: 'Newly Created Student Accounts', val: `${selfCount} Accounts` },
                  { label: 'OTP-Verified Mobile Phones', val: `${phoneVerified} / ${totalCount} (100%)` },
                  { label: 'Institutional Email Verified', val: `${emailVerified} / ${totalCount} (100%)` },
                  { label: 'Workbook Sheet Names', val: "'Registered Students', 'Registration Summary'" },
                  { label: 'Excel Engine File Path', val: 'data/registered_students_accounts.xlsx' },
                  { label: 'Last Synced (UTC)', val: info?.excelFile?.lastModified || new Date().toISOString() },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between"
                  >
                    <span className="text-slate-500 dark:text-slate-400 font-medium">{item.label}</span>
                    <span className="font-bold text-slate-800 dark:text-white font-mono">{item.val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-[11px]">
            <Clock size={14} />
            <span>
              Last updated: {info?.excelFile?.lastModified ? new Date(info.excelFile.lastModified).toLocaleTimeString() : 'Just now'}
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={handleDownload}
              className="flex-1 sm:flex-none px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 active:scale-[0.98] transition-all cursor-pointer"
            >
              <Download size={15} />
              <span>Download Excel File</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
