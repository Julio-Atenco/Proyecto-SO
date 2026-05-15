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
  title: "2.5.1 waitpid() — BitácoraSO",
};

const toc = [
  { id: "teoria", label: "Teoría" },
  { id: "pid", label: "Parámetro pid" },
  { id: "options", label: "Parámetro options" },
  { id: "codigo", label: "Código de ejemplo" },
  { id: "ejecucion", label: "Ejecución y salida" },
  { id: "reflexion", label: "Reflexión" },
];

const waitpidC = `/* 2.5.1 waitpid() - varios hijos calculando factorial
   Compilar: gcc -Wall waitpid_demo.c -o waitpid_demo
   Ejecutar: ./waitpid_demo 5 6 7                                      */
#include <stdio.h>
#include <stdlib.h>
#include <sys/types.h>
#include <sys/wait.h>
#include <unistd.h>

int main(int argc, char *argv[]) {
    pid_t hijo[5];
    int estado, i, j;
    long factorial = 1;

    if (argc < 2) {
        fprintf(stderr, "Uso: %s <n1> <n2> ...\\n", argv[0]);
        return EXIT_FAILURE;
    }

    /* Crear un hijo por cada argumento */
    for (j = 0; j < argc - 1; j++) {
        if ((hijo[j] = fork()) == -1) {
            perror("fallo el fork"); exit(EXIT_FAILURE);
        }
        else if (hijo[j] == 0) {
            fprintf(stdout, "soy el hijo con pid = %ld\\n", (long)getpid());
            factorial = 1;
            for (i = atol(argv[j + 1]); i > 0; i--) factorial *= i;
            fprintf(stdout, "El factorial de %s es: %ld\\n", argv[j + 1], factorial);
            exit(EXIT_SUCCESS);
        }
    }
    /* El padre espera a todos */
    for (j = 0; j < argc - 1; j++) {
        if (waitpid(-1, &estado, 0) == -1)
            fprintf(stderr, "una senal debio interrumpir la espera\\n");
        else
            fprintf(stdout, "el hijo %d con pid %ld termino\\n", j, (long)hijo[j]);
    }
    exit(EXIT_SUCCESS);
}`;

const salida = `$ gcc -Wall waitpid_demo.c -o waitpid_demo
$ ./waitpid_demo 5 6 7
soy el hijo con pid = 689
El factorial de 5 es: 120
soy el hijo con pid = 690
El factorial de 6 es: 720
soy el hijo con pid = 691
El factorial de 7 es: 5040
el hijo 0 con pid 689 termino
el hijo 1 con pid 690 termino
el hijo 2 con pid 691 termino`;

export default function Page() {
  return (
    <DocPage
      section="2.5.1"
      title="waitpid()"
      category="Procesos e Hilos"
      readTime="8 min"
      toc={toc}
      prev={{ href: "/apuntes/2/2.5_Wait", label: "2.5 wait()" }}
      next={{
        href: "/apuntes/2/2.6_Exit_y__Exit",
        label: "2.6 _exit() y exit()",
      }}
    >
      <DocH2 id="teoria">Teoría</DocH2>
      <DocP>
        Cuando se requiere esperar por un hijo específico, o se necesita un
        control más fino, se usa <InlineCode>waitpid()</InlineCode>. Suspende
        al proceso actual hasta que el hijo especificado finaliza o hasta que
        ocurre un evento controlado por las opciones.
      </DocP>

      <DocH2 id="pid">Parámetro pid</DocH2>
      <DocUl>
        <DocLi>
          <span>
            <InlineCode>-1</InlineCode> — espera por cualquier hijo.
          </span>
        </DocLi>
        <DocLi>
          <span>
            <InlineCode>&gt; 0</InlineCode> — espera por el hijo cuyo PID sea
            igual a pid.
          </span>
        </DocLi>
        <DocLi>
          <span>
            <InlineCode>0</InlineCode> — espera por cualquier hijo cuyo grupo
            de procesos sea igual al del llamador.
          </span>
        </DocLi>
        <DocLi>
          <span>
            <InlineCode>&lt; 0</InlineCode> — espera por cualquier hijo cuyo
            PGID sea igual al valor absoluto de pid.
          </span>
        </DocLi>
      </DocUl>
      <DocP>
        El parámetro <InlineCode>*wstatus</InlineCode> cumple la misma función
        que <InlineCode>stat_loc</InlineCode> en <InlineCode>wait()</InlineCode>{" "}
        y se analiza con los mismos macros.
      </DocP>

      <DocH2 id="options">Parámetro options</DocH2>
      <DocP>
        Una combinación bit a bit de:
      </DocP>
      <DocUl>
        <DocLi>
          <span>
            <InlineCode>WEXITED</InlineCode> — espera por hijos que hayan
            terminado.
          </span>
        </DocLi>
        <DocLi>
          <span>
            <InlineCode>WSTOPPED</InlineCode> — espera por hijos detenidos
            por una señal.
          </span>
        </DocLi>
        <DocLi>
          <span>
            <InlineCode>WNOHANG</InlineCode> — retorna inmediatamente si
            ningún hijo ha terminado.
          </span>
        </DocLi>
        <DocLi>
          <span>
            <InlineCode>WNOWAIT</InlineCode> — no elimina al hijo de la tabla
            de procesos.
          </span>
        </DocLi>
        <DocLi>
          <span>
            <InlineCode>WUNTRACED</InlineCode> — retorna si un hijo se ha
            detenido, aunque no esté siendo trazado.
          </span>
        </DocLi>
        <DocLi>
          <span>
            <InlineCode>WCONTINUED</InlineCode> — retorna si un hijo reanudó
            su ejecución tras recibir SIGCONT.
          </span>
        </DocLi>
      </DocUl>

      <DocNote>
        Las banderas <InlineCode>WUNTRACED</InlineCode> y{" "}
        <InlineCode>WCONTINUED</InlineCode> solo tienen efecto si la opción{" "}
        <InlineCode>SA_NOCLDSTOP</InlineCode> no ha sido establecida para la
        señal <InlineCode>SIGCHLD</InlineCode>.
      </DocNote>

      <DocH2 id="codigo">Código de ejemplo</DocH2>
      <DocP>
        Programa que recibe varios enteros, lanza un hijo por cada uno para
        calcular su factorial, y el padre espera a todos con{" "}
        <InlineCode>waitpid(-1, ..., 0)</InlineCode>:
      </DocP>
      <CodeBlock filename="waitpid_demo.c" lang="c">
        {waitpidC}
      </CodeBlock>

      <DocH2 id="ejecucion">Ejecución y salida</DocH2>
      <CodeBlock filename="salida" lang="bash">
        {salida}
      </CodeBlock>

      <DocH2 id="reflexion">Reflexión</DocH2>
      <DocP>
        El uso correcto de <InlineCode>wait()</InlineCode> y{" "}
        <InlineCode>waitpid()</InlineCode> es esencial para sincronizar
        padres e hijos, recuperar códigos de terminación, evitar procesos
        zombi e implementar servidores concurrentes y gestores de tareas.
        Con <InlineCode>WNOHANG</InlineCode> se puede hacer{" "}
        <em>polling</em> sin bloquear; con un manejador de{" "}
        <InlineCode>SIGCHLD</InlineCode>, recolección asíncrona.
      </DocP>
    </DocPage>
  );
}