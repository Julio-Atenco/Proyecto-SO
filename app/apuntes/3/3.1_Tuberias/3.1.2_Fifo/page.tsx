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
  title: "3.1.2 Tuberías con nombre (FIFO) — Portafolio SO",
};

const toc = [
  { id: "teoria", label: "Teoría" },
  { id: "prototipo", label: "Prototipo de mkfifo" },
  { id: "codigo", label: "Código de ejemplo" },
  { id: "ejecucion", label: "Ejecución y salida" },
  { id: "reflexion", label: "Reflexión" },
];

const fifoC = `/* ============================================================
   3.1.2 Tuberias con nombre - FIFO
   Compilar: gcc -Wall fifo.c -o fifo
   Ejecutar: ./fifo
============================================================ */
#include <stdio.h>
#include <stdlib.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <unistd.h>
#include <sys/wait.h>

int main(void)
{
    pid_t hijo;
    int file;
    char mensaje[40];

    unlink("namepipe");
    umask(0);
    if (mkfifo("namepipe", 0666) == -1) {
        perror("error en mkfifo");
        exit(EXIT_FAILURE);
    }

    if ((hijo = fork()) == 0) {
        /* HIJO: escribe en el FIFO */
        fprintf(stdout, "soy el hijo,  ID = %ld\\n", (long)getpid());
        if ((file = open("namepipe", O_WRONLY)) == -1) {
            perror("error open WR");
            exit(EXIT_FAILURE);
        }
        write(file, "Mensaje del hijo via FIFO\\n", 27);
        close(file);
        exit(EXIT_SUCCESS);
    }
    if (hijo > 0) {
        /* PADRE: lee del FIFO */
        fprintf(stdout, "soy el padre, ID = %ld\\n", (long)getpid());
        if ((file = open("namepipe", O_RDONLY)) == -1) {
            perror("error open RD");
            exit(EXIT_FAILURE);
        }
        read(file, mensaje, sizeof(mensaje));
        fprintf(stdout, "El padre recibio: %s", mensaje);
        close(file);
        wait(NULL);
        unlink("namepipe");
    }
    return EXIT_SUCCESS;
}`;

const salida = `$ gcc -Wall fifo.c -o fifo
$ ./fifo
soy el hijo,  ID = 714
soy el padre, ID = 713
El padre recibio: Mensaje del hijo via FIFO`;

export default function Page() {
  return (
    <DocPage
      section="3.1.2"
      title="Tuberías con nombre (FIFO)"
      category="IPC · Tuberías"
      readTime="6 min"
      toc={toc}
      prev={{
        href: "/apuntes/3/3.1_Tuberias/3.1.1_Pipe",
        label: "3.1.1 Tuberías sin nombre (pipe)",
      }}
      next={{
        href: "/apuntes/3/3.2_SystemV",
        label: "3.2 Mecanismos IPC de System V",
      }}
    >
      <DocH2 id="teoria">Teoría</DocH2>
      <DocP>
        El sistema de llamado <InlineCode>mkfifo()</InlineCode> permite crear
        un archivo especial llamado <strong>FIFO</strong>: una tubería con un{" "}
        <em>nombre</em> asociado en el sistema de archivos. Esa es la
        diferencia con <InlineCode>pipe()</InlineCode>, que es anónima. Como el
        FIFO existe en una ruta del filesystem, cualquier proceso —emparentado
        o no— puede abrirlo, siempre que tenga los permisos adecuados.
      </DocP>

      <DocH2 id="prototipo">Prototipo de mkfifo</DocH2>
      <CodeBlock filename="prototipo.h">
{`#include <sys/types.h>
#include <sys/stat.h>

int mkfifo(const char *pathname, mode_t mode);`}
      </CodeBlock>
      <DocP>
        <InlineCode>pathname</InlineCode> es el nombre y ruta del archivo FIFO
        que se va a crear; <InlineCode>mode</InlineCode> son los permisos del
        archivo. Devuelve <strong>0</strong> en caso de éxito y{" "}
        <strong>-1</strong> en caso de error, con el código en{" "}
        <InlineCode>errno</InlineCode>.
      </DocP>

      <DocWarning>
        Un FIFO debe estar abierto en <strong>ambos extremos simultáneamente</strong> antes
        de poder hacer E/S. Abrirlo para leer bloquea hasta que algún otro
        proceso lo abra para escribir, y viceversa.
      </DocWarning>

      <DocH2 id="codigo">Código de ejemplo</DocH2>
      <DocP>
        Programa que crea una tubería con nombre y envía un mensaje del hijo al
        padre:
      </DocP>
      <CodeBlock filename="fifo.c" lang="c">
        {fifoC}
      </CodeBlock>

      <DocH2 id="ejecucion">Ejecución y salida</DocH2>
      <CodeBlock filename="salida" lang="bash">
        {salida}
      </CodeBlock>

      <DocH3 id="detalles">Detalles importantes</DocH3>
      <DocUl>
        <DocLi>
          <span>
            <InlineCode>unlink(&quot;namepipe&quot;)</InlineCode> borra una versión previa
            del FIFO si quedó de una ejecución anterior.
          </span>
        </DocLi>
        <DocLi>
          <span>
            <InlineCode>umask(0)</InlineCode> evita que la máscara por defecto
            recorte los permisos solicitados a <InlineCode>mkfifo</InlineCode>.
          </span>
        </DocLi>
        <DocLi>
          <span>
            Al terminar, el padre elimina el FIFO con{" "}
            <InlineCode>unlink</InlineCode> para no dejar residuos en el
            sistema de archivos.
          </span>
        </DocLi>
      </DocUl>

      <DocH2 id="reflexion">Reflexión</DocH2>
      <DocP>
        El FIFO es la generalización natural del pipe: agrega persistencia y
        un punto de encuentro independiente del parentesco. Por eso es la
        herramienta clásica para que un productor y un consumidor lanzados por
        separado se comuniquen, simplemente acordando una ruta común.
      </DocP>
      <DocNote>
        Aunque el FIFO vive en el sistema de archivos, los datos{" "}
        <em>no</em> se escriben a disco: el kernel los mantiene en memoria, de
        modo que el rendimiento es comparable al de un pipe ordinario.
      </DocNote>
    </DocPage>
  );
}