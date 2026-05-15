import DocPage, {
  DocH2,
  DocH3,
  DocP,
  DocUl,
  DocLi,
  DocNote,
  DocWarning,
  CodeBlock,
  InlineCode,
} from "@/components/DocPage";

export const metadata = {
  title: "2.7 Estado Zombi — BitácoraSO",
};

const toc = [
  { id: "teoria", label: "Teoría" },
  { id: "caso-malo", label: "Caso 1: zombi sin wait()" },
  { id: "caso-bueno", label: "Caso 2: corregido con wait()" },
  { id: "ejecucion", label: "Ejecución y salida" },
  { id: "observar", label: "Cómo observar zombis" },
  { id: "reflexion", label: "Reflexión" },
];

const zombiMaloC = `/* 2.7 Caso 1: el padre NO llama a wait() -> hijo queda zombi
   Compilar: gcc -Wall zombi_malo.c -o zombi_malo                     */
#include <stdio.h>
#include <stdlib.h>
#include <sys/types.h>
#include <unistd.h>

int main(void) {
    pid_t pid;
    pid = fork();
    if (pid == 0) {
        printf("Hijo terminado. PID=%ld\\n", (long)getpid());
        exit(EXIT_SUCCESS);
    } else {
        printf("Padre en ejecucion. PID=%ld\\n", (long)getpid());
        sleep(30);    /* el padre NO llama a wait() */
    }
    return EXIT_SUCCESS;
}`;

const zombiBuenoC = `/* 2.7 Caso 2: el padre llama a wait() -> no queda zombi
   Compilar: gcc -Wall zombi.c -o zombi                               */
#include <stdio.h>
#include <stdlib.h>
#include <sys/types.h>
#include <sys/wait.h>
#include <unistd.h>

int main(void) {
    pid_t pid;
    int status;
    pid = fork();
    if (pid == 0) {
        printf("Hijo terminado.  PID=%ld\\n", (long)getpid());
        exit(EXIT_SUCCESS);
    } else {
        wait(&status);                       /* recolecta al hijo */
        printf("Padre: hijo recolectado (no quedo zombi)\\n");
    }
    return EXIT_SUCCESS;
}`;

const salida = `$ gcc -Wall zombi.c -o zombi
$ ./zombi
Hijo terminado.  PID=705
Padre: hijo recolectado (no quedo zombi)`;

const psSalida = `# Mientras el padre duerme en zombi_malo, en otra terminal:
$ ps -el | grep Z
0 Z  1000  4823  4822  0  80  0 -  0    -      pts/1  00:00:00 zombi_malo <defunct>`;

export default function Page() {
  return (
    <DocPage
      section="2.7"
      title="Estado Zombi"
      category="Procesos e Hilos"
      readTime="7 min"
      toc={toc}
      prev={{
        href: "/apuntes/2/2.6_Exit_y__Exit",
        label: "2.6 _exit() y exit()",
      }}
      next={{ href: "/apuntes/2/2.8_Hilos", label: "2.8 Hilos" }}
    >
      <DocH2 id="teoria">Teoría</DocH2>
      <DocP>
        Un proceso <strong>zombi</strong> es un proceso que ya terminó su
        ejecución, pero su padre no ha recogido su estado de salida mediante{" "}
        <InlineCode>wait()</InlineCode> o <InlineCode>waitpid()</InlineCode>.
        El zombi no consume CPU ni memoria de usuario, pero{" "}
        <em>sí</em> ocupa una entrada en la tabla de procesos, conservando:
        PID, código de salida e información estadística mínima.
      </DocP>

      <DocWarning>
        Si un programa crea muchos hijos y nunca los recolecta, los zombis se
        acumulan y pueden agotar la tabla de procesos del sistema, impidiendo
        crear nuevos procesos. Es uno de los bugs clásicos en servidores
        concurrentes.
      </DocWarning>

      <DocH2 id="caso-malo">Caso 1: zombi sin wait()</DocH2>
      <DocP>
        El hijo termina inmediatamente, pero el padre duerme 30 segundos sin
        invocar <InlineCode>wait()</InlineCode>. Durante esos 30 segundos el
        hijo queda en estado <em>zombi</em>:
      </DocP>
      <CodeBlock filename="zombi_malo.c" lang="c">
        {zombiMaloC}
      </CodeBlock>
      <DocP>Paso a paso:</DocP>
      <DocUl>
        <DocLi><span>El padre crea un hijo con <InlineCode>fork()</InlineCode>.</span></DocLi>
        <DocLi><span>El hijo finaliza inmediatamente con <InlineCode>exit(0)</InlineCode>.</span></DocLi>
        <DocLi><span>El padre sigue vivo, pero no ejecuta <InlineCode>wait()</InlineCode>.</span></DocLi>
        <DocLi>
          <span>
            El kernel marca al hijo como <InlineCode>EXIT_ZOMBIE</InlineCode>{" "}
            y conserva su información para el padre.
          </span>
        </DocLi>
        <DocLi>
          <span>El hijo queda en estado zombi durante 30 segundos.</span>
        </DocLi>
      </DocUl>

      <DocH2 id="caso-bueno">Caso 2: corregido con wait()</DocH2>
      <DocP>
        El padre invoca <InlineCode>wait()</InlineCode> inmediatamente; el
        hijo nunca llega a estar en zombi observable:
      </DocP>
      <CodeBlock filename="zombi.c" lang="c">
        {zombiBuenoC}
      </CodeBlock>

      <DocH2 id="ejecucion">Ejecución y salida</DocH2>
      <CodeBlock filename="salida" lang="bash">
        {salida}
      </CodeBlock>

      <DocH2 id="observar">Cómo observar zombis</DocH2>
      <DocP>
        Mientras el padre del caso 1 duerme, desde otra terminal:
      </DocP>
      <CodeBlock filename="terminal" lang="bash">
        {psSalida}
      </CodeBlock>
      <DocP>
        La <strong>Z</strong> en la primera columna y la palabra{" "}
        <InlineCode>&lt;defunct&gt;</InlineCode> al final del nombre del
        comando son las marcas características de un proceso zombi.
      </DocP>

      <DocNote>
        Si el padre termina antes de recolectar al hijo, el zombi es heredado
        por <strong>init</strong> (PID 1), que se encarga de hacerle{" "}
        <InlineCode>wait()</InlineCode> automáticamente. Por eso los zombis
        rara vez persisten más allá de la vida del padre.
      </DocNote>

      <DocH2 id="reflexion">Reflexión</DocH2>
      <DocP>
        El estado zombi no es un error: es el mecanismo por el cual UNIX
        garantiza que el padre pueda enterarse de cómo terminó su hijo. El
        problema surge cuando el padre <em>no</em> llama a wait. Las dos
        soluciones prácticas son: (1) llamar a wait/waitpid en algún momento,
        o (2) instalar un manejador de <InlineCode>SIGCHLD</InlineCode> que
        recolecte automáticamente.
      </DocP>
    </DocPage>
  );
}