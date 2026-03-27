import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import type { SimulationResult as SimResult } from '@/types/simulation'
import { formatCurrency, formatUsdt, formatPercent } from '@/lib/formatters'

interface SimulationResultPanelProps {
  result: SimResult
  targetProfitPercent: number
  onTargetProfitPercentChange: (v: number) => void
}

export function SimulationResultPanel({
  result,
  targetProfitPercent,
  onTargetProfitPercentChange,
}: Readonly<SimulationResultPanelProps>) {
  const isProfit = result.profitUsdt >= 0
  const isZero = result.profitUsdt === 0
  let profitBadgeVariant: 'secondary' | 'success' | 'danger' = 'danger'
  if (isZero) {
    profitBadgeVariant = 'secondary'
  } else if (isProfit) {
    profitBadgeVariant = 'success'
  }
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Resultado del ciclo</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">Fiat bruto (venta)</span><span>{formatCurrency(result.grossFiat)}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Fiat neto disponible</span><span>{formatCurrency(result.netFiatAvailable)}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Fiat para compra (tras fee banco)</span><span>{formatCurrency(result.spendableFiat)}</span></div>
          <Separator />
          <div className="flex justify-between"><span className="text-muted-foreground">USDT bruto (compra)</span><span>{formatUsdt(result.grossUsdtReceived)}</span></div>
          <div className="flex justify-between font-medium"><span>USDT final</span><span>{formatUsdt(result.finalUsdt)}</span></div>
          <Separator />
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Precio de compra de equilibrio (sin beneficio ni pérdida)</span>
            <span className="rounded border px-2 py-0.5 text-xs sm:text-sm bg-muted/40">
              {formatCurrency(result.breakEvenBuyPrice)}
            </span>
          </div>
          <div className="flex flex-col gap-2 rounded-md border p-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Precio de compra para obtener</span>
              <Input
                id="target-profit-inline"
                type="number"
                min={0}
                step={0.1}
                value={targetProfitPercent || ''}
                onChange={(e) => {
                  const v = e.target.value
                  const n = v === '' ? 0 : Number(v)
                  if (!Number.isNaN(n) && n >= 0) onTargetProfitPercentChange(n)
                }}
                className="h-7 w-20"
                aria-label="Porcentaje objetivo de ganancia"
              />
              <span className="text-sm text-muted-foreground">%</span>
              <span className="text-sm text-muted-foreground">de ganancia</span>
            </div>
            <span className="rounded border px-2 py-0.5 text-xs sm:text-sm bg-muted/40">
              {formatCurrency(result.targetBuyPrice)}
            </span>
          </div>
        </div>
        <Separator />
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Estado objetivo:</span>
          <Badge variant={result.meetsTargetProfit ? 'success' : 'danger'} className="text-sm">
            {result.meetsTargetProfit ? 'Cumple objetivo' : 'No cumple objetivo'}
          </Badge>
        </div>
        <Separator />
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Beneficio:</span>
          <Badge variant={profitBadgeVariant} className="text-sm">
            {formatUsdt(result.profitUsdt)} ({formatPercent(result.profitPercent)})
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}
