import React, { useState } from 'react';
import {
  X,
  User,
  Building,
  Tag,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Send,
  MessageSquare,
  Flame,
  RotateCcw,
  UserPlus,
  PlayCircle,
  FileCheck,
  ExternalLink,
  MapPin,
  FileText,
  UploadCloud,
  Wrench,
} from 'lucide-react';
import { ComplaintRecord, PriorityLevel, StaffAccount } from '../../types';
import {
  acceptComplaint,
  addStaffRemarkToComplaint,
  assignStaffToComplaint,
  escalateComplaint,
  getStaffAccounts,
  reopenComplaint,
  resolveComplaint,
  setComplaintInProgress,
} from '../../data/complaintsStore';

interface StaffComplaintModalProps {
  complaint: ComplaintRecord;
  currentStaff: StaffAccount;
  onClose: () => void;
  onComplaintUpdated: (updated: ComplaintRecord) => void;
  onOpenResolutionUpload?: (complaintId: string) => void;
}

export const StaffComplaintModal: React.FC<StaffComplaintModalProps> = ({
  complaint,
  currentStaff,
  onClose,
  onComplaintUpdated,
  onOpenResolutionUpload,
}) => {
  // Action Dialog States
  const [activeAction, setActiveAction] = useState<
    'none' | 'assign' | 'remark' | 'resolve' | 'escalate' | 'reopen'
  >('none');

  // Input states for sub-actions
  const [selectedStaffToAssign, setSelectedStaffToAssign] = useState(currentStaff.name);
  const [remarkInput, setRemarkInput] = useState('');
  const [resolutionInput, setResolutionInput] = useState('');
  const [escalateReason, setEscalateReason] = useState('Requires Dean approval and administrative sanction.');
  const [reopenReason, setReopenReason] = useState('Student reported recurring issue or incomplete resolution.');

  const staffList = getStaffAccounts();

  // Handle Action Submissions
  const handleAccept = () => {
    const updated = acceptComplaint(complaint.id, currentStaff.name);
    if (updated) onComplaintUpdated(updated);
  };

  const handleSetInProgress = () => {
    const updated = setComplaintInProgress(complaint.id, currentStaff.name);
    if (updated) onComplaintUpdated(updated);
  };

  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStaffToAssign) return;
    const targetStaff = staffList.find((s) => s.name === selectedStaffToAssign);
    const updated = assignStaffToComplaint(
      complaint.id,
      selectedStaffToAssign,
      targetStaff?.department
    );
    if (updated) {
      onComplaintUpdated(updated);
      setActiveAction('none');
    }
  };

  const handleRemarkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!remarkInput.trim()) return;
    const updated = addStaffRemarkToComplaint(complaint.id, remarkInput.trim(), currentStaff.name);
    if (updated) {
      onComplaintUpdated(updated);
      setRemarkInput('');
      setActiveAction('none');
    }
  };

  const handleResolveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolutionInput.trim()) return;
    const updated = resolveComplaint(complaint.id, resolutionInput.trim(), currentStaff.name);
    if (updated) {
      onComplaintUpdated(updated);
      setActiveAction('none');
    }
  };

  const handleEscalateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!escalateReason.trim()) return;
    const updated = escalateComplaint(complaint.id, escalateReason.trim(), currentStaff.name);
    if (updated) {
      onComplaintUpdated(updated);
      setActiveAction('none');
    }
  };

  const handleReopenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reopenReason.trim()) return;
    const updated = reopenComplaint(complaint.id, reopenReason.trim(), currentStaff.name);
    if (updated) {
      onComplaintUpdated(updated);
      setActiveAction('none');
    }
  };

  const getPriorityBadge = (p: PriorityLevel) => {
    switch (p) {
      case 'Emergency':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-1">
            <Flame size={12} /> Emergency
          </span>
        );
      case 'High':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
            <AlertTriangle size={12} /> High Priority
          </span>
        );
      case 'Medium':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30">
            Medium Priority
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-500/20 text-slate-300 border border-slate-500/30">
            Low Priority
          </span>
        );
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Resolved':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
            <CheckCircle2 size={13} /> Resolved
          </span>
        );
      case 'In Progress':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1.5">
            <PlayCircle size={13} /> In Progress
          </span>
        );
      case 'Accepted':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5">
            <FileCheck size={13} /> Accepted
          </span>
        );
      case 'Escalated':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1.5">
            <Flame size={13} /> Escalated
          </span>
        );
      case 'Reopened':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1.5">
            <RotateCcw size={13} /> Reopened
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
            <Clock size={13} /> New (Submitted)
          </span>
        );
    }
  };

  return (
    <div
      id="staff-complaint-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
    >
      <div
        id="staff-complaint-modal-container"
        className="w-full max-w-4xl bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden flex flex-col my-auto max-h-[92vh]"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 bg-white border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 font-mono font-bold text-sm">
              PU
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-base sm:text-lg font-bold text-slate-900">
                  #{complaint.id}
                </span>
                {getStatusBadge(complaint.status)}
                {getPriorityBadge(complaint.priority)}
              </div>
              <div className="text-xs text-slate-500">
                Submitted on {complaint.date} {complaint.time ? `at ${complaint.time}` : ''}
              </div>
            </div>
          </div>

          <button
            id="close-staff-modal-btn"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-slate-800">
          {/* Top Quick Meta Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Student Name */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold flex items-center gap-1.5">
                <User size={12} className="text-blue-600" /> Student Name
              </div>
              <div className="text-sm font-semibold text-slate-900 mt-1">
                {complaint.studentName}
              </div>
            </div>

            {/* UG Number */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold flex items-center gap-1.5">
                <FileText size={12} className="text-amber-600" /> UG / Enrollment No
              </div>
              <div className="text-sm font-mono font-bold text-amber-700 mt-1">
                {complaint.ugNumber}
              </div>
            </div>

            {/* Department */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold flex items-center gap-1.5">
                <Building size={12} className="text-emerald-600" /> Department
              </div>
              <div className="text-sm font-semibold text-slate-800 mt-1 truncate">
                {complaint.department}
              </div>
            </div>

            {/* Assigned Staff */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold flex items-center gap-1.5">
                <UserPlus size={12} className="text-purple-600" /> Assigned Staff
              </div>
              <div className="text-sm font-semibold text-purple-700 mt-1 truncate">
                {complaint.assignedStaff || 'Unassigned'}
              </div>
            </div>
          </div>

          {/* Subject & Category Row */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                  {complaint.category}
                </span>
                {complaint.location && (
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <MapPin size={13} className="text-rose-600" />
                    {complaint.location}
                  </span>
                )}
              </div>
              <div className="text-xs text-slate-500">
                Assigned Wing: <span className="font-semibold text-slate-700">{complaint.assignedDepartment || complaint.category}</span>
              </div>
            </div>

            <div>
              <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1">
                Subject
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                {complaint.subject}
              </h2>
            </div>

            <div>
              <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1">
                Description
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-white p-3 rounded-lg border border-slate-200">
                {complaint.description}
              </p>
            </div>
          </div>

          {/* Attachments Section */}
          {(complaint.attachment || (complaint.images && complaint.images.length > 0)) && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
                Uploaded Attachments & Evidence
              </div>
              <div className="flex flex-wrap gap-3 pt-1">
                {(complaint.images && complaint.images.length > 0
                  ? complaint.images
                  : [complaint.attachment]
                )
                  .filter(Boolean)
                  .map((imgUrl, i) => (
                    <a
                      key={i}
                      href={imgUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative w-32 h-24 rounded-lg overflow-hidden border border-slate-300 bg-slate-100 block shadow-xs"
                    >
                      <img
                        src={imgUrl}
                        alt={`Attachment ${i + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold gap-1">
                        <ExternalLink size={14} /> Full View
                      </div>
                    </a>
                  ))}
              </div>
            </div>
          )}

          {/* Remarks & Resolution Notes Box */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Staff Remark */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
              <div className="text-xs uppercase tracking-wider text-amber-800 font-semibold flex items-center gap-1.5">
                <MessageSquare size={13} /> Official Staff Remarks
              </div>
              <div className="text-xs text-slate-700 bg-white p-3 rounded-lg border border-slate-200 min-h-[54px] flex items-center">
                {complaint.staffRemarks || 'No remark entered yet.'}
              </div>
            </div>

            {/* Resolution */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-xs uppercase tracking-wider text-emerald-700 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 size={13} /> Resolution Details
                </div>
                {onOpenResolutionUpload && (
                  <button
                    type="button"
                    onClick={() => onOpenResolutionUpload(complaint.id)}
                    className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                  >
                    <UploadCloud size={12} />
                    <span>Upload / Edit Steps & Proof</span>
                  </button>
                )}
              </div>
              <div className="text-xs text-slate-700 bg-white p-3 rounded-lg border border-slate-200 min-h-[54px] flex items-center">
                {complaint.resolution || 'Pending formal resolution.'}
              </div>

              {/* Extended Resolution Steps if available */}
              {complaint.resolutionSteps && complaint.resolutionSteps.length > 0 && (
                <div className="pt-2 border-t border-slate-200 space-y-2">
                  <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                    <Wrench size={12} className="text-blue-600" />
                    <span>Resolution Steps Executed ({complaint.resolutionSteps.length})</span>
                  </span>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {complaint.resolutionSteps.map((st, i) => (
                      <div
                        key={st.id || i}
                        className="p-2 rounded-lg bg-white border border-slate-200 text-xs flex items-start gap-2"
                      >
                        <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {st.stepNumber}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold text-slate-800 text-[11px] flex items-center justify-between">
                            <span>{st.title}</span>
                            <span className="text-[10px] text-slate-400 font-mono">{st.timestamp}</span>
                          </div>
                          {st.description && (
                            <p className="text-[11px] text-slate-600 mt-0.5">{st.description}</p>
                          )}
                          {st.materialsUsed && st.materialsUsed.length > 0 && (
                            <div className="text-[10px] text-slate-500 mt-0.5">
                              <em>Parts:</em> {st.materialsUsed.join(', ')}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Resolution Attachments if available */}
              {complaint.resolutionAttachments && complaint.resolutionAttachments.length > 0 && (
                <div className="pt-2 border-t border-slate-200 space-y-2">
                  <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                    <UploadCloud size={12} className="text-emerald-600" />
                    <span>Work Proof & Completion Attachments ({complaint.resolutionAttachments.length})</span>
                  </span>
                  <div className="flex items-center gap-2 overflow-x-auto py-1">
                    {complaint.resolutionAttachments.map((att) => (
                      <a
                        key={att.id}
                        href={att.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-20 h-16 rounded-lg overflow-hidden border border-slate-300 relative group shrink-0 shadow-2xs block"
                        title={att.caption || att.name}
                      >
                        <img
                          src={att.url}
                          alt={att.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-x-0 bottom-0 bg-black/60 text-white text-[8px] truncate px-1 py-0.5">
                          {att.name}
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Audit Timeline */}
          {complaint.timeline && complaint.timeline.length > 0 && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
                Action Log & Audit Trail
              </div>
              <div className="space-y-3 pl-2 border-l-2 border-slate-200">
                {complaint.timeline.map((item, idx) => (
                  <div key={idx} className="relative pl-4">
                    <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-blue-600 ring-4 ring-slate-100" />
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                      <span>{item.title}</span>
                      <span className="text-[11px] text-slate-500 font-normal">{item.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">{item.description}</p>
                    {item.officer && (
                      <span className="text-[10px] text-blue-600 font-mono font-medium">By: {item.officer}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ACTIVE SUB-ACTION FORMS */}
          {activeAction === 'assign' && (
            <form
              onSubmit={handleAssignSubmit}
              className="p-4 bg-blue-50/50 border border-blue-300 rounded-xl space-y-3 shadow-sm animate-fadeIn"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-blue-700 flex items-center gap-1.5">
                  <UserPlus size={14} /> Assign Staff Member
                </h4>
                <button
                  type="button"
                  onClick={() => setActiveAction('none')}
                  className="text-xs text-slate-500 hover:text-slate-700 font-medium"
                >
                  Cancel
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {staffList.map((s) => (
                  <label
                    key={s.staffId}
                    className={`p-2.5 rounded-lg border cursor-pointer flex items-center gap-3 transition-colors ${
                      selectedStaffToAssign === s.name
                        ? 'bg-blue-100/70 border-blue-500 text-blue-900'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="assignStaffRadio"
                      value={s.name}
                      checked={selectedStaffToAssign === s.name}
                      onChange={(e) => setSelectedStaffToAssign(e.target.value)}
                      className="accent-blue-600"
                    />
                    <div className="truncate text-xs">
                      <div className="font-semibold">{s.name}</div>
                      <div className="text-[10px] text-slate-500 truncate">{s.department}</div>
                    </div>
                  </label>
                ))}
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs"
                >
                  Confirm Assignment
                </button>
              </div>
            </form>
          )}

          {activeAction === 'remark' && (
            <form
              onSubmit={handleRemarkSubmit}
              className="p-4 bg-amber-50/60 border border-amber-300 rounded-xl space-y-3 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
                  <MessageSquare size={14} /> Add Staff Remark
                </h4>
                <button
                  type="button"
                  onClick={() => setActiveAction('none')}
                  className="text-xs text-slate-500 hover:text-slate-700 font-medium"
                >
                  Cancel
                </button>
              </div>
              <textarea
                value={remarkInput}
                onChange={(e) => setRemarkInput(e.target.value)}
                placeholder="Enter official remark/update that the student and administrative team will see..."
                rows={3}
                className="w-full p-2.5 rounded-lg bg-white border border-slate-300 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500"
                required
              />
              <div className="flex justify-end gap-2">
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-xs"
                >
                  Post Remark
                </button>
              </div>
            </form>
          )}

          {activeAction === 'resolve' && (
            <form
              onSubmit={handleResolveSubmit}
              className="p-4 bg-emerald-50/60 border border-emerald-300 rounded-xl space-y-3 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                  <CheckCircle2 size={14} /> Resolve Grievance
                </h4>
                <button
                  type="button"
                  onClick={() => setActiveAction('none')}
                  className="text-xs text-slate-500 hover:text-slate-700 font-medium"
                >
                  Cancel
                </button>
              </div>
              <textarea
                value={resolutionInput}
                onChange={(e) => setResolutionInput(e.target.value)}
                placeholder="Detail the technical/administrative actions completed to resolve this issue..."
                rows={3}
                className="w-full p-2.5 rounded-lg bg-white border border-slate-300 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                required
              />
              <div className="flex justify-end gap-2">
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5"
                >
                  <CheckCircle2 size={14} /> Mark as Resolved
                </button>
              </div>
            </form>
          )}

          {activeAction === 'escalate' && (
            <form
              onSubmit={handleEscalateSubmit}
              className="p-4 bg-rose-50/60 border border-rose-300 rounded-xl space-y-3 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-800 flex items-center gap-1.5">
                  <Flame size={14} /> Escalate to Higher Authority
                </h4>
                <button
                  type="button"
                  onClick={() => setActiveAction('none')}
                  className="text-xs text-slate-500 hover:text-slate-700 font-medium"
                >
                  Cancel
                </button>
              </div>
              <textarea
                value={escalateReason}
                onChange={(e) => setEscalateReason(e.target.value)}
                placeholder="Reason for escalation (e.g. Budgetary sanction needed, structural damage, policy decision)..."
                rows={3}
                className="w-full p-2.5 rounded-lg bg-white border border-slate-300 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-rose-500"
                required
              />
              <div className="flex justify-end gap-2">
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5"
                >
                  <Flame size={14} /> Escalate Complaint
                </button>
              </div>
            </form>
          )}

          {activeAction === 'reopen' && (
            <form
              onSubmit={handleReopenSubmit}
              className="p-4 bg-purple-50/60 border border-purple-300 rounded-xl space-y-3 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-purple-800 flex items-center gap-1.5">
                  <RotateCcw size={14} /> Reopen Grievance
                </h4>
                <button
                  type="button"
                  onClick={() => setActiveAction('none')}
                  className="text-xs text-slate-500 hover:text-slate-700 font-medium"
                >
                  Cancel
                </button>
              </div>
              <textarea
                value={reopenReason}
                onChange={(e) => setReopenReason(e.target.value)}
                placeholder="Specify reason for reopening this complaint..."
                rows={3}
                className="w-full p-2.5 rounded-lg bg-white border border-slate-300 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-purple-500"
                required
              />
              <div className="flex justify-end gap-2">
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5"
                >
                  <RotateCcw size={14} /> Reopen Complaint
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Modal Footer with Staff Action Buttons */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2.5">
          <div className="text-xs text-slate-500">
            Current Action by: <span className="text-slate-800 font-semibold">{currentStaff.name}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* [Accept] */}
            {complaint.status === 'Submitted' && (
              <button
                id="staff-action-accept-btn"
                onClick={handleAccept}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-cyan-600 hover:bg-cyan-700 text-white flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <FileCheck size={14} />
                <span>Accept</span>
              </button>
            )}

            {/* [Assign] */}
            <button
              id="staff-action-assign-btn"
              onClick={() => setActiveAction(activeAction === 'assign' ? 'none' : 'assign')}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <UserPlus size={14} className="text-purple-600" />
              <span>Assign</span>
            </button>

            {/* [In Progress] */}
            {complaint.status !== 'In Progress' && complaint.status !== 'Resolved' && (
              <button
                id="staff-action-in-progress-btn"
                onClick={handleSetInProgress}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <PlayCircle size={14} />
                <span>In Progress</span>
              </button>
            )}

            {/* [Add Remark] */}
            <button
              id="staff-action-remark-btn"
              onClick={() => setActiveAction(activeAction === 'remark' ? 'none' : 'remark')}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <MessageSquare size={14} className="text-amber-600" />
              <span>Add Remark</span>
            </button>

            {/* [Upload Steps & Work Proof] */}
            {onOpenResolutionUpload && (
              <button
                id="staff-action-upload-steps-btn"
                onClick={() => onOpenResolutionUpload(complaint.id)}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <UploadCloud size={14} className="text-emerald-600" />
                <span>Upload Steps & Proof</span>
              </button>
            )}

            {/* [Resolve] */}
            {complaint.status !== 'Resolved' && (
              <button
                id="staff-action-resolve-btn"
                onClick={() => setActiveAction(activeAction === 'resolve' ? 'none' : 'resolve')}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <CheckCircle2 size={14} />
                <span>Resolve</span>
              </button>
            )}

            {/* [Escalate] */}
            {complaint.status !== 'Escalated' && complaint.status !== 'Resolved' && (
              <button
                id="staff-action-escalate-btn"
                onClick={() => setActiveAction(activeAction === 'escalate' ? 'none' : 'escalate')}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <Flame size={14} />
                <span>Escalate</span>
              </button>
            )}

            {/* [Reopen] */}
            {(complaint.status === 'Resolved' || complaint.status === 'Closed') && (
              <button
                id="staff-action-reopen-btn"
                onClick={() => setActiveAction(activeAction === 'reopen' ? 'none' : 'reopen')}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <RotateCcw size={14} />
                <span>Reopen</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
