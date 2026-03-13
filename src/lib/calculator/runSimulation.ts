import type { Analysis } from '@/types/analysis'
import type { SimulationResult } from '@/types/simulation'

/**
 * Runs the P2P cycle simulation: USDT -> Fiat -> USDT.
 */
export function runSimulation(analysis: Analysis): SimulationResult {
  const { initialCapital, sellPrice, buyPrice, exchangeFee, bankFee } = analysis

  // --- Paso 1: ciclo actual (igual que antes) ---
  let grossFiat = initialCapital * sellPrice
  const exchangeEnabled = (exchangeFee as { enabled?: boolean }).enabled !== false
  if (exchangeEnabled && exchangeFee.applyOnSell && exchangeFee.percentage > 0) {
    grossFiat = grossFiat * (1 - exchangeFee.percentage / 100)
  }
  if (bankFee.enabled && bankFee.applyOnSell && bankFee.percentage > 0) {
    grossFiat = grossFiat * (1 - bankFee.percentage / 100)
  }
  const netFiatAvailable = grossFiat

  const bankRateBuy = bankFee.enabled && bankFee.applyOnBuy ? bankFee.percentage / 100 : 0
  const spendableFiat = bankRateBuy > 0 ? netFiatAvailable / (1 + bankRateBuy) : netFiatAvailable

  let grossUsdtReceived = spendableFiat / buyPrice
  if (exchangeEnabled && exchangeFee.applyOnBuy && exchangeFee.percentage > 0) {
    grossUsdtReceived = grossUsdtReceived * (1 - exchangeFee.percentage / 100)
  }
  const finalUsdt = grossUsdtReceived
  const profitUsdt = finalUsdt - initialCapital
  const profitPercent = initialCapital > 0 ? (profitUsdt / initialCapital) * 100 : 0

  // --- Paso 2: cálculo del precio de compra de equilibrio ---
  const exSell = exchangeEnabled && exchangeFee.applyOnSell && exchangeFee.percentage > 0 ? exchangeFee.percentage / 100 : 0
  const bkSell = bankFee.enabled && bankFee.applyOnSell && bankFee.percentage > 0 ? bankFee.percentage / 100 : 0
  const exBuy = exchangeEnabled && exchangeFee.applyOnBuy && exchangeFee.percentage > 0 ? exchangeFee.percentage / 100 : 0
  const bkBuy = bankFee.enabled && bankFee.applyOnBuy && bankFee.percentage > 0 ? bankFee.percentage / 100 : 0

  const totalSellDeduction = (1 - exSell) * (1 - bkSell)

  let breakEvenBuyPrice: number
  if (bkBuy > 0) {
    // Escenario 2: con overcost de banco en la compra
    breakEvenBuyPrice = (sellPrice * totalSellDeduction * (1 - exBuy)) / (1 + bkBuy)
  } else {
    // Escenario 1: sin overcost de banco en la compra
    const totalBuyDeduction = 1 - exBuy
    breakEvenBuyPrice = sellPrice * totalSellDeduction * totalBuyDeduction
  }

  if (!Number.isFinite(breakEvenBuyPrice)) {
    breakEvenBuyPrice = 0
  }

  return {
    grossFiat: initialCapital * sellPrice,
    netFiatAvailable,
    spendableFiat,
    grossUsdtReceived: spendableFiat / buyPrice,
    finalUsdt,
    profitUsdt,
    profitPercent,
    breakEvenBuyPrice,
  }
}
