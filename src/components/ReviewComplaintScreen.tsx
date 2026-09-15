import React, { useState } from 'react';
import {
  ChevronLeft,
  Home,
  MapPin,
  FileText,
  Copy,
  Check,
  CheckCircle2,
  Building2,
  GraduationCap,
  CalendarDays,
  AlertOctagon,
  MoreHorizontal,
  BookOpen,
  Coffee,
  Bus,
  Wrench,
  Shield,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ComplaintCategory, ScreenType } from '../types';
import { StatusBar } from './StatusBar';
import { useTheme } from '../theme';

interface ReviewComplaintScreenProps {
  data: {
    category: ComplaintCategory;
    title: string;
    description: string;
    location: string;
    images: string[];
  };
  onBack: () => void;
  onEdit: () => void;
  onSubmitSuccess: (newComplaintId: string) => void;
  onNavigate: (screen: ScreenType) => void;
}

export const ReviewComplaintScreen: React.FC<ReviewComplaintScreenProps> = ({
  data,
  onBack,
  onEdit,
  onSubmitSuccess,
  onNavigate,
}) => {
  const { theme } = useTheme();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [complaintId, setComplaintId] = useState('PUC20260912');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    setIsSubmitting(true);
    // Generate authentic ID or keep PUC20260912 to match the picture
    const generatedId = 'PUC20260912';
    setComplaintId(generatedId);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);

      // Trigger celebratory confetti like in the picture
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.4 },
          colors: ['#22c55e', '#3b82f6', '#f59e0b', '#a855f7'],
        });
      } catch {
        // Fallback gracefully
      }

      onSubmitSuccess(generatedId);
    }, 400);
  };

  const handleCopyId = () => {
    navigator.clipboard?.writeText(`#${complaintId}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // SUCCESS SCREEN (matches Screen 5 in the picture: Complaint Submitted!)
  if (isSubmitted) {
    return (
      <div
        id="complaint-submitted-screen"
        className={`min-h-full flex flex-col justify-between p-6 transition-colors duration-300 ${theme.classes.screenBg}`}
      >
        <StatusBar theme={theme.isDark ? 'light' : 'dark'} />

        <div className="my-auto flex flex-col items-center text-center max-w-xs mx-auto py-6">
          {/* Green Checkmark Circle with Confetti Sparkles */}
          <div className="relative mb-6">
            <div className="w-24 h-24 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xl shadow-emerald-500/25">
              <Check size={48} strokeWidth={3.5} />
            </div>

            {/* Decorative confetti dots around */}
            <span className="absolute -top-2 left-2 w-3 h-3 rounded-full bg-blue-400" />
            <span className="absolute -top-1 right-0 w-2 h-2 rounded-full bg-amber-400" />
            <span className="absolute bottom-1 -left-3 w-2.5 h-2.5 rounded-full bg-rose-400" />
            <span className="absolute bottom-2 -right-2 w-3 h-3 rounded-full bg-teal-400" />
          </div>

          <h2
            className={`text-2xl font-bold tracking-tight ${
              theme.isDark ? 'text-slate-100' : 'text-slate-900'
            }`}
          >
            Complaint Submitted!
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
            Your complaint has been successfully submitted.
          </p>

          {/* Complaint ID Card */}
          <div
            className={`w-full rounded-2xl p-4 mt-6 border ${theme.classes.cardBg} ${theme.classes.cardBorder}`}
          >
            <span className="text-[11px] font-medium text-slate-400">
              Complaint ID
            </span>
            <div className="flex items-center justify-center gap-2 mt-1">
              <span
                className={`text-lg font-bold font-mono ${
                  theme.isDark ? 'text-slate-100' : 'text-slate-800'
                }`}
              >
                #{complaintId}
              </span>
              <button
                id="copy-complaint-id-btn"
                type="button"
                onClick={handleCopyId}
                className="p-1 text-slate-400 hover:text-blue-500 transition-colors"
                title="Copy Complaint ID"
              >
                {copied ? (
                  <CheckCircle2 size={18} className="text-emerald-500" />
                ) : (
                  <Copy size={18} />
                )}
              </button>
            </div>
          </div>

          <p className="text-xs text-slate-400 mt-5">
            You can track the status from &apos;My Complaints&apos; section.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-4">
          <button
            id="submitted-track-status-btn"
            type="button"
            onClick={() => onNavigate('details')}
            style={{ backgroundColor: theme.colors.primary }}
            className="w-full py-3.5 text-white font-semibold rounded-xl text-sm shadow-md transition-all active:scale-[0.99]"
          >
            Track Status
          </button>
          <button
            id="submitted-submit-another-btn"
            type="button"
            onClick={() => {
              setIsSubmitted(false);
              onNavigate('raise');
            }}
            className={`w-full py-3 font-semibold rounded-xl text-sm transition-colors border ${
              theme.isDark
                ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            Submit Another
          </button>
        </div>
      </div>
    );
  }

  // REVIEW SCREEN (matches Screen 4 in the picture)
  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Campus problem':
      case 'Campus Wi-Fi & IT':
        return <Building2 size={18} />;
      case 'Staff and academic problem':
        return <GraduationCap size={18} />;
      case 'Events problem':
        return <CalendarDays size={18} />;
      case 'Harassment':
        return <AlertOctagon size={18} />;
      case 'Academic & Classroom':
      case 'Library Services':
        return <BookOpen size={18} />;
      case 'Cafeteria & Mess':
        return <Coffee size={18} />;
      case 'Transport & Bus':
        return <Bus size={18} />;
      case 'Maintenance & Electricity':
        return <Wrench size={18} />;
      case 'Security & Safety':
        return <Shield size={18} />;
      case 'Others':
        return <MoreHorizontal size={18} />;
      default:
        return <Home size={18} />;
    }
  };

  return (
    <div
      id="review-complaint-screen"
      className={`min-h-full flex flex-col transition-colors duration-300 ${theme.classes.screenBg}`}
    >
      {/* Header */}
      <div
        className="text-white pt-2 pb-4 px-4 shadow-sm transition-all duration-300"
        style={{
          background: `linear-gradient(135deg, ${theme.colors.headerFrom} 0%, ${theme.colors.headerVia} 60%, ${theme.colors.headerTo} 100%)`,
        }}
      >
        <StatusBar theme="light" />
        <div className="flex items-center justify-between mt-2">
          <button
            id="review-back-btn"
            onClick={onBack}
            className="p-1.5 -ml-1 text-slate-200 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Go back"
          >
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-base font-semibold text-white">Review Complaint</h1>
          <div className="w-8" />
        </div>
      </div>

      {/* Main Review Body */}
      <div className="flex-1 px-4 py-4 space-y-4 overflow-y-auto">
        {/* Category Card */}
        <div className="space-y-1.5">
          <span className="text-xs font-medium text-slate-400">Category</span>
          <div
            className={`p-3.5 rounded-2xl border ${theme.classes.cardBg} ${theme.classes.cardBorder} shadow-2xs flex items-center gap-3`}
          >
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
              style={{
                backgroundColor: theme.colors.accentBadge,
                color: theme.colors.accentText,
              }}
            >
              {getCategoryIcon(data.category)}
            </div>
            <span
              className={`text-sm font-semibold ${
                theme.isDark ? 'text-slate-100' : 'text-slate-800'
              }`}
            >
              {data.category}
            </span>
          </div>
        </div>

        {/* Title */}
        <div className="space-y-1.5">
          <span className="text-xs font-medium text-slate-400">Title</span>
          <div
            className={`p-3.5 rounded-2xl border ${theme.classes.cardBg} ${theme.classes.cardBorder} shadow-2xs`}
          >
            <h3
              className={`text-sm font-semibold leading-snug ${
                theme.isDark ? 'text-slate-100' : 'text-slate-900'
              }`}
            >
              {data.title}
            </h3>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <span className="text-xs font-medium text-slate-400">Description</span>
          <div
            className={`p-3.5 rounded-2xl border ${theme.classes.cardBg} ${theme.classes.cardBorder} shadow-2xs`}
          >
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              {data.description}
            </p>
          </div>
        </div>

        {/* Location */}
        <div className="space-y-1.5">
          <span className="text-xs font-medium text-slate-400">Location</span>
          <div
            className={`p-3.5 rounded-2xl border ${theme.classes.cardBg} ${theme.classes.cardBorder} shadow-2xs flex items-center gap-2.5`}
          >
            <MapPin
              size={18}
              style={{ color: theme.colors.primary }}
              className="shrink-0"
            />
            <span
              className={`text-xs sm:text-sm font-semibold ${
                theme.isDark ? 'text-slate-200' : 'text-slate-800'
              }`}
            >
              {data.location}
            </span>
          </div>
        </div>

        {/* Attachments */}
        <div className="space-y-1.5">
          <span className="text-xs font-medium text-slate-400">
            Attachments ({data.images.length})
          </span>
          <div className="flex items-center gap-3 overflow-x-auto py-1">
            {data.images.map((imgUrl, idx) => (
              <div
                key={idx}
                className="relative w-24 h-20 rounded-xl overflow-hidden border border-slate-700/20 bg-slate-850 shrink-0"
              >
                <img
                  src={imgUrl}
                  alt={`Attachment ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[10px] px-1 py-0.5 text-center truncate">
                  {idx === 0 ? 'AC.jpg' : idx === 1 ? 'Room.jpg' : `Img_${idx + 1}.jpg`}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons: Edit & Submit */}
      <div
        className={`p-4 border-t flex items-center gap-3 ${theme.classes.cardBg} ${theme.classes.cardBorder}`}
      >
        <button
          id="review-edit-btn"
          type="button"
          onClick={onEdit}
          className={`flex-1 py-3 border font-semibold rounded-xl text-sm transition-colors ${
            theme.isDark
              ? 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-750'
              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
          }`}
        >
          Edit
        </button>

        <button
          id="review-submit-btn"
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          style={{ backgroundColor: theme.colors.primary }}
          className="flex-1 py-3 text-white font-semibold rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
        >
          {isSubmitting ? (
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            'Submit Complaint'
          )}
        </button>
      </div>
    </div>
  );
};
