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
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useTheme } from '../theme';
import { updateStudentPassword } from './LoginScreen';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  userPhone: string;
  userEmail: string;
  userName: string;
  enrollmentNo: string;
  onSuccess?: (message: string) => void;
}

type Step = 'select_channel' | 'enter_otp' | 'new_password' | 'success';
type Channel = 'mobile' | 'email';

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  isOpen,
  onClose,
  userPhone,
  userEmail,
  userName,
  enrollmentNo,
  onSuccess,
}) => {
  const { theme } = useTheme();

  // Modal Step State
  const [step, setStep] = useState<Step>('select_channel');
  const [selectedChannel, setSelectedChannel] = useState<Channel>('mobile');

  // OTP State
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const [isSubmittingOtp, setIsSubmittingOtp] = useState(false);

  // Notification Banner Simulator State
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

  // Reset state when opening/closing
  useEffect(() => {
    if (isOpen) {
      setStep('select_channel');
      setSelectedChannel('mobile');
      setGeneratedOtp('');
      setEnteredOtp('');
      setOtpError('');
      setResendTimer(0);
      setNotificationBanner(null);
      setNewPassword('');
      setConfirmPassword('');
      setPasswordError('');
      setShowNewPassword(false);
      setShowConfirmPassword(false);
    }
  }, [isOpen]);

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
      }, 12000);
      return () => clearTimeout(timer);
    }
  }, [notificationBanner]);

  // Password Strength Calculation
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

  // Mask phone number for display (e.g. +91 98765 43210 -> +91 ••••• •3210)
  const formatMaskedPhone = (phone: string) => {
    if (!phone) return 'Registered Mobile';
    const cleaned = phone.trim();
    if (cleaned.length <= 4) return cleaned;
    const last4 = cleaned.slice(-4);
    return `•••••• ${last4}`;
  };

  // Mask email for display (e.g. student@paruluniversity.ac.in -> st***@paruluniversity.ac.in)
  const formatMaskedEmail = (email: string) => {
    if (!email) return 'Registered Gmail / Email';
    const [user, domain] = email.split('@');
    if (!domain) return email;
    const visibleChars = Math.min(2, user.length);
    const maskedUser = user.slice(0, visibleChars) + '•••••';
    return `${maskedUser}@${domain}`;
  };

  // Trigger Send OTP
  const handleSendOtp = (channelToUse?: Channel) => {
    const channel = channelToUse || selectedChannel;
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setEnteredOtp('');
    setOtpError('');
    setResendTimer(60);
    setStep('enter_otp');

    if (channel === 'mobile') {
      setNotificationBanner({
        show: true,
        app: 'mobile',
        title: 'SMS • Parul University Security',
        message: `Your OTP for changing your account password is ${code}. Valid for 10 minutes. Do not share this OTP with anyone.`,
        code,
      });
    } else {
      setNotificationBanner({
        show: true,
        app: 'email',
        title: 'Gmail • Parul University Security <security@paruluniversity.ac.in>',
        message: `Official Security Alert: ${code} is your one-time verification OTP to reset your student grievance portal password.`,
        code,
      });
    }
  };

  // Handle auto-fill from simulated notification banner
  const handleAutofillOtp = (code: string) => {
    setEnteredOtp(code);
    setOtpError('');
  };

  // Verify OTP
  const handleVerifyOtp = () => {
    if (!enteredOtp.trim()) {
      setOtpError('Please enter the 6-digit OTP code.');
      return;
    }
    if (enteredOtp.trim() !== generatedOtp) {
      setOtpError('Invalid OTP code. Please enter the code received or click Resend.');
      return;
    }

    setIsSubmittingOtp(true);
    setTimeout(() => {
      setIsSubmittingOtp(false);
      setOtpError('');
      setStep('new_password');
    }, 400);
  };

  // Update Password
  const handleUpdatePassword = () => {
    if (!newPassword) {
      setPasswordError('Please enter a new password.');
      return;
    }
    if (newPassword.length < 4) {
      setPasswordError('Password must be at least 4 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match. Please ensure both fields match.');
      return;
    }

    setIsUpdatingPassword(true);
    setPasswordError('');

    setTimeout(() => {
      const success = updateStudentPassword(
        {
          enrollmentNo,
          email: userEmail,
          phone: userPhone,
        },
        newPassword
      );

      setIsUpdatingPassword(false);

      if (success) {
        setStep('success');
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch {
          // ignore if canvas not supported
        }
        if (onSuccess) {
          onSuccess('Password updated successfully.');
        }
      } else {
        setPasswordError('Failed to update password. Please try again or contact support.');
      }
    }, 500);
  };

  return (
    <div
      id="change-password-modal"
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="change-password-modal-title"
    >
      {/* Floating Simulated Incoming OTP Notification */}
      {notificationBanner?.show && (
        <div className="fixed top-4 left-4 right-4 max-w-md mx-auto z-60 animate-in slide-in-from-top-4 duration-300">
          <div
            className={`p-3.5 rounded-2xl shadow-2xl border text-left flex items-start justify-between gap-3 ${
              notificationBanner.app === 'mobile'
                ? 'bg-sky-950/95 border-sky-500/50 text-sky-100'
                : 'bg-emerald-950/95 border-emerald-500/50 text-emerald-100'
            }`}
          >
            <div className="flex items-start gap-2.5 flex-1 min-w-0">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  notificationBanner.app === 'mobile'
                    ? 'bg-sky-500/20 text-sky-400'
                    : 'bg-emerald-500/20 text-emerald-400'
                }`}
              >
                {notificationBanner.app === 'mobile' ? <Smartphone size={16} /> : <Mail size={16} />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-bold truncate text-white">
                    {notificationBanner.title}
                  </p>
                  <span className="text-[10px] text-slate-300 shrink-0">Now</span>
                </div>
                <p className="text-xs mt-0.5 line-clamp-2 text-slate-200">
                  {notificationBanner.message}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <button
                    type="button"
                    id="otp-autofill-btn"
                    onClick={() => handleAutofillOtp(notificationBanner.code)}
                    className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-white text-slate-900 shadow hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    <Copy size={12} />
                    <span>Auto-fill {notificationBanner.code}</span>
                  </button>
                  <span className="text-[10px] opacity-80">Tap to insert OTP</span>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setNotificationBanner(null)}
              className="text-slate-400 hover:text-white p-1"
              aria-label="Dismiss notification"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Modal Dialog Card */}
      <div
        className={`w-full max-w-md rounded-2xl shadow-2xl border overflow-hidden transition-all animate-in zoom-in-95 ${
          theme.classes.cardBg
        } ${theme.classes.cardBorder}`}
      >
        {/* Header */}
        <div
          className="p-5 text-white flex items-center justify-between"
          style={{
            background: `linear-gradient(135deg, ${theme.colors.headerFrom} 0%, ${theme.colors.headerTo} 100%)`,
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center text-white">
              <KeyRound size={20} />
            </div>
            <div>
              <h2 id="change-password-modal-title" className="text-base font-bold text-white">
                Change Password
              </h2>
              <p className="text-xs text-white/80">
                Secure OTP verification via registered contacts
              </p>
            </div>
          </div>
          <button
            type="button"
            id="change-password-close-btn"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        {/* Step 1: Select Verification Channel */}
        {step === 'select_channel' && (
          <div className="p-5 space-y-4">
            <div>
              <p
                className={`text-xs font-semibold ${
                  theme.isDark ? 'text-slate-200' : 'text-slate-700'
                }`}
              >
                Select how you would like to receive the one-time password (OTP):
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                The code will be sent to the verified contact credentials linked to enrollment{' '}
                <span className="font-mono font-semibold text-slate-500 dark:text-slate-300">
                  {enrollmentNo}
                </span>
                .
              </p>
            </div>

            <div className="space-y-3">
              {/* Channel 1: Mobile Number OTP */}
              <label
                id="channel-option-mobile"
                onClick={() => setSelectedChannel('mobile')}
                className={`flex items-start gap-3.5 p-3.5 rounded-xl border transition-all cursor-pointer ${
                  selectedChannel === 'mobile'
                    ? theme.isDark
                      ? 'bg-blue-950/40 border-blue-500/70 ring-1 ring-blue-500/50'
                      : 'bg-blue-50/70 border-blue-500 ring-1 ring-blue-500/40'
                    : theme.isDark
                    ? 'bg-slate-800/60 border-slate-700 hover:bg-slate-800'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="pt-0.5">
                  <input
                    type="radio"
                    name="otp-channel"
                    checked={selectedChannel === 'mobile'}
                    onChange={() => setSelectedChannel('mobile')}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-xs font-bold flex items-center gap-1.5 ${
                        theme.isDark ? 'text-slate-100' : 'text-slate-800'
                      }`}
                    >
                      <Phone size={14} className="text-blue-500" />
                      Registered Mobile Number
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                      <ShieldCheck size={10} />
                      Verified
                    </span>
                  </div>
                  <p className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-200 mt-1">
                    {userPhone || '+91 ••••••••••'}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Receive 6-digit OTP code instantly via SMS / WhatsApp message.
                  </p>
                </div>
              </label>

              {/* Channel 2: Gmail / Institutional Email OTP */}
              <label
                id="channel-option-email"
                onClick={() => setSelectedChannel('email')}
                className={`flex items-start gap-3.5 p-3.5 rounded-xl border transition-all cursor-pointer ${
                  selectedChannel === 'email'
                    ? theme.isDark
                      ? 'bg-blue-950/40 border-blue-500/70 ring-1 ring-blue-500/50'
                      : 'bg-blue-50/70 border-blue-500 ring-1 ring-blue-500/40'
                    : theme.isDark
                    ? 'bg-slate-800/60 border-slate-700 hover:bg-slate-800'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="pt-0.5">
                  <input
                    type="radio"
                    name="otp-channel"
                    checked={selectedChannel === 'email'}
                    onChange={() => setSelectedChannel('email')}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-xs font-bold flex items-center gap-1.5 ${
                        theme.isDark ? 'text-slate-100' : 'text-slate-800'
                      }`}
                    >
                      <Mail size={14} className="text-emerald-500" />
                      Registered Gmail / Email
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                      <ShieldCheck size={10} />
                      Verified
                    </span>
                  </div>
                  <p className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-200 mt-1 truncate">
                    {userEmail || 'student@paruluniversity.ac.in'}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Receive 6-digit OTP code sent to your registered Gmail address.
                  </p>
                </div>
              </label>
            </div>

            {/* Note */}
            <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-[11px]">
              <AlertCircle size={14} className="shrink-0 mt-0.5" />
              <span>
                To protect student account security, password modifications require verification
                using an active registered device or email.
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2.5 pt-2">
              <button
                type="button"
                id="cancel-select-channel-btn"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                id="send-otp-channel-btn"
                onClick={() => handleSendOtp()}
                className="flex-1 py-2.5 rounded-xl text-white text-xs font-bold shadow-md hover:opacity-95 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                style={{ backgroundColor: theme.colors.primary }}
              >
                <span>Send Verification OTP</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Enter OTP */}
        {step === 'enter_otp' && (
          <div className="p-5 space-y-4">
            <div className="text-center">
              <div
                className="w-12 h-12 rounded-full mx-auto flex items-center justify-center mb-2"
                style={{
                  backgroundColor: theme.colors.accentBadge,
                  color: theme.colors.primary,
                }}
              >
                {selectedChannel === 'mobile' ? <Smartphone size={24} /> : <Mail size={24} />}
              </div>
              <h3
                className={`text-sm font-bold ${
                  theme.isDark ? 'text-slate-100' : 'text-slate-800'
                }`}
              >
                Enter 6-Digit Verification OTP
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                We sent a 6-digit code to{' '}
                <span className="font-semibold text-slate-700 dark:text-slate-200">
                  {selectedChannel === 'mobile' ? userPhone : userEmail}
                </span>
              </p>
            </div>

            {/* OTP Input Field */}
            <div className="space-y-2">
              <label
                htmlFor="otp-code-input"
                className={`block text-xs font-semibold text-center ${
                  theme.isDark ? 'text-slate-300' : 'text-slate-700'
                }`}
              >
                Verification Code
              </label>
              <input
                id="otp-code-input"
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={enteredOtp}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                  setEnteredOtp(val);
                  setOtpError('');
                }}
                placeholder="• • • • • •"
                className={`w-full text-center text-xl font-mono tracking-widest py-3 px-4 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold ${
                  theme.classes.inputBg
                } ${theme.classes.inputBorder} ${
                  theme.isDark ? 'text-white' : 'text-slate-900'
                }`}
              />

              {otpError && (
                <p className="text-xs text-rose-500 font-medium text-center flex items-center justify-center gap-1">
                  <AlertCircle size={13} />
                  {otpError}
                </p>
              )}
            </div>

            {/* Resend & Channel Switcher */}
            <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                id="switch-channel-btn"
                onClick={() => setStep('select_channel')}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-medium transition-colors cursor-pointer"
              >
                Change verification method
              </button>

              {resendTimer > 0 ? (
                <span className="text-slate-400 font-medium">Resend in {resendTimer}s</span>
              ) : (
                <button
                  type="button"
                  id="resend-otp-btn"
                  onClick={() => handleSendOtp(selectedChannel)}
                  className="font-semibold flex items-center gap-1 hover:underline cursor-pointer"
                  style={{ color: theme.colors.primary }}
                >
                  <RefreshCw size={12} />
                  <span>Resend OTP</span>
                </button>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2.5 pt-2">
              <button
                type="button"
                id="cancel-otp-btn"
                onClick={() => setStep('select_channel')}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Back
              </button>
              <button
                type="button"
                id="verify-otp-btn"
                disabled={isSubmittingOtp || enteredOtp.length < 6}
                onClick={handleVerifyOtp}
                className={`flex-1 py-2.5 rounded-xl text-white text-xs font-bold shadow-md hover:opacity-95 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  enteredOtp.length < 6 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                style={{ backgroundColor: theme.colors.primary }}
              >
                {isSubmittingOtp ? (
                  <RefreshCw size={14} className="animate-spin" />
                ) : (
                  <>
                    <span>Verify Code</span>
                    <ArrowRight size={14} />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Enter New Password */}
        {step === 'new_password' && (
          <div className="p-5 space-y-4">
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs">
              <CheckCircle2 size={16} className="shrink-0" />
              <span>
                Identity verified successfully via {selectedChannel === 'mobile' ? 'Mobile' : 'Gmail'} OTP. Please enter your new password.
              </span>
            </div>

            <div className="space-y-3 text-xs">
              {/* New Password */}
              <div>
                <label
                  htmlFor="new-password-input"
                  className={`font-semibold block mb-1 ${
                    theme.isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}
                >
                  New Password
                </label>
                <div className="relative">
                  <input
                    id="new-password-input"
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      setPasswordError('');
                    }}
                    placeholder="Enter new password (min 4 characters)"
                    className={`w-full p-2.5 pr-10 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium ${
                      theme.classes.inputBg
                    } ${theme.classes.inputBorder} ${
                      theme.isDark ? 'text-white' : 'text-slate-900'
                    }`}
                  />
                  <button
                    type="button"
                    id="toggle-new-password-btn"
                    onClick={() => setShowNewPassword((prev) => !prev)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                    aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                  >
                    {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div>
                <label
                  htmlFor="confirm-password-input"
                  className={`font-semibold block mb-1 ${
                    theme.isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}
                >
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    id="confirm-password-input"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setPasswordError('');
                    }}
                    placeholder="Re-enter new password"
                    className={`w-full p-2.5 pr-10 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium ${
                      theme.classes.inputBg
                    } ${theme.classes.inputBorder} ${
                      theme.isDark ? 'text-white' : 'text-slate-900'
                    }`}
                  />
                  <button
                    type="button"
                    id="toggle-confirm-password-btn"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Password Strength Indicator */}
              {newPassword && (
                <div className="pt-1 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Password strength:</span>
                    <span
                      className={`font-semibold ${
                        passwordStrength <= 1
                          ? 'text-rose-500'
                          : passwordStrength <= 3
                          ? 'text-amber-500'
                          : 'text-emerald-500'
                      }`}
                    >
                      {passwordStrength <= 1
                        ? 'Weak'
                        : passwordStrength <= 3
                        ? 'Moderate'
                        : 'Strong'}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-1 h-1.5 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                    {[1, 2, 3, 4].map((step) => (
                      <div
                        key={step}
                        className={`h-full transition-colors ${
                          passwordStrength >= step
                            ? passwordStrength <= 1
                              ? 'bg-rose-500'
                              : passwordStrength <= 3
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                            : 'transparent'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Match status */}
              {newPassword && confirmPassword && (
                <div className="text-[11px]">
                  {newPassword === confirmPassword ? (
                    <span className="text-emerald-500 flex items-center gap-1 font-medium">
                      <Check size={12} />
                      Passwords match
                    </span>
                  ) : (
                    <span className="text-rose-500 flex items-center gap-1 font-medium">
                      <X size={12} />
                      Passwords do not match
                    </span>
                  )}
                </div>
              )}

              {passwordError && (
                <p className="text-xs text-rose-500 font-medium flex items-center gap-1">
                  <AlertCircle size={13} />
                  {passwordError}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2.5 pt-2">
              <button
                type="button"
                id="cancel-new-password-btn"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                id="save-new-password-btn"
                disabled={isUpdatingPassword || !newPassword || newPassword !== confirmPassword}
                onClick={handleUpdatePassword}
                className={`flex-1 py-2.5 rounded-xl text-white text-xs font-bold shadow-md hover:opacity-95 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  !newPassword || newPassword !== confirmPassword
                    ? 'opacity-50 cursor-not-allowed'
                    : ''
                }`}
                style={{ backgroundColor: theme.colors.primary }}
              >
                {isUpdatingPassword ? (
                  <RefreshCw size={14} className="animate-spin" />
                ) : (
                  <>
                    <span>Save New Password</span>
                    <Check size={14} />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Success State */}
        {step === 'success' && (
          <div className="p-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center shadow-lg">
              <CheckCircle2 size={36} />
            </div>

            <div>
              <h3
                className={`text-base font-bold ${
                  theme.isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                Password Changed Successfully!
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                Your account password has been updated. You can now use your new password for all
                future portal logins.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-left text-xs space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>Account:</span>
                <span className="font-mono font-semibold text-slate-700 dark:text-slate-200">
                  {enrollmentNo}
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Verification Method:</span>
                <span className="font-semibold text-slate-700 dark:text-slate-200">
                  {selectedChannel === 'mobile' ? 'Mobile Number OTP' : 'Gmail / Email OTP'}
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Status:</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  Active & Secured
                </span>
              </div>
            </div>

            <button
              type="button"
              id="password-success-done-btn"
              onClick={onClose}
              className="w-full py-2.5 rounded-xl text-white text-xs font-bold shadow-md hover:opacity-95 transition-all cursor-pointer"
              style={{ backgroundColor: theme.colors.primary }}
            >
              Done & Return to Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
