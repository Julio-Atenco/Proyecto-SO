import DocPage, { DocH2, DocH3, DocP, DocUl, DocLi, DocNote, DocWarning, CodeBlock, InlineCode } from "@/components/DocPage";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "2.2 Crear Procesos | Portafolio SO" };

const toc = [
  { id: "fork",      label: "La llamada fork()" },
  { id: "retorno",   label: "Valor de retorno" },
  { id: "herencia",  label: "Herencia del hijo" },
  { id: "ejemplos",  label: "Ejemplos" },
];

export default function Page() {
  return (
    <DocPage section="2.2" title="Sistema de Llamado para Crear Procesos"
      category="Procesos e Hilos" readTime="12 min" toc={toc}
      prev={{ href: "/apuntes/2/2.1_Introduccion_Procesos", label: "Introducción a procesos" }}
      next={{ href: "/apuntes/2/2.4_Identificar_Procesos", label: "Identificar procesos" }}
    >
      <DocH2 id="fork">La llamada al sistema fork()</DocH2>
      <DocP>
        En los sistemas GNU/Linux, la creación de procesos se realiza principalmente a través de la llamada
        al sistema <InlineCode>fork()</InlineCode>. Esta llamada permite que un proceso existente,
        denominado <strong className="text-text-base">proceso padre</strong>, cree un nuevo proceso llamado{" "}
        <strong className="text-text-base">proceso hijo</strong>.
      </DocP>
      <DocP>
        Desde el punto de vista lógico, el proceso hijo recibe una copia del espacio de direcciones del padre.
        Sin embargo, en implementaciones modernas de GNU/Linux esta copia se realiza utilizando la técnica de{" "}
        <strong className="text-text-base">copy-on-write (COW)</strong>: las páginas de memoria no se duplican
        físicamente hasta que alguno de los procesos intenta modificarlas.
      </DocP>

      <CodeBlock filename="prototipo_fork.c" code={`#include <sys/types.h>
#include <unistd.h>

pid_t fork(void);`} />

      <DocH2 id="retorno">Valor de retorno de fork()</DocH2>
      <DocP>
        El valor devuelto por <InlineCode>fork()</InlineCode> es el mecanismo fundamental para diferenciar
        el comportamiento del padre y del hijo:
      </DocP>
      <DocUl>
        <DocLi>En el <strong className="text-text-base">proceso hijo</strong>, el valor devuelto es <InlineCode>0</InlineCode>.</DocLi>
        <DocLi>En el <strong className="text-text-base">proceso padre</strong>, el valor devuelto es el PID del hijo (entero positivo).</DocLi>
        <DocLi>En caso de <strong className="text-text-base">error</strong>, <InlineCode>fork()</InlineCode> devuelve <InlineCode>-1</InlineCode> y no se crea ningún proceso hijo.</DocLi>
      </DocUl>
      <DocNote>
        En los sistemas UNIX, los PID se asignan de forma incremental. En GNU/Linux de 64 bits el valor
        máximo suele ser 4,194,303 y puede consultarse en <InlineCode>/proc/sys/kernel/pid_max</InlineCode>.
      </DocNote>

      <DocH2 id="herencia">Atributos heredados por el hijo</DocH2>
      <DocP>El proceso hijo hereda la mayoría de los atributos del padre, entre ellos:</DocP>
      <DocUl>
        <DocLi>El entorno de ejecución.</DocLi>
        <DocLi>Los privilegios y credenciales.</DocLi>
        <DocLi>Los descriptores de archivos y dispositivos abiertos.</DocLi>
        <DocLi>La prioridad y los atributos de planificación.</DocLi>
      </DocUl>
      <DocP>Sin embargo, algunos atributos <strong className="text-text-base">no</strong> son heredados:</DocP>
      <DocUl>
        <DocLi>El hijo recibe un PID distinto.</DocLi>
        <DocLi>Los tiempos de uso de CPU del hijo se inicializan en cero.</DocLi>
        <DocLi>El hijo no hereda los bloqueos mantenidos por el padre.</DocLi>
        <DocLi>Las alarmas del padre no generan notificaciones en el hijo.</DocLi>
        <DocLi>El hijo comienza sin señales pendientes.</DocLi>
      </DocUl>

      <DocH2 id="ejemplos">Ejemplos</DocH2>
      <DocH3>Ejemplo básico — mismo código en padre e hijo</DocH3>
      <CodeBlock filename="fork_basico.c" code={`#include <sys/types.h>
#include <stdlib.h>
#include <unistd.h>

int main(void) {
    int x = 0;
    fork();
    x = 1;   /* Ejecutado por AMBOS procesos */
    return EXIT_SUCCESS;
}`} />
      <DocP>
        Tras la ejecución de <InlineCode>fork()</InlineCode> existen dos procesos independientes. Ambos
        continúan ejecutando la instrucción siguiente, pero cada uno tiene su propio espacio de
        direcciones, por lo que la variable <InlineCode>x</InlineCode> es independiente en cada proceso.
      </DocP>

      <DocH3>Ejemplo con copy-on-write — diferenciando padre e hijo</DocH3>
      <CodeBlock filename="fork_cow.c" code={`#include <stdio.h>
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
}`} />
      <DocWarning>
        Sin llamar a <InlineCode>wait()</InlineCode> en el padre, el hijo puede quedar en estado{" "}
        <strong className="text-text-base">Zombi</strong> al terminar. Ver sección 2.7.
      </DocWarning>
    </DocPage>
  );
}
