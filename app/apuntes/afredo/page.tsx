import DocPage, {
  DocH2,
  DocP,
  DocUl,
  DocLi,
  DocNote,
} from "@/components/DocPage";
import Link from "next/link";

export const metadata = {
  title: "3. Mecanismos de Comunicación entre Procesos (IPC) — Portafolio SO",
};

const toc = [
  { id: "intro", label: "Introducción" },
  { id: "panorama", label: "Panorama del capítulo" },
  { id: "indice", label: "Índice de secciones" },
];

const secciones = [
  {
    href: "/apuntes/3/3.1_Tuberias",
    code: "3.1",
    title: "Comunicación mediante tuberías",
    desc: "Tuberías sin nombre (pipe) y con nombre (FIFO) entre procesos.",
  },
  {
    href: "/apuntes/3/3.2_SystemV",
    code: "3.2",
    title: "Mecanismos IPC derivados de System V",
    desc: "Llaves (ftok) y semáforos para sincronizar procesos.",
  },
  {
    href: "/apuntes/3/3.3_Memoria_Compartida",
    code: "3.3",
    title: "Memoria compartida",
    desc: "Compartir un mismo segmento de memoria entre procesos.",
  },
  {
    href: "/apuntes/3/3.4_Cola_Mensajes",
    code: "3.4",
    title: "Cola de mensajes",
    desc: "Intercambio de mensajes tipificados mediante msgsnd / msgrcv.",
  },
  {
    href: "/apuntes/3/3.5_Comandos_IPC",
    code: "3.5",
    title: "Información de IPC por comandos del sistema",
    desc: "Inspección y limpieza con ipcs e ipcrm.",
  },
];

export default function Page() {
  return (
    <DocPage
      section="3"
      title="Mecanismos de Comunicación entre Procesos (IPC)"
      category="IPC"
      readTime="4 min"
      toc={toc}
      prev={{
        href: "/apuntes/2",
        label: "2. Procesos e hilos",
      }}
      next={{
        href: "/apuntes/3/3.1_Tuberias",
        label: "3.1 Comunicación mediante tuberías",
      }}
    >
      <DocH2 id="intro">Introducción</DocH2>
      <DocP>
        Todos los procesos, parientes o no, necesitan en ocasiones comunicarse
        entre sí. Para ello, el sistema operativo proporciona formas básicas de
        comunicación tipo <em>stream</em> (pipe, FIFO, sockets) y de{" "}
        <em>mensajes</em> (colas de mensajes, sockets datagrama). Si los
        procesos son parientes, la comunicación se puede realizar a través de
        una tubería; si se necesita proteger un recurso compartido se recurre a
        mecanismos de sincronización como los semáforos.
      </DocP>

      <DocH2 id="panorama">Panorama del capítulo</DocH2>
      <DocP>
        En UNIX System V y derivados (como GNU/Linux) existen tres familias
        principales de IPC: <strong>tuberías</strong> (anónimas y con nombre),
        los <strong>mecanismos identificados por llave</strong> (semáforos,
        memoria compartida y colas de mensajes), y los{" "}
        <strong>sockets</strong>. Todas comparten una idea común: ofrecer un
        canal seguro para que dos espacios de direcciones independientes
        intercambien información sin pisarse mutuamente.
      </DocP>
      <DocP>Cada mecanismo está pensado para un caso de uso distinto:</DocP>
      <DocUl>
        <DocLi>
          <span>
            Las <strong>tuberías</strong> son el más simple y natural para
            procesos emparentados.
          </span>
        </DocLi>
        <DocLi>
          <span>
            Los <strong>FIFO</strong> generalizan las tuberías al sistema de
            archivos para procesos no emparentados.
          </span>
        </DocLi>
        <DocLi>
          <span>
            Los <strong>semáforos</strong> permiten coordinar el acceso
            concurrente a recursos compartidos.
          </span>
        </DocLi>
        <DocLi>
          <span>
            La <strong>memoria compartida</strong> es el mecanismo más rápido,
            pues elimina copias entre kernel y usuario.
          </span>
        </DocLi>
        <DocLi>
          <span>
            Las <strong>colas de mensajes</strong> intercambian datos en
            paquetes tipificados.
          </span>
        </DocLi>
      </DocUl>

      <DocNote>
        Los objetos System V (semáforos, memoria compartida y colas) persisten
        en el kernel incluso después de que terminen los procesos que los
        crearon. Hay que liberarlos explícitamente con <code>IPC_RMID</code> o
        con el comando <code>ipcrm</code>.
      </DocNote>

      <DocH2 id="indice">Índice de secciones</DocH2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-4">
        {secciones.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="group flex flex-col bg-surf-low border border-border rounded-lg p-4 hover:border-primary transition-colors"
          >
            <span className="font-mono text-[11px] text-muted mb-1">
              § {s.code}
            </span>
            <span className="text-sm font-semibold text-text-base group-hover:text-primary transition-colors mb-1">
              {s.title}
            </span>
            <span className="text-xs text-text-dim leading-relaxed">
              {s.desc}
            </span>
          </Link>
        ))}
      </div>
    </DocPage>
  );
}