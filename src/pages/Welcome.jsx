import Button from '../components/ui/Button.jsx'
import { importFromJSON } from '../utils/export.js'
import { useBudget } from '../store/BudgetContext.jsx'
import { ACTIONS } from '../store/actions.js'
import { useToast } from '../components/ui/Toast.jsx'

export default function Welcome({ onStart }) {
  const { dispatch } = useBudget()
  const toast = useToast()

  async function handleImport(e) {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const data = await importFromJSON(file)
      dispatch({ type: ACTIONS.LOAD_STATE, payload: data })
      toast('Budget imported successfully', 'success')
      onStart('app')
    } catch {
      toast('Failed to import file. Please check it is a valid FamilyBudget JSON.', 'error')
    }
    e.target.value = ''
  }

  const features = [
    { icon: '🔒', text: 'Your data stays on your device — never uploaded' },
    { icon: '🌐', text: 'Works offline, no internet required' },
    { icon: '💷', text: 'UK-first with GBP default, fully configurable' },
    { icon: '🆓', text: 'Free and open source, always' },
  ]

  return (
    <div className="min-h-screen bg-brand-50 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-600 text-white text-3xl mb-4 shadow-lg">
            🏠
          </div>
          <h1 className="text-3xl font-bold text-brand-900">FamilyBudget</h1>
          <p className="mt-2 text-lg text-slate-500">Your family's financial home</p>
        </div>

        {/* Feature list */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-6">
          <ul className="space-y-3">
            {features.map(f => (
              <li key={f.text} className="flex items-start gap-3">
                <span className="text-xl flex-shrink-0">{f.icon}</span>
                <span className="text-sm text-slate-700">{f.text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <div className="space-y-3">
          <Button
            size="lg"
            className="w-full"
            onClick={() => onStart('setup')}
          >
            Set up your budget
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Button>

          <label className="block">
            <span className="sr-only">Import budget from JSON file</span>
            <div className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 text-sm font-medium cursor-pointer hover:bg-slate-50 transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Import existing budget (JSON)
              <input type="file" accept=".json" className="sr-only" onChange={handleImport} />
            </div>
          </label>
        </div>

        <p className="text-center text-xs text-slate-400 mt-8">
          Free · Open Source · GPL v3.0 ·{' '}
          <a
            href="https://github.com/tadeniran121/familybudget"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-600 hover:underline"
          >
            github.com/tadeniran121/familybudget
          </a>
        </p>
      </div>
    </div>
  )
}
