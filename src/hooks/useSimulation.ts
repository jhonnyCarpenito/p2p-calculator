import { useMemo } from 'react'
import { runSimulation } from '@/lib/calculator/runSimulation'
import type { Analysis } from '@/types/analysis'
import type { SimulationResult } from '@/types/simulation'
export function useSimulation(analysis: Analysis | null): SimulationResult | null {
  return useMemo(() => analysis ? runSimulation(analysis) : null, [analysis?.id, analysis?.initialCapital, analysis?.sellPrice, analysis?.buyPrice, analysis?.targetProfitPercent, analysis?.exchangeFee.enabled, analysis?.exchangeFee.percentage, analysis?.exchangeFee.applyOnBuy, analysis?.exchangeFee.applyOnSell, analysis?.bankFee.enabled, analysis?.bankFee.percentage, analysis?.bankFee.applyOnBuy, analysis?.bankFee.applyOnSell])
}
