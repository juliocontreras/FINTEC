"use client"

import { useState } from "react"
// Se han restaurado los imports originales
import { Bell, User, LogOut } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Dashboard } from "./sections/dashboard"
import { Transactions } from "./sections/transactions"
import { Investments } from "./sections/investments"
import { Budgets } from "./sections/budgets"
import { Settings } from "./sections/settings"
import { BottomNavigation } from "./bottom-navigation"
import { CustomSidebar } from "./custom-sidebar"
import { useAuth } from "./auth-provider"

export function MainApp() {
  const [activeSection, setActiveSection] = useState("dashboard")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const { logout } = useAuth()

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev)
  }

  const renderActiveSection = () => {
    switch (activeSection) {
      case "dashboard":
        return <Dashboard />
      case "transactions":
        return <Transactions />
      case "investments":
        return <Investments />
      case "budgets":
        return <Budgets />
      case "settings":
        return <Settings />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="flex h-screen overflow-x-hidden bg-transparent">
      {/* Custom Sidebar (implementación original del usuario) */}
      <CustomSidebar 
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header Fijo */}
        <header className="bg-transparent z-10">
          <div className="flex justify-between items-center h-14 px-4 bg-transparent">
              {/* Menú de hamburguesa y campana a la izquierda con círculos */}
              <div className="flex items-center space-x-4">
                  {/* Botón de hamburguesa que abre el sidebar */}
                  <button 
                    className="text-gray-400 hover:text-white p-2 rounded-full bg-[#20333b]"
                    onClick={toggleSidebar}
                  >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                  </button>
                  {/* Botón de campana */}
                  <button className="text-gray-400 hover:text-white p-2 rounded-full bg-[#20333b]">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                  </button>
              </div>
              {/* Texto "Hola!" y nombre de usuario con foto a la derecha */}
              <div 
                className="flex items-center space-x-3 cursor-pointer"
                onClick={() => setActiveSection("settings")}
              >
                  <div className="flex flex-col items-end">
                      <p className="font-normal text-sm text-gray-200">Hola!</p>
                      <p className="text-lg font-bold text-white">Julio Contreras</p>
                  </div>
                  {/* MODIFICACIÓN FINAL: Foto de perfil de GitHub. */}
                  <img 
                    src="https://github.com/juliocontreras.png" // URL de la foto de perfil de GitHub
                    alt="Profile" 
                    className="h-11 w-11 rounded-full object-cover ring-2 ring-[#29c2a3]"
                  />
              </div>
          </div>
        </header>

        {/* Contenido principal con scroll vertical propio */}
        <main className="flex-1 overflow-y-auto p-4 pb-24">
          <div className="w-full md:w-1/2 lg:w-[45%] mx-auto">
            {renderActiveSection()}
          </div>
        </main>
      </div>

      {/* Bottom Navigation (implementación original del usuario) */}
      <BottomNavigation 
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        onMenuClick={toggleSidebar}
        isSidebarOpen={isSidebarOpen}
      />

      {/* Overlay for mobile when sidebar is open */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  )
}