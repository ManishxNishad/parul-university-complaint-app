import { ComplaintItem, NotificationItem, NoticeUpdate, UserProfile } from '../types';

export const INITIAL_USER: UserProfile = {
  name: 'Rohan Sharma',
  enrollmentNo: '23CS12345',
  program: 'B.Tech - CSE',
  university: 'Parul University',
  email: 'rohan.sharma23@paruluniversity.ac.in',
  phone: '+91 98765 43210',
  hostelBlock: 'Hostel 2',
  roomNo: 'Room 305',
  role: 'Student',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
};

export const INITIAL_COMPLAINTS: ComplaintItem[] = [
  {
    id: 'PUC20260912',
    title: 'AC not working in Hostel Room',
    category: 'Hostel & Accommodation',
    description:
      'The AC in my hostel room (H-2, Room 305) has not been working since 2 days. Please look into this as it is very hot.',
    location: 'Hostel 2, Room 305',
    status: 'In Progress',
    date: '12 Sep 2026',
    time: '10:30 AM',
    images: [
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=400',
    ],
    timeline: [
      {
        id: 'tl-1',
        title: 'Complaint Submitted',
        timestamp: '12 Sep 2026, 10:30 AM',
        description: 'Your complaint has been submitted successfully.',
        status: 'completed',
      },
      {
        id: 'tl-2',
        title: 'Under Review',
        timestamp: '12 Sep 2026, 01:15 PM',
        description: 'Assigned to Hostel Maintenance Officer (Mr. Rajesh Patel)',
        status: 'completed',
        officer: 'Mr. Rajesh Patel',
      },
      {
        id: 'tl-3',
        title: 'In Progress',
        timestamp: '12 Sep 2026, 03:30 PM',
        description: 'Technician dispatched to inspect AC unit compressor & coolant.',
        status: 'current',
      },
      {
        id: 'tl-4',
        title: 'Resolved',
        timestamp: 'Pending Resolution',
        description: 'Issue verification and final confirmation by student.',
        status: 'pending',
      },
    ],
    assignedTo: 'Campus Maintenance Wing - Block 2',
  },
  {
    id: 'PUC20260905',
    title: 'Library Seating',
    category: 'Library Services',
    description:
      'Several reading chairs on the 2nd floor silent study zone are damaged, wobbling and lack proper cushions.',
    location: 'Central Library, 2nd Floor',
    status: 'Resolved',
    date: '05 Sep 2026',
    time: '02:15 PM',
    images: [
      'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=400',
    ],
    timeline: [
      {
        id: 'tl-l1',
        title: 'Complaint Submitted',
        timestamp: '05 Sep 2026, 02:15 PM',
        description: 'Submitted to Chief Librarian Desk.',
        status: 'completed',
      },
      {
        id: 'tl-l2',
        title: 'Resolved',
        timestamp: '07 Sep 2026, 11:00 AM',
        description: 'Chairs repaired and 12 ergonomic chairs newly installed in silent zone.',
        status: 'completed',
      },
    ],
    assignedTo: 'Central Library Administration',
  },
  {
    id: 'PUC20260828',
    title: 'Cafeteria Food Quality',
    category: 'Cafeteria & Mess',
    description:
      'Food warmth and hygiene checks needed during the peak 1:00 PM rush at Counter 4.',
    location: 'Main Food Court, Counter 4',
    status: 'Closed',
    date: '28 Aug 2026',
    time: '01:45 PM',
    images: [],
    timeline: [
      {
        id: 'tl-c1',
        title: 'Complaint Submitted',
        timestamp: '28 Aug 2026, 01:45 PM',
        description: 'Forwarded to Food Safety & Catering Committee.',
        status: 'completed',
      },
      {
        id: 'tl-c2',
        title: 'Closed',
        timestamp: '30 Aug 2026, 04:00 PM',
        description: 'Inspection completed and caterer issued formal compliance directive.',
        status: 'completed',
      },
    ],
    assignedTo: 'Food & Safety Committee',
  },
];

export const INITIAL_UPDATES: NoticeUpdate[] = [
  {
    id: 'up-1',
    title: 'Campus Wi-Fi Upgrade',
    date: 'Wi-Fi maintenance on 15 Sep, 10:00 AM',
    department: 'IT Department',
    icon: 'Wifi',
    type: 'maintenance',
  },
  {
    id: 'up-2',
    title: 'Semester Exam Hall Tickets',
    date: 'Available for download from 18 Sep',
    department: 'Examination Cell',
    icon: 'FileText',
    type: 'academic',
  },
  {
    id: 'up-3',
    title: 'Blood Donation Camp',
    date: 'Organized at Health Center on 20 Sep',
    department: 'Parul Sevashram Hospital',
    icon: 'Heart',
    type: 'event',
  },
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    type: 'alert',
    title: 'Complaint Update',
    message: 'Your complaint #PUC20260912 is now In Progress.',
    timestamp: '10:30 AM',
    category: 'Updates',
    complaintId: 'PUC20260912',
    unread: true,
  },
  {
    id: 'notif-3',
    type: 'success',
    title: 'Complaint Resolved',
    message: 'Your complaint #PUC20260905 has been resolved.',
    timestamp: '2 Days Ago',
    category: 'Updates',
    complaintId: 'PUC20260905',
    unread: false,
  },
  {
    id: 'notif-4',
    type: 'event',
    title: 'Event Alert',
    message: 'Tech Fest 2026 registrations are now open.',
    timestamp: '3 Days Ago',
    category: 'All',
    unread: false,
  },
];

export const EMERGENCY_CONTACTS = [
  { name: 'Campus Security Control Room', number: '+91 2668 260300', available: '24x7 Available' },
  { name: 'Parul Sevashram Hospital Ambulance', number: '+91 2668 260312', available: '24x7 Emergency' },
  { name: "Women's Safety & Anti-Harassment Cell", number: '+91 90990 44040', available: 'Immediate Response' },
  { name: 'Hostel Chief Warden', number: '+91 99099 22001', available: 'Hostel Emergencies' },
];

export const SUPPORT_DIRECTORY = [
  {
    id: 'it',
    title: 'IT Support',
    email: 'helpdesk@paruluniversity.ac.in',
    phone: '+91 2668 260280',
    icon: 'Laptop',
    description: 'Wi-Fi, ERP portal, student email and smart classroom tech issues',
  },
  {
    id: 'hostel',
    title: 'Hostel Office',
    email: 'hostel@paruluniversity.ac.in',
    phone: '+91 2668 260210',
    icon: 'Building2',
    description: 'Room allocation, maintenance, mess feedback and warden queries',
  },
  {
    id: 'transport',
    title: 'Transport',
    email: 'transport@paruluniversity.ac.in',
    phone: '+91 2668 260299',
    icon: 'Bus',
    description: 'Bus routes, bus passes, schedule delays and driver queries',
  },
  {
    id: 'enquiry',
    title: 'General Enquiry',
    email: 'info@paruluniversity.ac.in',
    phone: '+91 2668 260200',
    icon: 'HelpCircle',
    description: 'Admissions, fees, document verification and general campus info',
  },
  {
    id: 'faqs',
    title: 'FAQs',
    email: 'Find answers to common questions',
    phone: 'Self-help knowledgebase',
    icon: 'HelpCircle',
    description: 'Browse step-by-step guides on lodging issues and resolution SLAs',
  },
];
