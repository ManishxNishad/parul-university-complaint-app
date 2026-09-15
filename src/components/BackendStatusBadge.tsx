import React, { useState, useEffect } from 'react';
import { Server, Activity, CheckCircle2, AlertCircle } from 'lucide-react';
import { apiClient, BackendHealthResponse } from '../services/api';
import { BackendStatusModal } from './BackendStatusModal';

interface BackendStatusBadgeProps {
  className?: string;
}

export const BackendStatusBadge: React.FC<BackendStatusBadgeProps> = ({ className = '' }) => {
  const [health, setHealth] = useState<BackendHealthResponse | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPinging, setIsPinging] = useState(false);

  const checkStatus = async () => {
    setIsPinging(true);
    try {
      const data = await apiClient.checkHealth();
      setHealth(data);
    } catch {
      setHealth(null);
    } finally {
      setIsPinging(false);
    }
  };

  useEffect(() => {
    checkStatus();
    // Poll every 30 seconds
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const isConnected = health !== null && health.status === 'ok';

  return (
    <>
      <button
        id="backend-status-badge-btn"
        onClick={() => setIsModalOpen(true)}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all cursor-pointer shadow-2xs ${
          isConnected
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300'
            : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100 hover:border-amber-300'
        } ${className}`}
        title="Click to inspect live backend API endpoints and latency"
      >
        <span
          className={`w-2 h-2 rounded-full shrink-0 ${
            isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
          }`}
        />
        <Server size={12} className={isConnected ? 'text-emerald-700' : 'text-amber-700'} />
        <span className="hidden sm:inline">
          {isConnected ? `Backend API: ${health?.latencyMs ?? 0}ms` : 'Backend API: Connecting'}
        </span>
        <span className="sm:hidden">{isConnected ? `${health?.latencyMs ?? 0}ms` : 'API'}</span>
      </button>

      <BackendStatusModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};
