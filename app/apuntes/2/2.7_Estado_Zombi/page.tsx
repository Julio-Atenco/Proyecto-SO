import DocPage, { DocH2, DocH3, DocP, DocUl, DocLi, DocNote, DocWarning, CodeBlock, InlineCode } from "@/components/DocPage";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "2.7 Estado Zombi | Portafolio SO" };

const toc = [
  { id: "que-es",    label: "¿Qué es un zombi?" },
  { id: "caso1",     label: "Caso 1: sin wait()" },
  { id: "caso2",     label: "Caso 2: con wait()" },
  { id: "huerfano",  label: "Proceso huérfano" },
];

export default function Page() {
  return (
    <DocPage section="2.7" title="Estado Zombi"
      category="Procesos e Hilos" readTime="8 min" toc={toc}
      prev={{ href: "/apuntes/2/2.6_Exit_y__Exit", label: "_exit() y exit()" }}
      next={{ href: "/apuntes/2/2.8_Hilos", label: "Hilos" }}
    >
      <DocH2 id="que-es">¿Qué es un proceso zombi?</DocH2>
      <DocP>
        Un proceso zombi es un proceso que ya terminó su ejecución, pero su proceso padre{" "}
        <strong className="text-text-base">no ha recogido su estado de salida</strong> mediante{" "}
        <InlineCode>wait()</InlineCode> o <InlineCode>waitpid()</InlineCode>.
      </DocP>
      <DocP>El proceso zombi:</DocP>
      <DocUl>
        <DocLi>No consume CPU ni memoria de usuario.</DocLi>
        <DocLi>Sí ocupa una entrada en la <strong className="text-text-base">tabla de procesos</strong>, conservando: PID, código de salida e información estadística mínima.</DocLi>
      </DocUl>
      <DocWarning>
        Si el padre nunca llama a <InlineCode>wait()</InlineCode> y crea muchos hijos, la tabla de procesos
        puede llenarse de zombis, impidiendo crear nuevos procesos en el sistema.
      </DocWarning>

      <DocH2 id="caso1">Caso 1 — Proceso zombi sin wait()</DocH2>
      <CodeBlock filename="zombi_sin_wait.c" code={`#include <stdio.h>
#include <stdlib.h>
#include <sys/types.h>
#include <unistd.h>

int main(void) {
    pid_t pid = fork();

    if (pid == 0) {
        /* Proceso hijo — termina de inmediato */
        printf("Hijo terminado. PID=%ld\\n", (long)getpid());
        exit(EXIT_SUCCESS);
    } else {
        /* Proceso padre — NO llama a wait() */
        printf("Padre en ejecucion. PID=%ld\\n", (long)getpid());
        sleep(30);
    }
    return EXIT_SUCCESS;
}`} />

      <DocP>Qué ocurre paso a paso:</DocP>
      <DocUl>
        <DocLi>El padre crea un hijo con <InlineCode>fork()</InlineCode>.</DocLi>
        <DocLi>El hijo finaliza inmediatamente con <InlineCode>exit(0)</InlineCode>.</DocLi>
        <DocLi>El padre sigue vivo, pero no ejecuta <InlineCode>wait()</InlineCode>.</DocLi>
        <DocLi>El kernel marca al hijo como <InlineCode>EXIT_ZOMBIE</InlineCode> y conserva su información.</DocLi>
        <DocLi>El proceso hijo queda en estado zombi durante 30 segundos.</DocLi>
      </DocUl>
      <DocNote>
        Para observar el zombi desde otra terminal mientras el padre duerme, ejecuta:{" "}
        <InlineCode>ps -el | grep Z</InlineCode>
      </DocNote>

      <DocH2 id="caso2">Caso 2 — Sin zombi usando wait()</DocH2>
      <CodeBlock filename="sin_zombi_con_wait.c" code={`#include <stdio.h>
#include <stdlib.h>
#include <sys/types.h>
#include <sys/wait.h>
#include <unistd.h>

int main(void) {
    pid_t pid;
    int status;

    pid = fork();

    if (pid == 0) {
        /* Proceso hijo */
        printf("Hijo terminado. PID=%ld\\n", (long)getpid());
        exit(EXIT_SUCCESS);
    } else {
        /* Proceso padre — recolecta al hijo */
        wait(&status);
        printf("Padre: hijo recolectado\\n");
    }
    return EXIT_SUCCESS;
}`} />

      <DocP>Qué ocurre ahora:</DocP>
      <DocUl>
        <DocLi>El hijo termina su ejecución.</DocLi>
        <DocLi>El kernel marca al hijo como terminado.</DocLi>
        <DocLi>El padre ejecuta <InlineCode>wait()</InlineCode>.</DocLi>
        <DocLi>El kernel entrega el estado de salida al padre y <strong className="text-text-base">elimina completamente al hijo</strong> de la tabla de procesos.</DocLi>
        <DocLi>No existe estado zombi.</DocLi>
      </DocUl>

      <DocH2 id="huerfano">Proceso huérfano</DocH2>
      <DocP>Si el proceso padre termina antes que el hijo:</DocP>
      <DocUl>
        <DocLi>El hijo se vuelve <strong className="text-text-base">huérfano</strong>.</DocLi>
        <DocLi>El kernel lo reasigna al proceso con PID 1 (<InlineCode>init</InlineCode> o <InlineCode>systemd</InlineCode>).</DocLi>
        <DocLi>PID 1 ejecuta <InlineCode>wait()</InlineCode> automáticamente.</DocLi>
        <DocLi>No queda zombi.</DocLi>
      </DocUl>
    </DocPage>
  );
}
