import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  CheckCircle2,
  Clock,
  Plus,
  Trash2,
  FileText,
  AlertTriangle,
  Flame,
  User,
  Building,
  MapPin,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  FileCheck,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Eye,
  X,
  Calendar,
  Layers,
  Wrench,
  Tag,
  DollarSign,
  Download,
  Printer,
  ExternalLink,
  Search,
  Check,
} from 'lucide-react';
import {
  ComplaintRecord,
  PriorityLevel,
  ResolutionProofAttachment,
  ResolutionStep,
  StaffAccount,
} from '../../types';
import {
  getStoredComplaints,
  saveResolutionActionReport,
  ResolutionReportPayload,
} from '../../data/complaintsStore';
import { compressImageFile } from '../../utils/imageUtils';

interface StaffResolutionUploadProps {
  complaints: ComplaintRecord[];
  currentStaff: StaffAccount;
  initialComplaintId?: string | null;
  onComplaintUpdated: (updated: ComplaintRecord) => void;
  onNavigateToTab?: (tab: any) => void;
}

// Preset step templates to save staff time
const PRESET_TEMPLATES: Record<
  string,
  {
    label: string;
    rootCause: string;
    resolutionSummary: string;
    preventativeMeasures: string;
    steps: Omit<ResolutionStep, 'id'>[];
  }
> = {
  maintenance: {
    label: 'Hostel & Facility Maintenance',
    rootCause: 'Normal wear-and-tear and accumulated debris in mechanical drainage/cooling component.',
    resolutionSummary:
      'Completed physical inspection, dismantled malfunctioning section, cleared obstruction, replaced worn fittings, and verified steady operation for 60 minutes.',
    preventativeMeasures:
      'Scheduled for bi-monthly preventative HVAC and plumbing servicing under university facility schedule.',
    steps: [
      {
        stepNumber: 1,
        title: 'Site Inspection & Root-Cause Diagnosis',
        description: 'Conducted visual and mechanical inspection on-site. Identified leakage origin and component malfunction.',
        status: 'completed',
        timestamp: 'Day 1 - 10:30 AM',
        durationMinutes: 40,
        materialsUsed: ['Multimeter', 'Pressure Gauge', 'Inspection Torch'],
      },
      {
        stepNumber: 2,
        title: 'Parts Requisition & Safety Isolation',
        description: 'Isolated power mains and requisitioned replacement components from central estate inventory.',
        status: 'completed',
        timestamp: 'Day 1 - 02:00 PM',
        durationMinutes: 30,
        materialsUsed: ['Replacement PVC Coupling', 'Industrial Sealant Tape'],
      },
      {
        stepNumber: 3,
        title: 'Component Replacement & Re-fitting',
        description: 'Installed new piping and fittings, flushed drainage line, and tightened structural mountings.',
        status: 'completed',
        timestamp: 'Day 2 - 11:15 AM',
        durationMinutes: 60,
        materialsUsed: ['PVC Pipe Section (1m)', 'Mounting Brackets'],
      },
      {
        stepNumber: 4,
        title: 'Operational Load Testing & Student Sign-off',
        description: 'Tested continuous operation under load for 45 minutes with zero leaks and optimal thermal output.',
        status: 'completed',
        timestamp: 'Day 2 - 03:00 PM',
        durationMinutes: 45,
      },
    ],
  },
  it_network: {
    label: 'Campus Wi-Fi & IT Systems',
    rootCause: 'PoE power surge caused captive portal authentication crash and intermittent packet loss on access switch.',
    resolutionSummary:
      'Replaced damaged access point hardware, flashed stable release firmware, refreshed DHCP pool, and confirmed 85+ Mbps throughput.',
    preventativeMeasures:
      'Installed inline surge suppressors and added SNMP automated bandwidth alerts in network operations center (NOC).',
    steps: [
      {
        stepNumber: 1,
        title: 'Spectrum & Packet Loss Diagnostic',
        description: 'Conducted RF analysis and ping sweep across subnet. Identified 65% packet drop at local AP switchport.',
        status: 'completed',
        timestamp: 'Day 1 - 11:00 AM',
        durationMinutes: 30,
        materialsUsed: ['Fluke Network Tester', 'Console Cable'],
      },
      {
        stepNumber: 2,
        title: 'Hardware Swap & Cabling Termination',
        description: 'Swapped faulty unit with new Cisco Enterprise Access Point and re-crimped Cat6 RJ45 patch cable.',
        status: 'completed',
        timestamp: 'Day 1 - 01:30 PM',
        durationMinutes: 45,
        materialsUsed: ['Cisco Enterprise AP', 'Cat6 Patch Cable 3m', 'Shielded RJ45 Jacks'],
      },
      {
        stepNumber: 3,
        title: 'VLAN & Gateway Config Verification',
        description: 'Re-provisioned DHCP scope, cleared ARP table cache, and verified SSL certificate trust chain.',
        status: 'completed',
        timestamp: 'Day 1 - 03:15 PM',
        durationMinutes: 25,
      },
      {
        stepNumber: 4,
        title: 'Student Wi-Fi Speed & Roaming Audit',
        description: 'Verified seamless roaming and recorded average download speeds of 88 Mbps across connected devices.',
        status: 'completed',
        timestamp: 'Day 1 - 04:30 PM',
        durationMinutes: 20,
      },
    ],
  },
  academic: {
    label: 'Academic & Timetable Affairs',
    rootCause: 'Overlapping elective enrollment clash between faculty lab schedules in revised semester curriculum.',
    resolutionSummary:
      'Convened academic coordinator and HOD meeting, reallocated lab slot to alternate afternoon block, and updated student ERP portal.',
    preventativeMeasures:
      'Implemented automated conflict detection script in the course scheduling portal before term publishing.',
    steps: [
      {
        stepNumber: 1,
        title: 'Student Grievance & Timetable Verification',
        description: 'Retrieved student academic course enrollment records and verified conflicting time slots in ERP.',
        status: 'completed',
        timestamp: 'Day 1 - 09:30 AM',
        durationMinutes: 30,
      },
      {
        stepNumber: 2,
        title: 'HOD & Faculty Coordination Meeting',
        description: 'Coordinated with department course coordinators to identify vacant computer lab slots.',
        status: 'completed',
        timestamp: 'Day 1 - 02:00 PM',
        durationMinutes: 45,
      },
      {
        stepNumber: 3,
        title: 'Master ERP Schedule Update',
        description: 'Updated university academic database with approved revised timetable schedule.',
        status: 'completed',
        timestamp: 'Day 2 - 10:00 AM',
        durationMinutes: 20,
      },
      {
        stepNumber: 4,
        title: 'Student Notification Circular Dispatched',
        description: 'Issued official email notification and updated student attendance portal accordingly.',
        status: 'completed',
        timestamp: 'Day 2 - 11:30 AM',
        durationMinutes: 15,
      },
    ],
  },
};

