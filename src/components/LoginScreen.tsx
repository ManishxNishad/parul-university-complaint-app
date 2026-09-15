import React, { useState, useMemo, useEffect } from 'react';
import {
  User,
  GraduationCap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Phone,
  Building2,
  UserPlus,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  MessageSquare,
  QrCode,
  Award,
  IdCard,
  Check,
  KeyRound,
} from 'lucide-react';
import { useTheme } from '../theme';
import { UserProfile } from '../types';
import { ForgotPasswordModal } from './ForgotPasswordModal';
import { apiClient } from '../services/api';

export interface RegisteredStudent {
  name: string;
  enrollmentNo: string;
  email: string;
  department: string;
  phone: string;
  password: string;
  phoneVerified: boolean;
  phoneMethod: 'whatsapp' | 'sms';
  emailVerified: boolean;
  createdAt: string;
  isStatic?: boolean;
}

export const STORAGE_KEY_ACCOUNTS = 'pu_registered_students_v2';
export const STORAGE_KEY_SESSION = 'pu_active_session_v2';

// Primary Static Student Account for Aman
export const STATIC_STUDENT_AMAN: RegisteredStudent = {
  name: 'Aman',
  enrollmentNo: '26UG576544',
  email: 'aman576544534@gmail.com',
  department: 'Computer Science & Engineering (PIET)',
  phone: '+91 98765 54453',
  password: 'Password@123',
  phoneVerified: true,
  phoneMethod: 'whatsapp',
  emailVerified: true,
  createdAt: '2026-01-01T08:00:00.000Z',
  isStatic: true,
};

export const DEFAULT_STUDENT: RegisteredStudent = STATIC_STUDENT_AMAN;

export const STATIC_STUDENTS_LIST: RegisteredStudent[] = [
  STATIC_STUDENT_AMAN,
  {
    name: 'Alex Patel',
    enrollmentNo: '26UG123456',
    email: 'alex.patel@gmail.com',
    department: 'Computer Science & Engineering (PIET)',
    phone: '+91 98765 43210',
    password: 'Password@123',
    phoneVerified: true,
    phoneMethod: 'whatsapp',
    emailVerified: true,
    createdAt: '2026-01-15T10:00:00.000Z',
    isStatic: true,
  },
  {
    name: 'Rohan Sharma',
    enrollmentNo: '23CS12345',
    email: 'rohan.sharma23@paruluniversity.ac.in',
    department: 'Computer Science & Engineering',
    phone: '+91 98765 43210',
    password: 'Password@123',
    phoneVerified: true,
    phoneMethod: 'sms',
    emailVerified: true,
    createdAt: '2026-02-01T10:00:00.000Z',
    isStatic: true,
  },
  {
    name: 'Priya Verma',
    enrollmentNo: '24IT67890',
    email: 'priya.verma24@paruluniversity.ac.in',
    department: 'Information Technology (PIET)',
    phone: '+91 98112 33445',
    password: 'Password@123',
    phoneVerified: true,
    phoneMethod: 'sms',
    emailVerified: true,
    createdAt: '2026-02-10T11:00:00.000Z',
    isStatic: true,
  },
];

export const getRegisteredAccounts = (): RegisteredStudent[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ACCOUNTS);
    let accounts: RegisteredStudent[] = [];
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        accounts = parsed;
      }
    }
    // Always guarantee STATIC_STUDENTS_LIST (including Aman) are present
    const map = new Map<string, RegisteredStudent>();
    STATIC_STUDENTS_LIST.forEach((s) => map.set(s.enrollmentNo.toLowerCase(), s));
    accounts.forEach((a) => {
      if (a && a.enrollmentNo) {
        map.set(a.enrollmentNo.toLowerCase(), a);
      }
    });
    const merged = Array.from(map.values());
    localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(merged));
    return merged;
  } catch {
    return STATIC_STUDENTS_LIST;
  }
};

export const saveRegisteredAccount = (account: RegisteredStudent) => {
  const current = getRegisteredAccounts();
  const filtered = current.filter(
    (a) =>
      a.enrollmentNo.toLowerCase() !== account.enrollmentNo.toLowerCase() &&
      a.email.toLowerCase() !== account.email.toLowerCase()
  );
  filtered.push(account);
  localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(filtered));
};

export const updateStudentPassword = (
  identifier: { enrollmentNo?: string; email?: string; phone?: string },
  newPassword: string
): boolean => {
  try {
    const current = getRegisteredAccounts();
    const index = current.findIndex(
      (a) =>
        (identifier.enrollmentNo && a.enrollmentNo.toLowerCase() === identifier.enrollmentNo.toLowerCase()) ||
        (identifier.email && a.email.toLowerCase() === identifier.email.toLowerCase()) ||
        (identifier.phone && a.phone.replace(/\D/g, '') === identifier.phone.replace(/\D/g, ''))
    );

    if (index !== -1) {
      current[index].password = newPassword;
      localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(current));
    } else {
      // If student not found yet, create an account record so they can sign in
      const newAcc: RegisteredStudent = {
        name: identifier.email ? identifier.email.split('@')[0].toUpperCase() : 'Parul Student',
        enrollmentNo: identifier.enrollmentNo ? identifier.enrollmentNo.toUpperCase() : '26UG' + Math.floor(100000 + Math.random() * 900000),
        email: identifier.email || 'student@paruluniversity.ac.in',
        phone: identifier.phone || '+91 98765 43210',
        department: 'Computer Science & Engineering (PIET)',
        password: newPassword,
        phoneVerified: true,
        phoneMethod: 'whatsapp',
        emailVerified: true,
        createdAt: new Date().toISOString(),
      };
      current.push(newAcc);
      localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(current));
    }

    // Also update active session if present
    const sessionRaw = localStorage.getItem(STORAGE_KEY_SESSION);
    if (sessionRaw) {
      const session = JSON.parse(sessionRaw);
      if (
        session &&
        ((identifier.enrollmentNo && session.enrollmentNo?.toLowerCase() === identifier.enrollmentNo.toLowerCase()) ||
          (identifier.email && session.email?.toLowerCase() === identifier.email.toLowerCase()))
      ) {
        session.password = newPassword;
        localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(session));
      }
    }
    return true;
  } catch {
    return false;
  }
};

export const getActiveSession = (): RegisteredStudent | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SESSION);
    if (!raw) return null;
    const session = JSON.parse(raw);
    if (!session || !session.enrollmentNo) return null;
    const accounts = getRegisteredAccounts();
    const verified = accounts.find(
      (a) =>
        a.enrollmentNo.toLowerCase() === session.enrollmentNo.toLowerCase() &&
        a.phoneVerified &&
        a.emailVerified
    );
    return verified || null;
  } catch {
    return null;
  }
};

