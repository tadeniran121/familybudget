const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

export default function TopBar({ activeMonth, onMonthChange, year, household, onExport }) {
  const canGoPrev = activeMonth > 1
  const canGoNext = activeMonth < 12

  return (
    <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3 flex items-center justify-between gap-4 sticky top-0 z-30">
      {/* Month selector */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => canGoPrev && onMonthChange(activeMonth - 1)}
          disabled={!canGoPrev}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500"
          aria-label="Previous month"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <h1 className="text-base font-semibold text-slate-800 min-w-[120px] text-center">
          {MONTHS[activeMonth - 1]} {year}
        </h1>

        <button
          onClick={() => canGoNext && onMonthChange(activeMonth + 1)}
          disabled={!canGoNext}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500"
          aria-label="Next month"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Household name (hidden on mobile) */}
      <span className="hidden sm:block text-sm text-slate-500 font-medium truncate">{household?.name}</span>

      {/* Export */}
      <button
        onClick={onExport}
        className="flex items-center gap-1.5 text-sm text-slate-600 hover:text-brand-700 hover:bg-brand-50 px-3 py-1.5 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500"
        aria-label="Export budget"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        <span className="hidden sm:inline">Export</span>
      </button>
    </header>
  )
}
