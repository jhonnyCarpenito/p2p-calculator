export interface FeeConfig {
  percentage: number
  applyOnBuy: boolean
  applyOnSell: boolean
}

export const DEFAULT_FEE_PERCENTAGE = 0.25
export const FEE_PERCENTAGE_MIN = 0
export const FEE_PERCENTAGE_MAX = 100
export const defaultFeeConfig: FeeConfig = {
  percentage: DEFAULT_FEE_PERCENTAGE,
  applyOnBuy: true,
  applyOnSell: true,
}
