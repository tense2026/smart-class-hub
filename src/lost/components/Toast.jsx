import React from 'react';
import { useLostItems } from '../context/LostItemContext';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export const Toast = () => {
  const { toast } = useLostItems();

  if (!toast.show) return null;

  const iconMap = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-400" />,
    info: <Info className="w-5 h-5 text-indigo-400" />,
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounceIn">
      <div className="flex items-center space-x-3 px-4 py-3 bg-slate-900 text-white rounded-2xl shadow-xl border border-slate-700 max-w-md">
        {iconMap[toast.type] || iconMap.info}
        <span className="text-sm font-semibold">{toast.message}</span>
      </div>
    </div>
  );
};
