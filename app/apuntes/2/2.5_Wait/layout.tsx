import Link from "next/link";

export default function WaitLayout({
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
          <span className="text-primary">2.5 wait()</span>
        </div>

        <h1 className="text-2xl font-bold text-text-base mb-2">
          2.5 Sistema de llamada wait()
        </h1>
        <p className="text-text-dim text-sm leading-relaxed max-w-2xl">
          La llamada al sistema <code className="font-mono text-xs bg-surf-high text-secondary px-1.5 py-0.5 rounded">wait()</code> permite
          que un proceso padre espere a que uno de sus hijos termine, evitando procesos
          zombi y recogiendo el estado de salida del hijo.
        </p>

        <div className="flex flex-wrap gap-2 mt-4">
          <Link
            href="/apuntes/2/2.5_Wait"
            className="text-xs px-3 py-1.5 rounded border border-border text-text-dim hover:border-primary hover:text-primary transition-colors font-mono"
          >
            wait()
          </Link>
          <Link
            href="/apuntes/2/2.5_Wait/2.5.1_Waitpid"
            className="text-xs px-3 py-1.5 rounded border border-border text-text-dim hover:border-secondary hover:text-secondary transition-colors font-mono"
          >
            2.5.1 waitpid()
          </Link>
        </div>
      </div>

      {children}
    </div>
  );
}
