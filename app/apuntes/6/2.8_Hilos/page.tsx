import DocPage, { DocH2, DocH3, DocP, DocUl, DocLi, DocNote, CodeBlock, InlineCode } from "@/components/DocPage";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "2.8 Hilos | Portafolio SO" };

const toc = [
  { id: "concepto",  label: "¿Qué es un hilo?" },
  { id: "cuando",    label: "¿Cuándo usar hilos?" },
  { id: "posix",     label: "Modelo POSIX (pthreads)" },
  { id: "tabla",     label: "Funciones principales" },
];

export default function Page() {
  return (
    <DocPage section="2.8" title="Hilos (Threads)"
      category="Procesos e Hilos" readTime="9 min" toc={toc}
      prev={{ href: "/apuntes/2/2.7_Estado_Zombi", label: "Estado Zombi" }}
      next={{ href: "/apuntes/2/2.8_Hilos/2.8.2_Creacion_Hilos", label: "Creación de hilos" }}
    >
      <DocH2 id="concepto">¿Qué es un hilo?</DocH2>
      <DocP>
        Los hilos o <em>threads</em> representan un mecanismo de ejecución concurrente dentro de un mismo
        proceso, y constituyen una alternativa más <strong className="text-text-base">ligera</strong> que
        la creación de procesos independientes.
      </DocP>
      <DocP>
        A diferencia de los procesos, los hilos no son entidades completamente aisladas: comparten el mismo
        espacio de direcciones, los mismos archivos abiertos y otros recursos del proceso al que pertenecen.
        Aunque cada hilo tiene su propio:
      </DocP>
      <DocUl>
        <DocLi>Contador de programa.</DocLi>
        <DocLi>Stack (pila de ejecución).</DocLi>
        <DocLi>Registros del procesador.</DocLi>
      </DocUl>

      <DocH2 id="cuando">¿Cuándo usar hilos?</DocH2>
      <DocP>El uso de hilos resulta especialmente adecuado cuando se requiere:</DocP>
      <DocUl>
        <DocLi>Ejecutar múltiples tareas de manera concurrente.</DocLi>
        <DocLi>Compartir datos de forma eficiente sin mecanismos costosos de IPC.</DocLi>
        <DocLi>Reducir el overhead asociado a la creación y destrucción de procesos.</DocLi>
        <DocLi>Mejorar la capacidad de respuesta de aplicaciones interactivas.</DocLi>
        <DocLi>Aprovechar arquitecturas <strong className="text-text-base">multinúcleo</strong>.</DocLi>
      </DocUl>
      <DocNote>
        La diferencia fundamental: los procesos no comparten la misma memoria, mientras que los hilos sí
        la comparten totalmente. Para crear procesos se usa <InlineCode>fork()</InlineCode>; para crear
        hilos se usa la librería <InlineCode>pthread</InlineCode>.
      </DocNote>

      <DocH2 id="posix">Modelo de hilos en POSIX (pthreads)</DocH2>
      <DocP>
        Para trabajar con hilos en C se utiliza la librería <strong className="text-text-base">pthreads</strong>,
        parte del estándar POSIX (IEEE POSIX 1003.1-2008). Los hilos que cumplen este estándar se conocen
        como <em>POSIX Threads</em>.
      </DocP>
      <DocP>
        En el kernel Linux moderno, los hilos se implementan como entidades planificables de forma similar
        a los procesos, mediante el modelo <strong className="text-text-base">1:1</strong> (un hilo de
        usuario corresponde a una entidad del kernel).
      </DocP>

      <DocH3>Compilación con pthreads</DocH3>
      <CodeBlock filename="compilar.sh" lang="bash" code={`# Es necesario enlazar la librería pthread al compilar
gcc hilos.c -o hilos -lpthread
# o equivalentemente:
cc  hilos.c -o hilos -lpthread`} />

      <DocH2 id="tabla">Funciones principales de pthreads</DocH2>
      <div className="overflow-x-auto my-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 pr-6 font-mono text-xs text-muted uppercase tracking-wider">Categoría</th>
              <th className="text-left py-2 font-mono text-xs text-muted uppercase tracking-wider">Función POSIX</th>
            </tr>
          </thead>
          <tbody className="text-text-dim">
            {[
              ["Administración", "pthread_create, pthread_exit, pthread_kill, pthread_join, pthread_self"],
              ["Exclusión mutua", "pthread_mutex_init, pthread_mutex_destroy, pthread_mutex_lock, pthread_mutex_trylock, pthread_mutex_unlock"],
              ["Variables de condición", "pthread_cond_init, pthread_cond_destroy, pthread_cond_wait, pthread_cond_timedwait, pthread_cond_signal, pthread_cond_broadcast"],
            ].map(([cat, fns]) => (
              <tr key={cat} className="border-b border-border/50">
                <td className="py-2.5 pr-6 text-text-base font-medium">{cat}</td>
                <td className="py-2.5 font-mono text-xs text-secondary leading-relaxed">{fns}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DocPage>
  );
}