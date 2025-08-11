"use client"

import { useState } from "react"
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
    // Se ha actualizado el estilo para que la altura sea del 110% de la pantalla
    <div className="flex pt-4 h-[110vh]" style={{ background: 'linear-gradient(to bottom, #152C37, #0C181E)' }}>
      {/* Custom Sidebar */}
      <CustomSidebar 
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        {/* Se han eliminado las clases que causaban el corte del fondo */}
        <header className="bg-transparent">
          {/* El código del encabezado ha sido reemplazado por el nuevo diseño */}
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
              {/* Texto "Hello!" y nombre de usuario con foto a la derecha */}
              {/* Ambos elementos ahora actúan como enlaces a la sección de configuración */}
              <div 
                className="flex items-center space-x-3 cursor-pointer"
                onClick={() => setActiveSection("settings")}
              >
                  <div className="flex flex-col items-end">
                      <p className="font-normal text-sm text-gray-200">Hello!</p>
                      <p className="text-lg font-bold text-white">Julio Contreras</p>
                  </div>
                  {/* Foto de perfil */}
                  <img src="https://i.pravatar.cc/40?u=juliocontreras" alt="Profile" className="h-10 w-10 rounded-full object-cover"/>
              </div>
          </div>
        </header>

        {/* Contenido principal con ancho responsive */}
        <main className="flex-1 overflow-auto p-4 pb-24">
          <div className="w-5/5 md:w-1/2 lg:w-[45%] mx-auto">
            {renderActiveSection()}
          </div>
        </main>
      </div>

      {/* Bottom Navigation */}
      {/* He añadido las clases 'w-full sm:w-3/5 md:w-full mx-auto' para controlar el ancho y centrar el componente.
          w-full (ancho completo) por defecto en móviles.
          sm:w-3/5 (60% de ancho) para pantallas >= 640px.
          md:w-full (ancho completo) para pantallas >= 768px, sobrescribiendo la clase 'sm:w-3/5'.
          mx-auto centra el componente.
      */}
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
