import Link from "next/link";

/* ─── Datos ─────────────────────────────────────────────── */
const apuntesRecientes = [
  {
    id: "planificacion",
    tags: [
      { label: "Planificación", color: "primary" },
      { label: "Round Robin",   color: "secondary" },
    ],
    titulo: "Algoritmos de Planificación de CPU",
    desc:   "FCFS, SJF, Round Robin y Prioridad. Comparativa con diagramas de Gantt y análisis de tiempo de espera promedio.",
    fecha:  "Mar 2025",
    tipo:   "featured",
  },
  {
    id: "memoria",
    tags: [{ label: "Memoria", color: "secondary" }],
    titulo: "Paginación y Segmentación",
    desc:   "Gestión de memoria virtual: tablas de páginas, TLB y traducción de direcciones.",
    fecha:  "Mar 2025",
    tipo:   "side",
    accent: "secondary",
  },
  {
    id: "concurrencia",
    tags: [{ label: "Concurrencia", color: "tertiary" }],
    titulo: "Deadlock y Semáforos",
    desc:   "Condiciones de Coffman, prevención de interbloqueos y sincronización.",
    fecha:  "Abr 2025",
    tipo:   "side",
    accent: "tertiary",
  },
];

const temas = [
  { href: "/apuntes",   label: "Gestión de Procesos",  icon: "memory",       accent: "primary"   },
  { href: "/apuntes",   label: "Gestión de Memoria",   icon: "storage",      accent: "secondary" },
  { href: "/programas", label: "Concurrencia",          icon: "sync",         accent: "tertiary"  },
  { href: "/glosario",  label: "Sistemas de Archivos",  icon: "folder_open",  accent: "primary"   },
  { href: "/programas", label: "Llamadas al Sistema",   icon: "terminal",     accent: "secondary" },
  { href: "/apuntes",   label: "E/S y Drivers",         icon: "device_hub",   accent: "tertiary"  },
  { href: "/apuntes",   label: "Seguridad",             icon: "lock",         accent: "primary"   },
  { href: "/glosario",  label: "Glosario SO",           icon: "book",         accent: "secondary" },
];

const accentText: Record<string, string> = {
  primary:   "text-primary",
  secondary: "text-secondary",
  tertiary:  "text-tertiary",
};
const accentBorder: Record<string, string> = {
  primary:   "hover:border-primary",
  secondary: "hover:border-secondary",
  tertiary:  "hover:border-tertiary",
};
const accentHoverText: Record<string, string> = {
  primary:   "group-hover:text-primary",
  secondary: "group-hover:text-secondary",
  tertiary:  "group-hover:text-tertiary",
};

