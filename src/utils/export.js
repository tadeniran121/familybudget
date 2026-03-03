import { getAllEnabledCategories } from './calculations.js'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export function exportToCSV(state) {
  const { groups, months, household, year } = state
  const cats = getAllEnabledCategories(groups)

  const headers = ['Category', 'Group', 'Type', ...MONTHS.map(m => `${m} Budget`), ...MONTHS.map(m => `${m} Actual`), 'Annual Budget', 'Annual Actual']

  const rows = cats.map(cat => {
    const group = groups.find(g => g.id === cat.groupId)
    const budgets = months.map(m => m.budget?.[cat.id] ?? '')
    const actuals = months.map(m => m.actuals?.[cat.id] ?? '')
    const annualBudget = budgets.reduce((s, v) => s + (Number(v) || 0), 0)
    const annualActual = actuals.reduce((s, v) => s + (Number(v) || 0), 0)
    return [cat.label, group?.label ?? '', group?.type ?? '', ...budgets, ...actuals, annualBudget, annualActual]
  })

  const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n')
  downloadFile(csv, `FamilyBudget_${household.name}_${year}.csv`, 'text/csv')
}

export function exportToJSON(state) {
  const json = JSON.stringify(state, null, 2)
  downloadFile(json, `FamilyBudget_backup_${state.year}.json`, 'application/json')
}

export function importFromJSON(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = e => {
      try {
        const data = JSON.parse(e.target.result)
        resolve(data)
      } catch {
        reject(new Error('Invalid JSON file'))
      }
    }
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsText(file)
  })
}

function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
