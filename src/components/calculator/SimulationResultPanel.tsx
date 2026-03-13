import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import type { SimulationResult as SimResult } from '@/types/simulation'
import { formatCurrency, formatUsdt, formatPercent } from '@/lib/formatters'

interface SimulationResultPanelProps { result: SimResult; initialCapital: number }

export function SimulationResultPanel({ result }: SimulationResultPanelProps) {
  const isProfit = result.profitUsdt >= 0
  const isZero = result.profitUsdt === 0
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
        </div>
        <Separator />
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Beneficio:</span>
          <Badge variant={isZero ? 'secondary' : isProfit ? 'success' : 'danger'} className="text-sm">
            {formatUsdt(result.profitUsdt)} ({formatPercent(result.profitPercent)})
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}
