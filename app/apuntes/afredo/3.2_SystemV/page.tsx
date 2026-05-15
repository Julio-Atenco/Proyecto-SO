import DocPage, {
  DocH2,
  DocP,
  DocUl,
  DocLi,
  DocNote,
} from "@/components/DocPage";
import Link from "next/link";

export const metadata = {
  title: "3.2 Mecanismos IPC de System V — Portafolio SO",
};

const toc = [
  { id: "intro", label: "Introducción" },
  { id: "tabla", label: "Resumen de llamadas IPC" },
  { id: "subsecciones", label: "Subsecciones" },
];

export default function Page() {
  return (
    <DocPage
      section="3.2"
      title="Mecanismos IPC derivados de System V"
      category="IPC · System V"
      readTime="5 min"
      toc={toc}
      prev={{
        href: "/apuntes/3/3.1_Tuberias/3.1.2_Fifo",
        label: "3.1.2 Tuberías con nombre (FIFO)",
      }}
      next={{
        href: "/apuntes/3/3.2_SystemV/3.2.1_Llaves",
        label: "3.2.1 Llaves",
      }}
    >
      <DocH2 id="intro">Introducción</DocH2>
      <DocP>
        El paquete de comunicación entre procesos de UNIX System V y derivados,
        como GNU/Linux, se compone de <strong>tres</strong> mecanismos:
      </DocP>
      <DocUl>
        <DocLi>
          <span>
            Los <strong>semáforos</strong>, que permiten sincronizar procesos.
          </span>
        </DocLi>
        <DocLi>
          <span>
            La <strong>memoria compartida</strong>, que permite a los procesos
            compartir su espacio de direcciones virtuales.
          </span>
        </DocLi>
        <DocLi>
          <span>
            Las <strong>colas de mensajes</strong>, que posibilitan el
            intercambio de datos con un formato determinado.
          </span>
        </DocLi>
      </DocUl>
      <DocP>
        Estos mecanismos están implementados como una unidad y comparten
        características comunes: una tabla con entradas que describen el uso
        del mecanismo, una <strong>llave numérica</strong> elegida por el
        usuario para cada entrada, una llamada <em>get</em> para crear o
        recuperar una entrada, un registro de permisos por entrada y una
        llamada de <em>control</em> para leer, modificar o liberar la entrada.
      </DocP>

      <DocH2 id="tabla">Resumen de llamadas IPC</DocH2>
      <div className="overflow-x-auto my-6 border border-border rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-surf-high">
            <tr>
              <th className="text-left px-4 py-2 font-mono text-xs text-muted">
                Operación
              </th>
              <th className="text-left px-4 py-2 font-mono text-xs text-primary">
                Semáforos
              </th>
              <th className="text-left px-4 py-2 font-mono text-xs text-primary">
                Memoria compartida
              </th>
              <th className="text-left px-4 py-2 font-mono text-xs text-primary">
                Cola de mensajes
              </th>
            </tr>
          </thead>
          <tbody className="text-text-dim">
            <tr className="border-t border-border">
              <td className="px-4 py-2">Cabecera común</td>
              <td className="px-4 py-2 font-mono text-xs" colSpan={3}>
                &lt;sys/types.h&gt;, &lt;sys/ipc.h&gt;
              </td>
            </tr>
            <tr className="border-t border-border">
              <td className="px-4 py-2">Cabecera específica</td>
              <td className="px-4 py-2 font-mono text-xs">&lt;sys/sem.h&gt;</td>
              <td className="px-4 py-2 font-mono text-xs">&lt;sys/shm.h&gt;</td>
              <td className="px-4 py-2 font-mono text-xs">&lt;sys/msg.h&gt;</td>
            </tr>
            <tr className="border-t border-border">
              <td className="px-4 py-2">Crear / abrir</td>
              <td className="px-4 py-2 font-mono text-xs">semget</td>
              <td className="px-4 py-2 font-mono text-xs">shmget</td>
              <td className="px-4 py-2 font-mono text-xs">msgget</td>
            </tr>
            <tr className="border-t border-border">
              <td className="px-4 py-2">Control</td>
              <td className="px-4 py-2 font-mono text-xs">semctl</td>
              <td className="px-4 py-2 font-mono text-xs">shmctl</td>
              <td className="px-4 py-2 font-mono text-xs">msgctl</td>
            </tr>
            <tr className="border-t border-border">
              <td className="px-4 py-2">Operación</td>
              <td className="px-4 py-2 font-mono text-xs">semop</td>
              <td className="px-4 py-2 font-mono text-xs">shmat, shmdt</td>
              <td className="px-4 py-2 font-mono text-xs">msgsnd, msgrcv</td>
            </tr>
          </tbody>
        </table>
      </div>

      <DocNote>
        Todos los mecanismos System V identifican sus recursos mediante una{" "}
        <strong>llave</strong> de tipo <code>key_t</code>, típicamente generada
        con <code>ftok()</code>. Procesos distintos que conozcan la llave
        pueden compartir el mismo recurso aunque no estén emparentados.
      </DocNote>

      <DocH2 id="subsecciones">Subsecciones</DocH2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-4">
        <Link
          href="/apuntes/3/3.2_SystemV/3.2.1_Llaves"
          className="group flex flex-col bg-surf-low border border-border rounded-lg p-4 hover:border-primary transition-colors"
        >
          <span className="font-mono text-[11px] text-muted mb-1">§ 3.2.1</span>
          <span className="text-sm font-semibold text-text-base group-hover:text-primary transition-colors mb-1">
            Llaves
          </span>
          <span className="text-xs text-text-dim leading-relaxed">
            Generación de identificadores únicos con ftok().
          </span>
        </Link>
        <Link
          href="/apuntes/3/3.2_SystemV/3.2.2_Semaforos"
          className="group flex flex-col bg-surf-low border border-border rounded-lg p-4 hover:border-primary transition-colors"
        >
          <span className="font-mono text-[11px] text-muted mb-1">§ 3.2.2</span>
          <span className="text-sm font-semibold text-text-base group-hover:text-primary transition-colors mb-1">
            Semáforos en System V
          </span>
          <span className="text-xs text-text-dim leading-relaxed">
            Sincronización atómica con semget / semctl / semop.
          </span>
        </Link>
      </div>
    </DocPage>
  );
}