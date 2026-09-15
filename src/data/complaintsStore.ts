import {
  ComplaintRecord,
  PriorityLevel,
  ResolutionProofAttachment,
  ResolutionStep,
  StaffAccount,
  UnifiedComplaintStatus,
} from '../types';
import { apiClient, BackendHealthResponse } from '../services/api';

export const STORAGE_KEY_COMPLAINTS = 'complaints';
export const STORAGE_KEY_STAFF_ACCOUNTS = 'pu_staff_accounts';
export const STORAGE_KEY_STAFF_SESSION = 'pu_active_staff_session';

// Standard university administrators for backend access
export const INITIAL_STAFF_ACCOUNTS: StaffAccount[] = [
  {
    staffId: '26UG030984',
    name: 'University Administrator',
    email: 'admin@paruluniversity.ac.in',
    department: 'Central Administration & Grievance Directorate',
    designation: 'Chief Grievance Redressal Officer & Proctor',
    phone: '+91 98250 30984',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    password: 'Admin@2026',
    role: 'ADMIN',
    permissions: ['all', 'manage_complaints', 'assign_staff', 'resolve_complaints', 'system_audit', 'database_reset'],
  },
];

// Initial Demo Complaints as required by prompt
export const INITIAL_DEMO_COMPLAINTS: ComplaintRecord[] = [
  {
    id: 'PU-2026-0001',
    studentName: 'Rohan Sharma',
    ugNumber: '23CS12345',
    department: 'Computer Science & Engineering',
    category: 'Hostel & Accommodation',
    subject: 'Room maintenance problem',
    title: 'Room maintenance problem',
    description:
      'Air conditioner cooling malfunction and water leakage from the drainage pipe in Hostel Block H-2, Room 305. Need urgent repair as weather is extremely humid.',
    location: 'Hostel Block 2, Room 305',
    attachment: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=600',
    images: [
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=600',
    ],
    date: '12 Sep 2026',
    time: '10:30 AM',
    priority: 'High',
    status: 'Submitted',
    assignedStaff: 'Unassigned',
    assignedDepartment: 'Hostel & Estate Maintenance',
    staffRemarks: 'New complaint received. Queueing for proctor review.',
    resolution: '',
    timeline: [
      {
        id: 'tl-1',
        title: 'Complaint Submitted',
        timestamp: '12 Sep 2026, 10:30 AM',
        description: 'Complaint registered by student and logged into university grievance central registry.',
        status: 'completed',
      },
      {
        id: 'tl-2',
        title: 'Pending Staff Review',
        timestamp: 'Awaiting Action',
        description: 'Assigned warden/officer will acknowledge and inspect the issue.',
        status: 'current',
      },
    ],
  },
  {
    id: 'PU-2026-0002',
    studentName: 'Priya Patel',
    ugNumber: '22IT04512',
    department: 'Information Technology',
    category: 'Academic & Classroom',
    subject: 'Faculty timetable issue',
    title: 'Faculty timetable issue',
    description:
      'Class timetable clash between Machine Learning Elective (Room 402) and Cloud Computing Lab (Lab 7) on Wednesdays and Fridays from 11:00 AM to 1:00 PM.',
    location: 'PIET Academic Block B, Room 402',
    attachment: '',
    images: [],
    date: '11 Sep 2026',
    time: '02:15 PM',
    priority: 'Medium',
    status: 'In Progress',
    assignedStaff: 'Prof. Ananya Desai',
    assignedDepartment: 'Academic Affairs',
    staffRemarks: 'Academic coordinator contacted. Timetable committee is rescheduling Friday lab slots to 2:00 PM.',
    resolution: '',
    timeline: [
      {
        id: 'tl-21',
        title: 'Submitted',
        timestamp: '11 Sep 2026, 02:15 PM',
        description: 'Complaint submitted by Priya Patel.',
        status: 'completed',
      },
      {
        id: 'tl-22',
        title: 'Accepted',
        timestamp: '11 Sep 2026, 04:00 PM',
        description: 'Accepted by Associate Dean Academic Affairs.',
        status: 'completed',
        officer: 'Prof. Ananya Desai',
      },
      {
        id: 'tl-23',
        title: 'In Progress',
        timestamp: '12 Sep 2026, 09:30 AM',
        description: 'Coordinating with HOD IT to release updated schedule revision.',
        status: 'current',
        officer: 'Prof. Ananya Desai',
      },
    ],
  },
  {
    id: 'PU-2026-0003',
    studentName: 'Aman Verma',
    ugNumber: '23EC08910',
    department: 'Electronics & Communication',
    category: 'Campus problem',
    subject: 'Campus Wi-Fi outage and network portal error',
    title: 'Campus Wi-Fi outage and network portal error',
    description:
      'High packet loss, intermittent disconnects, and captive portal authentication failure on campus SSID "PU_STUDENT_5G" across 3rd floor reading hall.',
    location: 'Central Library, 3rd Floor Reading Zone',
    attachment: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=600',
    images: ['https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=600'],
    date: '10 Sep 2026',
    time: '11:45 AM',
    priority: 'High',
    status: 'Resolved',
    assignedStaff: 'Er. Vikram Patel',
    assignedDepartment: 'Campus IT & Infrastructure Services',
    staffRemarks: 'Replaced faulty Cisco Catalyst access point and refreshed DHCP scope for subnet 10.14.32.0/24.',
    resolution:
      'Access Point replaced and firmware updated. Signal strength verified with average 85 Mbps bandwidth across all student devices.',
    resolvedAt: '11 Sep 2026, 03:20 PM',
    resolvedBy: 'Er. Vikram Patel',
    rootCause: 'Capacitor blowout in PoE power delivery module of Cisco AP-3802 leading to packet drop under peak load.',
    preventativeMeasures: 'Configured secondary redundant AP on floor 3 and set automated SNMP ping alerts to network NOC.',
    costIncurred: '₹ 4,500 (Covered under University Annual Maintenance Contract)',
    resolutionSteps: [
      {
        id: 'step-301',
        stepNumber: 1,
        title: 'RF Spectrum & Packet Loss Diagnostic',
        description: 'Conducted Wi-Fi heat-map and packet drop testing across 3rd floor reading hall. Diagnosed 68% packet loss on AP-3802.',
        performedBy: 'Er. Vikram Patel (Network Admin)',
        timestamp: '10 Sep 2026, 02:00 PM',
        status: 'completed',
        durationMinutes: 45,
        materialsUsed: ['Fluke Network Tester', 'Wi-Fi Analyzer Laptop'],
      },
      {
        id: 'step-302',
        stepNumber: 2,
        title: 'Hardware Replacement & PoE Cabling Check',
        description: 'Dismounted faulty unit and installed replacement Cisco Catalyst 9120AXI access point with shielded Cat6 patch cable.',
        performedBy: 'Er. Vikram Patel & Hardware Technician',
        timestamp: '11 Sep 2026, 11:30 AM',
        status: 'completed',
        durationMinutes: 60,
        materialsUsed: ['Cisco Catalyst 9120AXI AP', '2m Cat6 SFTP Patch Cable', 'Ceiling Mounting Bracket'],
      },
      {
        id: 'step-303',
        stepNumber: 3,
        title: 'VLAN Provisioning & Firmware Verification',
        description: 'Re-assigned port to VLAN 32 (Student WLAN), flashed firmware v17.9.4, and verified DHCP lease pool availability.',
        performedBy: 'Er. Vikram Patel',
        timestamp: '11 Sep 2026, 01:15 PM',
        status: 'completed',
        durationMinutes: 30,
        materialsUsed: ['Console Management Cable'],
      },
      {
        id: 'step-304',
        stepNumber: 4,
        title: 'End-User Speed & Authentication Validation',
        description: 'Tested simultaneous student logins on SSID PU_STUDENT_5G. Achieved 85-92 Mbps symmetric throughput with zero dropped frames.',
        performedBy: 'Er. Vikram Patel (Verified with Library Student Rep)',
        timestamp: '11 Sep 2026, 03:00 PM',
        status: 'completed',
        durationMinutes: 20,
      },
    ],
    resolutionAttachments: [
      {
        id: 'proof-301',
        name: 'New Cisco AP Installed & Live.jpg',
        url: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=800',
        type: 'photo',
        caption: 'New Cisco Catalyst 9120 Access Point installed on ceiling mount with green status LED',
        uploadedAt: '11 Sep 2026, 03:10 PM',
        uploadedBy: 'Er. Vikram Patel',
      },
      {
        id: 'proof-302',
        name: 'Throughput Speedtest Verification.png',
        url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=800',
        type: 'report',
        caption: 'Bandwidth test report showing 88.4 Mbps download / 91.2 Mbps upload with 12ms ping',
        uploadedAt: '11 Sep 2026, 03:15 PM',
        uploadedBy: 'Er. Vikram Patel',
      },
    ],
    timeline: [
      {
        id: 'tl-31',
        title: 'Submitted',
        timestamp: '10 Sep 2026, 11:45 AM',
        description: 'Complaint logged in IT service desk.',
        status: 'completed',
      },
      {
        id: 'tl-32',
        title: 'Accepted & Dispatched',
        timestamp: '10 Sep 2026, 12:30 PM',
        description: 'Assigned to Network Operations Team.',
        status: 'completed',
        officer: 'Er. Vikram Patel',
      },
      {
        id: 'tl-33',
        title: 'Resolved',
        timestamp: '11 Sep 2026, 03:20 PM',
        description: 'Hardware replaced and signal verified.',
        status: 'completed',
        officer: 'Er. Vikram Patel',
      },
    ],
  },
  {
    id: 'PU-2026-0004',
    studentName: 'Neha Joshi',
    ugNumber: '21BT02341',
    department: 'Biotechnology',
    category: 'Cafeteria & Mess',
    subject: 'Food quality and hygiene concern',
    title: 'Food quality and hygiene concern',
    description:
      'Improper food covering and sub-standard hygiene observed at counter 4 during lunch hours. Several students reported cold meals and lack of fresh water dispenser refill.',
    location: 'Main Campus Food Court, Counter 4',
    attachment: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=600',
    images: ['https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=600'],
    date: '09 Sep 2026',
    time: '01:30 PM',
    priority: 'High',
    status: 'Escalated',
    assignedStaff: 'Dr. Rajesh Sharma',
    assignedDepartment: 'Student Welfare & Food Safety Committee',
    staffRemarks: 'Escalated to Chief Proctor and Food Safety Inspector for unannounced inspection of contractor kitchen.',
    resolution: '',
    timeline: [
      {
        id: 'tl-41',
        title: 'Submitted',
        timestamp: '09 Sep 2026, 01:30 PM',
        description: 'Complaint submitted by Neha Joshi.',
        status: 'completed',
      },
      {
        id: 'tl-42',
        title: 'Under Review',
        timestamp: '09 Sep 2026, 03:00 PM',
        description: 'Mess supervisor notified.',
        status: 'completed',
        officer: 'Dr. Rajesh Sharma',
      },
      {
        id: 'tl-43',
        title: 'Escalated',
        timestamp: '10 Sep 2026, 10:00 AM',
        description: 'Escalated to University Food Quality Committee & Dean for contractual penalty evaluation.',
        status: 'current',
        officer: 'Dr. Rajesh Sharma',
      },
    ],
  },
  {
    id: 'PU-2026-0005',
    studentName: 'Kavya Nair',
    ugNumber: '24CS07821',
    department: 'Computer Science & Engineering',
    category: 'Library Services',
    subject: 'Digital repository terminal access error',
    title: 'Digital repository terminal access error',
    description:
      'Terminals 12 and 14 in the e-library section throw SSL certificate validation errors when accessing IEEE Xplore and Springer digital libraries.',
    location: 'Central Library, Ground Floor E-Resource Wing',
    attachment: '',
    images: [],
    date: '08 Sep 2026',
    time: '04:10 PM',
    priority: 'Low',
    status: 'Accepted',
    assignedStaff: 'Er. Vikram Patel',
    assignedDepartment: 'Campus IT & Infrastructure Services',
    staffRemarks: 'Ticket accepted. Subscribed proxy proxy certs need manual re-installation on workstation browser profiles.',
    resolution: '',
    timeline: [
      {
        id: 'tl-51',
        title: 'Submitted',
        timestamp: '08 Sep 2026, 04:10 PM',
        description: 'Complaint submitted by Kavya Nair.',
        status: 'completed',
      },
      {
        id: 'tl-52',
        title: 'Accepted',
        timestamp: '09 Sep 2026, 11:15 AM',
        description: 'Acknowledged and queued for IT technician visit.',
        status: 'current',
        officer: 'Er. Vikram Patel',
      },
    ],
  },
  {
    id: 'PU-2026-0006',
    studentName: 'Aditya Mehta',
    ugNumber: '22ME03982',
    department: 'Mechanical Engineering',
    category: 'Security & Safety',
    subject: 'Night path streetlight malfunction',
    title: 'Night path streetlight malfunction',
    description:
      'Three consecutive LED streetlights between Girls Hostel Block B and the Sports Complex are non-functional, causing safety concerns for evening library commuters.',
    location: 'Pathway between Hostel Block B and Sports Complex',
    attachment: '',
    images: [],
    date: '07 Sep 2026',
    time: '08:45 PM',
    priority: 'High',
    status: 'In Progress',
    assignedStaff: 'Dr. Rajesh Sharma',
    assignedDepartment: 'Campus Security & Electrical Wing',
    staffRemarks: 'Electrician team identified underground cable fault; trench repair scheduled today.',
    resolution: '',
    timeline: [
      {
        id: 'tl-61',
        title: 'Submitted',
        timestamp: '07 Sep 2026, 08:45 PM',
        description: 'Complaint submitted by Aditya Mehta.',
        status: 'completed',
      },
      {
        id: 'tl-62',
        title: 'Accepted',
        timestamp: '08 Sep 2026, 09:00 AM',
        description: 'Campus Security Chief reviewed and assigned to electrical maintenance.',
        status: 'completed',
        officer: 'Dr. Rajesh Sharma',
      },
      {
        id: 'tl-63',
        title: 'In Progress',
        timestamp: '08 Sep 2026, 02:30 PM',
        description: 'Underground wiring inspection and bulb replacement in progress.',
        status: 'current',
        officer: 'Dr. Rajesh Sharma',
      },
    ],
  },
  {
    id: 'PU-2026-0007',
    studentName: 'Siddharth Rao',
    ugNumber: '23CS12345',
    department: 'Computer Science & Engineering',
    category: 'Staff and academic problem',
    subject: 'Continuous delay in internal assessment marks upload',
    title: 'Continuous delay in internal assessment marks upload',
    description:
      'Mid-semester internal evaluation marks for Advanced Algorithms course have not been uploaded to the student portal despite the deadline passing 10 days ago.',
    location: 'Faculty of Engineering, Department Office',
    attachment: '',
    images: [],
    date: '06 Sep 2026',
    time: '11:20 AM',
    priority: 'Medium',
    status: 'In Progress',
    assignedStaff: 'Prof. Ananya Desai',
    assignedDepartment: 'Academic Grievance Cell',
    staffRemarks: 'Consulted faculty coordinator. Marks will be entered into portal by tomorrow morning.',
    resolution: '',
    timeline: [
      {
        id: 'tl-71',
        title: 'Submitted',
        timestamp: '06 Sep 2026, 11:20 AM',
        description: 'Grievance submitted by Siddharth Rao.',
        status: 'completed',
      },
      {
        id: 'tl-72',
        title: 'Accepted',
        timestamp: '06 Sep 2026, 03:00 PM',
        description: 'Assigned to Dean of Academics.',
        status: 'completed',
        officer: 'Prof. Ananya Desai',
      },
      {
        id: 'tl-73',
        title: 'In Progress',
        timestamp: '07 Sep 2026, 10:30 AM',
        description: 'Faculty coordinator contacted for immediate scorecard release.',
        status: 'current',
        officer: 'Prof. Ananya Desai',
      },
    ],
  },
  {
    id: 'PU-2026-0008',
    studentName: 'Tanvi Shah',
    ugNumber: '24BA05119',
    department: 'Business Administration',
    category: 'Events problem',
    subject: 'Annual cultural fest delegate passes distribution glitch',
    title: 'Annual cultural fest delegate passes distribution glitch',
    description:
      'Digital QR pass was not generated after registration on the university event portal for Dhoom Cultural Fest competition.',
    location: 'Open Air Theatre / Student Activity Centre',
    attachment: '',
    images: [],
    date: '05 Sep 2026',
    time: '04:45 PM',
    priority: 'Low',
    status: 'Accepted',
    assignedStaff: 'Unassigned',
    assignedDepartment: 'Student Events & Cultural Council',
    staffRemarks: 'Student Activity Centre technical desk reviewing registration ledger.',
    resolution: '',
    timeline: [
      {
        id: 'tl-81',
        title: 'Submitted',
        timestamp: '05 Sep 2026, 04:45 PM',
        description: 'Complaint submitted by Tanvi Shah.',
        status: 'completed',
      },
      {
        id: 'tl-82',
        title: 'Accepted',
        timestamp: '06 Sep 2026, 09:15 AM',
        description: 'Transferred to Cultural Council help desk.',
        status: 'current',
      },
    ],
  },
  {
    id: 'PU-2026-0009',
    studentName: 'Anonymous Student',
    ugNumber: '23CS12345',
    department: 'Faculty of Engineering',
    category: 'Harassment',
    subject: 'Ragging and intimidating behavior near hostel cafeteria',
    title: 'Ragging and intimidating behavior near hostel cafeteria',
    description:
      'Group of senior students gathering late night and intimidating 1st year students on pathway leading to cafeteria. Requesting heightened proctor vigilance.',
    location: 'Pathway near Block H-1 Cafeteria',
    attachment: '',
    images: [],
    date: '04 Sep 2026',
    time: '10:15 PM',
    priority: 'High',
    status: 'In Progress',
    assignedStaff: 'Dr. Rajesh Sharma',
    assignedDepartment: 'Anti-Ragging & Discipline Squad',
    staffRemarks: 'Confidential investigation initiated. Security patrols doubled during 9:30 PM - 1:00 AM window.',
    resolution: '',
    timeline: [
      {
        id: 'tl-91',
        title: 'Submitted (Confidential)',
        timestamp: '04 Sep 2026, 10:15 PM',
        description: 'Complaint registered directly with Anti-Ragging Committee.',
        status: 'completed',
      },
      {
        id: 'tl-92',
        title: 'Immediate Action Taken',
        timestamp: '04 Sep 2026, 10:45 PM',
        description: 'Chief Proctor notified and night patrol dispatched.',
        status: 'completed',
        officer: 'Dr. Rajesh Sharma',
      },
      {
        id: 'tl-93',
        title: 'In Progress',
        timestamp: '05 Sep 2026, 08:00 AM',
        description: 'CCTV footage review underway.',
        status: 'current',
        officer: 'Dr. Rajesh Sharma',
      },
    ],
  },
  {
    id: 'PU-2026-0010',
    studentName: 'Rohan Sharma',
    ugNumber: '23CS12345',
    department: 'Computer Science & Engineering',
    category: 'Others',
    subject: 'Request for additional bicycle parking rack near Gate 2',
    title: 'Request for additional bicycle parking rack near Gate 2',
    description:
      'Existing bicycle stand is constantly overcrowded leading to cycles getting damaged or parked haphazardly on pedestrian footpaths.',
    location: 'Main University Entrance Gate 2',
    attachment: '',
    images: [],
    date: '03 Sep 2026',
    time: '01:00 PM',
    priority: 'Low',
    status: 'Accepted',
    assignedStaff: 'Dr. Rajesh Sharma',
    assignedDepartment: 'Estate Infrastructure Division',
    staffRemarks: 'Civil contractor requested to install two additional 10-slot bicycle stands.',
    resolution: '',
    timeline: [
      {
        id: 'tl-101',
        title: 'Submitted',
        timestamp: '03 Sep 2026, 01:00 PM',
        description: 'Grievance submitted by Rohan Sharma.',
        status: 'completed',
      },
      {
        id: 'tl-102',
        title: 'Accepted',
        timestamp: '04 Sep 2026, 11:00 AM',
        description: 'Reviewed and forwarded to Estate engineering team.',
        status: 'current',
        officer: 'Dr. Rajesh Sharma',
      },
    ],
  },
];

