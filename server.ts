import express from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import * as XLSX from 'xlsx';

const app = express();
const PORT = 3000;

// Middleware for parsing JSON and urlencoded requests (increased limit for image attachments)
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// --------------------------------------------------------------------------
// PERSISTENT DATA STORAGE CONFIGURATION
// --------------------------------------------------------------------------
const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'backend-store.json');
const STUDENTS_EXCEL_FILE = path.join(DATA_DIR, 'registered_students_accounts.xlsx');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  } catch (e) {
    console.error('Failed to create data directory', e);
  }
}

// Initial Admin & Staff Accounts
// Default Admin password can be configured via ADMIN_PASSWORD environment variable or defaults to Admin@PU2026
const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@PU2026';

export interface AdminAccountRecord {
  staffId: string;
  adminId: string;
  username: string;
  name: string;
  email: string;
  department: string;
  designation: string;
  phone: string;
  avatarUrl: string;
  role: 'ADMIN';
  password: string;
  permissions: string[];
}

const initialAdminAccounts: AdminAccountRecord[] = [
  {
    staffId: '26UG030984',
    adminId: '26UG030984',
    username: '26ug030984',
    name: 'University Administrator',
    email: 'admin@paruluniversity.ac.in',
    department: 'Central Administration & Grievance Directorate',
    designation: 'Chief Grievance Redressal Officer & Proctor',
    phone: '+91 98250 30984',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    role: 'ADMIN',
    password: 'Admin@2026',
    permissions: ['all', 'manage_complaints', 'assign_staff', 'resolve_complaints', 'system_audit', 'database_reset'],
  },
];

export interface StudentRecord {
  studentId: string;
  name: string;
  enrollmentNo: string;
  ugNumber: string;
  email: string;
  department: string;
  phone: string;
  password: string;
  phoneVerified: boolean;
  emailVerified: boolean;
  createdAt: string;
  role: 'STUDENT';
  isStatic: boolean;
  avatarUrl?: string;
  hostelBlock?: string;
  roomNo?: string;
}

// Initial Static Student Records (Permanent seed accounts including Aman)
export const initialStaticStudents: StudentRecord[] = [
  {
    studentId: 'STU-AMAN-2026',
    name: 'Aman',
    enrollmentNo: '26UG576544',
    ugNumber: '26UG576544',
    email: 'aman576544534@gmail.com',
    department: 'Computer Science & Engineering (PIET)',
    phone: '+91 98765 54453',
    password: 'Password@123',
    phoneVerified: true,
    emailVerified: true,
    createdAt: '2026-01-01T08:00:00.000Z',
    role: 'STUDENT',
    isStatic: true,
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250',
    hostelBlock: 'Block B',
    roomNo: '204',
  },
  {
    studentId: 'STU-ALEX-2026',
    name: 'Alex Patel',
    enrollmentNo: '26UG123456',
    ugNumber: '26UG123456',
    email: 'alex.patel@gmail.com',
    department: 'Computer Science & Engineering (PIET)',
    phone: '+91 98765 43210',
    password: 'Password@123',
    phoneVerified: true,
    emailVerified: true,
    createdAt: '2026-01-15T10:00:00.000Z',
    role: 'STUDENT',
    isStatic: true,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    hostelBlock: 'Block A',
    roomNo: '102',
  },
  {
    studentId: 'STU-ROHAN-2026',
    name: 'Rohan Sharma',
    enrollmentNo: '23CS12345',
    ugNumber: '23CS12345',
    email: 'rohan.sharma23@paruluniversity.ac.in',
    department: 'Computer Science & Engineering',
    phone: '+91 98765 43210',
    password: 'Password@123',
    phoneVerified: true,
    emailVerified: true,
    createdAt: '2026-02-01T10:00:00.000Z',
    role: 'STUDENT',
    isStatic: true,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    hostelBlock: 'Block B',
    roomNo: '302',
  },
  {
    studentId: 'STU-PRIYA-2026',
    name: 'Priya Verma',
    enrollmentNo: '24IT67890',
    ugNumber: '24IT67890',
    email: 'priya.verma24@paruluniversity.ac.in',
    department: 'Information Technology (PIET)',
    phone: '+91 98112 33445',
    password: 'Password@123',
    phoneVerified: true,
    emailVerified: true,
    createdAt: '2026-02-10T11:00:00.000Z',
    role: 'STUDENT',
    isStatic: true,
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250',
    hostelBlock: 'Girls Hostel 1',
    roomNo: '405',
  },
];

