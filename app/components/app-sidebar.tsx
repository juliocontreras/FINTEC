"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { BarChart3, CreditCard, PieChart, Settings, Wallet, TrendingUp, LogOut } from 'lucide-react'

interface AppSidebarProps {
  activeSection: string
  onSectionChange: (section: string) => void
}

const menuItems = [
  {
    id: "dashboard",
    title: "Panel Principal",
    icon: BarChart3,
  },
  {
    id: "transactions",
    title: "Transacciones",
    icon: CreditCard,
  },
  {
    id: "investments",
    title: "Inversiones",
    icon: TrendingUp,
  },
  {
    id: "budgets",
    title: "Presupuestos",
    icon: PieChart,
  },
  {
    id: "settings",
    title: "Configuración",
    icon: Settings,
  },
]

export function AppSidebar({ activeSection, onSectionChange }: AppSidebarProps) {
  return (
    // Se ajusta el ancho en pantallas pequeñas para dar espacio al texto.
    <div 
      className="w-[70px] md:w-[204px] transition-all duration-300"
      style={{ background: 'linear-gradient(to top right, #000000 0%, #1e3f4e 100%)' }}
    >
      <Sidebar className="w-full h-full bg-transparent">
        <SidebarHeader className="max-md:px-1">
          <div className="flex items-center gap-2 px-2 py-2 max-md:justify-center">
            <div className="h-8 w-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <Wallet className="h-5 w-5 text-primary" />
            </div>
            <span className="font-semibold max-md:hidden">FinanceApp</span>
          </div>
        </SidebarHeader>

        <SidebarContent className="max-md:px-0">
          <SidebarGroup>
            <SidebarGroupLabel className="max-md:hidden">Navegación</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    {/* Se modifica el botón para apilar el icono y el texto en móvil */}
                    <SidebarMenuButton 
                      onClick={() => onSectionChange(item.id)} 
                      isActive={activeSection === item.id}
                      className="max-md:flex-col max-md:h-16 max-md:justify-center"
                    >
                      <item.icon className="h-5 w-5" />
                      {/* Texto completo para escritorio */}
                      <span className="max-md:hidden">{item.title}</span>
                      {/* Texto abreviado para móvil */}
                      <span className="md:hidden text-xs mt-1">{item.title.substring(0, 4)}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="max-md:px-1">
          <div className="px-2 py-2 max-md:px-1">
            {/* Se aplica el mismo estilo de apilado al botón de cerrar sesión */}
            <SidebarMenuButton className="w-full text-red-400 hover:bg-red-500/10 hover:text-red-300 max-md:flex-col max-md:h-16 max-md:justify-center">
              <LogOut className="h-5 w-5" />
              <span className="max-md:hidden">Cerrar Sesión</span>
              <span className="md:hidden text-xs mt-1">Salir</span>
            </SidebarMenuButton>
          </div>
          <div className="px-2 py-2 text-xs text-muted-foreground max-md:hidden">
            <span>© 2024 FinanceApp</span>
          </div>
        </SidebarFooter>
      </Sidebar>
    </div>
  )
}