// Event helper to broadcast changes across tabs / views
export const notifyComplaintsUpdated = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('pu_complaints_updated'));
    window.dispatchEvent(new Event('storage'));
  }
};

// ============================================
// COMPLAINTS REPOSITORY (localStorage: "complaints")
// ============================================
export const getStoredComplaints = (): ComplaintRecord[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_COMPLAINTS);
    if (!raw) {
      // In a fresh clean state, start with an empty complaint list
      localStorage.setItem(STORAGE_KEY_COMPLAINTS, JSON.stringify([]));
      return [];
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      // Ensure all items conform to ComplaintRecord (title == subject, images, etc.)
      return parsed.map((item: any) => ({
        ...item,
        category: item.category === 'Campus Wi-Fi & IT' ? 'Campus problem' : item.category,
        subject: item.subject || item.title || 'Campus Issue',
        title: item.title || item.subject || 'Campus Issue',
        images: Array.isArray(item.images) ? item.images : item.attachment ? [item.attachment] : [],
        priority: item.priority || 'Medium',
        status: item.status || 'Submitted',
        studentName: item.studentName || 'Student',
        ugNumber: item.ugNumber || '23PU1000',
        department: item.department || 'General Academic',
        resolutionSteps: Array.isArray(item.resolutionSteps) ? item.resolutionSteps : [],
        resolutionAttachments: Array.isArray(item.resolutionAttachments) ? item.resolutionAttachments : [],
        resolutionSummary: item.resolutionSummary || item.resolution || '',
        rootCause: item.rootCause || '',
        preventativeMeasures: item.preventativeMeasures || '',
        costIncurred: item.costIncurred || '',
        resolvedAt: item.resolvedAt || '',
        resolvedBy: item.resolvedBy || '',
      }));
    }
    return [];
  } catch (err) {
    console.error('Error reading complaints from localStorage', err);
    return [];
  }
};

