import DocPage, {
  DocH2,
  DocH3,
  DocP,
  DocUl,
  DocLi,
  DocNote,
  CodeBlock,
  InlineCode,
} from "@/components/DocPage";

export const metadata = {
  title: "2.5 wait() — BitácoraSO",
};

const toc = [
  { id: "teoria", label: "Teoría" },
  { id: "prototipo", label: "Prototipos" },
  { id: "macros", label: "Macros de análisis" },
  { id: "codigo", label: "Código de ejemplo" },
  { id: "ejecucion", label: "Ejecución y salida" },
  { id: "reflexion", label: "Reflexión" },
];

const waitC = `/* 2.5 wait()
   Compilar: gcc -Wall wait_demo.c -o wait_demo
   Ejecutar: ./wait_demo                                              */
#include <sys/types.h>
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
    }
    else if (hijo == 0) {
        fprintf(stderr, "soy el hijo con pid = %ld\\n", (long)getpid());
    }
    else if (wait(&estado) != hijo) {
        fprintf(stderr, "una senal debio interrumpir la espera\\n");
    }
    else {
        fprintf(stderr, "soy el padre con pid = %ld e hijo con pid = %ld\\n",
                (long)getpid(), (long)hijo);
    }
    exit(EXIT_SUCCESS);
}`;

const salida = `$ gcc -Wall wait_demo.c -o wait_demo
$ ./wait_demo
soy el hijo con pid = 682
soy el padre con pid = 681 e hijo con pid = 682`;

export default function Page() {
  return (
    <DocPage
      section="2.5"
      title="wait()"
      category="Procesos e Hilos"
      readTime="8 min"
      toc={toc}
      prev={{
        href: "/apuntes/2/2.4_Identificar_Procesos",
        label: "2.4 Identificar procesos",
      }}
      next={{
        href: "/apuntes/2/2.5_Wait/2.5.1_Waitpid",
        label: "2.5.1 waitpid()",
      }}
    >
      <DocH2 id="teoria">Teoría</DocH2>
      <DocP>
        Tras la ejecución de <InlineCode>fork()</InlineCode>, padre e hijo
        siguen su ejecución concurrentemente y cualquiera puede terminar
        primero. Si el padre desea esperar a que su hijo termine, debe invocar{" "}
        <InlineCode>wait()</InlineCode> o, de manera más general,{" "}
        <InlineCode>waitpid()</InlineCode>. Estas llamadas notifican al padre
        la finalización del hijo, le permiten recuperar su estado de
        terminación y evitan la aparición de procesos zombi.
      </DocP>
      <DocP>
        La llamada <InlineCode>wait()</InlineCode> suspende al proceso
        invocante hasta que ocurre alguno de estos eventos:
      </DocP>
      <DocUl>
        <DocLi><span>Uno de sus hijos termina su ejecución.</span></DocLi>
        <DocLi><span>Un hijo se detiene.</span></DocLi>
        <DocLi><span>El proceso que invoca recibe una señal.</span></DocLi>
      </DocUl>
      <DocP>
        Si el proceso no tiene hijos, <InlineCode>wait()</InlineCode> retorna
        inmediatamente. Si un hijo ya había terminado y aún no se había
        recogido, también retorna de inmediato.
      </DocP>

      <DocH2 id="prototipo">Prototipos</DocH2>
      <CodeBlock filename="prototipos.h" code={`#include <sys/types.h>
#include <sys/wait.h>

pid_t wait    (int *stat_loc);
pid_t waitpid (pid_t pid, int *wstatus, int options);`} />
      <DocP>
        Si <InlineCode>wait()</InlineCode> retorna por la terminación o
        detención de un hijo, el valor de retorno es positivo y corresponde
        al PID de ese hijo. En caso de error retorna <InlineCode>-1</InlineCode>{" "}
        y establece <InlineCode>errno</InlineCode>. Valores comunes de errno:
      </DocP>
      <DocUl>
        <DocLi>
          <span>
            <InlineCode>ECHILD</InlineCode> — el proceso no tiene hijos.
          </span>
        </DocLi>
        <DocLi>
          <span>
            <InlineCode>EINTR</InlineCode> — la llamada fue interrumpida por
            una señal.
          </span>
        </DocLi>
      </DocUl>

      <DocH2 id="macros">Macros de análisis del estado</DocH2>
      <DocP>
        El parámetro <InlineCode>stat_loc</InlineCode> es un apuntador a un
        entero donde el kernel almacena información sobre la terminación.
        Para analizarlo se usan macros definidos en{" "}
        <InlineCode>&lt;sys/wait.h&gt;</InlineCode>:
      </DocP>
      <DocUl>
        <DocLi>
          <span>
            <InlineCode>WIFEXITED(*stat_loc)</InlineCode> — verdadero si el
            hijo terminó normalmente.
          </span>
        </DocLi>
        <DocLi>
          <span>
            <InlineCode>WEXITSTATUS(*stat_loc)</InlineCode> — si terminó
            normalmente, los 8 bits menos significativos del valor pasado a
            exit().
          </span>
        </DocLi>
        <DocLi>
          <span>
            <InlineCode>WIFSIGNALED(*stat_loc)</InlineCode> — verdadero si
            terminó por una señal no capturada.
          </span>
        </DocLi>
        <DocLi>
          <span>
            <InlineCode>WTERMSIG(*stat_loc)</InlineCode> — número de la señal
            que terminó al hijo.
          </span>
        </DocLi>
      </DocUl>

      <DocH2 id="codigo">Código de ejemplo</DocH2>
      <CodeBlock filename="wait_demo.c" lang="c">
        {waitC}
      </CodeBlock>

      <DocH2 id="ejecucion">Ejecución y salida</DocH2>
      <CodeBlock filename="salida" lang="bash">
        {salida}
      </CodeBlock>
      <DocP>
        El padre se bloquea en <InlineCode>wait()</InlineCode> y solo imprime
        su mensaje <em>después</em> de que el hijo terminó. Por eso el orden
        de aparición es siempre el mismo.
      </DocP>

      <DocH2 id="reflexion">Reflexión</DocH2>
      <DocP>
        <InlineCode>wait()</InlineCode> es el punto de sincronización más
        básico entre padre e hijo. Sin él, el padre puede terminar antes que
        el hijo (el hijo queda huérfano) o el hijo termina sin que nadie
        recoja su estado (queda zombi). Es buena práctica que todo{" "}
        <InlineCode>fork()</InlineCode> tenga un <InlineCode>wait()</InlineCode>{" "}
        correspondiente, o un manejador de <InlineCode>SIGCHLD</InlineCode>{" "}
        que lo haga asíncronamente.
      </DocP>
    </DocPage>
  );
}