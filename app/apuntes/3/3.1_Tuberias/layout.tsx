import Link from "next/link";

/* Este layout se aplica automáticamente a:
   - /apuntes/3/3.1_Tuberias          (page.tsx propio)
   - /apuntes/3/3.1_Tuberias/3.1.1_Pipe
   - /apuntes/3/3.1_Tuberias/3.1.2_Fifo
   Sin reescribir el encabezado en cada uno. */

export default function TuberiasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Encabezado de sección — aparece en todas las sub-páginas */}
      <div className="border-b border-border pb-6 mb-8">
        <div className="font-mono text-xs text-muted mb-3 flex items-center gap-1.5">
          <Link href="/apuntes/3" className="hover:text-primary transition-colors">
            3. Mecanismos IPC
          </Link>
          <span className="material-symbols-outlined" style={{ fontSize: 13 }}>
            chevron_right
          </span>
          <span className="text-primary">3.1 Tuberías</span>
        </div>

        <h1 className="text-2xl font-bold text-text-base mb-2">
          3.1 Comunicación mediante Tuberías
        </h1>
        <p className="text-text-dim text-sm leading-relaxed max-w-2xl">
          Las tuberías (<em>pipes</em>) son el mecanismo IPC más simple de Unix/Linux.
          Permiten la comunicación unidireccional entre procesos relacionados mediante
          un buffer en el kernel.
        </p>

        {/* Sub-navegación */}
        <div className="flex flex-wrap gap-2 mt-4">
          <Link
            href="/apuntes/3/3.1_Tuberias"
            className="text-xs px-3 py-1.5 rounded border border-border text-text-dim hover:border-primary hover:text-primary transition-colors font-mono"
          >
            Visión general
          </Link>
          <Link
            href="/apuntes/3/3.1_Tuberias/3.1.1_Pipe"
            className="text-xs px-3 py-1.5 rounded border border-border text-text-dim hover:border-secondary hover:text-secondary transition-colors font-mono"
          >
            3.1.1 pipe()
          </Link>
          <Link
            href="/apuntes/3/3.1_Tuberias/3.1.2_Fifo"
            className="text-xs px-3 py-1.5 rounded border border-border text-text-dim hover:border-secondary hover:text-secondary transition-colors font-mono"
          >
            3.1.2 fifo
          </Link>
        </div>
      </div>

      {/* Contenido de la sub-página */}
      {children}
    </div>
  );
}
