import { useState } from 'react'
import { useBudget } from '../../store/BudgetContext.jsx'
import { ACTIONS } from '../../store/actions.js'
import Button from '../ui/Button.jsx'

export default function StepCategories({ onNext, onBack }) {
  const { state, dispatch } = useBudget()
  const { groups } = state
  const expenseGroups = groups.filter(g => g.type !== 'income' && g.type !== 'savings')
  const [expanded, setExpanded] = useState({})

  function toggleExpand(id) {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-slate-900 mb-1">Budget Categories</h2>
      <p className="text-sm text-slate-500 mb-6">
        Enable the categories that apply to your household. You can change these at any time.
      </p>

      <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1 scrollbar-thin">
        {expenseGroups.map(group => (
          <div
            key={group.id}
            className={`rounded-xl border transition-colors ${group.enabled ? 'border-brand-200 bg-brand-50' : 'border-slate-200 bg-slate-50'}`}
          >
            <div className="flex items-center gap-3 p-3">
              {/* Toggle */}
              <button
                type="button"
                role="switch"
                aria-checked={group.enabled}
                onClick={() => dispatch({ type: ACTIONS.TOGGLE_GROUP, payload: group.id })}
                className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 ${group.enabled ? 'bg-brand-500' : 'bg-slate-300'}`}
                aria-label={`Toggle ${group.label}`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition-transform ${group.enabled ? 'translate-x-4' : 'translate-x-0'}`}
                />
              </button>

              <span className="text-lg">{group.icon}</span>
              <span className="flex-1 text-sm font-semibold text-slate-700">{group.label}</span>

              <button
                type="button"
                onClick={() => toggleExpand(group.id)}
                className="text-slate-400 hover:text-slate-600 rounded p-0.5 focus:outline-none"
                aria-label={`${expanded[group.id] ? 'Collapse' : 'Expand'} ${group.label} subcategories`}
              >
                <svg
                  className={`w-4 h-4 transition-transform ${expanded[group.id] ? 'rotate-180' : ''}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            {expanded[group.id] && (
              <div className="px-3 pb-3 space-y-1 border-t border-slate-200/50">
                {group.categories.map(cat => (
                  <div key={cat.id} className="flex items-center gap-2 py-1 pl-8">
                    <button
                      type="button"
                      onClick={() => dispatch({ type: ACTIONS.TOGGLE_CATEGORY, payload: cat.id })}
                      className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${cat.enabled ? 'border-brand-500 bg-brand-500' : 'border-slate-300'}`}
                      aria-pressed={cat.enabled}
                      aria-label={`Toggle ${cat.label}`}
                    >
                      {cat.enabled && (
                        <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                    <span className="text-xs text-slate-600">{cat.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between">
        <Button variant="secondary" onClick={onBack}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </Button>
        <Button onClick={onNext}>
          Finish setup
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Button>
      </div>
    </div>
  )
}
