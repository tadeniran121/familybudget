import { useState, useRef } from 'react'
import { useBudget } from '../store/BudgetContext.jsx'
import { ACTIONS } from '../store/actions.js'
import { formatCurrency, formatShort } from '../utils/currency.js'
import { getCategoryAnnualTotal, getMonthSummary } from '../utils/calculations.js'
import { computeMonthlyEquivalent, INCOME_FREQUENCY_OPTIONS } from '../store/defaultData.js'
import Button from '../components/ui/Button.jsx'
import Modal from '../components/ui/Modal.jsx'
import { useToast } from '../components/ui/Toast.jsx'

const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function BudgetCell({ value, onChange, currency }) {
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
      <td className="px-2 py-1 text-center w-20">
        <input
          ref={inputRef}
          type="number"
          min="0"
          step="1"
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={e => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') setEditing(false) }}
          className="w-full rounded border border-brand-400 bg-brand-50 px-1.5 py-1 text-xs text-center focus:outline-none focus:ring-1 focus:ring-brand-500"
          aria-label="Enter budget amount"
        />
      </td>
    )
  }

  return (
    <td className="px-2 py-1 text-center w-20">
      <button
        onClick={startEdit}
        className="w-full text-xs rounded px-1.5 py-1 text-right hover:bg-slate-100 transition-colors focus:outline-none focus:ring-1 focus:ring-brand-500"
        aria-label={`Edit: ${value > 0 ? formatCurrency(value, currency) : '—'}`}
      >
        {value > 0 ? formatShort(value, currency) : <span className="text-slate-300">—</span>}
      </button>
    </td>
  )
}

function freqBadge(frequency) {
  const opt = INCOME_FREQUENCY_OPTIONS.find(o => o.value === frequency)
  if (!opt || frequency === 'monthly') return null
  return (
    <span className="ml-1 text-[10px] font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">
      {opt.label}
    </span>
  )
}

