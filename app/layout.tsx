import type {Metadata} from 'next';
import { Inter, Anton, Bebas_Neue } from 'next/font/google';
import './globals.css'; // Global styles

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const anton = Anton({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-anton',
  display: 'swap',
});

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Envíos DosRuedas - Logística de Última Milla en Mar del Plata',
  description: 'Distribución y mensajería ultrarrápida en el día dentro de Mar del Plata. El socio estratégico ideal para tiendas online, pymes y MercadoLibre Flex.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="es" className={`${inter.variable} ${anton.variable} ${bebasNeue.variable} scroll-smooth`}>
      <body className="font-inter bg-white text-gray-900 antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}

