import React, { useState, useEffect } from 'react';
import {
  ScreenType,
  ComplaintItem,
  ComplaintCategory,
  UserProfile,
  ComplaintRecord,
  StaffAccount,
} from './types';
import { INITIAL_UPDATES, INITIAL_NOTIFICATIONS } from './data/mockData';

// Screen Components
import {
  LoginScreen,
  getActiveSession,
  clearActiveSession,
} from './components/LoginScreen';
import { HomeScreen } from './components/HomeScreen';
import { RaiseComplaintScreen } from './components/RaiseComplaintScreen';
import { ReviewComplaintScreen } from './components/ReviewComplaintScreen';
import { AlertsScreen } from './components/AlertsScreen';
import { ComplaintsScreen } from './components/ComplaintsScreen';
import { ComplaintDetailsScreen } from './components/ComplaintDetailsScreen';
import { HelpSupportScreen } from './components/HelpSupportScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { UniversityInfoScreen } from './components/UniversityInfoScreen';
import { Drawer } from './components/Drawer';
import { BottomNav } from './components/BottomNav';
import { DesktopNavbar } from './components/DesktopNavbar';
import { EmergencyCallModal } from './components/EmergencyCallModal';
import { ThemeSelectorModal } from './components/ThemeSelectorModal';
import { useTheme } from './theme';

// Staff Portal Components & Storage
import { StaffLoginScreen } from './components/staff/StaffLoginScreen';
import { StaffPortal } from './components/staff/StaffPortal';
import {
  getActiveStaffSession,
  clearActiveStaffSession,
  getStoredComplaints,
  saveStoredComplaints,
  syncComplaintsWithBackend,
} from './data/complaintsStore';

