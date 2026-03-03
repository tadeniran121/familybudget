export function formatCurrency(amount, currency = 'GBP') {
  if (amount === null || amount === undefined || amount === '') return '—'
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(amount))
}

export function formatShort(amount, currency = 'GBP') {
  const n = Number(amount)
  if (Math.abs(n) >= 1000) {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency,
      notation: 'compact',
      minimumFractionDigits: 0,
      maximumFractionDigits: 1,
    }).format(n)
  }
  return formatCurrency(n, currency)
}
