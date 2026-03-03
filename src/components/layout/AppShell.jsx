import { useState } from 'react'
import Sidebar from './Sidebar.jsx'
import TopBar from './TopBar.jsx'
import BottomNav from './BottomNav.jsx'
import Dashboard from '../../pages/Dashboard.jsx'
import Budget from '../../pages/Budget.jsx'
import Actuals from '../../pages/Actuals.jsx'
import Reports from '../../pages/Reports.jsx'
import Settings from '../../pages/Settings.jsx'
import { useBudget } from '../../store/BudgetContext.jsx'
import { exportToCSV, exportToJSON } from '../../utils/export.js'
import Modal from '../ui/Modal.jsx'
import Button from '../ui/Button.jsx'
import { useToast } from '../ui/Toast.jsx'

const PAGES = {
  dashboard: Dashboard,
  budget: Budget,
  actuals: Actuals,
  reports: Reports,
  settings: Settings,
}

export default function AppShell() {
  const { state } = useBudget()
  const toast = useToast()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [activeMonth, setActiveMonth] = useState(new Date().getMonth() + 1)
  const [exportModalOpen, setExportModalOpen] = useState(false)

  const PageComponent = PAGES[activeTab]

  function handleExport(format) {
    try {
      if (format === 'csv') exportToCSV(state)
      else if (format === 'json') exportToJSON(state)
      toast(`Budget exported as ${format.toUpperCase()}`, 'success')
    } catch {
      toast('Export failed. Please try again.', 'error')
    }
    setExportModalOpen(false)
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        household={state.household}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <TopBar
          activeMonth={activeMonth}
          onMonthChange={setActiveMonth}
          year={state.year}
          household={state.household}
          onExport={() => setExportModalOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 pb-20 lg:pb-6 overflow-auto">
          <PageComponent activeMonth={activeMonth} onMonthChange={setActiveMonth} />
        </main>
      </div>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

      <Modal
        open={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        title="Export Budget"
      >
        <p className="text-sm text-slate-500 mb-5">Choose a format to download your budget data.</p>
        <div className="space-y-3">
          <button
            onClick={() => handleExport('csv')}
            className="w-full flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-brand-300 hover:bg-brand-50 transition-colors text-left"
          >
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm flex-shrink-0">CSV</div>
            <div>
              <div className="font-medium text-slate-800 text-sm">Export as CSV</div>
              <div className="text-xs text-slate-500">Open in Excel, Google Sheets, or Numbers</div>
            </div>
          </button>
          <button
            onClick={() => handleExport('json')}
            className="w-full flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-brand-300 hover:bg-brand-50 transition-colors text-left"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm flex-shrink-0">JSON</div>
            <div>
              <div className="font-medium text-slate-800 text-sm">Export as JSON backup</div>
              <div className="text-xs text-slate-500">Use to restore or share your budget</div>
            </div>
          </button>
        </div>
        <div className="mt-4 flex justify-end">
          <Button variant="secondary" size="sm" onClick={() => setExportModalOpen(false)}>
            Cancel
          </Button>
        </div>
      </Modal>
    </div>
  )
}
