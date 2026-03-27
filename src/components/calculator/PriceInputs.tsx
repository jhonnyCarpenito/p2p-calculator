import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface PriceInputsProps {
  sellPrice: number
  buyPrice: number
  onSellPriceChange: (v: number) => void
  onBuyPriceChange: (v: number) => void
}

export function PriceInputs({
  sellPrice,
  buyPrice,
  onSellPriceChange,
  onBuyPriceChange,
}: Readonly<PriceInputsProps>) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Precios de mercado</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="sell-price">Precio venta (USDT → Fiat)</Label>
          <Input id="sell-price" type="number" min={0.0001} step={0.01} value={sellPrice || ''} onChange={(e) => { const v = e.target.value; const n = v === '' ? 0 : Number(v); if (!Number.isNaN(n) && n >= 0) onSellPriceChange(n) }} placeholder="ej. 540" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="buy-price">Precio compra (Fiat → USDT)</Label>
          <Input id="buy-price" type="number" min={0.0001} step={0.01} value={buyPrice || ''} onChange={(e) => { const v = e.target.value; const n = v === '' ? 0 : Number(v); if (!Number.isNaN(n) && n >= 0) onBuyPriceChange(n) }} placeholder="ej. 530" />
        </div>
      </CardContent>
    </Card>
  )
}
