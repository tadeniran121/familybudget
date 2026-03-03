export default function Select({ label, id, options = [], className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <select
        id={id}
        className={`
          w-full rounded-lg border border-slate-200 bg-white
          px-3 py-2 text-sm text-slate-900
          focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent
          ${className}
        `}
        {...props}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}
