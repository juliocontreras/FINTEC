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
    // Se han actualizado las clases para reducir el ancho del menú lateral en un 15%.
    // En pantallas pequeñas (hasta 767px), el ancho es 3.4vw.
    // En pantallas 'md' y superiores (768px o más), el ancho es 204px.
    <div 
      className="w-[3.4vw] md:w-[204px]"
      style={{ background: 'linear-gradient(to top right, #000000 0%, #1e3f4e 100%)' }}
    >
      <Sidebar className="w-full h-full bg-transparent">
        <SidebarHeader className="max-md:px-1">
          <div className="flex items-center gap-2 px-2 py-2 max-md:px-1 max-md:justify-center">
            <div className="h-8 w-8 bg-primary/10 rounded-lg flex items-center justify-center max-md:h-6 max-md:w-6">
              <Wallet className="h-5 w-5 text-primary max-md:h-4 max-md:w-4" />
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
                    <SidebarMenuButton 
                      onClick={() => onSectionChange(item.id)} 
                      isActive={activeSection === item.id}
                      className="max-md:px-1 max-md:justify-center max-md:min-h-12"
                    >
                      <item.icon className="h-4 w-4 max-md:h-5 max-md:w-5" />
                      <span className="max-md:hidden">{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="max-md:px-1">
          {/* Nuevo botón de Cerrar sesión */}
          <div className="px-2 py-2 max-md:px-1">
            <SidebarMenuButton className="w-full justify-start text-red-400 hover:bg-red-500/10 hover:text-red-300">
              <LogOut className="h-4 w-4" />
              <span className="max-md:hidden">Cerrar Sesión</span>
            </SidebarMenuButton>
          </div>
          <div className="px-2 py-2 text-xs text-muted-foreground max-md:px-1 max-md:text-center max-md:text-[10px]">
            <span className="max-md:hidden">© 2024 FinanceApp</span>
            <span className="md:hidden">©</span>
          </div>
        </SidebarFooter>
      </Sidebar>
    </div>
  )
}
