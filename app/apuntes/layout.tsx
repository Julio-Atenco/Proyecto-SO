import SidebarNav from "@/components/Navbar_Apuntes";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-bg text-text-base font-sans min-h-screen flex flex-col">
        <div className="flex flex-1">
          {/* Sidebar izquierda */}
          <SidebarNav />
          {/* Contenido */}
          <main className="flex-1 p-6 md:p-10">{children}</main>
        </div>
      </body>
    </html>
  );
}
