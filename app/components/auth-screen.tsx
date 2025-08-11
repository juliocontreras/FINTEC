"use client"

import { useState, useEffect, useRef } from "react"
import { useAuth } from "./auth-provider"
import { ScanFace } from 'lucide-react'
import React from "react"

// Componente del logo de Fintech AI
const FintechAILogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 240 376"
    {...props}
  >
    <g>
      <path fillRule="evenodd" clipRule="evenodd" fill="currentColor" stroke="#FFFFFF" strokeMiterlimit="10" d="M213.963,315.394
    c-0.434,5.129-0.529,10.349-0.111,15.478c1.609,19.733-12.331,30.182-26.064,34.051c-18.254,5.143-34.787,1.333-49.707-10.282
    c-1.8-1.401-4.344-2.542-6.572-2.594c-30.538-0.716-56.473-24.033-60.352-54.735c-0.38-3.008-1.131-4.018-4.255-4.627
    c-29.194-5.692-48.263-28.918-49.017-58.794c-0.293-11.607,1.971-22.408,7.844-32.319c-21.389-35.575-4.724-82.782,33.309-97.816
    c3.597-1.422,2.951-3.795,2.975-6.322c0.27-28.394,24.729-54.623,52.975-56.732c2.477-0.185,4.979-0.024,7.77-0.024
    c8.709-15.346,21.615-26.075,38.886-31.016c16.419-4.696,32.462-4.287,47.663,4.761c3.333,1.982,4.797,3.991,4.784,8.104
    c-0.159,50.817-0.071,101.635-0.074,152.452c-0.001,26.82-0.549,53.688-0.579,80.508 M202.023,149.924c0-2.188,0-3.981,0-5.774
    c-0.004-36.498-0.006-72.997-0.012-109.496c0-7.983-4.449-13.278-12.374-13.547c-6.782-0.229-13.706-0.133-20.38,0.958
    c-25.868,4.231-51.566,35.71-33.632,66.438c1.586,2.718,2.916,5.591,4.277,8.434c2.202,4.598,1.477,7.961-2.057,9.977
    c-3.755,2.142-7.172,0.95-9.802-3.752c-8.506-15.204-15.049-30.828-9.104-48.922c-2.779,0-5.162-0.392-7.372,0.061
    c-22.85,4.674-39.282,28.804-35.02,51.711c0.885,4.759-0.562,6.671-5.027,7.692c-12.095,2.768-21.896,9.266-29.749,18.865
    c-15.81,19.324-16.233,46.639-1.153,65.72c0.899,1.137,0.854,4.396-0.094,5.402c-8.58,9.104-10.449,20.065-9.71,31.939
    c1.59,25.523,20.05,43.847,45.605,45.176c6.751,0.352,7.493,0.99,7.508,7.592c0.037,15.789,6.289,28.761,18.032,39.011
    c13.753,12.005,37.029,17.625,52.643-0.502c1.732-2.012,3.245-4.217,4.796-6.378c2.361-3.29,5.283-4.576,8.998-2.377
    c3.71,2.196,4.572,6.056,2.189,9.916c-1.129,1.829-2.489,3.573-4.005,5.096c-4.487,4.507-9.104,8.885-13.813,13.45
    c10.49,6.552,21.42,7.863,33.137,4.58c9.824-2.752,16.107-10.546,16.108-20.743c0.008-42.825,0.002-85.649,0.001-128.474
    c0-1.585,0-3.169,0-4.984c-12.22,0-23.708-0.163-35.189,0.06c-7.319,0.142-13.285-2.223-18.134-7.707
    c-10.59-11.98-21.417-23.758-31.799-35.915c-3.772-4.417-7.318-7.267-13.696-6.583c-6.587,0.707-11.943-3.597-14.196-9.659
    c-2.251-6.059-0.652-13.235,4.109-17.363c5.129-4.447,11.093-5.211,17.27-2.799c6.417,2.507,9.783,7.638,9.443,14.414
    c-0.237,4.732,1.196,8.081,4.325,11.533c9.507,10.487,19.113,20.943,27.784,32.108c6.126,7.89,13.025,11.333,23.021,10.434
    c8.857-0.798,17.846-0.168,26.703-0.168c0-8.18,0-15.403,0-23.014c-4.672,0-8.984,0.116-13.289-0.021
    c-15.39-0.493-25.313-10.719-25.342-26.09c-0.034-17.832-0.047-35.665,0.027-53.498c0.01-2.65-0.398-4.469-2.998-6.088
    c-6.031-3.756-8.201-11.024-5.994-17.974c1.982-6.24,8.027-10.593,14.771-10.636c7.078-0.045,12.949,4.127,15.156,10.769
    c2.143,6.443,0.055,14.206-5.539,17.753c-2.863,1.815-3.569,3.712-3.52,6.819c0.265,16.327,0.318,32.657,0.49,48.985
    c0.021,2.16,0.121,4.347,0.486,6.469c1.037,6.032,5.367,10.499,11.284,11.019C191.939,150.257,196.754,149.924,202.023,149.924z"/>
      <path fill="currentColor" stroke="#FFFFFF" strokeMiterlimit="10" d="M152.412,231.976c-5.166,0-10.332,0.08-15.496-0.016
    c-12.366-0.229-21.605-9.493-21.883-21.917c-0.089-3.997,0.085-8.001-0.042-11.995c-0.225-7.017-3.586-11.1-10.505-11.504
    c-6.24-0.364-12.404-1.128-17.81,4.618c-6.225,6.617-17.898,4.761-23.387-2.518c-5.228-6.934-3.438-17.854,3.699-22.573
    c8.155-5.392,18.167-2.932,23.272,5.446c0.819,1.344,2.856,2.503,4.46,2.704c4.28,0.537,8.653,0.293,12.949,0.742
    c10.114,1.06,17.6,8.961,18.332,19.19c0.333,4.646,0.531,9.306,0.676,13.962c0.228,7.348,4.44,11.75,11.863,11.86
    c9.328,0.139,18.668,0.286,27.989-0.019c12.981-0.426,25.056,8.845,23.507,23.43c-0.332,3.13,0.059,6.33-0.064,9.491
    c-0.24,6.161-0.088,11.302,6.105,15.833c7.533,5.509,6.7,17.07-0.105,23.271c-6.477,5.901-17.085,5.404-22.916-1.074
    c-6.125-6.806-5.062-16.465,2.191-23.014c1.471-1.328,2.617-3.757,2.711-5.734c0.321-6.816,0.176-13.658,0.082-20.488
    c-0.08-5.979-3.678-9.537-9.635-9.677c-2.664-0.063-5.331-0.005-7.996-0.004c-2.666,0.001-5.332,0-7.998,0
    C152.412,231.986,152.412,231.981,152.412,231.976z"/>
      <path fillRule="evenodd" clipRule="evenodd" fill="currentColor" stroke="#FFFFFF" strokeMiterlimit="10" d="M138.237,280.877
    c-0.789,5.367-0.061,9.322,4.744,13.038c6.881,5.323,6.342,16.161,0.088,22.186c-5.922,5.705-16.212,5.537-22.121-0.361
    c-5.997-5.985-6.455-16.669,0.07-21.856c4.212-3.349,3.852-7.063,4.117-11.307c0.824-13.172-4.863-23.026-15.847-29.479
    c-4.552-2.674-10.23-3.675-15.541-4.651c-1.458-0.268-3.705,2.061-5.127,3.619c-4.683,5.128-10.46,6.463-16.824,4.712
    c-5.971-1.643-9.552-6.097-10.598-12.092c-1.115-6.39,0.99-11.837,6.403-15.711c6.556-4.693,15.377-3.47,21.378,2.419
    c1.812,1.777,4.511,3.306,6.984,3.65c21.894,3.048,36.94,16.146,41.407,36.655C138.037,274.752,137.979,277.963,138.237,280.877z"
    />
    </g>
  </svg>
);

