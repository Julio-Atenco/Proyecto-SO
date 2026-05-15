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
  title: "2.2 Crear procesos — BitácoraSO",
};

const toc = [
  { id: "teoria", label: "Teoría" },
  { id: "prototipo", label: "Prototipo de fork" },
  { id: "valor-retorno", label: "Valor de retorno" },
  { id: "herencia", label: "Herencia padre→hijo" },
  { id: "codigo", label: "Código de ejemplo" },
  { id: "ejecucion", label: "Ejecución y salida" },
  { id: "reflexion", label: "Reflexión" },
];

const forkCowC = `/* 2.2 fork() con copy-on-write
   Compilar: gcc -Wall fork_cow.c -o fork_cow
   Ejecutar: ./fork_cow                                              */
#include <stdio.h>
#include <stdlib.h>
#include <sys/types.h>
#include <unistd.h>

int main(void) {
    int x = 0;
    pid_t pid;
    pid = fork();
    if (pid == 0) {
        /* Proceso hijo */
        x = 5;
        printf("Hijo:  PID=%ld, x=%d\\n", (long)getpid(), x);
    } else {
        /* Proceso padre */
        x = 10;
        printf("Padre: PID=%ld, x=%d\\n", (long)getpid(), x);
    }
    return EXIT_SUCCESS;
}`;

const salida = `$ gcc -Wall fork_cow.c -o fork_cow
$ ./fork_cow
Padre: PID=667, x=10
Hijo:  PID=668, x=5`;

export default function Page() {
  return (
    <DocPage
      section="2.2"
      title="Crear procesos"
      category="Procesos e Hilos"
      readTime="9 min"
      toc={toc}
      prev={{
        href: "/apuntes/2/2.1_Introduccion_Procesos",
        label: "2.1 Introducción a procesos",
      }}
      next={{
        href: "/apuntes/2/2.4_Identificar_Procesos",
        label: "2.4 Identificar procesos",
      }}
    >
      <DocH2 id="teoria">Teoría</DocH2>
      <DocP>
        En GNU/Linux la creación de procesos se realiza a través de la llamada
        al sistema <InlineCode>fork()</InlineCode>. Permite que un proceso
        existente, llamado <strong>padre</strong>, cree un nuevo proceso
        llamado <strong>hijo</strong>. Tras la ejecución de fork(), el kernel
        crea un nuevo descriptor de proceso y establece una relación de
        parentesco entre ambos.
      </DocP>
      <DocP>
        Desde el punto de vista lógico, el hijo recibe una copia del espacio
        de direcciones del padre. En implementaciones modernas esta copia se
        realiza con la técnica de <strong>copy-on-write</strong> (COW), por
        lo que las páginas de memoria no se duplican físicamente hasta que
        alguno de los procesos intenta modificarlas, optimizando el uso de
        memoria.
      </DocP>

      <DocH2 id="prototipo">Prototipo de fork</DocH2>
      <CodeBlock filename="prototipo.h" code={`#include <sys/types.h>
#include <unistd.h>

pid_t fork(void);`} />

      <DocH2 id="valor-retorno">Valor de retorno</DocH2>
      <DocP>
        Ambos procesos continúan su ejecución a partir de la instrucción
        siguiente a la llamada, pero con diferentes valores de retorno, lo que
        permite distinguirlos:
      </DocP>
      <DocUl>
        <DocLi>
          <span>
            En el <strong>hijo</strong>, el valor devuelto es <InlineCode>0</InlineCode>.
          </span>
        </DocLi>
        <DocLi>
          <span>
            En el <strong>padre</strong>, el valor devuelto es un entero
            mayor que cero: el PID del hijo.
          </span>
        </DocLi>
        <DocLi>
          <span>
            En caso de <strong>error</strong>, retorna <InlineCode>-1</InlineCode>{" "}
            y no se crea ningún hijo.
          </span>
        </DocLi>
      </DocUl>

      <DocNote>
        En sistemas UNIX los PID se asignan de forma incremental hasta un
        valor máximo configurable en{" "}
        <InlineCode>/proc/sys/kernel/pid_max</InlineCode>. En arquitecturas de
        64 bits suele ser 4 194 303.
      </DocNote>

      <DocH2 id="herencia">Herencia padre → hijo</DocH2>
      <DocP>
        El hijo hereda la mayoría de los atributos del padre:
      </DocP>
      <DocUl>
        <DocLi><span>El entorno de ejecución.</span></DocLi>
        <DocLi><span>Los privilegios y credenciales.</span></DocLi>
        <DocLi><span>Los descriptores de archivos y dispositivos abiertos.</span></DocLi>
        <DocLi><span>La prioridad y los atributos de planificación.</span></DocLi>
      </DocUl>
      <DocP>Sin embargo, hay atributos que <strong>no</strong> se heredan:</DocP>
      <DocUl>
        <DocLi><span>El hijo recibe un PID distinto.</span></DocLi>
        <DocLi><span>Los tiempos de uso de CPU del hijo se inicializan en cero.</span></DocLi>
        <DocLi><span>No hereda los bloqueos mantenidos por el padre.</span></DocLi>
        <DocLi><span>Las alarmas establecidas por el padre no generan notificaciones en el hijo.</span></DocLi>
        <DocLi><span>El hijo comienza sin señales pendientes.</span></DocLi>
      </DocUl>

      <DocH2 id="codigo">Código de ejemplo</DocH2>
      <DocP>
        El valor de retorno de <InlineCode>fork()</InlineCode> se usa para que
        cada proceso modifique la variable <InlineCode>x</InlineCode> de
        manera distinta, forzando la duplicación física de la página de
        memoria (COW):
      </DocP>
      <CodeBlock filename="fork_cow.c" lang="c" code={forkCowC} />

      <DocH2 id="ejecucion">Ejecución y salida</DocH2>
      <CodeBlock filename="salida" lang="bash" code={salida} />
      <DocP>
        El orden en que aparecen las líneas no es determinista: depende del
        planificador. Lo importante es que cada proceso imprime su propio PID
        y su propia copia de <InlineCode>x</InlineCode>.
      </DocP>

      <DocH2 id="reflexion">Reflexión</DocH2>
      <DocP>
        El mecanismo de <InlineCode>fork()</InlineCode> es elegantemente
        simple: una sola llamada que retorna en dos procesos distintos. La
        técnica <em>copy-on-write</em> lo vuelve además eficiente, lo que
        explica por qué sigue siendo el modelo de creación de procesos de UNIX
        cincuenta años después de su diseño original.
      </DocP>
    </DocPage>
  );
}