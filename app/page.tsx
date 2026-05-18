import Link from "next/link";

/* ─── Temas reales del portafolio ───────────────────────── */
const temas = [
  { href: "/apuntes/1",                            label: "Introducción al SO",   icon: "computer",      accent: "primary"   },
  { href: "/apuntes/2/2.1_Introduccion_Procesos",  label: "Procesos",             icon: "memory",        accent: "primary"   },
  { href: "/apuntes/2/2.8_Hilos",                  label: "Hilos (pthreads)",     icon: "device_hub",    accent: "secondary" },
  { href: "/apuntes/3/3.1_Tuberias",               label: "Tuberías IPC",         icon: "cable",         accent: "tertiary"  },
  { href: "/apuntes/3/3.2_SystemV",                label: "Semáforos System V",   icon: "sync",          accent: "secondary" },
  { href: "/apuntes/3/3.3_Memoria_Compartida",     label: "Memoria Compartida",   icon: "storage",       accent: "tertiary"  },
  { href: "/programas",                            label: "Programas",            icon: "terminal",      accent: "secondary" },
  { href: "/glosario",                             label: "Glosario SO",          icon: "book",          accent: "primary"   },
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
      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="grid-bg relative overflow-hidden px-6 md:px-16 py-20 md:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-c/5 via-transparent to-secondary/5 pointer-events-none" />

        <div className="max-w-2xl animate-fade-up-1">
          <div className="font-mono text-xs text-muted mb-4 flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-secondary animate-pulse" />
            UTM · Ingeniería en Computación
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-text-base leading-tight mb-5">
            Portafolio de
            <br />
            <span className="text-primary">Sistemas Operativos</span>
          </h1>
          <p className="text-text-dim text-lg leading-relaxed mb-8">
            Apuntes y programas de los temas del portafolio: procesos e hilos,
            mecanismos IPC, semáforos, memoria compartida y colas de mensajes.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/apuntes/1"
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

        {/* Snippet decorativo — fork() */}
        <div className="absolute right-16 top-1/2 -translate-y-1/2 hidden xl:block animate-fade-up-2">
          <div className="bg-surf-high border border-border rounded-lg shadow-2xl rotate-1 w-72">
            <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-border">
              <span className="w-2.5 h-2.5 rounded-full bg-danger" />
              <span className="w-2.5 h-2.5 rounded-full bg-tertiary" />
              <span className="w-2.5 h-2.5 rounded-full bg-secondary" />
              <span className="font-mono text-[11px] text-muted ml-2">procesos.c</span>
            </div>
            <pre className="font-mono text-xs text-secondary leading-relaxed p-4">{`pid_t pid = fork();

if (pid == 0) {
  /* proceso hijo */
  printf("Hijo PID=%d\\n",
         getpid());
} else {
  /* proceso padre */
  wait(NULL);
}`}</pre>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ────────────────────────────────────── */}
      <div className="border-y border-border bg-surf-low">
        <div className="max-w-5xl mx-auto px-6 md:px-16 py-5 flex flex-wrap gap-8 text-sm">
          <Stat icon="article"  color="primary"   value="10" label="Apuntes" />
          <Stat icon="terminal" color="secondary" value="21" label="Programas" />
          <Stat icon="book"     color="tertiary"  value="52" label="Términos en el glosario" />
          <a
            href="https://mixteco.utm.mx/~gcgero/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-text-dim hover:text-primary transition-colors ml-auto text-sm"
          >
            <span className="material-symbols-outlined text-primary" style={{ fontSize: 18 }}>school</span>
            Página del profesor
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>open_in_new</span>
          </a>
        </div>
      </div>

      {/* ── APUNTES RECIENTES ────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 md:px-16 py-14">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-bold text-text-base">Apuntes Recientes</h2>
            <p className="text-text-dim mt-1 text-sm">Temas del capítulo 2 y 3 de las notas.</p>
          </div>
          <Link
            href="/apuntes/1"
            className="text-primary text-sm hover:underline flex items-center gap-1"
          >
            Ver todos
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_forward</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* ── Card destacada — fork() ── */}
          <div className="md:col-span-2 group bg-surf-mid border border-border rounded-lg overflow-hidden hover:border-primary transition-all">
            <div className="h-44 bg-surf-high overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-c/20 to-secondary/10 flex items-center justify-center">
                <pre className="font-mono text-xs text-secondary/70 leading-relaxed select-none px-8">{`pid_t pid = fork();

if (pid == 0) {
    x = 5;  /* hijo: copia independiente */
    printf("Hijo PID=%ld, x=%d\\n",
           (long)getpid(), x);
} else {
    x = 10; /* padre */
    wait(NULL);
}`}</pre>
              </div>
            </div>
            <div className="p-6">
              <div className="flex gap-2 mb-3">
                <span className="bg-primary-c/15 text-primary text-xs px-2.5 py-0.5 rounded-full font-mono">Procesos</span>
                <span className="bg-secondary/10 text-secondary text-xs px-2.5 py-0.5 rounded-full font-mono">fork()</span>
              </div>
              <h3 className="text-lg font-semibold text-text-base mb-2 group-hover:text-primary transition-colors">
                Crear Procesos con fork()
              </h3>
              <p className="text-text-dim text-sm leading-relaxed mb-4">
                Llamada al sistema fork(), copy-on-write, valor de retorno, atributos
                heredados y ejemplos con cadena y abanico de procesos.
              </p>
              <Link
                href="/apuntes/2/2.2_Crear_Procesos"
                className="text-primary text-sm font-medium hover:underline flex items-center gap-1 w-fit"
              >
                Leer apunte
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_forward</span>
              </Link>
            </div>
          </div>

          {/* ── Tarjetas laterales ── */}
          <div className="flex flex-col gap-6">
            {[
              {
                tag:    "Hilos",
                accent: "secondary",
                href:   "/apuntes/2/2.8_Hilos",
                titulo: "Hilos con pthreads",
                desc:   "pthread_create, pthread_join, pthread_exit y mutex para exclusión mutua.",
                fecha:  "May 2025",
              },
              {
                tag:    "IPC",
                accent: "tertiary",
                href:   "/apuntes/3/3.1_Tuberias",
                titulo: "Tuberías — pipe y fifo",
                desc:   "Comunicación entre procesos con pipe() sin nombre y mkfifo() con nombre.",
                fecha:  "May 2025",
              },
            ].map(({ tag, accent, href, titulo, desc, fecha }) => (
              <Link
                key={titulo}
                href={href}
                className={`group bg-surf-mid border border-border rounded-lg p-5 ${accentBorder[accent]} transition-all flex flex-col flex-1`}
              >
                <span className={`${accentText[accent]} bg-current/10 text-xs px-2.5 py-0.5 rounded-full font-mono w-fit mb-3`}>
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
              </Link>
            ))}
          </div>

          {/* ── Tarjeta horizontal — Estado Zombi ── */}
          <div className="md:col-span-3 flex flex-col md:flex-row group bg-surf-low border border-border rounded-lg overflow-hidden hover:border-danger transition-all">
            <div className="md:w-48 bg-surf-high flex items-center justify-center p-8 shrink-0">
              <span className="material-symbols-outlined text-5xl text-danger/40">skull</span>
            </div>
            <div className="p-6">
              <span className="font-mono text-[11px] text-muted block mb-1">§ 2.7 — Procesos e Hilos</span>
              <h3 className="font-semibold text-text-base mb-1 group-hover:text-danger transition-colors">
                Estado Zombi — demostración práctica
              </h3>
              <p className="text-text-dim text-sm mb-3">
                Qué ocurre cuando el padre no llama a <code className="font-mono text-xs bg-surf-high text-secondary px-1 rounded">wait()</code>.
                Cómo observarlo con <code className="font-mono text-xs bg-surf-high text-secondary px-1 rounded">ps -el | grep Z</code>
                y cómo evitarlo.
              </p>
              <Link
                href="/apuntes/2/2.7_Estado_Zombi"
                className="text-danger text-sm font-medium hover:underline flex items-center gap-1 w-fit"
              >
                Ver apunte
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>open_in_new</span>
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ── TEMAS DE LA MATERIA ───────────────────────────── */}
      <section className="border-t border-border bg-surf-low py-14">
        <div className="max-w-6xl mx-auto px-6 md:px-16">
          <h2 className="text-2xl font-bold text-text-base mb-2">Temas del Portafolio</h2>
          <p className="text-text-dim text-sm mb-8">
            Capítulos 1, 2 y 3 de las notas del profesor.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {temas.map(({ href, label, icon, accent }) => (
              <Link
                key={label}
                href={href}
                className={`group bg-surf-mid border border-border rounded-lg p-4 ${accentBorder[accent]} transition-all text-center`}
              >
                <span className={`material-symbols-outlined text-2xl ${accentText[accent]} mb-2 block`}>
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

/* ─── Subcomponente Stat ─────────────────────────────────── */
function Stat({
  icon, color, value, label,
}: {
  icon: string; color: string; value: string; label: string;
}) {
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