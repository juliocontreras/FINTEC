"use client"

import React, { useState, useEffect, useRef } from 'react';
import { LayoutDashboard, Settings, Menu, X } from 'lucide-react'

interface BottomNavigationProps {
  activeSection: string
  onSectionChange: (section: string) => void
  onMenuClick: () => void
  isSidebarOpen: boolean
}

const navItems = [
  { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { id: "settings", icon: Settings, label: "Configuración" },
]

const NotchedBackground = () => (
  <svg
    className="absolute bottom-0 left-0 w-full h-[70px]"
    viewBox="0 0 375 70"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="none"
  >
    <path
      d="M0 35C0 15.67 15.67 0 35 0 H 141.5 C 153.5 0 161.5 30 173.5 30 A 32 32 0 0 0 201.5 30 C 213.5 30 221.5 0 233.5 0 H 340 C 359.33 0 375 15.67 375 35 V 35 C 375 54.33 359.33 70 340 70 H 35 C 15.67 70 0 54.33 0 35 Z"
      fill="#1A2E35"
    />
  </svg>
)

export function BottomNavigation({ activeSection, onSectionChange, onMenuClick, isSidebarOpen }: BottomNavigationProps) {
  const [isMenuButtonVisible, setMenuButtonVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 10) {
        setMenuButtonVisible(false);
      } else {
        setMenuButtonVisible(true);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    if (!isSidebarOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        onMenuClick(); // Call the parent's sidebar toggle function
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSidebarOpen, onMenuClick]);

  const handleMenuButtonClick = () => {
    onMenuClick(); // Call the parent's sidebar toggle function
  };

  return (
    <div ref={navRef} className="fixed bottom-4 left-0 right-0 h-20 flex items-center justify-center font-sans z-50">
      <div className="relative w-[90%] md:w-1/2 lg:w-1/4 h-full md:mx-auto lg:mx-auto">
        <NotchedBackground />
        <div 
          className={`absolute left-1/2 -translate-x-1/2 top-[-28px] transition-transform duration-500 ease-in-out ${
            isMenuButtonVisible ? 'translate-y-0' : 'translate-y-[40%]'
          }`}
        >
          <button
            onClick={handleMenuButtonClick}
            className="w-16 h-16 bg-teal-400 rounded-full flex items-center justify-center shadow-lg shadow-teal-400/30 transform hover:scale-110 transition-transform duration-300"
            aria-label="Menu"
          >
            <div className="relative w-8 h-8 flex items-center justify-center overflow-hidden">
                <Menu
                    className={`absolute text-black w-8 h-8 transition-all duration-300 ease-in-out ${
                        isSidebarOpen 
                        ? 'transform rotate-180 scale-0 opacity-0' 
                        : 'transform rotate-0 scale-100 opacity-100'
                    }`}
                />
                <X
                    className={`absolute text-black w-8 h-8 transition-all duration-300 ease-in-out ${
                        isSidebarOpen 
                        ? 'transform rotate-0 scale-100 opacity-100' 
                        : 'transform -rotate-180 scale-0 opacity-0'
                    }`}
                />
            </div>
          </button>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-[54px] flex justify-around items-center px-3.5 mb-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`flex flex-col items-center justify-center gap-1 transition-colors duration-300 ${
                activeSection === item.id ? "text-teal-400" : "text-gray-400"
              }`}
            >
              <item.icon className="w-7 h-7" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
