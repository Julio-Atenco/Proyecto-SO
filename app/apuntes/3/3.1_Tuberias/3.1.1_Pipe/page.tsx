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
  title: "3.1.1 Tuberías sin nombre (pipe) — Portafolio SO",
};

const toc = [
  { id: "teoria", label: "Teoría" },
  { id: "prototipo", label: "Prototipo de la función" },
  { id: "codigo", label: "Código de ejemplo" },
  { id: "ejecucion", label: "Ejecución y salida" },
  { id: "reflexion", label: "Reflexión" },
];

const pipeC = `/* ============================================================
   3.1.1 Tuberías sin nombre - pipe
   Basado en el ejemplo de las notas "Un Vistazo a los SO"
   Compilar: gcc -Wall pipe.c -o pipe
   Ejecutar: ./pipe
============================================================ */
#include <stdio.h>
#include <stdlib.h>
#include <sys/types.h>
#include <unistd.h>
#include <sys/wait.h>
#define MAXLINEA 80

int main(void)
{
    int n, fd[2];
    pid_t hijo;
    char linea[MAXLINEA];

    if (pipe(fd) < 0) {
        fprintf(stderr, "error de pipe\\n");
        exit(EXIT_FAILURE);
    }

    if ((hijo = fork()) < 0) {
        fprintf(stderr, "error de fork\\n");
        exit(EXIT_FAILURE);
    }
    else if (hijo == 0) {
        /* HIJO: escribe en la tuberia */
        close(fd[0]);
        write(fd[1], "hola mundo desde el hijo\\n", 26);
        close(fd[1]);
        exit(EXIT_SUCCESS);
    }
    else {
        /* PADRE: lee de la tuberia */
        close(fd[1]);
        n = read(fd[0], linea, MAXLINEA);
        write(STDOUT_FILENO, linea, n);
        printf("Numero de bytes leidos: %d\\n", n);
        wait(NULL);
    }
    return EXIT_SUCCESS;
}`;

const salida = `$ gcc -Wall pipe.c -o pipe
$ ./pipe
hola mundo desde el hijo
Numero de bytes leidos: 26`;

export default function Page() {
  return (
    <DocPage
      section="3.1.1"
      title="Tuberías sin nombre (pipe)"
      category="IPC · Tuberías"
      readTime="7 min"
      toc={toc}
      prev={{
        href: "/apuntes/3/3.1_Tuberias",
        label: "3.1 Comunicación mediante tuberías",
      }}
      next={{
        href: "/apuntes/3/3.1_Tuberias/3.1.2_Fifo",
        label: "3.1.2 Tuberías con nombre (FIFO)",
      }}
    >
      <DocH2 id="teoria">Teoría</DocH2>
      <DocP>
        Las tuberías sin nombre, también llamadas <strong>pipe</strong>, son
        viejas formas de IPC y están disponibles en todos los sistemas UNIX y
        derivados. Su facilidad de uso es una ventaja, pero presentan dos
        limitaciones importantes:
      </DocP>
      <DocUl>
        <DocLi>
          <span>Los datos fluyen en una sola dirección.</span>
        </DocLi>
        <DocLi>
          <span>
            Solo pueden usarse entre procesos que tienen un ancestro común.
          </span>
        </DocLi>
      </DocUl>
      <DocP>
        Normalmente una tubería es creada por un proceso que después invoca a{" "}
        <InlineCode>fork()</InlineCode>, de manera que la usan el proceso
        creador y su descendiente. Una tubería se crea con la función{" "}
        <InlineCode>pipe()</InlineCode>.
      </DocP>

      <DocH2 id="prototipo">Prototipo de la función</DocH2>
      <CodeBlock filename="prototipo.h" code={`#include <unistd.h>

int pipe(int filedes[2]);`} />
      <DocP>
        El valor retornado es <strong>0</strong> si todo está correcto y{" "}
        <strong>-1</strong> si existe un error. Los dos descriptores se
        devuelven en <InlineCode>filedes</InlineCode>:{" "}
        <InlineCode>filedes[0]</InlineCode> se utiliza para abrir la tubería
        para <em>lectura</em> y <InlineCode>filedes[1]</InlineCode> para{" "}
        <em>escritura</em>. La salida de <InlineCode>filedes[1]</InlineCode> es
        la entrada de <InlineCode>filedes[0]</InlineCode>.
      </DocP>

      <DocNote>
        Cada extremo de la tubería que no se va a usar debe cerrarse. Si el
        proceso lector no cierra el extremo de escritura, una operación{" "}
        <InlineCode>read</InlineCode> nunca devolverá EOF aunque el otro lado
        ya haya terminado.
      </DocNote>

      <DocH2 id="codigo">Código de ejemplo</DocH2>
      <DocP>
        Programa para crear una tubería desde el padre, heredarla al hijo y
        enviar un mensaje del hijo al padre:
      </DocP>
      <CodeBlock filename="pipe.c" lang="c">
        {pipeC}
      </CodeBlock>

      <DocH2 id="ejecucion">Ejecución y salida</DocH2>
      <DocP>Compilación y ejecución en GNU/Linux:</DocP>
      <CodeBlock filename="salida" lang="bash">
        {salida}
      </CodeBlock>

      <DocH3 id="explicacion">¿Qué está pasando?</DocH3>
      <DocUl>
        <DocLi>
          <span>
            El padre crea la tubería con <InlineCode>pipe(fd)</InlineCode>{" "}
            antes del <InlineCode>fork()</InlineCode>, de modo que el hijo
            hereda ambos descriptores.
          </span>
        </DocLi>
        <DocLi>
          <span>
            El hijo cierra <InlineCode>fd[0]</InlineCode> (no va a leer) y
            escribe el mensaje.
          </span>
        </DocLi>
        <DocLi>
          <span>
            El padre cierra <InlineCode>fd[1]</InlineCode> (no va a escribir),
            lee con <InlineCode>read</InlineCode> y muestra el contenido en{" "}
            <InlineCode>STDOUT_FILENO</InlineCode>.
          </span>
        </DocLi>
      </DocUl>

      <DocH2 id="reflexion">Reflexión</DocH2>
      <DocP>
        El ejercicio deja claro por qué una tubería es <em>half-duplex</em> y
        por qué se debe cerrar cuidadosamente cada extremo en cada proceso.
        Para una comunicación <em>full-duplex</em> entre padre e hijo es
        necesario crear <strong>dos</strong> tuberías independientes, una para
        cada sentido.
      </DocP>
    </DocPage>
  );
}