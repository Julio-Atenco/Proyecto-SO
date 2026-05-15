import DocPage, { DocH2, DocH3, DocP, DocUl, DocLi, DocNote, CodeBlock, InlineCode } from "@/components/DocPage";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "2.6 _exit() y exit() | Portafolio SO" };

const toc = [
  { id: "exit-bajo", label: "_exit()" },
  { id: "exit",      label: "exit()" },
  { id: "diferencia", label: "Diferencia clave" },
  { id: "ejemplo",   label: "Ejemplo" },
];

export default function Page() {
  return (
    <DocPage section="2.6" title="Sistema de Llamada _exit() y exit()"
      category="Procesos e Hilos" readTime="6 min" toc={toc}
      prev={{ href: "/apuntes/2/2.5_Wait/2.5.1_Waitpid", label: "waitpid()" }}
      next={{ href: "/apuntes/2/2.7_Estado_Zombi", label: "Estado Zombi" }}
    >
      <DocH2 id="exit-bajo">_exit() — terminación a nivel sistema</DocH2>
      <DocP>
        El proceso debe terminar de alguna manera: de forma normal o anormal. Para una terminación normal
        el proceso hace un llamado al sistema <InlineCode>_exit()</InlineCode>.
      </DocP>
      <CodeBlock filename="prototipo_exit_bajo.c" code={`#include <unistd.h>

void _exit(int status);`} />
      <DocP>
        El argumento <InlineCode>status</InlineCode> define el estado de terminación del proceso, disponible
        para el padre cuando invoca <InlineCode>wait()</InlineCode>. Solo los{" "}
        <strong className="text-text-base">8 bits finales</strong> del estado están disponibles para el padre.
      </DocP>
      <DocUl>
        <DocLi>Un estado de terminación de <InlineCode>0</InlineCode> indica que el proceso se completó correctamente.</DocLi>
        <DocLi>Un valor distinto de <InlineCode>0</InlineCode> indica que el proceso terminó con error.</DocLi>
      </DocUl>

      <DocH2 id="exit">exit() — terminación de alto nivel</DocH2>
      <CodeBlock filename="prototipo_exit.c" code={`#include <stdlib.h>

void exit(int status);`} />
      <DocP>
        <InlineCode>exit()</InlineCode> realiza varias acciones antes de llamar a <InlineCode>_exit()</InlineCode>:
      </DocP>
      <DocUl>
        <DocLi>Retira los recursos que está utilizando el proceso.</DocLi>
        <DocLi>Lo deja preparado para su eliminación.</DocLi>
        <DocLi>Lo quita del planificador.</DocLi>
        <DocLi>Indica su terminación al padre por medio de la señal <InlineCode>SIGCHLD</InlineCode>.</DocLi>
      </DocUl>
      <DocNote>
        En GNU/Linux, si el proceso que termina no tuviera padre (porque este acabó antes), se eliminaría
        directamente del planificador y sería adoptado por el proceso <InlineCode>1</InlineCode> (init/systemd).
      </DocNote>

      <DocH2 id="diferencia">Diferencia clave</DocH2>
      <DocUl>
        <DocLi><InlineCode>_exit()</InlineCode> es la llamada al sistema directa — termina inmediatamente sin ejecutar manejadores de salida (<InlineCode>atexit</InlineCode>) ni vaciar buffers de stdio.</DocLi>
        <DocLi><InlineCode>exit()</InlineCode> es la función de la biblioteca C — ejecuta primero los manejadores registrados con <InlineCode>atexit()</InlineCode>, vacía y cierra los streams de stdio, y luego llama a <InlineCode>_exit()</InlineCode>.</DocLi>
      </DocUl>

      <DocH2 id="ejemplo">Ejemplo práctico</DocH2>
      <CodeBlock filename="exit_ejemplo.c" code={`#include <sys/types.h>
#include <sys/wait.h>
#include <unistd.h>
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    pid_t hijo;
    int estado;

    if ((hijo = fork()) == -1) {
        perror("fallo el fork");
        exit(EXIT_FAILURE);
    } else if (hijo == 0) {
        fprintf(stderr, "soy el hijo con pid = %ld\\n", (long)getpid());
        exit(EXIT_SUCCESS);       /* Termina con código 0 */
    } else if (wait(&estado) != hijo)
        fprintf(stderr, "una señal debio interrumpir la espera\\n");
    else
        fprintf(stderr, "padre pid=%ld, hijo pid=%ld\\n",
                (long)getpid(), (long)hijo);

    exit(EXIT_SUCCESS);
}`} />
      <DocP>
        Desde el sistema GNU/Linux se puede consultar el valor devuelto por el último proceso que
        finalizó mediante la variable de entorno <InlineCode>$?</InlineCode> en la shell.
      </DocP>
    </DocPage>
  );
}
