import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Configuración de la fuente Inter de Google Fonts
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

// 1. Exporta el objeto 'viewport' para configurar el theme-color
export const viewport = {
  themeColor: '#152C37', // Cambia este color al de tu gradiente
}


export const metadata: Metadata = {
  title: "Personal Finance App",
  description: "Tu asistente personal para el control financiero",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon-192x192.png",
    apple: "/icon-192x192.png",
  },
  openGraph: {
    images: ["https://fintechai.vercel.app/icon-192x192.png"],
  },
    generator: 'Julio'
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        
        <link rel="icon" href="/icon-192x192.png" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        {/* Le dice a iOS que la web app puede correr en modo standalone */}
        <meta name="apple-mobile-web-app-capable" content="yes" />

        {/* Hace la barra de estado de iOS translúcida para que se vea tu fondo */}
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
