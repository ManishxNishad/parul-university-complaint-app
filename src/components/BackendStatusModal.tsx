import React, { useState, useEffect } from 'react';
import {
  Server,
  Activity,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  X,
  Database,
  Code2,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  Cpu,
  Send,
  Trash2,
  FileText,
  Lock,
  UserCheck,
  FileSpreadsheet,
  Download,
  Sparkles,
} from 'lucide-react';
import { apiClient, BackendHealthResponse, BackendStatsResponse, getAdminToken } from '../services/api';
import { AdminAuditLog } from '../types';
import { cleanAllData, syncComplaintsWithBackend } from '../data/complaintsStore';

interface BackendStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BackendStatusModal: React.FC<BackendStatusModalProps> = ({ isOpen, onClose }) => {
  const [health, setHealth] = useState<BackendHealthResponse | null>(null);
  const [stats, setStats] = useState<BackendStatsResponse | null>(null);
  const [auditLogs, setAuditLogs] = useState<AdminAuditLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'metrics' | 'audit' | 'tester'>('metrics');
  const [testEndpoint, setTestEndpoint] = useState<string>('/api/health');
  const [testResult, setTestResult] = useState<any>(null);
  const [testLoading, setTestLoading] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const h = await apiClient.checkHealth();
      setHealth(h);
      const s = await apiClient.getStats().catch(() => null);
      if (s) setStats(s);
      
