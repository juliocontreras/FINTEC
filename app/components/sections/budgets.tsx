"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Plus, AlertTriangle, CheckCircle, PieChart, DollarSign, ChevronDown } from 'lucide-react'

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

const mockBudgets = [
  {
    id: 1,
    category: "Alimentación",
    budgeted: 800,
    spent: 650,
    color: "bg-blue-500"
  },
  {
    id: 2,
    category: "Transporte",
    budgeted: 300,
    spent: 280,
    color: "bg-green-500"
  },
  {
    id: 3,
    category: "Entretenimiento",
    budgeted: 200,
    spent: 220,
    color: "bg-red-500"
  },
]

export function Budgets() {
  const [openCard, setOpenCard] = useState<string | null>('summary');
  const totalBudgeted = mockBudgets.reduce((sum, budget) => sum + budget.budgeted, 0)
  const totalSpent = mockBudgets.reduce((sum, budget) => sum + budget.spent, 0)
  const totalRemaining = totalBudgeted - totalSpent
  const buttonCyanClasses = "bg-[#4fd1c5] hover:bg-[#46d3c8] text-black font-bold rounded-lg";

  return (
    <div className="space-y-6 p-4 md:p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white">Presupuestos</h2>
          <p className="text-gray-400">Controla tus gastos por categoría</p>
        </div>
        <Button size="sm" className={buttonCyanClasses}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Presupuesto
        </Button>
      </div>

      {/* Budget Summary */}
      <CollapsibleCard
        id="summary"
        title="Resumen del Mes"
        description="Vista general de tu presupuesto mensual"
        icon={<PieChart className="h-6 w-6 text-white" />}
        openCard={openCard}
        setOpenCard={setOpenCard}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-[#1a252a] border-none rounded-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Total Presupuestado</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">${totalBudgeted.toFixed(2)}</div>
            </CardContent>
          </Card>
          <Card className="bg-[#1a252a] border-none rounded-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Total Gastado</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">${totalSpent.toFixed(2)}</div>
            </CardContent>
          </Card>
          <Card className="bg-[#1a252a] border-none rounded-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Restante</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${totalRemaining >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                ${Math.abs(totalRemaining).toFixed(2)}
              </div>
            </CardContent>
          </Card>
        </div>
      </CollapsibleCard>

      {/* Budget Categories */}
      <CollapsibleCard
        id="categories"
        title="Categorías de Presupuesto"
        description="Progreso de tus presupuestos individuales"
        icon={<DollarSign className="h-6 w-6 text-white" />}
        openCard={openCard}
        setOpenCard={setOpenCard}
      >
        <div className="space-y-6">
          {mockBudgets.map((budget) => {
            const percentage = (budget.spent / budget.budgeted) * 100
            const isOverBudget = budget.spent > budget.budgeted
            const remaining = budget.budgeted - budget.spent;
            
            return (
              <div key={budget.id} className="p-4 bg-[#1a252a] rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${budget.color}`} />
                    <span className="font-medium text-white">{budget.category}</span>
                    {isOverBudget ? (
                      <AlertTriangle className="h-4 w-4 text-red-400" />
                    ) : (
                      <CheckCircle className="h-4 w-4 text-green-400" />
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-white">
                      ${budget.spent.toFixed(2)} / ${budget.budgeted.toFixed(2)}
                    </p>
                    <p className={`text-sm ${remaining >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {remaining >= 0 ? 'Quedan' : 'Excedido'} ${Math.abs(remaining).toFixed(2)}
                    </p>
                  </div>
                </div>
                <Progress 
                  value={Math.min(percentage, 100)} 
                  className={`h-2 bg-slate-700 ${isOverBudget ? '[&>div]:bg-red-500' : '[&>div]:bg-cyan-400'}`}
                />
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
