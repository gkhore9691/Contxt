'use client'

import { createContext, useContext, useState, useCallback } from 'react'

interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
}

interface ToastContextValue {
  toasts: Toast[]
  toast: (message: string, type?: Toast['type']) => void
  dismiss: (id: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const dismiss = useCallback((id: string) => {
    setToasts((t) => t.filter((x) => x.id !== id))
  }, [])

  const toast = useCallback((message: string, type: Toast['type'] = 'info') => {
    const id = Math.random().toString(36).slice(2)
    setToasts((t) => [...t, { id, message, type }])
    setTimeout(() => dismiss(id), 3500)
  }, [dismiss])

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto animate-[fade-up_0.3s_ease] rounded-lg border px-4 py-3 font-sans text-sm shadow-lg backdrop-blur-sm transition-all ${
              t.type === 'success'
                ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
                : t.type === 'error'
                ? 'border-red-500/20 bg-red-500/10 text-red-400'
                : 'border-[var(--bg-border)] bg-[var(--bg-surface)] text-[var(--text-primary)]'
            }`}
          >
            <div className="flex items-center gap-2">
              <span>{t.message}</span>
              <button
                onClick={() => dismiss(t.id)}
                className="ml-2 text-current opacity-50 hover:opacity-100"
              >
                &times;
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
