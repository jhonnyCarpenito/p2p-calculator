import { FeeConfigCard } from './FeeConfigCard'
import type { ExchangeFeeConfig } from '@/types/analysis'

interface ExchangeFeeCardProps { fee: ExchangeFeeConfig; onChange: (fee: ExchangeFeeConfig) => void }

export function ExchangeFeeCard({ fee, onChange }: ExchangeFeeCardProps) {
  return (
    <FeeConfigCard
      title="Fee exchange"
      fee={fee}
      onChange={(f) => onChange({ ...fee, ...f })}
      enabled={fee.enabled ?? true}
      onEnabledChange={(enabled) => onChange({ ...fee, enabled })}
    />
  )
}
