export default function ProgressBar({ value = 0, max = 100, variant = 'brand', className = '' }) {
  const pct = Math.min(Math.max((value / max) * 100, 0), 100)

  const trackColors = {
    brand: 'bg-brand-100',
    success: 'bg-emerald-100',
    danger: 'bg-red-100',
    warning: 'bg-amber-100',
  }

  const fillColors = {
    brand: 'bg-brand-500',
    success: 'bg-emerald-500',
    danger: 'bg-red-500',
    warning: 'bg-amber-400',
  }

  const resolvedVariant = pct >= 100 ? 'danger' : pct >= 80 ? 'warning' : variant

  return (
    <div
      className={`h-1.5 rounded-full ${trackColors[resolvedVariant]} overflow-hidden ${className}`}
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={`h-full rounded-full transition-all duration-500 ${fillColors[resolvedVariant]}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
