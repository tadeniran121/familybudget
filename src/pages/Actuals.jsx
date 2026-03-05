import { useBudget } from '../store/BudgetContext.jsx'
import { ACTIONS } from '../store/actions.js'
import { formatCurrency } from '../utils/currency.js'
import { INCOME_FREQUENCY_OPTIONS } from '../store/defaultData.js'
import Badge from '../components/ui/Badge.jsx'
import { useState, useRef } from 'react'

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December']

function ActualInput({ value, onChange, currency }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')
  const inputRef = useRef(null)

  function startEdit() {
    setDraft(value > 0 ? String(value) : '')
    setEditing(true)
    setTimeout(() => inputRef.current?.select(), 0)
  }

  function commit() {
    onChange(parseFloat(draft) || 0)
    setEditing(false)
  }

  if (editing) {
    return (
      <input
        ref={inputRef}
        type="number"
        min="0"
        step="0.01"
        value={draft}
        onChange={e => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={e => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') setEditing(false) }}
        className="w-full rounded border border-brand-400 bg-brand-50 px-2 py-1 text-sm text-right focus:outline-none focus:ring-1 focus:ring-brand-500"
        aria-label="Enter actual amount"
      />
    )
  }

  return (
    <button
      onClick={startEdit}
      className="w-full text-right text-sm rounded px-2 py-1 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-1 focus:ring-brand-500"
      aria-label={value > 0 ? `Actual: ${formatCurrency(value, currency)}` : 'Click to enter actual amount'}
    >
      {value > 0
        ? <span className="text-slate-800 font-medium">{formatCurrency(value, currency)}</span>
        : <span className="text-slate-300 text-xs italic">tap to enter</span>
      }
    </button>
  )
}

function VarianceBadge({ budget, actual, currency }) {
  if (!actual && !budget) return null
  if (!actual) return <span className="text-xs text-slate-300">—</span>
  const diff = budget - actual
  if (diff > 0) return <Badge variant="success">+{formatCurrency(diff, currency)}</Badge>
  if (diff < 0) return <Badge variant="danger">{formatCurrency(diff, currency)}</Badge>
  return <Badge variant="default">On target</Badge>
}

function freqLabel(frequency) {
  const opt = INCOME_FREQUENCY_OPTIONS.find(o => o.value === frequency)
  return opt && frequency !== 'monthly' ? ` (${opt.label})` : ''
}

export default function Actuals({ activeMonth, onMonthChange }) {
  const { state, dispatch } = useBudget()
  const { groups, months, currency, household, incomeItems = [] } = state
  const monthData = months.find(m => m.month === activeMonth)

  const enabledGroups = groups.filter(g => g.enabled && g.type !== 'income')

  function handleActual(categoryId, value) {
    dispatch({ type: ACTIONS.SET_ACTUAL, payload: { month: activeMonth, categoryId, value } })
  }

  // Expense totals (excluding income & savings for this display)
  let totalBudgetExpense = 0, totalActualExpense = 0
  enabledGroups.filter(g => g.type === 'expense').forEach(g => {
    g.categories.filter(c => c.enabled).forEach(cat => {
      totalBudgetExpense += Number(monthData?.budget?.[cat.id]) || 0
      totalActualExpense += Number(monthData?.actuals?.[cat.id]) || 0
    })
  })

  // Income totals
  const totalBudgetIncome = incomeItems.reduce((s, i) => s + (Number(monthData?.budget?.[i.id]) || 0), 0)
  const totalActualIncome = incomeItems.reduce((s, i) => s + (Number(monthData?.actuals?.[i.id]) || 0), 0)

  const memberIncomeGroups = household.members.map(member => ({
    member,
    items: incomeItems.filter(i => i.memberId === member.id),
  }))

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-xl font-bold text-slate-900">Actuals — {MONTH_NAMES[activeMonth - 1]}</h1>
        <select
          value={activeMonth}
          onChange={e => onMonthChange(Number(e.target.value))}
          className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
          aria-label="Select month"
        >
          {MONTH_NAMES.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-4 py-3 font-semibold text-slate-700 min-w-[200px]">Category</th>
                <th className="text-right px-4 py-3 font-semibold text-slate-700 w-28">Budget</th>
                <th className="text-right px-4 py-3 font-semibold text-slate-700 w-32">Actual</th>
                <th className="text-right px-4 py-3 font-semibold text-slate-700 w-28">Variance</th>
              </tr>
            </thead>
            <tbody>

              {/* ── INCOME (per member) ── */}
              <tr className="bg-emerald-50 border-y border-emerald-200">
                <td className="px-4 py-2 font-semibold text-xs uppercase tracking-wide text-emerald-800">
                  💵 Income
                </td>
                <td className="text-right px-4 py-2 text-xs font-semibold text-emerald-800">
                  {totalBudgetIncome > 0 ? formatCurrency(totalBudgetIncome, currency) : '—'}
                </td>
                <td className="text-right px-4 py-2 text-xs font-semibold text-emerald-800">
                  {totalActualIncome > 0 ? formatCurrency(totalActualIncome, currency) : '—'}
                </td>
                <td className="text-right px-4 py-2">
                  <VarianceBadge budget={totalBudgetIncome} actual={totalActualIncome > 0 ? totalActualIncome : null} currency={currency} />
                </td>
              </tr>

              {memberIncomeGroups.map(({ member, items }) => items.length > 0 && (
                <>
                  {/* Member sub-header */}
                  <tr key={`mi-${member.id}`} className="bg-emerald-50/60 border-b border-emerald-100">
                    <td colSpan={4} className="px-4 py-1 text-xs font-semibold text-emerald-700">
                      <span className="pl-4">👤 {member.name || member.label}</span>
                    </td>
                  </tr>

                  {/* Income item rows */}
                  {items.map(item => {
                    const budget = Number(monthData?.budget?.[item.id]) || 0
                    const actual = Number(monthData?.actuals?.[item.id]) || 0
                    return (
                      <tr key={item.id} className="border-b border-slate-100 hover:bg-emerald-50/30">
                        <td className="px-4 py-2 text-xs text-slate-700">
                          <span className="pl-8">
                            {item.label || 'Income'}
                            {freqLabel(item.frequency) && (
                              <span className="text-slate-400">{freqLabel(item.frequency)}</span>
                            )}
                          </span>
                        </td>
                        <td className="text-right px-4 py-2 text-xs text-slate-500">
                          {budget > 0 ? formatCurrency(budget, currency) : <span className="text-slate-300">—</span>}
                        </td>
                        <td className="px-4 py-2">
                          <ActualInput value={actual} onChange={v => handleActual(item.id, v)} currency={currency} />
                        </td>
                        <td className="text-right px-4 py-2">
                          <VarianceBadge budget={budget} actual={actual > 0 ? actual : null} currency={currency} />
                        </td>
                      </tr>
                    )
                  })}
                </>
              ))}

              {/* ── EXPENSE / SAVINGS GROUPS ── */}
              {enabledGroups.map(group => {
                const enabledCats = group.categories.filter(c => c.enabled)
                const groupBudget = enabledCats.reduce((s, c) => s + (Number(monthData?.budget?.[c.id]) || 0), 0)
                const groupActual = enabledCats.reduce((s, c) => s + (Number(monthData?.actuals?.[c.id]) || 0), 0)
                const groupColor = group.type === 'savings' ? 'bg-brand-50' : 'bg-slate-50'
                const groupText = group.type === 'savings' ? 'text-brand-800' : 'text-slate-700'

                return (
                  <>
                    <tr key={`${group.id}-hdr`} className={`${groupColor} border-y border-slate-200`}>
                      <td className={`px-4 py-2 font-semibold text-xs uppercase tracking-wide ${groupText}`}>
                        {group.icon} {group.label}
                      </td>
                      <td className={`text-right px-4 py-2 text-xs font-semibold ${groupText}`}>
                        {groupBudget > 0 ? formatCurrency(groupBudget, currency) : '—'}
                      </td>
                      <td className={`text-right px-4 py-2 text-xs font-semibold ${groupText}`}>
                        {groupActual > 0 ? formatCurrency(groupActual, currency) : '—'}
                      </td>
                      <td className="text-right px-4 py-2">
                        <VarianceBadge budget={groupBudget} actual={groupActual > 0 ? groupActual : null} currency={currency} />
                      </td>
                    </tr>

                    {enabledCats.map(cat => {
                      const budget = Number(monthData?.budget?.[cat.id]) || 0
                      const actual = Number(monthData?.actuals?.[cat.id]) || 0
                      return (
                        <tr key={cat.id} className={`border-b border-slate-100 ${actual > budget && budget > 0 ? 'bg-red-50' : 'hover:bg-slate-50/50'}`}>
                          <td className="px-4 py-2">
                            <span className="pl-4 text-slate-700 text-xs">{cat.label}</span>
                          </td>
                          <td className="text-right px-4 py-2 text-xs text-slate-500">
                            {budget > 0 ? formatCurrency(budget, currency) : <span className="text-slate-300">—</span>}
                          </td>
                          <td className="px-4 py-2">
                            <ActualInput value={actual} onChange={v => handleActual(cat.id, v)} currency={currency} />
                          </td>
                          <td className="text-right px-4 py-2">
                            <VarianceBadge budget={budget} actual={actual > 0 ? actual : null} currency={currency} />
                          </td>
                        </tr>
                      )
                    })}
                  </>
                )
              })}

              {/* ── TOTALS ROW ── */}
              <tr className="bg-slate-800 text-white border-t-2 border-slate-700">
                <td className="px-4 py-3 font-bold text-sm">Total Expenses</td>
                <td className="text-right px-4 py-3 text-sm font-bold">{formatCurrency(totalBudgetExpense, currency)}</td>
                <td className="text-right px-4 py-3 text-sm font-bold">
                  {totalActualExpense > 0 ? formatCurrency(totalActualExpense, currency) : '—'}
                </td>
                <td className="text-right px-4 py-3">
                  {totalActualExpense > 0 && (
                    <VarianceBadge budget={totalBudgetExpense} actual={totalActualExpense} currency={currency} />
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-slate-400 text-center">
        Click any cell in the Actual column to enter your actual spend
      </p>
    </div>
  )
}