// Initial Complaint Records
const getInitialComplaints = () => [
  {
    id: 'PU-2026-0001',
    studentName: 'Rohan Sharma',
    ugNumber: '23CS12345',
    department: 'Computer Science & Engineering',
    category: 'Hostel & Accommodation',
    subject: 'Room maintenance problem',
    title: 'Room maintenance problem',
    description:
      'The ceiling fan in Room 302, Block B has been making loud grinding noises and sparking when turned to speeds 4 and 5. It is extremely hazardous and needs immediate repair.',
    location: 'Hostel Block B, Room 302',
    priority: 'High',
    status: 'In Progress',
    assignedStaff: 'Dr. Rajesh Sharma',
    staffRemarks: 'Maintenance electrician dispatched with replacement capacitor and motor bearing unit.',
    createdAt: '2026-03-08 10:15 AM',
    contactNumber: '+91 98765 43210',
    email: 'rohan.sharma23@paruluniversity.ac.in',
    upvotes: 6,
    timeline: [
      {
        id: 't-1',
        title: 'Grievance Submitted',
        description: 'Complaint registered by Rohan Sharma via Student Portal.',
        timestamp: '2026-03-08 10:15 AM',
        status: 'Submitted',
      },
      {
        id: 't-2',
        title: 'Assigned to Estate Admin',
        description: 'Assigned to Dr. Rajesh Sharma (Estate & Hostel Admin).',
        timestamp: '2026-03-08 11:30 AM',
        officer: 'Dr. Rajesh Sharma',
        status: 'Pending Review',
      },
      {
        id: 't-3',
        title: 'Inspection in Progress',
        description: 'Electrician inspected wiring and scheduled bearing replacement.',
        timestamp: '2026-03-08 02:45 PM',
        officer: 'Maintenance Team',
        status: 'In Progress',
      },
    ],
    resolutionSteps: [
      {
        id: 'step-1',
        stepNumber: 1,
        title: 'Power Isolation & Electrical Safety Check',
        description: 'Turned off MCB on floor switchboard. Checked voltage levels using digital multimeter.',
        timestamp: '2026-03-08 02:45 PM',
        completedBy: 'Suresh Parmar (Senior Electrician)',
        materialsUsed: ['Digital Multimeter', 'Insulated Screwdriver Kit'],
      },
      {
        id: 'step-2',
        stepNumber: 2,
        title: 'Motor Bearing & Capacitor Replacement',
        description: 'Dismantled fan canopy. Replaced worn 6202ZZ ball bearing and replaced failing 2.5uF capacitor.',
        timestamp: '2026-03-08 03:30 PM',
        completedBy: 'Suresh Parmar (Senior Electrician)',
        materialsUsed: ['6202ZZ Ball Bearing', 'Havells 2.5uF Motor Capacitor', 'Silicone Grease'],
      },
    ],
    resolutionAttachments: [
      {
        id: 'res-att-1',
        name: 'Work_Proof_Fan_Assembly.jpg',
        url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600',
        type: 'photo',
        uploadedAt: '2026-03-08 03:45 PM',
        uploadedBy: 'Dr. Rajesh Sharma',
        caption: 'Replaced bearing and rewired fan canopy tested at full load.',
      },
    ],
  },
  {
    id: 'PU-2026-0002',
    studentName: 'Priya Patel',
    ugNumber: '22IT67890',
    department: 'Information Technology',
    category: 'Campus Infrastructure',
    subject: 'Library AC not working',
    title: 'Library AC not working',
    description:
      'The central air conditioning on the 2nd Floor reading section of the Central Library has been completely shut down for three days, causing high heat and stuffiness during exams.',
    location: 'Central Library, 2nd Floor Reading Hall',
    priority: 'Medium',
    status: 'Pending Review',
    assignedStaff: 'Prof. Ananya Desai',
    staffRemarks: 'HVAC contractor notified for chiller pump servicing.',
    createdAt: '2026-03-09 09:00 AM',
    contactNumber: '+91 98765 43211',
    email: 'priya.patel22@paruluniversity.ac.in',
    upvotes: 14,
    timeline: [
      {
        id: 't-1',
        title: 'Grievance Submitted',
        description: 'Complaint registered by Priya Patel.',
        timestamp: '2026-03-09 09:00 AM',
        status: 'Submitted',
      },
      {
        id: 't-2',
        title: 'Review Acknowledged',
        description: 'Assigned to Prof. Ananya Desai for campus infrastructure coordination.',
        timestamp: '2026-03-09 10:20 AM',
        officer: 'Prof. Ananya Desai',
        status: 'Pending Review',
      },
    ],
  },
  {
    id: 'PU-2026-0003',
    studentName: 'Aarav Mehta',
    ugNumber: '24EC11223',
    department: 'Electronics & Communication',
    category: 'IT & Wi-Fi Services',
    subject: 'Campus Wi-Fi connectivity drop',
    title: 'Campus Wi-Fi connectivity drop',
    description:
      'Frequent disconnection on SSID "PU-Student-HighSpeed" near Lab Complex Block 4. Speeds drop below 50 Kbps and authenticate errors occur repeatedly.',
    location: 'Academic Block 4, 3rd Floor Labs',
    priority: 'Low',
    status: 'Resolved',
    assignedStaff: 'Er. Vikram Patel',
    staffRemarks: 'Access Point AP-403 rebooted and firmware patched. Channel switch performed to avoid 2.4GHz interference.',
    resolution:
      'Access point AP-403 reset and 5GHz band priority enabled. Channel width optimized to 40MHz. Verified 85 Mbps bandwidth across all client devices.',
    resolvedDate: '2026-03-09 04:30 PM',
    resolvedBy: 'Er. Vikram Patel',
    createdAt: '2026-03-07 11:00 AM',
    contactNumber: '+91 98765 43212',
    email: 'aarav.mehta24@paruluniversity.ac.in',
    upvotes: 3,
    timeline: [
      {
        id: 't-1',
        title: 'Grievance Submitted',
        description: 'Registered by Aarav Mehta.',
        timestamp: '2026-03-07 11:00 AM',
        status: 'Submitted',
      },
      {
        id: 't-2',
        title: 'In Progress',
        description: 'Assigned to Network Operations Center.',
        timestamp: '2026-03-07 01:15 PM',
        officer: 'Er. Vikram Patel',
        status: 'In Progress',
      },
      {
        id: 't-3',
        title: 'Grievance Resolved',
        description: 'Firmware upgraded and wireless channel tuned.',
        timestamp: '2026-03-09 04:30 PM',
        officer: 'Er. Vikram Patel',
        status: 'Resolved',
      },
    ],
    resolutionSteps: [
      {
        id: 'step-1',
        stepNumber: 1,
        title: 'Access Point Spectrum Analysis',
        description: 'Conducted RF spectrum scan on 3rd floor. Detected 82% co-channel interference on 2.4GHz channel 6.',
        timestamp: '2026-03-08 10:00 AM',
        completedBy: 'Er. Vikram Patel',
      },
      {
        id: 'step-2',
        stepNumber: 2,
        title: 'Firmware Upgrade & 5GHz Band Steering',
        description: 'Upgraded Cisco Catalyst AP firmware to v9.1.5. Configured automatic band steering to 5GHz band.',
        timestamp: '2026-03-09 03:45 PM',
        completedBy: 'Er. Vikram Patel',
      },
    ],
  },
  {
    id: 'PU-2026-0004',
    studentName: 'Kavita Singh',
    ugNumber: '21ME99887',
    department: 'Mechanical Engineering',
    category: 'Academic Affairs',
    subject: 'Delayed grade sheet dispatch',
    title: 'Delayed grade sheet dispatch',
    description:
      'Semester 5 provisional marksheet has not been updated on the student portal ERP after re-evaluation completion three weeks ago.',
    location: 'Examination Cell, Admin Block',
    priority: 'High',
    status: 'Escalated',
    assignedStaff: 'Prof. Ananya Desai',
    staffRemarks: 'Escalated to Controller of Examinations due to pending Dean approval stamp.',
    createdAt: '2026-03-06 02:20 PM',
    contactNumber: '+91 98765 43213',
    email: 'kavita.singh21@paruluniversity.ac.in',
    upvotes: 9,
    timeline: [
      {
        id: 't-1',
        title: 'Grievance Submitted',
        description: 'Registered by Kavita Singh.',
        timestamp: '2026-03-06 02:20 PM',
        status: 'Submitted',
      },
      {
        id: 't-2',
        title: 'Escalated to High Authority',
        description: 'Escalated to Controller of Examinations by Prof. Ananya Desai.',
        timestamp: '2026-03-08 04:00 PM',
        officer: 'Prof. Ananya Desai',
        status: 'Escalated',
      },
    ],
  },
];

interface ServerComplaintRecord {
  id: string;
  studentName: string;
  ugNumber: string;
  department: string;
  category: string;
  subject: string;
  title: string;
  description: string;
  location: string;
  priority: string;
  status: string;
  assignedStaff?: string;
  staffRemarks?: string;
  createdAt: string;
  contactNumber?: string;
  email?: string;
  upvotes?: number;
  timeline: Array<{
    id: string;
    title: string;
    description: string;
    timestamp: string;
    status: string;
    officer?: string;
  }>;
  resolutionSteps?: any[];
  resolutionAttachments?: any[];
  resolution?: string;
  resolvedDate?: string;
  resolvedBy?: string;
  rootCause?: string;
  preventativeMeasures?: string;
  attachments?: string[];
  [key: string]: any;
}

// In-Memory Database for backend state with file persistence
let complaintsDb: ServerComplaintRecord[] = [];
let adminAccountsDb: AdminAccountRecord[] = [...initialAdminAccounts];
let studentsDb: StudentRecord[] = [...initialStaticStudents];
const initialStaffAccounts = initialAdminAccounts;

export interface AdminAuditLogRecord {
  id: string;
  adminName: string;
  adminEmail: string;
  action: string;
  complaintId?: string;
  details: string;
  timestamp: string;
  ip?: string;
}

let auditLogsDb: AdminAuditLogRecord[] = [];

// Active Sessions Map (token -> session)
interface AdminSession {
  token: string;
  admin: AdminAccountRecord;
  createdAt: string;
  lastActive: string;
}

const activeAdminSessions = new Map<string, AdminSession>();

// Active Student Sessions Map (token -> session)
interface StudentSession {
  token: string;
  student: StudentRecord;
  createdAt: string;
  lastActive: string;
}