export const saveStoredComplaints = (complaints: ComplaintRecord[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY_COMPLAINTS, JSON.stringify(complaints));
    notifyComplaintsUpdated();
  } catch (err) {
    console.error('Error saving complaints to localStorage', err);
  }
};

export const addComplaint = (complaintData: Partial<ComplaintRecord>): ComplaintRecord => {
  const all = getStoredComplaints();
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

  const id =
    complaintData.id ||
    `PU-${now.getFullYear()}-${String(all.length + 1).padStart(4, '0')}`;

  const subject = complaintData.subject || complaintData.title || 'General Grievance';
  const newRecord: ComplaintRecord = {
    id,
    studentName: complaintData.studentName || 'Student',
    ugNumber: complaintData.ugNumber || '23PU00000',
    department: complaintData.department || 'Academic Department',
    category: complaintData.category || 'Hostel & Accommodation',
    subject,
    title: subject,
    description: complaintData.description || '',
    location: complaintData.location || 'Campus Premises',
    attachment: complaintData.attachment || (complaintData.images && complaintData.images[0]) || '',
    images: complaintData.images || (complaintData.attachment ? [complaintData.attachment] : []),
    date: complaintData.date || dateStr,
    time: complaintData.time || timeStr,
    priority: complaintData.priority || 'Medium',
    status: 'Submitted',
    assignedStaff: 'Unassigned',
    assignedDepartment: complaintData.category ? `${complaintData.category} Wing` : 'Grievance Redressal Cell',
    staffRemarks: 'Complaint submitted. Waiting for staff acknowledgment.',
    resolution: '',
    timeline: [
      {
        id: `tl-${Date.now()}-1`,
        title: 'Complaint Submitted',
        timestamp: `${dateStr}, ${timeStr}`,
        description: 'Complaint submitted by student and recorded in university system.',
        status: 'completed',
      },
      {
        id: `tl-${Date.now()}-2`,
        title: 'Under Review',
        timestamp: 'Awaiting Staff Review',
        description: 'University staff will review and accept the complaint shortly.',
        status: 'current',
      },
    ],
  };

  const updated = [newRecord, ...all];
  saveStoredComplaints(updated);

  // Sync with backend API in background
  apiClient.createComplaint(newRecord).catch((err) => {
    console.debug('Backend createComplaint queued/deferred:', err?.message);
  });

  return newRecord;
};

