import {
  AdminAuditLog,
  ComplaintRecord,
  ResolutionProofAttachment,
  ResolutionStep,
  StaffAccount,
  UnifiedComplaintStatus,
} from '../types';

export interface BackendHealthResponse {
  status: 'ok' | 'error';
  app: string;
  accessPolicy?: string;
  uptimeSeconds: number;
  complaintsCount: number;
  adminsCount?: number;
  staffCount?: number;
  activeSessionsCount?: number;
  auditLogsCount?: number;
  geminiEnabled: boolean;
  timestamp: string;
  latencyMs?: number;
}

export interface BackendStatsResponse {
  total: number;
  pending: number;
  inProgress: number;
  resolved: number;
  escalated: number;
  resolutionRate: number;
  categoryCounts: Record<string, number>;
  priorityCounts: Record<string, number>;
}

export interface AISuggestionResponse {
  fallback?: boolean;
  suggestions: string[];
  estimatedTimeMinutes: number;
  suggestedPriority: 'Low' | 'Medium' | 'High';
  rootCauseHint: string;
  preventativeSafeguard?: string;
}

const API_BASE = '/api';
const STORAGE_KEY_ADMIN_TOKEN = 'pu_admin_auth_token';
const STORAGE_KEY_ADMIN_SESSION = 'pu_active_admin_session';
const STORAGE_KEY_STUDENT_TOKEN = 'pu_student_auth_token';
const STORAGE_KEY_STUDENT_SESSION = 'pu_student_active_session';

/**
 * Token management for Student access
 */
export const getStudentToken = (): string | null => {
  try {
    return localStorage.getItem(STORAGE_KEY_STUDENT_TOKEN) || sessionStorage.getItem(STORAGE_KEY_STUDENT_TOKEN);
  } catch {
    return null;
  }
};

export const setStudentToken = (token: string | null, remember: boolean = true): void => {
  try {
    if (token) {
      if (remember) {
        localStorage.setItem(STORAGE_KEY_STUDENT_TOKEN, token);
      } else {
        sessionStorage.setItem(STORAGE_KEY_STUDENT_TOKEN, token);
      }
    } else {
      localStorage.removeItem(STORAGE_KEY_STUDENT_TOKEN);
      sessionStorage.removeItem(STORAGE_KEY_STUDENT_TOKEN);
      localStorage.removeItem(STORAGE_KEY_STUDENT_SESSION);
    }
  } catch {}
};

export const getStoredStudentSession = (): any | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_STUDENT_SESSION);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const saveStoredStudentSession = (student: any): void => {
  try {
    localStorage.setItem(STORAGE_KEY_STUDENT_SESSION, JSON.stringify(student));
  } catch {}
};

/**
 * Token management for Admin-Only backend access
 */
export const getAdminToken = (): string | null => {
  try {
    return localStorage.getItem(STORAGE_KEY_ADMIN_TOKEN) || sessionStorage.getItem(STORAGE_KEY_ADMIN_TOKEN);
  } catch {
    return null;
  }
};

export const setAdminToken = (token: string | null, remember: boolean = true): void => {
  try {
    if (token) {
      if (remember) {
        localStorage.setItem(STORAGE_KEY_ADMIN_TOKEN, token);
      } else {
        sessionStorage.setItem(STORAGE_KEY_ADMIN_TOKEN, token);
      }
    } else {
      localStorage.removeItem(STORAGE_KEY_ADMIN_TOKEN);
      sessionStorage.removeItem(STORAGE_KEY_ADMIN_TOKEN);
      localStorage.removeItem(STORAGE_KEY_ADMIN_SESSION);
    }
  } catch {}
};

export const getStoredAdminSession = (): StaffAccount | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ADMIN_SESSION);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const saveStoredAdminSession = (account: StaffAccount): void => {
  try {
    localStorage.setItem(STORAGE_KEY_ADMIN_SESSION, JSON.stringify(account));
  } catch {}
};

