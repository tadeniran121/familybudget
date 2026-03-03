import { useBudget } from '../../store/BudgetContext.jsx'
import { ACTIONS } from '../../store/actions.js'
import { CURRENCIES } from '../../store/defaultData.js'
import Input from '../ui/Input.jsx'
import Select from '../ui/Select.jsx'
import Button from '../ui/Button.jsx'
import { useState } from 'react'

export default function StepHousehold({ onNext }) {
  const { state, dispatch } = useBudget()
  const { household, currency, year } = state
  const [error, setError] = useState('')

  const yearOptions = Array.from({ length: 5 }, (_, i) => {
    const y = new Date().getFullYear() - 1 + i
    return { value: y, label: String(y) }
  })

  const currencyOptions = CURRENCIES.map(c => ({ value: c.code, label: c.label }))

  function handleNext() {
    if (!household.name.trim()) {
      setError('Please enter your household name')
      return
    }
    onNext()
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-slate-900 mb-1">Your Household</h2>
      <p className="text-sm text-slate-500 mb-6">Tell us a bit about your family to get started.</p>

      <div className="space-y-5">
        <Input
          id="household-name"
          label="Household name"
          placeholder="e.g. The Smith Family"
          value={household.name}
          error={error}
          onChange={e => {
            setError('')
            dispatch({ type: ACTIONS.SET_HOUSEHOLD, payload: { name: e.target.value } })
          }}
        />

        <div className="grid grid-cols-2 gap-4">
          <Select
            id="budget-year"
            label="Budget year"
            options={yearOptions}
            value={year}
            onChange={e => dispatch({ type: ACTIONS.SET_YEAR, payload: Number(e.target.value) })}
          />
          <Select
            id="currency"
            label="Currency"
            options={currencyOptions}
            value={currency}
            onChange={e => dispatch({ type: ACTIONS.SET_CURRENCY, payload: e.target.value })}
          />
        </div>

        <div>
          <p className="text-sm font-medium text-slate-700 mb-2">Household members</p>
          <div className="space-y-2">
            {household.members.map((member, idx) => (
              <div key={member.id} className="flex items-center gap-2">
                <span className="text-lg">👤</span>
                <Input
                  id={`member-${member.id}`}
                  placeholder={`${member.label} name`}
                  value={member.name}
                  className="flex-1"
                  onChange={e => dispatch({
                    type: ACTIONS.UPDATE_MEMBER,
                    payload: { id: member.id, name: e.target.value },
                  })}
                />
                {household.members.length > 1 && (
                  <button
                    type="button"
                    onClick={() => dispatch({ type: ACTIONS.REMOVE_MEMBER, payload: member.id })}
                    className="text-slate-400 hover:text-red-500 rounded p-1 focus:outline-none focus:ring-2 focus:ring-red-400"
                    aria-label={`Remove ${member.label}`}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
          {household.members.length < 4 && (
            <button
              type="button"
              onClick={() => dispatch({ type: ACTIONS.ADD_MEMBER })}
              className="mt-2 text-sm text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add member
            </button>
          )}
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <Button onClick={handleNext}>
          Next: Income
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Button>
      </div>
    </div>
  )
}
