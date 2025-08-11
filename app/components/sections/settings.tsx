"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { ThemeToggle } from "@/components/theme-toggle" // Asumo que este componente existe
import { User, Bell, Shield, CreditCard, Download, Trash2, LogOut, ChevronDown } from 'lucide-react'
import { useState } from "react"
import { useAuth } from "../auth-provider"

// Componente de Tarjeta Plegable
const CollapsibleCard = ({ id, title, description, icon, openCard, setOpenCard, children }) => {
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


export function Settings() {
  const { logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [openCard, setOpenCard] = useState('profile'); // 'profile' card is open by default

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  // --- Clases de Estilo Reutilizables ---
  const labelClasses = "text-gray-300";
  const inputClasses = "bg-[#1a252a] border-slate-600 text-white placeholder:text-gray-500 rounded-md";
  const selectTriggerClasses = "bg-[#1a252a] border-slate-600 text-white rounded-md";
  const selectContentClasses = "bg-[#1a252a] border-slate-600 text-white"; // Color sólido para desplegables
  const buttonCyanClasses = "bg-[#4fd1c5] hover:bg-[#46d3c8] text-black font-bold rounded-lg";
  const buttonDeleteDarkClasses = "bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg";
  const separatorClasses = "bg-slate-700";

  return (
    <div className="space-y-6 p-4 md:p-8 pb-24"> {/* Espaciado inferior añadido aquí */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white">Configuración</h2>
        <p className="text-gray-400">Personaliza tu experiencia en la aplicación</p>
      </div>

      {/* Profile Settings */}
      <CollapsibleCard
        id="profile"
        title="Perfil de Usuario"
        description="Actualiza tu información personal"
        icon={<User className="h-6 w-6 text-white" />}
        openCard={openCard}
        setOpenCard={setOpenCard}
      >
        <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                <Label htmlFor="firstName" className={labelClasses}>Nombre</Label>
                <Input id="firstName" placeholder="Tu nombre" defaultValue="Usuario" className={inputClasses} />
                </div>
                <div className="space-y-2">
                <Label htmlFor="lastName" className={labelClasses}>Apellido</Label>
                <Input id="lastName" placeholder="Tu apellido" defaultValue="Demo" className={inputClasses} />
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="email" className={labelClasses}>Correo Electrónico</Label>
                <Input id="email" type="email" placeholder="tu@email.com" defaultValue="usuario@email.com" className={inputClasses} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="currency" className={labelClasses}>Moneda Principal</Label>
                <Select defaultValue="usd">
                <SelectTrigger className={selectTriggerClasses}>
                    <SelectValue />
                </SelectTrigger>
                <SelectContent className={selectContentClasses}>
                    <SelectItem value="usd">USD - Dólar Estadounidense</SelectItem>
                    <SelectItem value="eur">EUR - Euro</SelectItem>
                    <SelectItem value="mxn">MXN - Peso Mexicano</SelectItem>
                    <SelectItem value="cop">COP - Peso Colombiano</SelectItem>
                </SelectContent>
                </Select>
            </div>
            <Button className={`${buttonCyanClasses} w-full md:w-auto`}>Guardar Cambios</Button>
        </div>
      </CollapsibleCard>

      {/* Appearance Settings */}
      <CollapsibleCard
        id="appearance"
        title="Apariencia"
        description="Personaliza la apariencia"
        icon={<Bell className="h-6 w-6 text-white" />}
        openCard={openCard}
        setOpenCard={setOpenCard}
      >
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                <Label className={labelClasses}>Tema</Label>
                <p className="text-sm text-gray-400">Selecciona el tema de la aplicación</p>
                </div>
                {/* ThemeToggle necesita recibir las clases para el estilo del desplegable */}
                <ThemeToggle contentClassName={selectContentClasses} triggerClassName={buttonCyanClasses} />
            </div>
            <Separator className={separatorClasses} />
            <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                <Label className={labelClasses}>Formato de Fecha</Label>
                <p className="text-sm text-gray-400">Cómo se muestran las fechas</p>
                </div>
                <Select defaultValue="dd/mm/yyyy">
                <SelectTrigger className={`w-[180px] ${selectTriggerClasses}`}>
                    <SelectValue />
                </SelectTrigger>
                <SelectContent className={selectContentClasses}>
                    <SelectItem value="dd/mm/yyyy">DD/MM/YYYY</SelectItem>
                    <SelectItem value="mm/dd/yyyy">MM/DD/YYYY</SelectItem>
                    <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                </SelectContent>
                </Select>
            </div>
        </div>
      </CollapsibleCard>
      
      {/* Security Settings */}
      <CollapsibleCard
        id="security"
        title="Seguridad"
        description="Mantén tu cuenta segura"
        icon={<Shield className="h-6 w-6 text-white" />}
        openCard={openCard}
        setOpenCard={setOpenCard}
      >
        <div className="space-y-6">
            <div className="space-y-2">
                <Label className={labelClasses}>Cambiar Contraseña</Label>
                <div className="space-y-2">
                    <Input type="password" placeholder="Contraseña actual" className={inputClasses} />
                    <Input type="password" placeholder="Nueva contraseña" className={inputClasses} />
                    <Input type="password" placeholder="Confirmar nueva contraseña" className={inputClasses} />
                </div>
                <Button className={`${buttonCyanClasses} w-full`}>Actualizar Contraseña</Button>
            </div>
            <Separator className={separatorClasses} />
            <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                <Label className={labelClasses}>Autenticación de Dos Factores</Label>
                </div>
                <Button className={buttonCyanClasses}>Activar</Button>
            </div>
        </div>
      </CollapsibleCard>
      
      {/* Account Management Settings */}
      <CollapsibleCard
        id="account"
        title="Gestión de Cuenta"
        description="Administra tus datos y sesión"
        icon={<CreditCard className="h-6 w-6 text-white" />}
        openCard={openCard}
        setOpenCard={setOpenCard}
      >
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <Label className={labelClasses}>Exportar Datos</Label>
                <Button className={buttonCyanClasses}>
                <Download className="h-4 w-4 mr-2" />
                Exportar
                </Button>
            </div>
            <Separator className={separatorClasses} />
            <div className="flex items-center justify-between">
                <Label className={labelClasses}>Cerrar Sesión</Label>
                <Button className={buttonCyanClasses} onClick={handleLogout} disabled={isLoggingOut}>
                <LogOut className="h-4 w-4 mr-2" />
                {isLoggingOut ? "Cerrando..." : "Cerrar Sesión"}
                </Button>
            </div>
            <Separator className={separatorClasses} />
            <div className="flex items-center justify-between">
                <Label className={`${labelClasses} text-red-500`}>Eliminar Cuenta</Label>
                <Button className={buttonDeleteDarkClasses}>
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar
                </Button>
            </div>
        </div>
      </CollapsibleCard>

      <style jsx global>{`
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