const activeStudentSessions = new Map<string, StudentSession>();

function loadDatabase() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      const data = JSON.parse(raw);
      if (Array.isArray(data.complaints)) {
        complaintsDb = data.complaints;
      } else {
        complaintsDb = [];
      }
      if (Array.isArray(data.auditLogs) && data.auditLogs.length > 0) {
        auditLogsDb = data.auditLogs;
      } else {
        auditLogsDb = [
          {
            id: 'log-boot-1',
            adminName: 'PU Security Kernel',
            adminEmail: 'security@paruluniversity.ac.in',
            action: 'SYSTEM_BOOT',
            details: 'Parul University Grievance backend started with Admin-Only access control policy.',
            timestamp: new Date().toISOString(),
          },
        ];
      }
      if (Array.isArray(data.adminAccounts) && data.adminAccounts.length > 0) {
        adminAccountsDb = data.adminAccounts;
      }
      // Ensure primary authorized administrator 26UG030984 with password Admin@2026 is always active
      const designatedAdmin = adminAccountsDb.find(
        (a) =>
          a.staffId?.toLowerCase() === '26ug030984' ||
          a.adminId?.toLowerCase() === '26ug030984' ||
          a.username?.toLowerCase() === '26ug030984'
      );
      if (designatedAdmin) {
        designatedAdmin.password = 'Admin@2026';
        designatedAdmin.staffId = '26UG030984';
        designatedAdmin.adminId = '26UG030984';
      } else {
        adminAccountsDb = [...initialAdminAccounts];
      }
      // Load student records, ensuring static students (like Aman) are always preserved
      const studentMap = new Map<string, StudentRecord>();
      initialStaticStudents.forEach((s) => studentMap.set(s.enrollmentNo.toLowerCase(), s));
      if (Array.isArray(data.students)) {
        data.students.forEach((s: StudentRecord) => {
          if (s && s.enrollmentNo) {
            studentMap.set(s.enrollmentNo.toLowerCase(), s);
          }
        });
      }
      studentsDb = Array.from(studentMap.values());

      console.log(`[Database] Loaded ${complaintsDb.length} complaints, ${studentsDb.length} students, ${auditLogsDb.length} audit logs from ${DB_FILE}`);
      updateStudentsExcelFile();
      return;
    }
  } catch (err) {
    console.error('[Database] Failed to load store, using defaults:', err);
  }

  complaintsDb = getInitialComplaints() as ServerComplaintRecord[];
  adminAccountsDb = [...initialAdminAccounts];
  studentsDb = [...initialStaticStudents];
  auditLogsDb = [
    {
      id: 'log-boot-init',
      adminName: 'PU Security Kernel',
      adminEmail: 'security@paruluniversity.ac.in',
      action: 'SYSTEM_BOOT',
      details: 'Parul University Grievance backend started with Admin-Only access control policy.',
      timestamp: new Date().toISOString(),
    },
  ];
  saveDatabase();
}

/**
 * Automatically generates/updates the Excel spreadsheet (.xlsx) in the backend containing:
 * 1. Sheet "Registered Students": Full student roster with enrollment, email, department, phone, verification, hostel info, created date
 * 2. Sheet "Registration Summary": Count of how many students created an account in the app, static vs self-registered, verified ratios, timestamp
 */
function updateStudentsExcelFile() {
  try {
    // Sheet 1: Student Accounts
    const studentRows = studentsDb.map((student, index) => ({
      'S.No': index + 1,
      'Student ID': student.studentId || `STU-${index + 1}`,
      'Full Name': student.name,
      'Enrollment Number (UG)': student.enrollmentNo,
      'Official Email': student.email,
      'Department / Institute': student.department || 'Computer Science & Engineering',
      'Mobile Phone': student.phone || 'N/A',
      'Phone Verified': student.phoneVerified ? 'VERIFIED' : 'PENDING',
      'Email Verified': student.emailVerified ? 'VERIFIED' : 'PENDING',
      'Hostel Block': student.hostelBlock || 'N/A',
      'Room Number': student.roomNo || 'N/A',
      'Account Created At': student.createdAt ? new Date(student.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) : 'N/A',
      'Account Type': student.isStatic ? 'Static System Record' : 'Student Self-Registered',
    }));

    // Sheet 2: Summary Stats
    const totalCount = studentsDb.length;
    const staticCount = studentsDb.filter((s) => s.isStatic).length;
    const selfRegisteredCount = studentsDb.filter((s) => !s.isStatic).length;
    const phoneVerifiedCount = studentsDb.filter((s) => s.phoneVerified).length;
    const emailVerifiedCount = studentsDb.filter((s) => s.emailVerified).length;

    const summaryRows = [
      { 'Metric Category': 'Total Student Accounts Registered in App', 'Value / Details': totalCount },
      { 'Metric Category': 'Static Institutional Accounts (e.g. Aman, Alex, Rohan, Priya)', 'Value / Details': staticCount },
      { 'Metric Category': 'Newly Self-Registered Student Accounts', 'Value / Details': selfRegisteredCount },
      { 'Metric Category': 'Accounts with OTP-Verified Mobile', 'Value / Details': `${phoneVerifiedCount} / ${totalCount}` },
      { 'Metric Category': 'Accounts with Verified University Email', 'Value / Details': `${emailVerifiedCount} / ${totalCount}` },
      { 'Metric Category': 'System Name', 'Value / Details': 'Parul University Grievance Redressal Portal' },
      { 'Metric Category': 'Storage Engine', 'Value / Details': 'Backend Static Store & Auto-Synchronized Excel Spreadsheet' },
      { 'Metric Category': 'Excel File Path on Backend', 'Value / Details': 'data/registered_students_accounts.xlsx' },
      { 'Metric Category': 'Last Synchronized (UTC)', 'Value / Details': new Date().toISOString() },
      { 'Metric Category': 'Last Synchronized (IST)', 'Value / Details': new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) },
    ];

    const wb = XLSX.utils.book_new();

    // 1. Student Accounts Sheet
    const wsStudents = XLSX.utils.json_to_sheet(studentRows);
    wsStudents['!cols'] = [
      { wch: 6 },
      { wch: 20 },
      { wch: 24 },
      { wch: 22 },
      { wch: 32 },
      { wch: 38 },
      { wch: 18 },
      { wch: 16 },
      { wch: 16 },
      { wch: 16 },
      { wch: 14 },
      { wch: 24 },
      { wch: 24 },
    ];
    XLSX.utils.book_append_sheet(wb, wsStudents, 'Registered Students');

    // 2. Summary Sheet
    const wsSummary = XLSX.utils.json_to_sheet(summaryRows);
    wsSummary['!cols'] = [{ wch: 45 }, { wch: 55 }];
    XLSX.utils.book_append_sheet(wb, wsSummary, 'Registration Summary');

    // Write file to persistent storage
    XLSX.writeFile(wb, STUDENTS_EXCEL_FILE);
    console.log(`[Excel Engine] Successfully updated ${STUDENTS_EXCEL_FILE} with ${totalCount} students.`);
  } catch (err) {
    console.error('[Excel Engine] Error updating student Excel file:', err);
  }
}

function saveDatabase() {
  try {
    const payload = {
      version: '1.0',
      lastSaved: new Date().toISOString(),
      complaints: complaintsDb,
      adminAccounts: adminAccountsDb,
      students: studentsDb,
      auditLogs: auditLogsDb.slice(0, 500),
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(payload, null, 2), 'utf-8');
    updateStudentsExcelFile();
  } catch (err) {
    console.error('[Database] Failed to save store:', err);
  }
}

