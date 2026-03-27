import type { FeeConfig } from './fees'

export interface ExchangeFeeConfig extends FeeConfig { enabled: boolean }
export interface BankFeeConfig extends FeeConfig { enabled: boolean }

export interface Analysis {
  id: string
  title: string
  createdAt: number
  note: string
  sellPrice: number
  buyPrice: number
  targetProfitPercent: number
  exchangeFee: ExchangeFeeConfig
  bankFee: BankFeeConfig
  initialCapital: number
}

export const DEFAULT_SELL_PRICE = 540
export const DEFAULT_BUY_PRICE = 530
export const DEFAULT_INITIAL_CAPITAL = 100
export const DEFAULT_TARGET_PROFIT_PERCENT = 1
export const PRICE_MIN = 0.0001
export const CAPITAL_MIN = 0.0001
import { defaultFeeConfig } from './fees'
export const defaultExchangeFeeConfig: ExchangeFeeConfig = { ...defaultFeeConfig, enabled: true }
export const defaultBankFeeConfig: BankFeeConfig = { ...defaultFeeConfig, enabled: false }

export function createDefaultAnalysis(overrides?: Partial<Analysis>): Omit<Analysis, 'id' | 'title' | 'createdAt'> {
  return {
    note: '', sellPrice: DEFAULT_SELL_PRICE, buyPrice: DEFAULT_BUY_PRICE,
    targetProfitPercent: DEFAULT_TARGET_PROFIT_PERCENT,
    exchangeFee: { ...defaultExchangeFeeConfig }, bankFee: { ...defaultBankFeeConfig },
    initialCapital: DEFAULT_INITIAL_CAPITAL, ...overrides,
  }
}
export function buildAnalysisTitle(sellPrice: number, buyPrice: number): string {
  return `Venta ${sellPrice} / Compra ${buyPrice}`
}
export function buildPricesLabel(sellPrice: number, buyPrice: number): string {
  return `(${buildAnalysisTitle(sellPrice, buyPrice)})`
}
export function getDisplayTitle(analysis: { title: string; sellPrice: number; buyPrice: number }): string {
  const pricesLabel = buildPricesLabel(analysis.sellPrice, analysis.buyPrice)
  const custom = analysis.title.trim()
  const legacyPrices = buildAnalysisTitle(analysis.sellPrice, analysis.buyPrice)
  if (!custom) return pricesLabel
  if (custom === legacyPrices) return pricesLabel
  return `${custom} ${pricesLabel}`
}
