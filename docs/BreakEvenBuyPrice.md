## 7. Feature Addition: Break-even Buy Price (Punto de Equilibrio)

### A. Feature Overview
The application must calculate and display the **Break-even Buy Price** in the Results/Summary section. This is the exact Buy Price required to achieve a **0% net profit**, given the current user-defined Sell Price and all active fees.

### B. UI Integration
- **Location:** In the "Results Section" (Right panel or bottom card).
- **Label:** `Break-even Buy Price` (or `Precio de Equilibrio`).
- **Formatting:** Displayed as a numeric value with the same decimal precision as the input prices. Highlight this value slightly (e.g., muted text or a subtle border) so it serves as a reference point for the merchant.

### C. Mathematical Logic & Formulas
The calculation depends on whether the Bank Fee is enabled and applied as an "overcost" on the Buy step.

**Variables Definition (in decimals, e.g., 0.20% = 0.002):**
- `SellPrice`: The input sell price.
- `ExSell`: Exchange fee on sell (if active, else 0).
- `BkSell`: Bank fee on sell (if active, else 0).
- `ExBuy`: Exchange fee on buy (if active, else 0).
- `BkBuy`: Bank fee on buy (if active, else 0).

**Scenario 1: Standard Calculation (No Bank Overcost on Buy)**
If the Bank Fee is disabled OR not applied to the Buy step:
`TotalSellDeduction = (1 - ExSell) * (1 - BkSell)`
`TotalBuyDeduction = (1 - ExBuy)`
`BreakEvenBuyPrice = SellPrice * TotalSellDeduction * TotalBuyDeduction`

**Scenario 2: With Bank Overcost on Buy**
If the Bank Fee IS enabled and applied to the Buy step (Overcost logic):
The formula must divide by `(1 + BkBuy)` to account for the reduced purchasing power.
`TotalSellDeduction = (1 - ExSell) * (1 - BkSell)`
`BreakEvenBuyPrice = (SellPrice * TotalSellDeduction * (1 - ExBuy)) / (1 + BkBuy)`

### D. Edge Cases
- If the calculated `BreakEvenBuyPrice` is `NaN` or `Infinity` (e.g., missing Sell Price input), display `0` or `-`.
- Ensure real-time recalculation of this value whenever any fee toggle, fee percentage, or the Sell Price changes.