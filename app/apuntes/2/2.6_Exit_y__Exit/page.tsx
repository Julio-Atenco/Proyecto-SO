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
  title: "2.6 _exit() y exit() — BitácoraSO",
};

const toc = [
  { id: "teoria", label: "Teoría" },
  { id: "prototipos", label: "Prototipos" },
  { id: "diferencia", label: "Diferencia entre exit y _exit" },
  { id: "codigo", label: "Código de ejemplo" },
  { id: "ejecucion", label: "Ejecución y salida" },
  { id: "reflexion", label: "Reflexión" },
];

const exitC = `/* 2.6 exit() devolviendo un codigo al padre
   Compilar: gcc -Wall exit_demo.c -o exit_demo
   Ejecutar: ./exit_demo                                              */
#include <stdio.h>
#include <stdlib.h>
#include <sys/types.h>
#include <sys/wait.h>
#include <unistd.h>

int main(void) {
    pid_t hijo;
    int estado;

    if ((hijo = fork()) == 0) {
        printf("[Hijo] termino con exit(7)\\n");
        exit(7);                /* el codigo 7 llega al padre */
    }

    wait(&estado);
    if (WIFEXITED(estado)) {
        printf("[Padre] el hijo finalizo normalmente, codigo = %d\\n",
               WEXITSTATUS(estado));
    } else {
        printf("[Padre] el hijo termino de forma anormal\\n");
    }
    return EXIT_SUCCESS;
}`;

const salida = `$ gcc -Wall exit_demo.c -o exit_demo
$ ./exit_demo
[Hijo] termino con exit(7)
[Padre] el hijo finalizo normalmente, codigo = 7`;

export default function Page() {
  return (
    <DocPage
      section="2.6"
      title="_exit() y exit()"
      category="Procesos e Hilos"
      readTime="7 min"
      toc={toc}
      prev={{
        href: "/apuntes/2/2.5_Wait/2.5.1_Waitpid",
        label: "2.5.1 waitpid()",
      }}
      next={{ href: "/apuntes/2/2.7_Estado_Zombi", label: "2.7 Estado Zombi" }}
    >
      <DocH2 id="teoria">Teoría</DocH2>
      <DocP>
        Todo proceso debe terminar de alguna manera, normal o anormal. Lo
        deseable es la terminación normal, para lo cual el proceso invoca al
        llamado del sistema <InlineCode>_exit()</InlineCode>. El argumento{" "}
        <InlineCode>status</InlineCode> define el estado de terminación que
        queda disponible para el padre cuando invoca a{" "}
        <InlineCode>wait()</InlineCode>. Aunque se define como entero, solo
        los 8 bits finales están disponibles para el padre. Por convención,
        un estado de 0 indica que el proceso se completó correctamente.
      </DocP>

      <DocH2 id="prototipos">Prototipos</DocH2>
      <CodeBlock filename="prototipos.h" code={`#include <unistd.h>
#include <stdlib.h>

void _exit (int status);   /* terminacion inmediata, sin limpieza */
void  exit (int status);   /* hace limpieza y luego llama a _exit */`} />

      <DocH2 id="diferencia">Diferencia entre exit() y _exit()</DocH2>
      <DocP>
        <InlineCode>_exit()</InlineCode> termina el proceso de manera
        inmediata, regresando el control al kernel. La función{" "}
        <InlineCode>exit()</InlineCode> realiza varias acciones antes de
        llamar a <InlineCode>_exit()</InlineCode>:
      </DocP>
      <DocUl>
        <DocLi>
          <span>Vacía los buffers de la biblioteca estándar de C.</span>
        </DocLi>
        <DocLi>
          <span>Cierra los archivos abiertos por la biblioteca.</span>
        </DocLi>
        <DocLi>
          <span>
            Ejecuta las funciones registradas con{" "}
            <InlineCode>atexit()</InlineCode> y{" "}
            <InlineCode>on_exit()</InlineCode>.
          </span>
        </DocLi>
        <DocLi>
          <span>
            Deja al proceso preparado para su eliminación, lo retira del
            planificador y notifica al padre con la señal{" "}
            <InlineCode>SIGCHLD</InlineCode>.
          </span>
        </DocLi>
      </DocUl>
      <DocP>
        Para pasar de un estado a otro, el sistema define un estado transitorio
        llamado <strong>zombi</strong>. Si el proceso que termina no tiene
        padre (porque acabó antes), es adoptado por <strong>init</strong>{" "}
        (PID 1) y eliminado directamente.
      </DocP>

      <DocNote>
        Desde el shell, el valor devuelto por el último proceso se consulta
        con <InlineCode>echo $?</InlineCode>. Por eso es buena práctica que
        los programas devuelvan códigos significativos:{" "}
        <InlineCode>EXIT_SUCCESS</InlineCode> (0) o{" "}
        <InlineCode>EXIT_FAILURE</InlineCode> (1).
      </DocNote>

      <DocH2 id="codigo">Código de ejemplo</DocH2>
      <DocP>
        El hijo termina con un código arbitrario (7) y el padre lo recupera
        mediante <InlineCode>WEXITSTATUS</InlineCode>:
      </DocP>
      <CodeBlock filename="exit_demo.c" lang="c">
        {exitC}
      </CodeBlock>

      <DocH2 id="ejecucion">Ejecución y salida</DocH2>
      <CodeBlock filename="salida" lang="bash">
        {salida}
      </CodeBlock>

      <DocH2 id="reflexion">Reflexión</DocH2>
      <DocP>
        Use siempre <InlineCode>exit()</InlineCode> en programas normales para
        que la limpieza de la biblioteca C se ejecute. Reserve{" "}
        <InlineCode>_exit()</InlineCode> para el código del proceso{" "}
        <em>hijo</em> tras un <InlineCode>fork()</InlineCode> en programas
        donde no quiera que se ejecuten dos veces los <InlineCode>atexit</InlineCode>{" "}
        del padre, o tras un fallo de <InlineCode>exec*()</InlineCode>.
      </DocP>
    </DocPage>
  );
}