import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface CapitalInputProps { value: number; onChange: (value: number) => void }

export function CapitalInput({ value, onChange }: CapitalInputProps) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Capital inicial (USDT)</CardTitle></CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label htmlFor="initial-capital">Cantidad en USDT a simular</Label>
          <Input id="initial-capital" type="number" min={0.0001} step={1} value={value || ''} onChange={(e) => { const v = e.target.value; const n = v === '' ? 0 : Number(v); if (!Number.isNaN(n) && n >= 0) onChange(n) }} placeholder="ej. 100" aria-label="Capital inicial en USDT" />
        </div>
      </CardContent>
    </Card>
  )
}
