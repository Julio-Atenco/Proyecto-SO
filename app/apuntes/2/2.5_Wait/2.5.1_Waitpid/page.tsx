import DocPage, { DocH2, DocP, DocUl, DocLi, DocNote, CodeBlock, InlineCode } from "@/components/DocPage";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "2.5.1 waitpid() | Portafolio SO" };

const toc = [
  { id: "prototipo", label: "Prototipo" },
  { id: "parametro-pid", label: "Parámetro pid" },
  { id: "opciones", label: "Opciones (flags)" },
  { id: "ejemplo",  label: "Ejemplo" },
];

export default function Page() {
  return (
    <DocPage section="2.5.1" title="Uso de waitpid()"
      category="Procesos e Hilos" readTime="7 min" toc={toc}
      prev={{ href: "/apuntes/2/2.5_Wait", label: "wait()" }}
      next={{ href: "/apuntes/2/2.6_Exit_y__Exit", label: "_exit() y exit()" }}
    >
      <DocH2 id="prototipo">Prototipo</DocH2>
      <DocP>
        Cuando se requiere esperar por un proceso hijo <strong className="text-text-base">específico</strong>,
        o se necesita un control más fino del comportamiento de espera, se usa{" "}
        <InlineCode>waitpid()</InlineCode>. Esta llamada suspende la ejecución del proceso actual hasta
        que el hijo especificado finaliza o hasta que ocurre un evento controlado por las opciones.
      </DocP>
      <CodeBlock filename="prototipo_waitpid.c" code={`#include <sys/types.h>
#include <sys/wait.h>

pid_t waitpid(pid_t pid, int *wstatus, int options);`} />

      <DocH2 id="parametro-pid">Parámetro pid</DocH2>
      <DocUl>
        <DocLi><InlineCode>-1</InlineCode> — espera por cualquier proceso hijo (igual a <InlineCode>wait()</InlineCode>).</DocLi>
        <DocLi><InlineCode>&gt; 0</InlineCode> — espera por el hijo cuyo PID sea igual a <InlineCode>pid</InlineCode>.</DocLi>
        <DocLi><InlineCode>0</InlineCode> — espera por cualquier hijo cuyo grupo de procesos sea igual al del proceso llamador.</DocLi>
        <DocLi><InlineCode>&lt; 0</InlineCode> — espera por cualquier hijo cuyo PGID sea igual al valor absoluto de <InlineCode>pid</InlineCode>.</DocLi>
      </DocUl>
      <DocNote>
        El parámetro <InlineCode>*wstatus</InlineCode> cumple la misma función que <InlineCode>stat_loc</InlineCode>{" "}
        en <InlineCode>wait()</InlineCode> y se analiza con los mismos macros (<InlineCode>WIFEXITED</InlineCode>,
        <InlineCode>WEXITSTATUS</InlineCode>, etc.).
      </DocNote>

      <DocH2 id="opciones">Opciones (flags)</DocH2>
      <DocUl>
        <DocLi><InlineCode>WEXITED</InlineCode> — espera por hijos que hayan terminado.</DocLi>
        <DocLi><InlineCode>WSTOPPED</InlineCode> — espera por hijos detenidos por una señal.</DocLi>
        <DocLi><InlineCode>WNOHANG</InlineCode> — retorna inmediatamente si ningún hijo ha terminado.</DocLi>
        <DocLi><InlineCode>WNOWAIT</InlineCode> — no elimina al hijo de la tabla de procesos.</DocLi>
        <DocLi><InlineCode>WUNTRACED</InlineCode> — retorna si un hijo se ha detenido.</DocLi>
        <DocLi><InlineCode>WCONTINUED</InlineCode> — retorna si un hijo reanudó su ejecución tras recibir <InlineCode>SIGCONT</InlineCode>.</DocLi>
      </DocUl>

      <DocH2 id="ejemplo">Ejemplo — waitpid con múltiples hijos</DocH2>
      <CodeBlock filename="waitpid_factorial.c" code={`#include <stdio.h>
#include <stdlib.h>
#include <sys/types.h>
#include <sys/wait.h>
#include <unistd.h>

int main(int argc, char *argv[]) {
    pid_t hijo[5];
    int estado, i, j;
    long factorial = 1;

    /* Crear un hijo por cada argumento */
    for (j = 0; j < argc - 1; j++) {
        if ((hijo[j] = fork()) == -1) {
            perror("fallo el fork");
            exit(EXIT_FAILURE);
        } else if (hijo[j] == 0) {
            fprintf(stdout, "soy el hijo con pid = %ld\\n", (long)getpid());
            for (i = atol(argv[j + 1]); i > 0; i--)
                factorial = factorial * i;
            fprintf(stdout, "El factorial es: %ld\\n", factorial);
            sleep(2);
            exit(EXIT_SUCCESS);
        }
    }

    /* Esperar a cada hijo */
    for (j = 0; j < argc - 1; j++) {
        if (waitpid(-1, &estado, 0) == -1)
            fprintf(stderr, "una señal debio interrumpir la espera\\n");
        else
            fprintf(stdout, "el hijo:%d con pid %ld termino\\n",
                    j, (long)hijo[j]);
    }
    exit(EXIT_SUCCESS);
}`} />

      <DocP>
        El uso correcto de <InlineCode>wait()</InlineCode> y <InlineCode>waitpid()</InlineCode> es esencial para:
        sincronizar procesos padre e hijo, recuperar códigos de terminación, evitar procesos zombi e
        implementar servidores concurrentes.
      </DocP>
    </DocPage>
  );
}
