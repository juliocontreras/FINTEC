/** @type {import('next').NextConfig} */

// Importa el inicializador del plugin PWA
import withPWAInit from "@ducanh2912/next-pwa";

// Inicializa el plugin PWA con su configuración
const withPWA = withPWAInit({
  dest: "public", // El directorio de destino para los archivos del service worker
  register: true, // Registrar el service worker automáticamente
  skipWaiting: true, // Forzar al service worker en espera a convertirse en el activo
  disable: process.env.NODE_ENV === "development", // Deshabilitar PWA en modo de desarrollo
});

// Tu configuración de Next.js, incluyendo las opciones que ya tenías
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
};

// Envuelve tu configuración de Next.js con el plugin PWA y la exporta
export default withPWA(nextConfig);
