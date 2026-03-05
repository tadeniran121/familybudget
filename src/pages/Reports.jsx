import { useState, useMemo } from 'react'
import { useBudget } from '../store/BudgetContext.jsx'
import { getYearSummary, getSpendingByCategory, getCategoryAnnualTotal } from '../utils/calculations.js'
import { formatCurrency, formatShort } from '../utils/currency.js'
import Card from '../components/ui/Card.jsx'
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LineChart, Line, PieChart, Pie, Cell,
} from 'recharts'

const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const CHART_COLORS = [
  '#0d9488', '#14b8a6', '#2dd4bf', '#5eead4',
  '#f59e0b', '#fbbf24', '#f97316', '#a78bfa',
  '#60a5fa', '#34d399', '#f87171', '#94a3b8',
]

const TABS = ['Year Overview', 'Category Breakdown', 'Savings Tracker']

export default function Reports() {
  const { state } = useBudget()
  const { groups, months, currency, year, incomeItems = [] } = state
  const [tab, setTab] = useState(0)

  const yearSummary = useMemo(() => getYearSummary(groups, months, incomeItems), [groups, months, incomeItems])

  const yearChartData = yearSummary.map((s, i) => ({
    name: MONTH_SHORT[i],
    Income: s.income,
    Expenses: s.expenses + s.savings,
    Net: s.net,
  }))

  // Cumulative savings line
  const savingsLineData = (() => {
    let cumulative = 0
    return yearSummary.map((s, i) => {
      cumulative += s.actualSavings || s.savings
      return { name: MONTH_SHORT[i], Savings: cumulative }
    })
  })()

  // Category breakdown for all months
  const allCategorySpend = useMemo(() => {
    const totals = {}
    groups.filter(g => g.enabled && g.type === 'expense').forEach(g => {
      g.categories.filter(c => c.enabled).forEach(cat => {
        totals[cat.id] = {
          label: cat.label,
          group: g.label,
          value: getCategoryAnnualTotal(months, cat.id),
        }
      })
    })
    return Object.values(totals)
      .filter(x => x.value > 0)
      .sort((a, b) => b.value - a.value)
  }, [groups, months])

  const totalExpenses = allCategorySpend.reduce((s, c) => s + c.value, 0)

  const ytdIncome = yearSummary.reduce((s, m) => s + m.income, 0)
  const ytdExpenses = yearSummary.reduce((s, m) => s + m.expenses, 0)
  const ytdSavings = yearSummary.reduce((s, m) => s + m.savings, 0)
  const ytdNet = ytdIncome - ytdExpenses - ytdSavings
  const savingsRate = ytdIncome > 0 ? Math.round((ytdSavings / ytdIncome) * 100) : 0

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-slate-900">Reports — {year}</h1>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1 w-fit">
        {TABS.map((t, i) => (
          <button
            key={t}
            onClick={() => setTab(i)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 ${
              tab === i ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Tab: Year Overview */}
      {tab === 0 && (
        <div className="space-y-4">
          {/* YTD stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Total Income', value: ytdIncome, color: 'text-emerald-600' },
              { label: 'Total Expenses', value: ytdExpenses + ytdSavings, color: 'text-orange-600' },
              { label: 'Net Surplus', value: ytdNet, color: ytdNet >= 0 ? 'text-brand-600' : 'text-red-600' },
              { label: 'Savings Rate', value: `${savingsRate}%`, color: 'text-amber-600', raw: true },
            ].map(stat => (
              <Card key={stat.label}>
                <p className="text-xs text-slate-500 mb-1">{stat.label}</p>
                <p className={`text-xl font-bold ${stat.color}`}>
                  {stat.raw ? stat.value : formatShort(stat.value, currency)}
                </p>
              </Card>
            ))}
          </div>

          {/* Bar chart */}
          <Card>
            <h2 className="text-base font-semibold text-slate-800 mb-4">Income vs. Expenses {year}</h2>
            <div className="h-60" role="img" aria-label="Annual income versus expenses bar chart">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={yearChartData} barCategoryGap="25%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => formatShort(v, currency)} width={55} />
                  <Tooltip formatter={(v, name) => [formatCurrency(v, currency), name]} contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="Income" fill="#0d9488" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Expenses" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Net line */}
          <Card>
            <h2 className="text-base font-semibold text-slate-800 mb-4">Monthly Net Balance</h2>
            <div className="h-40" role="img" aria-label="Monthly net balance line chart">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={yearChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => formatShort(v, currency)} width={55} />
                  <Tooltip formatter={v => [formatCurrency(v, currency), 'Net']} contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }} />
                  <Line type="monotone" dataKey="Net" stroke="#0d9488" strokeWidth={2} dot={{ r: 4, fill: '#0d9488' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      )}

      {/* Tab: Category Breakdown */}
      {tab === 1 && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <h2 className="text-base font-semibold text-slate-800 mb-4">Annual Spending by Category</h2>
              {allCategorySpend.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-sm">No budget data entered yet</div>
              ) : (
                <div className="h-64" role="img" aria-label="Annual spending by category donut chart">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={allCategorySpend} cx="50%" cy="50%" innerRadius="50%" outerRadius="80%" paddingAngle={2} dataKey="value" nameKey="label">
                        {allCategorySpend.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                      </Pie>
                      <Tooltip formatter={(v) => [formatCurrency(v, currency), '']} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </Card>

            <Card>
              <h2 className="text-base font-semibold text-slate-800 mb-4">Top Categories</h2>
              {allCategorySpend.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-sm">No data yet</div>
              ) : (
                <ul className="space-y-3">
                  {allCategorySpend.slice(0, 8).map((cat, i) => {
                    const pct = totalExpenses > 0 ? Math.round((cat.value / totalExpenses) * 100) : 0
                    return (
                      <li key={cat.label} className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center mb-0.5">
                            <span className="text-xs text-slate-700 truncate">{cat.label}</span>
                            <span className="text-xs font-medium text-slate-600 ml-2">{formatShort(cat.value, currency)}</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-1">
                            <div className="h-1 rounded-full" style={{ width: `${pct}%`, backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                          </div>
                        </div>
                        <span className="text-xs text-slate-400 w-8 text-right">{pct}%</span>
                      </li>
                    )
                  })}
                </ul>
              )}
            </Card>
          </div>
        </div>
      )}

      {/* Tab: Savings Tracker */}
      {tab === 2 && (
        <div className="space-y-4">
          <Card>
            <h2 className="text-base font-semibold text-slate-800 mb-4">Cumulative Savings {year}</h2>
            <div className="h-60" role="img" aria-label="Cumulative savings line chart">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={savingsLineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => formatShort(v, currency)} width={55} />
                  <Tooltip formatter={v => [formatCurrency(v, currency), 'Total Saved']} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                  <Line type="monotone" dataKey="Savings" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 4, fill: '#f59e0b' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card>
            <h2 className="text-base font-semibold text-slate-800 mb-4">Savings by Goal</h2>
            {groups.filter(g => g.type === 'savings' && g.enabled).flatMap(g =>
              g.categories.filter(c => c.enabled).map(cat => {
                const annual = getCategoryAnnualTotal(months, cat.id)
                const actualAnnual = months.reduce((s, m) => s + (Number(m.actuals?.[cat.id]) || 0), 0)
                return (
                  <div key={cat.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                    <span className="text-sm text-slate-700">{cat.label}</span>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-brand-700">{formatCurrency(actualAnnual || annual, currency)}</div>
                      <div className="text-xs text-slate-400">target {formatCurrency(annual, currency)}</div>
                    </div>
                  </div>
                )
              })
            )}
          </Card>
        </div>
      )}
    </div>
  )
}
