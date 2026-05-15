import DocPage, {
  DocH2, DocH3, DocP, DocUl, DocLi,
  DocNote, DocWarning, CodeBlock, InlineCode,
} from "@/components/DocPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "2.1 Introducción a Procesos | Portafolio SO",
};

const toc = [
  { id: "concepto",  label: "Concepto de proceso" },
  { id: "pcb",       label: "Bloque de Control (PCB)" },
  { id: "estados",   label: "Estados de un proceso" },
  { id: "creacion",  label: "Creación de procesos" },
];

export default function Page() {
  return (
    <DocPage
      section="2.1"
      title="Introducción a Procesos"
      category="Procesos e Hilos"
      readTime="10 min"
      toc={toc}
      prev={{ href: "/docs/1_Introduccion_Sistema_Operativo", label: "Sistema Operativo Linux" }}
      next={{ href: "/docs/2_Procesos_Hilos/2.2_Crear_Procesos", label: "Crear procesos" }}
    >
      <DocH2 id="concepto">Concepto de proceso</DocH2>
      <DocP>
        Un <strong className="text-text-base">proceso</strong> es, en términos simples, un programa en ejecución.
        Mientras que un programa es un conjunto estático de instrucciones almacenado en disco,
        el proceso es la instancia activa de ese programa con su propio espacio de direcciones,
        pila, datos y recursos del sistema operativo.
      </DocP>
      <DocP>
        En Linux, cada proceso tiene asignado un número único llamado{" "}
        <InlineCode>PID</InlineCode> (Process Identifier). El proceso inicial del sistema es{" "}
        <InlineCode>init</InlineCode> (o <InlineCode>systemd</InlineCode> en distribuciones
        modernas) con PID 1, y todos los demás procesos descienden de él en forma de árbol.
      </DocP>
      <DocNote>
        Puedes ver el árbol de procesos en ejecución con el comando{" "}
        <InlineCode>pstree</InlineCode> o consultar los procesos activos con{" "}
        <InlineCode>ps aux</InlineCode>.
      </DocNote>

      <DocH2 id="pcb">Bloque de Control de Proceso (PCB)</DocH2>
      <DocP>
        El kernel mantiene una estructura de datos por cada proceso activo denominada{" "}
        <strong className="text-text-base">PCB</strong> (Process Control Block). En Linux esta
        estructura se llama <InlineCode>task_struct</InlineCode> y contiene, entre otros campos:
      </DocP>
      <DocUl>
        <DocLi><InlineCode>pid</InlineCode> — identificador del proceso</DocLi>
        <DocLi><InlineCode>ppid</InlineCode> — identificador del proceso padre</DocLi>
        <DocLi>Estado actual: corriendo, listo, bloqueado, etc.</DocLi>
        <DocLi>Contador de programa y registros del procesador</DocLi>
        <DocLi>Tabla de descriptores de archivo abiertos</DocLi>
        <DocLi>Información de gestión de memoria (mapa de páginas)</DocLi>
        <DocLi>Prioridad de planificación y estadísticas de uso de CPU</DocLi>
      </DocUl>

      <DocH2 id="estados">Estados de un proceso</DocH2>
      <DocP>
        Un proceso puede encontrarse en distintos estados durante su ciclo de vida:
      </DocP>
      <DocUl>
        <DocLi><strong className="text-text-base">Nuevo (new)</strong> — el proceso acaba de ser creado.</DocLi>
        <DocLi><strong className="text-text-base">Listo (ready)</strong> — espera en la cola de listos para obtener CPU.</DocLi>
        <DocLi><strong className="text-text-base">Corriendo (running)</strong> — está siendo ejecutado por la CPU.</DocLi>
        <DocLi><strong className="text-text-base">Bloqueado (waiting)</strong> — espera algún evento externo (E/S, señal).</DocLi>
        <DocLi><strong className="text-text-base">Terminado (terminated)</strong> — finalizó su ejecución; el PCB se libera al ser recolectado por el padre.</DocLi>
      </DocUl>

      <DocH2 id="creacion">Creación de procesos</DocH2>
      <DocP>
        En Linux la forma estándar de crear un nuevo proceso es mediante la llamada al sistema{" "}
        <InlineCode>fork()</InlineCode>. Esta llamada crea una <em>copia casi exacta</em> del proceso
        que la invoca. El proceso original se llama <strong className="text-text-base">padre</strong>{" "}
        y el nuevo proceso creado se llama <strong className="text-text-base">hijo</strong>.
      </DocP>
      <CodeBlock filename="fork_basico.c" code={`#include <stdio.h>
#include <unistd.h>

int main(void) {
    pid_t pid = fork();

    if (pid < 0) {
        perror("fork falló");
        return 1;
    } else if (pid == 0) {
        /* Proceso hijo */
        printf("Soy el hijo,  PID = %d\\n", getpid());
    } else {
        /* Proceso padre */
        printf("Soy el padre, PID = %d, hijo = %d\\n", getpid(), pid);
    }
    return 0;
}`} />
      <DocP>
        <InlineCode>fork()</InlineCode> retorna <InlineCode>0</InlineCode> al hijo y el{" "}
        <InlineCode>PID</InlineCode> del hijo al padre. Si falla retorna{" "}
        <InlineCode>-1</InlineCode>. Ambos procesos continúan ejecutando la siguiente instrucción
        después del <InlineCode>fork()</InlineCode> con espacios de memoria independientes (copia
        por escritura, <em>copy-on-write</em>).
      </DocP>
      <DocWarning>
        Sin llamar a <InlineCode>wait()</InlineCode> en el padre, el proceso hijo puede quedar en
        estado <strong className="text-text-base">Zombi</strong> al terminar. Ver sección 2.7.
      </DocWarning>
    </DocPage>
  );
}