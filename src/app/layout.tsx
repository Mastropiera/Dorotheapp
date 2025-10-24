
import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AuthProvider } from "@/contexts/auth-context";
import { Toaster } from "@/components/ui/toaster";
import { Inter, Dancing_Script, Poppins } from "next/font/google";
import { GoogleApiProvider } from "@/contexts/google-api-context";

// Configuración de fuentes
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: '--font-inter',
});

const dancingScript = Dancing_Script({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-dancing-script',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  display: 'swap',
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: "Dorothea",
  description: "Tu asistente personal de salud y bienestar",
  // metadataBase: new URL("https://dorothea.lat"), // Comentado para evitar errores de compilación en entornos de previsualización
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <head>
        {/* Los scripts de Google ahora se cargan a través del componente <Script> de Next.js en GoogleApiProvider */}
      </head>
      <body className={cn(
        inter.variable, 
        dancingScript.variable, 
        poppins.variable,
        "font-body" // Usar 'body' como fuente por defecto si no es inter
      )}>
        <AuthProvider>
          <GoogleApiProvider>
              {children}
            <Toaster />
          </GoogleApiProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}
