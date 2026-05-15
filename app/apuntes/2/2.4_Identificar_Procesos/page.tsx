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
  title: "2.4 Identificar procesos — BitácoraSO",
};

const toc = [
  { id: "teoria", label: "Teoría" },
  { id: "prototipos", label: "Prototipos" },
  { id: "descriptores", label: "Descriptores estándar" },
  { id: "codigo", label: "Código de ejemplo" },
  { id: "ejecucion", label: "Ejecución y salida" },
  { id: "reflexion", label: "Reflexión" },
];

const identC = `/* 2.4 Identificar procesos con getpid() y getppid()
   Compilar: gcc -Wall identifica.c -o identifica
   Ejecutar: ./identifica                                              */
#include <stdio.h>
#include <stdlib.h>
#include <sys/types.h>
#include <unistd.h>

int main(void) {
    pid_t hijo;
    hijo = fork();
    if (hijo == 0) {
        /* Proceso hijo */
        fprintf(stdout, "Soy el hijo,  PID=%ld, PPID=%ld\\n",
                (long)getpid(), (long)getppid());
    } else if (hijo > 0) {
        /* Proceso padre */
        fprintf(stdout, "Soy el padre, PID=%ld, PPID=%ld\\n",
                (long)getpid(), (long)getppid());
    } else {
        perror("fork"); return EXIT_FAILURE;
    }
    return EXIT_SUCCESS;
}`;

const salida = `$ gcc -Wall identifica.c -o identifica
$ ./identifica
Soy el hijo,  PID=675, PPID=674
Soy el padre, PID=674, PPID=661`;

export default function Page() {
  return (
    <DocPage
      section="2.4"
      title="Identificar procesos"
      category="Procesos e Hilos"
      readTime="7 min"
      toc={toc}
      prev={{
        href: "/apuntes/2/2.2_Crear_Procesos",
        label: "2.2 Crear procesos",
      }}
      next={{ href: "/apuntes/2/2.5_Wait", label: "2.5 wait()" }}
    >
      <DocH2 id="teoria">Teoría</DocH2>
      <DocP>
        Todo proceso en UNIX tiene asociado un identificador único llamado{" "}
        <strong>PID</strong> (<em>Process Identifier</em>), un entero positivo
        asignado por el kernel. Cada proceso mantiene también una referencia a
        su padre, identificado por el <strong>PPID</strong> (<em>Parent
        Process Identifier</em>).
      </DocP>
      <DocP>
        El tipo de dato <InlineCode>pid_t</InlineCode> representa estos
        identificadores. En la biblioteca GNU C es un entero con signo cuyo
        tamaño depende de la arquitectura.
      </DocP>

      <DocH2 id="prototipos">Prototipos</DocH2>
      <CodeBlock filename="prototipos.h">
{`#include <sys/types.h>
#include <unistd.h>

pid_t getpid (void);   /* PID del proceso que la invoca         */
pid_t getppid(void);   /* PID del padre del proceso actual      */
pid_t getpgrp(void);   /* PGID del grupo del proceso actual     */
pid_t setsid (void);   /* hace al proceso lider de nuevo grupo  */`}
      </CodeBlock>
      <DocP>
        Además de la relación padre–hijo, los procesos pueden organizarse en{" "}
        <strong>grupos de procesos</strong>, lo que permite al sistema
        gestionar de forma conjunta conjuntos relacionados (por ejemplo, los
        de una misma terminal). Para consultar el PGID se usa{" "}
        <InlineCode>getpgrp()</InlineCode>; para crear un nuevo grupo,{" "}
        <InlineCode>setsid()</InlineCode> (en implementaciones modernas suele
        usarse <InlineCode>setpgid()</InlineCode>).
      </DocP>

      <DocNote>
        Si un padre termina antes que sus hijos, estos no quedan sin control:
        el kernel los reasigna automáticamente al proceso con PID 1, que
        históricamente fue <strong>init</strong> y en GNU/Linux moderno suele
        ser <strong>systemd</strong>.
      </DocNote>

      <DocH2 id="descriptores">Descriptores estándar</DocH2>
      <DocP>
        A cada proceso UNIX se le asocia, por defecto, un conjunto de
        descriptores de archivo estándar:
      </DocP>
      <DocUl>
        <DocLi>
          <span>
            <strong>stdin</strong> (descriptor 0, constante{" "}
            <InlineCode>STDIN_FILENO</InlineCode>), típicamente el teclado.
          </span>
        </DocLi>
        <DocLi>
          <span>
            <strong>stdout</strong> (descriptor 1, constante{" "}
            <InlineCode>STDOUT_FILENO</InlineCode>), típicamente la pantalla.
          </span>
        </DocLi>
        <DocLi>
          <span>
            <strong>stderr</strong> (descriptor 2, constante{" "}
            <InlineCode>STDERR_FILENO</InlineCode>), también la pantalla pero
            separado de la salida estándar.
          </span>
        </DocLi>
      </DocUl>
      <DocP>
        Cuando se ejecuta <InlineCode>fork()</InlineCode>, el hijo hereda los
        descriptores abiertos del padre, por lo que ambos pueden imprimir en
        la terminal sin abrir explícitamente nada.
      </DocP>

      <DocH2 id="codigo">Código de ejemplo</DocH2>
      <CodeBlock filename="identifica.c" lang="c">
        {identC}
      </CodeBlock>

      <DocH2 id="ejecucion">Ejecución y salida</DocH2>
      <CodeBlock filename="salida" lang="bash">
        {salida}
      </CodeBlock>
      <DocP>
        Observe que el PPID del hijo (674) coincide con el PID del padre, y
        que el PPID del padre (661) corresponde al shell desde el que se
        lanzó el programa.
      </DocP>

      <DocH2 id="reflexion">Reflexión</DocH2>
      <DocP>
        Conocer el PID y el PPID es indispensable para implementar
        comunicación entre procesos: muchas señales y mecanismos IPC
        identifican al destinatario por su PID. Además, la cadena{" "}
        <InlineCode>getpid()</InlineCode> → <InlineCode>getppid()</InlineCode>{" "}
        → ... permite reconstruir el árbol de procesos hasta llegar a init.
      </DocP>
    </DocPage>
  );
}