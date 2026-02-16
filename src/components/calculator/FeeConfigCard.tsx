import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import type { FeeConfig } from '@/types/fees'
import type { BankFeeConfig } from '@/types/analysis'
import { FEE_PERCENTAGE_MIN, FEE_PERCENTAGE_MAX } from '@/types/fees'

interface FeeConfigCardProps { title: string; fee: FeeConfig; onChange: (fee: FeeConfig) => void; enabled?: boolean; onEnabledChange?: (enabled: boolean) => void }

export function FeeConfigCard({ title, fee, onChange, enabled, onEnabledChange }: FeeConfigCardProps) {
  const hasMasterSwitch = onEnabledChange !== undefined
  const isDisabled = hasMasterSwitch && enabled === false
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{title}</CardTitle>
          {hasMasterSwitch && (
            <div className="flex items-center gap-2">
              <Label htmlFor={`${title}-enabled`} className="text-sm font-normal text-muted-foreground">Activo</Label>
              <Switch id={`${title}-enabled`} checked={enabled ?? false} onCheckedChange={onEnabledChange} aria-label={`Activar fee de ${title}`} />
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor={`${title}-percentage`}>Porcentaje (%)</Label>
          <Input id={`${title}-percentage`} type="number" min={FEE_PERCENTAGE_MIN} max={FEE_PERCENTAGE_MAX} step={0.01} value={fee.percentage} onChange={(e) => { const v = e.target.value; const n = v === '' ? 0 : Number(v); if (!Number.isNaN(n)) onChange({ ...fee, percentage: Math.max(0, Math.min(100, n)) }) }} disabled={isDisabled} aria-label={`Porcentaje de fee ${title}`} />
        </div>
        <div className="flex flex-wrap gap-6">
          <div className="flex items-center gap-2">
            <Switch checked={fee.applyOnSell} onCheckedChange={(c) => onChange({ ...fee, applyOnSell: c })} disabled={isDisabled} aria-label="Aplicar en venta" />
            <Label className="text-sm font-normal">Aplicar en venta</Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={fee.applyOnBuy} onCheckedChange={(c) => onChange({ ...fee, applyOnBuy: c })} disabled={isDisabled} aria-label="Aplicar en compra" />
            <Label className="text-sm font-normal">Aplicar en compra</Label>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface BankFeeConfigCardProps { fee: BankFeeConfig; onChange: (fee: BankFeeConfig) => void }
export function BankFeeConfigCard({ fee, onChange }: BankFeeConfigCardProps) {
  return <FeeConfigCard title="Fee banco" fee={fee} onChange={(f) => onChange({ ...fee, ...f })} enabled={fee.enabled} onEnabledChange={(enabled) => onChange({ ...fee, enabled })} />
}
