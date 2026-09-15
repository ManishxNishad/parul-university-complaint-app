import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  Home,
  MapPin,
  FileText,
  MessageSquare,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Building,
  UserCheck,
  Flame,
  RotateCcw,
  PlayCircle,
  FileCheck,
  Upload,
  Camera,
  Plus,
  Trash2,
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
import { ComplaintItem } from '../types';
import { StatusBar } from './StatusBar';
import { useTheme } from '../theme';
import { getStoredComplaints, updateComplaint } from '../data/complaintsStore';
import { compressImageFile } from '../utils/imageUtils';

interface ComplaintDetailsScreenProps {
  complaint: ComplaintItem;
  onBack: () => void;
}

export const ComplaintDetailsScreen: React.FC<ComplaintDetailsScreenProps> = ({
  complaint: initialComplaint,
  onBack,
}) => {
  const { theme } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [complaint, setComplaint] = useState<ComplaintItem>(initialComplaint);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);

  // Sync with initialComplaint prop
  useEffect(() => {
    setComplaint(initialComplaint);
  }, [initialComplaint]);

  // Sync with localStorage if staff makes live updates
  useEffect(() => {
    const handleUpdate = () => {
      const all = getStoredComplaints();
      const updated = all.find((c) => c.id === initialComplaint.id);
      if (updated) {
        setComplaint(updated);
      }
    };

    window.addEventListener('pu_complaints_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('pu_complaints_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [initialComplaint.id]);

  // Function to add photo from device to an existing complaint
  const handleAddPhotoFromDevice = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setIsUploadingPhoto(true);
      const currentImages = complaint.images || [];
      if (currentImages.length >= 6) {
        setUploadMessage('Maximum photos reached for this grievance.');
        setTimeout(() => setUploadMessage(null), 3000);
        return;
      }

      const file = files[0];
      const compressed = await compressImageFile(file);
      const updatedImages = [...currentImages, compressed.dataUrl];

      // Update storage and timeline
      const now = new Date();
      const timestamp = `${now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}, ${now.toLocaleTimeString(
        'en-US',
        { hour: '2-digit', minute: '2-digit', hour12: true }
      )}`;

      const currentTimeline = complaint.timeline ? [...complaint.timeline] : [];
      currentTimeline.push({
        id: `tl-${Date.now()}`,
        title: 'Additional Evidence Attached',
        timestamp,
        description: `Student attached photo proof (${file.name}) from device.`,
        status: 'completed',
      });

      const updated = updateComplaint(complaint.id, {
        images: updatedImages,
        attachment: complaint.attachment || compressed.dataUrl,
        timeline: currentTimeline,
      });

      if (updated) {
        setComplaint(updated);
        setUploadMessage('Photo added from device successfully!');
        setTimeout(() => setUploadMessage(null), 3500);
      }
    } catch (err: any) {
      setUploadMessage(err.message || 'Could not upload photo.');
      setTimeout(() => setUploadMessage(null), 3500);
    } finally {
      setIsUploadingPhoto(false);
      e.target.value = '';
    }
  };

  // 4-Step Progress Tracker: Submitted -> Accepted -> In Progress -> Resolved
  const renderProgressTracker = (status: string) => {
    const steps = ['Submitted', 'Accepted', 'In Progress', 'Resolved'];

    let currentStepIndex = 0;
    if (status === 'Accepted') currentStepIndex = 1;
    else if (status === 'In Progress') currentStepIndex = 2;
    else if (status === 'Resolved' || status === 'Closed') currentStepIndex = 3;
    else if (status === 'Escalated' || status === 'Reopened') currentStepIndex = 2;

    return (
      <div className="w-full py-3">
        <div className="flex items-center justify-between relative">
          <div className="absolute top-1/2 left-6 right-6 -translate-y-1/2 h-1 bg-slate-200 dark:bg-slate-800 -z-0 rounded-full">
            <div
              className="h-full bg-blue-600 dark:bg-blue-500 rounded-full transition-all duration-300"
              style={{
                width: `${(currentStepIndex / (steps.length - 1)) * 100}%`,
              }}
            />
          </div>

          {steps.map((stepName, idx) => {
            const isCompleted = idx <= currentStepIndex;
            const isCurrent = idx === currentStepIndex;

            return (
              <div key={stepName} className="flex flex-col items-center relative z-10">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isCompleted
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                  } ${isCurrent ? 'ring-4 ring-blue-400/30' : ''}`}
                >
                  {isCompleted ? <CheckCircle2 size={16} /> : idx + 1}
                </div>
                <span
                  className={`text-xs mt-1.5 font-medium ${
                    isCurrent
                      ? 'font-bold text-blue-600 dark:text-blue-400'
                      : isCompleted
                      ? 'text-slate-800 dark:text-slate-200'
                      : 'text-slate-400 dark:text-slate-500'
                  }`}
                >
                  {stepName}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div
      id="complaint-details-screen"
      className={`min-h-full flex flex-col transition-colors duration-300 ${theme.classes.screenBg}`}
    >
      {/* Header */}
      <div
        className="text-white pt-2 pb-4 px-4 sm:px-6 lg:px-8 shadow-sm transition-all duration-300"
        style={{
          background: `linear-gradient(135deg, ${theme.colors.headerFrom} 0%, ${theme.colors.headerVia} 60%, ${theme.colors.headerTo} 100%)`,
        }}
      >
        <StatusBar theme="light" />
        <div className="max-w-5xl mx-auto w-full flex items-center justify-between mt-2">
          <button
            id="details-back-btn"
            onClick={onBack}
            className="p-1.5 -ml-1 text-slate-200 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Go back"
          >
            <ChevronLeft size={24} />
          </button>
          <div className="text-center">
            <h1 className="text-base sm:text-lg font-bold text-white">Complaint Details</h1>
            <span className="text-[11px] font-mono text-white/80">#{complaint.id}</span>
          </div>
          <div className="w-8" />
        </div>
      </div>

      {/* Body Content */}
      <div className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 overflow-y-auto space-y-5">
        {/* Visual Progress Tracker Card */}
        <div
          className={`p-5 rounded-2xl border ${theme.classes.cardBg} ${theme.classes.cardBorder} shadow-xs space-y-2`}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Complaint Progress
            </h2>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                complaint.status === 'Resolved'
                  ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25'
                  : complaint.status === 'In Progress'
                  ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/25'
                  : complaint.status === 'Accepted'
                  ? 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/25'
                  : complaint.status === 'Escalated'
                  ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/25'
                  : 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/25'
              }`}
            >
              Status: {complaint.status}
            </span>
          </div>
          {renderProgressTracker(complaint.status)}
        </div>

        {/* Main Details & Timeline Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Complaint Details */}
          <div className="lg:col-span-7 space-y-5">
            <div
              className={`p-5 rounded-2xl border ${theme.classes.cardBg} ${theme.classes.cardBorder} shadow-xs space-y-4`}
            >
              {/* Header Row: Subject, ID & Category */}
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                    #{complaint.id}
                  </span>
                  <span className="text-xs text-slate-400">
                    Submitted on {complaint.date}
                    {complaint.time ? ` at ${complaint.time}` : ''}
                  </span>
                </div>
                <h3
                  className={`text-lg font-bold mt-1 ${
                    theme.isDark ? 'text-slate-100' : 'text-slate-900'
                  }`}
                >
                  {complaint.subject || complaint.title}
                </h3>
              </div>

              {/* Department & Location */}
              <div
                className={`border-t ${
                  theme.isDark ? 'border-slate-800' : 'border-slate-100'
                } pt-3.5 space-y-3 text-sm`}
              >
                {/* Category */}
                <div className="flex items-center gap-3">
                  <div style={{ color: theme.colors.primary }} className="shrink-0">
                    {complaint.category.includes('Campus') || complaint.category.includes('Wi-Fi') ? (
                      <Building2 size={18} />
                    ) : complaint.category.includes('Staff') || complaint.category.includes('academic') || complaint.category.includes('Academic') ? (
                      <GraduationCap size={18} />
                    ) : complaint.category.includes('Event') ? (
                      <CalendarDays size={18} />
                    ) : complaint.category.includes('Harassment') ? (
                      <AlertOctagon size={18} />
                    ) : complaint.category.includes('Library') ? (
                      <BookOpen size={18} />
                    ) : complaint.category.includes('Cafeteria') ? (
                      <Coffee size={18} />
                    ) : complaint.category.includes('Transport') ? (
                      <Bus size={18} />
                    ) : complaint.category.includes('Maintenance') ? (
                      <Wrench size={18} />
                    ) : complaint.category.includes('Security') ? (
                      <Shield size={18} />
                    ) : complaint.category.includes('Others') ? (
                      <MoreHorizontal size={18} />
                    ) : (
                      <Home size={18} />
                    )}
                  </div>
                  <span
                    className={`font-semibold ${
                      theme.isDark ? 'text-slate-200' : 'text-slate-800'
                    }`}
                  >
                    {complaint.category}
                  </span>
                </div>

                {/* Submitter Info */}
                <div className="flex items-center gap-3">
                  <div style={{ color: theme.colors.primary }} className="shrink-0">
                    <UserCheck size={18} />
                  </div>
                  <div className="text-xs sm:text-sm">
                    <span className="text-slate-400">Filed by: </span>
                    <span
                      className={`font-semibold ${
                        theme.isDark ? 'text-slate-200' : 'text-slate-800'
                      }`}
                    >
                      {complaint.studentName || 'University Student'}
                    </span>
                    {complaint.ugNumber && (
                      <span className="font-mono text-xs text-blue-500 ml-1.5 font-medium">
                        ({complaint.ugNumber})
                      </span>
                    )}
                  </div>
                </div>

                {/* Assigned Department / Staff */}
                <div className="flex items-center gap-3">
                  <div style={{ color: theme.colors.primary }} className="shrink-0">
                    <Building size={18} />
                  </div>
                  <div className="text-xs sm:text-sm">
                    <span className="text-slate-400">Handling Unit: </span>
                    <span
                      className={`font-semibold ${
                        theme.isDark ? 'text-slate-200' : 'text-slate-800'
                      }`}
                    >
                      {complaint.assignedDepartment || complaint.category}
                    </span>
                    {complaint.assignedStaff && complaint.assignedStaff !== 'Unassigned' && (
                      <span className="text-blue-500 font-medium ml-1">
                        • {complaint.assignedStaff}
                      </span>
                    )}
                  </div>
                </div>

                {/* Location */}
                {complaint.location && (
                  <div className="flex items-center gap-3">
                    <div style={{ color: theme.colors.primary }} className="shrink-0">
                      <MapPin size={18} />
                    </div>
                    <span
                      className={`font-medium ${
                        theme.isDark ? 'text-slate-200' : 'text-slate-800'
                      }`}
                    >
                      {complaint.location}
                    </span>
                  </div>
                )}

                {/* Description */}
                <div className="flex items-start gap-3 pt-1">
                  <div style={{ color: theme.colors.primary }} className="shrink-0 mt-0.5">
                    <MessageSquare size={18} />
                  </div>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {complaint.description}
                  </p>
                </div>
              </div>

              {/* Photos Thumbnails & Add Photo from Device */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">
                    Attached Evidence / Photos ({complaint.images?.length || 0})
                  </span>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingPhoto}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg border transition-all cursor-pointer shadow-2xs"
                    style={{
                      borderColor: `${theme.colors.primary}44`,
                      color: theme.colors.primary,
                      backgroundColor: theme.colors.accentBadge,
                    }}
                  >
                    {isUploadingPhoto ? (
                      <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Upload size={13} />
                    )}
                    <span>Add Photo from Device</span>
                  </button>
                </div>

                {/* Hidden input for details page upload */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  className="hidden"
                  onChange={handleAddPhotoFromDevice}
                />

                {uploadMessage && (
                  <div className="p-2 text-xs font-medium rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="shrink-0" />
                    <span>{uploadMessage}</span>
                  </div>
                )}

                {complaint.images && complaint.images.length > 0 ? (
                  <div className="flex items-center gap-3 overflow-x-auto py-1">
                    {complaint.images.map((imgUrl, idx) => (
                      <a
                        key={idx}
                        href={imgUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-24 h-20 rounded-xl overflow-hidden border border-slate-700/20 bg-slate-800/10 shrink-0 shadow-2xs block group relative"
                        title="Click to view full photo"
                      >
                        <img
                          src={imgUrl}
                          alt={`Photo ${idx + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute bottom-0 inset-x-0 bg-black/60 backdrop-blur-2xs text-white text-[9px] px-1 py-0.5 text-center truncate">
                          Photo {idx + 1}
                        </div>
                      </a>
                    ))}

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className={`w-24 h-20 rounded-xl border-2 border-dashed flex flex-col items-center justify-center transition-all shrink-0 cursor-pointer ${
                        theme.isDark
                          ? 'border-slate-700 text-slate-400 hover:border-blue-400 hover:text-blue-400 bg-slate-850'
                          : 'border-slate-300 text-slate-400 hover:border-blue-500 hover:text-blue-600 bg-slate-50'
                      }`}
                    >
                      <Plus size={18} />
                      <span className="text-[10px] font-semibold mt-1">Upload More</span>
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className={`p-4 rounded-xl border-2 border-dashed text-center cursor-pointer flex flex-col items-center justify-center transition-colors ${
                      theme.isDark
                        ? 'border-slate-700 hover:border-blue-500 bg-slate-800/40 text-slate-400'
                        : 'border-slate-300 hover:border-blue-500 bg-slate-50 text-slate-500'
                    }`}
                  >
                    <Camera size={20} className="mb-1 text-slate-400" />
                    <span className="text-xs font-medium">No photos attached yet</span>
                    <span className="text-[11px] font-bold text-blue-500 mt-0.5">
                      Tap to upload photo proof from device
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Official Staff Remarks Box */}
            {complaint.staffRemarks && (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  <MessageSquare size={14} /> Official Staff Remark
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 italic leading-relaxed">
                  &quot;{complaint.staffRemarks}&quot;
                </p>
              </div>
            )}

            {/* Resolution Box */}
            {complaint.resolution && (
              <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 size={16} /> Verified Grievance Resolution
                  </div>
                  {complaint.resolvedBy && (
                    <span className="text-[11px] font-medium text-emerald-700 dark:text-emerald-300">
                      Resolved by: {complaint.resolvedBy}
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                  {complaint.resolution}
                </p>

                {/* Root Cause & Preventative Measures if available */}
                {(complaint.rootCause || complaint.preventativeMeasures) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-emerald-500/20 text-xs">
                    {complaint.rootCause && (
                      <div className="p-3 rounded-xl bg-white/70 dark:bg-slate-800/60 border border-emerald-500/20">
                        <span className="font-bold text-slate-900 dark:text-slate-100 block mb-0.5 text-[11px] uppercase tracking-wider">
                          Root Cause
                        </span>
                        <p className="text-slate-600 dark:text-slate-300 text-xs">
                          {complaint.rootCause}
                        </p>
                      </div>
                    )}
                    {complaint.preventativeMeasures && (
                      <div className="p-3 rounded-xl bg-white/70 dark:bg-slate-800/60 border border-emerald-500/20">
                        <span className="font-bold text-slate-900 dark:text-slate-100 block mb-0.5 text-[11px] uppercase tracking-wider">
                          Preventative Safeguard
                        </span>
                        <p className="text-slate-600 dark:text-slate-300 text-xs">
                          {complaint.preventativeMeasures}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Detailed Resolution Steps Card if uploaded by staff */}
            {complaint.resolutionSteps && complaint.resolutionSteps.length > 0 && (
              <div
                className={`p-5 rounded-2xl border ${theme.classes.cardBg} ${theme.classes.cardBorder} shadow-xs space-y-3`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wrench size={16} className="text-blue-600 dark:text-blue-400" />
                    <h3
                      className={`text-sm font-bold ${
                        theme.isDark ? 'text-slate-100' : 'text-slate-900'
                      }`}
                    >
                      Resolution Steps Executed ({complaint.resolutionSteps.length})
                    </h3>
                  </div>
                  <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircle2 size={13} /> Verified by Staff
                  </span>
                </div>

                <div className="space-y-2 pt-1">
                  {complaint.resolutionSteps.map((step, idx) => (
                    <div
                      key={step.id || idx}
                      className={`p-3 rounded-xl border flex items-start gap-3 transition-colors ${
                        theme.isDark
                          ? 'bg-slate-800/40 border-slate-700/60'
                          : 'bg-slate-50 border-slate-200/80'
                      }`}
                    >
                      <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                        {step.stepNumber}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4
                            className={`text-xs font-bold ${
                              theme.isDark ? 'text-slate-200' : 'text-slate-800'
                            }`}
                          >
                            {step.title}
                          </h4>
                          <span className="text-[10px] text-slate-400 font-mono shrink-0">
                            {step.timestamp}
                          </span>
                        </div>
                        {step.description && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                            {step.description}
                          </p>
                        )}
                        {step.materialsUsed && step.materialsUsed.length > 0 && (
                          <div className="flex items-center gap-1.5 flex-wrap mt-2">
                            <span className="text-[10px] text-slate-400 font-semibold">Parts/Tools:</span>
                            {step.materialsUsed.map((mat, mIdx) => (
                              <span
                                key={mIdx}
                                className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
                              >
                                {mat}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Resolution Work Proof & Photos Card */}
            {complaint.resolutionAttachments && complaint.resolutionAttachments.length > 0 && (
              <div
                className={`p-5 rounded-2xl border ${theme.classes.cardBg} ${theme.classes.cardBorder} shadow-xs space-y-3`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileCheck size={16} className="text-emerald-600 dark:text-emerald-400" />
                    <h3
                      className={`text-sm font-bold ${
                        theme.isDark ? 'text-slate-100' : 'text-slate-900'
                      }`}
                    >
                      Resolution Proof & Work Evidence ({complaint.resolutionAttachments.length})
                    </h3>
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium">
                    University Audited
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
                  {complaint.resolutionAttachments.map((att) => (
                    <a
                      key={att.id}
                      href={att.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 block shadow-2xs"
                    >
                      <div className="h-28 overflow-hidden relative">
                        <img
                          src={att.url}
                          alt={att.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute top-1.5 left-1.5">
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-black/70 text-white backdrop-blur-2xs">
                            {att.type}
                          </span>
                        </div>
                      </div>
                      <div className="p-2 text-left">
                        <div
                          className={`text-xs font-semibold truncate ${
                            theme.isDark ? 'text-slate-200' : 'text-slate-800'
                          }`}
                        >
                          {att.caption || att.name}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5 flex items-center justify-between">
                          <span className="truncate">{att.uploadedBy || 'Staff'}</span>
                          <span>{att.uploadedAt?.split(',')[0]}</span>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Tracking Timeline */}
          <div className="lg:col-span-5">
            <div
              className={`p-5 rounded-2xl border ${theme.classes.cardBg} ${theme.classes.cardBorder} shadow-xs`}
            >
              <h3
                className={`text-base font-bold mb-4 ${
                  theme.isDark ? 'text-slate-100' : 'text-slate-900'
                }`}
              >
                Tracking & Timeline
              </h3>

              <div className="relative pl-6 space-y-6">
                <div
                  className={`absolute left-[11px] top-2 bottom-4 w-[2px] ${
                    theme.isDark ? 'bg-slate-800' : 'bg-slate-200'
                  }`}
                />

                {complaint.timeline &&
                  complaint.timeline.map((evt) => {
                    const isCompleted = evt.status === 'completed';
                    const isCurrent = evt.status === 'current';

                    return (
                      <div key={evt.id} className="relative">
                        <div
                          className={`absolute -left-6 top-0.5 w-3.5 h-3.5 rounded-full ring-4 ${
                            theme.isDark ? 'ring-slate-900' : 'ring-white'
                          } flex items-center justify-center`}
                          style={{
                            backgroundColor: isCompleted
                              ? theme.colors.primary
                              : isCurrent
                              ? '#f59e0b'
                              : '#94a3b8',
                          }}
                        />

                        <div>
                          <div className="flex items-center justify-between">
                            <h4
                              className={`text-xs font-bold leading-tight ${
                                isCompleted
                                  ? theme.isDark
                                    ? 'text-slate-100'
                                    : 'text-slate-900'
                                  : isCurrent
                                  ? 'text-amber-500'
                                  : 'text-slate-500'
                              }`}
                            >
                              {evt.title}
                            </h4>
                            <span className="text-[10px] text-slate-400 font-medium">
                              {evt.timestamp}
                            </span>
                          </div>

                          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                            {evt.description}
                          </p>

                          {evt.officer && (
                            <span
                              className="inline-block mt-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-md border"
                              style={{
                                backgroundColor: theme.colors.accentBadge,
                                color: theme.colors.accentText,
                                borderColor: `${theme.colors.primary}33`,
                              }}
                            >
                              👤 {evt.officer}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
