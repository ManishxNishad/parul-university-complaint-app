import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Lock,
  Phone,
  Mail,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  ArrowRight,
  RefreshCw,
  Eye,
  EyeOff,
  KeyRound,
  Check,
  Copy,
  Smartphone,
  GraduationCap,
  Sparkles,
  ArrowLeft,
  User,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useTheme } from '../theme';
import {
  getRegisteredAccounts,
  updateStudentPassword,
  saveRegisteredAccount,
  RegisteredStudent,
  DEFAULT_STUDENT,
} from './LoginScreen';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialIdentifier?: string;
  onResetSuccess: (student: RegisteredStudent, newPassword: string, autoLogin: boolean) => void;
}

type Step = 'find_account' | 'select_channel' | 'enter_otp' | 'new_password' | 'success';
type Channel = 'mobile' | 'email';

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
  initialIdentifier = '',
  onResetSuccess,
}) => {
  const { theme } = useTheme();

  // Step state
  const [step, setStep] = useState<Step>('find_account');
  const [identifierInput, setIdentifierInput] = useState('');
  const [identifierError, setIdentifierError] = useState('');
  const [isSearchingAccount, setIsSearchingAccount] = useState(false);

  // Selected Student & Channel
  const [selectedStudent, setSelectedStudent] = useState<RegisteredStudent | null>(null);
  const [selectedChannel, setSelectedChannel] = useState<Channel>('mobile');

  // OTP State
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const [isSubmittingOtp, setIsSubmittingOtp] = useState(false);

  // Simulated Push Notification Banner (SMS / WhatsApp / Gmail)
  const [notificationBanner, setNotificationBanner] = useState<{
    show: boolean;
    app: 'mobile' | 'email';
    title: string;
    message: string;
    code: string;
  } | null>(null);

  // New Password State
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // List of all registered accounts in the system
  const registeredAccounts = useMemo(() => {
    return getRegisteredAccounts();
  }, [isOpen]);

  // Reset state on open/close
  useEffect(() => {
    if (isOpen) {
      const trimmedInitial = initialIdentifier.trim();
      setIdentifierInput(trimmedInitial);
      setIdentifierError('');
      setOtpError('');
      setPasswordError('');
      setNewPassword('');
      setConfirmPassword('');
      setShowNewPassword(false);
      setShowConfirmPassword(false);
      setNotificationBanner(null);
      setResendTimer(0);
      setEnteredOtp('');

      // If initial identifier exists, try to auto-find account
      if (trimmedInitial) {
        const accounts = getRegisteredAccounts();
        const found = accounts.find(
          (a) =>
            a.enrollmentNo.toLowerCase() === trimmedInitial.toLowerCase() ||
            a.email.toLowerCase() === trimmedInitial.toLowerCase() ||
            a.phone.replace(/\D/g, '') === trimmedInitial.replace(/\D/g, '')
        );
        if (found) {
          setSelectedStudent(found);
          setStep('select_channel');
          return;
        }
      }

      setSelectedStudent(null);
      setStep('find_account');
    }
  }, [isOpen, initialIdentifier]);

  // Resend Countdown Timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendTimer > 0) {
      timer = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [resendTimer]);

  // Auto-hide Notification banner after 12 seconds
  useEffect(() => {
    if (notificationBanner?.show) {
      const timer = setTimeout(() => {
        setNotificationBanner(null);
      }, 14000);
      return () => clearTimeout(timer);
    }
  }, [notificationBanner]);

  // Password strength calculation
  const passwordStrength = useMemo(() => {
    if (!newPassword) return 0;
    let score = 0;
    if (newPassword.length >= 4) score += 1;
    if (newPassword.length >= 8) score += 1;
    if (/[0-9]/.test(newPassword)) score += 1;
    if (/[A-Z]/.test(newPassword) || /[^A-Za-z0-9]/.test(newPassword)) score += 1;
    return score;
  }, [newPassword]);

  if (!isOpen) return null;

  // Mask phone number for display (+91 ••••• •4321)
  const formatMaskedPhone = (phoneStr: string) => {
    if (!phoneStr) return 'Registered Mobile';
    const cleaned = phoneStr.trim();
    if (cleaned.length <= 4) return cleaned;
    const last4 = cleaned.slice(-4);
    return `+91 ••••• •${last4}`;
  };

  // Mask email for display (al•••••@gmail.com)
  const formatMaskedEmail = (emailStr: string) => {
    if (!emailStr) return 'Registered Gmail ID';
    const [usr, domain] = emailStr.split('@');
    if (!domain) return emailStr;
    const visibleChars = Math.min(2, usr.length);
    const maskedUsr = usr.slice(0, visibleChars) + '•••••';
    return `${maskedUsr}@${domain}`;
  };

  // Step 1: Find Account Handler
  const handleFindAccount = (targetIdentifier?: string) => {
    const rawId = (targetIdentifier || identifierInput).trim();
    setIdentifierError('');

    if (!rawId) {
      setIdentifierError('Please enter your UG Enrollment Number, Mobile Number, or Gmail ID.');
      return;
    }

    setIsSearchingAccount(true);

    setTimeout(() => {
      setIsSearchingAccount(false);
      const accounts = getRegisteredAccounts();

      // Search registered accounts by UG number, email, or phone
      let match = accounts.find(
        (a) =>
          a.enrollmentNo.toLowerCase() === rawId.toLowerCase() ||
          a.email.toLowerCase() === rawId.toLowerCase() ||
          a.phone.replace(/\D/g, '') === rawId.replace(/\D/g, '')
      );

      // If not found in custom registered accounts, check if it's the default demo student
      if (!match) {
        if (
          rawId.toUpperCase() === '26UG123456' ||
          rawId.toLowerCase() === 'alex.patel@gmail.com' ||
          rawId.replace(/\D/g, '') === '9876543210'
        ) {
          match = DEFAULT_STUDENT;
          saveRegisteredAccount(DEFAULT_STUDENT);
        } else if (rawId.includes('@')) {
          // If valid email was typed, allow instant recovery by provisioning an active student account
          match = {
            name: rawId.split('@')[0].replace(/[._-]/g, ' ').toUpperCase(),
            enrollmentNo: `26UG${Math.floor(100000 + Math.random() * 900000)}`,
            email: rawId.toLowerCase(),
            department: 'Computer Science & Engineering (PIET)',
            phone: '+91 98765 43210',
            password: 'Password@123',
            phoneVerified: true,
            phoneMethod: 'whatsapp',
            emailVerified: true,
            createdAt: new Date().toISOString(),
          };
          saveRegisteredAccount(match);
        } else if (/^[0-9A-Za-z]{6,15}$/.test(rawId)) {
          // If valid UG number was typed, provision student account
          match = {
            name: 'Parul University Student',
            enrollmentNo: rawId.toUpperCase(),
            email: `${rawId.toLowerCase()}@paruluniversity.ac.in`,
            department: 'Computer Science & Engineering (PIET)',
            phone: '+91 98765 43210',
            password: 'Password@123',
            phoneVerified: true,
            phoneMethod: 'whatsapp',
            emailVerified: true,
            createdAt: new Date().toISOString(),
          };
          saveRegisteredAccount(match);
        }
      }

      if (!match) {
        setIdentifierError(
          'No student account found with this identifier. Please verify your enrollment number or registered email.'
        );
        return;
      }

      setSelectedStudent(match);
      setStep('select_channel');
    }, 400);
  };

  // Step 2: Send OTP Handler (on Mobile Number or Gmail ID)
  const handleSendOtp = (channelToUse?: Channel) => {
    if (!selectedStudent) return;

    const channel = channelToUse || selectedChannel;
    setSelectedChannel(channel);

    // Generate fresh 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setEnteredOtp('');
    setOtpError('');
    setResendTimer(45);
    setStep('enter_otp');

    if (channel === 'mobile') {
      setNotificationBanner({
        show: true,
        app: 'mobile',
        title: 'SMS / WhatsApp • Parul University Security',
        message: `Your password reset verification OTP is ${code}. Valid for 10 minutes. Do not disclose this code.`,
        code,
      });
    } else {
      setNotificationBanner({
        show: true,
        app: 'email',
        title: 'Gmail • Parul University <accounts@paruluniversity.ac.in>',
        message: `Official Security Alert: One-time verification OTP to reset your student grievance portal password is ${code}.`,
        code,
      });
    }
  };

  // Auto-fill OTP from simulator notification
  const handleAutofillOtp = (code: string) => {
    setEnteredOtp(code);
    setOtpError('');
  };

  // Step 3: Verify OTP Handler
  const handleVerifyOtp = () => {
    if (!enteredOtp.trim()) {
      setOtpError('Please enter the 6-digit OTP code.');
      return;
    }
    if (enteredOtp.trim() !== generatedOtp) {
      setOtpError('Invalid OTP code. Please enter the code received in your alert or click Resend.');
      return;
    }

    setIsSubmittingOtp(true);
    setTimeout(() => {
      setIsSubmittingOtp(false);
      setOtpError('');
      setStep('new_password');
    }, 400);
  };

  // Step 4: Update Password Handler
  const handleSaveNewPassword = () => {
    if (!selectedStudent) return;

    if (!newPassword) {
      setPasswordError('Please enter a new password.');
      return;
    }
    if (newPassword.length < 4) {
      setPasswordError('Password must be at least 4 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match. Please verify both fields.');
      return;
    }

    setIsUpdatingPassword(true);
    setPasswordError('');

    setTimeout(() => {
      // Update in local storage
      const success = updateStudentPassword(
        {
          enrollmentNo: selectedStudent.enrollmentNo,
          email: selectedStudent.email,
          phone: selectedStudent.phone,
        },
        newPassword
      );

      setIsUpdatingPassword(false);

      if (success) {
        setStep('success');
        try {
          confetti({
            particleCount: 90,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch {
          // ignore if canvas is unavailable
        }
      } else {
        setPasswordError('Failed to update password. Please try again.');
      }
    }, 500);
  };

  return (
    <div
      id="forgot-password-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        className={`relative w-full max-w-lg rounded-3xl border shadow-2xl overflow-hidden flex flex-col max-h-[92vh] transition-colors ${
          theme.isDark
            ? 'bg-slate-900 border-slate-700/80 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Top Simulated Notification Toast for Testing OTP */}
        {notificationBanner?.show && (
          <div className="absolute top-3 left-3 right-3 z-50 animate-in slide-in-from-top-4 duration-300">
            <div
              className={`p-3.5 rounded-2xl shadow-xl border flex items-start gap-3 ${
                notificationBanner.app === 'mobile'
                  ? 'bg-emerald-950/95 border-emerald-500/40 text-emerald-100'
                  : 'bg-indigo-950/95 border-indigo-500/40 text-indigo-100'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  notificationBanner.app === 'mobile'
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-indigo-500/20 text-indigo-400'
                }`}
              >
                {notificationBanner.app === 'mobile' ? (
                  <Smartphone size={20} />
                ) : (
                  <Mail size={20} />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[11px] font-bold truncate">
                    {notificationBanner.title}
                  </span>
                  <span className="text-[9px] opacity-75 font-mono">Just now</span>
                </div>
                <p className="text-xs mt-0.5 leading-snug line-clamp-2">
                  {notificationBanner.message}
                </p>

                <div className="flex items-center gap-2 mt-2">
                  <span className="px-2 py-0.5 rounded-md bg-white/10 font-mono font-bold text-xs tracking-wider">
                    {notificationBanner.code}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleAutofillOtp(notificationBanner.code)}
                    className="px-2.5 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-[11px] font-bold text-white transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Check size={12} /> Auto-fill OTP
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard?.writeText(notificationBanner.code);
                    }}
                    className="p-1 text-white/70 hover:text-white transition-colors"
                    title="Copy Code"
                  >
                    <Copy size={13} />
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setNotificationBanner(null)}
                className="text-white/60 hover:text-white p-1"
              >
                <X size={15} />
              </button>
            </div>
          </div>
        )}

        {/* Modal Header */}
        <div
          className="px-6 py-5 border-b flex items-center justify-between transition-colors"
          style={{
            background: `linear-gradient(135deg, ${theme.colors.headerFrom} 0%, ${theme.colors.headerVia} 60%, ${theme.colors.headerTo} 100%)`,
          }}
        >
          <div className="flex items-center gap-3 text-white">
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20">
              <KeyRound size={20} className="text-amber-300" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white leading-tight">
                Reset Password with OTP
              </h2>
              <p className="text-[11px] text-white/80">
                Parul University Security & Identity Recovery
              </p>
            </div>
          </div>

          <button
            type="button"
            id="forgot-password-close-btn"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Step Indicator Tracker */}
        {step !== 'success' && (
          <div
            className={`px-6 py-2.5 border-b flex items-center justify-between text-xs font-semibold ${
              theme.isDark ? 'bg-slate-800/60 border-slate-800' : 'bg-slate-50 border-slate-100'
            }`}
          >
            <div className="flex items-center gap-2">
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  step === 'find_account'
                    ? 'bg-blue-600 text-white'
                    : 'bg-emerald-500 text-white'
                }`}
              >
                {step === 'find_account' ? '1' : '✓'}
              </span>
              <span className={step === 'find_account' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500'}>
                Find Account
              </span>
            </div>

            <ArrowRight size={12} className="text-slate-400" />

            <div className="flex items-center gap-2">
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  step === 'select_channel'
                    ? 'bg-blue-600 text-white'
                    : step === 'enter_otp' || step === 'new_password'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                }`}
              >
                {step === 'enter_otp' || step === 'new_password' ? '✓' : '2'}
              </span>
              <span
                className={
                  step === 'select_channel'
                    ? 'text-blue-600 dark:text-blue-400'
                    : step === 'enter_otp' || step === 'new_password'
                    ? 'text-slate-500'
                    : 'text-slate-400'
                }
              >
                Choose Channel
              </span>
            </div>

            <ArrowRight size={12} className="text-slate-400" />

            <div className="flex items-center gap-2">
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  step === 'enter_otp'
                    ? 'bg-blue-600 text-white'
                    : step === 'new_password'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                }`}
              >
                {step === 'new_password' ? '✓' : '3'}
              </span>
              <span
                className={
                  step === 'enter_otp'
                    ? 'text-blue-600 dark:text-blue-400'
                    : step === 'new_password'
                    ? 'text-slate-500'
                    : 'text-slate-400'
                }
              >
                Verify OTP
              </span>
            </div>

            <ArrowRight size={12} className="text-slate-400" />

            <div className="flex items-center gap-2">
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  step === 'new_password'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                }`}
              >
                4
              </span>
              <span className={step === 'new_password' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}>
                New Password
              </span>
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {/* ========================================================= */}
          {/* STEP 1: FIND REGISTERED STUDENT ACCOUNT                   */}
          {/* ========================================================= */}
          {step === 'find_account' && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Identify Your Student Account
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Enter your registered UG Enrollment Number, Mobile Number, or Gmail ID. We will send a secure 6-digit OTP to reset your password.
                </p>
              </div>

              {identifierError && (
                <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2 animate-in shake">
                  <AlertCircle size={16} className="shrink-0 text-rose-500" />
                  <span>{identifierError}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
                  UG Number, Gmail ID, or Mobile *
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-slate-400">
                    <User size={18} />
                  </span>
                  <input
                    id="forgot-id-input"
                    type="text"
                    value={identifierInput}
                    onChange={(e) => setIdentifierInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleFindAccount();
                      }
                    }}
                    placeholder="e.g. 26UG123456 or alex.patel@gmail.com"
                    className={`w-full pl-11 pr-4 py-3 rounded-2xl border text-sm font-medium transition-all ${
                      theme.isDark
                        ? 'bg-slate-800/80 border-slate-700 text-white placeholder-slate-500 focus:border-blue-500'
                        : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-600'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                    autoFocus
                  />
                </div>
              </div>

              {/* Quick Select demo pills for quick testing */}
              <div className="pt-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1.5">
                  Quick Select Registered Accounts:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setIdentifierInput('26UG123456');
                      handleFindAccount('26UG123456');
                    }}
                    className="px-2.5 py-1 rounded-xl text-[11px] font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/50 hover:bg-blue-100 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <GraduationCap size={13} />
                    <span>26UG123456 (Alex Patel)</span>
                  </button>

                  {registeredAccounts
                    .filter((a) => a.enrollmentNo !== '26UG123456')
                    .slice(0, 2)
                    .map((acc) => (
                      <button
                        key={acc.enrollmentNo}
                        type="button"
                        onClick={() => {
                          setIdentifierInput(acc.enrollmentNo);
                          handleFindAccount(acc.enrollmentNo);
                        }}
                        className="px-2.5 py-1 rounded-xl text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <User size={12} />
                        <span>{acc.enrollmentNo} ({acc.name.split(' ')[0]})</span>
                      </button>
                    ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  id="forgot-find-account-btn"
                  onClick={() => handleFindAccount()}
                  disabled={isSearchingAccount}
                  className="w-full py-3 rounded-2xl font-bold text-sm text-white shadow-md transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                  style={{ backgroundColor: theme.colors.primary }}
                >
                  {isSearchingAccount ? (
                    <>
                      <RefreshCw size={17} className="animate-spin" />
                      <span>Verifying Account...</span>
                    </>
                  ) : (
                    <>
                      <span>Find Account & Select OTP Method</span>
                      <ArrowRight size={17} />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* STEP 2: SELECT OTP DESTINATION (MOBILE OR GMAIL ID)      */}
          {/* ========================================================= */}
          {step === 'select_channel' && selectedStudent && (
            <div className="space-y-4">
              {/* Account Identified Badge */}
              <div className="p-3.5 rounded-2xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                    {selectedStudent.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span>{selectedStudent.name}</span>
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-md bg-blue-600/15 text-blue-700 dark:text-blue-300">
                        #{selectedStudent.enrollmentNo}
                      </span>
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[240px]">
                      {selectedStudent.department}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setStep('find_account')}
                  className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                >
                  Change
                </button>
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Where should we send your OTP?
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Select your preferred channel to receive the 6-digit verification code:
                </p>
              </div>

              {/* Channel 1: Registered Mobile Number (SMS / WhatsApp) */}
              <div
                id="channel-mobile-card"
                onClick={() => setSelectedChannel('mobile')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  selectedChannel === 'mobile'
                    ? 'border-blue-600 bg-blue-500/10 ring-2 ring-blue-500/30 shadow-xs'
                    : theme.isDark
                    ? 'border-slate-800 bg-slate-800/40 hover:bg-slate-800'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                      selectedChannel === 'mobile'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <Smartphone size={22} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        Registered Mobile Number
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        SMS & WhatsApp
                      </span>
                    </div>
                    <p className="text-xs font-mono font-medium text-slate-600 dark:text-slate-400 mt-0.5">
                      {formatMaskedPhone(selectedStudent.phone)}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Instant OTP delivery to your registered SIM
                    </p>
                  </div>
                </div>

                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    selectedChannel === 'mobile'
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : 'border-slate-300 dark:border-slate-600'
                  }`}
                >
                  {selectedChannel === 'mobile' && <Check size={12} />}
                </div>
              </div>

              {/* Channel 2: Registered Gmail ID */}
              <div
                id="channel-gmail-card"
                onClick={() => setSelectedChannel('email')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  selectedChannel === 'email'
                    ? 'border-blue-600 bg-blue-500/10 ring-2 ring-blue-500/30 shadow-xs'
                    : theme.isDark
                    ? 'border-slate-800 bg-slate-800/40 hover:bg-slate-800'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                      selectedChannel === 'email'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <Mail size={22} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        Registered Gmail ID
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                        Google Mail
                      </span>
                    </div>
                    <p className="text-xs font-mono font-medium text-slate-600 dark:text-slate-400 mt-0.5">
                      {formatMaskedEmail(selectedStudent.email)}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Official student verification email with single-use code
                    </p>
                  </div>
                </div>

                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    selectedChannel === 'email'
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : 'border-slate-300 dark:border-slate-600'
                  }`}
                >
                  {selectedChannel === 'email' && <Check size={12} />}
                </div>
              </div>

              {/* Send Button */}
              <div className="pt-3">
                <button
                  type="button"
                  id="send-reset-otp-btn"
                  onClick={() => handleSendOtp()}
                  className="w-full py-3.5 rounded-2xl font-bold text-sm text-white shadow-md transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                  style={{ backgroundColor: theme.colors.primary }}
                >
                  <span>
                    Send OTP to {selectedChannel === 'mobile' ? 'Mobile Number' : 'Gmail ID'}
                  </span>
                  <ArrowRight size={17} />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* STEP 3: ENTER 6-DIGIT OTP                                */}
          {/* ========================================================= */}
          {step === 'enter_otp' && selectedStudent && (
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Enter Verification OTP
                  </h3>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-600 dark:text-blue-400">
                    {selectedChannel === 'mobile' ? 'Mobile SMS' : 'Gmail ID'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  We sent a 6-digit one-time code to{' '}
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {selectedChannel === 'mobile'
                      ? formatMaskedPhone(selectedStudent.phone)
                      : formatMaskedEmail(selectedStudent.email)}
                  </span>
                  . Check the notification banner at the top to auto-fill.
                </p>
              </div>

              {otpError && (
                <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2 animate-in shake">
                  <AlertCircle size={16} className="shrink-0 text-rose-500" />
                  <span>{otpError}</span>
                </div>
              )}

              {/* OTP Input Field */}
              <div className="space-y-2">
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 block text-center">
                  6-Digit OTP Code
                </label>
                <div className="flex justify-center">
                  <input
                    id="forgot-otp-input"
                    type="text"
                    maxLength={6}
                    value={enteredOtp}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                      setEnteredOtp(val);
                      if (val.length === 6) setOtpError('');
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleVerifyOtp();
                      }
                    }}
                    placeholder="••••••"
                    className={`w-56 text-center text-2xl font-mono font-bold tracking-[0.5em] py-3 rounded-2xl border transition-all ${
                      theme.isDark
                        ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-600 focus:border-blue-500'
                        : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-300 focus:bg-white focus:border-blue-600'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                    autoFocus
                  />
                </div>
              </div>

              {/* Resend & Channel Switch Actions */}
              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setStep('select_channel')}
                  className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft size={14} />
                  <span>Change channel</span>
                </button>

                <div>
                  {resendTimer > 0 ? (
                    <span className="text-slate-400 font-mono text-[11px]">
                      Resend in {resendTimer}s
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSendOtp(selectedChannel)}
                      className="text-blue-600 dark:text-blue-400 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw size={13} />
                      <span>Resend OTP</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Verify OTP Button */}
              <div className="pt-2">
                <button
                  type="button"
                  id="verify-forgot-otp-btn"
                  onClick={handleVerifyOtp}
                  disabled={isSubmittingOtp || enteredOtp.length < 6}
                  className="w-full py-3.5 rounded-2xl font-bold text-sm text-white shadow-md transition-all active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                  style={{ backgroundColor: theme.colors.primary }}
                >
                  {isSubmittingOtp ? (
                    <>
                      <RefreshCw size={17} className="animate-spin" />
                      <span>Verifying OTP...</span>
                    </>
                  ) : (
                    <>
                      <span>Verify Code & Proceed</span>
                      <ArrowRight size={17} />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* STEP 4: SET NEW MASTER PASSWORD                           */}
          {/* ========================================================= */}
          {step === 'new_password' && selectedStudent && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Create New Master Password</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    OTP Verified
                  </span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Set a secure password for{' '}
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {selectedStudent.name}
                  </span>{' '}
                  (#{selectedStudent.enrollmentNo}).
                </p>
              </div>

              {passwordError && (
                <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2 animate-in shake">
                  <AlertCircle size={16} className="shrink-0 text-rose-500" />
                  <span>{passwordError}</span>
                </div>
              )}

              {/* New Password */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
                  New Password *
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-slate-400">
                    <Lock size={18} />
                  </span>
                  <input
                    id="forgot-new-password-input"
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full pl-11 pr-11 py-3 rounded-2xl border text-sm font-medium transition-all ${
                      theme.isDark
                        ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-blue-500'
                        : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-600'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {newPassword && (
                  <div className="space-y-1 pt-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-slate-400">Strength</span>
                      <span
                        className={`font-bold ${
                          passwordStrength <= 1
                            ? 'text-rose-500'
                            : passwordStrength === 2
                            ? 'text-amber-500'
                            : passwordStrength === 3
                            ? 'text-blue-500'
                            : 'text-emerald-500'
                        }`}
                      >
                        {passwordStrength <= 1
                          ? 'Weak'
                          : passwordStrength === 2
                          ? 'Fair'
                          : passwordStrength === 3
                          ? 'Good'
                          : 'Strong'}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden flex gap-1">
                      <div
                        className={`h-full flex-1 rounded-full transition-all ${
                          passwordStrength >= 1 ? 'bg-rose-500' : 'bg-transparent'
                        }`}
                      />
                      <div
                        className={`h-full flex-1 rounded-full transition-all ${
                          passwordStrength >= 2 ? 'bg-amber-500' : 'bg-transparent'
                        }`}
                      />
                      <div
                        className={`h-full flex-1 rounded-full transition-all ${
                          passwordStrength >= 3 ? 'bg-blue-500' : 'bg-transparent'
                        }`}
                      />
                      <div
                        className={`h-full flex-1 rounded-full transition-all ${
                          passwordStrength >= 4 ? 'bg-emerald-500' : 'bg-transparent'
                        }`}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
                  Confirm New Password *
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-slate-400">
                    <Lock size={18} />
                  </span>
                  <input
                    id="forgot-confirm-password-input"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full pl-11 pr-11 py-3 rounded-2xl border text-sm font-medium transition-all ${
                      theme.isDark
                        ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-blue-500'
                        : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-600'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Submit New Password Button */}
              <div className="pt-3">
                <button
                  type="button"
                  id="save-new-password-btn"
                  onClick={handleSaveNewPassword}
                  disabled={isUpdatingPassword}
                  className="w-full py-3.5 rounded-2xl font-bold text-sm text-white shadow-md transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                  style={{ backgroundColor: theme.colors.primary }}
                >
                  {isUpdatingPassword ? (
                    <>
                      <RefreshCw size={17} className="animate-spin" />
                      <span>Updating Credentials...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck size={18} />
                      <span>Save New Password & Finish</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* STEP 5: SUCCESS STATE                                    */}
          {/* ========================================================= */}
          {step === 'success' && selectedStudent && (
            <div className="text-center py-4 space-y-4 animate-in zoom-in-95 duration-300">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border-2 border-emerald-500/30">
                <CheckCircle2 size={36} />
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  Password Reset Successfully!
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                  Your master account password has been updated. You can now use your new password to sign into the Parul University Grievance Redressal Portal.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-left space-y-2 max-w-sm mx-auto">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Student:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {selectedStudent.name}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">UG Enrollment:</span>
                  <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                    {selectedStudent.enrollmentNo}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Verified Channel:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 size={13} />
                    {selectedChannel === 'mobile' ? 'Mobile SMS / WhatsApp' : 'Google Mail (Gmail)'}
                  </span>
                </div>
              </div>

              <div className="pt-2 space-y-2.5">
                <button
                  type="button"
                  id="forgot-success-login-now-btn"
                  onClick={() => onResetSuccess(selectedStudent, newPassword, true)}
                  className="w-full py-3.5 rounded-2xl font-bold text-sm text-white shadow-md transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                  style={{ backgroundColor: theme.colors.primary }}
                >
                  <Sparkles size={17} />
                  <span>Log In Directly Now</span>
                </button>

                <button
                  type="button"
                  id="forgot-success-back-to-login-btn"
                  onClick={() => onResetSuccess(selectedStudent, newPassword, false)}
                  className="w-full py-2.5 rounded-2xl font-semibold text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Return to Sign In Screen
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
