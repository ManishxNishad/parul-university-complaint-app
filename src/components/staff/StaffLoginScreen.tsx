import React, { useState } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Lock,
  Mail,
  Eye,
  EyeOff,
  UserCheck,
  ArrowRight,
  Sparkles,
  AlertCircle,
  GraduationCap,
  Building,
  KeyRound,
  CheckCircle2,
} from 'lucide-react';
import { StaffAccount } from '../../types';
import { apiClient, setAdminToken, saveStoredAdminSession } from '../../services/api';
import { saveActiveStaffSession, getStaffAccounts } from '../../data/complaintsStore';

interface StaffLoginScreenProps {
  onLoginSuccess: (staff: StaffAccount) => void;
  onSwitchToStudentPortal: () => void;
}

export const StaffLoginScreen: React.FC<StaffLoginScreenProps> = ({
  onLoginSuccess,
  onSwitchToStudentPortal,
}) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!identifier.trim() || !password.trim()) {
      setErrorMessage('Please enter both your Admin ID/Email and Administrative Password.');
      return;
    }

    setIsLoading(true);

    try {
      // Direct call to Express backend admin authentication endpoint
      const result = await apiClient.adminLogin(identifier.trim(), password);
      
      saveActiveStaffSession(result.admin);
      setSuccessMessage(`Authenticated as ${result.admin.name} (${result.admin.role}). Launching console...`);

      setTimeout(() => {
        onLoginSuccess(result.admin);
      }, 400);
    } catch (err: any) {
      // Offline / network failure fallback
      const trimmedId = identifier.trim().toLowerCase();
      if (err?.message?.includes('Failed to fetch') || err?.message?.includes('NetworkError')) {
        const localStaff = getStaffAccounts();
        const matched = localStaff.find(
          (s) =>
            (s.staffId?.toLowerCase() === trimmedId || s.email?.toLowerCase() === trimmedId) &&
            s.password === password
        );
        if (matched) {
          saveActiveStaffSession(matched);
          setSuccessMessage(`Authenticated as ${matched.name}. Launching console...`);
          setTimeout(() => {
            onLoginSuccess(matched);
          }, 400);
          return;
        }
      }

      setErrorMessage(
        err?.message ||
          'Access Denied: Only authorized University Administrators have backend access. Regular users and students cannot login to this backend.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      id="admin-login-root"
      className="min-h-screen w-full bg-slate-50 text-slate-900 flex flex-col justify-between font-sans antialiased relative overflow-hidden"
    >
      {/* Top Banner Bar with switch button */}
      <div className="w-full bg-white border-b border-slate-200 px-4 sm:px-8 py-3 flex items-center justify-between z-10 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-900 text-amber-300 border border-blue-800 flex items-center justify-center font-bold text-base shadow-xs">
            PU
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-blue-950 flex items-center gap-1.5">
              <span>Parul University</span>
              <span className="text-slate-300">•</span>
              <span className="text-amber-600 text-[10px] font-bold tracking-normal uppercase">
                Admin Console
              </span>
            </div>
            <div className="text-[11px] text-slate-500">Secure Backend Administration Portal</div>
          </div>
        </div>

        <button
          id="switch-to-student-portal-btn"
          onClick={onSwitchToStudentPortal}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border border-slate-200 transition-colors shadow-xs"
        >
          <GraduationCap size={15} className="text-blue-600" />
          <span>Student Portal</span>
        </button>
      </div>

      {/* Decorative background subtle grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-70 pointer-events-none" />

      {/* Main Form Center Box */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 z-10 my-4">
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xl relative">
          {/* Security Badge */}
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-red-50 text-red-700 border border-red-200">
              <ShieldAlert size={13} />
              <span>Admin-Only Backend Access</span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">RBAC: ADMIN</span>
          </div>

          {/* Heading */}
          <div className="mb-6">
            <h1
              id="admin-portal-title"
              className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2"
            >
              Backend Administration
            </h1>
            <p
              id="admin-portal-subtitle"
              className="text-xs sm:text-sm text-slate-600 mt-1 font-medium leading-relaxed"
            >
              Protected REST backend access. Regular users and students cannot login to this backend.
            </p>
          </div>

          {/* Error notice */}
          {errorMessage && (
            <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5">
              <AlertCircle size={16} className="shrink-0 text-rose-600 mt-0.5" />
              <div className="flex-1">
                <span className="font-semibold block">Access Restricted</span>
                <span>{errorMessage}</span>
              </div>
            </div>
          )}

          {/* Success notice */}
          {successMessage && (
            <div className="mb-5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
              <CheckCircle2 size={16} className="shrink-0 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Field: Admin ID / Official Email */}
            <div>
              <label
                htmlFor="admin-identifier-input"
                className="block text-xs font-semibold text-slate-700 mb-1.5"
              >
                Admin ID / Official Email <span className="text-rose-600">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail size={16} />
                </div>
                <input
                  id="admin-identifier-input"
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Enter Admin ID or official email"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  required
                />
              </div>
            </div>

            {/* Field: Password */}
            <div>
              <label
                htmlFor="admin-password-input"
                className="block text-xs font-semibold text-slate-700 mb-1.5"
              >
                Admin Secret Password <span className="text-rose-600">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock size={16} />
                </div>
                <input
                  id="admin-password-input"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your administrative password"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  required
                />
                <button
                  type="button"
                  id="toggle-admin-password-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember Me & Security Policy */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none text-slate-700">
                <input
                  id="admin-remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 bg-white text-blue-600 focus:ring-blue-500/30 accent-blue-600"
                />
                <span>Keep Session Active</span>
              </label>

              <span className="text-[11px] text-slate-500 font-mono">
                Token Auth: Bearer
              </span>
            </div>

            {/* Admin Login Button */}
            <button
              id="admin-submit-login-btn"
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.99] cursor-pointer mt-2"
            >
              {isLoading ? (
                <span>Verifying Admin Rights with Server...</span>
              ) : (
                <>
                  <KeyRound size={16} className="text-amber-400" />
                  <span>Authenticate & Enter Admin Console</span>
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <div className="w-full text-center py-4 text-[11px] text-slate-500 border-t border-slate-200 bg-white z-10">
        Parul University Backend Infrastructure • Strictly Restricted to University Administrators
      </div>
    </div>
  );
};

