import DocPage, { DocH2, DocP, DocUl, DocLi, DocNote } from "@/components/DocPage";
import Link from "next/link";

export const metadata = {
  title: "3.1 Comunicación mediante tuberías — Portafolio SO",
};

const toc = [
  { id: "intro", label: "Introducción" },
  { id: "tipos", label: "Tipos de tubería" },
  { id: "subsecciones", label: "Subsecciones" },
];

export default function Page() {
  return (
    <DocPage
      section="3.1"
      title="Comunicación mediante tuberías"
      category="IPC · Tuberías"
      readTime="5 min"
      toc={toc}
      prev={{ href: "/apuntes/3", label: "3. Mecanismos IPC" }}
      next={{
        href: "/apuntes/3/3.1_Tuberias/3.1.1_Pipe",
        label: "3.1.1 Tuberías sin nombre (pipe)",
      }}
    >
      <DocH2 id="intro">Introducción</DocH2>
      <DocP>
        La comunicación entre procesos es fundamental para que intercambien
        datos. Antes de elegir un mecanismo conviene preguntarse: ¿los procesos
        están en la misma máquina?, ¿están emparentados? Las{" "}
        <strong>tuberías</strong> son el mecanismo clásico de IPC entre
        procesos emparentados dentro de la misma máquina; la teoría que se
        describe a continuación está basada en las facilidades de UNIX System V
        y derivados.
      </DocP>

      <DocH2 id="tipos">Tipos de tubería</DocH2>
      <DocUl>
        <DocLi>
          <span>
            <strong>Tubería sin nombre (pipe).</strong> Unidireccional y solo
            sirve entre procesos con un ancestro común; existe únicamente
            mientras viven los descriptores de archivo.
          </span>
        </DocLi>
        <DocLi>
          <span>
            <strong>Tubería con nombre (FIFO).</strong> Tiene un nombre en el
            sistema de archivos, por lo que cualquier proceso con permisos
            puede abrirla.
          </span>
        </DocLi>
      </DocUl>

      <DocNote>
        En ambos casos la lectura bloquea cuando no hay datos disponibles y la
        escritura bloquea cuando el buffer está lleno: la tubería sirve también
        como punto natural de sincronización.
      </DocNote>

      <DocH2 id="subsecciones">Subsecciones</DocH2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-4">
        <Link
          href="/apuntes/3/3.1_Tuberias/3.1.1_Pipe"
          className="group flex flex-col bg-surf-low border border-border rounded-lg p-4 hover:border-primary transition-colors"
        >
          <span className="font-mono text-[11px] text-muted mb-1">§ 3.1.1</span>
          <span className="text-sm font-semibold text-text-base group-hover:text-primary transition-colors mb-1">
            Tuberías sin nombre (pipe)
          </span>
          <span className="text-xs text-text-dim leading-relaxed">
            Comunicación padre-hijo con pipe() y fork().
          </span>
        </Link>
        <Link
          href="/apuntes/3/3.1_Tuberias/3.1.2_Fifo"
          className="group flex flex-col bg-surf-low border border-border rounded-lg p-4 hover:border-primary transition-colors"
        >
          <span className="font-mono text-[11px] text-muted mb-1">§ 3.1.2</span>
          <span className="text-sm font-semibold text-text-base group-hover:text-primary transition-colors mb-1">
            Tuberías con nombre (FIFO)
          </span>
          <span className="text-xs text-text-dim leading-relaxed">
            Archivo especial creado con mkfifo() para comunicar cualquier par
            de procesos.
          </span>
        </Link>
      </div>
    </DocPage>
  );
}