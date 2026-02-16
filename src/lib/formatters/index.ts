export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value)
}
export function formatUsdt(value: number): string {
  return new Intl.NumberFormat('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 4 }).format(value)
}
export function formatPercent(value: number): string {
  return new Intl.NumberFormat('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2, signDisplay: 'always' }).format(value) + '%'
}
