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
  title: "5.1 Introducción a la Administración de Memoria | Portafolio SO",
};

const toc = [
  { id: "introduccion", label: "Introducción" },
  { id: "herramientas", label: "Herramientas básicas" },
  { id: "tamano-pagina", label: "Tamaño de página" },
  { id: "funciones-c", label: "Funciones en C" },
];

export default function Page() {
  return (
    <DocPage
      section="5.1"
      title="Introducción a la Administración de Memoria"
      category="Administración de Memoria"
      prev={{ href: "/apuntes/3/3.5_Comandos_IPC", label: "3.5 Comandos IPC" }}
      next={{ href: "/apuntes/5/5.2_Sin_Intercambio", label: "5.2 Sin Intercambio" }}
      toc={toc}
    >
      <DocH2 id="introduccion">Introducción</DocH2>
      <DocP>
        Una de las tareas más importantes y complejas de un sistema operativo es
        la administración de memoria. Su gestión implica tratar la memoria
        principal como un recurso para asignarlo y compartirlo entre varios
        procesos activos, manteniendo en ella a la mayor cantidad posible. Para
        ello, el SO lleva un registro de las partes de memoria que se estén
        utilizando y aquellas que no, con la finalidad de asignar y liberar
        espacio a los procesos, así como administrar el intercambio entre la
        memoria principal y el disco cuando la RAM no pueda albergar a todos los
        procesos.
      </DocP>

      <DocH2 id="herramientas">Herramientas básicas</DocH2>
      <DocP>
        Las herramientas básicas de la administración de memoria son la{" "}
        <strong className="text-primary">paginación</strong> y la{" "}
        <strong className="text-secondary">segmentación</strong>:
      </DocP>
      <DocUl>
        <DocLi>
          <strong className="text-primary">Paginación:</strong> cada proceso se
          divide en páginas de tamaño constante y relativamente pequeño.
        </DocLi>
        <DocLi>
          <strong className="text-secondary">Segmentación:</strong> permite el
          uso de partes de tamaño variable.
        </DocLi>
        <DocLi>
          También es posible combinar ambas técnicas en un único esquema de
          administración de memoria.
        </DocLi>
      </DocUl>

      <DocH2 id="tamano-pagina">Tamaño de página en el sistema</DocH2>
      <DocP>
        La unidad mínima de memoria es la{" "}
        <strong className="text-tertiary">
          Entrada de la Tabla de Páginas (PTE)
        </strong>
        , que gestiona el mapeo entre memoria física y virtual. En la mayoría de
        las arquitecturas x86 y x86-64 el tamaño de página es de{" "}
        <strong className="text-primary">4 KB (4096 bytes)</strong>. Linux
        también admite HugePages de 2 MB a 1 GB para optimizar el rendimiento y
        reducir la carga del buffer de traducción anticipada (TLB).
      </DocP>
      <DocP>
        Para visualizar el tamaño de página en tu sistema puedes ejecutar en
        terminal:
      </DocP>
      <CodeBlock filename="terminal" code={`getconf PAGESIZE`} />

      <DocH2 id="funciones-c">Funciones en C para el tamaño de página</DocH2>
      <DocP>
        En lenguaje C se pueden utilizar las funciones{" "}
        <InlineCode>sysconf()</InlineCode> y <InlineCode>getpagesize()</InlineCode>{" "}
        para obtener el tamaño de página del sistema:
      </DocP>
      <CodeBlock
        filename="prototipo_sysconf.c"
        code={`#include <unistd.h>
long sysconf(int name);`}
      />
      <CodeBlock
        filename="prototipo_getpagesize.c"
        code={`#include <unistd.h>
int getpagesize(void);`}
      />

      <DocH3 id="ejemplo-pagesize">Ejemplo: obtener el tamaño de página</DocH3>
      <CodeBlock
        filename="tamano_pagina.c"
        code={`#include <stdlib.h>
#include <stdio.h>
#include <unistd.h>

int main()
{
    printf("Tamaño de página: %d \\n\\n", (int)sysconf(_SC_PAGESIZE));
    printf("Tamaño de página: %d \\n\\n", (int)getpagesize());
    return EXIT_SUCCESS;
}`}
      />
      <DocNote>
        Ambas funciones devuelven el mismo valor: el tamaño de página del
        sistema en bytes. En arquitecturas x86/x86-64 modernas el resultado
        típico es <InlineCode>4096</InlineCode>.
      </DocNote>
    </DocPage>
  );
}