import React from 'react';
import { Wifi } from 'lucide-react';

interface StatusBarProps {
  theme?: 'dark' | 'light';
  time?: string;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  theme = 'light',
  time = '9:41',
}) => {
  const isLightText = theme === 'light';

  return (
    <div
      className={`w-full px-6 pt-3 pb-1 flex md:hidden items-center justify-between text-xs font-semibold select-none z-30 ${
        isLightText ? 'text-white' : 'text-slate-800'
      }`}
    >
      <span className="tracking-tight font-medium text-[13px]">{time}</span>
      <div className="flex items-center gap-1.5">
        {/* Cellular signal bars */}
        <div className="flex items-end gap-0.5 h-3">
          <span
            className={`w-0.5 h-1 rounded-sm ${
              isLightText ? 'bg-white' : 'bg-slate-800'
            }`}
          />
          <span
            className={`w-0.5 h-1.5 rounded-sm ${
              isLightText ? 'bg-white' : 'bg-slate-800'
            }`}
          />
          <span
            className={`w-0.5 h-2.5 rounded-sm ${
              isLightText ? 'bg-white' : 'bg-slate-800'
            }`}
          />
          <span
            className={`w-0.5 h-3 rounded-sm ${
              isLightText ? 'bg-white' : 'bg-slate-800'
            }`}
          />
        </div>

        {/* Wifi Icon */}
        <Wifi size={13} strokeWidth={2.5} />

        {/* Battery Icon */}
        <div className="flex items-center">
          <div
            className={`w-5 h-2.5 rounded-[3px] border px-0.5 py-[1px] flex items-center ${
              isLightText ? 'border-white' : 'border-slate-800'
            }`}
          >
            <div
              className={`h-full w-full rounded-[1px] ${
                isLightText ? 'bg-white' : 'bg-slate-800'
              }`}
            />
          </div>
          <div
            className={`w-[1px] h-1 rounded-r-sm ${
              isLightText ? 'bg-white' : 'bg-slate-800'
            }`}
          />
        </div>
      </div>
    </div>
  );
};
