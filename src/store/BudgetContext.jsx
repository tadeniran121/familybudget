import { createContext, useContext, useReducer, useEffect, useCallback } from 'react'
import { ACTIONS } from './actions.js'
import { createInitialState } from './defaultData.js'

const STORAGE_KEY = 'familybudget_v1'

function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.LOAD_STATE:
      return { ...action.payload }

    case ACTIONS.SET_HOUSEHOLD:
      return { ...state, household: { ...state.household, ...action.payload } }

    case ACTIONS.SET_CURRENCY:
      return { ...state, currency: action.payload }

    case ACTIONS.SET_YEAR:
      return { ...state, year: action.payload }

    case ACTIONS.ADD_MEMBER: {
      const id = `m${Date.now()}`
      return {
        ...state,
        household: {
          ...state.household,
          members: [...state.household.members, { id, label: `Partner ${state.household.members.length + 1}`, name: '' }],
        },
      }
    }

    case ACTIONS.UPDATE_MEMBER: {
      const { id, ...fields } = action.payload
      return {
        ...state,
        household: {
          ...state.household,
          members: state.household.members.map(m => m.id === id ? { ...m, ...fields } : m),
        },
      }
    }

    case ACTIONS.REMOVE_MEMBER:
      return {
        ...state,
        household: {
          ...state.household,
          members: state.household.members.filter(m => m.id !== action.payload),
        },
      }

    case ACTIONS.UPDATE_GROUP:
      return {
        ...state,
        groups: state.groups.map(g => g.id === action.payload.id ? { ...g, ...action.payload } : g),
      }

    case ACTIONS.TOGGLE_GROUP:
      return {
        ...state,
        groups: state.groups.map(g => g.id === action.payload ? { ...g, enabled: !g.enabled } : g),
      }

    case ACTIONS.REORDER_GROUPS:
      return { ...state, groups: action.payload }

    case ACTIONS.TOGGLE_CATEGORY:
      return {
        ...state,
        groups: state.groups.map(g => ({
          ...g,
          categories: g.categories.map(c =>
            c.id === action.payload ? { ...c, enabled: !c.enabled } : c
          ),
        })),
      }

    case ACTIONS.UPDATE_CATEGORY:
      return {
        ...state,
        groups: state.groups.map(g => ({
          ...g,
          categories: g.categories.map(c =>
            c.id === action.payload.id ? { ...c, ...action.payload } : c
          ),
        })),
      }

    case ACTIONS.ADD_CATEGORY: {
      const { groupId, category } = action.payload
      return {
        ...state,
        groups: state.groups.map(g => g.id === groupId
          ? { ...g, categories: [...g.categories, category] }
          : g
        ),
      }
    }

    case ACTIONS.REMOVE_CATEGORY: {
      const { groupId, categoryId } = action.payload
      return {
        ...state,
        groups: state.groups.map(g => g.id === groupId
          ? { ...g, categories: g.categories.filter(c => c.id !== categoryId) }
          : g
        ),
      }
    }

    case ACTIONS.SET_BUDGET: {
      const { month, categoryId, value } = action.payload
      return {
        ...state,
        months: state.months.map(m => m.month === month
          ? { ...m, budget: { ...m.budget, [categoryId]: value } }
          : m
        ),
      }
    }

    case ACTIONS.SET_ACTUAL: {
      const { month, categoryId, value } = action.payload
      return {
        ...state,
        months: state.months.map(m => m.month === month
          ? { ...m, actuals: { ...m.actuals, [categoryId]: value } }
          : m
        ),
      }
    }

    case ACTIONS.COPY_MONTH: {
      const { fromMonth, toMonth } = action.payload
      const source = state.months.find(m => m.month === fromMonth)
      if (!source) return state
      return {
        ...state,
        months: state.months.map(m => m.month === toMonth
          ? { ...m, budget: { ...source.budget } }
          : m
        ),
      }
    }

    case ACTIONS.RESET_STATE:
      return createInitialState()

    default:
      return state
  }
}

const BudgetContext = createContext(null)

export function BudgetProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, null, () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) return JSON.parse(saved)
    } catch {
      // ignore
    }
    return createInitialState()
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // ignore storage errors
    }
  }, [state])

  const isSetupComplete = useCallback(() => {
    return Boolean(state.household.name)
  }, [state.household.name])

  return (
    <BudgetContext.Provider value={{ state, dispatch, isSetupComplete }}>
      {children}
    </BudgetContext.Provider>
  )
}

export function useBudget() {
  const ctx = useContext(BudgetContext)
  if (!ctx) throw new Error('useBudget must be used within BudgetProvider')
  return ctx
}
