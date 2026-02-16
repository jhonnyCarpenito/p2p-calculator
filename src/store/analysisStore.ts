import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Analysis } from '@/types/analysis'
import { createDefaultAnalysis, defaultExchangeFeeConfig, defaultBankFeeConfig } from '@/types/analysis'
const STORAGE_KEY = 'p2p-calculator-store'
function generateId() { return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}` }
function createNewAnalysis(overrides?: Partial<Analysis>): Analysis {
  const base = createDefaultAnalysis(overrides)
  return {
    ...base, ...overrides,
    id: generateId(), title: overrides?.title ?? '', createdAt: Date.now(),
    exchangeFee: { ...defaultExchangeFeeConfig, ...base.exchangeFee, ...overrides?.exchangeFee },
    bankFee: { ...defaultBankFeeConfig, ...base.bankFee, ...overrides?.bankFee },
  }
}
export const useAnalysisStore = create<AnalysisState>()(persist((set, get) => ({
  analyses: [], activeId: null,
  addAnalysis(overrides) { const a = createNewAnalysis(overrides); set(s => ({ analyses: [a, ...s.analyses], activeId: a.id })); return a },
  updateAnalysis(id, updates) { set(s => ({ analyses: s.analyses.map(a => a.id !== id ? a : { ...a, ...updates }) })) },
  deleteAnalysis(id) { set(s => { const list = s.analyses.filter(a => a.id !== id); return { analyses: list, activeId: s.activeId !== id ? s.activeId : list[0]?.id ?? null } }) },
  setActiveAnalysis(id) { set({ activeId: id }) },
  duplicateAnalysis(id) { const o = get().analyses.find(a => a.id === id); if (!o) throw new Error('Not found'); const { id: _i, title: _t, createdAt: _c, ...rest } = o; const a = createNewAnalysis(rest); set(s => ({ analyses: [a, ...s.analyses], activeId: a.id })); return a },
  getActiveAnalysis() { const { activeId, analyses } = get(); return activeId ? analyses.find(a => a.id === activeId) ?? null : null },
}), { name: STORAGE_KEY, partialize: s => ({ analyses: s.analyses, activeId: s.activeId }) }))
interface AnalysisState { analyses: Analysis[]; activeId: string | null; addAnalysis: (o?: Partial<Analysis>) => Analysis; updateAnalysis: (id: string, u: Partial<Analysis>) => void; deleteAnalysis: (id: string) => void; setActiveAnalysis: (id: string | null) => void; duplicateAnalysis: (id: string) => Analysis; getActiveAnalysis: () => Analysis | null }
