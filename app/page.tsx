'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  motion 
} from 'motion/react';
import { 
  Zap, 
  MapPin, 
  Bike, 
  Truck, 
  Package, 
  Clock, 
  ShieldCheck, 
  ArrowRight, 
  Smartphone, 
  Map, 
  ChevronDown,
  Menu,
  X,
  Instagram,
  Facebook,
  Award,
  Compass,
  FileText,
  Activity,
  Scale,
  Plus,
  Minus
} from 'lucide-react';

// MAR DEL PLATA ZONES FOR CALCULATOR
interface Zone {
  id: string;
  name: string;
  baseCost: number;
}

const MDP_ZONES: Zone[] = [
  { id: 'centro', name: 'Centro / Microcentro', baseCost: 1500 },
  { id: 'laperla', name: 'La Perla / Norte', baseCost: 1800 },
  { id: 'constitucion', name: 'Constitución / Los Pines', baseCost: 2000 },
  { id: 'puerto', name: 'Puerto / Stella Maris', baseCost: 2300 },
  { id: 'playagrande', name: 'Playa Grande / Alem', baseCost: 2400 },
  { id: 'bosque', name: 'Bosque Peralta Ramos / Alfar', baseCost: 3200 },
  { id: 'batan', name: 'Batán', baseCost: 3900 },
  { id: 'sierra', name: 'Sierra de los Padres', baseCost: 4800 },
];

