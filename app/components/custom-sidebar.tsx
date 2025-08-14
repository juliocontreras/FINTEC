"use client"

import { useState } from "react"
import { LayoutDashboard, CreditCard, TrendingUp, PiggyBank, Settings, Wallet, LogOut } from 'lucide-react'

interface CustomSidebarProps {
  activeSection: string
  onSectionChange: (section: string) => void
  isOpen: boolean
  onClose: () => void
}

const sidebarItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "transactions", label: "Transacciones", icon: CreditCard },
  { id: "investments", label: "Inversiones", icon: TrendingUp },
  { id: "budgets", label: "Presupuestos", icon: PiggyBank },
  { id: "settings", label: "Configuración", icon: Settings },
]

export function CustomSidebar({ activeSection, onSectionChange, isOpen, onClose }: CustomSidebarProps) {
  const handleSectionChange = (section: string) => {
    onSectionChange(section)
    // Close sidebar on mobile after selection
    if (window.innerWidth < 768) {
      onClose()
    }
  }

  return (
    <>
      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full bg-[#1A2E35] border-r border-slate-700 z-50 transition-transform duration-300 ease-in-out
        flex flex-col
        md:w-64 w-[75px] /* Adjusted width for mobile */
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-center md:justify-start gap-3 p-4 md:pl-7 border-b border-slate-700">
          <div className="w-8 h-8 bg-teal-400 rounded-lg flex items-center justify-center flex-shrink-0">
            <Wallet className="w-5 h-5 text-slate-900" />
          </div>
          <span className="font-semibold text-white hidden md:block">FinanceApp</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2 md:p-4">
          <div className="space-y-2">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSectionChange(item.id)}
                className={`
                  w-full flex flex-col md:flex-row items-center gap-1 md:gap-3 px-1 md:px-3 py-2 rounded-lg text-left
                  transition-colors duration-200 h-16 md:h-auto
                  ${activeSection === item.id ? 'text-teal-400 bg-slate-800' : 'text-slate-300 hover:bg-slate-800'}
                `}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {/* Full label for desktop */}
                <span className="hidden md:block">{item.label}</span>
                {/* Abbreviated label for mobile */}
                <span className="md:hidden text-xs">{item.label.substring(0, 4)}</span>
              </button>
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700 mt-auto">
          <p className="text-xs text-slate-400 hidden md:block">© 2024 FinanceApp</p>
           <div className="md:hidden flex justify-center">
             <LogOut className="w-5 h-5 text-slate-400"/>
           </div>
        </div>
      </div>
    </>
  )
}