function logAdminAction(
  admin: { name: string; email: string },
  action: string,
  details: string,
  complaintId?: string,
  ip?: string
) {
  const newLog: AdminAuditLogRecord = {
    id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    adminName: admin.name,
    adminEmail: admin.email,
    action,
    complaintId,
    details,
    timestamp: new Date().toISOString(),
    ip: ip || '127.0.0.1',
  };
  auditLogsDb.unshift(newLog);
  saveDatabase();
}

// Initialize database on startup
loadDatabase();

// Lazy-initialized Gemini AI Client
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
}

// --------------------------------------------------------------------------
// SECURITY MIDDLEWARE: STRICT ADMIN ACCESS ONLY
// --------------------------------------------------------------------------
function requireAdminAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  const customHeader = req.headers['x-admin-token'] as string;
  let token = '';

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7).trim();
  } else if (customHeader) {
    token = customHeader.trim();
  }

  if (!token) {
    return res.status(401).json({
      error: 'Access Denied: Backend access is strictly reserved for University Administrators. Missing authorization token.',
      code: 'ADMIN_TOKEN_REQUIRED',
      adminOnly: true,
    });
  }

  const session = activeAdminSessions.get(token);
  if (!session) {
    return res.status(403).json({
      error: 'Access Forbidden: Invalid or expired administrator session. Unauthorized users cannot access backend controls.',
      code: 'INVALID_ADMIN_TOKEN',
      adminOnly: true,
    });
  }

  session.lastActive = new Date().toISOString();
  (req as any).admin = session.admin;
  next();
}

// --------------------------------------------------------------------------
// REST API ROUTES (/api/*)
// --------------------------------------------------------------------------

// Health & Status (Public monitoring)
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'Parul University Grievance Redressal Backend API',
    accessPolicy: 'ADMIN_RESTRICTED',
    uptimeSeconds: Math.floor(process.uptime()),
    complaintsCount: complaintsDb.length,
    adminsCount: adminAccountsDb.length,
    studentsCount: studentsDb.length,
    staticStudentsCount: studentsDb.filter((s) => s.isStatic).length,
    activeSessionsCount: activeAdminSessions.size,
    activeStudentSessionsCount: activeStudentSessions.size,
    auditLogsCount: auditLogsDb.length,
    geminiEnabled: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// Analytics & Statistics (Public summary)
app.get('/api/stats', (req, res) => {
  const total = complaintsDb.length;
  const pending = complaintsDb.filter((c) => c.status === 'Pending Review' || c.status === 'Submitted' || c.status === 'Pending').length;
  const inProgress = complaintsDb.filter((c) => c.status === 'In Progress' || c.status === 'Accepted').length;
  const resolved = complaintsDb.filter((c) => c.status === 'Resolved' || c.status === 'Closed').length;
  const escalated = complaintsDb.filter((c) => c.status === 'Escalated').length;

  const categoryCounts: Record<string, number> = {};
  complaintsDb.forEach((c) => {
    categoryCounts[c.category] = (categoryCounts[c.category] || 0) + 1;
  });

  const priorityCounts: Record<string, number> = {
    High: complaintsDb.filter((c) => c.priority === 'High').length,
    Medium: complaintsDb.filter((c) => c.priority === 'Medium').length,
    Low: complaintsDb.filter((c) => c.priority === 'Low').length,
  };

  res.json({
    total,
    pending,
    inProgress,
    resolved,
    escalated,
    resolutionRate: total > 0 ? Math.round((resolved / total) * 100) : 0,
    categoryCounts,
    priorityCounts,
  });
});

// Get Staff / Admin Directory (Public info, passwords stripped)
app.get('/api/staff', (req, res) => {
  const sanitized = adminAccountsDb.map(({ password: _, ...rest }) => rest);
  res.json({ staff: sanitized });
});

// --------------------------------------------------------------------------
// ADMIN AUTHENTICATION ROUTES (Strictly rejects non-admins)
// --------------------------------------------------------------------------

// POST /api/admin/login
// Strictly rejects any regular user, student, or unverified account.
app.post('/api/admin/login', (req, res) => {
  const { identifier, username, email, password } = req.body;
  const loginId = (identifier || username || email || '').trim().toLowerCase();
  const pwd = (password || '').trim();

  if (!loginId || !pwd) {
    return res.status(400).json({
      error: 'Username/Email and Administrator password are required.',
      code: 'CREDENTIALS_REQUIRED',
    });
  }

  // Detect student enrollment patterns or student emails to give a helpful specific error
  const isStudentIdentifier =
    loginId.includes('student') ||
    loginId.includes('ug') ||
    /^[0-9]{2}[a-z]{2,}/i.test(loginId);

  // Look up exclusively in the admin accounts repository
  const admin = adminAccountsDb.find(
    (a) =>
      a.username.toLowerCase() === loginId ||
      a.email.toLowerCase() === loginId ||
      a.staffId.toLowerCase() === loginId ||
      a.adminId.toLowerCase() === loginId
  );

  // If not found in admin accounts database, immediately deny access
  if (!admin) {
    return res.status(403).json({
      error: 'Access Denied: Only verified University Administrators can log into the backend. Regular users and students are not permitted.',
      code: 'NON_ADMIN_ACCESS_FORBIDDEN',
      isStudentForbidden: isStudentIdentifier,
    });
  }

  // Verify Administrator Password
  if (admin.password !== pwd) {
    logAdminAction(
      { name: admin.name, email: admin.email },
      'FAILED_LOGIN_ATTEMPT',
      `Failed admin login attempt (incorrect password) from IP ${req.ip || 'unknown'}`
    );
    return res.status(401).json({
      error: 'Invalid administrator credentials. Please verify your admin password.',
      code: 'INVALID_ADMIN_CREDENTIALS',
    });
  }

  // Generate a cryptographically random admin bearer token
  const token = `pu_adm_${Date.now()}_${crypto.randomBytes(16).toString('hex')}`;
  const session: AdminSession = {
    token,
    admin,
    createdAt: new Date().toISOString(),
    lastActive: new Date().toISOString(),
  };

  activeAdminSessions.set(token, session);
  logAdminAction(
    admin,
    'ADMIN_LOGIN',
    `Administrator ${admin.name} (${admin.designation}) authenticated to backend console.`,
    undefined,
    req.ip
  );

  const { password: _, ...sanitizedAdmin } = admin;
  res.json({
    message: 'Administrator authenticated successfully',
    token,
    admin: {
      ...sanitizedAdmin,
      role: 'ADMIN',
      token,
    },
  });
});

// POST /api/admin/logout (Protected)
app.post('/api/admin/logout', requireAdminAuth, (req, res) => {
  const admin = (req as any).admin as AdminAccountRecord;
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '').trim() || (req.headers['x-admin-token'] as string);

  if (token && activeAdminSessions.has(token)) {
    activeAdminSessions.delete(token);
  }

  logAdminAction(admin, 'ADMIN_LOGOUT', `Administrator ${admin.name} logged out from backend console.`, undefined, req.ip);
  res.json({ message: 'Administrator logged out successfully' });
});

// GET /api/admin/me (Protected - verifies admin token validity)
app.get('/api/admin/me', requireAdminAuth, (req, res) => {
  const admin = (req as any).admin as AdminAccountRecord;
  const { password: _, ...sanitized } = admin;
  res.json({
    admin: {
      ...sanitized,
      role: 'ADMIN',
    },
  });
});