// Componente para el efecto de escritura en bucle
const TypingEffect = ({ textToType, className }: { textToType: string, className: string }) => {
    const [text, setText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [loopNum, setLoopNum] = useState(0);
    const typingSpeed = 120;
    const deletingSpeed = 80;
    const pauseDuration = 2000;

    useEffect(() => {
        const handleType = () => {
            const i = loopNum % 1;
            const fullText = textToType;

            setText(isDeleting 
                ? fullText.substring(0, text.length - 1) 
                : fullText.substring(0, text.length + 1)
            );

            if (!isDeleting && text === fullText) {
                setTimeout(() => setIsDeleting(true), pauseDuration);
            } else if (isDeleting && text === '') {
                setIsDeleting(false);
                setLoopNum(loopNum + 1);
            }
        };

        const timer = setTimeout(handleType, isDeleting ? deletingSpeed : typingSpeed);

        return () => clearTimeout(timer);
    }, [text, isDeleting, loopNum, textToType]);

    return (
        <p className={className}>
            {text}
            <span className="blinking-cursor">|</span>
        </p>
    );
};

// Nuevo componente de Canvas para partículas interactivas
const InteractiveParticleCanvas = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mousePos = useRef({ x: -1000, y: -1000 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        const particles: any[] = [];
        const numParticles = 25;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        const handleMouseMove = (event: MouseEvent) => {
            mousePos.current = { x: event.clientX, y: event.clientY };
        };
        
        const handleTouchMove = (event: TouchEvent) => {
            if (event.touches.length > 0) {
                mousePos.current = { x: event.touches[0].clientX, y: event.touches[0].clientY };
            }
        };

        const handleMouseOut = () => {
            mousePos.current = { x: -1000, y: -1000 };
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('touchmove', handleTouchMove);
        window.addEventListener('mouseout', handleMouseOut);
        window.addEventListener('touchend', handleMouseOut);

        class Particle {
            x: number;
            y: number;
            size: number;
            vx: number;
            vy: number;
            mass: number;

            constructor() {
                this.size = (Math.random() * 20 + 15) * 1.2;
                const width = canvas ? canvas.width : window.innerWidth;
                const height = canvas ? canvas.height : window.innerHeight;
                this.x = Math.random() * (width - this.size * 2) + this.size;
                this.y = Math.random() * (height - this.size * 2) + this.size;
                this.vx = (Math.random() - 0.5) * 2; // Velocidad inicial aumentada
                this.vy = (Math.random() - 0.5) * 2; // Velocidad inicial aumentada
                this.mass = this.size;
            }

            draw() {
                if (!ctx) return;
                ctx.fillStyle = 'rgba(45, 212, 191, 0.5)';
                ctx.font = `bold ${this.size}px Arial`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('$', this.x, this.y);
            }

            update() {
                // Interacción con el ratón/dedo
                const dxMouse = this.x - mousePos.current.x;
                const dyMouse = this.y - mousePos.current.y;
                const distanceMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
                const repelRadius = 100;
                const repelForce = 25;

                if (distanceMouse < repelRadius) {
                    const forceDirectionX = dxMouse / distanceMouse;
                    const forceDirectionY = dyMouse / distanceMouse;
                    const force = (repelRadius - distanceMouse) / repelRadius * repelForce;
                    this.vx += forceDirectionX * force / this.mass;
                    this.vy += forceDirectionY * force / this.mass;
                }

                // Límites de la pantalla
                if (canvas) {
                    if (this.x + this.size > canvas.width || this.x - this.size < 0) this.vx *= -1;
                    if (this.y + this.size > canvas.height || this.y - this.size < 0) this.vy *= -1;
                }

                this.x += this.vx;
                this.y += this.vy;

                // Fricción reducida para un movimiento más rápido
                this.vx *= 0.99;
                this.vy *= 0.99;
            }
        }

        const init = () => {
            for (let i = 0; i < numParticles; i++) {
                particles.push(new Particle());
            }
        };

        const resolveCollision = (p1: Particle, p2: Particle) => {
            const xVelocityDiff = p1.vx - p2.vx;
            const yVelocityDiff = p1.vy - p2.vy;
            const xDist = p2.x - p1.x;
            const yDist = p2.y - p1.y;

            if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {
                const angle = -Math.atan2(p2.y - p1.y, p2.x - p1.x);
                const m1 = p1.mass;
                const m2 = p2.mass;

                const u1 = { x: p1.vx, y: p1.vy };
                const u2 = { x: p2.vx, y: p2.vy };

                const rotatedVelocities1 = {
                    x: u1.x * Math.cos(angle) - u1.y * Math.sin(angle),
                    y: u1.x * Math.sin(angle) + u1.y * Math.cos(angle)
                };
                const rotatedVelocities2 = {
                    x: u2.x * Math.cos(angle) - u2.y * Math.sin(angle),
                    y: u2.x * Math.sin(angle) + u2.y * Math.cos(angle)
                };

                const finalVelocities1 = {
                    x: (rotatedVelocities1.x * (m1 - m2) + 2 * m2 * rotatedVelocities2.x) / (m1 + m2),
                    y: rotatedVelocities1.y
                };
                const finalVelocities2 = {
                    x: (rotatedVelocities2.x * (m2 - m1) + 2 * m1 * rotatedVelocities1.x) / (m1 + m2),
                    y: rotatedVelocities2.y
                };

                const finalResult1 = {
                    x: finalVelocities1.x * Math.cos(-angle) - finalVelocities1.y * Math.sin(-angle),
                    y: finalVelocities1.x * Math.sin(-angle) + finalVelocities1.y * Math.cos(-angle)
                };
                const finalResult2 = {
                    x: finalVelocities2.x * Math.cos(-angle) - finalVelocities2.y * Math.sin(-angle),
                    y: finalVelocities2.x * Math.sin(-angle) + finalVelocities2.y * Math.cos(-angle)
                };

                p1.vx = finalResult1.x;
                p1.vy = finalResult1.y;
                p2.vx = finalResult2.x;
                p2.vy = finalResult2.y;
            }
        };

        const animate = () => {
            if (!canvas) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();

                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < particles[i].size / 2 + particles[j].size / 2) {
                        resolveCollision(particles[i], particles[j]);
                    }
                }
            }
            animationFrameId = requestAnimationFrame(animate);
        };

        init();
        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('mouseout', handleMouseOut);
            window.removeEventListener('touchend', handleMouseOut);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    // --- INICIO: CÓDIGO CORREGIDO ---
    // Se eliminó la clase "-z-10" que ocultaba el canvas.
    return <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />;
    // --- FIN: CÓDIGO CORREGIDO ---
};


