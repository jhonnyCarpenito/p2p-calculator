import type { Analysis } from '@/types/analysis'
import type { SimulationResult } from '@/types/simulation'

export function runSimulation(analysis: Analysis): SimulationResult {
  const { initialCapital, sellPrice, buyPrice, exchangeFee, bankFee } = analysis
  let grossFiat = initialCapital * sellPrice
  const exchangeEnabled = (exchangeFee as { enabled?: boolean }).enabled !== false
  if (exchangeEnabled && exchangeFee.applyOnSell && exchangeFee.percentage > 0) grossFiat = grossFiat * (1 - exchangeFee.percentage / 100)
  if (bankFee.enabled && bankFee.applyOnSell && bankFee.percentage > 0) grossFiat = grossFiat * (1 - bankFee.percentage / 100)
  const netFiatAvailable = grossFiat
  const bankRateBuy = bankFee.enabled && bankFee.applyOnBuy ? bankFee.percentage / 100 : 0
  const spendableFiat = bankRateBuy > 0 ? netFiatAvailable / (1 + bankRateBuy) : netFiatAvailable
  let grossUsdtReceived = spendableFiat / buyPrice
  if (exchangeEnabled && exchangeFee.applyOnBuy && exchangeFee.percentage > 0) grossUsdtReceived = grossUsdtReceived * (1 - exchangeFee.percentage / 100)
  const finalUsdt = grossUsdtReceived
  const profitUsdt = finalUsdt - initialCapital
  const profitPercent = initialCapital > 0 ? (profitUsdt / initialCapital) * 100 : 0
  return { grossFiat: initialCapital * sellPrice, netFiatAvailable, spendableFiat, grossUsdtReceived: spendableFiat / buyPrice, finalUsdt, profitUsdt, profitPercent }
}
