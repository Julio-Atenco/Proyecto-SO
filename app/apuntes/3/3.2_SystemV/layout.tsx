import Link from "next/link";

export default function SystemVLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="border-b border-border pb-6 mb-8">
        <div className="font-mono text-xs text-muted mb-3 flex items-center gap-1.5">
          <Link href="/apuntes/3" className="hover:text-primary transition-colors">
            3. Mecanismos IPC
          </Link>
          <span className="material-symbols-outlined" style={{ fontSize: 13 }}>
            chevron_right
          </span>
          <span className="text-primary">3.2 IPC System V</span>
        </div>

        <h1 className="text-2xl font-bold text-text-base mb-2">
          3.2 Mecanismos IPC derivados de System V
        </h1>
        <p className="text-text-dim text-sm leading-relaxed max-w-2xl">
          Los mecanismos IPC de System V son un conjunto de primitivas de comunicación
          entre procesos introducidas en Unix System V. Incluyen semáforos, memoria
          compartida y colas de mensajes, identificados mediante llaves únicas.
        </p>

        <div className="flex flex-wrap gap-2 mt-4">
          <Link
            href="/apuntes/3/3.2_SystemV"
            className="text-xs px-3 py-1.5 rounded border border-border text-text-dim hover:border-primary hover:text-primary transition-colors font-mono"
          >
            Visión general
          </Link>
          <Link
            href="/apuntes/3/3.2_SystemV/3.2.1_Llaves"
            className="text-xs px-3 py-1.5 rounded border border-border text-text-dim hover:border-secondary hover:text-secondary transition-colors font-mono"
          >
            3.2.1 Llaves
          </Link>
          <Link
            href="/apuntes/3/3.2_SystemV/3.2.2_Semaforos"
            className="text-xs px-3 py-1.5 rounded border border-border text-text-dim hover:border-secondary hover:text-secondary transition-colors font-mono"
          >
            3.2.2 Semáforos
          </Link>
        </div>
      </div>

      {children}
    </div>
  );
}
