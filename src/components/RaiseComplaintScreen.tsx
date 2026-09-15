import React, { useState, useRef } from 'react';
import {
  ChevronLeft,
  Home,
  BookOpen,
  Coffee,
  Bus,
  Wrench,
  Shield,
  Plus,
  Trash2,
  MapPin,
  Camera,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Building2,
  GraduationCap,
  CalendarDays,
  AlertOctagon,
  MoreHorizontal,
} from 'lucide-react';
import { ComplaintCategory } from '../types';
import { StatusBar } from './StatusBar';
import { useTheme } from '../theme';
import { compressImageFile } from '../utils/imageUtils';

interface RaiseComplaintScreenProps {
  onBack: () => void;
  onProceedToReview: (complaintData: {
    category: ComplaintCategory;
    title: string;
    description: string;
    location: string;
    images: string[];
  }) => void;
  initialData?: {
    category: ComplaintCategory;
    title: string;
    description: string;
    location: string;
    images: string[];
  };
}

export const RaiseComplaintScreen: React.FC<RaiseComplaintScreenProps> = ({
  onBack,
  onProceedToReview,
  initialData,
}) => {
  const { theme } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [category, setCategory] = useState<ComplaintCategory>(
    initialData?.category || 'Hostel & Accommodation'
  );
  const [title, setTitle] = useState(
    initialData?.title || 'AC not working in Hostel Room'
  );
  const [description, setDescription] = useState(
    initialData?.description ||
      'The AC in my hostel room (H-2, Room 305) has not been working since 2 days. Please look into this as it is very hot.'
  );
  const [location, setLocation] = useState(
    initialData?.location || 'Hostel 2, Room 305'
  );
  const [images, setImages] = useState<string[]>(
    initialData?.images || [
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=400',
    ]
  );
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [uploadToast, setUploadToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const categories: { label: ComplaintCategory; icon: React.ReactNode }[] = [
    { label: 'Campus problem', icon: <Building2 size={15} /> },
    { label: 'Staff and academic problem', icon: <GraduationCap size={15} /> },
    { label: 'Events problem', icon: <CalendarDays size={15} /> },
    { label: 'Harassment', icon: <AlertOctagon size={15} /> },
    { label: 'Hostel & Accommodation', icon: <Home size={15} /> },
    { label: 'Academic & Classroom', icon: <BookOpen size={15} /> },
    { label: 'Cafeteria & Mess', icon: <Coffee size={15} /> },
    { label: 'Library Services', icon: <BookOpen size={15} /> },
    { label: 'Transport & Bus', icon: <Bus size={15} /> },
    { label: 'Maintenance & Electricity', icon: <Wrench size={15} /> },
    { label: 'Security & Safety', icon: <Shield size={15} /> },
    { label: 'Others', icon: <MoreHorizontal size={15} /> },
  ];

  const handleNext = () => {
    if (!title.trim() || !description.trim()) {
      setErrorMsg('Please fill in all mandatory fields (*)');
      return;
    }
    setErrorMsg('');

    if (currentStep === 1) {
      setCurrentStep(2);
    } else {
      onProceedToReview({
        category,
        title,
        description,
        location,
        images,
      });
    }
  };

  const handleProcessUploadedFiles = async (files: FileList | File[]) => {
    if (images.length >= 5) {
      setUploadToast({ type: 'error', message: 'Maximum 5 photos allowed per complaint.' });
      return;
    }

    const remainingSlots = 5 - images.length;
    const filesToProcess = Array.from(files).slice(0, remainingSlots);

    try {
      setIsProcessingFile(true);
      const newImageUrls: string[] = [];

      for (const file of filesToProcess) {
        if (!file.type.startsWith('image/')) {
          throw new Error(`"${file.name}" is not a valid image format. Please select JPG, PNG, or WEBP.`);
        }
        if (file.size > 20 * 1024 * 1024) {
          throw new Error(`"${file.name}" exceeds 20MB limit.`);
        }
        const compressed = await compressImageFile(file);
        newImageUrls.push(compressed.dataUrl);
      }

      setImages((prev) => [...prev, ...newImageUrls]);
      setUploadToast({
        type: 'success',
        message: `${filesToProcess.length} photo${filesToProcess.length > 1 ? 's' : ''} added from your device!`,
      });
      setTimeout(() => setUploadToast(null), 3500);
    } catch (err: any) {
      setUploadToast({
        type: 'error',
        message: err.message || 'Failed to upload photo from device.',
      });
      setTimeout(() => setUploadToast(null), 4000);
    } finally {
      setIsProcessingFile(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleProcessUploadedFiles(e.target.files);
    }
    e.target.value = '';
  };

  const handleAddSampleImage = () => {
    if (images.length >= 5) return;
    const sampleOptions = [
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=400',
    ];
    const newImg = sampleOptions[images.length % sampleOptions.length];
    setImages([...images, newImg]);
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setImages(images.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <div
      id="raise-complaint-screen"
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
            id="raise-back-btn"
            onClick={currentStep === 2 ? () => setCurrentStep(1) : onBack}
            className="p-1.5 -ml-1 text-slate-200 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Go back"
          >
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-base font-semibold text-white">Raise a Complaint</h1>
          <div className="w-8" />
        </div>
      </div>

      {/* Stepper Navigation */}
      <div
        className={`px-6 py-3 border-b shadow-2xs transition-colors ${theme.classes.cardBg} ${theme.classes.cardBorder}`}
      >
        <div className="flex items-center justify-between max-w-sm mx-auto">
          {/* Step 1: Details */}
          <div className="flex items-center gap-1.5">
            <div
              style={
                currentStep >= 1
                  ? { backgroundColor: theme.colors.primary, color: '#ffffff' }
                  : undefined
              }
              className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${
                currentStep < 1 ? 'bg-slate-700 text-slate-400' : ''
              }`}
            >
              1
            </div>
            <span
              style={
                currentStep === 1
                  ? { color: theme.colors.primary }
                  : undefined
              }
              className={`text-xs font-semibold ${
                currentStep !== 1
                  ? theme.isDark
                    ? 'text-slate-400'
                    : 'text-slate-500'
                  : ''
              }`}
            >
              Details
            </span>
          </div>

          <div
            style={
              currentStep >= 2
                ? { backgroundColor: theme.colors.primary }
                : undefined
            }
            className={`flex-1 h-[2px] mx-2 ${
              currentStep < 2
                ? theme.isDark
                  ? 'bg-slate-700'
                  : 'bg-slate-200'
                : ''
            }`}
          />

          {/* Step 2: Location */}
          <div className="flex items-center gap-1.5">
            <div
              style={
                currentStep >= 2
                  ? { backgroundColor: theme.colors.primary, color: '#ffffff' }
                  : undefined
              }
              className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${
                currentStep < 2
                  ? theme.isDark
                    ? 'bg-slate-750 text-slate-400'
                    : 'bg-slate-200 text-slate-500'
                  : ''
              }`}
            >
              2
            </div>
            <span
              style={
                currentStep === 2
                  ? { color: theme.colors.primary }
                  : undefined
              }
              className={`text-xs font-semibold ${
                currentStep !== 2
                  ? theme.isDark
                    ? 'text-slate-500'
                    : 'text-slate-400'
                  : ''
              }`}
            >
              Location
            </span>
          </div>

          <div
            className={`flex-1 h-[2px] mx-2 ${
              theme.isDark ? 'bg-slate-700' : 'bg-slate-200'
            }`}
          />

          {/* Step 3: Review */}
          <div className="flex items-center gap-1.5 opacity-60">
            <div
              className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${
                theme.isDark
                  ? 'bg-slate-750 text-slate-400'
                  : 'bg-slate-200 text-slate-500'
              }`}
            >
              3
            </div>
            <span
              className={`text-xs font-semibold ${
                theme.isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              Review
            </span>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 px-4 py-4 space-y-4 overflow-y-auto">
        {errorMsg && (
          <div className="p-3 bg-red-500/10 text-red-500 text-xs rounded-xl border border-red-500/20 font-medium">
            {errorMsg}
          </div>
        )}

        {currentStep === 1 ? (
          <>
            {/* Category Select */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="complaint-category-select"
                  className={`text-xs font-bold ${
                    theme.isDark ? 'text-slate-200' : 'text-slate-700'
                  }`}
                >
                  Select Category <span className="text-red-500">*</span>
                </label>
                <span className="text-[11px] font-medium text-slate-400">
                  {category}
                </span>
              </div>

              <div className="relative">
                <select
                  id="complaint-category-select"
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value as ComplaintCategory)
                  }
                  className={`w-full pl-3.5 pr-10 py-3 text-xs sm:text-sm rounded-xl border shadow-2xs appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold ${theme.classes.inputBg} ${theme.classes.inputBorder} ${
                    theme.isDark ? 'text-slate-100' : 'text-slate-800'
                  }`}
                >
                  {categories.map((cat) => (
                    <option
                      key={cat.label}
                      value={cat.label}
                      className={theme.isDark ? 'bg-slate-850 text-slate-100' : ''}
                    >
                      {cat.label}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  ▼
                </div>
              </div>

              {/* Quick Select Category Badges/Chips */}
              <div className="pt-1">
                <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">
                  Popular Categories:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {categories.map((cat) => {
                    const isSelected = category === cat.label;
                    return (
                      <button
                        key={cat.label}
                        type="button"
                        onClick={() => setCategory(cat.label)}
                        className={`px-2.5 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all border cursor-pointer ${
                          isSelected
                            ? 'shadow-xs font-bold'
                            : theme.isDark
                            ? 'border-slate-800 bg-slate-800/60 text-slate-300 hover:border-slate-700 hover:bg-slate-800'
                            : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:bg-white'
                        }`}
                        style={
                          isSelected
                            ? {
                                backgroundColor: theme.colors.accentBadge,
                                color: theme.colors.primary,
                                borderColor: `${theme.colors.primary}66`,
                              }
                            : undefined
                        }
                      >
                        <span className="shrink-0">{cat.icon}</span>
                        <span>{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Issue Title */}
            <div className="space-y-1.5">
              <label
                htmlFor="complaint-title-input"
                className={`text-xs font-bold ${
                  theme.isDark ? 'text-slate-200' : 'text-slate-700'
                }`}
              >
                Issue Title <span className="text-red-500">*</span>
              </label>
              <input
                id="complaint-title-input"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. AC not working in Hostel Room"
                className={`w-full px-3.5 py-3 text-xs sm:text-sm rounded-xl border shadow-2xs focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium placeholder-slate-400 ${theme.classes.inputBg} ${theme.classes.inputBorder} ${
                  theme.isDark ? 'text-slate-100' : 'text-slate-800'
                }`}
              />
            </div>

            {/* Describe Problem */}
            <div className="space-y-1.5">
              <label
                htmlFor="complaint-desc-input"
                className={`text-xs font-bold ${
                  theme.isDark ? 'text-slate-200' : 'text-slate-700'
                }`}
              >
                Describe the Problem <span className="text-red-500">*</span>
              </label>
              <textarea
                id="complaint-desc-input"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain the problem in detail so the department can address it quickly..."
                className={`w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border shadow-2xs focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium placeholder-slate-400 resize-none leading-relaxed ${theme.classes.inputBg} ${theme.classes.inputBorder} ${
                  theme.isDark ? 'text-slate-100' : 'text-slate-800'
                }`}
              />
            </div>

            {/* Upload Photos/Evidence from Device */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label
                  className={`text-xs font-bold flex items-center gap-1.5 ${
                    theme.isDark ? 'text-slate-200' : 'text-slate-700'
                  }`}
                >
                  <Camera size={14} style={{ color: theme.colors.primary }} />
                  <span>Attach Evidence / Photos</span>
                </label>
                <span className="text-[11px] font-semibold text-slate-400">
                  {images.length}/5 files attached
                </span>
              </div>

              {/* Hidden File Input for Device Photo Selection */}
              <input
                ref={fileInputRef}
                id="complaint-photo-device-input"
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
                multiple
                className="hidden"
                onChange={handleFileInputChange}
              />

              {/* Toast Feedback */}
              {uploadToast && (
                <div
                  className={`p-2.5 rounded-xl text-xs font-medium flex items-center gap-2 transition-all ${
                    uploadToast.type === 'success'
                      ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                      : 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                  }`}
                >
                  {uploadToast.type === 'success' ? (
                    <CheckCircle2 size={16} className="shrink-0 text-emerald-500" />
                  ) : (
                    <AlertCircle size={16} className="shrink-0 text-rose-500" />
                  )}
                  <span>{uploadToast.message}</span>
                </div>
              )}

              {/* Dropzone & Device Upload Trigger */}
              {images.length < 5 && (
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDraggingOver(true);
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    setIsDraggingOver(false);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDraggingOver(false);
                    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                      handleProcessUploadedFiles(e.dataTransfer.files);
                    }
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  className={`p-4 rounded-2xl border-2 border-dashed transition-all text-center cursor-pointer group flex flex-col items-center justify-center ${
                    isDraggingOver
                      ? 'border-blue-500 bg-blue-500/10 scale-[1.01]'
                      : theme.isDark
                      ? 'border-slate-700 hover:border-blue-500 bg-slate-800/60 hover:bg-slate-800'
                      : 'border-slate-300 hover:border-blue-500 bg-slate-50 hover:bg-blue-50/50'
                  }`}
                >
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center mb-2 shadow-xs group-hover:scale-110 transition-transform"
                    style={{
                      backgroundColor: theme.colors.accentBadge,
                      color: theme.colors.primary,
                    }}
                  >
                    {isProcessingFile ? (
                      <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Upload size={22} />
                    )}
                  </div>
                  <div className="space-y-0.5">
                    <p
                      className={`text-xs font-bold ${
                        theme.isDark ? 'text-slate-200' : 'text-slate-800'
                      }`}
                    >
                      Choose photo from device or drag & drop
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Supports JPG, PNG, WEBP from your phone camera or gallery (Max 20MB)
                    </p>
                  </div>

                  <div className="mt-2.5 flex items-center gap-2">
                    <span
                      className="text-[11px] font-bold px-3 py-1 rounded-full text-white shadow-2xs group-hover:opacity-90 transition-opacity"
                      style={{ backgroundColor: theme.colors.primary }}
                    >
                      Browse Device Photos
                    </span>
                    <span className="text-[10px] text-slate-400">or use sample</span>
                  </div>
                </div>
              )}

              {/* Thumbnails Row */}
              {images.length > 0 && (
                <div className="space-y-1 pt-1">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
                    <span>Attached Photos ({images.length})</span>
                    {images.length < 5 && (
                      <button
                        type="button"
                        onClick={handleAddSampleImage}
                        className="text-[11px] hover:underline font-semibold"
                        style={{ color: theme.colors.primary }}
                      >
                        + Add Demo Photo
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-3 overflow-x-auto py-1">
                    {images.map((imgUrl, idx) => (
                      <div
                        key={idx}
                        className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-700/30 shrink-0 group bg-slate-800 shadow-xs"
                      >
                        <img
                          src={imgUrl}
                          alt={`Upload ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-0 inset-x-0 bg-black/60 backdrop-blur-xs text-white text-[9px] px-1 py-0.5 truncate text-center">
                          {idx === 0 ? 'Photo_1.jpg' : `Evidence_${idx + 1}.jpg`}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full shadow-md opacity-85 hover:opacity-100 transition-opacity cursor-pointer"
                          title="Remove image"
                        >
                          <Trash2 size={11} />
                        </button>
                      </div>
                    ))}

                    {/* Quick Add Plus button */}
                    {images.length < 5 && (
                      <button
                        id="complaint-add-photo-btn"
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className={`w-20 h-20 rounded-xl border-2 border-dashed flex flex-col items-center justify-center transition-all shrink-0 cursor-pointer ${
                          theme.isDark
                            ? 'border-slate-700 text-slate-400 hover:border-blue-400 hover:text-blue-400 bg-slate-800/40'
                            : 'border-slate-300 text-slate-400 hover:border-blue-500 hover:text-blue-600 bg-white'
                        }`}
                        title="Upload photo from device"
                      >
                        <Plus size={20} />
                        <span className="text-[10px] font-semibold mt-1">From Device</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          /* Step 2: Location Screen */
          <div className="space-y-4 py-1">
            <div
              className={`p-3.5 rounded-2xl border flex items-start gap-3`}
              style={{
                backgroundColor: theme.colors.accentBadge,
                borderColor: theme.colors.cardBorder,
              }}
            >
              <MapPin
                size={20}
                style={{ color: theme.colors.primary }}
                className="shrink-0 mt-0.5"
              />
              <div>
                <h3
                  className="text-xs font-bold"
                  style={{ color: theme.colors.accentText }}
                >
                  Exact Campus Location
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Pinpointing the room or department helps maintenance teams reach and fix the issue promptly.
                </p>
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="complaint-location-input"
                className={`text-xs font-bold ${
                  theme.isDark ? 'text-slate-200' : 'text-slate-700'
                }`}
              >
                Hostel / Block / Room Number <span className="text-red-500">*</span>
              </label>
              <input
                id="complaint-location-input"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Hostel 2, Room 305"
                className={`w-full px-3.5 py-3 text-xs sm:text-sm rounded-xl border shadow-2xs focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium ${theme.classes.inputBg} ${theme.classes.inputBorder} ${
                  theme.isDark ? 'text-slate-100' : 'text-slate-800'
                }`}
              />
            </div>

            {/* Quick Suggestions Chips */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-400">
                Suggested Campus Locations:
              </span>
              <div className="flex flex-wrap gap-2 pt-1">
                {[
                  'Hostel 2, Room 305',
                  'Hostel 1, Ground Floor',
                  'Central Library, 2nd Floor',
                  'Main Food Court',
                  'Engg Block A, Lab 402',
                  'Medical College Auditorium',
                ].map((sug) => (
                  <button
                    key={sug}
                    type="button"
                    onClick={() => setLocation(sug)}
                    className={`text-[11px] px-3 py-1.5 rounded-lg border font-medium transition-colors ${
                      theme.isDark
                        ? 'bg-slate-800 border-slate-700 text-slate-200 hover:border-blue-400'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-blue-500'
                    }`}
                  >
                    {sug}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Button */}
      <div
        className={`p-4 border-t ${theme.classes.cardBg} ${theme.classes.cardBorder}`}
      >
        <button
          id="raise-next-btn"
          type="button"
          onClick={handleNext}
          style={{ backgroundColor: theme.colors.primary }}
          className="w-full py-3.5 text-white font-semibold rounded-xl shadow-md transition-all text-sm active:scale-[0.99]"
        >
          {currentStep === 1 ? 'Next' : 'Review Complaint'}
        </button>
      </div>
    </div>
  );
};
