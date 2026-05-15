import DocPage, {
  DocH2,
  DocH3,
  DocP,
  DocUl,
  DocLi,
  DocNote,
  InlineCode,
} from "@/components/DocPage";

export const metadata = {
  title: "2.1 Introducción a procesos — BitácoraSO",
};

const toc = [
  { id: "concepto", label: "Concepto de proceso" },
  { id: "modelo-5", label: "Modelo de 5 estados" },
  { id: "estados-unix", label: "Estados en UNIX" },
  { id: "task-struct", label: "task_struct en Linux" },
];

export default function Page() {
  return (
    <DocPage
      section="2.1"
      title="Introducción a procesos"
      category="Procesos e Hilos"
      readTime="8 min"
      toc={toc}
      prev={{ href: "/apuntes/1", label: "1. Sistema Operativo Linux" }}
      next={{
        href: "/apuntes/2/2.2_Crear_Procesos",
        label: "2.2 Crear procesos",
      }}
    >
      <DocH2 id="concepto">Concepto de proceso</DocH2>
      <DocP>
        Todos los sistemas de multiprogramación están construidos en torno al
        concepto de <strong>proceso</strong>. De manera simplificada, en un
        instante determinado un proceso puede estar ejecutándose en el
        procesador o fuera de él, a la espera de ser ejecutado. Bajo esta
        visión básica, un proceso se encuentra en uno de dos estados:{" "}
        <em>Ejecución</em> o <em>No ejecución</em>.
      </DocP>
      <DocP>
        Para administrar los procesos, el sistema operativo identifica a cada
        uno y mantiene información asociada como su estado actual, su
        ubicación en memoria y otros datos de control. Los procesos que no se
        encuentran en ejecución se almacenan en colas donde esperan su turno.
      </DocP>

      <DocH2 id="modelo-5">Modelo de 5 estados</DocH2>
      <DocP>
        El estado de <em>No ejecución</em> puede dividirse en{" "}
        <em>Listo</em> y <em>Bloqueado</em>. Si además se consideran los
        estados de creación y finalización se obtiene el clásico modelo de
        cinco estados:
      </DocP>
      <DocUl>
        <DocLi>
          <span>
            <strong>Nuevo.</strong> Proceso recién creado, aún no admitido por
            el sistema en el conjunto de procesos ejecutables.
          </span>
        </DocLi>
        <DocLi>
          <span>
            <strong>Listo.</strong> Preparado para ejecutar, esperando la
            asignación del procesador.
          </span>
        </DocLi>
        <DocLi>
          <span>
            <strong>Ejecución.</strong> Está siendo ejecutado por la CPU.
          </span>
        </DocLi>
        <DocLi>
          <span>
            <strong>Bloqueado.</strong> No puede continuar hasta que ocurra un
            evento (típicamente una operación de E/S o una llamada como{" "}
            <InlineCode>sleep</InlineCode>).
          </span>
        </DocLi>
        <DocLi>
          <span>
            <strong>Terminado.</strong> Retirado del conjunto de procesos
            ejecutables, ya sea por finalización normal o por aborto.
          </span>
        </DocLi>
      </DocUl>

      <DocH2 id="estados-unix">Estados en UNIX</DocH2>
      <DocP>
        En UNIX el diagrama es más detallado porque distingue entre modos de
        ejecución y agrega estados relacionados con gestión de memoria. Un
        proceso puede encontrarse:
      </DocP>
      <DocUl>
        <DocLi><span>Ejecutándose en modo usuario (código de aplicación).</span></DocLi>
        <DocLi><span>Ejecutándose en modo kernel (llamada al sistema o interrupción).</span></DocLi>
        <DocLi><span>Listo para ejecutarse, esperando que el kernel le asigne el procesador.</span></DocLi>
        <DocLi><span>Dormido en memoria, bloqueado a la espera de un evento.</span></DocLi>
        <DocLi><span>Listo pero suspendido, esperando al <em>swapper</em> (proceso 0).</span></DocLi>
        <DocLi><span>En transición, creado pero aún no preparado para ejecutar.</span></DocLi>
        <DocLi><span>Finalizando, ejecutando la llamada <InlineCode>exit</InlineCode>.</span></DocLi>
        <DocLi>
          <span>
            <strong>Zombi.</strong> Ya terminó, conserva una entrada en la
            tabla de procesos para que el padre recoja su código de salida e
            información estadística.
          </span>
        </DocLi>
      </DocUl>

      <DocH2 id="task-struct">task_struct en Linux</DocH2>
      <DocP>
        En GNU/Linux, el kernel representa a cada proceso mediante un
        descriptor llamado <InlineCode>task_struct</InlineCode>. El campo{" "}
        <InlineCode>p-&gt;state</InlineCode> puede tomar valores como:
      </DocP>
      <DocUl>
        <DocLi>
          <span>
            <InlineCode>TASK_RUNNING</InlineCode> — ejecutándose o listo.
          </span>
        </DocLi>
        <DocLi>
          <span>
            <InlineCode>TASK_INTERRUPTIBLE</InlineCode> — dormido, puede ser
            despertado por una señal.
          </span>
        </DocLi>
        <DocLi>
          <span>
            <InlineCode>TASK_UNINTERRUPTIBLE</InlineCode> — dormido sin
            poder ser despertado por señales.
          </span>
        </DocLi>
        <DocLi>
          <span>
            <InlineCode>TASK_STOPPED</InlineCode> — detenido.
          </span>
        </DocLi>
        <DocLi>
          <span>
            <InlineCode>TASK_TRACED</InlineCode> — siendo rastreado por un
            depurador.
          </span>
        </DocLi>
        <DocLi>
          <span>
            <InlineCode>EXIT_ZOMBIE</InlineCode> — terminado, sin recoger
            estado.
          </span>
        </DocLi>
        <DocLi>
          <span>
            <InlineCode>EXIT_DEAD</InlineCode> — completamente eliminado.
          </span>
        </DocLi>
      </DocUl>

      <DocNote>
        Cuando un proceso crea a otro, el creador se llama <strong>padre</strong>{" "}
        y el creado <strong>hijo</strong>. Esta relación es la base de toda la
        comunicación y cooperación que se estudia en el resto del capítulo.
      </DocNote>
    </DocPage>
  );
}