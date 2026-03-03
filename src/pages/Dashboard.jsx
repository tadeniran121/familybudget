import { useMemo } from 'react'
import { useBudget } from '../store/BudgetContext.jsx'
import { getMonthSummary, getSpendingByCategory, getYearSummary } from '../utils/calculations.js'
import { formatCurrency, formatShort } from '../utils/currency.js'
import Card from '../components/ui/Card.jsx'
import ProgressBar from '../components/ui/ProgressBar.jsx'
import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line,
} from 'recharts'

const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const CHART_COLORS = [
  '#0d9488', '#14b8a6', '#2dd4bf', '#5eead4',
  '#f59e0b', '#fbbf24', '#f97316', '#a78bfa',
  '#60a5fa', '#34d399', '#f87171', '#94a3b8',
]

export default function Dashboard({ activeMonth }) {
  const { state } = useBudget()
  const { groups, months, currency } = state

  const monthData = months.find(m => m.month === activeMonth) ?? months[0]
  const summary = useMemo(() => getMonthSummary(groups, monthData), [groups, monthData])
  const spendingByCategory = useMemo(() => getSpendingByCategory(groups, monthData), [groups, monthData])
  const yearSummary = useMemo(() => getYearSummary(groups, months), [groups, months])

  const yearChartData = yearSummary.map((s, i) => ({
    name: MONTH_SHORT[i],
    Income: s.income,
    Expenses: s.expenses + s.savings,
  }))

  const savingsGroups = groups.filter(g => g.type === 'savings' && g.enabled)

  const netIsPositive = summary.net >= 0

  const summaryCards = [
    {
      title: 'Income',
      value: summary.income,
      actual: summary.actualIncome,
      icon: '💵',
      color: 'text-slate-800',
      bgIcon: 'bg-emerald-100',
    },
    {
      title: 'Expenses',
      value: summary.expenses,
      actual: summary.actualExpenses,
      icon: '🧾',
      color: 'text-slate-800',
      bgIcon: 'bg-orange-100',
    },
    {
      title: 'Savings',
      value: summary.savings,
      actual: summary.actualSavings,
      icon: '🏦',
      color: 'text-slate-800',
      bgIcon: 'bg-brand-100',
    },
    {
      title: 'Net Balance',
      value: summary.net,
      actual: summary.actualNet,
      icon: netIsPositive ? '📈' : '📉',
      color: netIsPositive ? 'text-emerald-600' : 'text-red-600',
      bgIcon: netIsPositive ? 'bg-emerald-100' : 'bg-red-100',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map(card => (
          <Card key={card.title} className="flex flex-col gap-3">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-slate-500 font-medium">{card.title}</p>
                <p className={`text-2xl font-bold mt-1 ${card.color}`}>
                  {formatShort(card.value, currency)}
                </p>
              </div>
              <div className={`w-9 h-9 rounded-xl ${card.bgIcon} flex items-center justify-center text-lg flex-shrink-0`}>
                {card.icon}
              </div>
            </div>
            {card.actual > 0 && (
              <>
                <ProgressBar
                  value={card.actual}
                  max={Math.max(card.value, card.actual, 1)}
                  variant={card.title === 'Net Balance' ? (netIsPositive ? 'success' : 'danger') : 'brand'}
                />
                <p className="text-xs text-slate-400">
                  Actual: {formatShort(card.actual, currency)}
                </p>
              </>
            )}
          </Card>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Category donut */}
        <Card>
          <h2 className="text-base font-semibold text-slate-800 mb-4">
            Spending by Category
          </h2>
          {spendingByCategory.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-slate-400 text-sm">
              No budget data entered yet
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="w-full sm:w-48 h-48" role="img" aria-label="Spending by category pie chart">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={spendingByCategory}
                      cx="50%"
                      cy="50%"
                      innerRadius="55%"
                      outerRadius="80%"
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {spendingByCategory.map((_, i) => (
                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(v) => [formatCurrency(v, currency), '']}
                      contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <ul className="space-y-1.5 flex-1 text-sm">
                {spendingByCategory.map((item, i) => {
                  const total = spendingByCategory.reduce((s, x) => s + x.value, 0)
                  const pct = total > 0 ? Math.round((item.value / total) * 100) : 0
                  return (
                    <li key={item.id} className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
                        />
                        <span className="text-slate-700 truncate">{item.icon} {item.label}</span>
                      </div>
                      <span className="text-slate-500 font-medium flex-shrink-0">{pct}%</span>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}
        </Card>

        {/* Year bar chart */}
        <Card>
          <h2 className="text-base font-semibold text-slate-800 mb-4">
            Income vs. Expenses — {state.year}
          </h2>
          <div className="h-48" role="img" aria-label="Annual income versus expenses bar chart">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={yearChartData} barSize={8} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={v => formatShort(v, currency)}
                  width={50}
                />
                <Tooltip
                  formatter={(v, name) => [formatCurrency(v, currency), name]}
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}
                />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="Income" fill="#0d9488" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Expenses" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Savings progress */}
      {savingsGroups.length > 0 && (
        <Card>
          <h2 className="text-base font-semibold text-slate-800 mb-4">Savings Progress</h2>
          <div className="space-y-4">
            {savingsGroups.flatMap(g =>
              g.categories.filter(c => c.enabled).map(cat => {
                const budgeted = months.reduce((s, m) => s + (Number(m.budget?.[cat.id]) || 0), 0)
                const actual = months.reduce((s, m) => s + (Number(m.actuals?.[cat.id]) || 0), 0)
                return (
                  <div key={cat.id}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm text-slate-700">{cat.label}</span>
                      <div className="text-right">
                        <span className="text-sm font-semibold text-slate-800">{formatCurrency(actual, currency)}</span>
                        {budgeted > 0 && (
                          <span className="text-xs text-slate-400 ml-1">/ {formatCurrency(budgeted, currency)}</span>
                        )}
                      </div>
                    </div>
                    <ProgressBar value={actual} max={Math.max(budgeted, actual, 1)} variant="brand" />
                  </div>
                )
              })
            )}
          </div>
        </Card>
      )}
    </div>
  )
}
