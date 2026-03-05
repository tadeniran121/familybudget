import { useBudget } from '../../store/BudgetContext.jsx'
import { ACTIONS } from '../../store/actions.js'
import {
  CURRENCIES,
  INCOME_FREQUENCY_OPTIONS,
  INCOME_LABEL_SUGGESTIONS,
  computeMonthlyEquivalent,
} from '../../store/defaultData.js'
import { formatCurrency } from '../../utils/currency.js'
import Button from '../ui/Button.jsx'

const FREQ_OPTIONS = INCOME_FREQUENCY_OPTIONS.map(o => ({ value: o.value, label: o.label }))

const FREQ_HINTS = {
  monthly:   'Monthly take-home',
  quarterly: 'Per quarter — ÷3 for monthly figure',
  biannual:  'Per payment — ÷6 for monthly figure',
  annual:    'Full year total — ÷12 for monthly figure',
}

function IncomeRow({ item, symbol, currency, onUpdate, onRemove, canRemove }) {
  const monthly = computeMonthlyEquivalent(item.amount, item.frequency)
  const isNonMonthly = item.frequency !== 'monthly'

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 space-y-2">
      <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
        {/* Label */}
        <div className="flex-1 min-w-0 w-full sm:w-auto">
          <input
            type="text"
            list={`suggestions-${item.id}`}
            value={item.label}
            onChange={e => onUpdate({ ...item, label: e.target.value })}
            placeholder="e.g. Wages & Salary"
            className="w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            aria-label="Income source name"
          />
          <datalist id={`suggestions-${item.id}`}>
            {INCOME_LABEL_SUGGESTIONS.map(s => <option key={s} value={s} />)}
          </datalist>
        </div>

        {/* Frequency */}
        <select
          value={item.frequency}
          onChange={e => onUpdate({ ...item, frequency: e.target.value })}
          className="rounded-lg border border-slate-200 px-2 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 flex-shrink-0"
          aria-label="Payment frequency"
        >
          {FREQ_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        {/* Amount */}
        <div className="flex items-center gap-0.5 flex-shrink-0">
          <span className="text-sm text-slate-500 font-medium">{symbol}</span>
          <input
            type="number"
            min="0"
            step="1"
            value={item.amount || ''}
            onChange={e => onUpdate({ ...item, amount: parseFloat(e.target.value) || 0 })}
            placeholder="0"
            className="w-24 rounded-lg border border-slate-200 px-2 py-1.5 text-sm text-right focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            aria-label={`${item.label || 'Income'} amount`}
          />
        </div>

        {/* Remove */}
        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="text-slate-300 hover:text-red-500 rounded p-0.5 transition-colors flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-red-400"
            aria-label={`Remove ${item.label}`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Monthly breakdown hint */}
      {item.amount > 0 && (
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs text-slate-400">{FREQ_HINTS[item.frequency]}</span>
          {isNonMonthly && (
            <span className="text-xs font-semibold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full whitespace-nowrap">
              = {formatCurrency(monthly, currency)}/month
            </span>
          )}
        </div>
      )}
    </div>
  )
}

function MemberIncomeCard({ member, items, symbol, currency, dispatch }) {
  const memberTotal = items.reduce(
    (sum, item) => sum + computeMonthlyEquivalent(item.amount, item.frequency), 0
  )

  function handleUpdate(updated) {
    dispatch({ type: ACTIONS.UPDATE_INCOME_ITEM, payload: updated })
  }

  function handleRemove(itemId) {
    dispatch({ type: ACTIONS.REMOVE_INCOME_ITEM, payload: itemId })
  }

  function handleAdd() {
    dispatch({
      type: ACTIONS.ADD_INCOME_ITEM,
      payload: {
        id: `inc_${member.id}_${Date.now()}`,
        memberId: member.id,
        label: '',
        frequency: 'monthly',
        amount: 0,
      },
    })
  }

  return (
    <div className="rounded-2xl border border-slate-200 overflow-hidden">
      {/* Member header */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-brand-900 text-white">
        <span>👤</span>
        <span className="font-semibold text-sm">{member.name || member.label}</span>
      </div>

      <div className="p-3 space-y-2 bg-slate-50">
        {items.map(item => (
          <IncomeRow
            key={item.id}
            item={item}
            symbol={symbol}
            currency={currency}
            onUpdate={handleUpdate}
            onRemove={() => handleRemove(item.id)}
            canRemove={items.length > 1}
          />
        ))}

        <button
          type="button"
          onClick={handleAdd}
          className="flex items-center gap-1.5 text-sm text-brand-600 hover:text-brand-700 font-medium py-1 px-1 rounded focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add income source
        </button>
      </div>

      {/* Per-member monthly total */}
      {memberTotal > 0 && (
        <div className="flex items-center justify-between px-4 py-2 bg-brand-50 border-t border-brand-100">
          <span className="text-xs font-medium text-brand-700">
            {member.name || member.label}'s monthly income
          </span>
          <span className="text-sm font-bold text-brand-800">
            {formatCurrency(memberTotal, currency)}
          </span>
        </div>
      )}
    </div>
  )
}

export default function StepIncome({ onNext, onBack }) {
  const { state, dispatch } = useBudget()
  const { household, incomeItems = [], currency } = state
  const symbol = CURRENCIES.find(c => c.code === currency)?.symbol ?? '£'

  const householdMonthly = incomeItems.reduce(
    (sum, item) => sum + computeMonthlyEquivalent(item.amount, item.frequency), 0
  )

  return (
    <div>
      <h2 className="text-xl font-bold text-slate-900 mb-1">Income</h2>
      <p className="text-sm text-slate-500 mb-5">
        Add all income sources for each person. Mix monthly salaries, quarterly bonuses, and annual
        payments — we'll calculate the monthly equivalent automatically.
      </p>

      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-0.5 scrollbar-thin">
        {household.members.map(member => {
          const memberItems = incomeItems.filter(i => i.memberId === member.id)
          return (
            <MemberIncomeCard
              key={member.id}
              member={member}
              items={memberItems.length > 0 ? memberItems : [{
                id: `inc_${member.id}_default`,
                memberId: member.id,
                label: '',
                frequency: 'monthly',
                amount: 0,
              }]}
              symbol={symbol}
              currency={currency}
              dispatch={dispatch}
            />
          )
        })}
      </div>

      {/* Combined household total */}
      {householdMonthly > 0 && (
        <div className="mt-4 p-3 bg-brand-600 rounded-xl flex items-center justify-between text-white">
          <span className="text-sm font-medium">Combined household / month</span>
          <span className="text-lg font-bold">{formatCurrency(householdMonthly, currency)}</span>
        </div>
      )}

      <div className="mt-6 flex items-center justify-between">
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
