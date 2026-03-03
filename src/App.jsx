import { useState } from 'react'
import { BudgetProvider, useBudget } from './store/BudgetContext.jsx'
import { ToastProvider } from './components/ui/Toast.jsx'
import Welcome from './pages/Welcome.jsx'
import SetupWizard from './components/setup/SetupWizard.jsx'
import AppShell from './components/layout/AppShell.jsx'

function AppRouter() {
  const { state } = useBudget()
  const [view, setView] = useState(() => {
    // If we have a household name already, go straight to app
    return state.household.name ? 'app' : 'welcome'
  })

  if (view === 'welcome') {
    return <Welcome onStart={setView} />
  }

  if (view === 'setup') {
    return <SetupWizard onComplete={() => setView('app')} />
  }

  return <AppShell />
}

export default function App() {
  return (
    <BudgetProvider>
      <ToastProvider>
        <AppRouter />
      </ToastProvider>
    </BudgetProvider>
  )
}
