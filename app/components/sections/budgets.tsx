"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Plus, AlertTriangle, CheckCircle } from 'lucide-react'

const mockBudgets = [
  {
    id: 1,
    category: "Alimentación",
    budgeted: 800,
    spent: 650,
    remaining: 150,
    color: "bg-blue-500"
  },
  {
    id: 2,
    category: "Transporte",
    budgeted: 300,
    spent: 280,
    remaining: 20,
    color: "bg-green-500"
  },
  {
    id: 3,
    category: "Entretenimiento",
    budgeted: 200,
    spent: 220,
    remaining: -20,
    color: "bg-red-500"
  },
  {
    id: 4,
    category: "Servicios",
    budgeted: 400,
    spent: 350,
    remaining: 50,
    color: "bg-yellow-500"
  }
]

export function Budgets() {
  const totalBudgeted = mockBudgets.reduce((sum, budget) => sum + budget.budgeted, 0)
  const totalSpent = mockBudgets.reduce((sum, budget) => sum + budget.spent, 0)
  const totalRemaining = totalBudgeted - totalSpent

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Presupuestos</h2>
          <p className="text-muted-foreground">Controla tus gastos por categoría</p>
        </div>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Presupuesto
        </Button>
      </div>

      {/* Budget Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Presupuestado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalBudgeted.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Para este mes
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Gastado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalSpent.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {((totalSpent / totalBudgeted) * 100).toFixed(1)}% del presupuesto
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Restante</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalRemaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${Math.abs(totalRemaining).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              {totalRemaining >= 0 ? 'Disponible' : 'Excedido'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Budget Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Presupuestos por Categoría</CardTitle>
          <CardDescription>
            Progreso de tus presupuestos este mes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {mockBudgets.map((budget) => {
              const percentage = (budget.spent / budget.budgeted) * 100
              const isOverBudget = budget.spent > budget.budgeted
              
              return (
                <div key={budget.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${budget.color}`} />
                      <span className="font-medium">{budget.category}</span>
                      {isOverBudget ? (
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                      ) : percentage >= 90 ? (
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      ) : (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        ${budget.spent.toFixed(2)} / ${budget.budgeted.toFixed(2)}
                      </p>
                      <p className={`text-sm ${
                        budget.remaining >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {budget.remaining >= 0 ? 'Quedan' : 'Excedido'} ${Math.abs(budget.remaining).toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <Progress 
                    value={Math.min(percentage, 100)} 
                    className={`h-2 ${isOverBudget ? '[&>div]:bg-red-500' : ''}`}
                  />
                  <p className="text-xs text-muted-foreground">
                    {percentage.toFixed(1)}% utilizado
                  </p>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
