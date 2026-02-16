# P2P Trading Calculator - Project Specification

## 1. Project Overview
A React-based web application for P2P merchants to calculate profit margins in a full trading cycle starting from USDT.

## 2. Tech Stack
React + Vite, TypeScript, Tailwind CSS, Shadcn/ui, Zustand, Lucide React.

## 3. Business Logic
Cycle: USDT -> Fiat -> USDT. Sell step: Gross Fiat, apply fees -> Net Fiat. Buy step: Spendable = Net Fiat / (1 + bank rate) when bank fee on buy; Gross USDT, apply exchange fee -> Final USDT. Profit = Final USDT - Initial, Profit % = (Profit/Initial)*100.

## 4. Data Model
FeeConfig (percentage, applyOnBuy, applyOnSell). Analysis (id, title, createdAt, note, sellPrice, buyPrice, exchangeFee, bankFee with enabled, initialCapital).
