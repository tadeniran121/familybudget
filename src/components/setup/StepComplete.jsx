import { useBudget } from '../../store/BudgetContext.jsx'
import Button from '../ui/Button.jsx'

export default function StepComplete({ onNext }) {
  const { state } = useBudget()
  const enabledCount = state.groups.filter(g => g.enabled).reduce((sum, g) => sum + g.categories.filter(c => c.enabled).length, 0)

  return (
    <div className="text-center py-4">
      <div className="text-6xl mb-6">🎉</div>
      <h2 className="text-2xl font-bold text-slate-900 mb-2">You're all set!</h2>
      <p className="text-slate-500 mb-6 max-w-sm mx-auto">
        Your budget for <strong>{state.year}</strong> has been created with{' '}
        <strong>{enabledCount} categories</strong> for{' '}
        <strong>{state.household.name}</strong>.
      </p>

      <div className="bg-brand-50 rounded-xl p-4 mb-8 text-sm text-brand-800 border border-brand-100">
        <p>🔒 Your data is saved privately in this browser — nothing is ever sent to a server.</p>
      </div>

      <Button size="lg" onClick={onNext} className="w-full sm:w-auto">
        Go to Dashboard
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Button>
    </div>
  )
}
