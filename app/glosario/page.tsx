import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Glosario | BitácoraSO",
  description: "Glosario de términos de Sistemas Operativos — UTM.",
};

/* ─── Tipos ─────────────────────────────────────────────── */
interface Termino {
  nombre:  string;
  tipo:    string;
  color:   "primary" | "secondary" | "tertiary" | "danger";
  def:     string;
  extra?:  React.ReactNode;
}

interface Seccion {
  letra: string;
  terminos: Termino[];
}

/* ─── Datos ─────────────────────────────────────────────── */
const secciones: Seccion[] = [
  {
    letra: "C",
    terminos: [
      {
        nombre: "Cambio de Contexto",
        tipo:   "Gestión de Procesos",
        color:  "secondary",
        def:    "Proceso mediante el cual el kernel guarda el estado del proceso actual (registros, contador de programa, etc.) y carga el estado de otro proceso para continuar su ejecución. Es la base del multitarea.",
      },
      {
        nombre: "Condición de Carrera",
        tipo:   "Concurrencia",
        color:  "danger",
        def:    "Situación en la que el resultado de la ejecución depende del orden o la sincronización de los procesos/hilos. Produce comportamientos no deterministas y errores difíciles de reproducir.",
      },
    ],
  },
  {
    letra: "D",
    terminos: [
      {
        nombre: "Deadlock (Interbloqueo)",
        tipo:   "Concepto Crítico",
        color:  "danger",
        def:    "Estado en el que cada proceso de un grupo espera que otro proceso del mismo grupo libere un recurso. Se describe mediante las Condiciones de Coffman: Exclusión Mutua, Retención y Espera, Sin Apropiación y Espera Circular.",
        extra: (
          <div className="bg-surf-low border-l-4 border-danger rounded p-4 flex items-center gap-6 mt-4">
            <div className="flex-1">
              <p className="font-mono text-[11px] text-danger uppercase tracking-widest mb-2">Lógica Visual</p>
              <div className="flex items-center gap-3 text-muted font-mono text-sm">
                <div className="w-10 h-10 border border-border rounded flex items-center justify-center">P1</div>
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>sync_alt</span>
                <div className="w-10 h-10 border border-border rounded flex items-center justify-center">P2</div>
              </div>
            </div>
            <span className="material-symbols-outlined text-danger opacity-50" style={{ fontSize: 40 }}>block</span>
          </div>
        ),
      },
    ],
  },
  {
    letra: "H",
    terminos: [
      {
        nombre: "Hilo (Thread)",
        tipo:   "Gestión de Procesos",
        color:  "primary",
        def:    "Unidad básica de utilización del CPU. Comparte con otros hilos del mismo proceso el código, los datos y los recursos del SO, pero tiene su propio contador de programa, registros y pila de ejecución.",
      },
    ],
  },
  {
    letra: "K",
    terminos: [
      {
        nombre: "Kernel",
        tipo:   "Arquitectura Central",
        color:  "secondary",
        def:    "Módulo central del sistema operativo. Es la primera parte en cargarse y permanece en memoria principal. Responsable de la gestión de memoria, procesos y dispositivos de E/S.",
        extra: (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            {[
              { icon: "terminal",  color: "primary",   titulo: "Llamadas al Sistema", desc: "Interfaz entre el proceso y el kernel." },
              { icon: "security",  color: "secondary", titulo: "Nivel de Privilegio",  desc: "Opera en Ring 0 (Modo Kernel) con acceso total al hardware." },
            ].map(({ icon, color, titulo, desc }) => (
              <div key={titulo} className="bg-surf-high p-4 rounded border border-border">
                <div className={`flex items-center gap-2 mb-1 ${color === "primary" ? "text-primary" : "text-secondary"}`}>
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>{icon}</span>
                  <span className="font-mono text-xs">{titulo}</span>
                </div>
                <p className="text-text-dim text-xs">{desc}</p>
              </div>
            ))}
          </div>
        ),
      },
    ],
  },
  {
    letra: "P",
    terminos: [
      {
        nombre: "Paginación",
        tipo:   "Gestión de Memoria",
        color:  "tertiary",
        def:    "Mecanismo de almacenamiento que permite al SO recuperar procesos del almacenamiento secundario en forma de páginas. El espacio de direcciones lógicas de un proceso puede ser no contiguo.",
        extra: (
          <div className="bg-surf-low border border-border rounded p-4 font-mono text-xs mt-4">
            <div className="text-muted border-b border-border pb-2 mb-3 flex items-center justify-between">
              <span>Lógica de Traducción MMU</span>
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>memory</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between"><span className="text-primary">Dir. Virtual:</span><span className="text-text-dim">Nº Página | Desplazamiento</span></div>
              <div className="flex justify-center py-1"><span className="material-symbols-outlined text-tertiary" style={{ fontSize: 18 }}>arrow_downward</span></div>
              <div className="flex justify-between"><span className="text-secondary">Dir. Física:</span><span className="text-text-dim">Nº Marco  | Desplazamiento</span></div>
            </div>
          </div>
        ),
      },
      {
        nombre: "Proceso",
        tipo:   "Gestión de Procesos",
        color:  "primary",
        def:    "Programa en ejecución. Incluye el código del programa, la actividad actual representada por el valor del contador de programa y el contenido de los registros del procesador, así como la pila del proceso, los datos y el heap.",
      },
    ],
  },
  {
    letra: "S",
    terminos: [
      {
        nombre: "Semáforo",
        tipo:   "Control de Concurrencia",
        color:  "primary",
        def:    "Variable entera utilizada para señalización entre procesos. Solo se pueden realizar dos operaciones atómicas sobre él: wait() (P) y signal() (V). Resuelve problemas de sección crítica y sincronización.",
        extra: (
          <div className="flex items-center gap-3 mt-4">
            <div className="flex-1 h-2 bg-surf-top rounded-full overflow-hidden">
              <div className="h-full bg-secondary w-2/3 rounded-full" />
            </div>
            <span className="font-mono text-xs text-muted">Contador: 2/3</span>
          </div>
        ),
      },
    ],
  },
];

