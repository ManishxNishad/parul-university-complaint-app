import React, { useState } from 'react';
import { PhoneCall, AlertTriangle, X, Check, Shield } from 'lucide-react';
import { EMERGENCY_CONTACTS } from '../data/mockData';

interface EmergencyCallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyCallModal: React.FC<EmergencyCallModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [callingNumber, setCallingNumber] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCall = (number: string) => {
    setCallingNumber(number);
    setTimeout(() => {
      // In web preview, trigger standard tel: protocol or simulated call
      window.location.href = `tel:${number.replace(/\s+/g, '')}`;
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        id="emergency-modal"
        className="bg-white w-full max-w-sm rounded-3xl p-5 shadow-2xl animate-in zoom-in-95 duration-200 border border-rose-100"
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-500/30">
              <PhoneCall size={22} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-tight">
                Emergency Helplines
              </h3>
              <p className="text-xs text-rose-600 font-semibold mt-0.5">
                Parul University Rapid Response
              </p>
            </div>
          </div>
          <button
            id="emergency-close-btn"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <p className="text-xs text-slate-600 mt-3 leading-relaxed">
          Select an emergency contact below for immediate dispatch or campus security assistance:
        </p>

        {/* Contacts List */}
        <div className="mt-4 space-y-2.5">
          {EMERGENCY_CONTACTS.map((item, idx) => (
            <div
              key={idx}
              className="p-3 bg-rose-50/50 hover:bg-rose-50 border border-rose-100 rounded-2xl flex items-center justify-between transition-colors"
            >
              <div className="min-w-0 pr-2">
                <h4 className="text-xs font-bold text-slate-900 leading-snug">
                  {item.name}
                </h4>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs font-mono font-bold text-rose-700">
                    {item.number}
                  </span>
                  <span className="text-[10px] text-slate-400">•</span>
                  <span className="text-[10px] text-emerald-700 font-medium">
                    {item.available}
                  </span>
                </div>
              </div>

              <button
                id={`call-emergency-btn-${idx}`}
                type="button"
                onClick={() => handleCall(item.number)}
                className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-xs shrink-0 flex items-center gap-1.5 transition-all"
              >
                <PhoneCall size={13} />
                <span>Call</span>
              </button>
            </div>
          ))}
        </div>

        {/* Notice */}
        <div className="mt-4 p-2.5 bg-slate-50 rounded-xl flex items-center gap-2 text-[11px] text-slate-500">
          <Shield size={16} className="text-slate-400 shrink-0" />
          <span>Security guard booths are located at Gates 1, 2, 3 and 4.</span>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full mt-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
