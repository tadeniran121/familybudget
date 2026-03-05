import { createContext, useContext, useReducer, useEffect, useCallback } from 'react'
import { ACTIONS } from './actions.js'
import { createInitialState, createDefaultIncomeItems, computeMonthlyEquivalent } from './defaultData.js'

// Write one income item's monthly equivalent into all 12 months' budget
function syncItemToMonths(months, item) {
  const monthly = computeMonthlyEquivalent(item.amount, item.frequency)
  return months.map(m => ({
    ...m,
    budget: { ...m.budget, [item.id]: monthly },
  }))
}

// Zero out an income item across all months (used on removal)
function zeroItemInMonths(months, itemId) {
  return months.map(m => {
    const budget = { ...m.budget }
    delete budget[itemId]
    return { ...m, budget }
  })
}

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
      const newMember = { id: `m${Date.now()}`, label: `Partner ${state.household.members.length + 1}`, name: '' }
      const newItem = createDefaultIncomeItems([newMember])[0]
      return {
        ...state,
        household: {
          ...state.household,
          members: [...state.household.members, newMember],
        },
        incomeItems: [...(state.incomeItems ?? []), newItem],
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

    case ACTIONS.REMOVE_MEMBER: {
      const removedId = action.payload
      const itemsToRemove = (state.incomeItems ?? []).filter(i => i.memberId === removedId)
      let months = state.months
      itemsToRemove.forEach(item => { months = zeroItemInMonths(months, item.id) })
      return {
        ...state,
        household: {
          ...state.household,
          members: state.household.members.filter(m => m.id !== removedId),
        },
        incomeItems: (state.incomeItems ?? []).filter(i => i.memberId !== removedId),
        months,
      }
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

    case ACTIONS.ADD_INCOME_ITEM: {
      const item = action.payload
      return {
        ...state,
        incomeItems: [...(state.incomeItems ?? []), item],
        months: syncItemToMonths(state.months, item),
      }
    }

    case ACTIONS.UPDATE_INCOME_ITEM: {
      const updated = action.payload
      const newItems = (state.incomeItems ?? []).map(i => i.id === updated.id ? updated : i)
      return {
        ...state,
        incomeItems: newItems,
        months: syncItemToMonths(state.months, updated),
      }
    }

    case ACTIONS.REMOVE_INCOME_ITEM: {
      const itemId = action.payload
      return {
        ...state,
        incomeItems: (state.incomeItems ?? []).filter(i => i.id !== itemId),
        months: zeroItemInMonths(state.months, itemId),
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
