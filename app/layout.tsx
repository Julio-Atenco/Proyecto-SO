// app/layout.tsx
import React from "react";
import "./globals.css";
import Nav from "@/components/Nav";   // importa tu nuevo navbar
import Footer from "@/components/Footer"; // si quieres mantener el footer

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="flex flex-col min-h-screen bg-[var(--color-bg)] text-[var(--color-text-base)] font-sans">
        {/* Navbar superior */}
        <Nav />

        {/* Contenido principal */}
        <main className="flex-1 p-6 grid-bg">
          {children}
        </main>

        {/* Footer opcional */}
        <Footer />
      </body>
    </html>
  );
}
