import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Analysis } from '@/types/analysis'
import { createDefaultAnalysis, defaultExchangeFeeConfig, defaultBankFeeConfig } from '@/types/analysis'

const STORAGE_KEY = 'p2p-calculator-store'

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function createNewAnalysis(overrides?: Partial<Analysis>): Analysis {
  const base = createDefaultAnalysis(overrides)
  return {
    ...base,
    ...overrides,
    id: generateId(),
    title: overrides?.title ?? '',
    createdAt: Date.now(),
    exchangeFee: { ...defaultExchangeFeeConfig, ...base.exchangeFee, ...overrides?.exchangeFee },
    bankFee: { ...defaultBankFeeConfig, ...base.bankFee, ...overrides?.bankFee },
  }
}

interface AnalysisState {
  analyses: Analysis[]
  activeId: string | null
  addAnalysis: (overrides?: Partial<Analysis>) => Analysis
  updateAnalysis: (id: string, updates: Partial<Analysis>) => void
  deleteAnalysis: (id: string) => void
  setActiveAnalysis: (id: string | null) => void
  duplicateAnalysis: (id: string) => Analysis
  getActiveAnalysis: () => Analysis | null
}

export const useAnalysisStore = create<AnalysisState>()(
  persist(
    (set, get) => ({
      analyses: [],
      activeId: null,
      addAnalysis(overrides) {
        const analysis = createNewAnalysis(overrides)
        set((state) => ({ analyses: [analysis, ...state.analyses], activeId: analysis.id }))
        return analysis
      },
      updateAnalysis(id, updates) {
        set((state) => ({
          analyses: state.analyses.map((a) => (a.id !== id ? a : { ...a, ...updates })),
        }))
      },
      deleteAnalysis(id) {
        set((state) => {
          const list = state.analyses.filter((a) => a.id !== id)
          const nextActive = state.activeId !== id ? state.activeId : list[0]?.id ?? null
          return { analyses: list, activeId: nextActive }
        })
      },
      setActiveAnalysis(id) {
        set({ activeId: id })
      },
      duplicateAnalysis(id) {
        const original = get().analyses.find((a) => a.id === id)
        if (!original) throw new Error('Analysis not found')
        const { id: _id, title: _t, createdAt: _c, ...rest } = original
        const analysis = createNewAnalysis(rest)
        set((state) => ({ analyses: [analysis, ...state.analyses], activeId: analysis.id }))
        return analysis
      },
      getActiveAnalysis() {
        const { activeId, analyses } = get()
        return activeId ? analyses.find((a) => a.id === activeId) ?? null : null
      },
    }),
    { name: STORAGE_KEY, partialize: (state) => ({ analyses: state.analyses, activeId: state.activeId }) }
  )
)
