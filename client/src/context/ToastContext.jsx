import { createContext, useContext, useState } from 'react'
import { CheckCircle2, XCircle } from 'lucide-react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null)

  function showToast(message, type = 'success') {
    setToast({ message, type })
    window.clearTimeout(window.__foodbridgeToast)
    window.__foodbridgeToast = window.setTimeout(() => setToast(null), 3200)
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast ? (
        <div className="fixed right-4 top-4 z-50 flex items-center gap-3 rounded-2xl border border-emerald-100 bg-white px-4 py-3 shadow-soft">
          {toast.type === 'success' ? <CheckCircle2 className="h-5 w-5 text-emerald-600" /> : <XCircle className="h-5 w-5 text-rose-600" />}
          <p className="text-sm font-medium text-slate-700">{toast.message}</p>
        </div>
      ) : null}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used within ToastProvider')
  return context
}