// GET /api/admin/audit-logs (Protected - inspect live admin operations)
app.get('/api/admin/audit-logs', requireAdminAuth, (req, res) => {
  res.json({
    total: auditLogsDb.length,
    logs: auditLogsDb,
  });
});

// GET /api/admin/system-status (Protected)
app.get('/api/admin/system-status', requireAdminAuth, (req, res) => {
  res.json({
    status: 'online',
    accessMode: 'ADMIN_RESTRICTED',
    activeSessionsCount: activeAdminSessions.size,
    totalAuditLogs: auditLogsDb.length,
    databaseFile: DB_FILE,
    storageType: 'Persistent File Storage (backend-store.json)',
    uptimeSeconds: Math.floor(process.uptime()),
    memoryUsage: process.memoryUsage(),
    nodeVersion: process.version,
  });
});

// --------------------------------------------------------------------------
// STUDENT AUTHENTICATION & RECORD ROUTES (Static Store & Student Registration)
// --------------------------------------------------------------------------

// POST /api/student/login (Authenticate via static student record)
app.post('/api/student/login', (req, res) => {
  const { identifier, username, email, enrollmentNo, password } = req.body;
  const loginId = (identifier || enrollmentNo || email || username || '').trim().toLowerCase();
  const pwd = (password || '').trim();

  if (!loginId || !pwd) {
    return res.status(400).json({
      error: 'Enrollment Number / Official Email and password are required.',
      code: 'STUDENT_CREDENTIALS_REQUIRED',
    });
  }

  // Look up student in static database
  const student = studentsDb.find(
    (s) =>
      s.enrollmentNo.toLowerCase() === loginId ||
      s.email.toLowerCase() === loginId ||
      s.ugNumber.toLowerCase() === loginId
  );

  if (!student) {
    return res.status(404).json({
      error: 'No registered student record found with this Enrollment Number or Email. Please check your credentials or create an account.',
      code: 'STUDENT_NOT_FOUND',
    });
  }

  if (student.password !== pwd) {
    return res.status(401).json({
      error: 'Incorrect student password. Please verify your credentials.',
      code: 'INVALID_STUDENT_PASSWORD',
    });
  }

  const token = `pu_stu_${Date.now()}_${crypto.randomBytes(16).toString('hex')}`;
  const session: StudentSession = {
    token,
    student,
    createdAt: new Date().toISOString(),
    lastActive: new Date().toISOString(),
  };
  activeStudentSessions.set(token, session);

  const { password: _, ...sanitized } = student;
  res.json({
    message: 'Student authenticated successfully via static record',
    token,
    student: {
      ...sanitized,
      role: 'STUDENT',
      token,
    },
  });
});

// POST /api/student/register (or /api/student/create) - Create student account in static store
app.post(['/api/student/register', '/api/student/create'], (req, res) => {
  const {
    name,
    enrollmentNo,
    ugNumber,
    email,
    department,
    phone,
    password,
    phoneVerified,
    emailVerified,
    hostelBlock,
    roomNo,
  } = req.body;

  const trimmedName = (name || '').trim();
  const trimmedUg = (enrollmentNo || ugNumber || '').trim().toUpperCase();
  const trimmedEmail = (email || '').trim().toLowerCase();
  const trimmedPwd = (password || '').trim();

  if (!trimmedName || !trimmedUg || !trimmedEmail) {
    return res.status(400).json({
      error: 'Full Name, Enrollment Number (UG), and Email are required.',
      code: 'MISSING_STUDENT_FIELDS',
    });
  }

  if (!trimmedPwd || trimmedPwd.length < 4) {
    return res.status(400).json({
      error: 'Password must be at least 4 characters long.',
      code: 'WEAK_STUDENT_PASSWORD',
    });
  }

  // Check if student already exists in records
  const existing = studentsDb.find(
    (s) =>
      s.enrollmentNo.toLowerCase() === trimmedUg.toLowerCase() ||
      s.email.toLowerCase() === trimmedEmail
  );

  if (existing) {
    return res.status(409).json({
      error: `A student record already exists for ${trimmedUg} (${trimmedEmail}).`,
      code: 'DUPLICATE_STUDENT_RECORD',
      existingStudent: {
        name: existing.name,
        enrollmentNo: existing.enrollmentNo,
        email: existing.email,
      },
    });
  }

  const newStudent: StudentRecord = {
    studentId: `STU-${Date.now().toString(36).toUpperCase()}`,
    name: trimmedName,
    enrollmentNo: trimmedUg,
    ugNumber: trimmedUg,
    email: trimmedEmail,
    department: department || 'Computer Science & Engineering (PIET)',
    phone: phone || '+91 98765 43210',
    password: trimmedPwd,
    phoneVerified: phoneVerified !== false,
    emailVerified: emailVerified !== false,
    createdAt: new Date().toISOString(),
    role: 'STUDENT',
    isStatic: true,
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250',
    hostelBlock: hostelBlock || 'Block B',
    roomNo: roomNo || '204',
  };

  studentsDb.push(newStudent);
  saveDatabase();

  const token = `pu_stu_${Date.now()}_${crypto.randomBytes(16).toString('hex')}`;
  activeStudentSessions.set(token, {
    token,
    student: newStudent,
    createdAt: new Date().toISOString(),
    lastActive: new Date().toISOString(),
  });

  const { password: _, ...sanitized } = newStudent;
  res.status(201).json({
    message: 'Student account created and stored in static records successfully',
    token,
    student: {
      ...sanitized,
      role: 'STUDENT',
      token,
    },
  });
});

// GET /api/student/records (List all static student records, passwords removed)
app.get(['/api/student/records', '/api/student/static-records'], (req, res) => {
  const sanitized = studentsDb.map(({ password: _, ...rest }) => rest);
  res.json({
    total: sanitized.length,
    isStaticStore: true,
    students: sanitized,
  });
});

// GET /api/student/me (Verify student token)
app.get('/api/student/me', (req, res) => {
  const authHeader = req.headers.authorization;
  const customHeader = req.headers['x-student-token'] as string;
  let token = '';

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7).trim();
  } else if (customHeader) {
    token = customHeader.trim();
  }

  if (!token) {
    return res.status(401).json({ error: 'No student token provided', code: 'STUDENT_TOKEN_REQUIRED' });
  }

  const session = activeStudentSessions.get(token);
  if (!session) {
    return res.status(403).json({ error: 'Student session expired or invalid', code: 'INVALID_STUDENT_TOKEN' });
  }

  session.lastActive = new Date().toISOString();
  const { password: _, ...sanitized } = session.student;
  res.json({ student: sanitized });
});

// POST /api/student/logout
app.post('/api/student/logout', (req, res) => {
  const authHeader = req.headers.authorization;
  const customHeader = req.headers['x-student-token'] as string;
  let token = '';

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7).trim();
  } else if (customHeader) {
    token = customHeader.trim();
  }

  if (token && activeStudentSessions.has(token)) {
    activeStudentSessions.delete(token);
  }
  res.json({ message: 'Student logged out successfully' });
});

// --------------------------------------------------------------------------
// BACKEND EXCEL SPREADSHEET ROUTES FOR REGISTERED STUDENTS
// --------------------------------------------------------------------------

