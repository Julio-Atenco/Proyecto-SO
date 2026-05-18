import DocPage, {
  DocH2,
  DocH3,
  DocP,
  DocNote,
  CodeBlock,
  InlineCode,
} from "@/components/DocPage";

export const metadata = {
  title: "5.10 Funciones de Memoria | Portafolio SO",
};

const toc = [
  { id: "sysinfo", label: "Función sysinfo()" },
  { id: "estructura-sysinfo", label: "Estructura sysinfo" },
  { id: "ejemplo-sysinfo", label: "Ejemplo sysinfo" },
  { id: "mmap", label: "Funciones mmap() y munmap()" },
];

export default function Page() {
  return (
    <DocPage
      section="5.10"
      title="Funciones para Conocer la Memoria del Sistema"
      category="Administración de Memoria"
      prev={{ href: "/apuntes/5/5.9_Memoria_Virtual", label: "5.9 Memoria Virtual" }}
      next={{ href: "/apuntes/6/6.1_Introduccion_SA", label: "6.1 Introducción SA" }}
      toc={toc}
    >
      <DocH2 id="sysinfo">5.10.1 Función sysinfo()</DocH2>
      <DocP>
        La función <InlineCode>sysinfo()</InlineCode> retorna información
        estadística sobre la memoria principal, la memoria swap y el promedio de
        carga del sistema.
      </DocP>
      <CodeBlock
        filename="prototipo_sysinfo.c"
        code={`#include <sys/sysinfo.h>
int sysinfo(struct sysinfo *info);`}
      />
      <DocP>
        Si el llamado fue exitoso, rellena la estructura{" "}
        <InlineCode>sysinfo</InlineCode> apuntada por <InlineCode>info</InlineCode>.
        La información proviene de <InlineCode>/proc/meminfo</InlineCode> y{" "}
        <InlineCode>/proc/loadavg</InlineCode>.
      </DocP>

      <DocH2 id="estructura-sysinfo">Estructura sysinfo</DocH2>
      <CodeBlock
        filename="struct_sysinfo.c"
        code={`struct sysinfo {
    long          uptime;      // Segundos desde el boot
    unsigned long loads[3];    // Carga promedio: 1, 5 y 15 minutos
    unsigned long totalram;    // Tamaño total de RAM disponible
    unsigned long freeram;     // RAM disponible actualmente
    unsigned long sharedram;   // Memoria compartida
    unsigned long bufferram;   // Memoria usada por los buffers
    unsigned long totalswap;   // Tamaño total del área de swap
    unsigned long freeswap;    // Espacio de swap disponible
    unsigned short procs;      // Número de procesos actuales
    unsigned long totalhigh;   // Tamaño total de memoria alta
    unsigned long freehigh;    // Memoria alta disponible
    unsigned int  mem_unit;    // Tamaño de la unidad de memoria en bytes
};`}
      />

      <DocH2 id="ejemplo-sysinfo">Ejemplo: información estadística del sistema</DocH2>
      <CodeBlock
        filename="info_sistema.c"
        code={`#include <stdio.h>
#include <stdlib.h>
#include <sys/sysinfo.h>

#define minuto 60
#define hora   (minuto * 60)
#define dia    (hora   * 24)
#define KB     1024

int main()
{
    struct sysinfo si;
    sysinfo(&si);

    printf("Tiempo del sistema: %ld dias, %ld:%02ld:%02ld\\n",
           si.uptime / dia,
           (si.uptime % dia)  / hora,
           (si.uptime % hora) / minuto,
           si.uptime % minuto);

    printf("Total RAM : %ld KB\\n", si.totalram  / KB);
    printf("Libre RAM : %ld KB\\n", si.freeram   / KB);
    printf("Swap total: %ld KB\\n", si.totalswap / KB);
    printf("Procesos  : %d\\n",    si.procs);

    return EXIT_SUCCESS;
}`}
      />

      <DocH2 id="mmap">5.10.2 Funciones mmap() y munmap()</DocH2>
      <DocP>
        <InlineCode>mmap()</InlineCode> crea una nueva asignación en el espacio
        de direcciones virtuales del proceso que la invoca.{" "}
        <InlineCode>munmap()</InlineCode> elimina esa asignación y libera las
        páginas físicas asociadas.
      </DocP>
      <CodeBlock
        filename="prototipo_mmap.c"
        code={`#include <sys/mman.h>

void *mmap(void   *addr,    // Dirección sugerida (o NULL para que el SO elija)
           size_t  length,  // Longitud de la asignación (> 0)
           int     prot,    // Protección: PROT_READ, PROT_WRITE, PROT_EXEC
           int     flags,   // MAP_SHARED, MAP_PRIVATE, MAP_ANONYMOUS, ...
           int     fd,      // Descriptor del archivo (o -1 con MAP_ANONYMOUS)
           off_t   offset); // Desplazamiento dentro del archivo

int munmap(void *addr, size_t length);`}
      />

      <DocH3 id="proc-maps">Archivos de consulta en /proc</DocH3>
      <DocP>
        Se pueden consultar los siguientes archivos del sistema para visualizar
        la información de asignación de cada proceso:
      </DocP>
      <CodeBlock
        filename="terminal"
        code={`# Sustituyendo [pid] por el identificador del proceso
cat /proc/[pid]/maps        # Regiones de memoria del proceso
cat /proc/[pid]/smaps       # Información detallada de cada región
ls  /proc/[pid]/map_files   # Archivos mapeados en memoria

# Información de secciones de la RAM física
sudo cat /proc/iomem`}
      />
      <DocNote>
        <InlineCode>mmap()</InlineCode> es la base de muchas técnicas avanzadas:
        carga dinámica de bibliotecas (<InlineCode>.so</InlineCode>), E/S de
        archivos de alto rendimiento, memoria compartida entre procesos y
        asignación de memoria de gran tamaño sin pasar por{" "}
        <InlineCode>malloc()</InlineCode>.
      </DocNote>
    </DocPage>
  );
}
