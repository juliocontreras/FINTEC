"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, ArrowUpRight, ArrowDownLeft, Filter } from 'lucide-react'

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
  {
    id: 4,
    description: "Gasolina",
    amount: -65.00,
    category: "Transporte",
    date: "2024-01-12",
    type: "expense"
  },
  {
    id: 5,
    description: "Freelance Proyecto",
    amount: 800.00,
    category: "Ingresos",
    date: "2024-01-08",
    type: "income"
  }
]

export function Transactions() {
  const [transactions] = useState(mockTransactions)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Transacciones</h2>
          <p className="text-muted-foreground">Gestiona tus ingresos y gastos</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filtrar
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Nueva Transacción
          </Button>
        </div>
      </div>

      {/* Transactions List */}
      <Card>
        <CardHeader>
          <CardTitle>Transacciones Recientes</CardTitle>
          <CardDescription>
            Tus últimas transacciones registradas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${
                    transaction.type === 'income' 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-red-100 text-red-600'
                  }`}>
                    {transaction.type === 'income' ? (
                      <ArrowDownLeft className="h-4 w-4" />
                    ) : (
                      <ArrowUpRight className="h-4 w-4" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{transaction.description}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{transaction.date}</span>
                      <Badge variant="secondary" className="text-xs">
                        {transaction.category}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className={`font-semibold ${
                  transaction.type === 'income' 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`}>
                  {transaction.type === 'income' ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
