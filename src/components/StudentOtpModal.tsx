import React, { useState, useEffect } from 'react';
import {
  X,
  Phone,
  Mail,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  ShieldCheck,
  ArrowRight,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { useTheme } from '../theme';

interface StudentOtpModalProps {
  isOpen: boolean;
  onClose: () => void;
  phone: string;
  email: string;
  studentName: string;
  ugNumber: string;
  department: string;
  isPhoneVerified: boolean;
  isEmailVerified: boolean;
  onVerifyPhoneSuccess: (method: 'whatsapp' | 'sms') => void;
  onVerifyEmailSuccess: () => void;
  onCompleteRegistration: () => void;
  initialStep?: 'phone' | 'email';
}

export const StudentOtpModal: React.FC<StudentOtpModalProps> = ({
  isOpen,
  onClose,
  phone,
  email,
  studentName,
  ugNumber,
  department,
  isPhoneVerified,
  isEmailVerified,
  onVerifyPhoneSuccess,
  onVerifyEmailSuccess,
  onCompleteRegistration,
  initialStep = 'phone',
}) => {
  const { theme } = useTheme();

  // Active step: 'phone' | 'email' | 'complete'
  const [activeStep, setActiveStep] = useState<'phone' | 'email' | 'complete'>(
    isPhoneVerified && !isEmailVerified
      ? 'email'
      : isPhoneVerified && isEmailVerified
      ? 'complete'
      : initialStep
  );

  // Phone verification state
  const [phoneMethod, setPhoneMethod] = useState<'whatsapp' | 'sms'>('whatsapp');
  const [phoneOtpSent, setPhoneOtpSent] = useState(false);
  const [phoneGeneratedOtp, setPhoneGeneratedOtp] = useState('');
  const [phoneEnteredOtp, setPhoneEnteredOtp] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [phoneTimer, setPhoneTimer] = useState(0);

  // Email verification state
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [emailGeneratedOtp, setEmailGeneratedOtp] = useState('');
  const [emailEnteredOtp, setEmailEnteredOtp] = useState('');
  const [emailError, setEmailError] = useState('');
  const [emailTimer, setEmailTimer] = useState(0);

  // Incoming Notification Simulation Banner
  const [notificationBanner, setNotificationBanner] = useState<{
    show: boolean;
    app: 'whatsapp' | 'sms' | 'email';
    title: string;
    message: string;
    code: string;
  } | null>(null);

  // Synchronize initial step when opened
  useEffect(() => {
    if (isOpen) {
      if (!isPhoneVerified) {
        setActiveStep('phone');
      } else if (!isEmailVerified) {
        setActiveStep('email');
      } else {
        setActiveStep('complete');
      }
      setPhoneError('');
      setEmailError('');
    }
  }, [isOpen, isPhoneVerified, isEmailVerified]);

  // Timers countdown
  useEffect(() => {
    let timer: any;
    if (phoneTimer > 0) {
      timer = setInterval(() => setPhoneTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [phoneTimer]);

  useEffect(() => {
    let timer: any;
    if (emailTimer > 0) {
      timer = setInterval(() => setEmailTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [emailTimer]);

  if (!isOpen) return null;

  // Handler: Send Phone OTP (WhatsApp or SMS)
  const handleSendPhoneOtp = (method?: 'whatsapp' | 'sms') => {
    const chosenMethod = method || phoneMethod;
    setPhoneMethod(chosenMethod);
    // Generate random 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setPhoneGeneratedOtp(code);
    setPhoneOtpSent(true);
    setPhoneTimer(30);
    setPhoneError('');

    // Trigger realistic notification banner
    if (chosenMethod === 'whatsapp') {
      setNotificationBanner({
        show: true,
        app: 'whatsapp',
        title: 'WhatsApp • Parul University Bot',
        message: `Your student registration verification code is ${code}. Valid for 10 minutes. Do not share with anyone.`,
        code,
      });
    } else {
      setNotificationBanner({
        show: true,
        app: 'sms',
        title: 'Messages • PU-VERIFY',
        message: `${code} is your Parul University verification OTP. Valid for 10 mins.`,
        code,
      });
    }
  };

  // Handler: Verify Phone OTP
  const handleVerifyPhoneOtp = () => {
    if (!phoneEnteredOtp.trim()) {
      setPhoneError('Please enter the 6-digit OTP.');
      return;
    }
    if (phoneEnteredOtp.trim() !== phoneGeneratedOtp) {
      setPhoneError('Invalid OTP code. Please enter the correct 6-digit code or resend.');
      return;
    }

    setPhoneError('');
    onVerifyPhoneSuccess(phoneMethod);

    // If email is not yet verified, transition to email step
    if (!isEmailVerified) {
      setActiveStep('email');
    } else {
      setActiveStep('complete');
    }
  };

  // Handler: Send Email OTP
  const handleSendEmailOtp = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setEmailGeneratedOtp(code);
    setEmailOtpSent(true);
    setEmailTimer(30);
    setEmailError('');

    setNotificationBanner({
      show: true,
      app: 'email',
      title: 'Parul University Registrar <portal@paruluniversity.ac.in>',
      message: `Your email verification OTP is ${code} to activate your official student account.`,
      code,
    });
  };

  // Handler: Verify Email OTP
  const handleVerifyEmailOtp = () => {
    if (!emailEnteredOtp.trim()) {
      setEmailError('Please enter the 6-digit OTP sent to your email.');
      return;
    }
    if (emailEnteredOtp.trim() !== emailGeneratedOtp) {
      setEmailError('Invalid OTP code. Please enter the code sent to your official email.');
      return;
    }

    setEmailError('');
    onVerifyEmailSuccess();
    setActiveStep('complete');
  };

  return (
    <div
      id="student-otp-modal"
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
    >
      {/* Realistic Simulated Notification Banner */}
      {notificationBanner?.show && (
        <div className="fixed top-4 left-4 right-4 max-w-md mx-auto z-60 animate-in slide-in-from-top-4 duration-300">
          <div
            className={`p-3.5 rounded-2xl shadow-2xl border text-left flex items-start justify-between gap-3 ${
              notificationBanner.app === 'whatsapp'
                ? 'bg-emerald-950/95 border-emerald-500/50 text-emerald-100'
                : notificationBanner.app === 'sms'
                ? 'bg-sky-950/95 border-sky-500/50 text-sky-100'
                : 'bg-indigo-950/95 border-indigo-500/50 text-indigo-100'
            }`}
          >
            <div className="flex items-start gap-2.5 flex-1">
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  notificationBanner.app === 'whatsapp'
                    ? 'bg-emerald-600 text-white'
                    : notificationBanner.app === 'sms'
                    ? 'bg-sky-600 text-white'
                    : 'bg-indigo-600 text-white'
                }`}
              >
                {notificationBanner.app === 'whatsapp' ? (
                  <MessageSquare size={16} />
                ) : notificationBanner.app === 'sms' ? (
                  <Phone size={16} />
                ) : (
                  <Mail size={16} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold truncate">{notificationBanner.title}</p>
                <p className="text-[11px] opacity-90 leading-tight mt-0.5">
                  {notificationBanner.message}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-white/20 font-mono font-bold text-xs tracking-wider">
                    {notificationBanner.code}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      if (activeStep === 'phone') {
                        setPhoneEnteredOtp(notificationBanner.code);
                      } else if (activeStep === 'email') {
                        setEmailEnteredOtp(notificationBanner.code);
                      }
                      setNotificationBanner(null);
                    }}
                    className="text-[11px] font-semibold underline hover:opacity-100 opacity-90"
                  >
                    Auto-fill OTP
                  </button>
                </div>
              </div>
            </div>
            <button
              onClick={() => setNotificationBanner(null)}
              className="text-white/60 hover:text-white p-1"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Main Modal Card */}
      <div className="bg-white text-slate-900 w-full max-w-md rounded-3xl p-5 sm:p-6 shadow-2xl border border-slate-200 relative animate-in zoom-in-95 duration-200 my-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="text-center pb-3 border-b border-slate-100">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-[#990024]/10 text-[#990024] flex items-center justify-center mb-2 shadow-xs">
            <ShieldCheck size={26} />
          </div>
          <h3 className="text-lg font-bold text-slate-900 tracking-tight">
            Official Student Verification
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Parul University mandates both <span className="font-semibold text-slate-700">Mobile OTP</span> and{' '}
            <span className="font-semibold text-slate-700">Institutional Email OTP</span> verification to create an account.
          </p>

          {/* Verification Status Stepper */}
          <div className="grid grid-cols-2 gap-2 mt-3 pt-2">
            <div
              className={`p-2 rounded-xl text-left border transition-all ${
                isPhoneVerified
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : activeStep === 'phone'
                  ? 'bg-rose-50 border-rose-200 text-rose-900 ring-2 ring-rose-500/20'
                  : 'bg-slate-50 border-slate-200 text-slate-600 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  Step 1: Mobile OTP
                </span>
                {isPhoneVerified ? (
                  <CheckCircle2 size={14} className="text-emerald-600" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                )}
              </div>
              <p className="text-xs font-semibold truncate mt-0.5">
                {isPhoneVerified ? 'Verified ✓' : 'WhatsApp / SMS'}
              </p>
            </div>

            <div
              className={`p-2 rounded-xl text-left border transition-all ${
                isEmailVerified
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : activeStep === 'email'
                  ? 'bg-rose-50 border-rose-200 text-rose-900 ring-2 ring-rose-500/20'
                  : 'bg-slate-50 border-slate-200 text-slate-600 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  Step 2: Email OTP
                </span>
                {isEmailVerified ? (
                  <CheckCircle2 size={14} className="text-emerald-600" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                )}
              </div>
              <p className="text-xs font-semibold truncate mt-0.5">
                {isEmailVerified ? 'Verified ✓' : 'Institutional Email'}
              </p>
            </div>
          </div>
        </div>

        {/* STEP 1: MOBILE OTP VERIFICATION */}
        {activeStep === 'phone' && !isPhoneVerified && (
          <div className="py-4 space-y-4">
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Target Mobile Number
              </span>
              <div className="flex items-center justify-between mt-1">
                <span className="text-sm font-bold text-slate-900 font-mono">
                  {phone || '+91 98765 43210'}
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  {studentName || 'Student'}
                </span>
              </div>
            </div>

            {/* Choose WhatsApp or SMS */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-2">
                Choose Verification Channel:
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setPhoneMethod('whatsapp');
                    if (phoneOtpSent) handleSendPhoneOtp('whatsapp');
                  }}
                  className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                    phoneMethod === 'whatsapp'
                      ? 'border-emerald-500 bg-emerald-50/70 text-emerald-950 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                      <MessageSquare size={15} />
                    </span>
                    {phoneMethod === 'whatsapp' && (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                        Active
                      </span>
                    )}
                  </div>
                  <div className="mt-2">
                    <p className="text-xs font-bold">WhatsApp OTP</p>
                    <p className="text-[10px] text-slate-500">Official PU Bot</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setPhoneMethod('sms');
                    if (phoneOtpSent) handleSendPhoneOtp('sms');
                  }}
                  className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                    phoneMethod === 'sms'
                      ? 'border-sky-500 bg-sky-50/70 text-sky-950 ring-2 ring-sky-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="w-7 h-7 rounded-xl bg-sky-600 text-white flex items-center justify-center">
                      <Phone size={15} />
                    </span>
                    {phoneMethod === 'sms' && (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 bg-sky-100 px-1.5 py-0.5 rounded">
                        Active
                      </span>
                    )}
                  </div>
                  <div className="mt-2">
                    <p className="text-xs font-bold">SMS OTP</p>
                    <p className="text-[10px] text-slate-500">Direct Carrier SMS</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Action to send or re-send OTP */}
            {!phoneOtpSent ? (
              <button
                type="button"
                onClick={() => handleSendPhoneOtp()}
                className="w-full py-3 bg-[#990024] hover:bg-[#800020] text-white font-bold rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>Send OTP via {phoneMethod === 'whatsapp' ? 'WhatsApp' : 'SMS'}</span>
                <ArrowRight size={16} />
              </button>
            ) : (
              <div className="space-y-3 pt-1">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      Enter 6-Digit Mobile OTP:
                    </label>
                    {phoneGeneratedOtp && (
                      <button
                        type="button"
                        onClick={() => setPhoneEnteredOtp(phoneGeneratedOtp)}
                        className="text-[11px] text-blue-600 font-bold hover:underline flex items-center gap-1"
                      >
                        <Sparkles size={12} />
                        Auto-fill ({phoneGeneratedOtp})
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    maxLength={6}
                    value={phoneEnteredOtp}
                    onChange={(e) => setPhoneEnteredOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="• • • • • •"
                    className="w-full text-center tracking-[0.4em] font-mono text-lg py-2.5 px-4 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#990024]/20 focus:border-[#990024] font-bold"
                  />
                </div>

                {phoneError && (
                  <div className="p-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                    <AlertCircle size={14} className="shrink-0" />
                    <span>{phoneError}</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Didn&apos;t receive code?</span>
                  {phoneTimer > 0 ? (
                    <span className="font-semibold text-slate-700">
                      Resend in {phoneTimer}s
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSendPhoneOtp()}
                      className="text-[#990024] font-bold hover:underline flex items-center gap-1"
                    >
                      <RefreshCw size={12} />
                      Resend OTP
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleVerifyPhoneOtp}
                  className="w-full py-3 bg-[#990024] hover:bg-[#800020] text-white font-bold rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 size={16} />
                  <span>Verify Mobile OTP</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* STEP 2: INSTITUTIONAL EMAIL OTP VERIFICATION */}
        {(activeStep === 'email' || (isPhoneVerified && !isEmailVerified)) && (
          <div className="py-4 space-y-4">
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Official University Email
              </span>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs sm:text-sm font-bold text-slate-900 font-mono truncate">
                  {email || '26ug456789@paruluniversity.ac.in'}
                </span>
                <span className="text-[11px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-bold shrink-0 ml-2">
                  PU Domain
                </span>
              </div>
            </div>

            {!emailOtpSent ? (
              <div className="space-y-3">
                <div className="p-3 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-indigo-950 text-xs">
                  <p className="font-semibold">Institutional Security Protocol</p>
                  <p className="text-[11px] text-indigo-700 mt-0.5">
                    We will send a 6-digit confirmation code to your official Parul University student inbox.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSendEmailOtp}
                  className="w-full py-3 bg-[#990024] hover:bg-[#800020] text-white font-bold rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Mail size={16} />
                  <span>Send Email Verification OTP</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3 pt-1">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      Enter 6-Digit Email OTP:
                    </label>
                    {emailGeneratedOtp && (
                      <button
                        type="button"
                        onClick={() => setEmailEnteredOtp(emailGeneratedOtp)}
                        className="text-[11px] text-blue-600 font-bold hover:underline flex items-center gap-1"
                      >
                        <Sparkles size={12} />
                        Auto-fill ({emailGeneratedOtp})
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    maxLength={6}
                    value={emailEnteredOtp}
                    onChange={(e) => setEmailEnteredOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="• • • • • •"
                    className="w-full text-center tracking-[0.4em] font-mono text-lg py-2.5 px-4 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#990024]/20 focus:border-[#990024] font-bold"
                  />
                </div>

                {emailError && (
                  <div className="p-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                    <AlertCircle size={14} className="shrink-0" />
                    <span>{emailError}</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Didn&apos;t receive email?</span>
                  {emailTimer > 0 ? (
                    <span className="font-semibold text-slate-700">
                      Resend in {emailTimer}s
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSendEmailOtp}
                      className="text-[#990024] font-bold hover:underline flex items-center gap-1"
                    >
                      <RefreshCw size={12} />
                      Resend Email OTP
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleVerifyEmailOtp}
                  className="w-full py-3 bg-[#990024] hover:bg-[#800020] text-white font-bold rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 size={16} />
                  <span>Verify Email OTP</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* STEP 3: BOTH COMPLETED */}
        {isPhoneVerified && isEmailVerified && (
          <div className="py-5 text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <CheckCircle2 size={34} />
            </div>

            <div>
              <h4 className="text-base font-bold text-slate-900">
                Student Verification Complete!
              </h4>
              <p className="text-xs text-slate-600 mt-1 max-w-xs mx-auto">
                Both your mobile number and institutional email are verified. You can now complete your student registration.
              </p>
            </div>

            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-left text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Student Name:</span>
                <span className="font-bold text-slate-800">{studentName || 'Student'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">UG Number:</span>
                <span className="font-mono font-bold text-[#990024]">{ugNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Faculty:</span>
                <span className="font-medium text-slate-800 truncate max-w-[200px]">
                  {department}
                </span>
              </div>
              <div className="flex justify-between items-center pt-1 border-t border-slate-200/60">
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 size={12} /> Mobile Verified ({phoneMethod.toUpperCase()})
                </span>
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 size={12} /> Email Verified
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onCompleteRegistration}
              className="w-full py-3.5 bg-[#990024] hover:bg-[#800020] text-white font-bold rounded-xl text-sm shadow-lg shadow-[#990024]/30 transition-all flex items-center justify-center gap-2"
            >
              <span>Complete Registration & Proceed</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* Footer Security Note */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <ShieldCheck size={13} className="text-[#990024]" />
            Parul University IT Security
          </span>
          <span>Helpdesk: 02668-260300</span>
        </div>
      </div>
    </div>
  );
};
