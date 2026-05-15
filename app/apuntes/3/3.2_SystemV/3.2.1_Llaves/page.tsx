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
  title: "3.2.1 Llaves IPC — Portafolio SO",
};

const toc = [
  { id: "teoria", label: "Teoría" },
  { id: "prototipo", label: "Prototipo de ftok" },
  { id: "codigo", label: "Código de ejemplo" },
  { id: "ejecucion", label: "Ejecución y salida" },
  { id: "reflexion", label: "Reflexión" },
];

const llavesC = `/* ============================================================
   3.2.1 Llaves IPC con ftok()
   Compilar: gcc -Wall llaves.c -o llaves
   Ejecutar: ./llaves
============================================================ */
#include <stdio.h>
#include <stdlib.h>
#include <sys/types.h>
#include <sys/ipc.h>

int main(void)
{
    key_t llave1, llave2, llave3;

    /* Tres llaves a partir de la misma ruta pero distinto proj_id */
    llave1 = ftok("/tmp", 'a');
    llave2 = ftok("/tmp", 'b');
    llave3 = ftok("/tmp", 'a');             /* igual a la llave1 */

    if (llave1 == -1 || llave2 == -1 || llave3 == -1) {
        perror("ftok");
        exit(EXIT_FAILURE);
    }

    printf("Llave generada con /tmp y 'a' = 0x%08x\\n", llave1);
    printf("Llave generada con /tmp y 'b' = 0x%08x\\n", llave2);
    printf("Llave generada con /tmp y 'a' = 0x%08x (igual a la 1)\\n", llave3);

    return EXIT_SUCCESS;
}`;

const salida = `$ gcc -Wall llaves.c -o llaves
$ ./llaves
Llave generada con /tmp y 'a' = 0x61000155
Llave generada con /tmp y 'b' = 0x62000155
Llave generada con /tmp y 'a' = 0x61000155 (igual a la 1)`;

export default function Page() {
  return (
    <DocPage
      section="3.2.1"
      title="Llaves"
      category="IPC · System V"
      readTime="5 min"
      toc={toc}
      prev={{
        href: "/apuntes/3/3.2_SystemV",
        label: "3.2 Mecanismos IPC de System V",
      }}
      next={{
        href: "/apuntes/3/3.2_SystemV/3.2.2_Semaforos",
        label: "3.2.2 Semáforos en System V",
      }}
    >
      <DocH2 id="teoria">Teoría</DocH2>
      <DocP>
        Todas las formas de IPC, excepto las tuberías sin nombre, tienen
        asociado un espacio de nombres para llevar a cabo el intercambio. Para
        los mecanismos System V (cola de mensajes, memoria compartida y
        semáforos) ese identificador es una <strong>llave</strong> de tipo{" "}
        <InlineCode>key_t</InlineCode>, típicamente un entero de 32 bits.
      </DocP>
      <DocP>
        En GNU C, las llaves se crean con la función{" "}
        <InlineCode>ftok()</InlineCode>, que combina una ruta y un identificador
        de proyecto para producir un valor único. Los procesos que quieren
        compartir un mismo mecanismo deben generar la <em>misma llave</em>{" "}
        usando la misma ruta y el mismo <InlineCode>proj_id</InlineCode>.
      </DocP>

      <DocH2 id="prototipo">Prototipo de ftok</DocH2>
      <CodeBlock filename="prototipo.h" code={`#include <sys/types.h>
#include <sys/ipc.h>

key_t ftok(const char *pathname, int proj_id);`} />
      <DocP>
        <InlineCode>pathname</InlineCode> es el nombre de un archivo ordinario
        existente y accesible; <InlineCode>proj_id</InlineCode> es un entero
        cuyo byte menos significativo se combina con los datos del archivo. En
        caso de error la función retorna <strong>-1</strong>.
      </DocP>
      <DocP>
        La implementación combina los 8 bits menos significativos de{" "}
        <InlineCode>proj_id</InlineCode> con el número de i-nodo del archivo y
        el número menor del dispositivo donde reside, produciendo una llave
        única de 32 bits. Esa llave puede luego pasarse a{" "}
        <InlineCode>semget()</InlineCode>, <InlineCode>shmget()</InlineCode> y{" "}
        <InlineCode>msgget()</InlineCode>.
      </DocP>

      <DocH2 id="codigo">Código de ejemplo</DocH2>
      <CodeBlock filename="llaves.c" lang="c" code={llavesC} />

      <DocH2 id="ejecucion">Ejecución y salida</DocH2>
      <CodeBlock filename="salida" lang="bash" code={salida} />

      <DocH3 id="observaciones">Observaciones</DocH3>
      <DocUl>
        <DocLi>
          <span>
            La llave 1 y la llave 3 son idénticas: misma ruta y mismo{" "}
            <InlineCode>proj_id</InlineCode> producen el mismo valor.
          </span>
        </DocLi>
        <DocLi>
          <span>
            Cambiar solo el <InlineCode>proj_id</InlineCode> (de{" "}
            <InlineCode>&apos;a&apos;</InlineCode> a{" "}
            <InlineCode>&apos;b&apos;</InlineCode>) produce una llave distinta,
            de modo que en un mismo directorio pueden coexistir varios recursos
            IPC.
          </span>
        </DocLi>
      </DocUl>

      <DocNote>
        Si el archivo indicado en <code>pathname</code> se borra y se vuelve a
        crear, su i-nodo cambia y <code>ftok()</code> producirá una llave
        distinta aunque el nombre sea el mismo. Por eso conviene apuntar a un
        archivo estable, como el propio ejecutable.
      </DocNote>

      <DocH2 id="reflexion">Reflexión</DocH2>
      <DocP>
        Las llaves son el pegamento que une a los procesos no emparentados con
        un recurso IPC. Comprender <InlineCode>ftok()</InlineCode> es
        indispensable antes de pasar a semáforos, memoria compartida o colas,
        porque las tres APIs dependen de ella para localizar el recurso.
      </DocP>
    </DocPage>
  );
}