import { useEffect, useRef } from 'react'

export default function Modal({ open, onClose, title, children, maxWidth = 'max-w-md' }) {
  const dialogRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const dialog = dialogRef.current
    const focusable = dialog?.querySelectorAll('button, input, select, textarea, [tabindex]:not([tabindex="-1"])')
    if (focusable?.length) focusable[0].focus()

    const handleKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'Tab' && focusable?.length) {
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (e.shiftKey ? document.activeElement === first : document.activeElement === last) {
          e.preventDefault()
          ;(e.shiftKey ? last : first).focus()
        }
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={dialogRef}
        className={`relative bg-white rounded-2xl shadow-xl w-full ${maxWidth} p-6 z-10`}
      >
        {title && (
          <div className="flex items-center justify-between mb-4">
            <h2 id="modal-title" className="text-lg font-semibold text-slate-900">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 rounded-lg p-1 focus:outline-none focus:ring-2 focus:ring-brand-500"
              aria-label="Close modal"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  )
}