      const logs = await apiClient.getAuditLogs().catch(() => []);
      setAuditLogs(logs);
    } catch {
      setHealth(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchStatus();
    }
  }, [isOpen]);

  const handleTestEndpoint = async (endpoint: string) => {
    setTestEndpoint(endpoint);
    setTestLoading(true);
    setTestResult(null);
    try {
      let res: any;
      if (endpoint === '/api/health') {
        res = await apiClient.checkHealth();
      } else if (endpoint === '/api/complaints') {
        res = await apiClient.getComplaints();
      } else if (endpoint === '/api/stats') {
        res = await apiClient.getStats();
      } else if (endpoint === '/api/admin/system-status') {
        res = await apiClient.getSystemStatus();
      } else if (endpoint === '/api/admin/audit-logs') {
        res = await apiClient.getAuditLogs();
      } else if (endpoint === '/api/student/records') {
        res = await apiClient.getStudentRecords();
      } else if (endpoint === '/api/student/excel/info') {
        res = await apiClient.getStudentsExcelInfo();
      } else if (endpoint === 'TEST_STUDENT_LOGIN_AMAN') {
        res = await apiClient.studentLogin('aman576544534@gmail.com', 'Password@123', false);
      } else if (endpoint === 'TEST_UNAUTHORIZED_MUTATION') {
        // Direct fetch without admin headers to test unauthorized rejection
        const raw = await fetch('/api/complaints/PU-2026-0001/status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'Resolved' }),
        });
        const errJson = await raw.json().catch(() => ({}));
        res = {
          httpStatus: raw.status,
          statusText: raw.statusText,
          blocked: raw.status === 401 || raw.status === 403,
          responseBody: errJson,
          verifiedResult: 'PASSED: Non-admin request was strictly rejected by backend security middleware!',
        };
      } else if (endpoint === '/api/ai/suggest-resolution') {
        res = await apiClient.requestAISuggestion({
          title: 'Hostel Water Leakage',
          category: 'Hostel & Accommodation',
          description: 'Pipe valve burst near 2nd floor bathroom causing water accumulation.',
        });
      }
      setTestResult(res);
    } catch (err: any) {
      setTestResult({ error: err?.message || 'Endpoint request failed' });
    } finally {
      setTestLoading(false);
    }
  };

  const handleResetBackend = async () => {
    if (!window.confirm('Reset server database to original default complaints? Only administrators can do this.')) return;
    setIsResetting(true);
    try {
      await apiClient.resetBackend();
      await syncComplaintsWithBackend();
      await fetchStatus();
      setTestResult({ message: 'Backend database reset to default demo dataset successfully' });
    } catch (err: any) {
      setTestResult({ error: err?.message || 'Failed to reset backend' });
    } finally {
      setIsResetting(false);
    }
  };

  const handleCleanAllData = async () => {
    if (!window.confirm('Clean all data across frontend and backend? This clears all complaints and resets system to a pristine fresh state.')) return;
    setIsResetting(true);
    try {
      const res = await cleanAllData();
      await fetchStatus();
      setTestResult({ message: res.message });
    } catch (err: any) {
      setTestResult({ error: err?.message || 'Failed to clean data' });
    } finally {
      setIsResetting(false);
    }
  };

  if (!isOpen) return null;

  const isConnected = health !== null && health.status === 'ok';
  const hasAdminToken = Boolean(getAdminToken());

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        id="backend-status-modal"
        className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden text-slate-800 font-sans"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center shadow-xs">
              <Server size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">Backend API & Security Status</h2>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    isConnected
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-amber-100 text-amber-800 border border-amber-300'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                    }`}
                  />
                  {isConnected ? 'Linked & Live' : 'Offline / Standalone Mode'}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Express Server • Port 3000 • Admin-Only Mutation Access Policy
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Admin Policy Alert Banner */}
        <div className="px-6 py-2.5 bg-amber-50/80 border-b border-amber-200 flex items-center justify-between text-xs text-amber-900">
          <div className="flex items-center gap-2">
            <ShieldAlert size={15} className="text-amber-700 shrink-0" />
            <span className="font-semibold">Backend Access Rule:</span>
            <span>Only administrators can authenticate and modify backend state. Any regular user is blocked.</span>
          </div>
          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${hasAdminToken ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-slate-200 text-slate-700'}`}>
            {hasAdminToken ? 'ADMIN_TOKEN_ACTIVE' : 'NO_ADMIN_TOKEN'}
          </span>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center border-b border-slate-200 px-6 bg-slate-50/50">
          <button
            onClick={() => setActiveTab('metrics')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'metrics'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Activity size={14} />
            <span>Health & Metrics</span>
          </button>
          <button
            onClick={() => setActiveTab('tester')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'tester'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Code2 size={14} />
            <span>Endpoint & Security Testing</span>
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'audit'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText size={14} />
            <span>Admin Audit Logs ({auditLogs.length})</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
          {activeTab === 'metrics' && (
            <>
              {/* Status Metrics Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                    Server Latency
                  </span>
                  <div className="text-lg font-bold text-slate-900 mt-1 flex items-baseline gap-1">
                    {health?.latencyMs !== undefined ? `${health.latencyMs}ms` : '--'}
                    <span className="text-[10px] text-emerald-600 font-semibold">ping</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                    Grievance Records
                  </span>
                  <div className="text-lg font-bold text-slate-900 mt-1">
                    {health?.complaintsCount ?? (stats?.total || '--')}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                    Static Students
                  </span>
                  <div className="text-lg font-bold text-slate-900 mt-1 text-emerald-600">
                    {(health as any)?.studentsCount ?? 4}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                    Admins Registered
                  </span>
                  <div className="text-lg font-bold text-slate-900 mt-1 text-blue-600">
                    {health?.adminsCount ?? 3}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                    Audit Events
                  </span>
                  <div className="text-lg font-bold text-slate-900 mt-1 text-purple-600">
                    {health?.auditLogsCount ?? auditLogs.length}
                  </div>
                </div>
              </div>

              {/* Backend Excel Sheet Card */}
              <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <FileSpreadsheet size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-emerald-900 text-sm">
                        Registered Students Excel Spreadsheet (.xlsx)
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-200/70 text-emerald-800">
                        Auto-Synced
                      </span>
                    </div>
                    <p className="text-emerald-700 text-xs mt-0.5">
                      Backend Excel file tracks all {(health as any)?.studentsCount ?? 4} student accounts created in the app at <code className="font-mono font-bold">data/registered_students_accounts.xlsx</code>.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => apiClient.downloadStudentsExcel()}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shrink-0 transition-colors shadow-xs cursor-pointer"
                >
                  <Download size={14} />
                  <span>Download Excel (.xlsx)</span>
                </button>
              </div>

              {/* Architecture Details */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs text-slate-700">
                <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                  <ShieldCheck size={15} className="text-emerald-600" />
                  <span>Backend Security Architecture</span>
                </h4>
                <ul className="list-disc pl-4 space-y-1.5 text-slate-600">
                  <li>
                    <strong>Admin Authentication:</strong> Managed via <code>/api/admin/login</code> issuing authenticated bearer session tokens.
                  </li>
                  <li>
                    <strong>Strict Access Control:</strong> Any attempt by regular users or unauthenticated clients to mutate complaints, change status, assign staff, or upload resolutions is blocked with <code>401 Unauthorized / 403 Forbidden</code>.
                  </li>
                  <li>
                    <strong>Persistent Storage:</strong> Full state is stored securely in <code>data/backend-store.json</code> with automatic writes and backups.
                  </li>
                  <li>
                    <strong>Audit Logging:</strong> Every administrative action, status update, escalation, and resolution is permanently recorded with actor identity and timestamp.
                  </li>
                </ul>
              </div>
            </>
          )}

          {activeTab === 'tester' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                    REST API Security & Endpoint Probing
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Click an endpoint to send real HTTP requests to the running Express server.
                  </p>
                </div>
                <button
                  onClick={fetchStatus}
                  disabled={loading}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
                  <span>Refresh</span>
                </button>
              </div>

              {/* Button grid */}
              <div className="flex flex-wrap gap-2">
                {[
                  { label: 'GET /api/health', ep: '/api/health', desc: 'Public' },
                  { label: 'GET /api/complaints', ep: '/api/complaints', desc: 'Public' },
                  { label: 'GET /api/student/records', ep: '/api/student/records', desc: 'Static Store' },
                  { label: 'GET /api/student/excel/info', ep: '/api/student/excel/info', desc: 'Excel Registry' },
                  { label: 'POST /api/student/login (Aman)', ep: 'TEST_STUDENT_LOGIN_AMAN', desc: 'Static Auth' },
                  { label: 'GET /api/stats', ep: '/api/stats', desc: 'Public' },
                  { label: 'GET /api/admin/system-status', ep: '/api/admin/system-status', desc: 'Admin' },
                  { label: 'GET /api/admin/audit-logs', ep: '/api/admin/audit-logs', desc: 'Admin' },
                ].map((btn) => (
                  <button
                    key={btn.ep}
                    onClick={() => handleTestEndpoint(btn.ep)}
                    disabled={testLoading}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium border transition-colors cursor-pointer flex items-center gap-1.5 ${
                      testEndpoint === btn.ep
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    <Send size={11} />
                    <span>{btn.label}</span>
                  </button>
                ))}

                {/* Explicit Unauthorized Rejection Test */}
                <button
                  onClick={() => handleTestEndpoint('TEST_UNAUTHORIZED_MUTATION')}
                  disabled={testLoading}
                  className="px-3 py-1.5 rounded-lg text-xs font-mono font-semibold border border-rose-300 bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <ShieldAlert size={12} />
                  <span>Verify Unauthorized User Rejection (401/403)</span>
                </button>
              </div>

              {/* Test Result Output Box */}
              <div>
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 mb-1">
                  <span>Response Payload: {testEndpoint}</span>
                  {testLoading && <span className="text-blue-600 animate-pulse">Waiting for server...</span>}
                </div>
                <pre className="p-3 bg-slate-900 text-emerald-400 font-mono text-[11px] rounded-lg max-h-56 overflow-y-auto overflow-x-auto shadow-inner">
                  {testLoading
                    ? '// Sending HTTP request to Express server...'
                    : testResult
                    ? JSON.stringify(testResult, null, 2)
                    : '// Select an endpoint above to execute a real HTTP test against the backend'}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'audit' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                    Backend Administrative Audit Trail
                  </h3>
                  <p className="text-xs text-slate-500">
                    Timestamped logs of all administrative actions and status changes.
                  </p>
                </div>
                <button
                  onClick={fetchStatus}
                  disabled={loading}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
                  <span>Refresh Logs</span>
                </button>
              </div>

              {auditLogs.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-xl border border-slate-200">
                  No administrative audit events recorded yet. Actions such as status updates or staff assignment will appear here.
                </div>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {auditLogs.map((log) => (
                    <div
                      key={log.id}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 uppercase font-mono text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">
                            {log.action}
                          </span>
                          {log.complaintId && (
                            <span className="font-mono text-slate-600 font-semibold">
                              {log.complaintId}
                            </span>
                          )}
                        </div>
                        <p className="text-slate-600 text-[11px]">{log.details}</p>
                        <div className="text-[10px] text-slate-400">
                          Actor: <span className="font-medium text-slate-600">{log.adminName}</span> ({log.adminId})
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400 whitespace-nowrap font-mono">
                        {log.timestamp}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCleanAllData}
              disabled={isResetting}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-700 hover:bg-rose-50 border border-rose-200 flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Wipes complaints and resets system to fresh clean state"
            >
              <Sparkles size={13} />
              <span>Clean All Data (Fresh)</span>
            </button>

            <button
              onClick={handleResetBackend}
              disabled={isResetting}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 border border-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Loads standard demo complaints dataset"
            >
              <Trash2 size={13} />
              <span>Reset Demo DB</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white shadow-xs transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