export default function App() {
  const { theme } = useTheme();

  // Portal Mode: 'student' | 'staff'
  const [portalMode, setPortalMode] = useState<'student' | 'staff'>(() => {
    return getActiveStaffSession() ? 'staff' : 'student';
  });

  // Active Staff Member State
  const [activeStaff, setActiveStaff] = useState<StaffAccount | null>(() => {
    return getActiveStaffSession();
  });

  // Active verified student session check
  const activeSession = getActiveSession();

  // App Navigation & Session State for Student Portal
  const [currentScreen, setCurrentScreen] = useState<ScreenType>(() => {
    return activeSession ? 'home' : 'login';
  });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);

  // Authenticated Student State
  const [user, setUser] = useState<UserProfile | null>(() => {
    if (activeSession) {
      let savedAvatar: string | null = null;
      try {
        savedAvatar = localStorage.getItem(`pu_student_avatar_${activeSession.enrollmentNo}`);
      } catch {
        // ignore
      }

      return {
        name: activeSession.name,
        enrollmentNo: activeSession.enrollmentNo,
        email: activeSession.email,
        phone: activeSession.phone,
        program: activeSession.department,
        university: 'Parul University',
        hostelBlock: 'Campus Residence',
        roomNo: 'Verified Student',
        role: 'Student',
        avatarUrl:
          savedAvatar ||
          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250',
      };
    }
    return null;
  });

  // User Complaints State - loaded from central store or local storage (all complaints visible to all users)
  const [complaints, setComplaints] = useState<ComplaintItem[]>(() => {
    return getStoredComplaints();
  });

  // Keep complaints in sync with shared localStorage updates
  useEffect(() => {
    const handleSync = () => {
      const all = getStoredComplaints();
      setComplaints(all);

      setSelectedComplaint((prev) => {
        if (!prev) return null;
        const fresh = all.find((c) => c.id === prev.id);
        return fresh || prev;
      });
    };

    window.addEventListener('pu_complaints_updated', handleSync);
    window.addEventListener('storage', handleSync);

    // Initial backend synchronization
    syncComplaintsWithBackend().then((fresh) => {
      if (Array.isArray(fresh)) {
        setComplaints(fresh);
      }
    });

    return () => {
      window.removeEventListener('pu_complaints_updated', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  const [updates] = useState(INITIAL_UPDATES);

  // Notifications (Alerts & Updates without reminders)
  const [notifications, setNotifications] = useState<any[]>(() => {
    const list = INITIAL_NOTIFICATIONS.filter((n) => (n.category as string) !== 'Reminders');
    if (activeSession) {
      return [
        {
          id: 'notif-welcome',
          title: 'Account Verified & Active',
          message: `Welcome back, ${activeSession.name}. Your grievance portal is active.`,
          timestamp: 'Just now',
          type: 'status',
          category: 'Updates',
          unread: true,
        },
        ...list,
      ];
    }
    return list;
  });

  // Selected complaint for details view
  const [selectedComplaint, setSelectedComplaint] = useState<ComplaintItem | null>(null);

  // Draft state for new complaint
  const [draftComplaint, setDraftComplaint] = useState<{
    category: ComplaintCategory;
    title: string;
    description: string;
    location: string;
    images: string[];
  }>({
    category: 'Hostel & Accommodation',
    title: '',
    description: '',
    location: '',
    images: [],
  });

  // Guarded navigation - strictly blocks access if student is not authenticated
  const handleNavigateScreen = (screen: ScreenType) => {
    if (!user && screen !== 'login') {
      alert(
        'Access Restricted: You must create an account and verify both your phone and email before accessing the portal.'
      );
      setCurrentScreen('login');
      return;
    }
    setCurrentScreen(screen);
  };

  // Handle Student Login / Registration Success
  const handleLoginSuccess = (role: 'Student' | 'Staff', customUser?: Partial<UserProfile>) => {
    if (!customUser || !customUser.name || !customUser.enrollmentNo) {
      return;
    }
    let savedAvatar: string | null = null;
    try {
      savedAvatar = localStorage.getItem(`pu_student_avatar_${customUser.enrollmentNo}`);
    } catch {
      // ignore
    }

    const newUser: UserProfile = {
      name: customUser.name,
      enrollmentNo: customUser.enrollmentNo,
      email: customUser.email || `${customUser.enrollmentNo.toLowerCase()}@paruluniversity.ac.in`,
      phone: customUser.phone || '',
      program: customUser.program || 'Faculty of Engineering & Technology',
      university: 'Parul University',
      hostelBlock: 'Campus Residence',
      roomNo: 'Verified Student',
      role,
      avatarUrl:
        savedAvatar ||
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250',
    };
    setUser(newUser);

    const all = getStoredComplaints();
    setComplaints(all);

    setNotifications([
      {
        id: `notif-${Date.now()}`,
        title: 'Account Verified & Active',
        message: `Welcome, ${newUser.name}. Your Parul University grievance portal account is active.`,
        timestamp: 'Just now',
        type: 'status',
        category: 'Updates',
        unread: true,
      },
      ...INITIAL_NOTIFICATIONS.filter((n) => (n.category as string) !== 'Reminders'),
    ]);

    setCurrentScreen('home');
  };

  const handleLogout = () => {
    clearActiveSession();
    setUser(null);
    setSelectedComplaint(null);
    setCurrentScreen('login');
  };

  // Handle proceed from Raise -> Review
  const handleProceedToReview = (data: {
    category: ComplaintCategory;
    title: string;
    description: string;
    location: string;
    images: string[];
  }) => {
    setDraftComplaint(data);
    setCurrentScreen('review');
  };

  // Handle final submission of complaint by Student
  const handleSubmitSuccess = (newId: string) => {
    if (!user) return;
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    const newRecord: ComplaintRecord = {
      id: newId,
      studentName: user.name,
      ugNumber: user.enrollmentNo,
      department: user.program || 'Faculty of Engineering & Technology',
      category: draftComplaint.category,
      subject: draftComplaint.title || `${draftComplaint.category} Grievance`,
      title: draftComplaint.title || `${draftComplaint.category} Grievance`,
      description: draftComplaint.description,
      attachment: draftComplaint.images[0] || '',
      images: draftComplaint.images,
      location: draftComplaint.location,
      submittedDate: dateStr,
      date: dateStr,
      time: timeStr,
      priority: 'Medium',
      status: 'Submitted',
      assignedStaff: 'Unassigned',
      assignedDepartment: draftComplaint.category,
      timeline: [
        {
          id: `tl-${Date.now()}-1`,
          title: 'Complaint Submitted',
          timestamp: `${dateStr}, ${timeStr}`,
          description: 'Your complaint has been submitted successfully to the department.',
          status: 'completed',
        },
        {
          id: `tl-${Date.now()}-2`,
          title: 'Under Review',
          timestamp: 'Pending Staff Assignment',
          description: 'Dispatched to Departmental Redressal Cell',
          status: 'current',
        },
      ],
    };

    // Update central shared store in localStorage
    const shared = getStoredComplaints();
    const filteredShared = shared.filter((c) => c.id !== newId);
    saveStoredComplaints([newRecord, ...filteredShared]);

    // Also persist per-student list
    setComplaints((prev) => [newRecord, ...prev.filter((c) => c.id !== newId)]);
    setSelectedComplaint(newRecord);

    setDraftComplaint({
      category: 'Hostel & Accommodation',
      title: '',
      description: '',
      location: '',
      images: [],
    });
  };

  const handleSelectComplaint = (complaint: ComplaintItem) => {
    setSelectedComplaint(complaint);
    setCurrentScreen('details');
  };

  const handleSelectComplaintById = (complaintId: string) => {
    const found = complaints.find((c) => c.id === complaintId);
    if (found) {
      setSelectedComplaint(found);
      setCurrentScreen('details');
    } else {
      setCurrentScreen('complaints');
    }
  };

  // =========================================================================
  // 1. STAFF PORTAL VIEW (SEPARATE ADMINISTRATIVE EXPERIENCE)
  // =========================================================================
  if (portalMode === 'staff') {
    if (!activeStaff) {
      return (
        <StaffLoginScreen
          onLoginSuccess={(staff) => {
            setActiveStaff(staff);
          }}
          onSwitchToStudentPortal={() => setPortalMode('student')}
        />
      );
    }

    return (
      <StaffPortal
        currentStaff={activeStaff}
        onLogout={() => {
          clearActiveStaffSession();
          setActiveStaff(null);
        }}
        onSwitchToStudentPortal={() => setPortalMode('student')}
      />
    );
  }

  // =========================================================================
  // 2. STUDENT PORTAL VIEW (PRESERVED & ENHANCED WITH LIVE TRACKING)
  // =========================================================================
  const showBottomNav =
    user !== null &&
    ['home', 'complaints', 'alerts', 'profile'].includes(currentScreen);

  return (
    <div
      id="app-root"
      className={`min-h-screen w-full ${theme.classes.screenBg} text-slate-800 flex flex-col antialiased selection:bg-blue-600 selection:text-white`}
    >
      {/* Desktop Navigation Bar */}
      {user && currentScreen !== 'login' && (
        <DesktopNavbar
          currentScreen={currentScreen}
          onNavigate={handleNavigateScreen}
          user={user}
          unreadAlertsCount={notifications.filter((n) => n.unread).length}
          onOpenEmergency={() => setIsEmergencyOpen(true)}
          onOpenThemeSelector={() => setIsThemeModalOpen(true)}
          onLogout={handleLogout}
          onSwitchToStaffPortal={() => setPortalMode('staff')}
        />
      )}

      {/* Main Responsive Screen Workspace */}
      <main className="flex-1 w-full flex flex-col overflow-y-auto">
        {!user || currentScreen === 'login' ? (
          <LoginScreen
            onLoginSuccess={handleLoginSuccess}
            onSwitchToStaffLogin={() => setPortalMode('staff')}
          />
        ) : (
          <>
            {currentScreen === 'home' && (
              <HomeScreen
                user={user}
                complaints={complaints}
                updates={updates}
                onOpenDrawer={() => setIsDrawerOpen(true)}
                onNavigate={handleNavigateScreen}
                onSelectComplaint={handleSelectComplaint}
                onEmergencyCall={() => setIsEmergencyOpen(true)}
                onOpenThemeSelector={() => setIsThemeModalOpen(true)}
              />
            )}

            {currentScreen === 'raise' && (
              <RaiseComplaintScreen
                onBack={() => setCurrentScreen('home')}
                onProceedToReview={handleProceedToReview}
                initialData={draftComplaint}
              />
            )}

            {currentScreen === 'review' && (
              <ReviewComplaintScreen
                data={draftComplaint}
                onBack={() => setCurrentScreen('raise')}
                onEdit={() => setCurrentScreen('raise')}
                onSubmitSuccess={handleSubmitSuccess}
                onNavigate={handleNavigateScreen}
              />
            )}

            {currentScreen === 'alerts' && (
              <AlertsScreen
                notifications={notifications}
                onNavigate={handleNavigateScreen}
                onSelectComplaintId={handleSelectComplaintById}
                onMarkAllRead={() => {
                  setNotifications(
                    notifications.map((n) => ({ ...n, unread: false }))
                  );
                }}
              />
            )}

            {currentScreen === 'complaints' && (
              <ComplaintsScreen
                complaints={complaints}
                onBack={() => setCurrentScreen('home')}
                onSelectComplaint={handleSelectComplaint}
                onNavigate={handleNavigateScreen}
                studentEnrollment={user.enrollmentNo}
              />
            )}

            {currentScreen === 'details' &&
              (selectedComplaint ? (
                <ComplaintDetailsScreen
                  complaint={selectedComplaint}
                  onBack={() => setCurrentScreen('complaints')}
                />
              ) : (
                <ComplaintsScreen
                  complaints={complaints}
                  onBack={() => setCurrentScreen('home')}
                  onSelectComplaint={handleSelectComplaint}
                  onNavigate={handleNavigateScreen}
                  studentEnrollment={user.enrollmentNo}
                />
              ))}

            {currentScreen === 'support' && (
              <HelpSupportScreen
                onBack={() => setCurrentScreen('home')}
                onEmergencyCall={() => setIsEmergencyOpen(true)}
              />
            )}

            {currentScreen === 'profile' && (
              <ProfileScreen
                user={user}
                onBack={() => setCurrentScreen('home')}
                onNavigate={handleNavigateScreen}
                onLogout={handleLogout}
                onUpdateUser={(updated) =>
                  setUser((prev) => {
                    if (!prev) return null;
                    // Phone numbers are locked to university registration records and cannot be updated
                    const { phone: _restrictedPhone, ...allowedUpdates } = updated;
                    const next = { ...prev, ...allowedUpdates };
                    if (next.enrollmentNo && updated.avatarUrl !== undefined) {
                      try {
                        if (updated.avatarUrl) {
                          localStorage.setItem(`pu_student_avatar_${next.enrollmentNo}`, updated.avatarUrl);
                        } else {
                          localStorage.removeItem(`pu_student_avatar_${next.enrollmentNo}`);
                        }
                      } catch (e) {
                        console.warn('Unable to persist student avatar', e);
                      }
                    }
                    return next;
                  })
                }
                onOpenThemeSelector={() => setIsThemeModalOpen(true)}
              />
            )}

            {currentScreen === 'university' && (
              <UniversityInfoScreen onBack={() => setCurrentScreen('home')} />
            )}
          </>
        )}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      {showBottomNav && (
        <BottomNav
          currentScreen={currentScreen}
          onNavigate={handleNavigateScreen}
          unreadAlertsCount={notifications.filter((n) => n.unread).length}
        />
      )}

      {/* Mobile Side Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onNavigate={handleNavigateScreen}
        onOpenSettings={() => {
          setCurrentScreen('university');
          setIsDrawerOpen(false);
        }}
        onOpenAbout={() => {
          setCurrentScreen('university');
          setIsDrawerOpen(false);
        }}
        onOpenThemeSelector={() => setIsThemeModalOpen(true)}
        onSwitchToStaffPortal={() => {
          setIsDrawerOpen(false);
          setPortalMode('staff');
        }}
      />

      {/* Emergency Helpline Modal */}
      <EmergencyCallModal
        isOpen={isEmergencyOpen}
        onClose={() => setIsEmergencyOpen(false)}
      />

      {/* Theme Selector Modal */}
      <ThemeSelectorModal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
      />
    </div>
  );
}
