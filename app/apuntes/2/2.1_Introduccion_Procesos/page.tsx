import DocPage, { DocH2, DocP, DocUl, DocLi, DocNote, InlineCode } from "@/components/DocPage";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "2.1 Introducción a Procesos | Portafolio SO" };

const toc = [
  { id: "concepto",     label: "Concepto de proceso" },
  { id: "cinco",        label: "Modelo de 5 estados" },
  { id: "unix",         label: "Estados en UNIX" },
  { id: "task-struct",  label: "task_struct en Linux" },
];

export default function Page() {
  return (
    <DocPage section="2.1" title="Introducción a Procesos"
      category="Procesos e Hilos" readTime="10 min" toc={toc}
      prev={{ href: "/apuntes/1", label: "Introducción al SO Linux" }}
      next={{ href: "/apuntes/2/2.2_Crear_Procesos", label: "Crear procesos" }}
    >
      <DocH2 id="concepto">Concepto de proceso</DocH2>
      <DocP>
        Todos los sistemas de multiprogramación están construidos en torno al concepto de proceso.
        De manera simplificada, en un instante determinado un proceso puede encontrarse ejecutándose
        en el procesador o fuera de él a la espera de ser ejecutado. Bajo esta visión básica, un proceso
        puede estar en uno de dos estados: <strong className="text-text-base">Ejecución</strong> o{" "}
        <strong className="text-text-base">No ejecución</strong>.
      </DocP>
      <DocP>
        Para administrar los procesos, el SO debe identificar a cada uno y mantener información asociada:
        su estado actual, su ubicación en memoria y otros datos de control. Los procesos que no están en
        ejecución se almacenan en <strong className="text-text-base">colas</strong>, donde esperan su turno
        para ser atendidos por el procesador.
      </DocP>

      <DocH2 id="cinco">Modelo de 5 estados</DocH2>
      <DocP>
        El estado de <em>No ejecución</em> se divide en <strong className="text-text-base">Listo</strong> y{" "}
        <strong className="text-text-base">Bloqueado</strong>. Al sumar los estados de creación y finalización
        se obtiene el modelo de cinco estados:
      </DocP>
      <DocUl>
        <DocLi>
          <strong className="text-text-base">Nuevo —</strong> proceso recién creado, aún no admitido
          en el conjunto de procesos ejecutables.
        </DocLi>
        <DocLi>
          <strong className="text-text-base">Listo —</strong> preparado para ejecutar, esperando
          la asignación del procesador.
        </DocLi>
        <DocLi>
          <strong className="text-text-base">Ejecución —</strong> siendo ejecutado actualmente por la CPU.
        </DocLi>
        <DocLi>
          <strong className="text-text-base">Bloqueado —</strong> no puede continuar hasta que ocurra
          un evento específico (E/S, señal). Se llega aquí con llamadas como <InlineCode>sleep()</InlineCode>.
        </DocLi>
        <DocLi>
          <strong className="text-text-base">Terminado —</strong> retirado del conjunto de procesos ejecutables
          por finalización normal o por aborto.
        </DocLi>
      </DocUl>

      <DocH2 id="unix">Estados de proceso en UNIX</DocH2>
      <DocP>
        En los sistemas UNIX el diagrama es más complejo. Un proceso puede encontrarse en alguno
        de los siguientes estados:
      </DocP>
      <DocUl>
        <DocLi>Ejecutándose en <strong className="text-text-base">modo usuario</strong> — ejecuta código de aplicación.</DocLi>
        <DocLi>Ejecutándose en <strong className="text-text-base">modo kernel</strong> — atiende una llamada al sistema o una interrupción.</DocLi>
        <DocLi>Listo para ejecutarse, pero no en ejecución, esperando que el kernel le asigne el procesador.</DocLi>
        <DocLi><strong className="text-text-base">Dormido en memoria</strong> — bloqueado y cargado en memoria, esperando un evento.</DocLi>
        <DocLi>Listo para ejecutarse pero <strong className="text-text-base">suspendido</strong>, esperando que el swapper lo cargue en memoria principal.</DocLi>
        <DocLi><strong className="text-text-base">Zombi</strong> — terminó su ejecución, no existe como entidad ejecutable, pero conserva una entrada en la tabla de procesos para que el padre pueda recuperar el código de salida.</DocLi>
      </DocUl>
      <DocNote>
        El estado zombi representa el estado final de un proceso en UNIX y desaparece únicamente cuando
        el proceso padre recoge su estado de terminación con <InlineCode>wait()</InlineCode>.
      </DocNote>

      <DocH2 id="task-struct">task_struct en Linux</DocH2>
      <DocP>
        En GNU/Linux, el kernel representa a cada proceso mediante un{" "}
        <strong className="text-text-base">descriptor de proceso</strong> definido por la estructura{" "}
        <InlineCode>task_struct</InlineCode>. Esta estructura contiene punteros a otras estructuras internas
        que, en conjunto, almacenan toda la información administrativa del proceso. El campo{" "}
        <InlineCode>p-&gt;state</InlineCode> puede tomar los siguientes valores principales:
      </DocP>
      <DocUl>
        <DocLi><InlineCode>TASK_RUNNING</InlineCode> — el proceso está ejecutándose o listo para ejecutarse.</DocLi>
        <DocLi><InlineCode>TASK_INTERRUPTIBLE</InlineCode> — dormido, puede ser despertado por una señal.</DocLi>
        <DocLi><InlineCode>TASK_UNINTERRUPTIBLE</InlineCode> — dormido, no puede ser despertado por señales.</DocLi>
        <DocLi><InlineCode>TASK_STOPPED</InlineCode> — el proceso ha sido detenido.</DocLi>
        <DocLi><InlineCode>TASK_TRACED</InlineCode> — siendo rastreado, por ejemplo, por un depurador.</DocLi>
        <DocLi><InlineCode>EXIT_ZOMBIE</InlineCode> — terminó, pero el padre aún no ha recogido su estado de salida.</DocLi>
        <DocLi><InlineCode>EXIT_DEAD</InlineCode> — completamente eliminado del sistema.</DocLi>
      </DocUl>
    </DocPage>
  );
}
