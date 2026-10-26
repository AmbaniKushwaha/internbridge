import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ToastContainer = () => {
  const { toasts, removeToast } = useApp();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          const isSuccess = toast.type === 'success';
          const isError = toast.type === 'error';
          const isWarning = toast.type === 'warning';

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-2xl border shadow-xl bg-white/95 backdrop-blur-md transition-all ${
                isSuccess
                  ? 'border-emerald-200/90 text-slate-800'
                  : isError
                  ? 'border-rose-200/90 text-slate-800'
                  : isWarning
                  ? 'border-amber-200/90 text-slate-800'
                  : 'border-slate-200/90 text-slate-800'
              }`}
            >
              <div className="shrink-0 mt-0.5">
                {isSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                {isError && <AlertCircle className="w-4 h-4 text-rose-600" />}
                {isWarning && <AlertCircle className="w-4 h-4 text-amber-600" />}
                {!isSuccess && !isError && !isWarning && <Info className="w-4 h-4 text-indigo-600" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-slate-900">{toast.title}</div>
                {toast.message && (
                  <div className="text-xs text-slate-600 mt-0.5 leading-relaxed">{toast.message}</div>
                )}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-slate-600 shrink-0 p-0.5 rounded cursor-pointer transition-colors"
                aria-label="Dismiss toast"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
