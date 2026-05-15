import type { Metadata } from "next";
import DocPage, {
  DocH2,
  DocP,
  DocUl,
  DocLi,
  DocNote,
  CodeBlock,
  InlineCode,
} from "@/components/DocPage";

export const metadata: Metadata = {
  title: "Apuntes | BitácoraSO",
  description: "Notas y apuntes de la materia Sistemas Operativos — UTM.",
};

/* ─── TOC ───────────────────────────────────────────────── */
const toc = [
  { id: "introduccion", label: "Introducción" },
  { id: "fcfs",         label: "1. FCFS" },
  { id: "sjf",          label: "2. Shortest Job First" },
  { id: "rr",           label: "3. Round Robin" },
  { id: "prioridad",    label: "4. Por Prioridad" },
  { id: "relacionados", label: "Módulos relacionados" },
];

/* ─── Code samples ──────────────────────────────────────── */
const codeFcfs = `struct proceso {
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
}`;

const codeRoundRobin = `void round_robin(Cola *listos, int quantum) {
    Proceso *p;
    while ((p = desencolar(listos))) {
        ejecutar(p, quantum);
        if (!termino(p))
            encolar(listos, p);
    }
}`;

/* ─── Page ──────────────────────────────────────────────── */
export default function ApuntesPage() {
  return (
    <DocPage
      section="Planificación"
      title="Algoritmos de Planificación de CPU"
      category="Planificación · CPU"
      readTime="12 min"
      toc={toc}
      prev={{ href: "/apuntes", label: "Bloque de Control de Proceso (PCB)" }}
      next={{ href: "/apuntes", label: "Paginación y Segmentación" }}
    >
      {/* Banner ASCII (decoración propia de esta página) */}
      <div className="w-full h-52 rounded-lg overflow-hidden mb-10 bg-surf-high border border-border flex items-center justify-center relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-c/15 to-secondary/10" />
        <pre className="font-mono text-xs text-secondary/60 leading-relaxed relative select-none">
{`         Proceso  |  Llegada  |  Ráfaga
         ─────────+───────────+────────
            P1    |     0     |    4
            P2    |     1     |    3
            P3    |     2     |    5
            P4    |     3     |    2
         ─────────+───────────+────────`}
        </pre>
      </div>

      {/* Intro */}
      <DocP>
        El planificador de procesos es el núcleo del kernel de un sistema
        operativo. Su responsabilidad principal es decidir qué proceso de la
        cola de listos debe recibir el CPU a continuación, garantizando máxima
        utilización y buena respuesta.
      </DocP>

      {/* 1. Introducción */}
      <DocH2 id="introduccion">Introducción a la Planificación</DocH2>
      <DocP>
        En un sistema multiprogramado, varios procesos compiten por el CPU. Si
        solo hay un procesador disponible, únicamente un proceso puede
        ejecutarse a la vez. El objetivo de la planificación es mantener el CPU
        ocupado en todo momento, maximizando el rendimiento del sistema.
      </DocP>

      <blockquote className="bg-surf-mid border-l-4 border-primary rounded p-5 my-6 italic text-text-base text-sm leading-relaxed">
        &ldquo;El rendimiento de un sistema es tan bueno como la capacidad de su
        planificador para minimizar los ciclos inactivos.&rdquo;
      </blockquote>

      {/* 2. FCFS */}
      <DocH2 id="fcfs">1. FCFS — Primero en llegar, primero en ser atendido</DocH2>
      <DocP>
        Es el algoritmo más sencillo. Los procesos se asignan al CPU en el
        orden en que los solicitan. Es{" "}
        <strong className="text-text-base">no apropiativo</strong> y se
        gestiona con una cola FIFO.
      </DocP>
      <CodeBlock filename="fcfs.c" lang="c">
        {codeFcfs}
      </CodeBlock>

      {/* 3. SJF */}
      <DocH2 id="sjf">2. SJF — Trabajo más corto primero</DocH2>
      <DocP>
        SJF asocia a cada proceso la duración de su siguiente ráfaga de CPU.
        Cuando el procesador queda libre, se asigna al proceso con la ráfaga
        más corta. Es óptimo en cuanto a tiempo de espera promedio mínimo.
      </DocP>
      <DocUl>
        <DocLi>
          <span>Minimiza el tiempo de espera promedio.</span>
        </DocLi>
        <DocLi>
          <span>Puede provocar inanición en procesos largos.</span>
        </DocLi>
        <DocLi>
          <span>Difícil de predecir la duración de la siguiente ráfaga.</span>
        </DocLi>
      </DocUl>

      {/* 4. Round Robin */}
      <DocH2 id="rr">3. Round Robin</DocH2>
      <DocP>
        Diseñado para sistemas de tiempo compartido. Define una unidad de
        tiempo llamada <strong className="text-text-base">quantum</strong>. El
        planificador recorre la cola de listos asignando el CPU a cada proceso
        durante como máximo un quantum.
      </DocP>

      <DocNote>
        <strong className="text-secondary block mb-1">
          Consejo · Ajuste del quantum
        </strong>
        Si el quantum es demasiado grande, RR se comporta como{" "}
        <InlineCode>FCFS</InlineCode>. Si es muy pequeño, la sobrecarga por
        cambios de contexto se vuelve significativa.
      </DocNote>

      <CodeBlock filename="round_robin.c" lang="c">
        {codeRoundRobin}
      </CodeBlock>

      {/* 5. Prioridad */}
      <DocH2 id="prioridad">4. Planificación por Prioridad</DocH2>
      <DocP>
        Cada proceso recibe un número de prioridad y el CPU se asigna al
        proceso con mayor prioridad. Puede ser apropiativo o no apropiativo. El
        principal problema es la{" "}
        <strong className="text-text-base">inanición</strong>, que se resuelve
        con envejecimiento (<em>aging</em>).
      </DocP>

      {/* Módulos relacionados */}
      <DocH2 id="relacionados">Módulos relacionados</DocH2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
        <ModuleCard
          label="SIGUIENTE"
          titulo="Paginación y Segmentación"
          desc="Explora cómo el SO gestiona espacios de memoria física y virtual."
          href="/apuntes"
        />
        <ModuleCard
          label="ANTERIOR"
          titulo="Bloque de Control de Proceso (PCB)"
          desc="Estructuras de datos que almacenan la información de cada proceso."
          href="/apuntes"
          dim
        />
      </div>
    </DocPage>
  );
}

/* ─── Subcomponente local (no está en DocPage) ──────────── */
function ModuleCard({
  label,
  titulo,
  desc,
  href,
  dim,
}: {
  label: string;
  titulo: string;
  desc: string;
  href: string;
  dim?: boolean;
}) {
  return (
    <a
      href={href}
      className="group bg-surf-mid border border-border p-5 rounded-lg hover:border-primary transition-colors block"
    >
      <span
        className={`font-mono text-[11px] block mb-2 ${
          dim ? "text-muted" : "text-primary"
        }`}
      >
        {label}
      </span>
      <h4 className="font-semibold text-text-base group-hover:text-primary transition-colors mb-1 text-sm">
        {titulo}
      </h4>
      <p className="text-text-dim text-xs">{desc}</p>
    </a>
  );
}