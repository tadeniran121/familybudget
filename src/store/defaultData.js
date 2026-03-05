export const CURRENCIES = [
  { code: 'GBP', symbol: '£', label: 'GBP — British Pound' },
  { code: 'USD', symbol: '$', label: 'USD — US Dollar' },
  { code: 'EUR', symbol: '€', label: 'EUR — Euro' },
  { code: 'CAD', symbol: 'CA$', label: 'CAD — Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', label: 'AUD — Australian Dollar' },
  { code: 'NZD', symbol: 'NZ$', label: 'NZD — New Zealand Dollar' },
  { code: 'SGD', symbol: 'S$', label: 'SGD — Singapore Dollar' },
  { code: 'JPY', symbol: '¥', label: 'JPY — Japanese Yen' },
  { code: 'INR', symbol: '₹', label: 'INR — Indian Rupee' },
  { code: 'CHF', symbol: 'CHF', label: 'CHF — Swiss Franc' },
]

// Income is managed separately via incomeItems — not as a category group.
export const INCOME_FREQUENCY_OPTIONS = [
  { value: 'monthly',   label: 'Monthly',   hint: 'per month',    divisor: 1 },
  { value: 'quarterly', label: 'Quarterly', hint: 'per quarter',  divisor: 3 },
  { value: 'biannual',  label: 'Bi-annual', hint: 'per payment',  divisor: 6 },
  { value: 'annual',    label: 'Annual',    hint: 'per year',     divisor: 12 },
]

export const INCOME_LABEL_SUGGESTIONS = [
  'Wages & Salary',
  'Freelance / Side Income',
  'Annual Bonus',
  'Quarterly Bonus',
  'Investment Returns',
  'Rental Income',
  'Benefits',
  'Pension',
  'Gifts Received',
  'Other Income',
]

export function computeMonthlyEquivalent(amount, frequency) {
  const n = Number(amount) || 0
  const opt = INCOME_FREQUENCY_OPTIONS.find(o => o.value === frequency)
  return opt ? n / opt.divisor : n
}

export function createDefaultIncomeItems(members) {
  return members.map((m, idx) => ({
    id: `inc_${m.id}_wages`,
    memberId: m.id,
    label: 'Wages & Salary',
    frequency: 'monthly',
    amount: 0,
  }))
}

