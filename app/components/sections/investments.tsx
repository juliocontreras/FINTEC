"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Plus, DollarSign } from 'lucide-react'

const mockInvestments = [
  {
    id: 1,
    name: "Apple Inc.",
    symbol: "AAPL",
    shares: 10,
    currentPrice: 175.50,
    purchasePrice: 150.00,
    change: 17.0,
    changePercent: 11.33
  },
  {
    id: 2,
    name: "Microsoft Corp.",
    symbol: "MSFT",
    shares: 5,
    currentPrice: 380.00,
    purchasePrice: 350.00,
    change: 8.57,
    changePercent: 2.31
  },
  {
    id: 3,
    name: "Tesla Inc.",
    symbol: "TSLA",
    shares: 3,
    currentPrice: 220.00,
    purchasePrice: 250.00,
    change: -12.0,
    changePercent: -4.8
  }
]

export function Investments() {
  const totalValue = mockInvestments.reduce((sum, inv) => sum + (inv.currentPrice * inv.shares), 0)
  const totalCost = mockInvestments.reduce((sum, inv) => sum + (inv.purchasePrice * inv.shares), 0)
  const totalGainLoss = totalValue - totalCost
  const totalGainLossPercent = ((totalGainLoss / totalCost) * 100)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Inversiones</h2>
          <p className="text-muted-foreground">Gestiona tu portafolio de inversiones</p>
        </div>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Nueva Inversión
        </Button>
      </div>

      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Valor actual del portafolio
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ganancia/Pérdida</CardTitle>
            {totalGainLoss >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {totalGainLoss >= 0 ? '+' : ''}${totalGainLoss.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              {totalGainLossPercent >= 0 ? '+' : ''}{totalGainLossPercent.toFixed(2)}%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inversiones</CardTitle>
            <Badge variant="secondary">{mockInvestments.length}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalCost.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Costo total invertido
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Investments List */}
      <Card>
        <CardHeader>
          <CardTitle>Mi Portafolio</CardTitle>
          <CardDescription>
            Tus inversiones actuales
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockInvestments.map((investment) => (
              <div
                key={investment.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary">
                      {investment.symbol.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{investment.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {investment.shares} acciones • ${investment.currentPrice}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    ${(investment.currentPrice * investment.shares).toFixed(2)}
                  </p>
                  <div className={`flex items-center gap-1 text-sm ${
                    investment.changePercent >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {investment.changePercent >= 0 ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {investment.changePercent >= 0 ? '+' : ''}{investment.changePercent.toFixed(2)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