export const updateComplaint = (
  id: string,
  updates: Partial<ComplaintRecord>
): ComplaintRecord | null => {
  const all = getStoredComplaints();
  const index = all.findIndex((c) => c.id === id);
  if (index === -1) return null;

  const existing = all[index];
  const updatedRecord: ComplaintRecord = {
    ...existing,
    ...updates,
    title: updates.subject || updates.title || existing.title || existing.subject,
    subject: updates.subject || updates.title || existing.subject || existing.title,
  };

  all[index] = updatedRecord;
  saveStoredComplaints(all);

  // Sync status or resolution updates to backend
  if (updates.status) {
    apiClient
      .updateStatus(id, updates.status, updates.staffRemarks, updates.resolvedBy || existing.assignedStaff)
      .catch((err) => console.debug('Backend updateStatus deferred:', err?.message));
  }

  return updatedRecord;
};

// ============================================
// STAFF ACTIONS IMPLEMENTATION
// ============================================
export const acceptComplaint = (id: string, staffName: string): ComplaintRecord | null => {
  const all = getStoredComplaints();
  const c = all.find((item) => item.id === id);
  if (!c) return null;

  const now = new Date();
  const timestamp = `${now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}, ${now.toLocaleTimeString(
    'en-US',
    { hour: '2-digit', minute: '2-digit', hour12: true }
  )}`;

  const timeline = c.timeline ? [...c.timeline] : [];
  timeline.push({
    id: `tl-${Date.now()}`,
    title: 'Complaint Accepted',
    timestamp,
    description: `Complaint accepted by ${staffName} for formal resolution.`,
    status: 'completed',
    officer: staffName,
  });

  return updateComplaint(id, {
    status: 'Accepted',
    assignedStaff: staffName,
    staffRemarks: `Accepted by ${staffName}. Processing inspection and action plan.`,
    timeline,
  });
};