export const clearActiveSession = () => {
  try {
    localStorage.removeItem(STORAGE_KEY_SESSION);
  } catch {}
};

interface LoginScreenProps {
  onLoginSuccess: (role: 'Student' | 'Staff', customUser?: Partial<UserProfile>) => void;
  onSignUpClick?: () => void;
  onForgotPasswordClick?: () => void;
  onSwitchToStaffLogin?: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLoginSuccess,
  onForgotPasswordClick,
  onSwitchToStaffLogin,
}) => {
  const { theme } = useTheme();

  // Active Mode: 'signin' | 'create_account'
  const [authMode, setAuthMode] = useState<'signin' | 'create_account'>('create_account');

  // Sign In States - Clean with NO demo credentials
  const [signInIdentifier, setSignInIdentifier] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [keepSessionActive, setKeepSessionActive] = useState(true);
  const [signInLoading, setSignInLoading] = useState(false);
  const [signInError, setSignInError] = useState('');
  const [resetSuccessBanner, setResetSuccessBanner] = useState('');
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);

  // Create Account Form Fields - Clean with NO demo data
  const [fullName, setFullName] = useState('');
  const [ugNumber, setUgNumber] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('Computer Science & Engineering (PIET)');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Digital ID Card Preview interactive flip
  const [isCardFlipped, setIsCardFlipped] = useState(false);

  // Mobile Verification (WhatsApp or SMS)
  const [phoneMethod, setPhoneMethod] = useState<'whatsapp' | 'sms'>('whatsapp');
  const [phoneOtpSent, setPhoneOtpSent] = useState(false);
  const [phoneGeneratedOtp, setPhoneGeneratedOtp] = useState('');
  const [phoneEnteredOtp, setPhoneEnteredOtp] = useState('');
  const [phoneTimer, setPhoneTimer] = useState(0);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [phoneError, setPhoneError] = useState('');

  // Email Verification
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [emailGeneratedOtp, setEmailGeneratedOtp] = useState('');
  const [emailEnteredOtp, setEmailEnteredOtp] = useState('');
  const [emailTimer, setEmailTimer] = useState(0);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [emailError, setEmailError] = useState('');

  // Feedback & Banners
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successBanner, setSuccessBanner] = useState('');

  // Simulated Push Notification Toast
  const [notificationToast, setNotificationToast] = useState<{
    show: boolean;
    type: 'whatsapp' | 'sms' | 'email';
    title: string;
    body: string;
    code: string;
  } | null>(null);

  // Faculty & Department List
  const departmentsList = [
    'Computer Science & Engineering (PIET)',
    'Information Technology (PIET)',
    'Mechanical Engineering (PIT)',
    'Civil Engineering (PIT)',
    'Electrical & Electronics (PIT)',
    'Faculty of Management Studies (PIMR)',
    'Faculty of Pharmacy (PIP)',
    'Faculty of Medicine & Health (PIMSR)',
    'Institute of Design & Architecture (PID)',
    'Faculty of Law & Governance (PIL)',
    'Applied Sciences & Biotechnology',
  ];

  // Timer Countdown Effect
  useEffect(() => {
    let t: any;
    if (phoneTimer > 0) {
      t = setInterval(() => setPhoneTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(t);
  }, [phoneTimer]);

  useEffect(() => {
    let t: any;
    if (emailTimer > 0) {
      t = setInterval(() => setEmailTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(t);
  }, [emailTimer]);

  // Password Strength Calculation
  const passwordStrength = useMemo(() => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 4) score += 1;
    if (password.length >= 8) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[A-Z]/.test(password) || /[^A-Za-z0-9]/.test(password)) score += 1;
    return Math.min(score, 4);
  }, [password]);

  // Handlers for OTP Generation & Simulation
  const handleSendPhoneOtp = (method: 'whatsapp' | 'sms') => {
    if (!phone.trim() || phone.trim().length < 8) {
      setPhoneError('Please enter a valid mobile number first.');
      return;
    }
    setPhoneMethod(method);
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setPhoneGeneratedOtp(code);
    setPhoneOtpSent(true);
    setPhoneTimer(45);
    setPhoneError('');

    if (method === 'whatsapp') {
      setNotificationToast({
        show: true,
        type: 'whatsapp',
        title: 'WhatsApp • Parul University Verified Bot',
        body: `Your official Student Registration OTP is ${code}. Valid for 10 mins.`,
        code,
      });
    } else {
      setNotificationToast({
        show: true,
        type: 'sms',
        title: 'Messages • PU-VERIFY-SMS',
        body: `${code} is your Parul Student Grievance portal registration OTP.`,
        code,
      });
    }
  };

  const handleVerifyPhoneOtp = () => {
    if (!phoneEnteredOtp.trim()) {
      setPhoneError('Please enter the 6-digit OTP code.');
      return;
    }
    if (phoneEnteredOtp.trim() !== phoneGeneratedOtp) {
      setPhoneError('Incorrect OTP. Tap auto-fill code to use the received code.');
      return;
    }
    setIsPhoneVerified(true);
    setPhoneError('');
    setNotificationToast(null);
  };

  const handleSendEmailOtp = () => {
    if (!email.trim() || !email.includes('@')) {
      setEmailError('Please enter your university email address first.');
      return;
    }
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setEmailGeneratedOtp(code);
    setEmailOtpSent(true);
    setEmailTimer(45);
    setEmailError('');

    setNotificationToast({
      show: true,
      type: 'email',
      title: 'PU Registrar <verify@paruluniversity.ac.in>',
      body: `Your official university email OTP is ${code}.`,
      code,
    });
  };

  const handleVerifyEmailOtp = () => {
    if (!emailEnteredOtp.trim()) {
      setEmailError('Please enter the 6-digit email OTP.');
      return;
    }
    if (emailEnteredOtp.trim() !== emailGeneratedOtp) {
      setEmailError('Incorrect email OTP. Tap auto-fill code.');
      return;
    }
    setIsEmailVerified(true);
    setEmailError('');
    setNotificationToast(null);
  };

  // Registration Submission - Strictly enforces both phone & email verification
  const handleCreateAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    const trimmedName = fullName.trim();
    const trimmedUg = ugNumber.trim().toUpperCase();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPhone = phone.trim();

    if (!trimmedName) {
      setFormError('Please enter your full student name.');
      return;
    }
    if (!trimmedUg) {
      setFormError('Please enter your UG Enrollment Number.');
      return;
    }
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      setFormError('Please enter a valid university email address.');
      return;
    }
    if (!trimmedPhone) {
      setFormError('Please enter your mobile phone number.');
      return;
    }

    // MANDATORY DUAL OTP VERIFICATION: BOTH MUST BE VERIFIED!
    if (!isPhoneVerified) {
      setFormError('Mandatory Step: Mobile number must be verified via WhatsApp or SMS OTP.');
      return;
    }
    if (!isEmailVerified) {
      setFormError('Mandatory Step: University email must be verified via OTP.');
      return;
    }

    // Check if account already exists with this UG number or Email
    const existingAccounts = getRegisteredAccounts();
    const isDuplicate = existingAccounts.some(
      (acc) =>
        acc.enrollmentNo.toLowerCase() === trimmedUg.toLowerCase() ||
        acc.email.toLowerCase() === trimmedEmail.toLowerCase()
    );

    if (isDuplicate) {
      setFormError(
        'An account with this UG Enrollment Number or Email is already registered. Please switch to the Sign In tab.'
      );
      return;
    }

    if (!password || password.length < 4) {
      setFormError('Password must be at least 4 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setFormError('Passwords do not match. Please re-enter.');
      return;
    }

    setIsSubmitting(true);
    setSuccessBanner('Account created & verified successfully! Initializing student session...');

    const newAccount: RegisteredStudent = {
      name: trimmedName,
      enrollmentNo: trimmedUg,
      email: trimmedEmail,
      department,
      phone: trimmedPhone,
      password,
      phoneVerified: true,
      phoneMethod,
      emailVerified: true,
      createdAt: new Date().toISOString(),
      isStatic: true,
    };

    saveRegisteredAccount(newAccount);
    localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(newAccount));

    // Also persist directly to backend static student store
    apiClient
      .studentRegister({
        name: trimmedName,
        enrollmentNo: trimmedUg,
        ugNumber: trimmedUg,
        email: trimmedEmail,
        department,
        phone: trimmedPhone,
        password,
        phoneVerified: true,
        emailVerified: true,
      })
      .catch((err) => {
        console.warn('Backend student register sync notice:', err.message);
      });

    setTimeout(() => {
      setIsSubmitting(false);
      onLoginSuccess('Student', {
        name: newAccount.name,
        enrollmentNo: newAccount.enrollmentNo,
        email: newAccount.email,
        phone: newAccount.phone,
        program: newAccount.department,
        role: 'Student',
      });
    }, 700);
  };

  // Sign In Submission - Authenticates via Backend Static Store with Local Fallback
  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignInError('');

    const trimmedIdentifier = signInIdentifier.trim();
    if (!trimmedIdentifier || !signInPassword) {
      setSignInError('Please enter your registered UG Number or Email and Password.');
      return;
    }

    setSignInLoading(true);

    try {
      let loggedInUser: any = null;

      // 1. Try authenticating against the backend static student API
      try {
        const backendRes = await apiClient.studentLogin(trimmedIdentifier, signInPassword, keepSessionActive);
        if (backendRes && backendRes.student) {
          loggedInUser = backendRes.student;
        }
      } catch (backendErr: any) {
        console.warn('Backend student auth notice:', backendErr.message);
      }

      // 2. Fallback to local static / registered student accounts
      if (!loggedInUser) {
        const accounts = getRegisteredAccounts();
        const matched = accounts.find(
          (acc) =>
            acc.enrollmentNo.toLowerCase() === trimmedIdentifier.toLowerCase() ||
            acc.email.toLowerCase() === trimmedIdentifier.toLowerCase()
        );

        if (!matched) {
          setSignInLoading(false);
          setSignInError(
            'No verified account found with this UG Number or Email. Please check your credentials or create an account.'
          );
          return;
        }

        if (matched.password !== signInPassword) {
          setSignInLoading(false);
          setSignInError('Incorrect password. Please verify your credentials and try again.');
          return;
        }

        if (!matched.phoneVerified || !matched.emailVerified) {
          setSignInLoading(false);
          setSignInError(
            'Account verification incomplete: Both mobile phone and email must be verified to access the portal.'
          );
          return;
        }

        loggedInUser = {
          name: matched.name,
          enrollmentNo: matched.enrollmentNo,
          email: matched.email,
          phone: matched.phone,
          department: matched.department,
        };
      }

      setSignInLoading(false);

      if (keepSessionActive) {
        localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(loggedInUser));
      } else {
        localStorage.removeItem(STORAGE_KEY_SESSION);
      }

      onLoginSuccess('Student', {
        name: loggedInUser.name,
        enrollmentNo: loggedInUser.enrollmentNo || loggedInUser.ugNumber,
        email: loggedInUser.email,
        phone: loggedInUser.phone,
        program: loggedInUser.department || 'Computer Science & Engineering (PIET)',
        role: 'Student',
        hostelBlock: loggedInUser.hostelBlock || 'Block B',
        roomNo: loggedInUser.roomNo || '204',
      });
    } catch (err: any) {
      setSignInLoading(false);
      setSignInError(err.message || 'Failed to authenticate student account.');
    }
  };

  return (
    <div
      id="login-screen-v2"
      className="min-h-full flex flex-col bg-white login-ambient-grid text-slate-900 relative overflow-x-hidden selection:bg-rose-500/20"
    >
      {/* Dynamic ambient grid overlay and soft light accents */}
      <div className="fixed inset-0 login-grid-overlay pointer-events-none opacity-40 z-0" />
      <div className="fixed -top-40 -left-40 w-96 h-96 rounded-full bg-rose-100/40 blur-3xl pointer-events-none z-0" />
      <div className="fixed top-1/3 -right-40 w-96 h-96 rounded-full bg-amber-100/30 blur-3xl pointer-events-none z-0" />
      <div className="fixed -bottom-40 left-1/3 w-96 h-96 rounded-full bg-slate-100/60 blur-3xl pointer-events-none z-0" />

      {/* ================= SIMULATED PUSH NOTIFICATION (WHATSAPP / SMS / EMAIL) ================= */}
      {notificationToast?.show && (
        <div className="fixed top-3 left-3 right-3 max-w-sm mx-auto z-50 animate-in slide-in-from-top-4 duration-300">
          <div
            className={`p-3.5 rounded-2xl shadow-2xl border backdrop-blur-xl flex items-start justify-between gap-3 ${
              notificationToast.type === 'whatsapp'
                ? 'bg-white border-2 border-emerald-500 text-slate-900 ring-2 ring-emerald-500/20'
                : notificationToast.type === 'sms'
                ? 'bg-white border-2 border-sky-500 text-slate-900 ring-2 ring-sky-500/20'
                : 'bg-white border-2 border-indigo-500 text-slate-900 ring-2 ring-indigo-500/20'
            }`}
          >
            <div className="flex items-start gap-2.5 flex-1 min-w-0">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-md ${
                  notificationToast.type === 'whatsapp'
                    ? 'bg-emerald-500 text-white'
                    : notificationToast.type === 'sms'
                    ? 'bg-sky-500 text-white'
                    : 'bg-indigo-500 text-white'
                }`}
              >
                {notificationToast.type === 'whatsapp' ? (
                  <MessageSquare size={18} />
                ) : notificationToast.type === 'sms' ? (
                  <Phone size={18} />
                ) : (
                  <Mail size={18} />
                )}
              </div>
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold truncate text-slate-900">
                    {notificationToast.title}
                  </p>
                  <span className="text-[10px] text-slate-500 font-mono">Just now</span>
                </div>
                <p className="text-[11px] leading-snug text-slate-600 mt-0.5">
                  {notificationToast.body}
                </p>
                <div className="mt-2.5 flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-300 font-mono font-bold text-sm tracking-widest text-slate-900 shadow-inner">
                    {notificationToast.code}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      if (
                        notificationToast.type === 'whatsapp' ||
                        notificationToast.type === 'sms'
                      ) {
                        setPhoneEnteredOtp(notificationToast.code);
                      } else {
                        setEmailEnteredOtp(notificationToast.code);
                      }
                      setNotificationToast(null);
                    }}
                    className="text-xs font-bold text-rose-700 hover:text-rose-800 underline flex items-center gap-1.5"
                  >
                    <Sparkles size={13} /> Auto-fill Code
                  </button>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setNotificationToast(null)}
              className="text-slate-400 hover:text-slate-700 text-xs p-1"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* ================= TOP MODERN UNIVERSITY BRAND HEADER ================= */}
      <header className="relative z-20 px-4 sm:px-6 lg:px-8 pt-4 pb-3.5 border-b border-slate-200 bg-white/95 backdrop-blur-xl shadow-xs">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between">
            {/* Parul Crest with Holographic Ring */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <div
                  className="w-11 h-11 rounded-2xl p-1.5 flex items-center justify-center shadow-md ring-2 ring-amber-400/40 relative overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${theme.colors.primary}, #3d000c)`,
                  }}
                >
                  <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
                    <path
                      d="M50 5 L85 20 V52 C85 75 50 95 50 95 C50 95 15 75 15 52 V20 L50 5 Z"
                      fill="#780016"
                      stroke="#FDE68A"
                      strokeWidth="4"
                    />
                    <path
                      d="M50 12 L78 24 V50 C78 68 50 86 50 86 C50 86 22 68 22 50 V24 L50 12 Z"
                      fill="#F59E0B"
                    />
                    <path
                      d="M36 32 L42 38 L50 28 L58 38 L64 32 L62 44 H38 L36 32 Z"
                      fill="#FEF3C7"
                    />
                  </svg>
                  {/* Holographic light sweep */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-pulse pointer-events-none" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-white shadow-xs" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base sm:text-lg font-black tracking-tight text-slate-900">
                    Parul University
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 text-[10px] font-black tracking-wider uppercase shadow-xs">
                    NAAC A++
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 tracking-wide flex items-center gap-1.5 mt-0.5">
                  <span>Central Student Grievance Redressal</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-emerald-600 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    Live 2026-27
                  </span>
                </p>
              </div>
            </div>

            {/* Quick Helpdesk Pill & Staff Portal Button */}
            <div className="flex items-center gap-2.5">
              {onSwitchToStaffLogin && (
                <button
                  type="button"
                  id="student-login-switch-to-staff-btn"
                  onClick={onSwitchToStaffLogin}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1.5 transition-all shadow-xs hover:border-amber-400"
                  title="Switch to Parul University Staff / Faculty Administrative Portal"
                >
                  <ShieldCheck size={14} className="text-amber-700" />
                  <span>Staff Portal</span>
                </button>
              )}
              <span className="hidden sm:inline-flex text-[11px] px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-medium shadow-2xs">
                Helpline: 02668-260300
              </span>
            </div>
          </div>

          {/* ================= HIGH-TECH SEGMENTED AUTH SWITCHER ================= */}
          <div className="mt-4 p-1.5 bg-slate-100/90 rounded-2xl border border-slate-200 grid grid-cols-2 gap-1.5 relative shadow-inner max-w-md mx-auto">
            <button
              type="button"
              id="auth-toggle-signin"
              onClick={() => {
                setAuthMode('signin');
                setFormError('');
                setSignInError('');
              }}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                authMode === 'signin'
                  ? 'btn-pu-gradient text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
              }`}
            >
              <Lock size={14} />
              <span>Student Sign In</span>
            </button>

            <button
              type="button"
              id="auth-toggle-create"
              onClick={() => {
                setAuthMode('create_account');
                setFormError('');
                setSignInError('');
              }}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                authMode === 'create_account'
                  ? 'btn-pu-gradient text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
              }`}
            >
              <UserPlus size={14} />
              <span>Create Account</span>
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            </button>
          </div>
        </div>
      </header>

      {/* ================= MAIN SCROLLABLE CONTENT ================= */}
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 overflow-y-auto max-w-5xl mx-auto w-full">
        {/* Success / Feedback Banner */}
        {successBanner && (
          <div className="mb-4 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-center gap-2 animate-in fade-in duration-200 shadow-sm">
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
            <span className="font-semibold">{successBanner}</span>
          </div>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* =================== VIEW 1: CREATE STUDENT ACCOUNT ============= */}
        {/* ----------------------------------------------------------------- */}
        {authMode === 'create_account' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column (Desktop/Laptop): Live Digital Student ID Pass & Guidelines */}
              <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-4">
                {/* ================= INNOVATIVE FEATURE: LIVE DIGITAL STUDENT ID PASS ================= */}
                <div className="relative group">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 px-1">
                    <span className="flex items-center gap-1.5 text-amber-700">
                      <IdCard size={15} />
                      Live Digital Student ID Pass
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsCardFlipped(!isCardFlipped)}
                      className="text-[11px] text-rose-700 hover:text-rose-800 underline font-mono font-bold"
                    >
                      {isCardFlipped ? 'Show Front' : 'Tap for QR / Back'}
                    </button>
                  </div>

                  {/* Digital Smart Card Body */}
                  <div
                    onClick={() => setIsCardFlipped(!isCardFlipped)}
                    className="relative cursor-pointer rounded-3xl p-5 overflow-hidden border border-amber-400/50 shadow-xl transition-all hover:scale-[1.01] select-none id-card-holographic-foil floating-soft"
                    style={{
                      background:
                        'linear-gradient(135deg, #1f0714 0%, #2e0817 40%, #0d1224 100%)',
                    }}
                  >
                    {/* Foil sheen accent */}
                    <div className="absolute -top-16 -right-16 w-48 h-48 bg-gradient-to-br from-amber-400/25 via-rose-500/25 to-transparent rounded-full blur-2xl pointer-events-none" />

                    {!isCardFlipped ? (
                      /* FRONT OF SMART ID PASS */
                      <div className="space-y-3 relative z-10">
                        <div className="flex items-center justify-between border-b border-white/15 pb-2.5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-amber-400/20 border border-amber-400/50 flex items-center justify-center text-amber-300 text-xs font-black shadow-inner">
                              PU
                            </div>
                            <div>
                              <p className="text-xs font-black tracking-wider text-amber-300 uppercase">
                                Parul University
                              </p>
                              <p className="text-[9px] text-slate-400 font-mono">
                                OFFICIAL STUDENT GRIEVANCE CARD
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 shadow-xs">
                              2026-27 PASS
                            </span>
                          </div>
                        </div>

                        <div className="flex items-start gap-3.5 pt-1">
                          {/* Avatar Hologram */}
                          <div className="w-14 h-16 rounded-2xl bg-gradient-to-b from-slate-800 to-slate-950 border border-white/20 p-1 flex flex-col items-center justify-center shrink-0 text-center shadow-inner relative overflow-hidden">
                            <User size={26} className="text-slate-300" />
                            <span className="text-[8px] font-mono text-amber-400 font-bold uppercase mt-1">
                              STUDENT
                            </span>
                            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-400" />
                          </div>

                          {/* Dynamic Details */}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-black text-white truncate tracking-tight">
                              {fullName || 'Student Full Name'}
                            </p>
                            <p className="text-xs font-mono font-bold text-amber-400 tracking-wider mt-0.5">
                              {ugNumber || 'UG ENROLLMENT NO'}
                            </p>
                            <p className="text-[11px] text-slate-300 truncate mt-0.5 font-medium">
                              {department}
                            </p>

                            {/* Dual OTP Verification Chips on the Card */}
                            <div className="flex items-center gap-2 mt-2.5 flex-wrap">
                              <span
                                className={`text-[9px] font-bold px-2.5 py-0.5 rounded-md flex items-center gap-1.5 transition-all ${
                                  isPhoneVerified
                                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 shadow-xs'
                                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/30 opacity-80'
                                }`}
                              >
                                {isPhoneVerified ? (
                                  <CheckCircle2 size={11} className="text-emerald-400" />
                                ) : (
                                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                                )}
                                Phone {isPhoneVerified ? `✓ (${phoneMethod.toUpperCase()})` : 'Unverified'}
                              </span>

                              <span
                                className={`text-[9px] font-bold px-2.5 py-0.5 rounded-md flex items-center gap-1.5 transition-all ${
                                  isEmailVerified
                                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 shadow-xs'
                                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/30 opacity-80'
                                }`}
                              >
                                {isEmailVerified ? (
                                  <CheckCircle2 size={11} className="text-emerald-400" />
                                ) : (
                                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                                )}
                                Email {isEmailVerified ? '✓' : 'Unverified'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* BACK OF SMART ID PASS (QR Code & Credentials) */
                      <div className="space-y-2.5 relative z-10 text-center py-1">
                        <div className="flex items-center justify-between border-b border-white/15 pb-2">
                          <span className="text-[10px] font-mono text-slate-400">
                            PU AUTH TOKEN & ACCREDITATION
                          </span>
                          <span className="text-[10px] font-mono text-amber-400 font-bold">
                            NAAC A++ RANKED
                          </span>
                        </div>
                        <div className="flex items-center justify-center gap-4 py-1.5">
                          <div className="w-16 h-16 bg-white p-1 rounded-xl shadow-lg flex items-center justify-center text-slate-950">
                            <QrCode size={56} />
                          </div>
                          <div className="text-left text-[11px] space-y-1 font-mono text-slate-300">
                            <p>ID: {ugNumber || 'PENDING REGISTRATION'}</p>
                            <p>CAMPUS: LIMDA, GUJARAT</p>
                            <p className="text-emerald-400 font-bold">PORTAL ACCESS: SECURE</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Mandatory Verification Requirement Notice */}
                <div className="bg-amber-50 flex items-center gap-2.5 py-3 px-4 rounded-2xl border border-amber-200 text-[11px] text-amber-950 shadow-xs">
                  <ShieldCheck size={18} className="text-amber-600 shrink-0" />
                  <span>
                    <strong className="text-amber-900 font-bold">Strict Verification:</strong> Mobile (WhatsApp/SMS) and Email must both be OTP verified before account creation.
                  </span>
                </div>

                {/* Institutional Security Notice */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5 hidden sm:block shadow-xs">
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                    <ShieldCheck size={16} className="text-emerald-600" />
                    <span>Official Registration Protocols</span>
                  </div>
                  <ul className="text-[11px] text-slate-600 space-y-1.5 list-disc list-inside">
                    <li>Requires valid UG Enrollment number verified against university registry.</li>
                    <li>Dual OTP verification for official contact channels.</li>
                    <li>Complaints filed are monitored by respective Faculty Deans.</li>
                  </ul>
                </div>
              </div>

              {/* Right Column (Desktop/Laptop): Registration Form */}
              <div className="lg:col-span-7">
                <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xl relative overflow-hidden border border-slate-200 space-y-4">
                  {/* Subtle specular glow accent */}
                  <div className="absolute -top-24 -right-24 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

                  {/* Header inside the form */}
                  <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                          Student Account Registration
                        </h2>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Official Account
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Enroll your credentials — registered directly to the verified campus database
                      </p>
                    </div>
                    <div className="w-8 h-8 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
                      <UserPlus size={18} />
                    </div>
                  </div>

                  {/* Form Error Callout */}
                  {formError && (
                    <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-start gap-2.5">
                      <AlertCircle size={16} className="text-rose-600 shrink-0 mt-0.5" />
                      <p className="leading-snug font-medium">{formError}</p>
                    </div>
                  )}

                  {/* Registration Form */}
                  <form onSubmit={handleCreateAccountSubmit} className="space-y-4">
                    {/* FIELD 1: Full Student Name */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider block">
                        Full Student Name *
                      </label>
                      <div className="relative flex items-center">
                        <span className="absolute left-3.5 text-rose-600">
                          <User size={17} />
                        </span>
                        <input
                          id="create-fullname-v2"
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Enter official student name"
                          required
                          className="w-full pl-11 pr-4 py-2.5 login-input-glow text-slate-900 placeholder-slate-400 text-sm rounded-2xl font-medium"
                        />
                      </div>
                    </div>

                    {/* FIELD 2: UG Number */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider block">
                        UG Enrollment Number *
                      </label>
                      <div className="relative flex items-center">
                        <span className="absolute left-3.5 text-amber-600">
                          <GraduationCap size={17} />
                        </span>
                        <input
                          id="create-ug-v2"
                          type="text"
                          value={ugNumber}
                          onChange={(e) => setUgNumber(e.target.value.toUpperCase())}
                          placeholder="26UG456789"
                          required
                          className="w-full pl-11 pr-4 py-2.5 login-input-amber-glow text-slate-900 placeholder-slate-400 text-sm rounded-2xl font-mono font-bold"
                        />
                      </div>
                    </div>

                    {/* FIELD 3: Department / Faculty */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider block">
                        Department / Faculty *
                      </label>
                      <div className="relative flex items-center">
                        <span className="absolute left-3.5 text-rose-600 pointer-events-none">
                          <Building2 size={17} />
                        </span>
                        <select
                          id="create-dept-v2"
                          value={department}
                          onChange={(e) => setDepartment(e.target.value)}
                          className="w-full pl-11 pr-8 py-2.5 login-input-glow text-slate-900 text-xs sm:text-sm rounded-2xl font-medium appearance-none cursor-pointer bg-white"
                        >
                          {departmentsList.map((dept) => (
                            <option key={dept} value={dept} className="bg-white text-slate-900">
                              {dept}
                            </option>
                          ))}
                        </select>
                        <div className="absolute right-3.5 pointer-events-none text-slate-400 text-xs">
                          ▼
                        </div>
                      </div>
                    </div>

                    {/* ================= FIELD 4: MOBILE NUMBER + DUAL OTP VERIFICATION (WHATSAPP / SMS) ================= */}
                    <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Phone size={15} className="text-emerald-600" />
                          <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                            Mobile Number *
                          </span>
                        </div>

                        {isPhoneVerified ? (
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                            <CheckCircle2 size={12} className="text-emerald-700" /> Verified via {phoneMethod.toUpperCase()}
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-amber-800 bg-amber-100 border border-amber-300 px-2.5 py-0.5 rounded-full">
                            Verification Required
                          </span>
                        )}
                      </div>

                      {/* Input with verification trigger */}
                      <div className="relative flex items-center">
                        <input
                          id="create-phone-v2"
                          type="tel"
                          value={phone}
                          onChange={(e) => {
                            setPhone(e.target.value);
                            setIsPhoneVerified(false);
                            setPhoneOtpSent(false);
                          }}
                          placeholder="+91 98765 43210"
                          required
                          className="w-full pl-3 pr-4 py-2.5 login-input-glow text-slate-900 placeholder-slate-400 text-xs sm:text-sm rounded-xl font-mono font-semibold"
                        />
                      </div>

                      {/* OTP Dispatch & Verification Station */}
                      {!isPhoneVerified && (
                        <div className="space-y-2.5 pt-1">
                          <p className="text-[11px] text-slate-600">
                            Select how you want to receive your official registration OTP:
                          </p>

                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => handleSendPhoneOtp('whatsapp')}
                              className={`py-2 px-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                                phoneMethod === 'whatsapp' && phoneOtpSent
                                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                                  : 'bg-white hover:bg-emerald-50 text-emerald-800 border-emerald-300'
                              }`}
                            >
                              <MessageSquare size={14} className="text-emerald-600" />
                              <span>WhatsApp OTP</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleSendPhoneOtp('sms')}
                              className={`py-2 px-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                                phoneMethod === 'sms' && phoneOtpSent
                                  ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
                                  : 'bg-white hover:bg-sky-50 text-sky-800 border-sky-300'
                              }`}
                            >
                              <Phone size={14} className="text-sky-600" />
                              <span>SMS OTP</span>
                            </button>
                          </div>

                          {/* If OTP Sent, show PIN box & Verify button */}
                          {phoneOtpSent && (
                            <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-2.5 animate-in fade-in duration-200 shadow-xs">
                              <div className="flex items-center justify-between text-[11px]">
                                <span className="text-slate-700 font-medium">
                                  Enter 6-digit {phoneMethod === 'whatsapp' ? 'WhatsApp' : 'SMS'} code:
                                </span>
                                {phoneGeneratedOtp && (
                                  <button
                                    type="button"
                                    onClick={() => setPhoneEnteredOtp(phoneGeneratedOtp)}
                                    className="text-rose-700 hover:text-rose-800 underline font-bold"
                                  >
                                    Fill ({phoneGeneratedOtp})
                                  </button>
                                )}
                              </div>

                              <div className="flex items-center gap-2">
                                <input
                                  type="text"
                                  maxLength={6}
                                  value={phoneEnteredOtp}
                                  onChange={(e) =>
                                    setPhoneEnteredOtp(e.target.value.replace(/\D/g, ''))
                                  }
                                  placeholder="6-digit OTP"
                                  className="flex-1 py-2 px-3 bg-slate-50 border border-slate-300 rounded-lg text-center tracking-[0.3em] font-mono text-sm font-bold text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white"
                                />
                                <button
                                  type="button"
                                  onClick={handleVerifyPhoneOtp}
                                  className="py-2 px-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer"
                                >
                                  <Check size={14} /> Verify
                                </button>
                              </div>

                              {phoneError && (
                                <p className="text-[11px] text-rose-600 font-semibold">{phoneError}</p>
                              )}

                              <div className="flex items-center justify-between text-[10px] text-slate-500 pt-0.5">
                                <span>Didn&apos;t receive code?</span>
                                {phoneTimer > 0 ? (
                                  <span>Resend in {phoneTimer}s</span>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => handleSendPhoneOtp(phoneMethod)}
                                    className="text-emerald-700 hover:underline font-bold cursor-pointer"
                                  >
                                    Resend OTP
                                  </button>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* ================= FIELD 5: EMAIL ADDRESS + EMAIL OTP VERIFICATION ================= */}
                    <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Mail size={15} className="text-indigo-600" />
                          <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                            University Email *
                          </span>
                        </div>

                        {isEmailVerified ? (
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                            <CheckCircle2 size={12} className="text-emerald-700" /> Email Verified
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-amber-800 bg-amber-100 border border-amber-300 px-2.5 py-0.5 rounded-full">
                            Verification Required
                          </span>
                        )}
                      </div>

                      <div className="relative flex items-center">
                        <input
                          id="create-email-v2"
                          type="email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            setIsEmailVerified(false);
                            setEmailOtpSent(false);
                          }}
                          placeholder="26ug456789@paruluniversity.ac.in"
                          required
                          className="w-full pl-3 pr-4 py-2.5 login-input-glow text-slate-900 placeholder-slate-400 text-xs sm:text-sm rounded-xl font-mono font-semibold"
                        />
                      </div>

                      {!isEmailVerified && (
                        <div className="space-y-2.5 pt-1">
                          {!emailOtpSent ? (
                            <button
                              type="button"
                              onClick={handleSendEmailOtp}
                              className="w-full py-2.5 px-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-800 text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
                            >
                              <Mail size={14} className="text-indigo-600" />
                              <span>Send Institutional Email OTP</span>
                            </button>
                          ) : (
                            <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-2.5 animate-in fade-in duration-200 shadow-xs">
                              <div className="flex items-center justify-between text-[11px]">
                                <span className="text-slate-700 font-medium">Enter 6-digit Email code:</span>
                                {emailGeneratedOtp && (
                                  <button
                                    type="button"
                                    onClick={() => setEmailEnteredOtp(emailGeneratedOtp)}
                                    className="text-rose-700 hover:text-rose-800 underline font-bold"
                                  >
                                    Fill ({emailGeneratedOtp})
                                  </button>
                                )}
                              </div>

                              <div className="flex items-center gap-2">
                                <input
                                  type="text"
                                  maxLength={6}
                                  value={emailEnteredOtp}
                                  onChange={(e) =>
                                    setEmailEnteredOtp(e.target.value.replace(/\D/g, ''))
                                  }
                                  placeholder="6-digit OTP"
                                  className="flex-1 py-2 px-3 bg-slate-50 border border-slate-300 rounded-lg text-center tracking-[0.3em] font-mono text-sm font-bold text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                                />
                                <button
                                  type="button"
                                  onClick={handleVerifyEmailOtp}
                                  className="py-2 px-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer"
                                >
                                  <Check size={14} /> Verify
                                </button>
                              </div>

                              {emailError && (
                                <p className="text-[11px] text-rose-600 font-semibold">{emailError}</p>
                              )}

                              <div className="flex items-center justify-between text-[10px] text-slate-500 pt-0.5">
                                <span>Didn&apos;t receive email code?</span>
                                {emailTimer > 0 ? (
                                  <span>Resend in {emailTimer}s</span>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={handleSendEmailOtp}
                                    className="text-indigo-700 hover:underline font-bold cursor-pointer"
                                  >
                                    Resend Email OTP
                                  </button>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* ================= FIELD 6 & 7: PASSWORD CREATION & CONFIRMATION ================= */}
                    <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-3.5">
                      <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider block">
                        Security & Password Creation *
                      </span>

                      {/* Password Input */}
                      <div className="space-y-1.5">
                        <div className="relative flex items-center">
                          <span className="absolute left-3.5 text-rose-600">
                            <Lock size={16} />
                          </span>
                          <input
                            id="create-pass-v2"
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Create master password (min 4 chars)"
                            required
                            className="w-full pl-10 pr-10 py-2.5 login-input-glow text-slate-900 placeholder-slate-400 text-xs sm:text-sm rounded-xl font-medium"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 text-slate-400 hover:text-slate-700 p-1"
                          >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>

                      {/* Confirm Password Input */}
                      <div className="space-y-1.5">
                        <div className="relative flex items-center">
                          <span className="absolute left-3.5 text-rose-600">
                            <Lock size={16} />
                          </span>
                          <input
                            id="create-confirm-pass-v2"
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm master password"
                            required
                            className="w-full pl-10 pr-10 py-2.5 login-input-glow text-slate-900 placeholder-slate-400 text-xs sm:text-sm rounded-xl font-medium"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 text-slate-400 hover:text-slate-700 p-1"
                          >
                            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>

                      {/* Password Strength Visual Meter */}
                      <div className="space-y-1.5 pt-1">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-slate-600">Password Strength:</span>
                          <span
                            className={`font-bold ${
                              passwordStrength <= 1
                                ? 'text-rose-600'
                                : passwordStrength <= 3
                                ? 'text-amber-600'
                                : 'text-emerald-600'
                            }`}
                          >
                            {passwordStrength <= 1
                              ? 'Basic'
                              : passwordStrength <= 3
                              ? 'Good'
                              : 'Institutional Grade'}
                          </span>
                        </div>
                        <div className="grid grid-cols-4 gap-1.5 h-1.5">
                          {[1, 2, 3, 4].map((step) => (
                            <div
                              key={step}
                              className={`rounded-full transition-all duration-300 ${
                                passwordStrength >= step
                                  ? step <= 1
                                    ? 'bg-rose-500'
                                    : step <= 3
                                    ? 'bg-amber-500'
                                    : 'bg-emerald-500'
                                  : 'bg-slate-200'
                              }`}
                            />
                          ))}
                        </div>
                        {password && confirmPassword && (
                          <div className="flex items-center gap-1 text-[11px] pt-1">
                            {password === confirmPassword ? (
                              <span className="text-emerald-600 flex items-center gap-1 font-semibold">
                                <CheckCircle2 size={12} /> Passwords match
                              </span>
                            ) : (
                              <span className="text-rose-600 font-semibold">
                                Passwords do not match
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Complete Registration Action Button */}
                    <button
                      id="submit-create-account-v2"
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 px-4 rounded-2xl btn-pu-gradient text-white font-black text-sm active:scale-[0.99] transition-all flex items-center justify-center gap-2 mt-3 cursor-pointer shadow-xl relative overflow-hidden"
                    >
                      {/* Animated Shimmer sweep */}
                      <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-light-sweep pointer-events-none" />

                      {isSubmitting ? (
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <UserPlus size={17} />
                          <span>Complete Official Student Registration</span>
                          <ArrowRight size={16} />
                        </>
                      )}
                    </button>
                  </form>

                  <div className="text-center pt-3 mt-2 border-t border-slate-100">
                    <span className="text-xs text-slate-600">Already registered? </span>
                    <button
                      type="button"
                      onClick={() => setAuthMode('signin')}
                      className="text-xs font-bold text-rose-700 hover:text-rose-800 hover:underline"
                    >
                      Sign in with UG Credentials
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* ======================= VIEW 2: SIGN IN ========================= */}
        {/* ----------------------------------------------------------------- */}
        {authMode === 'signin' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column (Desktop/Laptop): Overview, Badges & Helpline */}
              <div className="lg:col-span-5 space-y-4">
                {/* Authenticated Portal Notice */}
                <div className="bg-white p-5 sm:p-6 rounded-3xl text-xs space-y-3.5 text-slate-600 shadow-xl border border-slate-200 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0 shadow-xs">
                      <ShieldCheck size={22} />
                    </div>
                    <div>
                      <span className="font-extrabold text-slate-900 text-sm block">
                        Registered Students Only
                      </span>
                      <span className="text-[10px] text-emerald-700 font-semibold font-mono">
                        Institutional 256-bit Portal Access
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] leading-relaxed text-slate-600">
                    Only accounts that have completed registration and verified both phone and institutional email can log in. Access without an authenticated account is strictly restricted.
                  </p>
                  <div className="pt-3 border-t border-slate-100 space-y-2.5 text-[11px]">
                    <div className="flex items-center gap-2.5 text-slate-700">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-xs" />
                      <span>Single Sign-On with verified UG Number</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-slate-700">
                      <span className="w-2 h-2 rounded-full bg-amber-500 shadow-xs" />
                      <span>End-to-end encrypted grievance redressal tracking</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-slate-700">
                      <span className="w-2 h-2 rounded-full bg-sky-500 shadow-xs" />
                      <span>Direct dean and committee escalation workflow</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column (Desktop/Laptop): Sign In Form Glass Card */}
              <div className="lg:col-span-7">
                <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-slate-200">
                  {/* Specular light sweep accent */}
                  <div className="absolute -top-24 -right-24 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

                  {/* Header inside the form */}
                  <div className="mb-5 pb-3 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                        Student Grievance Sign In
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Enter your registered UG Number and master password
                      </p>
                    </div>
                    <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
                      <GraduationCap size={18} />
                    </div>
                  </div>

                  {/* Reset Success Banner */}
                  {resetSuccessBanner && (
                    <div className="mb-4 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2.5 animate-in fade-in">
                      <CheckCircle2 size={17} className="text-emerald-600 shrink-0" />
                      <span className="font-semibold">{resetSuccessBanner}</span>
                    </div>
                  )}

                  {/* Error message */}
                  {signInError && (
                    <div className="mb-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-center gap-2.5 animate-in shake">
                      <AlertCircle size={17} className="text-rose-600 shrink-0" />
                      <span className="font-medium">{signInError}</span>
                    </div>
                  )}

                  {/* Sign In Form */}
                  <form onSubmit={handleSignInSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider block">
                          UG Number or Official Email *
                        </label>
                      </div>
                      <div className="relative flex items-center">
                        <span className="absolute left-3.5 text-amber-600">
                          <GraduationCap size={18} />
                        </span>
                        <input
                          id="signin-ug-input-v2"
                          type="text"
                          value={signInIdentifier}
                          onChange={(e) => {
                            setSignInIdentifier(e.target.value);
                            setResetSuccessBanner('');
                          }}
                          placeholder="e.g. 26UG123456 or student@paruluniversity.ac.in"
                          required
                          className="w-full pl-11 pr-4 py-3 login-input-amber-glow text-slate-900 placeholder-slate-400 text-sm rounded-2xl font-mono font-bold"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider block">
                          Master Password *
                        </label>
                        <button
                          type="button"
                          id="signin-forgot-password-btn"
                          onClick={() => {
                            setIsForgotPasswordOpen(true);
                          }}
                          className="text-xs font-bold text-rose-700 hover:text-rose-800 hover:underline cursor-pointer flex items-center gap-1"
                        >
                          <KeyRound size={12} />
                          <span>Forgot Password?</span>
                        </button>
                      </div>
                      <div className="relative flex items-center">
                        <span className="absolute left-3.5 text-rose-600">
                          <Lock size={18} />
                        </span>
                        <input
                          id="signin-password-input-v2"
                          type={showSignInPassword ? 'text' : 'password'}
                          value={signInPassword}
                          onChange={(e) => setSignInPassword(e.target.value)}
                          placeholder="••••••••"
                          required
                          className="w-full pl-11 pr-11 py-3 login-input-glow text-slate-900 placeholder-slate-400 text-sm rounded-2xl font-medium"
                        />
                        <button
                          type="button"
                          onClick={() => setShowSignInPassword(!showSignInPassword)}
                          className="absolute right-3.5 text-slate-400 hover:text-slate-700 p-1"
                        >
                          {showSignInPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 pt-1">
                      <input
                        id="keep-active-v2"
                        type="checkbox"
                        checked={keepSessionActive}
                        onChange={(e) => setKeepSessionActive(e.target.checked)}
                        className="w-4 h-4 rounded text-rose-600 bg-white border-slate-300 focus:ring-rose-500 cursor-pointer"
                      />
                      <label
                        htmlFor="keep-active-v2"
                        className="text-xs text-slate-700 cursor-pointer select-none font-medium"
                      >
                        Keep student session authenticated on this browser
                      </label>
                    </div>

                    <button
                      id="signin-btn-v2"
                      type="submit"
                      disabled={signInLoading}
                      className="w-full py-4 px-4 rounded-2xl btn-pu-gradient text-white font-black text-sm active:scale-[0.99] transition-all flex items-center justify-center gap-2 mt-3 group shadow-xl cursor-pointer"
                    >
                      {/* Animated Shimmer sweep */}
                      <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-light-sweep pointer-events-none" />

                      {signInLoading ? (
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>Sign In to Student Portal</span>
                          <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
                        </>
                      )}
                    </button>
                  </form>

                  <div className="text-center pt-4 mt-2 border-t border-slate-100">
                    <span className="text-xs text-slate-600">New Parul University student? </span>
                    <button
                      type="button"
                      onClick={() => setAuthMode('create_account')}
                      className="text-xs font-bold text-rose-700 hover:text-rose-800 hover:underline"
                    >
                      Create and Verify Account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= FOOTER SECURITY BADGE ================= */}
        <div className="pt-4 pb-2 text-center space-y-1.5 text-slate-500 text-[11px] border-t border-slate-200">
          <p className="flex items-center justify-center gap-1.5 text-slate-600 font-medium">
            <ShieldCheck size={13} className="text-emerald-600" />
            Parul University Official Grievance Redressal System
          </p>
          <p>Limda Campus, Waghodiya, Vadodara, Gujarat 391760</p>
        </div>
      </main>

      {/* Forgot Password Reset Modal with OTP on Mobile or Gmail ID */}
      <ForgotPasswordModal
        isOpen={isForgotPasswordOpen}
        onClose={() => setIsForgotPasswordOpen(false)}
        initialIdentifier={signInIdentifier}
        onResetSuccess={(student, newPassword, autoLogin) => {
          setIsForgotPasswordOpen(false);
          if (autoLogin) {
            // Auto login directly
            localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(student));
            onLoginSuccess('Student', {
              name: student.name,
              enrollmentNo: student.enrollmentNo,
              email: student.email,
              phone: student.phone,
              program: student.department,
              role: 'Student',
            });
          } else {
            // Fill credentials and switch to sign in
            setAuthMode('signin');
            setSignInIdentifier(student.enrollmentNo);
            setSignInPassword(newPassword);
            setSignInError('');
            setResetSuccessBanner(
              `Password reset successfully for ${student.name}! Your credentials have been auto-filled. Please click "Sign In to Student Portal" below.`
            );
          }
        }}
      />
    </div>
  );
};
