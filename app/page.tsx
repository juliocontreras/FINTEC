"use client"

import { AuthProvider } from "./components/auth-provider"
import { SplashScreen } from "./components/splash-screen"
import { AuthScreen } from "./components/auth-screen"
import { MainApp } from "./components/main-app"
import { useState, useEffect } from "react"
import { useAuth } from "./components/auth-provider"

function AppContent() {
  const [showSplash, setShowSplash] = useState(true)
  const { user, loading } = useAuth()

  const handleLoadingComplete = () => {
    setShowSplash(false)
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen bg-slate-900">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-400"></div>
    </div>
  }

  if (showSplash) {
    return <SplashScreen onLoadingComplete={handleLoadingComplete} />
  }

  if (!user) {
    return <AuthScreen />
  }

  return <MainApp />
}

export default function Home() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