export const assignStaffToComplaint = (
  id: string,
  staffName: string,
  department?: string
): ComplaintRecord | null => {
  const all = getStoredComplaints();
  const c = all.find((item) => item.id === id);
  if (!c) return null;

  const now = new Date();
  const timestamp = `${now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}, ${now.toLocaleTimeString(
    'en-US',
    { hour: '2-digit', minute: '2-digit', hour12: true }
  )}`;

  const timeline = c.timeline ? [...c.timeline] : [];
  timeline.push({
    id: `tl-${Date.now()}`,
    title: 'Staff Assigned',
    timestamp,
    description: `Assigned to ${staffName}${department ? ` (${department})` : ''}.`,
    status: 'completed',
    officer: staffName,
  });

  return updateComplaint(id, {
    assignedStaff: staffName,
    assignedDepartment: department || c.assignedDepartment,
    staffRemarks: `Assigned to ${staffName} for active resolution.`,
    timeline,
  });
};

export const setComplaintInProgress = (id: string, staffName: string): ComplaintRecord | null => {
  const all = getStoredComplaints();
  const c = all.find((item) => item.id === id);
  if (!c) return null;

  const now = new Date();
  const timestamp = `${now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}, ${now.toLocaleTimeString(
    'en-US',
    { hour: '2-digit', minute: '2-digit', hour12: true }
  )}`;

  const timeline = c.timeline ? [...c.timeline] : [];
  timeline.push({
    id: `tl-${Date.now()}`,
    title: 'Work In Progress',
    timestamp,
    description: `Investigation and corrective actions commenced by ${staffName}.`,
    status: 'current',
    officer: staffName,
  });

  return updateComplaint(id, {
    status: 'In Progress',
    assignedStaff: c.assignedStaff === 'Unassigned' ? staffName : c.assignedStaff,
    staffRemarks: `Active work in progress by ${staffName}.`,
    timeline,
  });
};

