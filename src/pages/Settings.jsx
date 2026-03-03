import { useState } from 'react'
import { useBudget } from '../store/BudgetContext.jsx'
import { ACTIONS } from '../store/actions.js'
import { CURRENCIES } from '../store/defaultData.js'
import { importFromJSON } from '../utils/export.js'
import Button from '../components/ui/Button.jsx'
import Input from '../components/ui/Input.jsx'
import Modal from '../components/ui/Modal.jsx'
import { useToast } from '../components/ui/Toast.jsx'

export default function Settings() {
  const { state, dispatch } = useBudget()
  const { household, currency, year, groups } = state
  const toast = useToast()
  const [resetModal, setResetModal] = useState(false)
  const [editingGroupId, setEditingGroupId] = useState(null)
  const [editLabel, setEditLabel] = useState('')

  function handleImport(e) {
    const file = e.target.files?.[0]
    if (!file) return
    importFromJSON(file)
      .then(data => {
        dispatch({ type: ACTIONS.LOAD_STATE, payload: data })
        toast('Budget imported successfully', 'success')
      })
      .catch(() => toast('Failed to import. Please check the file.', 'error'))
    e.target.value = ''
  }

  function startEditGroup(group) {
    setEditingGroupId(group.id)
    setEditLabel(group.label)
  }

  function saveGroupLabel(groupId) {
    if (editLabel.trim()) {
      dispatch({ type: ACTIONS.UPDATE_GROUP, payload: { id: groupId, label: editLabel.trim() } })
    }
    setEditingGroupId(null)
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-xl font-bold text-slate-900">Settings</h1>

      {/* Household Profile */}
      <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <h2 className="text-base font-semibold text-slate-800 mb-4">🏠 Household Profile</h2>
        <div className="space-y-4">
          <Input
            id="settings-household-name"
            label="Household name"
            value={household.name}
            onChange={e => dispatch({ type: ACTIONS.SET_HOUSEHOLD, payload: { name: e.target.value } })}
          />

          <div>
            <label className="text-sm font-medium text-slate-700 block mb-2">Members</label>
            <div className="space-y-2">
              {household.members.map(m => (
                <div key={m.id} className="flex gap-2 items-center">
                  <span className="text-base">👤</span>
                  <input
                    type="text"
                    value={m.name}
                    placeholder={m.label}
                    onChange={e => dispatch({ type: ACTIONS.UPDATE_MEMBER, payload: { id: m.id, name: e.target.value } })}
                    className="flex-1 rounded-lg border border-slate-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                    aria-label={`${m.label} name`}
                  />
                  {household.members.length > 1 && (
                    <button
                      onClick={() => dispatch({ type: ACTIONS.REMOVE_MEMBER, payload: m.id })}
                      className="text-slate-400 hover:text-red-500 rounded p-1"
                      aria-label={`Remove ${m.label}`}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
              {household.members.length < 4 && (
                <button
                  onClick={() => dispatch({ type: ACTIONS.ADD_MEMBER })}
                  className="text-sm text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1 mt-1"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add member
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">Currency</label>
              <select
                value={currency}
                onChange={e => dispatch({ type: ACTIONS.SET_CURRENCY, payload: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">Budget year</label>
              <input
                type="number"
                value={year}
                min="2020"
                max="2099"
                onChange={e => dispatch({ type: ACTIONS.SET_YEAR, payload: Number(e.target.value) })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <h2 className="text-base font-semibold text-slate-800 mb-4">📋 Budget Categories</h2>
        <div className="space-y-2">
          {groups.map(group => (
            <div
              key={group.id}
              className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${group.enabled ? 'border-brand-200 bg-brand-50' : 'border-slate-200 bg-slate-50'}`}
            >
              {/* Toggle */}
              <button
                role="switch"
                aria-checked={group.enabled}
                onClick={() => dispatch({ type: ACTIONS.TOGGLE_GROUP, payload: group.id })}
                className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 ${group.enabled ? 'bg-brand-500' : 'bg-slate-300'}`}
                aria-label={`Toggle ${group.label}`}
              >
                <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${group.enabled ? 'translate-x-4' : 'translate-x-0'}`} />
              </button>

              <span className="text-base">{group.icon}</span>

              {editingGroupId === group.id ? (
                <input
                  autoFocus
                  value={editLabel}
                  onChange={e => setEditLabel(e.target.value)}
                  onBlur={() => saveGroupLabel(group.id)}
                  onKeyDown={e => { if (e.key === 'Enter') saveGroupLabel(group.id); if (e.key === 'Escape') setEditingGroupId(null) }}
                  className="flex-1 rounded border border-brand-400 px-2 py-0.5 text-sm focus:outline-none"
                  aria-label="Edit group label"
                />
              ) : (
                <span className="flex-1 text-sm font-medium text-slate-700">{group.label}</span>
              )}

              <button
                onClick={() => startEditGroup(group)}
                className="text-slate-400 hover:text-brand-600 rounded p-1"
                aria-label={`Rename ${group.label}`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>

              <span className="text-xs text-slate-400">
                {group.categories.filter(c => c.enabled).length} / {group.categories.length}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Data Management */}
      <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <h2 className="text-base font-semibold text-slate-800 mb-4">💾 Data Management</h2>
        <div className="space-y-3">
          <label className="block">
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors w-fit">
              <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              <span className="text-sm font-medium text-slate-700">Import from JSON backup</span>
              <input type="file" accept=".json" className="sr-only" onChange={handleImport} />
            </div>
          </label>

          <div className="pt-4 border-t border-slate-100">
            <p className="text-xs text-slate-500 mb-3">Danger zone</p>
            <Button variant="danger" size="sm" onClick={() => setResetModal(true)}>
              Reset all data
            </Button>
          </div>
        </div>
      </section>

      {/* Reset confirmation modal */}
      <Modal
        open={resetModal}
        onClose={() => setResetModal(false)}
        title="Reset all data?"
      >
        <p className="text-sm text-slate-600 mb-2">
          This will permanently delete all your budget data including all months, actuals, and settings.
        </p>
        <p className="text-sm font-semibold text-red-600 mb-6">This cannot be undone.</p>
        <div className="flex items-center justify-end gap-3">
          <Button variant="secondary" size="sm" onClick={() => setResetModal(false)}>Cancel</Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              dispatch({ type: ACTIONS.RESET_STATE })
              setResetModal(false)
              toast('All data has been reset', 'info')
            }}
          >
            Yes, reset everything
          </Button>
        </div>
      </Modal>
    </div>
  )
}
