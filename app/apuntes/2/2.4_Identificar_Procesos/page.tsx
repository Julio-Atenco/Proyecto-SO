import DocPage, { DocH2, DocH3, DocP, DocUl, DocLi, DocNote, CodeBlock, InlineCode } from "@/components/DocPage";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "2.4 Identificar Procesos | Portafolio SO" };

const toc = [
  { id: "pid",      label: "getpid() y getppid()" },
  { id: "grupos",   label: "Grupos de procesos" },
  { id: "huerfanos", label: "Procesos huérfanos" },
  { id: "ejemplos", label: "Ejemplos" },
];

export default function Page() {
  return (
    <DocPage section="2.4" title="Sistema de Llamado para Identificar Procesos"
      category="Procesos e Hilos" readTime="8 min" toc={toc}
      prev={{ href: "/apuntes/2/2.2_Crear_Procesos", label: "Crear procesos" }}
      next={{ href: "/apuntes/2/2.5_Wait", label: "wait()" }}
    >
      <DocH2 id="pid">getpid() y getppid()</DocH2>
      <DocP>
        Todo proceso en un sistema tipo UNIX tiene asociado un identificador único denominado{" "}
        <strong className="text-text-base">PID</strong> (Process Identifier), un número entero positivo
        asignado por el kernel. Cada proceso también mantiene una referencia a su proceso padre mediante
        el <strong className="text-text-base">PPID</strong> (Parent Process Identifier).
      </DocP>

      <CodeBlock filename="prototipo_getpid.c" code={`#include <sys/types.h>
#include <unistd.h>

pid_t getpid(void);   /* Retorna PID del proceso actual  */
pid_t getppid(void);  /* Retorna PID del proceso padre   */`} />

      <DocP>
        El tipo <InlineCode>pid_t</InlineCode> es un entero con signo en la biblioteca GNU C, cuyo tamaño
        depende de la arquitectura del sistema.
      </DocP>

      <DocH2 id="grupos">Grupos de procesos</DocH2>
      <DocP>
        Los procesos pueden organizarse en <strong className="text-text-base">grupos de procesos</strong>,
        que permiten al SO gestionar de forma conjunta conjuntos de procesos relacionados (por ejemplo,
        los asociados a una misma sesión o terminal).
      </DocP>

      <CodeBlock filename="prototipo_grupos.c" code={`#include <sys/types.h>
#include <unistd.h>

pid_t getpgrp(void);   /* Retorna el PGID del proceso actual     */
pid_t setpgrp(void);   /* Convierte al proceso en líder de grupo */`} />

      <DocNote>
        <InlineCode>setpgrp()</InlineCode> establece el PID del proceso como su PGID, convirtiéndolo en
        líder del grupo. En implementaciones modernas, esta operación está respaldada por{" "}
        <InlineCode>setpgid()</InlineCode>.
      </DocNote>

      <DocH2 id="huerfanos">Procesos huérfanos</DocH2>
      <DocP>
        Si un proceso padre termina antes que sus hijos, estos no quedan sin control. El kernel reasigna
        automáticamente a los procesos <strong className="text-text-base">huérfanos</strong> al proceso
        con PID 1 — históricamente <InlineCode>init</InlineCode>, y en sistemas GNU/Linux modernos{" "}
        <InlineCode>systemd</InlineCode>. Este proceso adopta a los hijos y recoge su estado de terminación.
      </DocP>

      <DocH2 id="ejemplos">Ejemplos</DocH2>
      <DocH3>Ejemplo básico — imprimir PID de padre e hijo</DocH3>
      <CodeBlock filename="getpid_ejemplo.c" code={`#include <stdio.h>
#include <stdlib.h>
#include <sys/types.h>
#include <unistd.h>

int main(void) {
    pid_t hijo;

    hijo = fork();

    if (hijo == 0)
        fprintf(stdout, "Soy el hijo,  PID=%ld\\n", (long)getpid());
    else if (hijo > 0)
        fprintf(stdout, "Soy el padre, PID=%ld\\n", (long)getpid());
    else {
        perror("fork");
        return EXIT_FAILURE;
    }
    return EXIT_SUCCESS;
}`} />

      <DocH3>Cadena de procesos — estructura lineal P0 → P1 → P2 → ... → Pn</DocH3>
      <CodeBlock filename="cadena_procesos.c" code={`#include <stdio.h>
#include <stdlib.h>
#include <sys/types.h>
#include <unistd.h>

int main(void) {
    pid_t hijo;
    int n = 5;

    for (int i = 0; i < n; i++) {
        hijo = fork();
        if (hijo > 0)
            break;  /* El padre deja de crear más procesos */
        fprintf(stderr, "Proceso PID=%ld, PPID=%ld\\n",
                (long)getpid(), (long)getppid());
    }
    return EXIT_SUCCESS;
}`} />
      <DocUl>
        <DocLi>Solo el proceso hijo continúa el ciclo en cada iteración.</DocLi>
        <DocLi>El padre sale del ciclo con <InlineCode>break</InlineCode>.</DocLi>
        <DocLi>Se genera una cadena lineal; cada proceso tiene exactamente un hijo, excepto el último.</DocLi>
      </DocUl>

      <DocH3>Abanico de procesos — un padre, varios hijos</DocH3>
      <CodeBlock filename="abanico_procesos.c" code={`#include <stdio.h>
#include <stdlib.h>
#include <sys/types.h>
#include <unistd.h>

int main(void) {
    pid_t hijo;
    int n = 5;

    for (int i = 0; i < n; i++) {
        hijo = fork();
        if (hijo == 0)
            break;  /* El hijo no crea más procesos */
    }
    fprintf(stderr, "Proceso PID=%ld, PPID=%ld\\n",
            (long)getpid(), (long)getppid());
    return EXIT_SUCCESS;
}`} />
      <DocUl>
        <DocLi>Solo el proceso padre ejecuta el ciclo completo.</DocLi>
        <DocLi>Cada hijo ejecuta <InlineCode>break</InlineCode> y no genera más procesos.</DocLi>
        <DocLi>Se obtiene una estructura tipo <strong className="text-text-base">estrella (abanico)</strong>.</DocLi>
      </DocUl>
    </DocPage>
  );
}
