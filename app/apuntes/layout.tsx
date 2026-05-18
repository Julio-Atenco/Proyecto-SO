import SidebarNav from "@/components/Navbar_Apuntes";

export default function ApuntesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 h-[calc(100vh-4rem)] overflow-hidden">
      {/* Sidebar: oculto en móvil, visible desde md */}
      <aside className="hidden md:flex md:shrink-0">
        <SidebarNav />
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 overflow-y-auto">
        {/* Banda superior sutil que da contexto */}
        <div className="sticky top-0 z-10 hidden md:flex items-center gap-2 px-6 py-2 bg-bg/80 backdrop-blur border-b border-border text-xs text-text-dim font-mono">
          <span className="text-primary">~/apuntes</span>
          <span className="text-surf-high select-none">·</span>
          <span>BitácoraSO</span>
        </div>

        <div className="px-6 py-8 md:px-10 md:py-10 max-w-4xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}