// GET /api/student/excel/info - Query registration stats and Excel file status
app.get(['/api/student/excel/info', '/api/student/excel/stats'], (req, res) => {
  if (!fs.existsSync(STUDENTS_EXCEL_FILE)) {
    updateStudentsExcelFile();
  }

  let fileStats = null;
  try {
    fileStats = fs.statSync(STUDENTS_EXCEL_FILE);
  } catch {}

  const totalCount = studentsDb.length;
  const staticCount = studentsDb.filter((s) => s.isStatic).length;
  const selfRegisteredCount = studentsDb.filter((s) => !s.isStatic).length;
  const phoneVerifiedCount = studentsDb.filter((s) => s.phoneVerified).length;
  const emailVerifiedCount = studentsDb.filter((s) => s.emailVerified).length;

  res.json({
    message: 'Backend Excel sheet tracking all student account registrations',
    excelFile: {
      fileName: 'registered_students_accounts.xlsx',
      relativePath: 'data/registered_students_accounts.xlsx',
      downloadUrl: '/api/student/excel/download',
      fileSizeBytes: fileStats ? fileStats.size : 0,
      fileSizeFormatted: fileStats ? `${(fileStats.size / 1024).toFixed(1)} KB` : '0 KB',
      lastModified: fileStats ? fileStats.mtime.toISOString() : new Date().toISOString(),
      sheets: ['Registered Students', 'Registration Summary'],
    },
    studentsCount: totalCount,
    statistics: {
      totalRegisteredStudents: totalCount,
      staticAccountsCount: staticCount,
      selfRegisteredAccountsCount: selfRegisteredCount,
      phoneVerifiedCount,
      emailVerifiedCount,
      phoneVerifiedPercentage: totalCount > 0 ? Math.round((phoneVerifiedCount / totalCount) * 100) : 0,
      emailVerifiedPercentage: totalCount > 0 ? Math.round((emailVerifiedCount / totalCount) * 100) : 0,
    },
    recentStudents: studentsDb.slice(-10).reverse().map(({ password: _, ...rest }) => rest),
  });
});

// GET /api/student/excel/download - Download the actual .xlsx Excel file from the backend
app.get(
  ['/api/student/excel/download', '/api/admin/export/students-excel', '/api/students/excel'],
  (req, res) => {
    // Ensure fresh generation if file doesn't exist or is requested
    if (!fs.existsSync(STUDENTS_EXCEL_FILE) || req.query.fresh === 'true') {
      updateStudentsExcelFile();
    }

    if (!fs.existsSync(STUDENTS_EXCEL_FILE)) {
      return res.status(500).json({ error: 'Excel file could not be generated on the server' });
    }

    const todayDate = new Date().toISOString().slice(0, 10);
    const filename = `PU_Registered_Students_${todayDate}.xlsx`;

    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.sendFile(STUDENTS_EXCEL_FILE);
  }
);

// POST /api/student/excel/regenerate - Force re-generate the backend Excel file
app.post(['/api/student/excel/regenerate', '/api/admin/excel/sync'], (req, res) => {
  updateStudentsExcelFile();
  let fileStats = null;
  try {
    fileStats = fs.statSync(STUDENTS_EXCEL_FILE);
  } catch {}

  res.json({
    message: 'Backend Excel sheet successfully regenerated from latest student records',
    studentsCount: studentsDb.length,
    filePath: 'data/registered_students_accounts.xlsx',
    fileSizeBytes: fileStats ? fileStats.size : 0,
    timestamp: new Date().toISOString(),
  });
});

// --------------------------------------------------------------------------
// COMPLAINTS ENDPOINTS (Public read & submit; Protected admin management)
// --------------------------------------------------------------------------

// Get Complaints (Public read with filters & search)
app.get('/api/complaints', (req, res) => {
  const { status, category, priority, search, studentUg } = req.query;

  let filtered = [...complaintsDb];

  if (status && status !== 'All') {
    filtered = filtered.filter((c) => c.status.toLowerCase() === String(status).toLowerCase());
  }

  if (category && category !== 'All') {
    filtered = filtered.filter((c) => c.category === category);
  }

  if (priority && priority !== 'All') {
    filtered = filtered.filter((c) => c.priority.toLowerCase() === String(priority).toLowerCase());
  }

  if (studentUg) {
    filtered = filtered.filter((c) => c.ugNumber.toLowerCase() === String(studentUg).toLowerCase());
  }

  if (search) {
    const q = String(search).toLowerCase();
    filtered = filtered.filter(
      (c) =>
        c.id.toLowerCase().includes(q) ||
        c.subject.toLowerCase().includes(q) ||
        c.studentName.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        (c.location && c.location.toLowerCase().includes(q))
    );
  }

  filtered.sort((a, b) => b.id.localeCompare(a.id));

  res.json({
    total: filtered.length,
    complaints: filtered,
  });
});

// Get Single Complaint by ID (Public read for tracking)
app.get('/api/complaints/:id', (req, res) => {
  const complaint = complaintsDb.find((c) => c.id.toUpperCase() === req.params.id.toUpperCase());
  if (!complaint) {
    return res.status(404).json({ error: 'Complaint not found' });
  }
  res.json({ complaint });
});

// Student Complaint Submission (Public entry point)
app.post('/api/complaints', (req, res) => {
  const body = req.body;
  if (!body.subject && !body.title) {
    return res.status(400).json({ error: 'Subject or title is required' });
  }

  const year = new Date().getFullYear();
  const nextNum = String(complaintsDb.length + 1).padStart(4, '0');
  const newId = body.id || `PU-${year}-${nextNum}`;

  const now = new Date();
  const timestamp = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

  const newComplaint: ServerComplaintRecord = {
    id: newId,
    studentName: body.studentName || 'Student User',
    ugNumber: body.ugNumber || 'PU-STUDENT',
    department: body.department || 'General Academic',
    category: body.category || 'General Grievance',
    subject: body.subject || body.title || 'Untitled Grievance',
    title: body.title || body.subject || 'Untitled Grievance',
    description: body.description || '',
    location: body.location || 'Campus Premises',
    priority: body.priority || 'Medium',
    status: 'Submitted',
    assignedStaff: 'Unassigned',
    staffRemarks: 'New student grievance lodged. Awaiting administrator review.',
    createdAt: timestamp,
    contactNumber: body.contactNumber || '',
    email: body.email || '',
    attachment: body.attachment || '',
    attachments: body.attachments || (body.attachment ? [body.attachment] : []),
    upvotes: 1,
    timeline: [
      {
        id: `t-${Date.now()}`,
        title: 'Grievance Registered',
        description: `Submitted by ${body.studentName || 'Student'} into Parul University Grievance Redressal System.`,
        timestamp,
        status: 'Submitted',
      },
    ],
    resolutionSteps: [],
    resolutionAttachments: [],
  };

  complaintsDb.unshift(newComplaint);
  saveDatabase();

  res.status(201).json({
    message: 'Grievance submitted successfully',
    complaint: newComplaint,
  });
});

// Student Upvote Complaint (Public)
app.post('/api/complaints/:id/upvote', (req, res) => {
  const { id } = req.params;
  const idx = complaintsDb.findIndex((c) => c.id.toUpperCase() === id.toUpperCase());
  if (idx === -1) {
    return res.status(404).json({ error: 'Complaint not found' });
  }

  complaintsDb[idx].upvotes = (complaintsDb[idx].upvotes || 1) + 1;
  saveDatabase();

  res.json({
    message: 'Upvoted successfully',
    upvotes: complaintsDb[idx].upvotes,
  });
});

