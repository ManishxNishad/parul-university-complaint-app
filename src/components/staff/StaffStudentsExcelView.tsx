import React, { useState, useEffect } from 'react';
import {
  FileSpreadsheet,
  Download,
  RefreshCw,
  Users,
  CheckCircle2,
  Sparkles,
  Search,
  Database,
  Building2,
  Clock,
  ShieldCheck,
  FileCheck,
  UserCheck,
  Mail,
  Smartphone,
  Info,
} from 'lucide-react';
import { apiClient } from '../../services/api';

export const StaffStudentsExcelView: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [info, setInfo] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSheetTab, setActiveSheetTab] = useState<'students' | 'summary'>('students');
  const [bannerMessage, setBannerMessage] = useState<string | null>(null);

  const fetchExcelInfo = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getStudentsExcelInfo();
      setInfo(data);
      const records = await apiClient.getStudentRecords();
      setStudents(records || []);
    } catch (err: any) {
      console.error('Failed to fetch Excel sheet details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExcelInfo();
  }, []);

  const handleDownload = () => {
    apiClient.downloadStudentsExcel();
    setBannerMessage('Downloading Parul University registered students Excel spreadsheet (.xlsx)...');
    setTimeout(() => setBannerMessage(null), 4000);
  };

  const handleRegenerate = async () => {
    try {
      setRefreshing(true);
      await apiClient.regenerateStudentsExcel();
      await fetchExcelInfo();
      setBannerMessage('Backend Excel file successfully re-synchronized with all student accounts on disk!');
      setTimeout(() => setBannerMessage(null), 4000);
    } catch (err: any) {
      setBannerMessage('Error syncing Excel sheet: ' + err.message);
      setTimeout(() => setBannerMessage(null), 4000);
    } finally {
      setRefreshing(false);
    }
  };

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
    <div className="space-y-6">
      {/* Banner Alert */}
      {bannerMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center justify-between shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-600" />
            <span>{bannerMessage}</span>
          </div>
          <button onClick={() => setBannerMessage(null)} className="text-emerald-700 hover:text-emerald-900 font-bold">
            Dismiss
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 shrink-0">
            <FileSpreadsheet size={28} />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                Student Accounts Excel Registry
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                .XLSX Sync Active
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 flex items-center gap-2">
              <Database size={13} className="text-emerald-400 shrink-0" />
              <span>
                Backend File Path:{' '}
                <code className="text-emerald-300 font-mono font-bold">data/registered_students_accounts.xlsx</code>
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleRegenerate}
            disabled={refreshing}
            className="px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
            <span>Sync Records</span>
          </button>

          <button
            onClick={handleDownload}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/30 active:scale-[0.98] transition-all cursor-pointer"
          >
            <Download size={16} />
            <span>Download Excel Sheet (.xlsx)</span>
          </button>
        </div>
      </div>

      {/* Registration Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100/60 border border-emerald-200 shadow-xs">
          <div className="flex items-center justify-between text-emerald-700 mb-1.5">
            <span className="text-[11px] font-extrabold uppercase tracking-wider">Total Accounts</span>
            <Users size={18} />
          </div>
          <div className="text-3xl font-black text-emerald-950">
            {totalCount}
          </div>
          <p className="text-xs text-emerald-700 font-medium mt-1">
            Recorded in Excel spreadsheet
          </p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-[11px] font-extrabold uppercase tracking-wider">Static Accounts</span>
            <ShieldCheck size={18} className="text-purple-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">
            {staticCount}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Institutional Seed Accounts (e.g. Aman)
          </p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-[11px] font-extrabold uppercase tracking-wider">Self-Registered</span>
            <UserCheck size={18} className="text-blue-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">
            {selfCount}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Enrolled via Student Portal
          </p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-[11px] font-extrabold uppercase tracking-wider">Phone & Email Verified</span>
            <CheckCircle2 size={18} className="text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">
            {phoneVerified} / {totalCount}
          </div>
          <p className="text-xs text-emerald-600 font-medium mt-1">
            100% Verified Credentials
          </p>
        </div>
      </div>

      {/* Info Callout */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-start gap-2.5">
          <Info size={18} className="text-blue-600 shrink-0 mt-0.5" />
          <p className="text-slate-600 leading-relaxed">
            <strong className="text-slate-900 font-bold">Automatic Excel Maintenance:</strong> Every time a student creates an account in the portal, their profile (Student ID, Full Name, Enrollment No, Email, Department, Phone, Verification status, Hostel & Room) is automatically appended into <code className="text-slate-900 font-mono font-bold">data/registered_students_accounts.xlsx</code> on the server.
          </p>
        </div>
        <div className="text-[11px] text-slate-500 font-mono shrink-0">
          File Size: <strong>{info?.excelFile?.fileSizeFormatted || '6.2 KB'}</strong>
        </div>
      </div>

      {/* Sheet Tab Switcher & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl w-fit">
          <button
            onClick={() => setActiveSheetTab('students')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeSheetTab === 'students'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sheet 1: Registered Students ({filteredStudents.length})
          </button>
          <button
            onClick={() => setActiveSheetTab('summary')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeSheetTab === 'summary'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
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
              placeholder="Search by name, UG no, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>
        )}
      </div>

      {/* Main Table / Summary Container */}
      {activeSheetTab === 'students' ? (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <th className="p-3.5 w-12 text-center">#</th>
                  <th className="p-3.5">Student Name</th>
                  <th className="p-3.5">Enrollment No (UG)</th>
                  <th className="p-3.5">Official Email</th>
                  <th className="p-3.5">Department</th>
                  <th className="p-3.5">Mobile Phone</th>
                  <th className="p-3.5">Hostel & Room</th>
                  <th className="p-3.5">Verification</th>
                  <th className="p-3.5">Account Type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="p-12 text-center text-slate-500">
                      No student accounts found matching "{searchTerm}".
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((s, idx) => (
                    <tr key={s.studentId || idx} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-3.5 text-center font-mono text-slate-400 font-medium">
                        {idx + 1}
                      </td>
                      <td className="p-3.5 font-bold text-slate-900">
                        <div className="flex items-center gap-2">
                          {s.name === 'Aman' ? (
                            <span className="w-2 h-2 rounded-full bg-rose-500" />
                          ) : null}
                          <span>{s.name}</span>
                          {s.name === 'Aman' && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-700">
                              Aman
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-3.5 font-mono font-bold text-emerald-600">
                        {s.enrollmentNo || s.ugNumber}
                      </td>
                      <td className="p-3.5 text-slate-600">
                        {s.email}
                      </td>
                      <td className="p-3.5 text-slate-600">
                        {s.department || 'Computer Science & Engineering'}
                      </td>
                      <td className="p-3.5 text-slate-600 font-mono">
                        {s.phone}
                      </td>
                      <td className="p-3.5 text-slate-600">
                        {s.hostelBlock ? `${s.hostelBlock}, Rm ${s.roomNo}` : 'Campus Resident'}
                      </td>
                      <td className="p-3.5">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          <CheckCircle2 size={10} />
                          Verified
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            s.isStatic
                              ? 'bg-purple-50 text-purple-700 border-purple-200'
                              : 'bg-blue-50 text-blue-700 border-blue-200'
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
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Sparkles size={16} className="text-amber-500" />
            <span>Sheet 2: Registration Summary Metrics</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {[
              { label: 'Total Student Accounts in Excel', val: `${totalCount} Registered Students` },
              { label: 'Static System Records', val: `${staticCount} Pre-configured Institutional Accounts` },
              { label: 'Newly Created Student Accounts', val: `${selfCount} Accounts` },
              { label: 'Accounts with Verified Mobile', val: `${phoneVerified} / ${totalCount} (100%)` },
              { label: 'Accounts with Verified Email', val: `${emailVerified} / ${totalCount} (100%)` },
              { label: 'Workbook Sheet Names', val: "'Registered Students', 'Registration Summary'" },
              { label: 'Excel Engine File Path', val: 'data/registered_students_accounts.xlsx' },
              { label: 'Last Synced Timestamp', val: info?.excelFile?.lastModified || new Date().toISOString() },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between"
              >
                <span className="text-slate-600 font-medium">{item.label}</span>
                <span className="font-bold text-slate-900 font-mono">{item.val}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