export default function Budget() {
  const { state, dispatch } = useBudget()
  const { groups, months, currency, household, incomeItems = [] } = state
  const toast = useToast()
  const [collapsed, setCollapsed] = useState({})
  const [incomeCollapsed, setIncomeCollapsed] = useState(false)
  const [copyModal, setCopyModal] = useState(false)
  const [copyFrom, setCopyFrom] = useState(1)
  const [copyTo, setCopyTo] = useState(2)

  // Expense/savings groups only — income handled separately via incomeItems
  const enabledGroups = groups.filter(g => g.enabled && g.type !== 'income')

  function toggleGroup(id) {
    setCollapsed(prev => ({ ...prev, [id]: !prev[id] }))
  }

  function handleCopyMonth() {
    dispatch({ type: ACTIONS.COPY_MONTH, payload: { fromMonth: copyFrom, toMonth: copyTo } })
    toast(`Budget copied from ${MONTH_SHORT[copyFrom - 1]} to ${MONTH_SHORT[copyTo - 1]}`, 'success')
    setCopyModal(false)
  }

  // Net row per month (income - savings - expenses)
  const monthSummaries = months.map(m => getMonthSummary(groups, m, incomeItems))
  const annualNet = monthSummaries.reduce((s, ms) => s + ms.net, 0)

  // Income items grouped by member
  const memberIncomeGroups = household.members.map(member => ({
    member,
    items: incomeItems.filter(i => i.memberId === member.id),
  }))

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h1 className="text-xl font-bold text-slate-900">Budget Planner {state.year}</h1>
        <Button size="sm" variant="secondary" onClick={() => setCopyModal(true)}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Copy Month
        </Button>
      </div>

      {/* Grid */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-4 py-3 font-semibold text-slate-700 sticky left-0 bg-slate-50 min-w-[200px] z-10">
                  Category
                </th>
                {MONTH_SHORT.map(m => (
                  <th key={m} className="text-center px-2 py-3 font-medium text-slate-500 text-xs w-20">
                    {m}
                  </th>
                ))}
                <th className="text-center px-3 py-3 font-semibold text-slate-700 text-xs w-20">Total</th>
              </tr>
            </thead>
            <tbody>

              {/* ── INCOME SECTION (per member, per item) ── */}
              <tr className="bg-emerald-50 border-y border-emerald-200">
                <td className="px-4 py-2 sticky left-0 bg-emerald-50 z-10">
                  <button
                    onClick={() => setIncomeCollapsed(v => !v)}
                    className="flex items-center gap-2 font-semibold text-xs uppercase tracking-wide text-emerald-800 hover:opacity-70 focus:outline-none"
                    aria-expanded={!incomeCollapsed}
                  >
                    <svg className={`w-3.5 h-3.5 transition-transform ${incomeCollapsed ? '-rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                    💵 Income
                  </button>
                </td>
                {months.map(m => {
                  const total = incomeItems.reduce((s, item) => s + (Number(m.budget?.[item.id]) || 0), 0)
                  return (
                    <td key={m.month} className="text-center px-2 py-2 text-xs font-medium text-emerald-800">
                      {total > 0 ? formatShort(total, currency) : <span className="text-slate-300">—</span>}
                    </td>
                  )
                })}
                <td className="text-center px-3 py-2 text-xs font-semibold text-emerald-800">
                  {formatShort(incomeItems.reduce((s, i) => s + getCategoryAnnualTotal(months, i.id), 0), currency)}
                </td>
              </tr>

              {!incomeCollapsed && memberIncomeGroups.map(({ member, items }) => (
                items.length > 0 && (
                  <>
                    {/* Member sub-header */}
                    <tr key={`member-${member.id}`} className="bg-emerald-50/60 border-b border-emerald-100">
                      <td className="px-4 py-1.5 sticky left-0 bg-emerald-50/60 z-10 text-xs font-semibold text-emerald-700">
                        <span className="pl-5">👤 {member.name || member.label}</span>
                      </td>
                      {months.map(m => {
                        const memberTotal = items.reduce((s, item) => s + (Number(m.budget?.[item.id]) || 0), 0)
                        return (
                          <td key={m.month} className="text-center px-2 py-1.5 text-xs text-emerald-600">
                            {memberTotal > 0 ? formatShort(memberTotal, currency) : ''}
                          </td>
                        )
                      })}
                      <td className="text-center px-3 py-1.5 text-xs font-medium text-emerald-700">
                        {formatShort(items.reduce((s, i) => s + getCategoryAnnualTotal(months, i.id), 0), currency)}
                      </td>
                    </tr>

                    {/* Income item rows */}
                    {items.map(item => (
                      <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                        <td className="px-4 py-1.5 sticky left-0 bg-white z-10 border-r border-slate-100 text-slate-700 text-xs">
                          <span className="pl-10">
                            {item.label || 'Income'}
                            {freqBadge(item.frequency)}
                          </span>
                        </td>
                        {months.map(m => (
                          <BudgetCell
                            key={m.month}
                            value={Number(m.budget?.[item.id]) || 0}
                            currency={currency}
                            onChange={v => dispatch({
                              type: ACTIONS.SET_BUDGET,
                              payload: { month: m.month, categoryId: item.id, value: v },
                            })}
                          />
                        ))}
                        <td className="text-center px-3 py-1.5 text-xs font-semibold text-slate-700">
                          {formatShort(getCategoryAnnualTotal(months, item.id), currency)}
                        </td>
                      </tr>
                    ))}
                  </>
                )
              ))}

              {/* ── EXPENSE / SAVINGS GROUPS ── */}
              {enabledGroups.map(group => {
                const isCollapsed = collapsed[group.id]
                const enabledCats = group.categories.filter(c => c.enabled)
                const groupColor = group.type === 'savings' ? 'bg-brand-50' : 'bg-slate-50'
                const groupTextColor = group.type === 'savings' ? 'text-brand-800' : 'text-slate-700'

                return (
                  <>
                    <tr key={`${group.id}-header`} className={`${groupColor} border-y border-slate-200`}>
                      <td className={`px-4 py-2 sticky left-0 ${groupColor} z-10`}>
                        <button
                          onClick={() => toggleGroup(group.id)}
                          className={`flex items-center gap-2 font-semibold text-xs uppercase tracking-wide ${groupTextColor} hover:opacity-70 focus:outline-none`}
                          aria-expanded={!isCollapsed}
                        >
                          <svg className={`w-3.5 h-3.5 transition-transform ${isCollapsed ? '-rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                          {group.icon} {group.label}
                        </button>
                      </td>
                      {months.map(m => {
                        const total = enabledCats.reduce((s, c) => s + (Number(m.budget?.[c.id]) || 0), 0)
                        return (
                          <td key={m.month} className={`text-center px-2 py-2 text-xs font-medium ${groupTextColor}`}>
                            {total > 0 ? formatShort(total, currency) : <span className="text-slate-300">—</span>}
                          </td>
                        )
                      })}
                      <td className={`text-center px-3 py-2 text-xs font-semibold ${groupTextColor}`}>
                        {formatShort(enabledCats.reduce((s, c) => s + getCategoryAnnualTotal(months, c.id), 0), currency)}
                      </td>
                    </tr>

                    {!isCollapsed && enabledCats.map(cat => (
                      <tr key={cat.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                        <td className="px-4 py-1.5 sticky left-0 bg-white z-10 text-slate-700 text-xs font-medium border-r border-slate-100">
                          <span className="pl-4">{cat.label}</span>
                        </td>
                        {months.map(m => (
                          <BudgetCell
                            key={m.month}
                            value={Number(m.budget?.[cat.id]) || 0}
                            currency={currency}
                            onChange={v => dispatch({
                              type: ACTIONS.SET_BUDGET,
                              payload: { month: m.month, categoryId: cat.id, value: v },
                            })}
                          />
                        ))}
                        <td className="text-center px-3 py-1.5 text-xs font-semibold text-slate-700">
                          {formatShort(getCategoryAnnualTotal(months, cat.id), currency)}
                        </td>
                      </tr>
                    ))}
                  </>
                )
              })}

              {/* ── NET BALANCE ROW ── */}
              <tr className="bg-slate-800 text-white border-t-2 border-slate-700">
                <td className="px-4 py-3 sticky left-0 bg-slate-800 z-10 font-bold text-sm">Net Balance</td>
                {monthSummaries.map((ms, i) => (
                  <td key={i} className={`text-center px-2 py-3 text-xs font-bold ${ms.net >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {ms.net !== 0 ? formatShort(ms.net, currency) : '—'}
                  </td>
                ))}
                <td className={`text-center px-3 py-3 text-xs font-bold ${annualNet >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {formatShort(annualNet, currency)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Copy Month Modal */}
      <Modal open={copyModal} onClose={() => setCopyModal(false)} title="Copy Month Budget">
        <p className="text-sm text-slate-500 mb-5">
          Copy all budget values from one month to another. This will overwrite the destination.
        </p>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1.5">Copy from</label>
            <select value={copyFrom} onChange={e => setCopyFrom(Number(e.target.value))} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
              {MONTH_SHORT.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1.5">Copy to</label>
            <select value={copyTo} onChange={e => setCopyTo(Number(e.target.value))} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
              {MONTH_SHORT.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
            </select>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3">
          <Button variant="secondary" size="sm" onClick={() => setCopyModal(false)}>Cancel</Button>
          <Button size="sm" onClick={handleCopyMonth} disabled={copyFrom === copyTo}>Copy budget</Button>
        </div>
      </Modal>
    </div>
  )
}