export const addStaffRemarkToComplaint = (
  id: string,
  remark: string,
  staffName: string
): ComplaintRecord | null => {
  const all = getStoredComplaints();
  const c = all.find((item) => item.id === id);
  if (!c) return null;

  const now = new Date();
  const timestamp = `${now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}, ${now.toLocaleTimeString(
    'en-US',
    { hour: '2-digit', minute: '2-digit', hour12: true }
  )}`;

  const timeline = c.timeline ? [...c.timeline] : [];
  timeline.push({
    id: `tl-${Date.now()}`,
    title: 'Staff Remark Added',
    timestamp,
    description: `"${remark}"`,
    status: 'completed',
    officer: staffName,
  });

  return updateComplaint(id, {
    staffRemarks: remark,
    timeline,
  });
};

export const resolveComplaint = (
  id: string,
  resolutionNotes: string,
  staffName: string
): ComplaintRecord | null => {
  const all = getStoredComplaints();
  const c = all.find((item) => item.id === id);
  if (!c) return null;

  const now = new Date();
  const timestamp = `${now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}, ${now.toLocaleTimeString(
    'en-US',
    { hour: '2-digit', minute: '2-digit', hour12: true }
  )}`;

  const timeline = c.timeline ? [...c.timeline] : [];
  timeline.push({
    id: `tl-${Date.now()}`,
    title: 'Resolved',
    timestamp,
    description: resolutionNotes || 'Grievance successfully addressed and verified by staff.',
    status: 'completed',
    officer: staffName,
  });

  return updateComplaint(id, {
    status: 'Resolved',
    resolution: resolutionNotes || 'Issue addressed and resolved by department.',
    staffRemarks: `Issue successfully resolved by ${staffName}.`,
    timeline,
  });
};