export function AuthScreen() {
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()

  useEffect(() => {
    // Guardar los estilos originales para poder restaurarlos después
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;

    // Bloquear el scroll en `body` y `html` para máxima compatibilidad en navegadores
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    // El código para el viewport que ya tenías es correcto para evitar el zoom en móviles
    const meta = document.querySelector('meta[name="viewport"]');
    let originalContent = '';
    if (meta) {
        originalContent = meta.getAttribute('content') || '';
        meta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
    }

    // Este manejador de focusout es una buena práctica para la experiencia en móviles,
    // especialmente cuando aparece el teclado virtual.
    const handleFocusOut = (event: FocusEvent) => {
        const target = event.target as HTMLElement;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
            setTimeout(() => {
                window.scrollTo(0, 0);
            }, 100);
        }
    };
    document.addEventListener('focusout', handleFocusOut);

    // Función de limpieza para restaurar los estilos y eventos originales cuando el componente se desmonte
    return () => {
        if (meta) {
            meta.setAttribute('content', originalContent);
        }
        // Restaurar los estilos de overflow originales
        document.body.style.overflow = originalBodyOverflow;
        document.documentElement.style.overflow = originalHtmlOverflow;

        // Limpiar el event listener
        document.removeEventListener('focusout', handleFocusOut);
    }
  }, []); // El array vacío asegura que este efecto se ejecute solo una vez

  const handleAnonymousLogin = async () => {
    setLoading(true)
    try {
      console.log("Attempting anonymous login...")
      await login("guest@financeapp.com", "anonymous")
      console.log("Anonymous login successful")
    } catch (error: any) {
      console.error("Login error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen text-white flex flex-col items-center justify-center p-4 font-sans relative overflow-hidden"
      style={{ background: "linear-gradient(to bottom, #152C37, #0C181E)" }}
    >
      {/* Estilos para animaciones */}
      <style>{`
        .blinking-cursor {
            animation: blink 1s step-end infinite;
            color: #2dd4bf; /* Color del cursor (teal-400) */
        }
        @keyframes blink {
            from, to {
                color: transparent;
            }
            50% {
                color: #2dd4bf;
            }
        }
      `}</style>
      
      <InteractiveParticleCanvas />

      <div className="w-full max-w-xs mx-auto relative z-10">
        {/* Header: Logo y Título */}
        <div className="flex flex-col items-center space-y-4 mb-10">
          <FintechAILogo className="h-20 w-20 text-teal-400 rotate-90" />
          <h1 className="text-5xl font-medium leading-7">Fintech AI</h1>
          <TypingEffect textToType="Finance Technology Investment" className="text-teal-400 text-sm tracking-wide h-4" />
        </div>

        {/* Formulario y Botones */}
        <div className="space-y-6">
          <div className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>

          <a href="#" className="block text-right text-teal-400 text-sm hover:underline">
            Forgot password?
          </a>

          <button
            onClick={handleAnonymousLogin}
            disabled={loading}
            className="w-full bg-teal-400 text-black font-bold py-3 px-4 rounded-full hover:bg-teal-500 transition-colors duration-300 disabled:bg-teal-700 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-3"></div>
                <span>Logging In...</span>
              </>
            ) : (
              "Log In"
            )}
          </button>

          <div className="flex items-center justify-center space-x-4 my-4">
            <span className="text-gray-500">or</span>
          </div>
          <div className="flex justify-center">
            <ScanFace className="h-10 w-10 text-gray-500" />
          </div>

          <button className="w-full border-2 border-teal-400 text-teal-400 font-bold py-3 px-4 rounded-full hover:bg-teal-400 hover:text-black transition-colors duration-300">
            Sign Up
          </button>
        </div>
      </div>
    </div>
  )
}