export const DEFAULT_CATEGORY_GROUPS = [
  {
    id: 'grp_savings',
    label: 'Savings',
    icon: '🏦',
    type: 'savings',
    enabled: true,
    order: 1,
    categories: [
      { id: 'cat_emergency', label: 'Emergency Fund', enabled: true, order: 0 },
      { id: 'cat_pension', label: 'Retirement / Pension', enabled: true, order: 1 },
      { id: 'cat_investments_out', label: 'Investment Account', enabled: false, order: 2 },
      { id: 'cat_education_sav', label: 'Education Fund', enabled: false, order: 3 },
      { id: 'cat_other_savings', label: 'Other Savings', enabled: false, order: 4 },
    ],
  },
  {
    id: 'grp_home',
    label: 'Home',
    icon: '🏠',
    type: 'expense',
    enabled: true,
    order: 2,
    categories: [
      { id: 'cat_mortgage', label: 'Mortgage / Rent', enabled: true, order: 0 },
      { id: 'cat_electricity', label: 'Electricity & Gas', enabled: true, order: 1 },
      { id: 'cat_council_tax', label: 'Council Tax', enabled: true, order: 2 },
      { id: 'cat_water', label: 'Water', enabled: true, order: 3 },
      { id: 'cat_internet', label: 'Internet', enabled: true, order: 4 },
      { id: 'cat_phone', label: 'Phone', enabled: true, order: 5 },
      { id: 'cat_maintenance', label: 'Home Maintenance', enabled: false, order: 6 },
      { id: 'cat_other_home', label: 'Other Home', enabled: false, order: 7 },
    ],
  },
  {
    id: 'grp_living',
    label: 'Daily Living',
    icon: '🛒',
    type: 'expense',
    enabled: true,
    order: 3,
    categories: [
      { id: 'cat_groceries', label: 'Groceries', enabled: true, order: 0 },
      { id: 'cat_clothing', label: 'Clothing', enabled: true, order: 1 },
      { id: 'cat_dining', label: 'Dining Out', enabled: true, order: 2 },
      { id: 'cat_personal', label: 'Personal Care', enabled: true, order: 3 },
      { id: 'cat_cleaning', label: 'Cleaning', enabled: false, order: 4 },
      { id: 'cat_other_living', label: 'Other Living', enabled: false, order: 5 },
    ],
  },
  {
    id: 'grp_children',
    label: 'Children',
    icon: '👶',
    type: 'expense',
    enabled: false,
    order: 4,
    categories: [
      { id: 'cat_childcare', label: 'Childcare / Nursery', enabled: true, order: 0 },
      { id: 'cat_school', label: 'School Fees', enabled: false, order: 1 },
      { id: 'cat_baby', label: 'Baby Supplies', enabled: true, order: 2 },
      { id: 'cat_kids_clothes', label: "Children's Clothing", enabled: true, order: 3 },
      { id: 'cat_kids_medical', label: 'Medical', enabled: false, order: 4 },
      { id: 'cat_toys', label: 'Toys & Activities', enabled: true, order: 5 },
      { id: 'cat_other_children', label: 'Other Children', enabled: false, order: 6 },
    ],
  },
  {
    id: 'grp_transport',
    label: 'Transport',
    icon: '🚗',
    type: 'expense',
    enabled: true,
    order: 5,
    categories: [
      { id: 'cat_fuel', label: 'Fuel', enabled: true, order: 0 },
      { id: 'cat_public_transport', label: 'Public Transport', enabled: true, order: 1 },
      { id: 'cat_car_insurance', label: 'Car Insurance', enabled: true, order: 2 },
      { id: 'cat_road_tax', label: 'Road Tax', enabled: false, order: 3 },
      { id: 'cat_car_service', label: 'Servicing & Repairs', enabled: false, order: 4 },
      { id: 'cat_other_transport', label: 'Other Transport', enabled: false, order: 5 },
    ],
  },
  {
    id: 'grp_health',
    label: 'Health',
    icon: '🏥',
    type: 'expense',
    enabled: true,
    order: 6,
    categories: [
      { id: 'cat_prescriptions', label: 'Prescriptions & Medicines', enabled: true, order: 0 },
      { id: 'cat_gp', label: 'GP / Dentist / Optician', enabled: true, order: 1 },
      { id: 'cat_gym', label: 'Gym / Health Club', enabled: true, order: 2 },
      { id: 'cat_vitamins', label: 'Vitamins & Supplements', enabled: false, order: 3 },
      { id: 'cat_other_health', label: 'Other Health', enabled: false, order: 4 },
    ],
  },
  {
    id: 'grp_insurance',
    label: 'Insurance',
    icon: '🛡️',
    type: 'expense',
    enabled: false,
    order: 7,
    categories: [
      { id: 'cat_home_ins', label: 'Home Contents', enabled: true, order: 0 },
      { id: 'cat_building_ins', label: 'Buildings Insurance', enabled: true, order: 1 },
      { id: 'cat_life_ins', label: 'Life Insurance', enabled: true, order: 2 },
      { id: 'cat_vehicle_ins', label: 'Vehicle Insurance', enabled: false, order: 3 },
      { id: 'cat_health_ins', label: 'Health Insurance', enabled: false, order: 4 },
      { id: 'cat_other_ins', label: 'Other Insurance', enabled: false, order: 5 },
    ],
  },
  {
    id: 'grp_subscriptions',
    label: 'Subscriptions',
    icon: '📱',
    type: 'expense',
    enabled: true,
    order: 8,
    categories: [
      { id: 'cat_streaming', label: 'Streaming Services', enabled: true, order: 0 },
      { id: 'cat_software', label: 'Software & Apps', enabled: false, order: 1 },
      { id: 'cat_magazines', label: 'Magazines', enabled: false, order: 2 },
      { id: 'cat_memberships', label: 'Club Memberships', enabled: false, order: 3 },
      { id: 'cat_other_subs', label: 'Other Subscriptions', enabled: true, order: 4 },
    ],
  },
  {
    id: 'grp_entertainment',
    label: 'Entertainment',
    icon: '🎭',
    type: 'expense',
    enabled: true,
    order: 9,
    categories: [
      { id: 'cat_hobbies', label: 'Hobbies', enabled: true, order: 0 },
      { id: 'cat_sports', label: 'Sports & Recreation', enabled: true, order: 1 },
      { id: 'cat_cinema', label: 'Cinema & Events', enabled: true, order: 2 },
      { id: 'cat_books', label: 'Books', enabled: false, order: 3 },
      { id: 'cat_other_ent', label: 'Other Entertainment', enabled: false, order: 4 },
    ],
  },
  {
    id: 'grp_obligations',
    label: 'Obligations',
    icon: '💳',
    type: 'expense',
    enabled: false,
    order: 10,
    categories: [
      { id: 'cat_credit_card', label: 'Credit Card Repayments', enabled: true, order: 0 },
      { id: 'cat_loan', label: 'Loan Repayments', enabled: true, order: 1 },
      { id: 'cat_finance', label: 'Finance Agreements', enabled: false, order: 2 },
      { id: 'cat_legal', label: 'Legal Fees', enabled: false, order: 3 },
      { id: 'cat_other_oblig', label: 'Other Obligations', enabled: false, order: 4 },
    ],
  },
  {
    id: 'grp_misc',
    label: 'Miscellaneous',
    icon: '🗂️',
    type: 'expense',
    enabled: true,
    order: 11,
    categories: [
      { id: 'cat_holidays', label: 'Holidays & Travel', enabled: true, order: 0 },
      { id: 'cat_tv_licence', label: 'TV Licence', enabled: true, order: 1 },
      { id: 'cat_charity', label: 'Charitable Donations', enabled: false, order: 2 },
      { id: 'cat_gifts_out', label: 'Gifts to Family', enabled: true, order: 3 },
      { id: 'cat_other_misc', label: 'Other', enabled: false, order: 4 },
    ],
  },
]

export function createEmptyMonths() {
  return Array.from({ length: 12 }, (_, i) => ({
    month: i + 1,
    budget: {},
    actuals: {},
  }))
}

export function createInitialState() {
  const defaultMembers = [{ id: 'm1', label: 'Partner 1', name: '' }]
  return {
    version: '0.2',
    year: new Date().getFullYear(),
    currency: 'GBP',
    household: {
      name: '',
      members: defaultMembers,
    },
    incomeItems: createDefaultIncomeItems(defaultMembers),
    groups: DEFAULT_CATEGORY_GROUPS,
    months: createEmptyMonths(),
  }
}
