export default function Input({
  label,
  id,
  className = '',
  error,
  prefix,
  ...props
}) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {prefix && (
          <span className="absolute left-3 text-slate-500 text-sm font-medium pointer-events-none">
            {prefix}
          </span>
        )}
        <input
          id={id}
          className={`
            w-full rounded-lg border border-slate-200 bg-white
            px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400
            focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent
            disabled:bg-slate-50 disabled:text-slate-400
            ${prefix ? 'pl-8' : ''}
            ${error ? 'border-red-400 focus:ring-red-400' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
