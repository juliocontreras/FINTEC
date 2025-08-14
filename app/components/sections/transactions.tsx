"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, ArrowUpRight, ArrowDownLeft, Filter, ChevronDown } from 'lucide-react'

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


const mockTransactions = [
  {
    id: 1,
    description: "Supermercado Central",
    amount: -85.50,
    category: "Alimentación",
    date: "2024-01-15",
    type: "expense"
  },
  {
    id: 2,
    description: "Salario Enero",
    amount: 3500.00,
    category: "Ingresos",
    date: "2024-01-01",
    type: "income"
  },
  {
    id: 3,
    description: "Netflix",
    amount: -15.99,
    category: "Entretenimiento",
    date: "2024-01-10",
    type: "expense"
  },
]

export function Transactions() {
  const [transactions] = useState(mockTransactions)
  const [openCard, setOpenCard] = useState<string | null>('recent');

  const buttonCyanClasses = "bg-[#4fd1c5] hover:bg-[#46d3c8] text-black font-bold rounded-lg";
  const buttonOutlineDarkClasses = "bg-transparent border border-slate-600 hover:bg-slate-700 text-white font-semibold rounded-lg";

  return (
    <div className="space-y-6 p-4 md:p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white">Transacciones</h2>
          <p className="text-gray-400">Gestiona tus ingresos y gastos</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className={buttonOutlineDarkClasses}>
            <Filter className="h-4 w-4 mr-2" />
            Filtrar
          </Button>
          <Button size="sm" className={buttonCyanClasses}>
            <Plus className="h-4 w-4 mr-2" />
            Nueva Transacción
          </Button>
        </div>
      </div>

      {/* Transactions List */}
      <CollapsibleCard
        id="recent"
        title="Transacciones Recientes"
        description="Tus últimos ingresos y gastos registrados"
        icon={<ArrowUpRight className="h-6 w-6 text-white" />}
        openCard={openCard}
        setOpenCard={setOpenCard}
      >
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-4 bg-[#1a252a] rounded-lg hover:bg-slate-800 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${
                  transaction.type === 'income' 
                    ? 'bg-green-900/50 text-green-400' 
                    : 'bg-red-900/50 text-red-400'
                }`}>
                  {transaction.type === 'income' ? (
                    <ArrowDownLeft className="h-4 w-4" />
                  ) : (
                    <ArrowUpRight className="h-4 w-4" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-white">{transaction.description}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <span>{transaction.date}</span>
                    <Badge variant="secondary" className="text-xs bg-slate-700 text-gray-300 border-none">
                      {transaction.category}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className={`font-semibold ${
                transaction.type === 'income' 
                  ? 'text-green-400' 
                  : 'text-red-400'
              }`}>
                {transaction.type === 'income' ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
              </div>
            </div>
          ))}
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
