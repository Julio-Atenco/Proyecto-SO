import DocPage, { DocH2, DocH3, DocP, DocUl, DocLi, DocNote, DocWarning, CodeBlock, InlineCode } from "@/components/DocPage";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "2.5 wait() | Portafolio SO" };

const toc = [
  { id: "porque",   label: "¿Para qué sirve?" },
  { id: "prototipo", label: "Prototipo" },
  { id: "macros",   label: "Macros de estado" },
  { id: "ejemplo",  label: "Ejemplo" },
];

export default function Page() {
  return (
    <DocPage section="2.5" title="Sistema de Llamada wait()"
      category="Procesos e Hilos" readTime="8 min" toc={toc}
      prev={{ href: "/apuntes/2/2.4_Identificar_Procesos", label: "Identificar procesos" }}
      next={{ href: "/apuntes/2/2.5_Wait/2.5.1_Waitpid", label: "waitpid()" }}
    >
      <DocH2 id="porque">¿Para qué sirve wait()?</DocH2>
      <DocP>
        Tras la ejecución de <InlineCode>fork()</InlineCode>, tanto el padre como el hijo continúan
        de manera concurrente. Como consecuencia, el padre puede terminar antes que el hijo, o viceversa.
      </DocP>
      <DocP>
        Si el proceso padre desea esperar a que uno de sus hijos termine, debe invocar{" "}
        <InlineCode>wait()</InlineCode> o <InlineCode>waitpid()</InlineCode>. Estas llamadas permiten al
        SO notificar al padre la finalización de sus hijos y recuperar su{" "}
        <strong className="text-text-base">estado de terminación</strong>, evitando así la aparición
        de procesos zombi.
      </DocP>

      <DocH2 id="prototipo">Prototipo</DocH2>
      <CodeBlock filename="prototipo_wait.c" code={`#include <sys/types.h>
#include <sys/wait.h>

pid_t wait(int *stat_loc);`} />

      <DocP>
        La llamada <InlineCode>wait()</InlineCode> suspende la ejecución del proceso que la invoca hasta
        que ocurre alguno de estos eventos:
      </DocP>
      <DocUl>
        <DocLi>Uno de sus procesos hijos termina su ejecución.</DocLi>
        <DocLi>Un proceso hijo se detiene.</DocLi>
        <DocLi>El proceso que invoca <InlineCode>wait()</InlineCode> recibe una señal.</DocLi>
      </DocUl>
      <DocNote>
        <InlineCode>wait()</InlineCode> retorna inmediatamente si el proceso no tiene hijos. Si un hijo
        ya terminó antes de que el padre llame a <InlineCode>wait()</InlineCode>, también retorna de inmediato.
      </DocNote>

      <DocP>Cuando <InlineCode>wait()</InlineCode> retorna por terminación de un hijo:</DocP>
      <DocUl>
        <DocLi>El valor de retorno es positivo y corresponde al <strong className="text-text-base">PID del hijo</strong>.</DocLi>
        <DocLi>En caso de error retorna <InlineCode>-1</InlineCode>. Valores de <InlineCode>errno</InlineCode>:</DocLi>
      </DocUl>
      <DocUl>
        <DocLi><InlineCode>ECHILD</InlineCode> — el proceso no tiene hijos a los cuales esperar.</DocLi>
        <DocLi><InlineCode>EINTR</InlineCode> — la llamada fue interrumpida por una señal.</DocLi>
      </DocUl>

      <DocH2 id="macros">Macros para analizar el estado de terminación</DocH2>
      <DocP>
        El parámetro <InlineCode>stat_loc</InlineCode> apunta a una variable donde el kernel almacena
        el estado de terminación del hijo. Se analiza con los macros de <InlineCode>&lt;sys/wait.h&gt;</InlineCode>:
      </DocP>
      <DocUl>
        <DocLi><InlineCode>WIFEXITED(*stat_loc)</InlineCode> — verdadero si el hijo terminó de forma normal.</DocLi>
        <DocLi><InlineCode>WEXITSTATUS(*stat_loc)</InlineCode> — si terminó normalmente, obtiene los 8 bits menos significativos del valor pasado a <InlineCode>exit()</InlineCode>.</DocLi>
        <DocLi><InlineCode>WIFSIGNALED(*stat_loc)</InlineCode> — verdadero si el hijo terminó por una señal no capturada.</DocLi>
        <DocLi><InlineCode>WTERMSIG(*stat_loc)</InlineCode> — si terminó por señal, obtiene el número de dicha señal.</DocLi>
      </DocUl>

      <DocH2 id="ejemplo">Ejemplo</DocH2>
      <CodeBlock filename="wait_ejemplo.c" code={`#include <sys/types.h>
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
    } else if (hijo == 0)
        fprintf(stderr, "soy el hijo con pid = %ld\\n", (long)getpid());
    else if (wait(&estado) != hijo)
        fprintf(stderr, "una señal debio interrumpir la espera\\n");
    else
        fprintf(stderr, "soy el padre con pid = %ld e hijo con pid = %ld\\n",
                (long)getpid(), (long)hijo);

    exit(EXIT_SUCCESS);
}`} />
      <DocWarning>
        Sin <InlineCode>wait()</InlineCode>, el proceso hijo queda como <strong className="text-text-base">zombi</strong>{" "}
        en la tabla de procesos hasta que el padre termine. Ver sección 2.7 para más detalles.
      </DocWarning>
    </DocPage>
  );
}
