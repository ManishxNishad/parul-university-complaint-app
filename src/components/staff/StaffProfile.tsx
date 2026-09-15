import React, { useState } from 'react';
import {
  User,
  Mail,
  Building,
  Briefcase,
  IdCard,
  Phone,
  Edit3,
  CheckCircle2,
  ShieldCheck,
  Camera,
  X,
  Save,
} from 'lucide-react';
import { StaffAccount } from '../../types';
import { updateStaffProfile } from '../../data/complaintsStore';

interface StaffProfileProps {
  currentStaff: StaffAccount;
  onProfileUpdated: (updated: StaffAccount) => void;
}

export const StaffProfile: React.FC<StaffProfileProps> = ({
  currentStaff,
  onProfileUpdated,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentStaff.name);
  const [department, setDepartment] = useState(currentStaff.department);
  const [designation, setDesignation] = useState(currentStaff.designation);
  const [email, setEmail] = useState(currentStaff.email);
  const [phone, setPhone] = useState(currentStaff.phone);
  const [avatarUrl, setAvatarUrl] = useState(currentStaff.avatarUrl);
  const [saveNotification, setSaveNotification] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = updateStaffProfile({
      name,
      department,
      designation,
      email,
      phone,
      avatarUrl,
    });

    if (updated) {
      onProfileUpdated(updated);
      setIsEditing(false);
      setSaveNotification('Profile information updated successfully.');
      setTimeout(() => setSaveNotification(''), 3000);
    }
  };

  const sampleAvatars = [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
  ];

  return (
    <div id="staff-profile-view" className="max-w-4xl mx-auto space-y-6">
      {saveNotification && (
        <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>{saveNotification}</span>
        </div>
      )}

      {/* Main Profile Card */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        {/* Cover Header */}
        <div className="h-32 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 p-6 flex justify-end items-start">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white border border-white/30 backdrop-blur-xs">
            <ShieldCheck size={13} /> Official Staff Credentials
          </span>
        </div>

        {/* Profile Info Row */}
        <div className="px-6 pb-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 mb-6">
            <div className="flex items-end gap-4">
              {/* Photo placeholder */}
              <div className="relative group">
                <div className="w-28 h-28 rounded-2xl overflow-hidden ring-4 ring-white bg-slate-100 shadow-md">
                  <img
                    src={currentStaff.avatarUrl}
                    alt={currentStaff.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                  {currentStaff.name}
                </h1>
                <p className="text-xs sm:text-sm text-blue-600 font-semibold">
                  {currentStaff.designation}
                </p>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                  <span className="font-mono text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-medium">
                    ID: {currentStaff.staffId}
                  </span>
                  <span>•</span>
                  <span>{currentStaff.department}</span>
                </div>
              </div>
            </div>

            <button
              id="edit-staff-profile-btn"
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-2 transition-colors shrink-0"
            >
              <Edit3 size={15} />
              <span>Edit Profile</span>
            </button>
          </div>

          {/* Profile Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
            {/* Staff Name */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold flex items-center gap-1.5">
                <User size={13} className="text-blue-600" /> Full Staff Name
              </div>
              <div className="text-sm font-semibold text-slate-900 mt-1">
                {currentStaff.name}
              </div>
            </div>

            {/* Staff ID */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold flex items-center gap-1.5">
                <IdCard size={13} className="text-amber-600" /> Official Staff ID
              </div>
              <div className="text-sm font-mono font-bold text-amber-700 mt-1">
                {currentStaff.staffId}
              </div>
            </div>

            {/* Department */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold flex items-center gap-1.5">
                <Building size={13} className="text-emerald-600" /> Department / Faculty
              </div>
              <div className="text-sm font-semibold text-slate-800 mt-1">
                {currentStaff.department}
              </div>
            </div>

            {/* Designation */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold flex items-center gap-1.5">
                <Briefcase size={13} className="text-purple-600" /> Designation
              </div>
              <div className="text-sm font-semibold text-purple-700 mt-1">
                {currentStaff.designation}
              </div>
            </div>

            {/* Official Email */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold flex items-center gap-1.5">
                <Mail size={13} className="text-rose-600" /> Official Email
              </div>
              <div className="text-sm font-mono text-slate-800 mt-1 truncate">
                {currentStaff.email}
              </div>
            </div>

            {/* Contact Phone */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold flex items-center gap-1.5">
                <Phone size={13} className="text-cyan-600" /> University Extension / Phone
              </div>
              <div className="text-sm font-mono text-slate-800 mt-1">
                {currentStaff.phone || '+91 98250 11223'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* EDIT PROFILE MODAL */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Edit3 size={17} className="text-blue-600" /> Edit Staff Profile
              </h3>
              <button
                onClick={() => setIsEditing(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Staff Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Designation
                  </label>
                  <input
                    type="text"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Official Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Phone / Extension
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-blue-500"
                  />
                </div>
              </div>

              {/* Avatar Picker */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1.5">
                  Select Profile Avatar
                </label>
                <div className="flex items-center gap-3">
                  {sampleAvatars.map((url, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setAvatarUrl(url)}
                      className={`w-12 h-12 rounded-xl overflow-hidden border-2 transition-all ${
                        avatarUrl === url
                          ? 'border-blue-600 ring-2 ring-blue-500/40'
                          : 'border-slate-200 hover:border-slate-400 opacity-75 hover:opacity-100'
                      }`}
                    >
                      <img src={url} alt={`Avatar ${idx}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-1.5 shadow-xs"
                >
                  <Save size={14} /> Save Profile Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
