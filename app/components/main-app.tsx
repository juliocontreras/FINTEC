"use client"

import { useState } from "react"
// Se han restaurado los imports originales
import { Bell, User, LogOut, Settings as SettingsIcon } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Dashboard } from "./sections/dashboard"
import { Transactions } from "./sections/transactions"
import { Investments } from "./sections/investments"
import { Budgets } from "./sections/budgets"
import { Settings } from "./sections/settings"
import { BottomNavigation } from "./bottom-navigation"
import { CustomSidebar } from "./custom-sidebar"
import { useAuth } from "./auth-provider"
import { Profile } from "./sections/profile" // Añade esta línea con tus otros imports de secciones

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
        case "profile":
      return <Profile /> 
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
             {/* Menú desplegable del perfil de usuario */}
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    {/* Este es el elemento que activa el menú (tu nombre y foto) */}
    <div className="flex items-center space-x-3 cursor-pointer">
      <div className="flex flex-col items-end">
        <p className="font-normal text-sm text-gray-200">Hola!</p>
        <p className="text-lg font-bold text-white">Julio Contreras</p>
      </div>
      <img 
        src="https://github.com/juliocontreras.png"
        alt="Profile" 
        className="h-11 w-11 rounded-full object-cover ring-2 ring-[#29c2a3]"
      />
    </div>
  </DropdownMenuTrigger>
  
  <DropdownMenuContent className="w-56 bg-[#20333b] border-gray-700 text-white" align="end">
    {/* INICIO: Sección añadida */}
    <div className="px-2 py-2">
      <p className="font-bold text-sm text-white">Julio Contreras</p>
      <p className="text-xs text-gray-400">julio.contreras@email.com</p>
    </div>
    <DropdownMenuSeparator className="bg-gray-700" />
    {/* FIN: Sección añadida */}

    {/* Opción 1: Perfil */}
    <DropdownMenuItem 
      className="cursor-pointer hover:bg-[#29c2a3]/20 focus:bg-[#29c2a3]/30"
      onClick={() => setActiveSection("profile")}
    >
      <User className="mr-2 h-4 w-4" />
      <span>Perfil</span>
    </DropdownMenuItem>
    
    {/* Opción 2: Configuración */}
    <DropdownMenuItem 
      className="cursor-pointer hover:bg-[#29c2a3]/20 focus:bg-[#29c2a3]/30"
      onClick={() => setActiveSection("settings")}
    >
      <SettingsIcon className="mr-2 h-4 w-4" />
      <span>Configuración</span>
    </DropdownMenuItem>
    
{/* Opción 3: Cerrar Sesión */}
<DropdownMenuItem 
  className="cursor-pointer hover:bg-red-500/20 focus:bg-red-500/30"
  onClick={logout}
>
  <LogOut className="mr-2 h-4 w-4" />
  <span>Cerrar sesión</span>
</DropdownMenuItem>
</DropdownMenuContent>
</DropdownMenu>
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