export interface ResolutionReportPayload {
  complaintId: string;
  resolutionSummary: string;
  steps: ResolutionStep[];
  attachments: ResolutionProofAttachment[];
  rootCause?: string;
  preventativeMeasures?: string;
  costIncurred?: string;
  markAsResolved: boolean;
  staffName: string;
}

export const saveResolutionActionReport = (
  payload: ResolutionReportPayload
): ComplaintRecord | null => {
  const all = getStoredComplaints();
  const c = all.find((item) => item.id === payload.complaintId);
  if (!c) return null;

  const now = new Date();
  const timestamp = `${now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}, ${now.toLocaleTimeString(
    'en-US',
    { hour: '2-digit', minute: '2-digit', hour12: true }
  )}`;

  const timeline = c.timeline ? [...c.timeline] : [];

  if (payload.markAsResolved) {
    timeline.push({
      id: `tl-${Date.now()}`,
      title: 'Resolution Completed & Verified',
      timestamp,
      description:
        payload.resolutionSummary ||
        `Grievance formally addressed with ${payload.steps.length} verified action steps and ${payload.attachments.length} work proof attachments.`,
      status: 'completed',
      officer: payload.staffName,
    });
  } else {
    timeline.push({
      id: `tl-${Date.now()}`,
      title: 'Resolution Steps Logged',
      timestamp,
      description: `${payload.steps.length} resolution step(s) recorded and ${payload.attachments.length} proof document(s) uploaded by ${payload.staffName}.`,
      status: 'current',
      officer: payload.staffName,
    });
  }

  const updates: Partial<ComplaintRecord> = {
    resolutionSteps: payload.steps,
    resolutionAttachments: payload.attachments,
    resolutionSummary: payload.resolutionSummary,
    rootCause: payload.rootCause,
    preventativeMeasures: payload.preventativeMeasures,
    costIncurred: payload.costIncurred,
    resolvedBy: payload.staffName,
    timeline,
  };

  if (payload.markAsResolved) {
    updates.status = 'Resolved';
    updates.resolution = payload.resolutionSummary;
    updates.resolvedAt = timestamp;
    updates.staffRemarks = `Resolved by ${payload.staffName}: ${payload.resolutionSummary.slice(0, 100)}`;
  } else {
    if (
      c.status === 'Submitted' ||
      c.status === 'Accepted' ||
      c.status === 'Under Review' ||
      c.status === 'Pending'
    ) {
      updates.status = 'In Progress';
      updates.staffRemarks = `Active steps being carried out by ${payload.staffName} (${payload.steps.length} steps recorded).`;
    }
  }

  // Trigger backend API upload
  apiClient
    .saveResolutionSteps(payload.complaintId, {
      steps: payload.steps,
      attachments: payload.attachments,
      resolutionSummary: payload.resolutionSummary,
      rootCause: payload.rootCause,
      preventativeMeasures: payload.preventativeMeasures,
      markResolved: payload.markAsResolved,
      officer: payload.staffName,
    })
    .catch((err) => {
      console.debug('Backend saveResolutionSteps deferred:', err?.message);
    });

  return updateComplaint(payload.complaintId, updates);
};

export const escalateComplaint = (
  id: string,
  escalationReason: string,
  staffName: string
): ComplaintRecord | null => {
  const all = getStoredComplaints();
  const c = all.find((item) => item.id === id);
  if (!c) return null;

  const now = new Date();
  const timestamp = `${now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}, ${now.toLocaleTimeString(
    'en-US',
    { hour: '2-digit', minute: '2-digit', hour12: true }
  )}`;

  const timeline = c.timeline ? [...c.timeline] : [];
  timeline.push({
    id: `tl-${Date.now()}`,
    title: 'Escalated',
    timestamp,
    description: `Escalated by ${staffName}: ${escalationReason}`,
    status: 'current',
    officer: staffName,
  });

  return updateComplaint(id, {
    status: 'Escalated',
    priority: 'High',
    staffRemarks: `ESCALATED: ${escalationReason}`,
    timeline,
  });
};

export const reopenComplaint = (
  id: string,
  reason: string,
  staffName: string
): ComplaintRecord | null => {
  const all = getStoredComplaints();
  const c = all.find((item) => item.id === id);
  if (!c) return null;

  const now = new Date();
  const timestamp = `${now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}, ${now.toLocaleTimeString(
    'en-US',
    { hour: '2-digit', minute: '2-digit', hour12: true }
  )}`;

  const timeline = c.timeline ? [...c.timeline] : [];
  timeline.push({
    id: `tl-${Date.now()}`,
    title: 'Complaint Reopened',
    timestamp,
    description: `Reopened by ${staffName}: ${reason}`,
    status: 'current',
    officer: staffName,
  });

  return updateComplaint(id, {
    status: 'Reopened',
    staffRemarks: `Reopened for review: ${reason}`,
    resolution: '',
    timeline,
  });
};

