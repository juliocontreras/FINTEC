"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, Plus, DollarSign, Briefcase, ChevronDown } from 'lucide-react'

// --- Reusable Collapsible Card Component (from settings.tsx) ---
interface CollapsibleCardProps {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  openCard: string | null;
  setOpenCard: React.Dispatch<React.SetStateAction<string | null>>;
  children: React.ReactNode;
}

const CollapsibleCard = ({ id, title, description, icon, openCard, setOpenCard, children }: CollapsibleCardProps) => {
  const isOpen = openCard === id;

  const cardClasses = "bg-[#223138] rounded-2xl shadow-xl border-none transition-all duration-300";
  const descriptionClasses = "text-gray-400";

  return (
    <Card className={cardClasses}>
      <CardHeader 
        className="flex-row items-center justify-between cursor-pointer" 
        onClick={() => setOpenCard(isOpen ? null : id)}
      >
        <div className="flex items-center gap-3">
          {icon}
          <div>
            <CardTitle className="text-white text-lg">{title}</CardTitle>
            <CardDescription className={descriptionClasses}>{description}</CardDescription>
          </div>
        </div>
        <ChevronDown 
          className={`h-6 w-6 text-white transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </CardHeader>
      {isOpen && (
        <CardContent className="pt-4 animate-fade-in">
          {children}
        </CardContent>
      )}
    </Card>
  );
};


const mockInvestments = [
  {
    id: 1,
    name: "Apple Inc.",
    symbol: "AAPL",
    shares: 10,
    currentPrice: 175.50,
    purchasePrice: 150.00,
  },
  {
    id: 2,
    name: "Microsoft Corp.",
    symbol: "MSFT",
    shares: 5,
    currentPrice: 380.00,
    purchasePrice: 350.00,
  },
  {
    id: 3,
    name: "Tesla Inc.",
    symbol: "TSLA",
    shares: 3,
    currentPrice: 220.00,
    purchasePrice: 250.00,
  }
]

export function Investments() {
  const [openCard, setOpenCard] = useState<string | null>('portfolio');
  const totalValue = mockInvestments.reduce((sum, inv) => sum + (inv.currentPrice * inv.shares), 0)
  const totalCost = mockInvestments.reduce((sum, inv) => sum + (inv.purchasePrice * inv.shares), 0)
  const totalGainLoss = totalValue - totalCost
  const totalGainLossPercent = totalCost === 0 ? 0 : ((totalGainLoss / totalCost) * 100)
  const buttonCyanClasses = "bg-[#4fd1c5] hover:bg-[#46d3c8] text-black font-bold rounded-lg";

  return (
    <div className="space-y-6 p-4 md:p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white">Inversiones</h2>
          <p className="text-gray-400">Gestiona tu portafolio de inversiones</p>
        </div>
        <Button size="sm" className={buttonCyanClasses}>
          <Plus className="h-4 w-4 mr-2" />
          Nueva Inversión
        </Button>
      </div>

      {/* Portfolio Summary */}
       <CollapsibleCard
        id="summary"
        title="Resumen del Portafolio"
        description="Una vista rápida del rendimiento de tus inversiones"
        icon={<Briefcase className="h-6 w-6 text-white" />}
        openCard={openCard}
        setOpenCard={setOpenCard}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-[#1a252a] border-none rounded-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Valor Total</CardTitle>
                <DollarSign className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">${totalValue.toFixed(2)}</div>
              </CardContent>
            </Card>
            <Card className="bg-[#1a252a] border-none rounded-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Ganancia/Pérdida</CardTitle>
                 {totalGainLoss >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-400" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-400" />
                )}
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${totalGainLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {totalGainLoss >= 0 ? '+' : ''}${totalGainLoss.toFixed(2)}
                </div>
                 <p className="text-xs text-gray-400">
                    {totalGainLossPercent >= 0 ? '+' : ''}{totalGainLossPercent.toFixed(2)}%
                </p>
              </CardContent>
            </Card>
             <Card className="bg-[#1a252a] border-none rounded-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Costo Total</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">${totalCost.toFixed(2)}</div>
              </CardContent>
            </Card>
        </div>
      </CollapsibleCard>

      {/* Investments List */}
      <CollapsibleCard
        id="portfolio"
        title="Mi Portafolio"
        description="Detalle de tus inversiones actuales"
        icon={<TrendingUp className="h-6 w-6 text-white" />}
        openCard={openCard}
        setOpenCard={setOpenCard}
      >
        <div className="space-y-4">
          {mockInvestments.map((investment) => {
            const value = investment.currentPrice * investment.shares;
            const gainLoss = (investment.currentPrice - investment.purchasePrice) * investment.shares;
            const gainLossPercent = investment.purchasePrice === 0 ? 0 : ((gainLoss / (investment.purchasePrice * investment.shares)) * 100);

            return (
              <div
                key={investment.id}
                className="flex items-center justify-between p-4 bg-[#1a252a] rounded-lg hover:bg-slate-800 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-cyan-900/50 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-cyan-400">
                      {investment.symbol.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-white">{investment.name}</p>
                    <p className="text-sm text-gray-400">
                      {investment.shares} acciones • ${investment.currentPrice.toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-white">${value.toFixed(2)}</p>
                  <div className={`flex items-center justify-end gap-1 text-sm ${
                    gainLossPercent >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {gainLossPercent >= 0 ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    <span>{gainLossPercent.toFixed(2)}%</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CollapsibleCard>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  )
}
