import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronLeft,
  Settings,
  User,
  FileText,
  Bell,
  Lock,
  HelpCircle,
  LogOut,
  ChevronRight,
  Camera,
  Edit2,
  Check,
  Palette,
  Upload,
  Image as ImageIcon,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  RefreshCw,
  KeyRound,
} from 'lucide-react';
import { ScreenType, UserProfile } from '../types';
import { StatusBar } from './StatusBar';
import { useTheme } from '../theme';
import { ChangePasswordModal } from './ChangePasswordModal';

const DEFAULT_AVATAR =
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250';

/**
 * Compresses an image client-side to a square avatar and returns a JPEG data URL
 */
const compressProfileImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Selected file is not an image.'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_DIM = 400;
        const width = img.width;
        const height = img.height;

        // Crop to square aspect ratio from center
        const minDim = Math.min(width, height);
        const startX = (width - minDim) / 2;
        const startY = (height - minDim) / 2;

        canvas.width = MAX_DIM;
        canvas.height = MAX_DIM;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        ctx.drawImage(img, startX, startY, minDim, minDim, 0, 0, MAX_DIM, MAX_DIM);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error('Failed to load image for processing.'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read image file from device.'));
    reader.readAsDataURL(file);
  });
};

interface ProfileScreenProps {
  user: UserProfile;
  onBack: () => void;
  onNavigate: (screen: ScreenType) => void;
  onLogout: () => void;
  onUpdateUser: (updated: Partial<UserProfile>) => void;
  onOpenThemeSelector?: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  user,
  onBack,
  onNavigate,
  onLogout,
  onUpdateUser,
  onOpenThemeSelector,
}) => {
  const { theme } = useTheme();
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [name, setName] = useState(user.name);

  useEffect(() => {
    setName(user.name);
  }, [user.name]);

  // Photo upload from device state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalFileInputRef = useRef<HTMLInputElement>(null);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [selectedPhotoPreview, setSelectedPhotoPreview] = useState<string | null>(null);
  const [photoFileName, setPhotoFileName] = useState<string>('');
  const [isProcessingPhoto, setIsProcessingPhoto] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [photoToast, setPhotoToast] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  const isCustomPhoto = Boolean(user.avatarUrl && user.avatarUrl !== DEFAULT_AVATAR);

  // Auto-hide toast notification
  useEffect(() => {
    if (photoToast) {
      const timer = setTimeout(() => setPhotoToast(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [photoToast]);

  const handleSaveProfile = () => {
    onUpdateUser({ name });
    setIsEditingPersonal(false);
  };

  // Process image file selected from device
  const handleFileProcess = async (file: File) => {
    try {
      setIsProcessingPhoto(true);
      if (!file.type.startsWith('image/')) {
        throw new Error('Please select a valid image file (JPG, PNG, WEBP, or GIF).');
      }

      if (file.size > 15 * 1024 * 1024) {
        throw new Error('Image size is too large. Please select a photo under 15MB.');
      }

      const compressed = await compressProfileImage(file);
      setSelectedPhotoPreview(compressed);
      setPhotoFileName(file.name);
      setIsPhotoModalOpen(true);
    } catch (err: any) {
      setPhotoToast({
        type: 'error',
        message: err.message || 'Could not process selected image. Please try again.',
      });
    } finally {
      setIsProcessingPhoto(false);
    }
  };

  const handleNativeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
    // reset input so same file can be re-selected if needed
    e.target.value = '';
  };

  const handleSavePhoto = () => {
    if (!selectedPhotoPreview) return;
    onUpdateUser({ avatarUrl: selectedPhotoPreview });
    setIsPhotoModalOpen(false);
    setSelectedPhotoPreview(null);
    setPhotoFileName('');
    setPhotoToast({
      type: 'success',
      message: 'Profile photo updated successfully from your device!',
    });
  };

  const handleResetToDefaultPhoto = () => {
    onUpdateUser({ avatarUrl: DEFAULT_AVATAR });
    setIsPhotoModalOpen(false);
    setSelectedPhotoPreview(null);
    setPhotoFileName('');
    setPhotoToast({
      type: 'success',
      message: 'Profile photo reset to default.',
    });
  };

  return (
    <div
      id="profile-screen"
      className={`min-h-full flex flex-col transition-colors duration-300 ${theme.classes.screenBg}`}
    >
      {/* Hidden File Input for Native Device Photo Picker */}
      <input
        ref={fileInputRef}
        id="device-photo-input-direct"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleNativeInputChange}
      />

      {/* Floating Status Notification Toast */}
      {photoToast && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-2xl shadow-xl border flex items-center gap-2.5 text-xs font-semibold animate-in slide-in-from-top-3 duration-200 ${
            photoToast.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-rose-50 border-rose-200 text-rose-900'
          }`}
        >
          {photoToast.type === 'success' ? (
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle size={16} className="text-rose-600 shrink-0" />
          )}
          <span>{photoToast.message}</span>
        </div>
      )}

      {/* Header */}
      <div
        className="text-white pt-2 pb-4 px-4 sm:px-6 lg:px-8 shadow-sm transition-all duration-300"
        style={{
          background: `linear-gradient(135deg, ${theme.colors.headerFrom} 0%, ${theme.colors.headerVia} 60%, ${theme.colors.headerTo} 100%)`,
        }}
      >
        <StatusBar theme="light" />
        <div className="max-w-4xl mx-auto w-full flex items-center justify-between mt-2">
          <button
            id="profile-back-btn"
            onClick={onBack}
            className="p-1.5 -ml-1 text-slate-200 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Go back"
          >
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-base sm:text-lg font-semibold text-white">My Profile</h1>
          <button
            id="profile-settings-btn"
            onClick={() => onNavigate('university')}
            className="p-1.5 -mr-1 text-slate-200 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Settings"
          >
            <Settings size={20} />
          </button>
        </div>
      </div>

      {/* Main Content Body */}
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 overflow-y-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* User Card (Left column on desktop) */}
          <div className="lg:col-span-5">
            <div
              className={`p-6 rounded-2xl border ${theme.classes.cardBg} ${theme.classes.cardBorder} shadow-xs flex flex-col items-center text-center`}
            >
              {/* Avatar with Camera Overlay & Edit Badge */}
              <div className="relative mb-3 group">
                <div
                  className="w-24 h-24 rounded-full overflow-hidden ring-4 shadow-md relative cursor-pointer"
                  style={{ ringColor: `${theme.colors.secondary}40` }}
                  onClick={() => fileInputRef.current?.click()}
                  title="Click to add photo from device"
                >
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {/* Subtle hover overlay prompt */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity text-[10px] font-bold">
                    <Camera size={18} className="mb-0.5" />
                    <span>Upload</span>
                  </div>
                </div>

                {/* Camera upload badge button on bottom right */}
                <button
                  id="profile-avatar-camera-btn"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 w-8 h-8 rounded-full text-white flex items-center justify-center ring-2 ring-white shadow-md transition-transform hover:scale-110 active:scale-95 cursor-pointer"
                  style={{ backgroundColor: theme.colors.primary }}
                  title="Add photo from device"
                  aria-label="Add photo from device"
                >
                  <Camera size={14} />
                </button>
              </div>

              {/* Quick Action Button to Add Photo from Device */}
              <div className="flex items-center gap-1.5 mb-3">
                <button
                  id="profile-add-photo-device-btn"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all hover:opacity-90 active:scale-95 shadow-2xs cursor-pointer"
                  style={{
                    backgroundColor: theme.colors.accentBadge,
                    color: theme.colors.accentText,
                    borderColor: `${theme.colors.primary}33`,
                  }}
                  title="Choose image from your phone or computer"
                >
                  <Camera size={13} />
                  <span>Add Photo from Device</span>
                </button>

                {isCustomPhoto && (
                  <button
                    onClick={handleResetToDefaultPhoto}
                    className="p-1.5 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                    title="Reset to default avatar"
                    aria-label="Reset photo"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>

              <h2
                className={`text-xl font-bold tracking-tight ${
                  theme.isDark ? 'text-slate-100' : 'text-slate-900'
                }`}
              >
                {user.name}
              </h2>
              <p className="text-xs text-slate-400 font-medium mt-1">
                Enrollment No: <span className="font-mono">{user.enrollmentNo}</span>
              </p>
              <p className="text-xs text-slate-400 font-medium mt-0.5">{user.program}</p>
              <p
                className="text-xs font-semibold mt-1.5 px-3 py-0.5 rounded-full border"
                style={{
                  color: theme.colors.primary,
                  borderColor: `${theme.colors.primary}33`,
                  backgroundColor: theme.colors.accentBadge,
                }}
              >
                {user.university}
              </p>

              <div className="w-full mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 text-left space-y-2 text-xs">
                <div className="flex justify-between items-center text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <span>Mobile:</span>
                    <span className="inline-flex items-center gap-0.5 text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                      <Lock size={10} />
                      Verified
                    </span>
                  </span>
                  <span className="font-semibold text-slate-700 dark:text-slate-200">{user.phone}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Email:</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-200 truncate max-w-[180px]">{user.email}</span>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    id="profile-card-change-password-btn"
                    onClick={() => setIsChangePasswordOpen(true)}
                    className="w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer border hover:opacity-90 active:scale-98"
                    style={{
                      color: theme.colors.primary,
                      borderColor: `${theme.colors.primary}33`,
                      backgroundColor: theme.colors.accentBadge,
                    }}
                  >
                    <KeyRound size={13} />
                    <span>Change Password via OTP</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Menu Options List (Right column on desktop) */}
          <div className="lg:col-span-7">
            <div
              className={`rounded-2xl border ${theme.classes.cardBg} ${theme.classes.cardBorder} shadow-xs divide-y ${
                theme.isDark ? 'divide-slate-800' : 'divide-slate-100'
              } overflow-hidden`}
            >
              {/* Option 1: Profile Photo - Add from Device */}
              <button
                id="profile-photo-menu-btn"
                onClick={() => setIsPhotoModalOpen(true)}
                className={`w-full px-5 py-4 flex items-center justify-between transition-colors ${
                  theme.isDark ? 'hover:bg-slate-800/60' : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div style={{ color: theme.colors.primary }}>
                    <Camera size={19} />
                  </div>
                  <div className="text-left">
                    <span
                      className={`text-sm font-semibold block leading-snug ${
                        theme.isDark ? 'text-slate-200' : 'text-slate-800'
                      }`}
                    >
                      Profile Photo
                    </span>
                    <span className="text-xs text-slate-400">
                      Add or change photo from your device (gallery / files)
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold border flex items-center gap-1.5 shadow-2xs"
                    style={{
                      backgroundColor: theme.colors.accentBadge,
                      color: theme.colors.accentText,
                      borderColor: `${theme.colors.primary}33`,
                    }}
                  >
                    <Upload size={12} />
                    <span>Upload</span>
                  </span>
                  <ChevronRight size={18} className="text-slate-400" />
                </div>
              </button>

              {/* Option 2: Personal Information */}
              <button
                id="profile-personal-info-btn"
                onClick={() => setIsEditingPersonal(true)}
                className={`w-full px-5 py-4 flex items-center justify-between transition-colors ${
                  theme.isDark ? 'hover:bg-slate-800/60' : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div style={{ color: theme.colors.primary }}>
                    <User size={19} />
                  </div>
                  <span
                    className={`text-sm font-semibold ${
                      theme.isDark ? 'text-slate-200' : 'text-slate-800'
                    }`}
                  >
                    Personal Information
                  </span>
                </div>
                <ChevronRight size={18} className="text-slate-400" />
              </button>

              {/* Theme & Appearance Option */}
              {onOpenThemeSelector && (
                <button
                  id="profile-theme-btn"
                  onClick={onOpenThemeSelector}
                  className={`w-full px-5 py-4 flex items-center justify-between transition-colors ${
                    theme.isDark ? 'hover:bg-slate-800/60' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div style={{ color: theme.colors.primary }}>
                      <Palette size={19} />
                    </div>
                    <div className="text-left">
                      <span
                        className={`text-sm font-semibold block leading-snug ${
                          theme.isDark ? 'text-slate-200' : 'text-slate-800'
                        }`}
                      >
                        Theme & Appearance
                      </span>
                      <span className="text-xs text-slate-400">
                        Choose from 15 themes, display modes & accessibility
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className="px-2.5 py-0.5 rounded-full text-xs font-semibold border"
                      style={{
                        backgroundColor: theme.colors.accentBadge,
                        color: theme.colors.accentText,
                        borderColor: `${theme.colors.primary}33`,
                      }}
                    >
                      {theme.name}
                    </span>
                    <ChevronRight size={18} className="text-slate-400" />
                  </div>
                </button>
              )}

              {/* My Complaints */}
              <button
                id="profile-complaints-btn"
                onClick={() => onNavigate('complaints')}
                className={`w-full px-5 py-4 flex items-center justify-between transition-colors ${
                  theme.isDark ? 'hover:bg-slate-800/60' : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div style={{ color: theme.colors.primary }}>
                    <FileText size={19} />
                  </div>
                  <span
                    className={`text-sm font-semibold ${
                      theme.isDark ? 'text-slate-200' : 'text-slate-800'
                    }`}
                  >
                    Campus Complaints (All)
                  </span>
                </div>
                <ChevronRight size={18} className="text-slate-400" />
              </button>

              {/* Notifications */}
              <button
                id="profile-notifications-btn"
                onClick={() => onNavigate('alerts')}
                className={`w-full px-5 py-4 flex items-center justify-between transition-colors ${
                  theme.isDark ? 'hover:bg-slate-800/60' : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div style={{ color: theme.colors.primary }}>
                    <Bell size={19} />
                  </div>
                  <span
                    className={`text-sm font-semibold ${
                      theme.isDark ? 'text-slate-200' : 'text-slate-800'
                    }`}
                  >
                    Notifications
                  </span>
                </div>
                <ChevronRight size={18} className="text-slate-400" />
              </button>

              {/* Change Password via Mobile / Gmail OTP */}
              <button
                id="profile-change-password-btn"
                onClick={() => setIsChangePasswordOpen(true)}
                className={`w-full px-5 py-4 flex items-center justify-between transition-colors cursor-pointer ${
                  theme.isDark ? 'hover:bg-slate-800/60' : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div style={{ color: theme.colors.primary }}>
                    <Lock size={19} />
                  </div>
                  <div className="text-left">
                    <span
                      className={`text-sm font-semibold block ${
                        theme.isDark ? 'text-slate-200' : 'text-slate-800'
                      }`}
                    >
                      Change Password
                    </span>
                    <span className="text-[11px] text-slate-400 block">
                      Verify identity using Mobile or Gmail OTP
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                    OTP Protected
                  </span>
                  <ChevronRight size={18} className="text-slate-400" />
                </div>
              </button>

              {/* Help & Support */}
              <button
                id="profile-help-support-btn"
                onClick={() => onNavigate('support')}
                className={`w-full px-5 py-4 flex items-center justify-between transition-colors ${
                  theme.isDark ? 'hover:bg-slate-800/60' : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div style={{ color: theme.colors.primary }}>
                    <HelpCircle size={19} />
                  </div>
                  <span
                    className={`text-sm font-semibold ${
                      theme.isDark ? 'text-slate-200' : 'text-slate-800'
                    }`}
                  >
                    Help & Support
                  </span>
                </div>
                <ChevronRight size={18} className="text-slate-400" />
              </button>

              {/* Logout */}
              <button
                id="profile-logout-btn"
                onClick={onLogout}
                className="w-full px-5 py-4 flex items-center justify-between hover:bg-rose-50/50 dark:hover:bg-rose-950/20 transition-colors"
              >
                <div className="flex items-center gap-3.5">
                  <div className="text-rose-600">
                    <LogOut size={19} />
                  </div>
                  <span className="text-sm font-semibold text-rose-600">
                    Logout
                  </span>
                </div>
                <ChevronRight size={18} className="text-rose-400" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ================= MODAL: ADD PHOTO FROM DEVICE ================= */}
      {isPhotoModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-9 h-9 rounded-2xl flex items-center justify-center text-white"
                  style={{ backgroundColor: theme.colors.primary }}
                >
                  <Camera size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Add Photo from Device
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Update your official student profile photo
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsPhotoModalOpen(false);
                  setSelectedPhotoPreview(null);
                  setPhotoFileName('');
                }}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Hidden Input for Modal File Browser */}
            <input
              ref={modalFileInputRef}
              id="device-photo-modal-input"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleNativeInputChange}
            />

            {/* Avatar Preview Area */}
            <div className="py-5 flex flex-col items-center">
              <div className="relative mb-3">
                <div
                  className="w-28 h-28 rounded-full overflow-hidden ring-4 shadow-lg"
                  style={{ ringColor: theme.colors.primary }}
                >
                  <img
                    src={selectedPhotoPreview || user.avatarUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                {selectedPhotoPreview && (
                  <span className="absolute bottom-1 right-1 bg-emerald-500 text-white p-1 rounded-full shadow-xs ring-2 ring-white">
                    <Check size={14} />
                  </span>
                )}
              </div>

              {selectedPhotoPreview ? (
                <div className="text-center">
                  <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 justify-center">
                    <CheckCircle2 size={13} /> Ready to save
                  </p>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5 truncate max-w-[240px]">
                    {photoFileName || 'device_image.jpg'}
                  </p>
                </div>
              ) : (
                <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                  Current Profile Photo
                </p>
              )}

              {/* Drag & Drop Upload Zone */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDraggingOver(true);
                }}
                onDragLeave={() => setIsDraggingOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDraggingOver(false);
                  const file = e.dataTransfer.files?.[0];
                  if (file) handleFileProcess(file);
                }}
                onClick={() => modalFileInputRef.current?.click()}
                className={`w-full mt-4 p-5 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                  isDraggingOver
                    ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20'
                    : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800/80'
                }`}
              >
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center mb-2"
                  style={{
                    backgroundColor: theme.colors.accentBadge,
                    color: theme.colors.primary,
                  }}
                >
                  <Upload size={20} />
                </div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Click to browse or drop photo from device
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Supports JPG, PNG, WEBP, or GIF (max 15MB)
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              {selectedPhotoPreview ? (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPhotoPreview(null);
                      setPhotoFileName('');
                    }}
                    className="flex-1 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSavePhoto}
                    className="flex-1 py-2.5 text-white rounded-xl text-xs font-bold shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                    style={{ backgroundColor: theme.colors.primary }}
                  >
                    <Check size={14} />
                    <span>Save Photo</span>
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => modalFileInputRef.current?.click()}
                    className="w-full py-3 text-white rounded-xl text-xs font-bold shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                    style={{ backgroundColor: theme.colors.primary }}
                  >
                    <Upload size={15} />
                    <span>Choose Photo from Device</span>
                  </button>

                  {isCustomPhoto && (
                    <button
                      type="button"
                      onClick={handleResetToDefaultPhoto}
                      className="w-full py-2.5 text-slate-500 hover:text-rose-600 dark:text-slate-400 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Trash2 size={13} />
                      <span>Reset to Default Avatar</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Personal Info Modal */}
      {isEditingPersonal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className={`w-full max-w-sm rounded-2xl p-5 shadow-2xl border animate-in zoom-in-95 ${
              theme.classes.cardBg
            } ${theme.classes.cardBorder}`}
          >
            <div className="flex items-center justify-between mb-3.5 pb-2.5 border-b border-slate-100 dark:border-slate-800">
              <h3
                className={`text-base font-bold ${
                  theme.isDark ? 'text-slate-100' : 'text-slate-900'
                }`}
              >
                Edit Student Details
              </h3>
              <button
                onClick={() => setIsEditingPersonal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label
                  className={`font-semibold block mb-1 ${
                    theme.isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}
                >
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full p-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium ${
                    theme.classes.inputBg
                  } ${theme.classes.inputBorder} ${
                    theme.isDark ? 'text-slate-100' : 'text-slate-800'
                  }`}
                />
              </div>

              {/* Phone Number - Locked & Non-editable */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label
                    className={`font-semibold flex items-center gap-1.5 ${
                      theme.isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}
                  >
                    <span>Registered Phone Number</span>
                  </label>
                  <span className="text-[10px] text-amber-700 dark:text-amber-300 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                    <Lock size={10} />
                    Locked
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    disabled
                    readOnly
                    value={user.phone}
                    className="w-full p-2.5 pr-8 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 dark:text-slate-400 font-mono text-xs cursor-not-allowed select-none"
                  />
                  <div className="absolute right-3 top-2.5 text-slate-400">
                    <Lock size={14} />
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 dark:text-slate-400 mt-1 leading-normal">
                  Phone numbers are linked to the university database and cannot be modified in the portal.
                </p>
              </div>

              {/* Hostel & Room - Non-editable */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label
                    className={`font-semibold ${
                      theme.isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}
                  >
                    Hostel & Room
                  </label>
                  <span className="text-[10px] text-slate-400 font-medium">Institutional Record</span>
                </div>
                <input
                  type="text"
                  disabled
                  readOnly
                  value={`${user.hostelBlock}, ${user.roomNo}`}
                  className="w-full p-2.5 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 dark:text-slate-400 text-xs cursor-not-allowed select-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-2.5 mt-5 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsEditingPersonal(false)}
                className="flex-1 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveProfile}
                className="flex-1 py-2.5 text-white rounded-xl text-xs font-bold shadow-md transition-all active:scale-95 cursor-pointer"
                style={{ backgroundColor: theme.colors.primary }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Password via Mobile/Gmail OTP Modal */}
      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
        userPhone={user.phone}
        userEmail={user.email}
        userName={user.name}
        enrollmentNo={user.enrollmentNo}
        onSuccess={(msg) => {
          setPhotoToast({
            type: 'success',
            message: msg || 'Master password changed successfully via OTP verification.',
          });
        }}
      />
    </div>
  );
};
