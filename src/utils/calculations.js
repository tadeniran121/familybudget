export function getAllEnabledCategories(groups) {
  return groups
    .filter(g => g.enabled)
    .flatMap(g => g.categories.filter(c => c.enabled).map(c => ({ ...c, groupId: g.id, groupType: g.type })))
}

export function sumByType(groups, monthData, type, field = 'budget') {
  const cats = getAllEnabledCategories(groups).filter(c => c.groupType === type)
  return cats.reduce((sum, cat) => sum + (Number(monthData[field]?.[cat.id]) || 0), 0)
}

export function getMonthSummary(groups, monthData) {
  const income = sumByType(groups, monthData, 'income', 'budget')
  const savings = sumByType(groups, monthData, 'savings', 'budget')
  const expenses = sumByType(groups, monthData, 'expense', 'budget')
  const actualIncome = sumByType(groups, monthData, 'income', 'actuals')
  const actualSavings = sumByType(groups, monthData, 'savings', 'actuals')
  const actualExpenses = sumByType(groups, monthData, 'expense', 'actuals')
  return {
    income,
    savings,
    expenses,
    net: income - savings - expenses,
    actualIncome,
    actualSavings,
    actualExpenses,
    actualNet: actualIncome - actualSavings - actualExpenses,
  }
}

export function getYearSummary(groups, months) {
  return months.map(m => getMonthSummary(groups, m))
}

export function getCategoryAnnualTotal(months, categoryId, field = 'budget') {
  return months.reduce((sum, m) => sum + (Number(m[field]?.[categoryId]) || 0), 0)
}

export function getSpendingByCategory(groups, monthData) {
  return groups
    .filter(g => g.enabled && g.type === 'expense')
    .map(g => {
      const total = g.categories
        .filter(c => c.enabled)
        .reduce((sum, c) => sum + (Number(monthData.budget?.[c.id]) || 0), 0)
      return { id: g.id, label: g.label, icon: g.icon, value: total }
    })
    .filter(g => g.value > 0)
}
