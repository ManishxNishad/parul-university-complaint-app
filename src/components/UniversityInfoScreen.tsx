import React, { useState } from 'react';
import {
  ChevronLeft,
  MapPin,
  Phone,
  Calendar,
  Globe,
  MessageSquare,
  ShieldAlert,
  ChevronRight,
  ExternalLink,
  Building,
  CheckCircle2,
} from 'lucide-react';
import { StatusBar } from './StatusBar';
import { useTheme } from '../theme';

interface UniversityInfoScreenProps {
  onBack: () => void;
}

export const UniversityInfoScreen: React.FC<UniversityInfoScreenProps> = ({
  onBack,
}) => {
  const { theme } = useTheme();
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');

  const links = [
    { id: 'map', title: 'Campus Map', icon: <MapPin size={18} /> },
    { id: 'contacts', title: 'Important Contacts', icon: <Phone size={18} /> },
    { id: 'calendar', title: 'Academic Calendar', icon: <Calendar size={18} /> },
    { id: 'website', title: 'University Website', icon: <Globe size={18} /> },
    { id: 'feedback', title: 'Feedback', icon: <MessageSquare size={18} /> },
    { id: 'terms', title: 'Terms & Privacy', icon: <ShieldAlert size={18} /> },
  ];

  return (
    <div
      id="university-info-screen"
      className={`min-h-full flex flex-col transition-colors duration-300 ${theme.classes.screenBg}`}
    >
      {/* Header */}
      <div
        className="text-white pt-2 pb-4 px-4 shadow-sm transition-all duration-300"
        style={{
          background: `linear-gradient(135deg, ${theme.colors.headerFrom} 0%, ${theme.colors.headerVia} 60%, ${theme.colors.headerTo} 100%)`,
        }}
      >
        <StatusBar theme="light" />
        <div className="flex items-center justify-between mt-2">
          <button
            id="uni-back-btn"
            onClick={onBack}
            className="p-1.5 -ml-1 text-slate-200 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Go back"
          >
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-base font-semibold text-white">Parul University</h1>
          <div className="w-8" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-4 py-4 space-y-4 overflow-y-auto">
        {/* Hero Card */}
        <div className="relative rounded-2xl overflow-hidden shadow-md h-44 flex items-end p-4 border border-slate-700/20">
          <img
            src="https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=800"
            alt="Parul University Campus Building"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent" />

          <div className="relative z-10 text-white">
            <h2 className="text-lg font-bold tracking-tight">
              About Parul University
            </h2>
            <p className="text-xs text-slate-200 mt-1 leading-snug">
              A place to learn, grow and make an impact.
            </p>
          </div>
        </div>

        {/* Info Links Card */}
        <div
          className={`rounded-2xl border shadow-2xs divide-y overflow-hidden ${theme.classes.cardBg} ${theme.classes.cardBorder} ${
            theme.isDark ? 'divide-slate-800' : 'divide-slate-100'
          }`}
        >
          {links.map((link) => (
            <button
              key={link.id}
              id={`uni-link-${link.id}`}
              onClick={() => setActiveModal(link.id)}
              className={`w-full px-4 py-3.5 flex items-center justify-between transition-colors ${
                theme.isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div style={{ color: theme.colors.primary }}>{link.icon}</div>
                <span
                  className={`text-xs sm:text-sm font-semibold ${
                    theme.isDark ? 'text-slate-100' : 'text-slate-800'
                  }`}
                >
                  {link.title}
                </span>
              </div>
              <ChevronRight size={18} className="text-slate-400" />
            </button>
          ))}
        </div>

        {/* University Fast Facts */}
        <div
          className={`p-4 rounded-2xl border shadow-2xs ${theme.classes.cardBg} ${theme.classes.cardBorder}`}
        >
          <h3
            className={`text-xs font-bold uppercase tracking-wider mb-2 ${
              theme.isDark ? 'text-slate-200' : 'text-slate-900'
            }`}
          >
            Campus Highlights
          </h3>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div
              className={`p-2 rounded-xl border ${
                theme.isDark
                  ? 'bg-slate-800/80 border-slate-750 text-slate-300'
                  : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
            >
              <span
                style={{ color: theme.colors.primary }}
                className="font-bold text-sm block"
              >
                150+
              </span>
              <span>Acre Lush Green Campus</span>
            </div>
            <div
              className={`p-2 rounded-xl border ${
                theme.isDark
                  ? 'bg-slate-800/80 border-slate-750 text-slate-300'
                  : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
            >
              <span
                style={{ color: theme.colors.primary }}
                className="font-bold text-sm block"
              >
                43,000+
              </span>
              <span>Students from 68+ Nations</span>
            </div>
            <div
              className={`p-2 rounded-xl border ${
                theme.isDark
                  ? 'bg-slate-800/80 border-slate-750 text-slate-300'
                  : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
            >
              <span
                style={{ color: theme.colors.primary }}
                className="font-bold text-sm block"
              >
                NAAC A++
              </span>
              <span>Accredited Institution</span>
            </div>
            <div
              className={`p-2 rounded-xl border ${
                theme.isDark
                  ? 'bg-slate-800/80 border-slate-750 text-slate-300'
                  : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
            >
              <span
                style={{ color: theme.colors.primary }}
                className="font-bold text-sm block"
              >
                24x7
              </span>
              <span>Security & Hospital Service</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Modals */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className={`w-full max-w-sm rounded-2xl p-5 shadow-2xl border ${theme.classes.cardBg} ${theme.classes.cardBorder} animate-in zoom-in-95`}
          >
            <div
              className={`flex items-center justify-between pb-3 border-b ${
                theme.isDark ? 'border-slate-800' : 'border-slate-100'
              }`}
            >
              <h3
                className={`text-sm font-bold capitalize ${
                  theme.isDark ? 'text-slate-100' : 'text-slate-900'
                }`}
              >
                {links.find((l) => l.id === activeModal)?.title}
              </h3>
              <button
                onClick={() => {
                  setActiveModal(null);
                  setFeedbackSent(false);
                }}
                className="text-slate-400 hover:text-slate-200 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div
              className={`py-4 text-xs space-y-3 ${
                theme.isDark ? 'text-slate-300' : 'text-slate-600'
              }`}
            >
              {activeModal === 'map' && (
                <div className="space-y-2">
                  <div className="w-full h-36 rounded-xl overflow-hidden relative border border-slate-700/30">
                    <img
                      src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=500"
                      alt="Map"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-blue-950/20 flex items-center justify-center">
                      <span className="bg-white/95 px-3 py-1 rounded-full text-[11px] font-semibold text-slate-900 shadow">
                        Parul University Campus, P.O. Limda, Vadodara
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Includes Engineering, Medical, Management faculties, Central Library & Hostels 1–12.
                  </p>
                </div>
              )}

              {activeModal === 'contacts' && (
                <div className="space-y-2">
                  <p><strong>Campus Registrar:</strong> +91 2668 260312</p>
                  <p><strong>Hostel Warden HQ:</strong> +91 2668 260210</p>
                  <p><strong>Security Patrol:</strong> +91 99099 22001</p>
                  <p><strong>Anti-Ragging Squad:</strong> 1800-180-5522</p>
                </div>
              )}

              {activeModal === 'calendar' && (
                <div className="space-y-2">
                  <div
                    className="p-2.5 rounded-xl font-medium"
                    style={{
                      backgroundColor: theme.colors.accentBadge,
                      color: theme.colors.accentText,
                    }}
                  >
                    Odd Semester Exams: Nov 15 - Dec 05, 2026
                  </div>
                  <div
                    className={`p-2.5 rounded-xl font-medium border ${
                      theme.isDark
                        ? 'bg-slate-800 border-slate-700 text-slate-200'
                        : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  >
                    Winter Break: Dec 24, 2026 - Jan 02, 2027
                  </div>
                  <div className="p-2.5 bg-purple-500/10 text-purple-400 rounded-xl font-medium border border-purple-500/20">
                    Annual Cultural Dhoom Fest: Feb 18 - 21, 2027
                  </div>
                </div>
              )}

              {activeModal === 'website' && (
                <div className="text-center py-2 space-y-3">
                  <Globe
                    size={32}
                    style={{ color: theme.colors.primary }}
                    className="mx-auto"
                  />
                  <p>Visit the official university portal for announcements, ERP login and syllabus.</p>
                  <a
                    href="https://paruluniversity.ac.in"
                    target="_blank"
                    rel="noreferrer"
                    style={{ backgroundColor: theme.colors.primary }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-white font-semibold rounded-xl text-xs shadow-sm"
                  >
                    <span>Open paruluniversity.ac.in</span>
                    <ExternalLink size={13} />
                  </a>
                </div>
              )}

              {activeModal === 'feedback' && (
                <div>
                  {feedbackSent ? (
                    <div className="text-center py-4 space-y-2">
                      <CheckCircle2 size={36} className="mx-auto text-emerald-500" />
                      <p
                        className={`font-bold ${
                          theme.isDark ? 'text-slate-100' : 'text-slate-800'
                        }`}
                      >
                        Thank you!
                      </p>
                      <p className="text-slate-400">Your feedback has been routed to the Dean of Student Affairs.</p>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      <p>How can we improve the campus complaint portal?</p>
                      <textarea
                        rows={3}
                        value={feedbackText}
                        onChange={(e) => setFeedbackText(e.target.value)}
                        placeholder="Write your feedback..."
                        className={`w-full p-2.5 rounded-xl text-xs border ${theme.classes.inputBg} ${theme.classes.inputBorder} ${
                          theme.isDark ? 'text-slate-100' : 'text-slate-800'
                        }`}
                      />
                      <button
                        onClick={() => {
                          if (feedbackText.trim()) setFeedbackSent(true);
                        }}
                        style={{ backgroundColor: theme.colors.primary }}
                        className="w-full py-2 text-white font-semibold rounded-xl shadow-md"
                      >
                        Submit Feedback
                      </button>
                    </div>
                  )}
                </div>
              )}

              {activeModal === 'terms' && (
                <div className="space-y-2 text-[11px] leading-relaxed max-h-48 overflow-y-auto">
                  <p><strong>1. Privacy Policy:</strong> Personal details and complaints lodged are accessible strictly to authorized campus authorities and grievance officers.</p>
                  <p><strong>2. Fair Use:</strong> Misleading, abusive, or fraudulent grievances are subject to campus disciplinary council review.</p>
                  <p><strong>3. SLAs:</strong> Critical safety and health issues are addressed within 2 hours. Routine hostel maintenance takes 24-48 business hours.</p>
                </div>
              )}
            </div>

            <button
              onClick={() => {
                setActiveModal(null);
                setFeedbackSent(false);
              }}
              className={`w-full mt-2 py-2 font-semibold rounded-xl text-xs transition-colors border ${
                theme.isDark
                  ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-750'
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