const letrasIndice = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
const letrasDisponibles = secciones.map((s) => s.letra);

const colorMap: Record<string, string> = {
  primary:   "bg-primary-c/15 text-primary",
  secondary: "bg-secondary/10 text-secondary",
  tertiary:  "bg-tertiary/10 text-tertiary",
  danger:    "bg-danger/10 text-danger",
};
const borderMap: Record<string, string> = {
  primary:   "text-primary",
  secondary: "text-secondary",
  tertiary:  "text-tertiary",
  danger:    "text-danger",
};

/* ─── Page ──────────────────────────────────────────────── */
export default function GlosarioPage() {
  return (
    <div className="flex">
      {/* Sidebar de navegación */}
      <aside className="hidden lg:flex fixed left-0 top-16 bottom-0 w-60 flex-col p-5 overflow-y-auto bg-surf-low border-r border-border">
        <div className="mb-6">
          <p className="font-bold text-primary font-mono text-sm mb-0.5">Glosario SO</p>
          <p className="text-muted text-xs">Términos por letra</p>
        </div>

        {/* Indice alfabético */}
        <div className="mb-6">
          <p className="font-mono text-[10px] text-muted uppercase tracking-widest mb-3">Índice</p>
          <div className="flex flex-wrap gap-1.5">
            {letrasIndice.map((letra) => {
              const activa = letrasDisponibles.includes(letra);
              return (
                <a
                  key={letra}
                  href={activa ? `#${letra}` : undefined}
                  className={`w-7 h-7 flex items-center justify-center rounded text-xs font-mono font-bold transition-colors ${
                    activa
                      ? "border border-border text-text-base hover:bg-primary hover:text-bg hover:border-primary cursor-pointer"
                      : "text-muted opacity-30 cursor-default"
                  }`}
                >
                  {letra}
                </a>
              );
            })}
          </div>
        </div>

        {/* Categorías */}
        <div>
          <p className="font-mono text-[10px] text-muted uppercase tracking-widest mb-3">Categorías</p>
          <div className="space-y-1 text-sm">
            {[
              { icon: "memory",    label: "Gestión de Procesos",  color: "primary"   },
              { icon: "storage",   label: "Gestión de Memoria",   color: "secondary" },
              { icon: "sync",      label: "Concurrencia",          color: "tertiary"  },
              { icon: "folder",    label: "Sistemas de Archivos",  color: "primary"   },
            ].map(({ icon, label, color }) => (
              <button
                key={label}
                className="flex items-center gap-2 text-text-dim hover:text-primary transition-colors w-full text-left py-1"
              >
                <span className={`material-symbols-outlined ${borderMap[color]}`} style={{ fontSize: 16 }}>{icon}</span>
                {label}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Contenido principal */}
      <main className="lg:ml-60 flex-1 px-6 md:px-14 py-12 max-w-4xl">
        {/* Header */}
        <div className="mb-10">
          <div className="font-mono text-xs text-muted mb-3 flex items-center gap-2">
            <span>Inicio</span>
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>chevron_right</span>
            <span className="text-primary">Glosario</span>
          </div>
          <h1 className="text-3xl font-bold text-text-base mb-2">Glosario de Sistemas Operativos</h1>
          <p className="text-text-dim text-sm">
            Definiciones clave de la materia, organizadas alfabéticamente.
          </p>
        </div>

        {/* Búsqueda */}
        <div className="flex gap-3 mb-10">
          <div className="flex-1 flex items-center gap-2 bg-surf-low border border-border rounded px-4 py-2.5 focus-within:border-primary transition-colors">
            <span className="material-symbols-outlined text-muted" style={{ fontSize: 18 }}>search</span>
            <input
              type="text"
              placeholder="Buscar término..."
              className="bg-transparent text-sm text-text-base placeholder:text-muted outline-none w-full"
            />
          </div>
        </div>

        {/* Secciones alfabéticas */}
        <div className="space-y-14">
          {secciones.map(({ letra, terminos }) => (
            <section key={letra} id={letra} className="scroll-mt-24">
              {/* Letra separadora */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-4xl font-bold text-primary font-mono">{letra}</span>
                <div className="h-px bg-border flex-1" />
              </div>

              <div className="space-y-5">
                {terminos.map(({ nombre, tipo, color, def, extra }) => (
                  <article
                    key={nombre}
                    className="p-6 bg-surf-low border border-border rounded-lg hover:border-primary transition-colors group"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                      <h3 className={`font-bold text-lg ${borderMap[color]} group-hover:opacity-80 transition-opacity`}>
                        {nombre}
                      </h3>
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-mono shrink-0 ${colorMap[color]}`}>
                        {tipo}
                      </span>
                    </div>
                    <p className="text-text-dim text-sm leading-relaxed">{def}</p>
                    {extra}
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* CTA contribuir */}
        <div className="mt-16 p-6 bg-surf-low border border-border rounded-lg text-center">
          <p className="text-text-dim text-sm mb-3">¿Falta algún término?</p>
          <a
            href="https://github.com/Julio-Atenco"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-primary text-sm hover:underline"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>add_circle</span>
            Sugerir término en GitHub
          </a>
        </div>
      </main>
    </div>
  );
}
