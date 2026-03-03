import { useBudget } from '../../store/BudgetContext.jsx'
import { ACTIONS } from '../../store/actions.js'
import { CURRENCIES } from '../../store/defaultData.js'
import { formatCurrency } from '../../utils/currency.js'
import Button from '../ui/Button.jsx'

export default function StepIncome({ onNext, onBack }) {
  const { state, dispatch } = useBudget()
  const { groups, months, currency } = state
  const symbol = CURRENCIES.find(c => c.code === currency)?.symbol ?? '£'

  const incomeGroup = groups.find(g => g.id === 'grp_income')
  const enabledCats = incomeGroup?.categories.filter(c => c.enabled) ?? []

  const month1 = months[0]

  const total = enabledCats.reduce((sum, cat) => sum + (Number(month1.budget?.[cat.id]) || 0), 0)

  function setIncome(catId, value) {
    const num = parseFloat(value) || 0
    for (let i = 1; i <= 12; i++) {
      dispatch({ type: ACTIONS.SET_BUDGET, payload: { month: i, categoryId: catId, value: num } })
    }
  }

  function toggleCat(catId) {
    dispatch({ type: ACTIONS.TOGGLE_CATEGORY, payload: catId })
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-slate-900 mb-1">Monthly Income</h2>
      <p className="text-sm text-slate-500 mb-6">
        Enter your typical monthly take-home income. You can adjust month-by-month later.
      </p>

      <div className="space-y-3">
        {incomeGroup?.categories.map(cat => (
          <div key={cat.id} className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${cat.enabled ? 'border-slate-200 bg-white' : 'border-transparent bg-slate-50'}`}>
            <button
              type="button"
              onClick={() => toggleCat(cat.id)}
              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors flex-shrink-0 ${cat.enabled ? 'border-brand-500 bg-brand-500' : 'border-slate-300'}`}
              aria-pressed={cat.enabled}
              aria-label={`Toggle ${cat.label}`}
            >
              {cat.enabled && (
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
            <span className="flex-1 text-sm font-medium text-slate-700">{cat.label}</span>
            {cat.enabled && (
              <div className="flex items-center gap-1">
                <span className="text-sm text-slate-500">{symbol}</span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  placeholder="0"
                  value={month1.budget?.[cat.id] ?? ''}
                  onChange={e => setIncome(cat.id, e.target.value)}
                  className="w-28 rounded-lg border border-slate-200 px-2 py-1.5 text-sm text-right focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  aria-label={`${cat.label} monthly amount`}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {total > 0 && (
        <div className="mt-4 p-3 bg-brand-50 rounded-xl flex items-center justify-between">
          <span className="text-sm text-brand-700 font-medium">Combined monthly income</span>
          <span className="text-base font-bold text-brand-800">{formatCurrency(total, currency)}</span>
        </div>
      )}

      <div className="mt-8 flex items-center justify-between">
        <Button variant="secondary" onClick={onBack}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </Button>
        <Button onClick={onNext}>
          Next: Categories
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Button>
      </div>
    </div>
  )
}