// ============================================
// STAFF ACCOUNTS & SESSION REPOSITORY
// ============================================
export const getStaffAccounts = (): StaffAccount[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_STAFF_ACCOUNTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_STAFF_ACCOUNTS, JSON.stringify(INITIAL_STAFF_ACCOUNTS));
      return INITIAL_STAFF_ACCOUNTS;
    }
    const parsed = JSON.parse(raw);
    let accounts: StaffAccount[] = Array.isArray(parsed) ? parsed : INITIAL_STAFF_ACCOUNTS;
    const existing = accounts.find((a) => a.staffId?.toLowerCase() === '26ug030984');
    if (existing) {
      existing.password = 'Admin@2026';
      existing.staffId = '26UG030984';
    } else {
      accounts = [INITIAL_STAFF_ACCOUNTS[0], ...accounts];
      localStorage.setItem(STORAGE_KEY_STAFF_ACCOUNTS, JSON.stringify(accounts));
    }
    return accounts;
  } catch {
    return INITIAL_STAFF_ACCOUNTS;
  }
};

export const getActiveStaffSession = (): StaffAccount | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_STAFF_SESSION);
    if (!raw) return null;
    const session = JSON.parse(raw);
    return session?.staffId ? session : null;
  } catch {
    return null;
  }
};

export const saveActiveStaffSession = (account: StaffAccount): void => {
  try {
    localStorage.setItem(STORAGE_KEY_STAFF_SESSION, JSON.stringify(account));
  } catch {}
};

export const clearActiveStaffSession = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY_STAFF_SESSION);
  } catch {}
};

export const updateStaffProfile = (updated: Partial<StaffAccount>): StaffAccount | null => {
  const current = getActiveStaffSession();
  if (!current) return null;

  const merged: StaffAccount = {
    ...current,
    ...updated,
  };

  saveActiveStaffSession(merged);

  // Also update in registered staff list
  const allStaff = getStaffAccounts();
  const idx = allStaff.findIndex((s) => s.staffId === current.staffId);
  if (idx !== -1) {
    allStaff[idx] = merged;
    localStorage.setItem(STORAGE_KEY_STAFF_ACCOUNTS, JSON.stringify(allStaff));
  }

  return merged;
};

// ============================================
// BACKEND REST API SYNCHRONIZATION
// ============================================
let isSyncingBackend = false;
let lastBackendHealthSnapshot: BackendHealthResponse | null = null;

export const checkBackendHealthStatus = async (): Promise<BackendHealthResponse | null> => {
  try {
    const health = await apiClient.checkHealth();
    lastBackendHealthSnapshot = health;
    return health;
  } catch {
    lastBackendHealthSnapshot = null;
    return null;
  }
};

export const getLastBackendHealth = (): BackendHealthResponse | null => lastBackendHealthSnapshot;

export const syncComplaintsWithBackend = async (): Promise<ComplaintRecord[]> => {
  if (isSyncingBackend) return getStoredComplaints();
  isSyncingBackend = true;
  try {
    const serverComplaints = await apiClient.getComplaints();
    if (Array.isArray(serverComplaints)) {
      // Backend is authoritative: sync accurately with server state
      localStorage.setItem(STORAGE_KEY_COMPLAINTS, JSON.stringify(serverComplaints));
      notifyComplaintsUpdated();
      return serverComplaints;
    }
  } catch (err: any) {
    console.debug('Backend sync deferred (offline or dev server):', err?.message);
  } finally {
    isSyncingBackend = false;
  }
  return getStoredComplaints();
};

/**
 * Clean All Data across Frontend and Backend
 * Empties all complaints, resets test logs, keeps clean static students, and regenerates Excel registry
 */
export const cleanAllData = async (): Promise<{ success: boolean; message: string }> => {
  try {
    await apiClient.cleanAllData();
  } catch (err) {
    console.warn('Backend cleanData notice:', err);
  }

  // Clear local storage complaints to empty array
  localStorage.setItem(STORAGE_KEY_COMPLAINTS, JSON.stringify([]));

  // Remove test drafts, session caches, and mock states
  try {
    localStorage.removeItem('pu_complaint_form_draft');
    localStorage.removeItem('pu_admin_token');
    localStorage.removeItem('pu_active_staff_session');
    localStorage.removeItem('pu_active_session_v2');
  } catch {}

  notifyComplaintsUpdated();
  return {
    success: true,
    message: 'All frontend and backend data cleaned successfully. System is fresh and ready for new complaints.',
  };
};

/**
 * Optional helper to load demo complaints if testing is desired
 */
export const loadDemoComplaints = (): void => {
  localStorage.setItem(STORAGE_KEY_COMPLAINTS, JSON.stringify(INITIAL_DEMO_COMPLAINTS));
  notifyComplaintsUpdated();
};