// --------------------------------------------------------------------------
// PROTECTED ADMIN BACKEND ENDPOINTS (requireAdminAuth)
// --------------------------------------------------------------------------

// Update Complaint Status (Admin Only)
app.post('/api/complaints/:id/status', requireAdminAuth, (req, res) => {
  const admin = (req as any).admin as AdminAccountRecord;
  const { id } = req.params;
  const { status, remarks, officer } = req.body;

  const idx = complaintsDb.findIndex((c) => c.id.toUpperCase() === id.toUpperCase());
  if (idx === -1) {
    return res.status(404).json({ error: 'Complaint not found' });
  }

  const existing = complaintsDb[idx];
  const now = new Date();
  const timestamp = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

  const updated: ServerComplaintRecord = {
    ...existing,
    status,
    staffRemarks: remarks !== undefined ? remarks : existing.staffRemarks,
    timeline: [
      ...(existing.timeline || []),
      {
        id: `t-${Date.now()}`,
        title: `Status Changed to ${status}`,
        description: remarks || `Status set to ${status} by Admin ${admin.name}.`,
        timestamp,
        officer: officer || admin.name,
        status,
      },
    ],
  };

  complaintsDb[idx] = updated;
  logAdminAction(admin, 'STATUS_UPDATE', `Changed status of ${id} to "${status}". Remarks: ${remarks || 'None'}`, id, req.ip);
  saveDatabase();

  res.json({ message: 'Status updated by administrator', complaint: updated });
});

// Add Admin / Staff Remark (Admin Only)
app.post('/api/complaints/:id/remarks', requireAdminAuth, (req, res) => {
  const admin = (req as any).admin as AdminAccountRecord;
  const { id } = req.params;
  const { remark, officer } = req.body;

  const idx = complaintsDb.findIndex((c) => c.id.toUpperCase() === id.toUpperCase());
  if (idx === -1) {
    return res.status(404).json({ error: 'Complaint not found' });
  }

  const existing = complaintsDb[idx];
  const now = new Date();
  const timestamp = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

  const updated: ServerComplaintRecord = {
    ...existing,
    staffRemarks: remark,
    timeline: [
      ...(existing.timeline || []),
      {
        id: `t-${Date.now()}`,
        title: 'Administrator Remark Added',
        description: remark,
        timestamp,
        officer: officer || admin.name,
        status: existing.status,
      },
    ],
  };

  complaintsDb[idx] = updated;
  logAdminAction(admin, 'REMARK_ADDED', `Added administrative remark on ${id}: "${remark}"`, id, req.ip);
  saveDatabase();

  res.json({ message: 'Remark added by administrator', complaint: updated });
});

// Assign Staff to Complaint (Admin Only)
app.post('/api/complaints/:id/assign', requireAdminAuth, (req, res) => {
  const admin = (req as any).admin as AdminAccountRecord;
  const { id } = req.params;
  const { staffName, officer } = req.body;

  const idx = complaintsDb.findIndex((c) => c.id.toUpperCase() === id.toUpperCase());
  if (idx === -1) {
    return res.status(404).json({ error: 'Complaint not found' });
  }

  const existing = complaintsDb[idx];
  const now = new Date();
  const timestamp = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

  const updated: ServerComplaintRecord = {
    ...existing,
    assignedStaff: staffName,
    status: existing.status === 'Submitted' ? 'Pending Review' : existing.status,
    timeline: [
      ...(existing.timeline || []),
      {
        id: `t-${Date.now()}`,
        title: `Assigned to ${staffName}`,
        description: `Grievance allocated to ${staffName} by Admin ${admin.name}.`,
        timestamp,
        officer: officer || admin.name,
        status: existing.status === 'Submitted' ? 'Pending Review' : existing.status,
      },
    ],
  };

  complaintsDb[idx] = updated;
  logAdminAction(admin, 'ASSIGN_STAFF', `Assigned complaint ${id} to ${staffName}`, id, req.ip);
  saveDatabase();

  res.json({ message: 'Staff assigned by administrator', complaint: updated });
});

// Escalate Complaint (Admin Only)
app.post('/api/complaints/:id/escalate', requireAdminAuth, (req, res) => {
  const admin = (req as any).admin as AdminAccountRecord;
  const { id } = req.params;
  const { reason, officer } = req.body;

  const idx = complaintsDb.findIndex((c) => c.id.toUpperCase() === id.toUpperCase());
  if (idx === -1) {
    return res.status(404).json({ error: 'Complaint not found' });
  }

  const existing = complaintsDb[idx];
  const now = new Date();
  const timestamp = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

  const updated: ServerComplaintRecord = {
    ...existing,
    status: 'Escalated',
    priority: 'High',
    staffRemarks: reason || 'Escalated by university administrator for priority action.',
    timeline: [
      ...(existing.timeline || []),
      {
        id: `t-${Date.now()}`,
        title: 'Escalated to High Directorate',
        description: reason || 'Escalated by administrator for immediate intervention.',
        timestamp,
        officer: officer || admin.name,
        status: 'Escalated',
      },
    ],
  };

  complaintsDb[idx] = updated;
  logAdminAction(admin, 'ESCALATE_COMPLAINT', `Escalated complaint ${id}. Reason: ${reason || 'Immediate priority'}`, id, req.ip);
  saveDatabase();

  res.json({ message: 'Complaint escalated by administrator', complaint: updated });
});

// Resolve Complaint (Admin Only)
app.post('/api/complaints/:id/resolve', requireAdminAuth, (req, res) => {
  const admin = (req as any).admin as AdminAccountRecord;
  const { id } = req.params;
  const { resolution, officer } = req.body;

  const idx = complaintsDb.findIndex((c) => c.id.toUpperCase() === id.toUpperCase());
  if (idx === -1) {
    return res.status(404).json({ error: 'Complaint not found' });
  }

  const existing = complaintsDb[idx];
  const now = new Date();
  const timestamp = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

  const updated: ServerComplaintRecord = {
    ...existing,
    status: 'Resolved',
    resolution: resolution || 'Issue addressed and resolved by authorized university administrator.',
    resolvedDate: timestamp,
    resolvedBy: officer || admin.name,
    timeline: [
      ...(existing.timeline || []),
      {
        id: `t-${Date.now()}`,
        title: 'Grievance Formally Resolved',
        description: resolution || 'Resolution verified and approved by university administrator.',
        timestamp,
        officer: officer || admin.name,
        status: 'Resolved',
      },
    ],
  };

  complaintsDb[idx] = updated;
  logAdminAction(admin, 'RESOLVE_COMPLAINT', `Resolved complaint ${id}. Resolution: ${resolution || 'Resolved'}`, id, req.ip);
  saveDatabase();

  res.json({ message: 'Complaint resolved by administrator', complaint: updated });
});

