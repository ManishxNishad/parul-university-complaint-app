export type ScreenType =
  | 'login'
  | 'home'
  | 'raise'
  | 'review'
  | 'submitted'
  | 'alerts'
  | 'complaints'
  | 'details'
  | 'support'
  | 'profile'
  | 'university';

export type PriorityLevel = 'Low' | 'Medium' | 'High' | 'Emergency';

export type UnifiedComplaintStatus =
  | 'Submitted'
  | 'Accepted'
  | 'In Progress'
  | 'Resolved'
  | 'Escalated'
  | 'Reopened'
  | 'Pending'
  | 'Under Review'
  | 'Closed';

export type ComplaintStatus = UnifiedComplaintStatus;

export type ComplaintCategory =
  | 'Hostel & Accommodation'
  | 'Academic & Classroom'
  | 'Staff and academic problem'
  | 'Campus problem'
  | 'Events problem'
  | 'Harassment'
  | 'Cafeteria & Mess'
  | 'Library Services'
  | 'Transport & Bus'
  | 'Maintenance & Electricity'
  | 'Security & Safety'
  | 'Others'
  | 'Campus Wi-Fi & IT';

export interface TimelineEvent {
  id: string;
  title: string;
  timestamp: string;
  description: string;
  status: 'completed' | 'current' | 'pending';
  officer?: string;
}

export interface ResolutionStep {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  performedBy?: string;
  timestamp: string;
  status: 'completed' | 'in-progress' | 'pending';
  durationMinutes?: number;
  materialsUsed?: string[];
}

export interface ResolutionProofAttachment {
  id: string;
  name: string;
  url: string;
  type: 'photo' | 'receipt' | 'report' | 'before_after';
  caption?: string;
  uploadedAt: string;
  uploadedBy: string;
  sizeBytes?: number;
}

export interface ComplaintItem {
  id: string;
  title: string;
  subject?: string;
  category: ComplaintCategory | string;
  description: string;
  location: string;
  status: UnifiedComplaintStatus;
  date: string;
  submittedDate?: string;
  time?: string;
  priority?: PriorityLevel;
  studentName?: string;
  ugNumber?: string;
  department?: string;
  images: string[];
  attachment?: string;
  timeline: TimelineEvent[];
  assignedTo?: string;
  assignedStaff?: string;
  assignedDepartment?: string;
  staffRemarks?: string;
  resolution?: string;
  resolutionSteps?: ResolutionStep[];
  resolutionAttachments?: ResolutionProofAttachment[];
  resolutionSummary?: string;
  preventativeMeasures?: string;
  rootCause?: string;
  costIncurred?: string;
  resolvedAt?: string;
  resolvedBy?: string;
}

export interface ComplaintRecord extends ComplaintItem {
  subject: string;
  studentName: string;
  ugNumber: string;
  department: string;
  priority: PriorityLevel;
}

export interface StaffAccount {
  staffId: string;
  name: string;
  email: string;
  department: string;
  designation: string;
  phone: string;
  avatarUrl: string;
  password?: string;
  role: 'Staff' | 'ADMIN';
  token?: string;
  permissions?: string[];
}

export interface AdminAccount extends StaffAccount {
  role: 'ADMIN';
  adminId: string;
  permissions: string[];
  lastLogin?: string;
}

export interface AdminAuditLog {
  id: string;
  adminName: string;
  adminEmail: string;
  action: string;
  complaintId?: string;
  details: string;
  timestamp: string;
  ip?: string;
}

export type StaffViewTab =
  | 'dashboard'
  | 'new'
  | 'assigned'
  | 'progress'
  | 'upload'
  | 'resolved'
  | 'escalated'
  | 'analytics'
  | 'audit'
  | 'students'
  | 'profile';

export interface NoticeUpdate {
  id: string;
  title: string;
  date: string;
  department: string;
  icon: string;
  type: 'maintenance' | 'event' | 'notice' | 'academic';
  read?: boolean;
}

export interface NotificationItem {
  id: string;
  type: 'alert' | 'info' | 'success' | 'event' | 'warning';
  title: string;
  message: string;
  timestamp: string;
  category: 'All' | 'Updates';
  complaintId?: string;
  unread?: boolean;
}

export interface UserProfile {
  name: string;
  enrollmentNo: string;
  program: string;
  university: string;
  email: string;
  phone: string;
  hostelBlock: string;
  roomNo: string;
  role: 'Student' | 'Staff';
  avatarUrl: string;
}

export interface StudentRecord {
  studentId: string;
  name: string;
  enrollmentNo: string;
  ugNumber: string;
  email: string;
  department: string;
  phone: string;
  password?: string;
  phoneVerified: boolean;
  emailVerified: boolean;
  createdAt: string;
  role: 'STUDENT';
  isStatic: boolean;
  avatarUrl?: string;
  hostelBlock?: string;
  roomNo?: string;
  token?: string;
}