export const StaffResolutionUpload: React.FC<StaffResolutionUploadProps> = ({
  complaints,
  currentStaff,
  initialComplaintId,
  onComplaintUpdated,
  onNavigateToTab,
}) => {
  // Select which complaint to work on
  const [selectedId, setSelectedId] = useState<string>(() => {
    if (initialComplaintId && complaints.some((c) => c.id === initialComplaintId)) {
      return initialComplaintId;
    }
    // Prefer in progress or high priority first
    const inProgress = complaints.find((c) => c.status === 'In Progress');
    if (inProgress) return inProgress.id;
    const submitted = complaints.find((c) => c.status === 'Submitted' || c.status === 'Accepted');
    if (submitted) return submitted.id;
    return complaints[0]?.id || '';
  });

  const [complaintSearch, setComplaintSearch] = useState('');
  const [isComplaintPickerOpen, setIsComplaintPickerOpen] = useState(false);

  // Active complaint object
  const activeComplaint = complaints.find((c) => c.id === selectedId) || complaints[0];

  // Resolution Form States
  const [steps, setSteps] = useState<ResolutionStep[]>([]);
  const [attachments, setAttachments] = useState<ResolutionProofAttachment[]>([]);
  const [resolutionSummary, setResolutionSummary] = useState('');
  const [rootCause, setRootCause] = useState('');
  const [preventativeMeasures, setPreventativeMeasures] = useState('');
  const [costIncurred, setCostIncurred] = useState('');
  const [newMaterialInput, setNewMaterialInput] = useState<{ [stepIndex: number]: string }>({});

  // UI state
  const [isUploading, setIsUploading] = useState(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [previewImageModal, setPreviewImageModal] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // When selected complaint changes, populate existing resolution data or defaults
  useEffect(() => {
    if (!activeComplaint) return;

    if (activeComplaint.resolutionSteps && activeComplaint.resolutionSteps.length > 0) {
      setSteps(activeComplaint.resolutionSteps);
    } else {
      // Create initial starter step
      const now = new Date();
      const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
      const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

      setSteps([
        {
          id: `step-${Date.now()}-1`,
          stepNumber: 1,
          title: 'Initial On-site Assessment & Inspection',
          description: `Examined reported issue at ${activeComplaint.location || 'designated site'}. Confirmed student complaint details.`,
          performedBy: currentStaff.name,
          timestamp: `${dateStr}, ${timeStr}`,
          status: 'completed',
          durationMinutes: 30,
          materialsUsed: [],
        },
      ]);
    }

    if (activeComplaint.resolutionAttachments && activeComplaint.resolutionAttachments.length > 0) {
      setAttachments(activeComplaint.resolutionAttachments);
    } else {
      setAttachments([]);
    }

    setResolutionSummary(
      activeComplaint.resolutionSummary ||
        activeComplaint.resolution ||
        `Problem inspected and corrective measures executed by ${currentStaff.name}. Tested for compliance and safe operation.`
    );
    setRootCause(activeComplaint.rootCause || '');
    setPreventativeMeasures(activeComplaint.preventativeMeasures || '');
    setCostIncurred(activeComplaint.costIncurred || '');
    setSaveSuccessMessage(null);
    setErrorMessage(null);
  }, [activeComplaint?.id]);

  // Handler: Apply template
  const handleApplyTemplate = (templateKey: string) => {
    const template = PRESET_TEMPLATES[templateKey];
    if (!template) return;

    const populatedSteps: ResolutionStep[] = template.steps.map((s, idx) => ({
      ...s,
      id: `step-${Date.now()}-${idx + 1}`,
      performedBy: s.performedBy || currentStaff.name,
    }));

    setSteps(populatedSteps);
    setRootCause(template.rootCause);
    setResolutionSummary(template.resolutionSummary);
    setPreventativeMeasures(template.preventativeMeasures);
    setSaveSuccessMessage(`Applied "${template.label}" steps template! You can customize any step below.`);
    setTimeout(() => setSaveSuccessMessage(null), 4000);
  };

  // Add Step
  const handleAddStep = () => {
    const nextNum = steps.length + 1;
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    const newStep: ResolutionStep = {
      id: `step-${Date.now()}-${nextNum}`,
      stepNumber: nextNum,
      title: `Step ${nextNum}: Corrective Action & Verification`,
      description: '',
      performedBy: currentStaff.name,
      timestamp: `${dateStr}, ${timeStr}`,
      status: 'completed',
      durationMinutes: 30,
      materialsUsed: [],
    };

    setSteps([...steps, newStep]);
  };

  // Update step field
  const handleUpdateStep = (index: number, updates: Partial<ResolutionStep>) => {
    setSteps((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], ...updates };
      return copy;
    });
  };

  // Delete step
  const handleDeleteStep = (index: number) => {
    setSteps((prev) => {
      const filtered = prev.filter((_, i) => i !== index);
      // Re-number
      return filtered.map((s, idx) => ({
        ...s,
        stepNumber: idx + 1,
      }));
    });
  };

  // Move step up/down
  const handleMoveStep = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === steps.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const copy = [...steps];
    const temp = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = temp;

    // Renumber
    setSteps(
      copy.map((s, idx) => ({
        ...s,
        stepNumber: idx + 1,
      }))
    );
  };

  // Add Material Tag to step
  const handleAddMaterialTag = (stepIndex: number) => {
    const rawTag = (newMaterialInput[stepIndex] || '').trim();
    if (!rawTag) return;

    setSteps((prev) => {
      const copy = [...prev];
      const existing = copy[stepIndex].materialsUsed || [];
      if (!existing.includes(rawTag)) {
        copy[stepIndex] = {
          ...copy[stepIndex],
          materialsUsed: [...existing, rawTag],
        };
      }
      return copy;
    });

    setNewMaterialInput((prev) => ({ ...prev, [stepIndex]: '' }));
  };

  // Remove Material Tag from step
  const handleRemoveMaterialTag = (stepIndex: number, tagToRemove: string) => {
    setSteps((prev) => {
      const copy = [...prev];
      copy[stepIndex] = {
        ...copy[stepIndex],
        materialsUsed: (copy[stepIndex].materialsUsed || []).filter((t) => t !== tagToRemove),
      };
      return copy;
    });
  };

  // Handle File Upload from device
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setIsUploading(true);
      const newAttachments: ResolutionProofAttachment[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const compressed = await compressImageFile(file);

        const now = new Date();
        const timestamp = `${now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}, ${now.toLocaleTimeString(
          'en-US',
          { hour: '2-digit', minute: '2-digit', hour12: true }
        )}`;

        newAttachments.push({
          id: `proof-${Date.now()}-${i}`,
          name: file.name,
          url: compressed.dataUrl,
          type: 'photo',
          caption: `Work proof: ${file.name.replace(/\.[^/.]+$/, '')}`,
          uploadedAt: timestamp,
          uploadedBy: currentStaff.name,
          sizeBytes: compressed.size,
        });
      }

      setAttachments((prev) => [...prev, ...newAttachments]);
      setSaveSuccessMessage(`${newAttachments.length} proof document(s) uploaded successfully!`);
      setTimeout(() => setSaveSuccessMessage(null), 3500);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error processing uploaded proof file.');
      setTimeout(() => setErrorMessage(null), 4000);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Preset sample proof images for convenient testing
  const handleAddSampleProof = (type: 'after_photo' | 'receipt' | 'test_report') => {
    const now = new Date();
    const timestamp = `${now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}, ${now.toLocaleTimeString(
      'en-US',
      { hour: '2-digit', minute: '2-digit', hour12: true }
    )}`;

    let sampleItem: ResolutionProofAttachment;
    if (type === 'after_photo') {
      sampleItem = {
        id: `proof-${Date.now()}`,
        name: 'Work-Completed-Verification.jpg',
        url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800',
        type: 'photo',
        caption: 'Facility component repaired, insulated, and functioning under inspection test.',
        uploadedAt: timestamp,
        uploadedBy: currentStaff.name,
      };
    } else if (type === 'receipt') {
      sampleItem = {
        id: `proof-${Date.now()}`,
        name: 'Parts-Requisition-Slip.jpg',
        url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=800',
        type: 'receipt',
        caption: 'University central store parts dispatch voucher #PU-ENG-4912.',
        uploadedAt: timestamp,
        uploadedBy: currentStaff.name,
      };
    } else {
      sampleItem = {
        id: `proof-${Date.now()}`,
        name: 'Quality-Compliance-Audit.jpg',
        url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800',
        type: 'report',
        caption: 'Certified operational handover checklist verified by proctor team.',
        uploadedAt: timestamp,
        uploadedBy: currentStaff.name,
      };
    }

    setAttachments((prev) => [...prev, sampleItem]);
    setSaveSuccessMessage(`Sample proof added (${sampleItem.name}).`);
    setTimeout(() => setSaveSuccessMessage(null), 3000);
  };

  // Remove attachment
  const handleRemoveAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  // Update attachment caption / type
  const handleUpdateAttachment = (id: string, updates: Partial<ResolutionProofAttachment>) => {
    setAttachments((prev) => prev.map((a) => (a.id === id ? { ...a, ...updates } : a)));
  };

  // Submit Save action
  const handleSaveReport = (markAsResolved: boolean) => {
    if (!activeComplaint) return;

    if (steps.length === 0) {
      setErrorMessage('Please provide at least 1 resolution step describing what was done.');
      setTimeout(() => setErrorMessage(null), 4000);
      return;
    }

    if (!resolutionSummary.trim()) {
      setErrorMessage('Please provide an executive resolution summary for the student.');
      setTimeout(() => setErrorMessage(null), 4000);
      return;
    }

    const payload: ResolutionReportPayload = {
      complaintId: activeComplaint.id,
      resolutionSummary: resolutionSummary.trim(),
      steps,
      attachments,
      rootCause: rootCause.trim(),
      preventativeMeasures: preventativeMeasures.trim(),
      costIncurred: costIncurred.trim(),
      markAsResolved,
      staffName: currentStaff.name,
    };

    const updated = saveResolutionActionReport(payload);
    if (updated) {
      onComplaintUpdated(updated);
      setSaveSuccessMessage(
        markAsResolved
          ? `Grievance #${activeComplaint.id} has been marked as RESOLVED! Both student and university administration portals have been updated in real-time.`
          : `Progress saved! ${steps.length} step(s) and ${attachments.length} attachment(s) logged for #${activeComplaint.id}.`
      );
      setTimeout(() => setSaveSuccessMessage(null), 6000);
    }
  };

  // Filter complaints for picker dropdown
  const filteredPickerComplaints = complaints.filter((c) => {
    if (!complaintSearch.trim()) return true;
    const q = complaintSearch.toLowerCase().trim();
    return (
      c.id.toLowerCase().includes(q) ||
      (c.studentName || '').toLowerCase().includes(q) ||
      (c.subject || c.title || '').toLowerCase().includes(q) ||
      (c.category || '').toLowerCase().includes(q) ||
      (c.location || '').toLowerCase().includes(q)
    );
  });

  const getPriorityBadge = (p?: PriorityLevel) => {
    switch (p) {
      case 'Emergency':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <Flame size={11} /> Emergency
          </span>
        );
      case 'High':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            <AlertTriangle size={11} /> High
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
            {p || 'Medium'}
          </span>
        );
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Resolved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 size={11} /> Resolved
          </span>
        );
      case 'In Progress':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <Clock size={11} /> In Progress
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-200">
            {status}
          </span>
        );
    }
  };

  if (!activeComplaint) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 shadow-xs">
        <FileText size={36} className="mx-auto text-slate-300 mb-2" />
        <h3 className="text-base font-bold text-slate-800">No Complaints Available</h3>
        <p className="text-xs text-slate-500 mt-1">There are no complaints registered in the system to upload resolution for.</p>
      </div>
    );
  }

  return (
    <div id="staff-resolution-upload-page" className="space-y-6 pb-16">
      {/* 1. PAGE TITLE & HEADER */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-wider mb-1">
              <ShieldCheck size={16} />
              <span>Administrative Grievance Redressal</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Upload Resolution Steps & Proof
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
              Log the exact physical steps, equipment replacements, diagnostics, and photo proof taken to resolve the student grievance.
            </p>
          </div>

          {/* Quick Certificate & Print Preview Button */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              id="staff-resolution-preview-cert-btn"
              onClick={() => setShowCertificateModal(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 transition-colors shadow-2xs cursor-pointer"
            >
              <Eye size={14} className="text-blue-600" />
              <span>Preview Completion Report</span>
            </button>
          </div>
        </div>

        {/* Global Feedback Notifications */}
        {saveSuccessMessage && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold flex items-center gap-2 shadow-2xs">
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
            <span>{saveSuccessMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-300 text-rose-800 text-xs font-semibold flex items-center gap-2 shadow-2xs">
            <AlertTriangle size={16} className="text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      {/* 2. COMPLAINT SELECTOR DROPDOWN / CAROUSEL */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Layers size={14} className="text-blue-600" />
            <span>Active Grievance Ticket</span>
          </label>
          <span className="text-xs text-slate-400 font-mono">
            {complaints.length} tickets in database
          </span>
        </div>

        {/* Selected Complaint Bar */}
        <div className="relative">
          <div
            id="staff-resolution-complaint-picker-trigger"
            onClick={() => setIsComplaintPickerOpen(!isComplaintPickerOpen)}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200 cursor-pointer transition-all"
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <span className="font-mono font-bold text-blue-600 text-xs sm:text-sm px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200 shrink-0">
                #{activeComplaint.id}
              </span>
              <div className="text-left truncate">
                <div className="font-semibold text-slate-900 text-xs sm:text-sm truncate">
                  {activeComplaint.subject || activeComplaint.title}
                </div>
                <div className="text-[11px] text-slate-500 flex items-center gap-2">
                  <span>{activeComplaint.studentName} ({activeComplaint.ugNumber})</span>
                  <span>•</span>
                  <span>{activeComplaint.category}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 ml-2">
              {getStatusBadge(activeComplaint.status)}
              {getPriorityBadge(activeComplaint.priority)}
              <ChevronDown
                size={16}
                className={`text-slate-400 transition-transform ${isComplaintPickerOpen ? 'rotate-180' : ''}`}
              />
            </div>
          </div>

          {/* Picker Dropdown Menu */}
          {isComplaintPickerOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl z-20 overflow-hidden max-h-80 flex flex-col">
              <div className="p-2 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
                <Search size={14} className="text-slate-400 ml-1" />
                <input
                  type="text"
                  placeholder="Search by ID, student, subject or location..."
                  value={complaintSearch}
                  onChange={(e) => setComplaintSearch(e.target.value)}
                  className="w-full bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
                  autoFocus
                />
              </div>

              <div className="overflow-y-auto divide-y divide-slate-100">
                {filteredPickerComplaints.map((c) => {
                  const isCur = c.id === activeComplaint.id;
                  return (
                    <div
                      key={c.id}
                      onClick={() => {
                        setSelectedId(c.id);
                        setIsComplaintPickerOpen(false);
                      }}
                      className={`p-3 hover:bg-slate-50 cursor-pointer flex items-center justify-between transition-colors ${
                        isCur ? 'bg-blue-50/60' : ''
                      }`}
                    >
                      <div className="min-w-0 pr-3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs text-blue-600">
                            #{c.id}
                          </span>
                          <span className="text-xs font-semibold text-slate-800 truncate">
                            {c.subject || c.title}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5 truncate">
                          {c.studentName} ({c.ugNumber}) • {c.location || c.category}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {getStatusBadge(c.status)}
                        {isCur && <Check size={14} className="text-blue-600" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Active Complaint Snapshot Info */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] font-semibold uppercase">Student & Dept</span>
            <span className="font-semibold text-slate-800">{activeComplaint.studentName}</span>
            <div className="text-[11px] text-slate-500">{activeComplaint.department || 'Parul University'}</div>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] font-semibold uppercase">Location & Venue</span>
            <span className="font-medium text-slate-800 flex items-center gap-1">
              <MapPin size={12} className="text-slate-400 shrink-0" />
              <span className="truncate">{activeComplaint.location || 'Campus Premises'}</span>
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] font-semibold uppercase">Assigned Staff</span>
            <span className="font-medium text-slate-800">
              {activeComplaint.assignedStaff || currentStaff.name}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] font-semibold uppercase">Reported Issue</span>
            <span className="text-slate-600 line-clamp-1 italic">
              &quot;{activeComplaint.description}&quot;
            </span>
          </div>
        </div>

        {/* If student attached photos, show mini preview */}
        {activeComplaint.images && activeComplaint.images.length > 0 && (
          <div className="pt-2 flex items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-500 shrink-0">
              Student Reported Photos ({activeComplaint.images.length}):
            </span>
            <div className="flex items-center gap-2 overflow-x-auto py-0.5">
              {activeComplaint.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Student photo ${idx + 1}`}
                  onClick={() => setPreviewImageModal(img)}
                  className="w-9 h-9 rounded-lg object-cover border border-slate-300 hover:scale-110 transition-transform cursor-pointer shadow-2xs shrink-0"
                  title="Click to view original student issue photo"
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 3. STEP-BY-STEP RESOLUTION BUILDER */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
              <Wrench size={15} className="text-blue-600" />
              <span>Steps Taken to Resolve Problem ({steps.length})</span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Break down the diagnostic, repair, testing, and handover steps performed.
            </p>
          </div>

          {/* Preset Template Quick-Loaders */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-semibold text-slate-400">Load Template:</span>
            <button
              type="button"
              onClick={() => handleApplyTemplate('maintenance')}
              className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors cursor-pointer"
            >
              Hostel / Maintenance
            </button>
            <button
              type="button"
              onClick={() => handleApplyTemplate('it_network')}
              className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors cursor-pointer"
            >
              IT / Network
            </button>
            <button
              type="button"
              onClick={() => handleApplyTemplate('academic')}
              className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors cursor-pointer"
            >
              Academic
            </button>
          </div>
        </div>

        {/* Steps List */}
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div
              key={step.id || index}
              id={`staff-resolution-step-card-${index}`}
              className="p-4 sm:p-5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all shadow-2xs space-y-3 relative group"
            >
              {/* Step Header */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                    {step.stepNumber}
                  </span>
                  <input
                    type="text"
                    value={step.title}
                    onChange={(e) => handleUpdateStep(index, { title: e.target.value })}
                    placeholder="e.g. Diagnostic & Site Inspection"
                    className="font-bold text-slate-900 text-xs sm:text-sm bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:outline-none flex-1 py-0.5"
                  />
                </div>

                {/* Step controls: Up / Down / Status / Delete */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <select
                    value={step.status}
                    onChange={(e) =>
                      handleUpdateStep(index, {
                        status: e.target.value as 'completed' | 'in-progress' | 'pending',
                      })
                    }
                    className="text-[11px] font-semibold px-2 py-1 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none cursor-pointer"
                  >
                    <option value="completed">Completed</option>
                    <option value="in-progress">In Progress</option>
                    <option value="pending">Pending</option>
                  </select>

                  <button
                    type="button"
                    onClick={() => handleMoveStep(index, 'up')}
                    disabled={index === 0}
                    className="p-1 rounded text-slate-400 hover:text-slate-700 disabled:opacity-30 cursor-pointer"
                    title="Move Step Up"
                  >
                    <ChevronUp size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoveStep(index, 'down')}
                    disabled={index === steps.length - 1}
                    className="p-1 rounded text-slate-400 hover:text-slate-700 disabled:opacity-30 cursor-pointer"
                    title="Move Step Down"
                  >
                    <ChevronDown size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteStep(index)}
                    className="p-1 rounded text-rose-500 hover:text-rose-700 hover:bg-rose-50 cursor-pointer ml-1"
                    title="Delete Step"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              {/* Action Description */}
              <div>
                <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                  Specific Action Taken & Findings:
                </label>
                <textarea
                  rows={2}
                  value={step.description}
                  onChange={(e) => handleUpdateStep(index, { description: e.target.value })}
                  placeholder="Describe exactly what was repaired, inspected, adjusted, or replaced in this step..."
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 text-slate-800 placeholder-slate-400 resize-none"
                />
              </div>

              {/* Performed by, duration, timestamp row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs">
                <div>
                  <span className="text-[10px] font-semibold uppercase text-slate-400 block mb-0.5">
                    Performed By:
                  </span>
                  <input
                    type="text"
                    value={step.performedBy || ''}
                    onChange={(e) => handleUpdateStep(index, { performedBy: e.target.value })}
                    placeholder="Staff name / Technician"
                    className="w-full text-xs px-2 py-1 rounded-md border border-slate-200 text-slate-700 bg-slate-50"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-semibold uppercase text-slate-400 block mb-0.5">
                    Duration / Time Spent:
                  </span>
                  <input
                    type="number"
                    value={step.durationMinutes || ''}
                    onChange={(e) =>
                      handleUpdateStep(index, {
                        durationMinutes: parseInt(e.target.value) || 0,
                      })
                    }
                    placeholder="e.g. 45 (minutes)"
                    className="w-full text-xs px-2 py-1 rounded-md border border-slate-200 text-slate-700 bg-slate-50"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-semibold uppercase text-slate-400 block mb-0.5">
                    Timestamp:
                  </span>
                  <input
                    type="text"
                    value={step.timestamp}
                    onChange={(e) => handleUpdateStep(index, { timestamp: e.target.value })}
                    placeholder="Date & Time"
                    className="w-full text-xs px-2 py-1 rounded-md border border-slate-200 text-slate-700 bg-slate-50"
                  />
                </div>
              </div>

              {/* Materials / Components Replaced / Tools Tag list */}
              <div className="pt-2 border-t border-slate-100">
                <span className="text-[11px] font-semibold text-slate-500 block mb-1.5 flex items-center gap-1">
                  <Tag size={12} className="text-slate-400" />
                  <span>Materials, Equipment, or Parts Used in this Step:</span>
                </span>

                <div className="flex items-center gap-1.5 flex-wrap">
                  {step.materialsUsed &&
                    step.materialsUsed.map((mat, matIdx) => (
                      <span
                        key={matIdx}
                        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-blue-50 text-blue-800 border border-blue-200"
                      >
                        <span>{mat}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveMaterialTag(index, mat)}
                          className="hover:text-rose-600 cursor-pointer ml-0.5"
                        >
                          &times;
                        </button>
                      </span>
                    ))}

                  <div className="inline-flex items-center gap-1">
                    <input
                      type="text"
                      placeholder="Add part / tool..."
                      value={newMaterialInput[index] || ''}
                      onChange={(e) =>
                        setNewMaterialInput((prev) => ({
                          ...prev,
                          [index]: e.target.value,
                        }))
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddMaterialTag(index);
                        }
                      }}
                      className="text-xs px-2 py-1 rounded-lg border border-slate-200 w-32 focus:w-44 transition-all focus:border-blue-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddMaterialTag(index)}
                      className="px-2 py-1 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
                    >
                      + Add
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Step Button */}
        <button
          type="button"
          id="staff-resolution-add-step-btn"
          onClick={handleAddStep}
          className="w-full py-3 rounded-xl border-2 border-dashed border-slate-200 hover:border-blue-500 text-slate-600 hover:text-blue-600 flex items-center justify-center gap-2 text-xs font-bold transition-all bg-slate-50/50 hover:bg-blue-50/30 cursor-pointer"
        >
          <Plus size={16} />
          <span>Add Another Resolution Step</span>
        </button>
      </div>

      {/* 4. WORK PROOF & ATTACHMENT UPLOAD ("Upload the things") */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
              <Upload size={15} className="text-blue-600" />
              <span>Upload Work Proof & Completion Evidence ({attachments.length})</span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Upload photos of completed work, before/after comparisons, parts receipts, or inspection vouchers.
            </p>
          </div>

          {/* Quick preset sample buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-semibold text-slate-400">Quick Demo Presets:</span>
            <button
              type="button"
              onClick={() => handleAddSampleProof('after_photo')}
              className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-colors cursor-pointer"
            >
              + Completed Photo
            </button>
            <button
              type="button"
              onClick={() => handleAddSampleProof('receipt')}
              className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition-colors cursor-pointer"
            >
              + Parts Slip
            </button>
            <button
              type="button"
              onClick={() => handleAddSampleProof('test_report')}
              className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 transition-colors cursor-pointer"
            >
              + Audit Report
            </button>
          </div>
        </div>

        {/* Drag & Drop / File Browser Zone */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className={`p-6 sm:p-8 rounded-2xl border-2 border-dashed text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
            isUploading
              ? 'border-blue-500 bg-blue-50/50'
              : 'border-slate-300 hover:border-blue-500 bg-slate-50 hover:bg-slate-100/60'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,application/pdf"
            className="hidden"
            onChange={handleFileUpload}
          />

          <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-center text-blue-600 mb-2">
            {isUploading ? (
              <span className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Upload size={22} />
            )}
          </div>

          <h4 className="text-sm font-bold text-slate-800">
            {isUploading ? 'Compressing and uploading file(s)...' : 'Choose files from device or drag here'}
          </h4>
          <p className="text-xs text-slate-500 mt-1">
            Supports JPG, PNG, WEBP, and PDF vouchers. Images are compressed automatically for fast loading.
          </p>

          <span className="inline-flex items-center gap-1 px-3 py-1 mt-3 rounded-lg text-xs font-semibold bg-blue-600 text-white shadow-2xs hover:bg-blue-700">
            <Plus size={14} /> Browse Device Files
          </span>
        </div>

        {/* Uploaded Attachments Grid */}
        {attachments.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {attachments.map((att) => (
              <div
                key={att.id}
                className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-2xs flex flex-col justify-between group"
              >
                {/* Thumbnail */}
                <div className="h-36 bg-slate-100 relative overflow-hidden">
                  <img
                    src={att.url}
                    alt={att.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-black/70 text-white backdrop-blur-xs">
                      {att.type}
                    </span>
                  </div>
                  <div className="absolute top-2 right-2 flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setPreviewImageModal(att.url)}
                      className="p-1 rounded-md bg-black/60 hover:bg-black/80 text-white backdrop-blur-xs"
                      title="Enlarge Photo"
                    >
                      <Eye size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveAttachment(att.id)}
                      className="p-1 rounded-md bg-rose-600/90 hover:bg-rose-700 text-white"
                      title="Delete Proof"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                {/* Caption & Metadata */}
                <div className="p-3 space-y-2">
                  <input
                    type="text"
                    value={att.caption || ''}
                    onChange={(e) => handleUpdateAttachment(att.id, { caption: e.target.value })}
                    placeholder="Add description/caption..."
                    className="w-full text-xs font-semibold text-slate-800 border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:outline-none truncate"
                  />

                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span className="truncate max-w-[120px]">{att.name}</span>
                    <span>{att.uploadedAt}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-400">
            No proof photos or receipts uploaded yet. Use the upload zone or demo presets above.
          </div>
        )}
      </div>

      {/* 5. ROOT CAUSE, PREVENTATIVE MEASURES & EXECUTIVE SUMMARY */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
            <FileText size={17} className="text-blue-600" />
            <span>Technical Findings & Redressal Summary</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Document root causes and instructions for university records and the student.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Root Cause */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Root Cause Diagnosis:
            </label>
            <textarea
              rows={3}
              value={rootCause}
              onChange={(e) => setRootCause(e.target.value)}
              placeholder="Explain the technical or logistical cause of the problem (e.g. blown capacitor, switchport outage, timetable collision)..."
              className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 text-slate-800 placeholder-slate-400 resize-none"
            />
          </div>

          {/* Preventative Measures */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Preventative Measures Instituted:
            </label>
            <textarea
              rows={3}
              value={preventativeMeasures}
              onChange={(e) => setPreventativeMeasures(e.target.value)}
              placeholder="What actions are put in place so this problem does not recur for future students?..."
              className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 text-slate-800 placeholder-slate-400 resize-none"
            />
          </div>
        </div>

        {/* Executive Resolution Summary for Student */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">
            Official Resolution Summary (Shown directly to Student & Dean):
          </label>
          <textarea
            rows={3}
            value={resolutionSummary}
            onChange={(e) => setResolutionSummary(e.target.value)}
            placeholder="Official resolution statement that will be sent to the student and recorded in their grievance tracking timeline..."
            className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 text-slate-800 placeholder-slate-400 resize-none"
          />
        </div>

        {/* Cost incurred / Requisition number (Optional) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1 flex items-center gap-1">
              <DollarSign size={13} className="text-slate-400" />
              <span>Cost / Materials Budget (Optional):</span>
            </label>
            <input
              type="text"
              value={costIncurred}
              onChange={(e) => setCostIncurred(e.target.value)}
              placeholder="e.g. ₹ 1,200 (Under Annual Maintenance Contract)"
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1 flex items-center gap-1">
              <User size={13} className="text-slate-400" />
              <span>Authorizing Redressal Officer:</span>
            </label>
            <input
              type="text"
              readOnly
              value={`${currentStaff.name} (${currentStaff.designation})`}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-medium"
            />
          </div>
        </div>
      </div>

      {/* 6. SUBMISSION & ACTION TOOLBAR */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky bottom-4 z-20">
        <div>
          <div className="text-xs font-bold text-slate-900">
            Grievance Redressal Action Status
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            {steps.length} step(s) recorded • {attachments.length} proof item(s) attached
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Save Progress (In Progress) */}
          <button
            type="button"
            id="staff-resolution-save-progress-btn"
            onClick={() => handleSaveReport(false)}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition-colors shadow-2xs cursor-pointer"
          >
            Save as Progress Report
          </button>

          {/* Submit & Mark Resolved */}
          <button
            type="button"
            id="staff-resolution-submit-resolved-btn"
            onClick={() => handleSaveReport(true)}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer"
          >
            <CheckCircle2 size={16} />
            <span>Submit & Mark as Fully Resolved</span>
          </button>
        </div>
      </div>

      {/* MODAL: IMAGE ENLARGED PREVIEW */}
      {previewImageModal && (
        <div
          onClick={() => setPreviewImageModal(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="max-w-3xl max-h-[90vh] bg-white rounded-2xl overflow-hidden shadow-2xl relative">
            <button
              onClick={() => setPreviewImageModal(null)}
              className="absolute top-3 right-3 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 z-10"
            >
              <X size={16} />
            </button>
            <img
              src={previewImageModal}
              alt="Preview"
              className="w-full h-auto max-h-[80vh] object-contain"
            />
          </div>
        </div>
      )}

      {/* MODAL: OFFICIAL COMPLETION CERTIFICATE PREVIEW */}
      {showCertificateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <FileCheck size={18} className="text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  Official Grievance Redressal & Resolution Report
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 inline-flex items-center gap-1 shadow-2xs"
                >
                  <Printer size={13} /> Print
                </button>
                <button
                  onClick={() => setShowCertificateModal(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Certificate Body (Formal Layout) */}
            <div className="p-6 sm:p-8 space-y-6 text-slate-800 text-xs sm:text-sm">
              {/* University Header */}
              <div className="text-center border-b border-slate-200 pb-5">
                <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-300 text-amber-700 font-bold text-lg flex items-center justify-center mx-auto mb-2 shadow-2xs">
                  PU
                </div>
                <h2 className="text-lg sm:text-xl font-bold uppercase tracking-wider text-slate-900">
                  Parul University
                </h2>
                <div className="text-xs text-slate-500 font-medium">
                  Central Grievance Redressal Cell • Administrative Compliance Office
                </div>
                <div className="text-[11px] text-amber-700 font-mono mt-1">
                  OFFICIAL ACTION TAKEN & SERVICE COMPLETION CERTIFICATE
                </div>
              </div>

              {/* Grievance Metadata Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] font-bold uppercase">Ticket ID</span>
                  <span className="font-mono font-bold text-blue-600">#{activeComplaint.id}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] font-bold uppercase">Category</span>
                  <span className="font-semibold text-slate-800">{activeComplaint.category}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] font-bold uppercase">Student</span>
                  <span className="font-semibold text-slate-800">{activeComplaint.studentName} ({activeComplaint.ugNumber})</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] font-bold uppercase">Status</span>
                  <span className="font-bold text-emerald-600">Verified & Resolved</span>
                </div>
              </div>

              {/* Problem Description */}
              <div>
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-500 mb-1">
                  Original Issue Reported:
                </h4>
                <p className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 italic">
                  &quot;{activeComplaint.description}&quot;
                </p>
              </div>

              {/* Root Cause & Preventative Action */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {rootCause && (
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="font-bold text-slate-900 block mb-1 text-xs">
                      Root Cause Analysis:
                    </span>
                    <p className="text-slate-600">{rootCause}</p>
                  </div>
                )}

                {preventativeMeasures && (
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="font-bold text-slate-900 block mb-1 text-xs">
                      Preventative Safeguards:
                    </span>
                    <p className="text-slate-600">{preventativeMeasures}</p>
                  </div>
                )}
              </div>

              {/* Step by step action log */}
              <div>
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-500 mb-2">
                  Chronological Steps Executed ({steps.length}):
                </h4>
                <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 overflow-hidden">
                  {steps.map((s) => (
                    <div key={s.id} className="p-3 flex items-start gap-3 bg-white">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        ✓
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 text-xs">{s.title}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{s.timestamp}</span>
                        </div>
                        {s.description && (
                          <p className="text-slate-600 text-xs mt-0.5">{s.description}</p>
                        )}
                        {s.materialsUsed && s.materialsUsed.length > 0 && (
                          <div className="text-[10px] text-slate-500 mt-1">
                            <strong>Parts used:</strong> {s.materialsUsed.join(', ')}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Uploaded Evidence Gallery */}
              {attachments.length > 0 && (
                <div>
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-500 mb-2">
                    Verified Work Proof & Documentation ({attachments.length}):
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {attachments.map((att) => (
                      <div
                        key={att.id}
                        className="rounded-xl border border-slate-200 overflow-hidden bg-slate-50"
                      >
                        <img
                          src={att.url}
                          alt={att.name}
                          className="w-full h-24 object-cover"
                        />
                        <div className="p-2 text-[10px] text-slate-700 truncate font-semibold">
                          {att.caption || att.name}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Officer Signature & Stamp */}
              <div className="pt-6 border-t border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <div className="text-slate-400 text-[10px] font-semibold uppercase">Inspection Authority</div>
                  <div className="font-bold text-slate-900">{currentStaff.name}</div>
                  <div className="text-slate-500 text-[11px]">{currentStaff.designation}</div>
                  <div className="text-slate-400 text-[10px]">{currentStaff.department}</div>
                </div>

                <div className="text-right">
                  <div className="inline-block p-2 rounded-xl border-2 border-emerald-600 text-emerald-700 font-mono font-bold text-[11px] uppercase tracking-wider transform -rotate-3">
                    PU Grievance Verified
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1 font-mono">
                    Redressal Seal • {new Date().toLocaleDateString('en-GB')}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => setShowCertificateModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs shadow-xs"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