/* ─── Page ──────────────────────────────────────────────── */
export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="grid-bg relative overflow-hidden px-6 md:px-16 py-20 md:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-c/5 via-transparent to-secondary/5 pointer-events-none" />

        <div className="max-w-2xl animate-fade-up-1">
          <div className="font-mono text-xs text-muted mb-4 flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-secondary animate-pulse" />
            UTM · Ingeniería en Computación
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-text-base leading-tight mb-5">
            Apuntes y Programas de
            <br />
            <span className="text-primary">Sistemas Operativos</span>
          </h1>
          <p className="text-text-dim text-lg leading-relaxed mb-8">
            Repositorio personal de notas, prácticas y código de la materia.
            Procesos, memoria, concurrencia y más, organizados para repasar rápido.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/apuntes"
              className="bg-primary-c text-bg font-semibold px-5 py-2.5 rounded text-sm hover:bg-primary transition-colors"
            >
              Ver apuntes
            </Link>
            <Link
              href="/programas"
              className="border border-border text-text-dim px-5 py-2.5 rounded text-sm hover:border-primary hover:text-primary transition-colors"
            >
              Ver programas
            </Link>
          </div>
        </div>

        {/* Snippet decorativo */}
        <div className="absolute right-16 top-1/2 -translate-y-1/2 hidden xl:block animate-fade-up-2">
          <div className="bg-surf-high border border-border rounded-lg shadow-2xl rotate-1 w-72">
            <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-border">
              <span className="w-2.5 h-2.5 rounded-full bg-danger" />
              <span className="w-2.5 h-2.5 rounded-full bg-tertiary" />
              <span className="w-2.5 h-2.5 rounded-full bg-secondary" />
              <span className="font-mono text-[11px] text-muted ml-2">planificador.c</span>
            </div>
            <pre className="font-mono text-xs text-secondary leading-relaxed p-4">{`void planificar(void) {
  struct tarea *ant, *sig;
  ant = tarea_actual;
  sig = elegir_siguiente(cq);
  if (ant != sig)
    cambio_contexto(ant, sig);
}`}</pre>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <div className="border-y border-border bg-surf-low">
        <div className="max-w-5xl mx-auto px-6 md:px-16 py-5 flex flex-wrap gap-8 text-sm">
          <Stat icon="article"  color="primary"   value="12" label="Apuntes" />
          <Stat icon="terminal" color="secondary" value="8"  label="Programas" />
          <Stat icon="book"     color="tertiary"  value="40+" label="Términos en el glosario" />
          
        </div>
      </div>

      {/* APUNTES RECIENTES */}
      <section className="max-w-6xl mx-auto px-6 md:px-16 py-14">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-bold text-text-base">Apuntes Recientes</h2>
            <p className="text-text-dim mt-1 text-sm">Últimas notas y prácticas de la materia.</p>
          </div>
          <Link href="/apuntes" className="text-primary text-sm hover:underline flex items-center gap-1"  style={{ fontSize: 24 }}>
            Ver todos
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card destacada */}
          <div className="md:col-span-2 group bg-surf-mid border border-border rounded-lg overflow-hidden hover:border-primary transition-all">
            <div className="h-44 bg-surf-high overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-c/20 to-secondary/10 flex items-center justify-center">
                <pre className="font-mono text-xs text-secondary/70 leading-relaxed select-none px-8">{`void planificar_rr(int quantum) {
  Cola *listo = &cola_listos;
  Proceso *p;
  while ((p = desencolar(listo))) {
    ejecutar(p, quantum);
    if (!termino(p))
      encolar(listo, p);
  }
}`}</pre>
              </div>
            </div>
            <div className="p-6">
              <div className="flex gap-2 mb-3">
                <span className="bg-primary-c/15 text-primary text-xs px-2.5 py-0.5 rounded-full font-mono">Planificación</span>
                <span className="bg-secondary/10 text-secondary text-xs px-2.5 py-0.5 rounded-full font-mono">Round Robin</span>
              </div>
              <h3 className="text-lg font-semibold text-text-base mb-2 group-hover:text-primary transition-colors">
                Algoritmos de Planificación de CPU
              </h3>
              <p className="text-text-dim text-sm leading-relaxed mb-4">
                FCFS, SJF, Round Robin y Prioridad. Comparativa con diagramas de Gantt
                y análisis de tiempo de espera promedio.
              </p>
              <Link href="/apuntes" className="text-primary text-sm font-medium hover:underline flex items-center gap-1 w-fit">
                Leer apunte
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_forward</span>
              </Link>
            </div>
          </div>

          {/* Tarjetas laterales */}
          <div className="flex flex-col gap-6">
            {[
              { tag: "Memoria", accent: "secondary", titulo: "Paginación y Segmentación", desc: "Gestión de memoria virtual: tablas de páginas, TLB y traducción de direcciones.", fecha: "Mar 2025" },
              { tag: "Concurrencia", accent: "tertiary", titulo: "Deadlock y Semáforos", desc: "Condiciones de Coffman, prevención de interbloqueos y sincronización.", fecha: "Abr 2025" },
            ].map(({ tag, accent, titulo, desc, fecha }) => (
              <div
                key={titulo}
                className={`group bg-surf-mid border border-border rounded-lg p-5 ${accentBorder[accent]} transition-all flex flex-col flex-1`}
              >
                <span className={`bg-current/10 ${accentText[accent]} text-xs px-2.5 py-0.5 rounded-full font-mono w-fit mb-3`}>
                  {tag}
                </span>
                <h3 className={`font-semibold text-text-base mb-2 ${accentHoverText[accent]} transition-colors`}>
                  {titulo}
                </h3>
                <p className="text-text-dim text-xs leading-relaxed flex-1">{desc}</p>
                <div className="border-t border-border mt-4 pt-3 flex justify-between items-center">
                  <span className="font-mono text-[11px] text-muted">{fecha}</span>
                  <span className={`material-symbols-outlined ${accentText[accent]}`} style={{ fontSize: 18 }}>
                    arrow_forward
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Tarjeta horizontal */}
          <div className="md:col-span-3 flex flex-col md:flex-row group bg-surf-low border border-border rounded-lg overflow-hidden hover:border-primary transition-all">
            <div className="md:w-48 bg-surf-high flex items-center justify-center p-8 shrink-0">
              <span className="material-symbols-outlined text-5xl text-primary/40">terminal</span>
            </div>
            <div className="p-6">
              <span className="font-mono text-[11px] text-muted block mb-1">— Práctica de laboratorio</span>
              <h3 className="font-semibold text-text-base mb-1 group-hover:text-primary transition-colors">
                Implementación de Productor-Consumidor en C
              </h3>
              <p className="text-text-dim text-sm mb-3">
                Solución al problema clásico usando mutex y semáforos POSIX.
                Código comentado y compilable en Linux.
              </p>
              <Link href="/programas" className="text-primary text-sm font-medium hover:underline flex items-center gap-1 w-fit">
                Ver código
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>open_in_new</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* TEMAS */}
      <section className="border-t border-border bg-surf-low py-14">
        <div className="max-w-6xl mx-auto px-6 md:px-16">
          <h2 className="text-2xl font-bold text-text-base mb-2">Temas de la Materia</h2>
          <p className="text-text-dim text-sm mb-8">Navega por unidad temática.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {temas.map(({ href, label, icon, accent }) => (
              <Link
                key={label}
                href={href}
                className={`group bg-surf-mid border border-border rounded-lg p-4 ${accentBorder[accent]} transition-all text-center`}
              >
                <span
                  className={`material-symbols-outlined text-2xl ${accentText[accent]} mb-2 block`}
                >
                  {icon}
                </span>
                <span className={`text-sm font-medium text-text-base ${accentHoverText[accent]} transition-colors`}>
                  {label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

/* ─── Subcomponente ─────────────────────────────────────── */
function Stat({ icon, color, value, label }: { icon: string; color: string; value: string; label: string }) {
  return (
    <div className="flex items-center gap-2 text-text-dim">
      <span className={`material-symbols-outlined ${accentText[color]}`} style={{ fontSize: 18 }}>
        {icon}
      </span>
      <span>
        <span className="text-text-base font-semibold">{value}</span> {label}
      </span>
    </div>
  );
}
