import Navbar_Apuntes from "@/components/Navbar_Apuntes";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Apuntes | BitácoraSO",
  description: "Notas y apuntes de la materia Sistemas Operativos — UTM.",
};

/* ─── Types ─────────────────────────────────────────────── */
interface Seccion {
  id: string;
  titulo: string;
  contenido: React.ReactNode;
}

/* ─── Contenido del apunte ──────────────────────────────── */
const secciones: Seccion[] = [
  {
    id: "introduccion",
    titulo: "Introducción a la Planificación",
    contenido: (
      <>
        <p>
          En un sistema multiprogramado, varios procesos compiten por el CPU. Si solo hay
          un procesador disponible, únicamente un proceso puede ejecutarse a la vez. El objetivo
          de la planificación es mantener el CPU ocupado en todo momento, maximizando el
          rendimiento del sistema.
        </p>
        <blockquote className="bg-surf-mid border-l-4 border-primary rounded p-5 my-6 italic text-text-base">
          "El rendimiento de un sistema es tan bueno como la capacidad de su planificador
          para minimizar los ciclos inactivos."
        </blockquote>
      </>
    ),
  },
  {
    id: "fcfs",
    titulo: "1. FCFS — Primero en llegar, primero en ser atendido",
    contenido: (
      <>
        <p>
          Es el algoritmo más sencillo. Los procesos se asignan al CPU en el orden en que
          los solicitan. Es <strong className="text-text-base">no apropiativo</strong> y se
          gestiona con una cola FIFO.
        </p>
        <CodeBlock filename="fcfs.c" code={`struct proceso {
    int pid;
    int t_llegada;
    int t_rafaga;
    int t_completado;
};

void calcular_fcfs(struct proceso p[], int n) {
    p[0].t_completado = p[0].t_llegada + p[0].t_rafaga;
    for (int i = 1; i < n; i++) {
        p[i].t_completado = p[i-1].t_completado + p[i].t_rafaga;
    }
}`} />
      </>
    ),
  },
  {
    id: "sjf",
    titulo: "2. SJF — Trabajo más corto primero",
    contenido: (
      <>
        <p>
          SJF asocia a cada proceso la duración de su siguiente ráfaga de CPU. Cuando el
          procesador queda libre, se asigna al proceso con la ráfaga más corta. Es óptimo
          en cuanto a tiempo de espera promedio mínimo.
        </p>
        <ul className="space-y-2 mt-4 pl-4 border-l-2 border-border">
          {[
            "Minimiza el tiempo de espera promedio.",
            "Puede provocar inanición en procesos largos.",
            "Difícil de predecir la duración de la siguiente ráfaga.",
          ].map((item) => (
            <li key={item} className="text-text-dim text-sm flex gap-3">
              <span className="text-secondary shrink-0">—</span>
              {item}
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    id: "rr",
    titulo: "3. Round Robin",
    contenido: (
      <>
        <p>
          Diseñado para sistemas de tiempo compartido. Define una unidad de tiempo llamada{" "}
          <strong className="text-text-base">quantum</strong>. El planificador recorre la
          cola de listos asignando el CPU a cada proceso durante como máximo un quantum.
        </p>
        <div className="bg-surf-mid border border-secondary/30 rounded-lg p-5 my-6 flex items-start gap-3">
          <span className="material-symbols-outlined text-secondary shrink-0" style={{ fontSize: 22 }}>
            tips_and_updates
          </span>
          <div>
            <p className="font-semibold text-secondary text-sm mb-1">Consejo: Ajuste del quantum</p>
            <p className="text-text-dim text-sm">
              Si el quantum es demasiado grande, RR se comporta como FCFS. Si es muy pequeño,
              la sobrecarga por cambios de contexto se vuelve significativa.
            </p>
          </div>
        </div>
        <CodeBlock filename="round_robin.c" code={`void round_robin(Cola *listos, int quantum) {
    Proceso *p;
    while ((p = desencolar(listos))) {
        ejecutar(p, quantum);
        if (!termino(p))
            encolar(listos, p);
    }
}`} />
      </>
    ),
  },
  {
    id: "prioridad",
    titulo: "4. Planificación por Prioridad",
    contenido: (
      <>
        <p>
          Cada proceso recibe un número de prioridad y el CPU se asigna al proceso con mayor
          prioridad. Puede ser apropiativo o no apropiativo. El principal problema es la{" "}
          <strong className="text-text-base">inanición</strong>, que se resuelve con
          envejecimiento (<em>aging</em>).
        </p>
      </>
    ),
  },
];

const toc = [
  { id: "introduccion", label: "Introducción" },
  { id: "fcfs",         label: "1. FCFS" },
  { id: "sjf",          label: "2. Shortest Job First" },
  { id: "rr",           label: "3. Round Robin" },
  { id: "prioridad",    label: "4. Por Prioridad" },
];

/* ─── Page ──────────────────────────────────────────────── */
export default function ApuntesPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 md:px-16 py-12 flex gap-12">
      <Navbar_Apuntes />
      {/* Artículo principal */}
      <article className="flex-1 min-w-0">
        {/* Breadcrumb */}
        <div className="font-mono text-xs text-muted mb-6 flex items-center gap-2">
          <span>Inicio</span>
          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>chevron_right</span>
          <span className="text-primary">Apuntes</span>
        </div>

        {/* Header */}
        <header className="mb-10">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-primary-c/15 text-primary text-xs px-2.5 py-0.5 rounded-full font-mono">Planificación</span>
            <span className="bg-secondary/10 text-secondary text-xs px-2.5 py-0.5 rounded-full font-mono">CPU</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-text-base leading-tight mb-4">
            Algoritmos de Planificación de CPU
          </h1>
          <div className="flex items-center gap-5 text-xs font-mono text-muted">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined" style={{ fontSize: 15 }}>calendar_today</span>
              Mar 2025
            </span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined" style={{ fontSize: 15 }}>schedule</span>
              12 min de lectura
            </span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined" style={{ fontSize: 15 }}>school</span>
              Sistemas Operativos — UTM
            </span>
          </div>
        </header>
        

        {/* Imagen / banner */}
        <div className="w-full h-52 rounded-lg overflow-hidden mb-10 bg-surf-high border border-border flex items-center justify-center relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-c/15 to-secondary/10" />
          <pre className="font-mono text-xs text-secondary/60 leading-relaxed relative select-none">{`         Proceso  |  Llegada  |  Ráfaga
         ─────────+───────────+────────
            P1    |     0     |    4
            P2    |     1     |    3
            P3    |     2     |    5
            P4    |     3     |    2
         ─────────+───────────+────────`}</pre>
        </div>

        {/* Intro */}
        <p className="text-text-dim text-base leading-relaxed mb-10">
          El planificador de procesos es el núcleo del kernel de un sistema operativo.
          Su responsabilidad principal es decidir qué proceso de la cola de listos debe
          recibir el CPU a continuación, garantizando máxima utilización y buena respuesta.
        </p>

        {/* Secciones */}
        <div className="space-y-12">
          {secciones.map(({ id, titulo, contenido }) => (
            <section key={id} id={id} className="scroll-mt-24">
              <h2 className="text-xl font-bold text-primary mb-4">{titulo}</h2>
              <div className="text-text-dim text-sm leading-relaxed space-y-4">{contenido}</div>
            </section>
          ))}
        </div>

        {/* Módulos relacionados */}
        <div className="mt-16 pt-10 border-t border-border">
          <h3 className="text-base font-bold text-text-base mb-6">Módulos relacionados</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ModuleCard label="SIGUIENTE" titulo="Paginación y Segmentación" desc="Explora cómo el SO gestiona espacios de memoria física y virtual." href="/apuntes" />
            <ModuleCard label="ANTERIOR"  titulo="Bloque de Control de Proceso (PCB)" desc="Estructuras de datos que almacenan la información de cada proceso." href="/apuntes" dim />
          </div>
        </div>
      </article>

      {/* TOC sidebar */}
      <aside className="hidden xl:block w-56 shrink-0">
        <div className="sticky top-24 bg-surf-low border border-border rounded-lg p-5">
          <p className="font-mono text-[11px] text-muted uppercase tracking-widest mb-5">En esta página</p>
          <ul className="space-y-3 text-sm">
            {toc.map(({ id, label }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className="block text-text-dim hover:text-primary transition-colors border-l-2 border-transparent hover:border-primary pl-3"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-8 pt-5 border-t border-border">
            <p className="font-mono text-[11px] text-muted mb-3">Contribuir</p>
            <a
              href="https://github.com/Julio-Atenco"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-primary hover:underline text-xs"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>edit</span>
              Editar en GitHub
            </a>
          </div>
        </div>
      </aside>
    </div>
  );
}

/* ─── Subcomponentes ────────────────────────────────────── */
function CodeBlock({ filename, code }: { filename: string; code: string }) {
  return (
    <div className="rounded-lg overflow-hidden border border-border my-6">
      <div className="bg-surf-high px-4 py-2 border-b border-border flex items-center justify-between">
        <span className="font-mono text-xs text-muted">{filename}</span>
        <button className="flex items-center gap-1 text-xs text-primary hover:underline">
          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>content_copy</span>
          Copiar
        </button>
      </div>
      <pre className="p-5 bg-surf-low overflow-x-auto">
        <code className="font-mono text-xs text-secondary leading-relaxed">{code}</code>
      </pre>
    </div>
  );
}

function ModuleCard({
  label, titulo, desc, href, dim,
}: {
  label: string; titulo: string; desc: string; href: string; dim?: boolean;
}) {
  return (
    <a
      href={href}
      className="group bg-surf-mid border border-border p-5 rounded-lg hover:border-primary transition-colors block"
    >
      <span className={`font-mono text-[11px] block mb-2 ${dim ? "text-muted" : "text-primary"}`}>
        {label}
      </span>
      <h4 className="font-semibold text-text-base group-hover:text-primary transition-colors mb-1 text-sm">
        {titulo}
      </h4>
      <p className="text-text-dim text-xs">{desc}</p>
    </a>
  );
}