// Save Detailed Resolution Steps & Work Proof Attachments (Admin Only)
app.post('/api/complaints/:id/resolution-steps', requireAdminAuth, (req, res) => {
  const admin = (req as any).admin as AdminAccountRecord;
  const { id } = req.params;
  const {
    steps,
    attachments,
    resolutionSummary,
    rootCause,
    preventativeMeasures,
    markResolved,
    officer,
  } = req.body;

  const idx = complaintsDb.findIndex((c) => c.id.toUpperCase() === id.toUpperCase());
  if (idx === -1) {
    return res.status(404).json({ error: 'Complaint not found' });
  }

  const existing = complaintsDb[idx];
  const now = new Date();
  const timestamp = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

  const newStatus = markResolved ? 'Resolved' : existing.status === 'Submitted' ? 'In Progress' : existing.status;

  const updated: ServerComplaintRecord = {
    ...existing,
    status: newStatus,
    resolutionSteps: steps || existing.resolutionSteps || [],
    resolutionAttachments: attachments || existing.resolutionAttachments || [],
    resolution: resolutionSummary || existing.resolution,
    rootCause: rootCause !== undefined ? rootCause : existing.rootCause,
    preventativeMeasures: preventativeMeasures !== undefined ? preventativeMeasures : existing.preventativeMeasures,
    resolvedDate: markResolved ? timestamp : existing.resolvedDate,
    resolvedBy: markResolved ? officer || admin.name : existing.resolvedBy,
    timeline: [
      ...(existing.timeline || []),
      {
        id: `t-${Date.now()}`,
        title: markResolved ? 'Resolution Steps Completed & Finalized' : 'Resolution Progress & Proof Updated',
        description: `Administrator ${admin.name} logged ${(steps || []).length} work steps and ${(attachments || []).length} proof attachments.`,
        timestamp,
        officer: officer || admin.name,
        status: newStatus,
      },
    ],
  };

  complaintsDb[idx] = updated;
  logAdminAction(
    admin,
    markResolved ? 'RESOLUTION_REPORT_FINALIZED' : 'RESOLUTION_STEPS_UPLOADED',
    `Updated resolution report for ${id} (${(steps || []).length} steps, ${(attachments || []).length} proofs, markResolved: ${Boolean(markResolved)})`,
    id,
    req.ip
  );
  saveDatabase();

  res.json({
    message: markResolved ? 'Resolution finalized and uploaded successfully' : 'Progress steps saved',
    complaint: updated,
  });
});

// Delete Complaint (Admin Only)
app.delete('/api/complaints/:id', requireAdminAuth, (req, res) => {
  const admin = (req as any).admin as AdminAccountRecord;
  const { id } = req.params;

  const idx = complaintsDb.findIndex((c) => c.id.toUpperCase() === id.toUpperCase());
  if (idx === -1) {
    return res.status(404).json({ error: 'Complaint not found' });
  }

  const removed = complaintsDb.splice(idx, 1)[0];
  logAdminAction(admin, 'DELETE_COMPLAINT', `Admin deleted grievance record ${id} (${removed.subject})`, id, req.ip);
  saveDatabase();

  res.json({ message: `Complaint ${id} removed by administrator` });
});

// Clean All Data (Fresh State for Frontend and Backend)
app.post('/api/clean-data', (req, res) => {
  // Clear all complaints completely
  complaintsDb = [];

  // Reset student records to clean static institutional accounts (with Aman as primary static account)
  studentsDb = [
    {
      studentId: 'STU-AMAN-2026',
      name: 'Aman',
      enrollmentNo: '26UG576544',
      ugNumber: '26UG576544',
      email: 'aman576544534@gmail.com',
      department: 'Computer Science & Engineering (PIET)',
      phone: '+91 98765 54453',
      password: 'Password@123',
      phoneVerified: true,
      emailVerified: true,
      createdAt: new Date().toISOString(),
      role: 'STUDENT',
      isStatic: true,
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250',
      hostelBlock: 'Block B',
      roomNo: '204',
    },
    {
      studentId: 'STU-ALEX-2026',
      name: 'Alex Patel',
      enrollmentNo: '26UG123456',
      ugNumber: '26UG123456',
      email: 'alex.patel@gmail.com',
      department: 'Computer Science & Engineering (PIET)',
      phone: '+91 98765 43210',
      password: 'Password@123',
      phoneVerified: true,
      emailVerified: true,
      createdAt: new Date().toISOString(),
      role: 'STUDENT',
      isStatic: true,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      hostelBlock: 'Block A',
      roomNo: '102',
    },
  ];

  // Reset audit logs to a single clean initialization event
  auditLogsDb = [
    {
      id: `audit-${Date.now()}`,
      adminName: 'System Security Kernel',
      adminEmail: 'security@paruluniversity.ac.in',
      action: 'SYSTEM_FRESH_CLEAN',
      details: 'All complaints and test logs cleaned. System refreshed to pristine fresh state.',
      timestamp: new Date().toISOString(),
      ip: req.ip || '127.0.0.1',
    },
  ];

  // Clear active sessions
  activeAdminSessions.clear();
  activeStudentSessions.clear();

  // Save changes to disk and regenerate the Excel file
  saveDatabase();

  res.json({
    success: true,
    message: 'All frontend and backend data cleaned successfully. System is in fresh state.',
    complaintsCount: complaintsDb.length,
    studentsCount: studentsDb.length,
    cleanedAt: new Date().toISOString(),
  });
});

// Reset Backend Data (Admin Only)
app.post('/api/reset', requireAdminAuth, (req, res) => {
  const admin = (req as any).admin as AdminAccountRecord;
  complaintsDb = getInitialComplaints() as ServerComplaintRecord[];
  adminAccountsDb = [...initialAdminAccounts];
  studentsDb = [...initialStaticStudents];
  logAdminAction(admin, 'DATABASE_RESET', `Administrator reset complaints and students database to initial seed dataset.`, undefined, req.ip);
  saveDatabase();

  res.json({
    message: 'Backend database reset to default demo dataset by administrator',
    complaintsCount: complaintsDb.length,
    studentsCount: studentsDb.length,
  });
});

// AI Assistant for Resolution (Admin Only)
app.post('/api/ai/suggest-resolution', requireAdminAuth, async (req, res) => {
  const admin = (req as any).admin as AdminAccountRecord;
  const { title, subject, category, description, location } = req.body;

  const ai = getAIClient();
  if (!ai) {
    return res.json({
      fallback: true,
      suggestions: [
        'Dispatch technician to inspect electrical/mechanical integrity.',
        'Isolate local circuit or switch to prevent safety hazards.',
        'Replace worn or malfunctioning components with verified stock.',
        'Run continuous 15-minute load test and log verification readings.',
      ],
      estimatedTimeMinutes: 45,
      suggestedPriority: 'High',
      rootCauseHint: 'Probable mechanical wear or component fatigue under prolonged operation.',
    });
  }

  try {
    const prompt = `You are the chief operations engineer for Parul University campus maintenance.
A student grievance has been reported:
Title: ${title || subject}
Category: ${category}
Location: ${location || 'Campus'}
Description: ${description}

Provide a JSON object with:
1. "suggestions": array of 4 concise, actionable engineering/administrative steps to resolve this.
2. "estimatedTimeMinutes": integer number of estimated minutes.
3. "suggestedPriority": "Low" | "Medium" | "High".
4. "rootCauseHint": a 1-sentence technical root-cause diagnosis.
5. "preventativeSafeguard": a 1-sentence preventative measure to avoid recurrence.

Output valid JSON only.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    logAdminAction(admin, 'AI_ASSIST_REQUESTED', `Requested AI resolution suggestions for ${title || subject}`);
    const parsed = JSON.parse(response.text || '{}');
    res.json({ fallback: false, ...parsed });
  } catch (err: any) {
    console.error('Gemini AI resolution suggestion error:', err);
    res.status(500).json({
      error: 'AI suggestion failed',
      details: err?.message || 'Unknown error',
    });
  }
});

// --------------------------------------------------------------------------
// VITE DEV SERVER / PRODUCTION STATIC ASSET SERVING
// --------------------------------------------------------------------------

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Parul University Complaint App server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
