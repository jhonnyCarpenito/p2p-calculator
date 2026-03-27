import { useEffect } from 'react'
import { useAnalysisStore } from '@/store/analysisStore'
import { useSimulation } from '@/hooks/useSimulation'
import {
  CapitalInput,
  PriceInputs,
  ExchangeFeeCard,
  BankFeeConfigCard,
  SimulationResultPanel,
} from '@/components/calculator'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Copy, Trash2, Calculator, List } from 'lucide-react'
import { formatPercent } from '@/lib/formatters'
import { DEFAULT_TARGET_PROFIT_PERCENT, getDisplayTitle } from '@/types/analysis'
import { ThemeToggle } from '@/components/ThemeToggle'

export function CalculatorPage() {
  const {
    analyses,
    activeId,
    addAnalysis,
    updateAnalysis,
    deleteAnalysis,
    setActiveAnalysis,
    duplicateAnalysis,
    getActiveAnalysis,
  } = useAnalysisStore()

  const active = getActiveAnalysis()
  const result = useSimulation(active)

  useEffect(() => {
    if (analyses.length > 0 && activeId && !active) {
      setActiveAnalysis(analyses[0].id)
    }
  }, [analyses.length, activeId, active, setActiveAnalysis])

  const handleNew = () => addAnalysis()

  const handleUpdate = <K extends keyof NonNullable<typeof active>>(
    field: K,
    value: NonNullable<typeof active>[K]
  ) => {
    if (!active) return
    updateAnalysis(active.id, { [field]: value })
  }

  if (analyses.length === 0 && !active) {
    return (
      <div className="mx-auto max-w-4xl space-y-6 p-4">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-2xl font-semibold">P2P Trading Calculator</h1>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button onClick={handleNew}>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo análisis
            </Button>
          </div>
        </header>
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Calculator className="h-12 w-12 text-muted-foreground" />
            <p className="mt-4 max-w-md text-muted-foreground">
              Simula un ciclo completo: vendes USDT por fiat y luego compras USDT con ese fiat.
              Configura fees de exchange y banco y revisa el beneficio en tiempo real.
            </p>
            <Button onClick={handleNew} className="mt-6">
              <Plus className="mr-2 h-4 w-4" />
              Crear primer análisis
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">P2P Trading Calculator</h1>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button onClick={handleNew}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo análisis
          </Button>
        </div>
      </header>

      <Tabs
        value={activeId ?? 'list'}
        onValueChange={(v) => (v === 'list' ? setActiveAnalysis(null) : setActiveAnalysis(v))}
      >
        <TabsList className="mb-4 flex-wrap h-auto gap-1">
          <TabsTrigger value="list">
            <List className="mr-2 h-4 w-4" />
            Análisis guardados
          </TabsTrigger>
          {analyses.map((a) => (
            <TabsTrigger key={a.id} value={a.id} className="data-[state=active]:bg-background">
              {getDisplayTitle(a)}
              {result && active?.id === a.id && (
                <span
                  className={`ml-2 text-xs ${
                    result.profitPercent >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {formatPercent(result.profitPercent)}
                </span>
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="list" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Análisis guardados</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {analyses.map((a) => (
                  <li
                    key={a.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-lg border p-3"
                  >
                    <button
                      type="button"
                      onClick={() => setActiveAnalysis(a.id)}
                      className="text-left font-medium hover:underline"
                    >
                      {getDisplayTitle(a)}
                    </button>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => duplicateAnalysis(a.id)} aria-label="Duplicar">
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => deleteAnalysis(a.id)} aria-label="Eliminar">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        {analyses.map((a) => (
          <TabsContent key={a.id} value={a.id} className="mt-0">
            {active?.id === a.id && (
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Etiqueta del análisis</CardTitle>
                      <p className="text-sm font-normal text-muted-foreground">
                        Tu texto + los precios se muestran en la pestaña. Ejemplo:{' '}
                        <span className="font-medium text-foreground">
                          Simulacion de Prueba (Venta {active.sellPrice} / Compra {active.buyPrice})
                        </span>
                      </p>
                    </CardHeader>
                    <CardContent>
                      <Label htmlFor="analysis-title" className="sr-only">Etiqueta (opcional)</Label>
                      <Input
                        id="analysis-title"
                        value={active.title}
                        onChange={(e) => handleUpdate('title', e.target.value)}
                        placeholder="Ej. Simulacion de Prueba"
                        aria-label="Etiqueta del análisis (opcional)"
                      />
                    </CardContent>
                  </Card>
                  <div className="grid gap-6 sm:grid-cols-2">
                    <CapitalInput value={active.initialCapital} onChange={(v) => handleUpdate('initialCapital', v)} />
                    <PriceInputs
                      sellPrice={active.sellPrice}
                      buyPrice={active.buyPrice}
                      onSellPriceChange={(v) => handleUpdate('sellPrice', v)}
                      onBuyPriceChange={(v) => handleUpdate('buyPrice', v)}
                    />
                  </div>
                  <div className="grid gap-6 sm:grid-cols-2">
                    <ExchangeFeeCard fee={active.exchangeFee} onChange={(fee) => handleUpdate('exchangeFee', fee)} />
                    <BankFeeConfigCard fee={active.bankFee} onChange={(fee) => handleUpdate('bankFee', fee)} />
                  </div>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Notas / Estrategia</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Label htmlFor="note" className="sr-only">Notas</Label>
                      <Textarea
                        id="note"
                        value={active.note}
                        onChange={(e) => handleUpdate('note', e.target.value)}
                        placeholder="Ej. Comprar en dip, vender en resistencia..."
                        rows={3}
                      />
                    </CardContent>
                  </Card>
                </div>
                <div className="lg:sticky lg:top-4">
                  {result && (
                    <SimulationResultPanel
                      result={result}
                      targetProfitPercent={active.targetProfitPercent ?? DEFAULT_TARGET_PROFIT_PERCENT}
                      onTargetProfitPercentChange={(v) => handleUpdate('targetProfitPercent', v)}
                    />
                  )}
                </div>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