export default function Page() {
  // Calculator State
  const [origin, setOrigin] = useState<string>('centro');
  const [destination, setDestination] = useState<string>('puerto');
  const [originAddress, setOriginAddress] = useState<string>('');
  const [destinationAddress, setDestinationAddress] = useState<string>('');
  const [packageWeight, setPackageWeight] = useState<number>(2); // Default 2 kg
  const [vehicle, setVehicle] = useState<'moto' | 'furgon'>('moto');
  const [serviceType, setServiceType] = useState<'express' | 'lowcost' | 'flex'>('express');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Compute calculated values synchronously during render (avoids state-sync useEffect)
  const originZone = MDP_ZONES.find(z => z.id === origin);
  const destZone = MDP_ZONES.find(z => z.id === destination);
  
  let calculatedPrice = 0;
  let estimatedTime = '30-50 min';

  if (originZone && destZone) {
    let base = (originZone.baseCost + destZone.baseCost) / 1.5;
    
    // If same zone, apply a local delivery discount
    if (origin === destination) {
      base = originZone.baseCost * 0.7;
    }

    // Vehicle multiplier
    const vehicleMult = vehicle === 'furgon' ? 1.8 : 1.0;
    
    // Weight multiplier based on pre-defined ranges
    let weightMult = 1.0;
    if (packageWeight > 25) {
      weightMult = 1.8;
    } else if (packageWeight > 10) {
      weightMult = 1.5;
    } else if (packageWeight > 5) {
      weightMult = 1.3;
    } else if (packageWeight > 2) {
      weightMult = 1.15;
    }

    // Service multiplier / additions
    let serviceBonus = 0;
    let serviceMult = 1.0;
    
    if (serviceType === 'express') {
      serviceBonus = 800; // instant delivery fee
    } else if (serviceType === 'lowcost') {
      serviceMult = 0.85; // 15% discount for next day
    } else if (serviceType === 'flex') {
      serviceBonus = 400; // standard MercadoLibre Flex integration
    }

    calculatedPrice = Math.round((base * vehicleMult * serviceMult * weightMult) + serviceBonus);

    // Estimate delivery times
    if (serviceType === 'express') {
      estimatedTime = vehicle === 'moto' ? '25-45 min' : '45-75 min';
    } else if (serviceType === 'flex') {
      estimatedTime = 'En el mismo día (14:00 a 20:00)';
    } else {
      estimatedTime = 'Siguiente día hábil (LowCost)';
    }
  }

  const handleWhatsAppQuote = () => {
    const originName = MDP_ZONES.find(z => z.id === origin)?.name || origin;
    const destName = MDP_ZONES.find(z => z.id === destination)?.name || destination;
    const vehicleName = vehicle === 'moto' ? 'Moto 🏍️' : 'Furgón 🚐';
    const typeLabel = 
      serviceType === 'express' ? 'Express al Toque' :
      serviceType === 'lowcost' ? 'LowCost Próximo Día' : 'MercadoLibre Flex';

    const text = `¡Hola Envíos DosRuedas! 👋 Coticé mi envío por la web y quiero confirmarlo:\n\n` +
      `📍 *Origen:* ${originAddress ? `${originAddress}, ` : ''}${originName}, Mar del Plata\n` +
      `🏁 *Destino:* ${destinationAddress ? `${destinationAddress}, ` : ''}${destName}, Mar del Plata\n` +
      `⚖️ *Peso del Paquete:* ~${packageWeight} kg\n` +
      `📦 *Servicio:* ${typeLabel}\n` +
      `🚐 *Vehículo:* ${vehicleName}\n` +
      `💵 *Precio Estimado:* $${calculatedPrice}\n` +
      `⏱️ *Tiempo Estimado:* ${estimatedTime}\n\n` +
      `¿Tienen un cadete disponible ahora? ¡Gracias!`;

    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/5492236602699?text=${encodedText}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-inter selection:bg-sunbeam-yellow selection:text-egyptian-blue antialiased">
      
      {/* 1. HEADER (Unified Blue Design) */}
      <header id="main-header" className="sticky top-0 z-50 bg-egyptian-blue border-b-4 border-sunbeam-yellow transition-all text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo Link matching user request exact markups */}
            <a 
              href="https://enviosoficialpruebas.vercel.app/" 
              className="flex items-center gap-3 group focus:outline-none"
            >
              <div className="relative w-12 h-12 bg-sunbeam-yellow border-2 border-white p-1 rounded-none shadow-brutal flex items-center justify-center transform group-hover:rotate-3 transition-transform">
                <Image 
                  src="https://enviosoficialpruebas.vercel.app/_next/image?url=%2FLogoEnviosDosRuedas.webp&w=3840&q=75"
                  alt="Logo Dos Ruedas"
                  width={48}
                  height={48}
                  className="object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-anton text-xl tracking-wider text-white block leading-none">
                  EnvíosDosRuedas
                </span>
                <span className="font-bebas text-xs tracking-widest text-sunbeam-yellow block mt-0.5">
                  LOGÍSTICA HUMANA & EFICIENTE
                </span>
              </div>
            </a>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-6">
              <a href="https://enviosoficialpruebas.vercel.app/" className="font-bebas text-lg tracking-wider text-white hover:text-sunbeam-yellow transition-colors">
                Inicio
              </a>
              <a href="#servicios" className="font-bebas text-lg tracking-wider text-white hover:text-sunbeam-yellow transition-colors">
                Servicios
              </a>
              <a href="#vision" className="font-bebas text-lg tracking-wider text-white hover:text-sunbeam-yellow transition-colors">
                Nosotros
              </a>
              <a href="https://enviosoficialpruebas.vercel.app/propiedades" className="font-bebas text-lg tracking-wider text-white hover:text-sunbeam-yellow transition-colors">
                Propiedades
              </a>
              <a href="https://enviosoficialpruebas.vercel.app/contacto" className="font-bebas text-lg tracking-wider text-white hover:text-sunbeam-yellow transition-colors">
                Contacto
              </a>
            </nav>

            {/* Action Buttons & Contact */}
            <div className="hidden md:flex items-center gap-4">
              <a 
                href="tel:+5492236602699" 
                className="font-mono text-sm font-semibold text-sunbeam-yellow hover:text-white transition-colors"
              >
                +54 223 660-2699
              </a>
              <a 
                href="https://enviosoficialpruebas.vercel.app/cotizar/express"
                className="bg-sunbeam-yellow text-egyptian-blue border-2 border-white font-bebas text-md tracking-wider px-4 py-2 rounded-none shadow-brutal hover:bg-white hover:shadow-none transition-all duration-200"
              >
                Cotizá tu Envío
              </a>
            </div>

            {/* Mobile menu button */}
            <div className="flex lg:hidden items-center gap-3">
              <a 
                href="tel:+5492236602699" 
                className="font-mono text-xs font-semibold text-sunbeam-yellow"
              >
                +54 223 660-2699
              </a>
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-white hover:text-sunbeam-yellow p-1"
                aria-label="Menu"
              >
                {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile menu panel */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-egyptian-blue border-b-4 border-sunbeam-yellow px-4 pt-2 pb-6 space-y-3 font-bebas text-xl tracking-wider">
            <a 
              href="https://enviosoficialpruebas.vercel.app/" 
              className="block py-2 text-white hover:text-sunbeam-yellow border-b border-white/10"
              onClick={() => setMobileMenuOpen(false)}
            >
              Inicio
            </a>
            <a 
              href="#servicios" 
              className="block py-2 text-white hover:text-sunbeam-yellow border-b border-white/10"
              onClick={() => setMobileMenuOpen(false)}
            >
              Servicios
            </a>
            <a 
              href="#vision" 
              className="block py-2 text-white hover:text-sunbeam-yellow border-b border-white/10"
              onClick={() => setMobileMenuOpen(false)}
            >
              Nosotros
            </a>
            <a 
              href="https://enviosoficialpruebas.vercel.app/propiedades" 
              className="block py-2 text-white hover:text-sunbeam-yellow border-b border-white/10"
              onClick={() => setMobileMenuOpen(false)}
            >
              Propiedades
            </a>
            <a 
              href="https://enviosoficialpruebas.vercel.app/contacto" 
              className="block py-2 text-white hover:text-sunbeam-yellow border-b border-white/10"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contacto
            </a>
            <div className="pt-2 flex flex-col gap-2">
              <a 
                href="https://enviosoficialpruebas.vercel.app/cotizar/express"
                className="w-full text-center bg-sunbeam-yellow text-egyptian-blue border-2 border-white py-2 px-4 font-bebas tracking-wider rounded-none block shadow-brutal-dark"
                onClick={() => setMobileMenuOpen(false)}
              >
                Cotizá tu Envío
              </a>
            </div>
          </div>
        )}
      </header>

      {/* 2. HERO SECTION (Blue Background Design with Background Image Overlay) */}
      <section id="hero" className="relative py-16 md:py-28 bg-blue-100 text-egyptian-blue overflow-hidden border-b-4 border-sunbeam-yellow border-y border-blue-200/60">
        
        {/* Absolute Background image with low opacity for clear readability */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
          <Image 
            src="https://enviosoficialpruebas.vercel.app/_next/image?url=%2Fhero%2Fhero_background.jpeg&w=3840&q=75"
            alt="Hero Background"
            fill
            className="object-cover"
            priority
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Diagonal aesthetic line */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-sunbeam-yellow/30 transform -rotate-2 pointer-events-none z-10"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Hero Text */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="inline-block bg-sunbeam-yellow text-egyptian-blue border-2 border-white font-bebas text-lg tracking-widest px-4 py-1.5 rounded-none transform -rotate-1 shadow-brutal-dark">
                Tu Solución Confiable
              </div>

              <h1 className="font-anton text-5xl md:text-7xl lg:text-8xl text-egyptian-blue uppercase leading-none tracking-tight">
                Conectá tu negocio <br />
                <span className="bg-sunbeam-yellow text-egyptian-blue px-3 inline-block transform rotate-1 border-4 border-white shadow-brutal-dark">
                  con toda la ciudad
                </span>
              </h1>

              <p className="text-xl text-gray-800 font-inter max-w-2xl leading-relaxed">
                Logística humana y eficiente para Mar del Plata. Poné tus ventas en las mejores manos: conectamos tu negocio con entregas rápidas y seguras. Clientes felices siempre.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 pt-4">
                <a 
                  href="https://enviosoficialpruebas.vercel.app/cotizar/express" 
                  className="bg-sunbeam-yellow text-egyptian-blue hover:bg-white border-2 border-egyptian-blue font-bebas text-xl tracking-wider px-8 py-4 rounded-none shadow-brutal-dark transition-all flex items-center gap-3 hover:shadow-none"
                >
                  Solicitá tu envío 
                  <ArrowRight className="w-5 h-5 text-egyptian-blue" />
                </a>
                <a 
                  href="https://enviosoficialpruebas.vercel.app/servicios/envios-express" 
                  className="bg-white text-egyptian-blue border-2 border-egyptian-blue font-bebas text-xl tracking-wider px-8 py-4 rounded-none shadow-brutal hover:bg-gray-100 transition-all flex items-center gap-2"
                >
                  Ver Servicios
                </a>
              </div>

              {/* Pillars Floating Badges */}
              <div className="grid grid-cols-3 gap-4 pt-6 max-w-xl">
                <div className="bg-white border-2 border-egyptian-blue p-3 text-center shadow-brutal">
                  <span className="font-bebas text-sm text-egyptian-blue block tracking-widest">100% SEGURO</span>
                </div>
                <div className="bg-white border-2 border-egyptian-blue p-3 text-center shadow-brutal">
                  <span className="font-bebas text-sm text-egyptian-blue block tracking-widest">ULTRA RÁPIDO</span>
                </div>
                <div className="bg-white border-2 border-egyptian-blue p-3 text-center shadow-brutal">
                  <span className="font-bebas text-sm text-egyptian-blue block tracking-widest">COBERTURA TOTAL</span>
                </div>
              </div>

            </div>

            {/* Hero Right: Neo-Brutalist Visual Card Display */}
            <div className="lg:col-span-5 relative flex flex-col items-center justify-center">
              
              {/* Stacked Interactive Card Front */}
              <div className="w-full max-w-sm bg-white border-4 border-egyptian-blue p-4 rounded-none shadow-brutal transform -rotate-2 relative z-10">
                <div className="aspect-video relative overflow-hidden border-2 border-egyptian-blue mb-3 bg-gray-100">
                  <Image 
                    src="https://enviosoficialpruebas.vercel.app/_next/image?url=%2Fcards%2Fcard_mapa.webp&w=3840&q=75"
                    alt="Tarjeta de Envíos DosRuedas - Vista Frontal"
                    fill
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2 left-2 bg-egyptian-blue text-white font-mono text-[10px] px-2 py-0.5">
                    ESTADO REAL
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bebas text-lg text-egyptian-blue tracking-wide">Rastreo Satelital Activo</span>
                  <span className="font-mono text-xs bg-green-100 text-green-700 font-semibold px-2 py-0.5">EN TRÁNSITO</span>
                </div>
              </div>

              {/* Behind Stacked Card Back */}
              <div className="w-full max-w-sm bg-sunbeam-yellow border-4 border-egyptian-blue p-4 rounded-none shadow-brutal-dark transform rotate-3 mt-4 lg:-mt-6 relative z-0">
                <div className="aspect-video relative overflow-hidden border-2 border-egyptian-blue mb-3 bg-gray-100">
                  <Image 
                    src="https://enviosoficialpruebas.vercel.app/_next/image?url=%2Fcards%2Fcard_moto01.webp&w=3840&q=75"
                    alt="Tarjeta de Envíos DosRuedas - Vista Posterior"
                    fill
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute bottom-2 right-2 bg-sunbeam-yellow text-egyptian-blue font-bebas text-xs px-2 py-0.5 border border-egyptian-blue">
                    VERIFICADO
                  </div>
                </div>
                <div className="flex justify-between items-center text-egyptian-blue">
                  <span className="font-bebas text-lg tracking-wide">Garantía Asegurada</span>
                  <span className="font-mono text-xs bg-blue-100 text-egyptian-blue font-semibold px-2 py-0.5">SEGURIDAD</span>
                </div>
              </div>

              {/* Explore action anchor */}
              <a 
                href="#nosotros" 
                className="mt-6 font-bebas text-lg text-egyptian-blue hover:text-egyptian-blue/80 transition-colors flex items-center gap-2 animate-bounce uppercase tracking-widest"
              >
                Explore <ArrowRight className="w-4 h-4 rotate-90" />
              </a>

            </div>

          </div>
        </div>
      </section>

      {/* 3. SECTION 1: Partner Logístico Especializado (Alternate Background - White) */}
      <section id="nosotros" className="py-20 bg-white text-gray-900 border-b-4 border-egyptian-blue relative z-10 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Col: Image display matching requested map background asset */}
            <div className="lg:col-span-5 relative">
              <div className="absolute -inset-2 bg-egyptian-blue rounded-none transform rotate-1 pointer-events-none"></div>
              <div className="relative bg-white border-4 border-egyptian-blue p-3 shadow-brutal">
                <div className="aspect-[4/3] relative overflow-hidden border-2 border-egyptian-blue bg-gray-100">
                  <Image 
                    src="https://enviosoficialpruebas.vercel.app/_next/image?url=%2Fhero%2Fmapa_background.jpeg&w=3840&q=75"
                    alt="Vanguardia Logística"
                    fill
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 right-3 bg-green-500 text-white font-bebas text-sm px-3.5 py-1 tracking-widest shadow-brutal-dark">
                    EN LÍNEA
                  </div>
                </div>
              </div>
            </div>

            {/* Right Col: Details / Highlights */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="inline-block bg-egyptian-blue text-sunbeam-yellow font-bebas text-md tracking-wider px-3.5 py-1.5 uppercase">
                Partner Logístico Especializado
              </div>

              <h2 className="font-anton text-4xl md:text-6xl text-egyptian-blue uppercase leading-none tracking-tight">
                Llegá más rápido <br />
                y sin límites
              </h2>

              <p className="text-lg text-gray-700 leading-relaxed font-inter">
                Transformá tus costos fijos en soluciones flexibles que acompañan el crecimiento de tu negocio. Olvidate de las demoras y enfocate en vender.
              </p>

              {/* Bullet Highlights Grid */}
              <div className="space-y-4 pt-2">
                
                <div className="flex gap-4 items-start">
                  <div className="bg-sunbeam-yellow text-egyptian-blue p-2.5 border-2 border-egyptian-blue rounded-none shrink-0 mt-0.5 shadow-brutal">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bebas text-xl text-egyptian-blue tracking-wide leading-none">Entregas a Tiempo</h4>
                    <p className="text-sm text-gray-600 mt-1 font-inter">Puntualidad garantizada en cada envío</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="bg-sunbeam-yellow text-egyptian-blue p-2.5 border-2 border-egyptian-blue rounded-none shrink-0 mt-0.5 shadow-brutal">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bebas text-xl text-egyptian-blue tracking-wide leading-none">Envíos Seguros</h4>
                    <p className="text-sm text-gray-600 mt-1 font-inter">Protección total de tus paquetes</p>
                  </div>
                </div>

                {/* Additional metrics and descriptors from user spec */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t-2 border-dashed border-gray-200">
                  <div>
                    <span className="font-anton text-2xl text-egyptian-blue block">+5.000</span>
                    <span className="text-xs text-gray-500 font-inter">Confianza local comprobada</span>
                  </div>
                  <div>
                    <span className="font-anton text-2xl text-egyptian-blue block">7 Años</span>
                    <span className="text-xs text-gray-500 font-inter">Innovación constante en última milla</span>
                  </div>
                  <div>
                    <span className="font-anton text-2xl text-egyptian-blue block">Flota Exclusiva</span>
                    <span className="text-xs text-gray-500 font-inter">Motocicletas dedicadas para máxima agilidad</span>
                  </div>
                </div>

              </div>

              {/* Call to action */}
              <div className="pt-2">
                <a 
                  href="https://enviosoficialpruebas.vercel.app/nosotros/sobre-nosotros"
                  className="bg-egyptian-blue text-white hover:bg-sunbeam-yellow hover:text-egyptian-blue border-2 border-egyptian-blue font-bebas text-xl tracking-wider px-8 py-4 rounded-none shadow-brutal-yellow hover:shadow-none transition-all inline-flex items-center gap-3"
                >
                  Conocé más sobre nosotros
                  <ArrowRight className="w-5 h-5" />
                </a>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 4. SECTION 2: ¡Empezá Ahora! (Alternate Background - Blue) */}
      <section className="relative py-20 bg-blue-100 text-egyptian-blue border-b-4 border-sunbeam-yellow border-y border-blue-200/60 overflow-hidden">
        
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-15">
          <Image 
            src="https://enviosoficialpruebas.vercel.app/_next/image?url=%2Fhero%2Fabstracto_background.jpeg&w=3840&q=75"
            alt="Abstract Background"
            fill
            className="object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
          
          <div className="max-w-3xl mx-auto space-y-4">
            <span className="font-bebas text-lg bg-sunbeam-yellow text-egyptian-blue border border-egyptian-blue px-4 py-1.5 tracking-wider uppercase inline-block transform -rotate-1 shadow-brutal-dark">
              ¡Empezá Ahora!
            </span>
            <h2 className="font-anton text-4xl md:text-6xl text-egyptian-blue uppercase leading-none tracking-tight">
              ¿Listo para escalar la <br className="hidden md:inline" />
              logística de tu E-Commerce?
            </h2>
            <p className="text-lg text-gray-800 max-w-2xl mx-auto font-inter">
              Olvidate de la gestión de paquetes and enfocate en vender más. Dejá la distribución urbana en manos de expertos.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6">
            <a 
              href="https://wa.me/5492236602699?text=Hola%20Envios%20DosRuedas,%20vengo%20desde%20la%20web."
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 hover:bg-green-600 text-white font-bebas text-xl tracking-wider px-8 py-4 rounded-none border-2 border-white shadow-brutal hover:shadow-none transition-all inline-flex items-center gap-3"
            >
              Contactanos por WhatsApp 
              <Smartphone className="w-5 h-5 fill-white" />
            </a>
            <a 
              href="https://enviosoficialpruebas.vercel.app/tarifas"
              className="bg-sunbeam-yellow text-egyptian-blue hover:bg-white border-2 border-egyptian-blue font-bebas text-xl tracking-wider px-8 py-4 rounded-none shadow-brutal-dark hover:shadow-none transition-all inline-flex items-center gap-3"
            >
              Ver Tarifas 2026 
              <ArrowRight className="w-5 h-5 text-egyptian-blue" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto pt-8 border-t border-egyptian-blue/20">
            <div className="p-4 bg-white border-2 border-egyptian-blue shadow-brutal rounded-none">
              <span className="font-bebas text-lg tracking-widest text-egyptian-blue block uppercase">Confianza local comprobada</span>
            </div>
            <div className="p-4 bg-white border-2 border-egyptian-blue shadow-brutal rounded-none">
              <span className="font-bebas text-lg tracking-widest text-egyptian-blue block uppercase">Innovación constante en última milla</span>
            </div>
            <div className="p-4 bg-white border-2 border-egyptian-blue shadow-brutal rounded-none">
              <span className="font-bebas text-lg tracking-widest text-egyptian-blue block uppercase">Motocicletas dedicadas para máxima agilidad</span>
            </div>
          </div>

        </div>
      </section>

      {/* 5. SECTION 3: Soluciones Corporativas y PyME (Alternate Background - White) */}
      <section id="vision" className="py-20 bg-white text-gray-900 border-b-4 border-egyptian-blue relative z-10 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            
            <span className="font-bebas text-md bg-sunbeam-yellow text-egyptian-blue px-3.5 py-1.5 border border-egyptian-blue tracking-wider uppercase inline-block shadow-brutal">
              Soluciones Corporativas y PyME
            </span>

            <h2 className="font-anton text-4xl md:text-6xl text-egyptian-blue uppercase leading-none tracking-wide">
              Potenciá tu Logística <br />
              con DosRuedas
            </h2>

            <p className="text-gray-600 font-inter text-md max-w-2xl mx-auto">
              Transformamos la última milla de tu empresa con una flota ágil y especializada de alta precisión. Beneficios exclusivos para clientes corporativos.
            </p>

            <div className="flex justify-center gap-6 pt-2 font-bebas text-lg">
              <span className="bg-egyptian-blue text-white px-3 py-1">500+ Empresas</span>
              <span className="bg-egyptian-blue text-white px-3 py-1">24/7 Operativa</span>
            </div>

          </div>

          {/* Solution Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Card 1: Corporativo */}
            <div className="bg-white border-4 border-egyptian-blue rounded-none shadow-brutal overflow-hidden flex flex-col justify-between">
              <div>
                <div className="aspect-[16/10] relative overflow-hidden bg-gray-100 border-b-2 border-egyptian-blue">
                  <Image 
                    src="https://enviosoficialpruebas.vercel.app/_next/image?url=https%3A%2F%2Fimages.unsplash.com%2Fphoto-1559136555-9303baea8ebd%3Fauto%3Dformat%26fit%3Dcrop%26q%3D80%26w%3D800&w=3840&q=75"
                    alt="Corporativo"
                    fill
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2 left-2 bg-egyptian-blue text-white font-bebas text-xs px-2.5 py-1">
                    Corporativo
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <h3 className="font-anton text-2xl text-egyptian-blue uppercase leading-none">
                    Soluciones Corporativas
                  </h3>
                  <p className="text-sm text-gray-600 font-inter leading-relaxed">
                    Optimización logística para empresas con Cuenta Corriente Flexible y beneficios de escala
                  </p>
                  <ul className="space-y-1.5 pt-2">
                    {["Cuenta Corriente Flexible", "Facturación simplificada", "Gestión multi-usuario", "Reportes de impacto"].map((bullet, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-xs text-gray-700 font-mono">
                        <span className="text-egyptian-blue font-bold">&bull;</span> {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="p-6 pt-0">
                <a 
                  href="https://enviosoficialpruebas.vercel.app/servicios/plan-emprendedores"
                  className="w-full text-center bg-egyptian-blue hover:bg-sunbeam-yellow hover:text-egyptian-blue text-white font-bebas text-lg py-3 rounded-none border-2 border-egyptian-blue transition-all inline-block tracking-wider"
                >
                  CONFIGURÁ TU PLAN 
                </a>
              </div>
            </div>

            {/* Card 2: MercadoLibre */}
            <div className="bg-white border-4 border-egyptian-blue rounded-none shadow-brutal-yellow overflow-hidden flex flex-col justify-between">
              <div>
                <div className="aspect-[16/10] relative overflow-hidden bg-gray-100 border-b-2 border-egyptian-blue">
                  <Image 
                    src="https://enviosoficialpruebas.vercel.app/_next/image?url=https%3A%2F%2Fimages.unsplash.com%2Fphoto-1556761175-b413da4baf72%3Fauto%3Dformat%26fit%3Dcrop%26q%3D80%26w%3D800&w=3840&q=75"
                    alt="MercadoLibre"
                    fill
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2 left-2 bg-yellow-500 text-white font-bebas text-xs px-2.5 py-1">
                    MercadoLibre
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <h3 className="font-anton text-2xl text-egyptian-blue uppercase leading-none">
                    Envíos Flex MercadoLibre
                  </h3>
                  <p className="text-sm text-gray-600 font-inter leading-relaxed">
                    Socio estratégico para potenciar tus ventas con entregas en el día
                  </p>
                  <ul className="space-y-1.5 pt-2">
                    {["Cumplimiento de SLAs", "Mejora tu reputación", "Tarifas competitivas", "Soporte Flex dedicado"].map((bullet, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-xs text-gray-700 font-mono">
                        <span className="text-egyptian-blue font-bold">&bull;</span> {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="p-6 pt-0">
                <a 
                  href="https://enviosoficialpruebas.vercel.app/servicios/enviosflex"
                  className="w-full text-center bg-sunbeam-yellow hover:bg-egyptian-blue hover:text-white text-egyptian-blue font-bebas text-lg py-3 rounded-none border-2 border-egyptian-blue transition-all inline-block tracking-wider"
                >
                  CONFIGURÁ TU PLAN 
                </a>
              </div>
            </div>

            {/* Card 3: PyMEs */}
            <div className="bg-white border-4 border-egyptian-blue rounded-none shadow-brutal overflow-hidden flex flex-col justify-between">
              <div>
                <div className="aspect-[16/10] relative overflow-hidden bg-gray-100 border-b-2 border-egyptian-blue">
                  <Image 
                    src="https://enviosoficialpruebas.vercel.app/_next/image?url=https%3A%2F%2Fimages.unsplash.com%2Fphoto-1521791136064-7986c2920216%3Fauto%3Dformat%26fit%3Dcrop%26q%3D80%26w%3D800&w=3840&q=75"
                    alt="PyMEs"
                    fill
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2 left-2 bg-egyptian-blue text-white font-bebas text-xs px-2.5 py-1">
                    PyMEs
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <h3 className="font-anton text-2xl text-egyptian-blue uppercase leading-none">
                    Logística E-Commerce
                  </h3>
                  <p className="text-sm text-gray-600 font-inter leading-relaxed">
                    Gestión integral de última milla para PyMEs en crecimiento
                  </p>
                  <ul className="space-y-1.5 pt-2">
                    {["Integración tecnológica", "Rutas optimizadas", "Flota especializada", "Seguimiento en tiempo real"].map((bullet, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-xs text-gray-700 font-mono">
                        <span className="text-egyptian-blue font-bold">&bull;</span> {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="p-6 pt-0">
                <a 
                  href="https://enviosoficialpruebas.vercel.app/servicios/plan-emprendedores"
                  className="w-full text-center bg-egyptian-blue hover:bg-sunbeam-yellow hover:text-egyptian-blue text-white font-bebas text-lg py-3 rounded-none border-2 border-egyptian-blue transition-all inline-block tracking-wider"
                >
                  CONFIGURÁ TU PLAN 
                </a>
              </div>
            </div>

          </div>

          {/* Decorative Delivery background layout segment */}
          <div className="mt-16 relative aspect-[21/9] w-full overflow-hidden border-4 border-egyptian-blue shadow-brutal bg-gray-100 hidden md:block">
            <Image 
              src="https://enviosoficialpruebas.vercel.app/_next/image?url=%2Fhero%2Fdelivery_background.jpeg&w=3840&q=75"
              alt="Flota ágil"
              fill
              className="object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

        </div>
      </section>

      {/* 6. SECTION 4: Nuestros Servicios & Cotizador Interactivo (Alternate Background - Blue) */}
      <section id="servicios" className="py-20 bg-blue-100 text-egyptian-blue border-b-4 border-sunbeam-yellow border-y border-blue-200/60 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left side: Services description & modular solutions */}
            <div className="lg:col-span-7 space-y-8">
              
              <div className="space-y-4">
                <span className="font-bebas text-sm bg-sunbeam-yellow text-egyptian-blue border border-egyptian-blue px-3.5 py-1.5 tracking-wider uppercase inline-block">
                  CAPACIDADES DINÁMICAS
                </span>
                <span className="font-bebas text-sm bg-white text-egyptian-blue px-3.5 py-1.5 ml-2 tracking-wider uppercase inline-block">
                  Nuestros Servicios
                </span>
                <h2 className="font-anton text-4xl md:text-6xl text-egyptian-blue uppercase leading-none tracking-wide">
                  SOLUCIONES A MEDIDA
                </h2>
                <h3 className="font-bebas text-2xl text-egyptian-blue/95 tracking-widest uppercase">
                  Elegí tu plan de entregas
                </h3>
                <p className="text-gray-700 font-inter text-md max-w-2xl">
                  Hemos redefinido los estándares de la logística urbana para ofrecerte una ventaja competitiva real en un mercado en constante evolución. Inteligencia aplicada a cada kilómetro para negocios que no se detienen.
                </p>
              </div>

              {/* Grid of four exact services requested in text list */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                
                {/* 1. Envíos Express */}
                <div className="bg-white border-4 border-egyptian-blue p-6 rounded-none shadow-brutal-dark text-gray-900 flex flex-col justify-between">
                  <div className="space-y-3">
                    <span className="inline-block bg-red-100 text-red-700 text-xs font-bold font-mono px-2 py-0.5 rounded-none uppercase">
                      ALTA PRIORIDAD
                    </span>
                    <h4 className="font-anton text-2xl text-egyptian-blue leading-none">
                      Envíos Express
                    </h4>
                    <span className="block font-bebas text-md text-gray-600 tracking-wide uppercase">
                      Prioridad absoluta y certeza total.
                    </span>
                    <p className="text-xs text-gray-600 font-inter leading-relaxed">
                      Diseñado para operaciones de alta criticidad horaria. Vos elegís el rango exacto de entrega con solo 2 horas de anticipación. Garantizamos precisión en el tiempo de tu cliente final.
                    </p>
                  </div>
                  <div className="pt-4 border-t border-dashed border-gray-100 mt-4">
                    <a 
                      href="https://enviosoficialpruebas.vercel.app/servicios/envios-express"
                      className="text-egyptian-blue font-bebas text-lg tracking-wider flex items-center gap-2 hover:text-sunbeam-yellow transition-colors"
                    >
                      Solicitar Express <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                {/* 2. Envíos LowCost */}
                <div className="bg-white border-4 border-egyptian-blue p-6 rounded-none shadow-brutal-dark text-gray-900 flex flex-col justify-between">
                  <div className="space-y-3">
                    <span className="inline-block bg-blue-100 text-blue-700 text-xs font-bold font-mono px-2 py-0.5 rounded-none uppercase">
                      RENTABILIDAD
                    </span>
                    <h4 className="font-anton text-2xl text-egyptian-blue leading-none">
                      Envíos LowCost
                    </h4>
                    <span className="block font-bebas text-md text-gray-600 tracking-wide uppercase">
                      Rentabilidad y ruteo masivo.
                    </span>
                    <p className="text-xs text-gray-600 font-inter leading-relaxed">
                      Variabilizá tus costos logísticos. Ingresá tus pedidos antes de las 13:00 hs y te garantizamos la entrega en el día antes de las 19:00 hs de manera unificada.
                    </p>
                  </div>
                  <div className="pt-4 border-t border-dashed border-gray-100 mt-4">
                    <a 
                      href="https://enviosoficialpruebas.vercel.app/servicios/envios-lowcost"
                      className="text-egyptian-blue font-bebas text-lg tracking-wider flex items-center gap-2 hover:text-sunbeam-yellow transition-colors"
                    >
                      Ahorrá con LowCost <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                {/* 3. Envíos Flex (MercadoLibre) */}
                <div className="bg-white border-4 border-egyptian-blue p-6 rounded-none shadow-brutal-dark text-gray-900 flex flex-col justify-between">
                  <div className="space-y-3">
                    <span className="inline-block bg-yellow-100 text-yellow-800 text-xs font-bold font-mono px-2 py-0.5 rounded-none uppercase">
                      MERCADOLIBRE
                    </span>
                    <h4 className="font-anton text-2xl text-egyptian-blue leading-none">
                      Envíos Flex (MercadoLibre)
                    </h4>
                    <span className="block font-bebas text-md text-gray-600 tracking-wide uppercase">
                      Tus ventas en las mejores manos.
                    </span>
                    <p className="text-xs text-gray-600 font-inter leading-relaxed">
                      Somos expertos en MercadoLibre. Despachá hasta las 15:00 hs y nosotros cumplimos tus acuerdos de nivel de servicio (SLAs) Same-Day para que tu termómetro siempre esté en verde.
                    </p>
                  </div>
                  <div className="pt-4 border-t border-dashed border-gray-100 mt-4">
                    <a 
                      href="https://enviosoficialpruebas.vercel.app/servicios/enviosflex"
                      className="text-egyptian-blue font-bebas text-lg tracking-wider flex items-center gap-2 hover:text-sunbeam-yellow transition-colors"
                    >
                      Activar Envíos Flex <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                {/* 4. E-Commerce & 3PL */}
                <div className="bg-white border-4 border-egyptian-blue p-6 rounded-none shadow-brutal-dark text-gray-900 flex flex-col justify-between">
                  <div className="space-y-3">
                    <span className="inline-block bg-purple-100 text-purple-700 text-xs font-bold font-mono px-2 py-0.5 rounded-none uppercase">
                      INTEGRAL
                    </span>
                    <h4 className="font-anton text-2xl text-egyptian-blue leading-none">
                      E-Commerce & 3PL
                    </h4>
                    <span className="block font-bebas text-md text-gray-600 tracking-wide uppercase">
                      Conectamos tu negocio con la ciudad.
                    </span>
                    <p className="text-xs text-gray-600 font-inter leading-relaxed">
                      Más que un envío, somos tu depósito y tu equipo. Soluciones de almacenamiento y entrega escalables para PyMEs y plataformas con facturación mensual centralizada.
                    </p>
                  </div>
                  <div className="pt-4 border-t border-dashed border-gray-100 mt-4">
                    <a 
                      href="https://enviosoficialpruebas.vercel.app/servicios/plan-emprendedores"
                      className="text-egyptian-blue font-bebas text-lg tracking-wider flex items-center gap-2 hover:text-sunbeam-yellow transition-colors"
                    >
                      Hablá con un asesor <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>

              </div>

              {/* Banner indicators footer in section */}
              <div className="space-y-2 pt-4">
                <div className="h-1 bg-egyptian-blue w-36"></div>
                <div className="flex gap-4 font-bebas text-sm text-egyptian-blue tracking-widest uppercase flex-wrap">
                  <span>MÁXIMO PODER</span>
                  <span>&bull;</span>
                  <span>INFRAESTRUCTURA TOTAL</span>
                  <span>&bull;</span>
                  <span>ENGINEERING LOGISTICS FOR THE MODERN ERA OF COMMERCE</span>
                </div>
              </div>

            </div>

            {/* Right side: Cotizador Form widget - keeps beautiful client interaction */}
            <div id="cotizador" className="lg:col-span-5 bg-white border-4 border-egyptian-blue p-6 text-gray-900 shadow-brutal-yellow">
              
              <div className="border-b-2 border-dashed border-gray-200 pb-4 mb-5">
                <div className="flex items-center justify-between">
                  <span className="font-bebas text-xs text-egyptian-blue tracking-widest block uppercase">CÁLCULO DINÁMICO & PERSISTENTE</span>
                  <span className="bg-sunbeam-yellow text-egyptian-blue font-mono text-[9px] font-bold px-2 py-0.5 border border-egyptian-blue uppercase">Soft UI inside</span>
                </div>
                <h2 className="font-anton text-2xl text-egyptian-blue tracking-wider flex items-center gap-2 mt-1">
                  <Map className="w-6 h-6 text-egyptian-blue" /> COTIZÁ TU ENVÍO EN MDP
                </h2>
                <p className="text-xs text-gray-500 mt-1 font-inter">
                  Elegí las zonas, ingresá las direcciones y peso del bulto para cotizar al instante.
                </p>
              </div>

              {/* Calculator Inputs */}
              <div className="space-y-4">
                
                {/* Origin Address & Zone */}
                <div className="space-y-2">
                  <label className="block text-xs font-bebas tracking-wider text-gray-600 uppercase flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-egyptian-blue" /> Punto de Retiro (Origen en Mar del Plata)
                  </label>
                  
                  {/* Soft UI Address text input */}
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Calle y altura del retiro. Ej: Av. Luro 3200" 
                      value={originAddress}
                      onChange={(e) => setOriginAddress(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-egyptian-blue/10 focus:border-egyptian-blue transition-all shadow-[inset_1px_1.5px_3px_rgba(0,0,0,0.06)]"
                    />
                  </div>

                  {/* Soft UI Zone select */}
                  <div className="relative">
                    <select 
                      value={origin}
                      onChange={(e) => setOrigin(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl px-4 py-2.5 pr-10 font-inter text-sm text-gray-700 focus:outline-none focus:ring-4 focus:ring-egyptian-blue/10 focus:border-egyptian-blue transition-all shadow-[inset_1px_1.5px_3px_rgba(0,0,0,0.06)] appearance-none cursor-pointer"
                    >
                      {MDP_ZONES.map(zone => (
                        <option key={zone.id} value={zone.id}>Zona: {zone.name}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3.5 top-3 w-4.5 h-4.5 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* Destination Address & Zone */}
                <div className="space-y-2">
                  <label className="block text-xs font-bebas tracking-wider text-gray-600 uppercase flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-red-600" /> Punto de Entrega (Destino en Mar del Plata)
                  </label>

                  {/* Soft UI Address text input */}
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Calle y altura de la entrega. Ej: Güemes 2600" 
                      value={destinationAddress}
                      onChange={(e) => setDestinationAddress(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-egyptian-blue/10 focus:border-egyptian-blue transition-all shadow-[inset_1px_1.5px_3px_rgba(0,0,0,0.06)]"
                    />
                  </div>

                  {/* Soft UI Zone select */}
                  <div className="relative">
                    <select 
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl px-4 py-2.5 pr-10 font-inter text-sm text-gray-700 focus:outline-none focus:ring-4 focus:ring-egyptian-blue/10 focus:border-egyptian-blue transition-all shadow-[inset_1px_1.5px_3px_rgba(0,0,0,0.06)] appearance-none cursor-pointer"
                    >
                      {MDP_ZONES.map(zone => (
                        <option key={zone.id} value={zone.id}>Zona: {zone.name}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3.5 top-3 w-4.5 h-4.5 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* Package Weight (Soft UI control) */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bebas tracking-wider text-gray-600 uppercase flex items-center gap-1.5">
                      <Scale className="w-3.5 h-3.5 text-egyptian-blue" /> Peso aproximado del paquete
                    </label>
                    <span className="bg-egyptian-blue text-white font-mono text-xs font-bold px-2.5 py-0.5 rounded-full shadow-sm">
                      {packageWeight} kg
                    </span>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80 shadow-[inset_1px_1.5px_3px_rgba(0,0,0,0.04)] space-y-3">
                    <div className="flex items-center gap-3">
                      {/* Decrement Button */}
                      <button 
                        type="button"
                        onClick={() => setPackageWeight(prev => Math.max(1, prev - 1))}
                        className="w-8 h-8 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-gray-600 hover:text-egyptian-blue hover:bg-slate-50 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                        aria-label="Disminuir peso"
                      >
                        <Minus className="w-4 h-4" />
                      </button>

                      {/* Slider Input with soft custom track styling */}
                      <input 
                        type="range"
                        min="1"
                        max="40"
                        step="1"
                        value={packageWeight}
                        onChange={(e) => setPackageWeight(Number(e.target.value))}
                        className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-egyptian-blue"
                      />

                      {/* Increment Button */}
                      <button 
                        type="button"
                        onClick={() => setPackageWeight(prev => Math.min(40, prev + 1))}
                        className="w-8 h-8 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-gray-600 hover:text-egyptian-blue hover:bg-slate-50 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                        aria-label="Aumentar peso"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Weight class badges and notes */}
                    <div className="text-center">
                      <span className="text-[11px] font-medium font-inter text-gray-600 inline-block bg-white border border-slate-100 px-3 py-1 rounded-full shadow-sm">
                        {packageWeight <= 2 && "✉️ Ligero (Documentos, sobres, paquetes chicos)"}
                        {packageWeight > 2 && packageWeight <= 5 && "📦 Mediano (Calzado, ropa, cajas chicas)"}
                        {packageWeight > 5 && packageWeight <= 10 && "💼 Pesado (Cajas medianas, repuestos)"}
                        {packageWeight > 10 && packageWeight <= 25 && "🏋️ Muy Pesado (Cajas grandes, mercadería)"}
                        {packageWeight > 25 && "🚚 Carga Especial (Requiere furgón de carga obligatoriamente)"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Vehicle Selection */}
                <div>
                  <label className="block text-xs font-bebas tracking-wider text-gray-600 uppercase mb-1">
                    Vehículo Requerido
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      type="button"
                      onClick={() => setVehicle('moto')}
                      className={`p-2.5 border-2 flex items-center justify-center gap-2 font-bebas text-sm tracking-wider transition-all cursor-pointer ${
                        vehicle === 'moto' 
                          ? 'bg-egyptian-blue text-white border-egyptian-blue shadow-brutal-dark' 
                          : 'bg-white text-gray-700 border-gray-300 hover:border-egyptian-blue'
                      }`}
                    >
                      <Bike className="w-4 h-4" /> MOTO EXPRESS
                    </button>
                    <button 
                      type="button"
                      onClick={() => setVehicle('furgon')}
                      className={`p-2.5 border-2 flex items-center justify-center gap-2 font-bebas text-sm tracking-wider transition-all cursor-pointer ${
                        vehicle === 'furgon' 
                          ? 'bg-egyptian-blue text-white border-egyptian-blue shadow-brutal-dark' 
                          : 'bg-white text-gray-700 border-gray-300 hover:border-egyptian-blue'
                      }`}
                    >
                      <Truck className="w-4 h-4" /> FURGÓN DE CARGA
                    </button>
                  </div>
                </div>

                {/* Service type Selection */}
                <div>
                  <label className="block text-xs font-bebas tracking-wider text-gray-600 uppercase mb-1">
                    Tipo de Servicio / Prioridad
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button 
                      type="button"
                      onClick={() => setServiceType('express')}
                      className={`py-2.5 px-1 border-2 text-center flex flex-col items-center justify-center font-bebas text-xs tracking-wider transition-all cursor-pointer ${
                        serviceType === 'express' 
                          ? 'bg-sunbeam-yellow text-egyptian-blue border-egyptian-blue font-bold shadow-brutal' 
                          : 'bg-white text-gray-700 border-gray-300 hover:border-egyptian-blue'
                      }`}
                    >
                      <Zap className="w-3.5 h-3.5 mb-1 text-yellow-600 fill-yellow-400" /> EXPRESS
                    </button>
                    <button 
                      type="button"
                      onClick={() => setServiceType('lowcost')}
                      className={`py-2.5 px-1 border-2 text-center flex flex-col items-center justify-center font-bebas text-xs tracking-wider transition-all cursor-pointer ${
                        serviceType === 'lowcost' 
                          ? 'bg-sunbeam-yellow text-egyptian-blue border-egyptian-blue font-bold shadow-brutal' 
                          : 'bg-white text-gray-700 border-gray-300 hover:border-egyptian-blue'
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5 mb-1 text-blue-600" /> LOWCOST
                    </button>
                    <button 
                      type="button"
                      onClick={() => setServiceType('flex')}
                      className={`py-2.5 px-1 border-2 text-center flex flex-col items-center justify-center font-bebas text-xs tracking-wider transition-all cursor-pointer ${
                        serviceType === 'flex' 
                          ? 'bg-sunbeam-yellow text-egyptian-blue border-egyptian-blue font-bold shadow-brutal' 
                          : 'bg-white text-gray-700 border-gray-300 hover:border-egyptian-blue'
                      }`}
                    >
                      <Package className="w-3.5 h-3.5 mb-1 text-green-600" /> FLEX MELI
                    </button>
                  </div>
                </div>

              </div>

              {/* Calculation output summary box (Hybrid Neo-Brutalist + Soft UI Highlight) */}
              <div className="bg-egyptian-blue text-white p-4.5 mt-6 border-2 border-egyptian-blue shadow-brutal-dark flex items-center justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-xl pointer-events-none"></div>
                <div>
                  <span className="block text-[10px] font-bebas tracking-widest text-sunbeam-yellow uppercase">TARIFA ESTIMADA sugerida</span>
                  <span className="font-anton text-4xl leading-none flex items-baseline gap-0.5">
                    ${calculatedPrice}
                    <span className="text-xs font-mono text-sunbeam-yellow/80 font-normal">.00</span>
                  </span>
                </div>
                <div className="text-right z-10">
                  <span className="block text-[10px] font-bebas tracking-widest text-sunbeam-yellow uppercase">TIEMPO ESTIMADO</span>
                  <span className="font-bebas text-lg leading-none block mt-1 text-white bg-white/10 px-2 py-1 border border-white/10 rounded-md">
                    {estimatedTime}
                  </span>
                </div>
              </div>

              {/* Direct Link to Whatsapp - Soft UI Tactile Feel inside Brutalist borders */}
              <button 
                type="button"
                onClick={handleWhatsAppQuote}
                className="w-full mt-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bebas text-xl tracking-wider py-4 rounded-xl border-2 border-egyptian-blue shadow-[4px_4px_0px_0px_#1e3a8a] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex items-center justify-center gap-3 cursor-pointer"
              >
                <Smartphone className="w-5 h-5 fill-white" />
                COTIZÁ Y ENVIÁ POR WHATSAPP
              </button>

              <p className="text-[10px] text-gray-500 text-center mt-3 font-mono">
                *Cálculo sugerido sujeto a dimensiones de bultos y rutas vigentes en Mar del Plata.
              </p>

            </div>

          </div>

        </div>
      </section>

      {/* 7. SECTION 5: Guía de Precios (Alternate Background - White) */}
      <section id="tarifas" className="py-20 bg-white text-gray-900 border-b-4 border-egyptian-blue relative z-10 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            
            <span className="font-bebas text-sm bg-egyptian-blue text-sunbeam-yellow px-3 py-1.5 uppercase tracking-widest">
              COSTOS TRANSPARENTES
            </span>

            <h2 className="font-anton text-4xl md:text-6xl text-egyptian-blue uppercase leading-none tracking-wide">
              Guía de Precios
            </h2>

            <p className="text-gray-600 font-inter text-md">
              Elegí el plan óptimo para escalar tu negocio en Mar del Plata. Costos fijos simplificados en base anual.
            </p>

          </div>

          {/* Pricing Grid matching requested details exactly */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            
            {/* 1. Estándar */}
            <div className="bg-white border-4 border-egyptian-blue p-8 rounded-none shadow-brutal flex flex-col justify-between">
              <div className="space-y-6">
                <div>
                  <h3 className="font-bebas text-2xl text-gray-500 tracking-wide uppercase leading-none mb-1">
                    Estándar
                  </h3>
                  <div className="flex items-baseline gap-1 pt-1">
                    <span className="font-anton text-4xl text-egyptian-blue">U$S 64</span>
                    <span className="text-sm font-mono text-gray-500">/ mes</span>
                  </div>
                  <span className="text-xs font-mono text-gray-400 block mt-1">Facturado de forma anual</span>
                </div>

                <div className="h-0.5 bg-gray-100 w-full"></div>

                <ul className="space-y-3 font-inter text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 font-bold shrink-0">&bull;</span>
                    <span>Envíos urbanos ocasionales</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 font-bold shrink-0">&bull;</span>
                    <span>Seguimiento de entregas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 font-bold shrink-0">&bull;</span>
                    <span>Soporte telefónico estándar</span>
                  </li>
                </ul>
              </div>

              <div className="pt-8">
                <a 
                  href="https://enviosoficialpruebas.vercel.app/cotizar/express"
                  className="w-full text-center bg-white hover:bg-gray-50 text-egyptian-blue border-2 border-egyptian-blue font-bebas text-lg py-3 rounded-none inline-block tracking-wider"
                >
                  Registrarme Gratis
                </a>
              </div>
            </div>

            {/* 2. Premium (Flex) */}
            <div className="bg-white border-4 border-egyptian-blue p-8 rounded-none shadow-brutal-yellow relative flex flex-col justify-between">
              
              <div className="absolute -top-4 right-6 bg-sunbeam-yellow text-egyptian-blue border-2 border-egyptian-blue font-bebas text-xs px-3 py-1 uppercase tracking-widest font-bold shadow-brutal-dark">
                Más Buscado
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-bebas text-2xl text-egyptian-blue tracking-wide uppercase leading-none mb-1">
                    Premium (Flex)
                  </h3>
                  <div className="flex items-baseline gap-1 pt-1">
                    <span className="font-anton text-4xl text-egyptian-blue">U$S 54</span>
                    <span className="text-sm font-mono text-gray-500">/ mes</span>
                  </div>
                  <span className="text-xs font-mono text-gray-400 block mt-1">Facturado de forma anual</span>
                </div>

                <div className="h-0.5 bg-gray-100 w-full"></div>

                <ul className="space-y-3 font-inter text-sm text-gray-700 font-semibold">
                  <li className="flex items-start gap-2">
                    <span className="text-egyptian-blue font-bold shrink-0">&bull;</span>
                    <span>Prioridad MercadoLibre Flex</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-egyptian-blue font-bold shrink-0">&bull;</span>
                    <span>Entregas Same-Day en Mar del Plata</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-egyptian-blue font-bold shrink-0">&bull;</span>
                    <span>Integración de catálogo API</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-egyptian-blue font-bold shrink-0">&bull;</span>
                    <span>Soporte dedicado por WhatsApp</span>
                  </li>
                </ul>
              </div>

              <div className="pt-8">
                <a 
                  href="https://enviosoficialpruebas.vercel.app/servicios/enviosflex"
                  className="w-full text-center bg-sunbeam-yellow hover:bg-egyptian-blue hover:text-white text-egyptian-blue border-2 border-egyptian-blue font-bebas text-lg py-3 rounded-none inline-block tracking-wider shadow-brutal"
                >
                  Probar Plan Premium
                </a>
              </div>
            </div>

            {/* 3. Corporativo */}
            <div className="bg-white border-4 border-egyptian-blue p-8 rounded-none shadow-brutal flex flex-col justify-between">
              <div className="space-y-6">
                <div>
                  <h3 className="font-bebas text-2xl text-gray-500 tracking-wide uppercase leading-none mb-1">
                    Corporativo
                  </h3>
                  <div className="flex items-baseline gap-1 pt-1">
                    <span className="font-anton text-4xl text-egyptian-blue">U$S 143</span>
                    <span className="text-sm font-mono text-gray-500">/ mes</span>
                  </div>
                  <span className="text-xs font-mono text-gray-400 block mt-1">Facturado de forma anual</span>
                </div>

                <div className="h-0.5 bg-gray-100 w-full"></div>

                <ul className="space-y-3 font-inter text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 font-bold shrink-0">&bull;</span>
                    <span>Distribución masiva por lotes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 font-bold shrink-0">&bull;</span>
                    <span>Cuentas corrientes corporativas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 font-bold shrink-0">&bull;</span>
                    <span>Ruteo logístico avanzado (3PL)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 font-bold shrink-0">&bull;</span>
                    <span>Asesor de cuenta exclusivo</span>
                  </li>
                </ul>
              </div>

              <div className="pt-8">
                <a 
                  href="https://enviosoficialpruebas.vercel.app/servicios/plan-emprendedores"
                  className="w-full text-center bg-white hover:bg-gray-50 text-egyptian-blue border-2 border-egyptian-blue font-bebas text-lg py-3 rounded-none inline-block tracking-wider"
                >
                  Registrarme Gratis
                </a>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 8. SECTION 6: Comunidad / Redes Sociales (Alternate Background - Blue) */}
      <section id="comunidad" className="py-20 bg-blue-100 text-egyptian-blue border-b-4 border-sunbeam-yellow border-y border-blue-200/60 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            
            <span className="font-bebas text-sm bg-sunbeam-yellow text-egyptian-blue px-3.5 py-1.5 border border-egyptian-blue tracking-wider uppercase inline-block">
              CONECTA CON NOSOTROS
            </span>

            <h2 className="font-anton text-4xl md:text-6xl text-egyptian-blue uppercase leading-none tracking-wide">
              SIGUE NUESTRO MOVIMIENTO
            </h2>

            <p className="text-gray-700 font-inter text-md">
              Únete a nuestra comunidad digital y mantente al día con las últimas noticias de logística en Mar del Plata.
            </p>

            {/* Requested list of communication channels */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2 font-bebas text-lg">
              <a 
                href="https://instagram.com/enviosdosruedas" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-white hover:bg-sunbeam-yellow hover:text-egyptian-blue border border-egyptian-blue/30 px-4 py-1.5 transition-colors text-egyptian-blue"
              >
                Instagram: Novedades diarias
              </a>
              <a 
                href="https://facebook.com/enviosdosruedas" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-white hover:bg-sunbeam-yellow hover:text-egyptian-blue border border-egyptian-blue/30 px-4 py-1.5 transition-colors text-egyptian-blue"
              >
                Facebook: Comunidad activa
              </a>
              <a 
                href="https://wa.me/5492236602699?text=Hola%2C%20me%20gustar%C3%ADa%20obtener%20informaci%C3%B3n%20sobre%20sus%20servicios%20de%20env%C3%ADo."
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-1.5 transition-colors"
              >
                WhatsApp: Atención inmediata
              </a>
            </div>

          </div>

          {/* Social Post Cards Horizontal Scrolling / Grid container */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            
            {/* Post 1 */}
            <div className="bg-white border-4 border-egyptian-blue text-gray-900 rounded-none shadow-brutal overflow-hidden flex flex-col justify-between">
              <div className="aspect-square relative overflow-hidden bg-gray-100 border-b-2 border-egyptian-blue">
                <Image 
                  src="https://enviosoficialpruebas.vercel.app/redes/fac1.webp"
                  alt="Publicación de Facebook"
                  fill
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-4 bg-gray-50 flex items-center justify-between">
                <span className="font-bebas text-sm text-gray-500">Facebook Post</span>
                <a 
                  href="https://www.facebook.com/enviosdosruedas/posts/pfbid0a1i4tygsZQjwp9bsvS9xSHApJqMe5JkeoJbqx12Qvas18nSojtGhj6U9cFn3m5hDl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-egyptian-blue hover:bg-sunbeam-yellow text-white hover:text-egyptian-blue font-bebas text-xs px-2.5 py-1 border border-egyptian-blue transition-colors"
                >
                  VER POST
                </a>
              </div>
            </div>

            {/* Post 2 */}
            <div className="bg-white border-4 border-egyptian-blue text-gray-900 rounded-none shadow-brutal overflow-hidden flex flex-col justify-between">
              <div className="aspect-square relative overflow-hidden bg-gray-100 border-b-2 border-egyptian-blue">
                <Image 
                  src="https://enviosoficialpruebas.vercel.app/redes/ig1.webp"
                  alt="Publicación de Instagram"
                  fill
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-4 bg-gray-50 flex items-center justify-between">
                <span className="font-bebas text-sm text-gray-500">Instagram Post</span>
                <a 
                  href="https://www.instagram.com/enviosdosruedas/p/DJhlS5xOrTb/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-egyptian-blue hover:bg-sunbeam-yellow text-white hover:text-egyptian-blue font-bebas text-xs px-2.5 py-1 border border-egyptian-blue transition-colors"
                >
                  VER POST
                </a>
              </div>
            </div>

            {/* Post 3 */}
            <div className="bg-white border-4 border-egyptian-blue text-gray-900 rounded-none shadow-brutal overflow-hidden flex flex-col justify-between">
              <div className="aspect-square relative overflow-hidden bg-gray-100 border-b-2 border-egyptian-blue">
                <Image 
                  src="https://enviosoficialpruebas.vercel.app/redes/ig3.webp"
                  alt="Publicación de Instagram"
                  fill
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-4 bg-gray-50 flex items-center justify-between">
                <span className="font-bebas text-sm text-gray-500">Instagram Post</span>
                <a 
                  href="https://www.instagram.com/enviosdosruedas/p/DK12WIDslKW/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-egyptian-blue hover:bg-sunbeam-yellow text-white hover:text-egyptian-blue font-bebas text-xs px-2.5 py-1 border border-egyptian-blue transition-colors"
                >
                  VER POST
                </a>
              </div>
            </div>

            {/* Post 4 */}
            <div className="bg-white border-4 border-egyptian-blue text-gray-900 rounded-none shadow-brutal overflow-hidden flex flex-col justify-between">
              <div className="aspect-square relative overflow-hidden bg-gray-100 border-b-2 border-egyptian-blue">
                <Image 
                  src="https://enviosoficialpruebas.vercel.app/redes/ig4.webp"
                  alt="Publicación de Instagram"
                  fill
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-4 bg-gray-50 flex items-center justify-between">
                <span className="font-bebas text-sm text-gray-500">Instagram Post</span>
                <a 
                  href="https://www.instagram.com/enviosdosruedas/p/DEaAGAmRMKj/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-egyptian-blue hover:bg-sunbeam-yellow text-white hover:text-egyptian-blue font-bebas text-xs px-2.5 py-1 border border-egyptian-blue transition-colors"
                >
                  VER POST
                </a>
              </div>
            </div>

            {/* Post 5 */}
            <div className="bg-white border-4 border-egyptian-blue text-gray-900 rounded-none shadow-brutal overflow-hidden flex flex-col justify-between">
              <div className="aspect-square relative overflow-hidden bg-gray-100 border-b-2 border-egyptian-blue">
                <Image 
                  src="https://enviosoficialpruebas.vercel.app/redes/fac2.webp"
                  alt="Publicación de Facebook"
                  fill
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-4 bg-gray-50 flex items-center justify-between">
                <span className="font-bebas text-sm text-gray-500">Facebook Post</span>
                <a 
                  href="https://www.facebook.com/enviosdosruedas/posts/pfbid03WPv5ZE93ZNwL5PMRwuTpJxGaGSBzLigJqDSyzATNcSkRT3xBMZz7GKbhPv1mC53l"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-egyptian-blue hover:bg-sunbeam-yellow text-white hover:text-egyptian-blue font-bebas text-xs px-2.5 py-1 border border-egyptian-blue transition-colors"
                >
                  VER POST
                </a>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 9. FOOTER (Pie de página - Blue Background Design) */}
      <footer className="bg-egyptian-blue text-white border-t-4 border-sunbeam-yellow pt-16 pb-8 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-12 border-b border-white/10">
            
            {/* Column 1: Brand details and physical address */}
            <div className="md:col-span-5 space-y-6">
              
              <a href="https://enviosoficialpruebas.vercel.app/" className="flex items-center gap-3 group">
                <div className="relative w-12 h-12 bg-sunbeam-yellow border-2 border-white p-1 rounded-none shadow-brutal flex items-center justify-center transform group-hover:rotate-3 transition-transform">
                  <Image 
                    src="https://enviosoficialpruebas.vercel.app/_next/image?url=%2FLogoEnviosDosRuedas.webp&w=3840&q=75"
                    alt="Logo Dos Ruedas"
                    width={48}
                    height={48}
                    className="object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <span className="font-anton text-xl tracking-wider text-white block leading-none">
                    EnvíosDosRuedas
                  </span>
                  <span className="font-bebas text-xs tracking-widest text-sunbeam-yellow block mt-0.5">
                    Tu solución confiable.
                  </span>
                </div>
              </a>

              <p className="text-sm text-gray-200 font-inter leading-relaxed max-w-sm">
                Logística humana y eficiente para Mar del Plata. Tus ventas en las mejores manos: conectamos tu negocio con toda la ciudad.
              </p>

              {/* Social SVGs Icons Row */}
              <div className="flex items-center gap-4">
                <a 
                  href="https://instagram.com/enviosdosruedas" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white hover:bg-sunbeam-yellow border border-egyptian-blue flex items-center justify-center transition-colors"
                >
                  <Image 
                    src="https://enviosoficialpruebas.vercel.app/icons/instagram.svg" 
                    alt="Instagram Icon" 
                    width={20} 
                    height={20} 
                    referrerPolicy="no-referrer"
                  />
                </a>
                <a 
                  href="https://facebook.com/enviosdosruedas" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white hover:bg-sunbeam-yellow border border-egyptian-blue flex items-center justify-center transition-colors"
                >
                  <Image 
                    src="https://enviosoficialpruebas.vercel.app/icons/facebook.svg" 
                    alt="Facebook Icon" 
                    width={20} 
                    height={20} 
                    referrerPolicy="no-referrer"
                  />
                </a>
                <a 
                  href="https://wa.me/542236602699" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white hover:bg-sunbeam-yellow border border-egyptian-blue flex items-center justify-center transition-colors"
                >
                  <Image 
                    src="https://enviosoficialpruebas.vercel.app/icons/whatsapp.svg" 
                    alt="WhatsApp Icon" 
                    width={20} 
                    height={20} 
                    referrerPolicy="no-referrer"
                  />
                </a>
                <div className="w-10 h-10 bg-white border border-egyptian-blue flex items-center justify-center">
                  <Image 
                    src="https://enviosoficialpruebas.vercel.app/icons/google.svg" 
                    alt="Google Icon" 
                    width={20} 
                    height={20} 
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>

            </div>

            {/* Column 2: Nosotros Column Links */}
            <div className="md:col-span-2 space-y-4">
              <h4 className="font-bebas text-lg text-sunbeam-yellow tracking-wider">
                Nosotros
              </h4>
              <ul className="space-y-2 text-sm text-gray-200 font-inter">
                <li>
                  <a href="https://enviosoficialpruebas.vercel.app/nosotros/sobre-nosotros" className="hover:text-sunbeam-yellow transition-colors">
                    Sobre Nosotros
                  </a>
                </li>
                <li>
                  <a href="https://enviosoficialpruebas.vercel.app/nosotros/preguntas-frecuentes" className="hover:text-sunbeam-yellow transition-colors">
                    Preguntas Frecuentes
                  </a>
                </li>
                <li>
                  <a href="https://enviosoficialpruebas.vercel.app/nosotros/nuestras-redes" className="hover:text-sunbeam-yellow transition-colors">
                    Nuestras Redes
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3: Servicios Column Links */}
            <div className="md:col-span-2 space-y-4">
              <h4 className="font-bebas text-lg text-sunbeam-yellow tracking-wider">
                Servicios
              </h4>
              <ul className="space-y-2 text-sm text-gray-200 font-inter">
                <li>
                  <a href="https://enviosoficialpruebas.vercel.app/servicios/envios-express" className="hover:text-sunbeam-yellow transition-colors">
                    Envíos Express
                  </a>
                </li>
                <li>
                  <a href="https://enviosoficialpruebas.vercel.app/servicios/envios-lowcost" className="hover:text-sunbeam-yellow transition-colors">
                    Envíos LowCost
                  </a>
                </li>
                <li>
                  <a href="https://enviosoficialpruebas.vercel.app/servicios/enviosflex" className="hover:text-sunbeam-yellow transition-colors">
                    Envíos Flex (MeLi)
                  </a>
                </li>
                <li>
                  <a href="https://enviosoficialpruebas.vercel.app/servicios/plan-emprendedores" className="hover:text-sunbeam-yellow transition-colors">
                    E-Commerce & 3PL
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 4: Contacto Rápido */}
            <div className="md:col-span-3 space-y-4">
              <h4 className="font-bebas text-lg text-sunbeam-yellow tracking-wider">
                Contacto Rápido
              </h4>
              <ul className="space-y-3.5 text-sm text-gray-200 font-inter">
                <li className="flex gap-2 items-start">
                  <MapPin className="w-4 h-4 text-sunbeam-yellow shrink-0 mt-0.5" />
                  <span>
                    <strong className="block text-white text-xs uppercase font-mono">Ubicación</strong>
                    Friuli 1972, Mar del Plata
                  </span>
                </li>
                <li className="flex gap-2 items-start">
                  <Smartphone className="w-4 h-4 text-sunbeam-yellow shrink-0 mt-0.5" />
                  <span>
                    <strong className="block text-white text-xs uppercase font-mono">Teléfono</strong>
                    <a href="tel:+542236602699" className="hover:text-sunbeam-yellow transition-colors font-mono">
                      +54 223 660-2699
                    </a>
                  </span>
                </li>
                <li className="flex gap-2 items-start">
                  <FileText className="w-4 h-4 text-sunbeam-yellow shrink-0 mt-0.5" />
                  <span>
                    <strong className="block text-white text-xs uppercase font-mono">Email</strong>
                    <a href="mailto:matiascejas@enviosdosruedas.com" className="hover:text-sunbeam-yellow transition-colors font-mono break-all">
                      matiascejas@enviosdosruedas.com
                    </a>
                  </span>
                </li>
              </ul>
            </div>

          </div>

          {/* Core capacity badges above copyright bar */}
          <div className="py-6 flex flex-wrap gap-4 items-center justify-center border-b border-white/10 text-[10px] font-mono tracking-widest uppercase text-gray-400">
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-sunbeam-yellow" /> SEGURIDAD CERTIFICADA</span>
            <span>&bull;</span>
            <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-sunbeam-yellow" /> VELOCIDAD MÁXIMA</span>
            <span>&bull;</span>
            <span className="flex items-center gap-1.5"><Compass className="w-3.5 h-3.5 text-sunbeam-yellow" /> COBERTURA DISTRITAL</span>
            <span>&bull;</span>
            <span className="flex items-center gap-1.5"><Activity className="w-3.5 h-3.5 text-green-400 animate-pulse" /> STATUS ONLINE</span>
          </div>

          {/* Footer bottom bar */}
          <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-gray-400 font-mono gap-4">
            <div>
              (C) 2026 Envíos DosRuedas. Todos los derechos reservados.
            </div>
            <div className="flex gap-4">
              <a href="https://enviosoficialpruebas.vercel.app/politica-de-privacidad" className="hover:text-sunbeam-yellow transition-colors">
                Privacidad
              </a>
              <a href="https://enviosoficialpruebas.vercel.app/terminos-y-condiciones" className="hover:text-sunbeam-yellow transition-colors">
                Términos
              </a>
              {/* Internal request review feedback link with tooltip/title requested */}
              <a 
                href="https://wa.me/542236602699?text=Hola!%20Gracias%20por%20elegir%20Env%C3%ADos%20DosRuedas.%20%C2%BFPodr%C3%ADas%20dedicarnos%20un%20minuto%20para%20dejarnos%20una%20rese%C3%B1a%20de%205%20estrellas%20en%20Google%3F%20Nos%20ayuda%20mucho%3A%20https%3A%2F%2Fg.page%2Fr%2Fhttps%3A%2F%2Fg.page%2Fr%2FYOUR_ID%2Freview%2Freview"
                title="Enviar solicitud de reseña (Uso Interno)"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-sunbeam-yellow transition-colors underline decoration-dotted"
              >
                Feedback
              </a>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