const getAuthHeaders = (): Record<string, string> => {
  const token = getAdminToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
    headers['x-admin-token'] = token;
  }
  return headers;
};

/**
 * Universal backend client for Parul University Grievance Redressal System.
 * Connects directly to server-side Express REST endpoints with local fallback support.
 */
export const apiClient = {
  /**
   * Health check and latency probe
   */
  async checkHealth(): Promise<BackendHealthResponse> {
    const start = performance.now();
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) {
      throw new Error(`Health check failed with status ${res.status}`);
    }
    const data: BackendHealthResponse = await res.json();
    data.latencyMs = Math.round(performance.now() - start);
    return data;
  },

  /**
   * Admin Authentication: Login exclusively for administrators
   * Rejects any student or non-admin account with 403 Forbidden
   */
  async adminLogin(identifier: string, password: string): Promise<{ token: string; admin: StaffAccount }> {
    const res = await fetch(`${API_BASE}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Administrator login failed');
    }

    if (data.token) {
      setAdminToken(data.token, true);
      saveStoredAdminSession(data.admin);
    }

    return data;
  },

  /**
   * Admin Authentication: Logout
   */
  async adminLogout(): Promise<void> {
    try {
      await fetch(`${API_BASE}/admin/logout`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
    } catch {}
    setAdminToken(null);
  },

  /**
   * Admin Authentication: Verify current admin session
   */
  async verifyAdminSession(): Promise<StaffAccount> {
    const res = await fetch(`${API_BASE}/admin/me`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Admin session is invalid or expired');
    }
    const data = await res.json();
    return data.admin;
  },

  /**
   * Fetch backend administrative audit logs (Admin Only)
   */
  async getAuditLogs(): Promise<AdminAuditLog[]> {
    const res = await fetch(`${API_BASE}/admin/audit-logs`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to fetch admin audit logs');
    }
    const data = await res.json();
    return data.logs || [];
  },

  /**
   * Fetch backend system status and server internals (Admin Only)
   */
  async getSystemStatus(): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/system-status`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to fetch backend system status');
    }
    return res.json();
  },

  /**
   * Student Authentication: Login using static student record from backend
   */
  async studentLogin(
    identifier: string,
    password: string,
    remember: boolean = true
  ): Promise<{ token: string; student: any }> {
    const res = await fetch(`${API_BASE}/student/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Student login failed');
    }

    if (data.token) {
      setStudentToken(data.token, remember);
      saveStoredStudentSession(data.student);
    }

    return data;
  },

  /**
   * Student Account Creation / Registration: Creates a static record on the backend
   */
  async studentRegister(payload: {
    name: string;
    enrollmentNo: string;
    ugNumber?: string;
    email: string;
    department?: string;
    phone?: string;
    password?: string;
    phoneVerified?: boolean;
    emailVerified?: boolean;
    hostelBlock?: string;
    roomNo?: string;
  }): Promise<{ token: string; student: any }> {
    const res = await fetch(`${API_BASE}/student/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Student account creation failed');
    }

    if (data.token) {
      setStudentToken(data.token, true);
      saveStoredStudentSession(data.student);
    }

    return data;
  },

  /**
   * Get all static student records from backend
   */
  async getStudentRecords(): Promise<any[]> {
    try {
      const res = await fetch(`${API_BASE}/student/records`);
      if (!res.ok) return [];
      const data = await res.json();
      return data.students || [];
    } catch {
      return [];
    }
  },

  /**
   * Verify currently active student session on backend
   */
  async verifyStudentSession(): Promise<any> {
    const token = getStudentToken();
    if (!token) throw new Error('No active student token');
    const res = await fetch(`${API_BASE}/student/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'x-student-token': token,
      },
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Student session is invalid or expired');
    }
    const data = await res.json();
    saveStoredStudentSession(data.student);
    return data.student;
  },

  /**
   * Student Logout
   */
  async studentLogout(): Promise<void> {
    const token = getStudentToken();
    try {
      if (token) {
        await fetch(`${API_BASE}/student/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'x-student-token': token,
          },
        });
      }
    } catch {}
    setStudentToken(null);
  },

  /**
   * Get Excel Spreadsheet Info & Student Registration Statistics
   */
  async getStudentsExcelInfo(): Promise<{
    message: string;
    excelFile: {
      fileName: string;
      relativePath: string;
      downloadUrl: string;
      fileSizeBytes: number;
      fileSizeFormatted: string;
      lastModified: string;
      sheets: string[];
    };
    studentsCount: number;
    statistics: {
      totalRegisteredStudents: number;
      staticAccountsCount: number;
      selfRegisteredAccountsCount: number;
      phoneVerifiedCount: number;
      emailVerifiedCount: number;
      phoneVerifiedPercentage: number;
      emailVerifiedPercentage: number;
    };
    recentStudents: any[];
  }> {
    const res = await fetch(`${API_BASE}/student/excel/info`);
    if (!res.ok) {
      throw new Error('Failed to retrieve student Excel metadata');
    }
    return res.json();
  },

  /**
   * Trigger direct browser download of the backend Excel file (.xlsx)
   */
  downloadStudentsExcel(): void {
    const link = document.createElement('a');
    link.href = `${API_BASE}/student/excel/download?fresh=true`;
    link.setAttribute('download', `PU_Registered_Students_${new Date().toISOString().slice(0, 10)}.xlsx`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  /**
   * Force re-generation of backend Excel file from current DB records
   */
  async regenerateStudentsExcel(): Promise<any> {
    const res = await fetch(`${API_BASE}/student/excel/regenerate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) {
      throw new Error('Failed to regenerate Excel spreadsheet');
    }
    return res.json();
  },

  /**
   * Fetch all complaints from backend (Public read)
   */
  async getComplaints(params?: {
    status?: string;
    category?: string;
    priority?: string;
    search?: string;
    studentUg?: string;
  }): Promise<ComplaintRecord[]> {
    const query = new URLSearchParams();
    if (params?.status && params.status !== 'All') query.set('status', params.status);
    if (params?.category && params.category !== 'All') query.set('category', params.category);
    if (params?.priority && params.priority !== 'All') query.set('priority', params.priority);
    if (params?.search) query.set('search', params.search);
    if (params?.studentUg) query.set('studentUg', params.studentUg);

    const url = `${API_BASE}/complaints${query.toString() ? `?${query.toString()}` : ''}`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Failed to fetch complaints: ${res.statusText}`);
    }
    const data = await res.json();
    return data.complaints || [];
  },

  /**
   * Fetch single complaint by ID (Public read)
   */
  async getComplaintById(id: string): Promise<ComplaintRecord> {
    const res = await fetch(`${API_BASE}/complaints/${encodeURIComponent(id)}`);
    if (!res.ok) {
      throw new Error(`Grievance ${id} not found on backend`);
    }
    const data = await res.json();
    return data.complaint;
  },

  /**
   * Submit new student complaint (Public entry point)
   */
  async createComplaint(payload: Partial<ComplaintRecord>): Promise<ComplaintRecord> {
    const res = await fetch(`${API_BASE}/complaints`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to submit grievance to backend');
    }
    const data = await res.json();
    return data.complaint;
  },

  /**
   * Upvote a complaint (Public)
   */
  async upvoteComplaint(id: string): Promise<number> {
    const res = await fetch(`${API_BASE}/complaints/${encodeURIComponent(id)}/upvote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) {
      throw new Error('Failed to upvote grievance');
    }
    const data = await res.json();
    return data.upvotes;
  },

  /**
   * Update status (Admin Only)
   */
  async updateStatus(
    id: string,
    status: UnifiedComplaintStatus,
    remarks?: string,
    officer?: string
  ): Promise<ComplaintRecord> {
    const res = await fetch(`${API_BASE}/complaints/${encodeURIComponent(id)}/status`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status, remarks, officer }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Failed to update status for ${id}`);
    }
    const data = await res.json();
    return data.complaint;
  },

  /**
   * Add staff remark (Admin Only)
   */
  async addRemark(id: string, remark: string, officer?: string): Promise<ComplaintRecord> {
    const res = await fetch(`${API_BASE}/complaints/${encodeURIComponent(id)}/remarks`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ remark, officer }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Failed to add remark for ${id}`);
    }
    const data = await res.json();
    return data.complaint;
  },

  /**
   * Assign staff (Admin Only)
   */
  async assignStaff(id: string, staffName: string, officer?: string): Promise<ComplaintRecord> {
    const res = await fetch(`${API_BASE}/complaints/${encodeURIComponent(id)}/assign`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ staffName, officer }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Failed to assign staff for ${id}`);
    }
    const data = await res.json();
    return data.complaint;
  },

  /**
   * Escalate complaint (Admin Only)
   */
  async escalate(id: string, reason: string, officer?: string): Promise<ComplaintRecord> {
    const res = await fetch(`${API_BASE}/complaints/${encodeURIComponent(id)}/escalate`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ reason, officer }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Failed to escalate complaint ${id}`);
    }
    const data = await res.json();
    return data.complaint;
  },

  /**
   * Resolve complaint (Admin Only)
   */
  async resolve(id: string, resolution: string, officer?: string): Promise<ComplaintRecord> {
    const res = await fetch(`${API_BASE}/complaints/${encodeURIComponent(id)}/resolve`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ resolution, officer }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Failed to resolve complaint ${id}`);
    }
    const data = await res.json();
    return data.complaint;
  },

  /**
   * Upload / save resolution steps and proof (Admin Only)
   */
  async saveResolutionSteps(
    id: string,
    payload: {
      steps: ResolutionStep[];
      attachments: ResolutionProofAttachment[];
      resolutionSummary?: string;
      rootCause?: string;
      preventativeMeasures?: string;
      markResolved?: boolean;
      officer?: string;
    }
  ): Promise<ComplaintRecord> {
    const res = await fetch(`${API_BASE}/complaints/${encodeURIComponent(id)}/resolution-steps`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Failed to save resolution steps for ${id}`);
    }
    const data = await res.json();
    return data.complaint;
  },

  /**
   * Delete complaint (Admin Only)
   */
  async deleteComplaint(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/complaints/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Failed to delete complaint ${id}`);
    }
  },

  /**
   * Fetch backend stats (Public)
   */
  async getStats(): Promise<BackendStatsResponse> {
    const res = await fetch(`${API_BASE}/stats`);
    if (!res.ok) {
      throw new Error('Failed to fetch statistics from backend');
    }
    return res.json();
  },

  /**
   * Fetch staff directory (Public)
   */
  async getStaff(): Promise<StaffAccount[]> {
    const res = await fetch(`${API_BASE}/staff`);
    if (!res.ok) {
      throw new Error('Failed to fetch staff directory from backend');
    }
    const data = await res.json();
    return data.staff || [];
  },

  /**
   * Request AI resolution suggestion from server (Admin Only)
   */
  async requestAISuggestion(complaint: Partial<ComplaintRecord>): Promise<AISuggestionResponse> {
    const res = await fetch(`${API_BASE}/ai/suggest-resolution`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        title: complaint.title || complaint.subject,
        subject: complaint.subject || complaint.title,
        category: complaint.category,
        description: complaint.description,
        location: complaint.location,
      }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'AI suggestion failed');
    }
    return res.json();
  },

  /**
   * Clean all backend data: Clears all complaints, test logs, and refreshes the student registry & Excel spreadsheet
   */
  async cleanAllData(): Promise<{ success: boolean; message: string; complaintsCount: number; studentsCount: number }> {
    const res = await fetch(`${API_BASE}/clean-data`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to clean backend data');
    }
    return res.json();
  },

  /**
   * Reset backend demo data (Admin Only)
   */
  async resetBackend(): Promise<void> {
    const res = await fetch(`${API_BASE}/reset`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to reset backend database');
    }
  },
};
