import Link from "next/link";

export default function HilosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="border-b border-border pb-6 mb-8">
        <div className="font-mono text-xs text-muted mb-3 flex items-center gap-1.5">
          <Link href="/apuntes/2" className="hover:text-primary transition-colors">
            2. Procesos e Hilos
          </Link>
          <span className="material-symbols-outlined" style={{ fontSize: 13 }}>
            chevron_right
          </span>
          <span className="text-primary">2.8 Hilos</span>
        </div>

        <h1 className="text-2xl font-bold text-text-base mb-2">
          2.8 Hilos (Threads)
        </h1>
        <p className="text-text-dim text-sm leading-relaxed max-w-2xl">
          Un hilo es la unidad básica de utilización del CPU. Comparte con los demás hilos
          del mismo proceso el código, los datos y los recursos del SO, pero tiene su propio
          contador de programa, registros y pila de ejecución.
        </p>

        <div className="flex flex-wrap gap-2 mt-4">
          <Link
            href="/apuntes/2/2.8_Hilos"
            className="text-xs px-3 py-1.5 rounded border border-border text-text-dim hover:border-primary hover:text-primary transition-colors font-mono"
          >
            Hilos — introducción
          </Link>
          <Link
            href="/apuntes/2/2.8_Hilos/2.8.2_Creacion_Hilos"
            className="text-xs px-3 py-1.5 rounded border border-border text-text-dim hover:border-secondary hover:text-secondary transition-colors font-mono"
          >
            2.8.2 Creación de hilos
          </Link>
        </div>
      </div>

      {children}
    </div>
  );
}
