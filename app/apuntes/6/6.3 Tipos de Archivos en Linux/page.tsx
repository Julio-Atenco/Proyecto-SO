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
  title: "6.3 Tipos de Archivos en Linux | Portafolio SO",
};

const toc = [
  { id: "tipos", label: "Tipos de archivos" },
  { id: "ordinarios", label: "Archivos ordinarios" },
  { id: "directorios", label: "Directorios" },
  { id: "opendir-readdir", label: "opendir() y readdir()" },
  { id: "ejemplo-directorio", label: "Ejemplo: listar directorio" },
  { id: "dispositivos", label: "Archivos de dispositivos" },
  { id: "major-minor", label: "Funciones major() y minor()" },
  { id: "pipes", label: "Archivos de comunicación (pipes)" },
];

export default function Page() {
  return (
    <DocPage
      section="6.3"
      title="Tipos de Archivos en Linux"
      category="Sistema de Archivos"
      prev={{ href: "/apuntes/6/6.2_Estructura_Logica", label: "6.2 Estructura Lógica" }}
      next={{ href: "/apuntes/6/6.4_Dispositivos_ES", label: "6.4 Dispositivos E/S" }}
      toc={toc}
    >
      <DocH2 id="tipos">Tipos de archivos</DocH2>
      <DocP>
        En Linux existen cuatro tipos principales de archivos:
      </DocP>
      <div className="my-4 grid gap-3 sm:grid-cols-2">
        {[
          { num: "1", label: "Ordinarios / regulares", desc: "Archivos de datos con contenido en bytes", color: "border-primary/40 text-primary" },
          { num: "2", label: "Directorios", desc: "Archivos que dan estructura jerárquica al SA", color: "border-secondary/40 text-secondary" },
          { num: "3", label: "Dispositivos", desc: "Interfaz con hardware (bloque o carácter)", color: "border-tertiary/40 text-tertiary" },
          { num: "4", label: "Comunicación", desc: "Tuberías (pipes) para IPC entre procesos", color: "border-danger/40 text-danger" },
        ].map((t) => (
          <div key={t.num} className={`rounded-lg border bg-surf-mid p-4 ${t.color}`}>
            <div className={`text-xs font-bold mb-1 ${t.color.split(" ")[1]}`}>Tipo {t.num}</div>
            <div className="font-semibold text-text-base">{t.label}</div>
            <div className="text-sm text-text-dim mt-1">{t.desc}</div>
          </div>
        ))}
      </div>

      <DocH2 id="ordinarios">Archivos ordinarios</DocH2>
      <DocP>
        Contienen bytes de datos organizados como un arreglo lineal. Operaciones
        permitidas: leer, escribir, añadir al final y truncar a cero. No se
        pueden insertar bytes en el medio ni borrar bytes individuales.
      </DocP>
      <DocP>
        El inodo <strong className="text-primary">no almacena el nombre</strong>{" "}
        del archivo: solo guarda metadatos (tipo, permisos, propietario, tamaño)
        y punteros a los bloques de datos. El nombre es simplemente una etiqueta
        en el directorio que apunta al número de inodo.
      </DocP>

      <DocH2 id="directorios">Directorios</DocH2>
      <DocP>
        Los directorios dan estructura jerárquica al SA. Contienen una secuencia
        de entradas <strong className="text-secondary">(inodo, nombre)</strong>{" "}
        llamadas <strong className="text-secondary">enlaces (links)</strong>. Los
        procesos pueden leer directorios como archivos de datos, pero no pueden
        escribir en ellos directamente: el derecho de escritura está reservado al
        kernel (mediante syscalls como <InlineCode>creat</InlineCode>,{" "}
        <InlineCode>link</InlineCode>, <InlineCode>unlink</InlineCode>).
      </DocP>
      <DocUl>
        <DocLi><strong className="text-primary">Lectura:</strong> permite leer las entradas del directorio.</DocLi>
        <DocLi><strong className="text-secondary">Escritura:</strong> permite crear o borrar entradas.</DocLi>
        <DocLi><strong className="text-tertiary">Ejecución:</strong> permite buscar un nombre de archivo dentro del directorio (necesario para navegar la jerarquía).</DocLi>
      </DocUl>

      <DocH2 id="opendir-readdir">Funciones opendir() y readdir()</DocH2>
      <CodeBlock
        filename="prototipo_opendir.c"
        code={`#include <sys/types.h>
#include <dirent.h>

DIR *opendir(const char *nombre);`}
      />
      <CodeBlock
        filename="prototipo_readdir.c"
        code={`#include <dirent.h>

struct dirent *readdir(DIR *dirp);`}
      />
      <CodeBlock
        filename="struct_dirent.c"
        code={`struct dirent {
    long           d_ino;    // Número de inodo
    off_t          d_off;    // Distancia desde el inicio del directorio
    unsigned short d_reclen; // Longitud del registro
    unsigned char  d_type;   // Tipo de archivo (no en todos los SA)
    char           d_name[256]; // Nombre del archivo (terminado en '\\0')
};`}
      />
      <DocNote>
        <InlineCode>opendir()</InlineCode> devuelve <InlineCode>NULL</InlineCode>{" "}
        en caso de error. Posibles errores:{" "}
        <InlineCode>EACCES</InlineCode> (permiso denegado),{" "}
        <InlineCode>ENOENT</InlineCode> (no existe),{" "}
        <InlineCode>ENOTDIR</InlineCode> (no es un directorio).
        Usar <InlineCode>closedir()</InlineCode> al terminar para liberar recursos.
      </DocNote>

      <DocH3 id="ejemplo-directorio">Ejemplo: listar archivos de un directorio</DocH3>
      <CodeBlock
        filename="listar_directorio.c"
        code={`#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <dirent.h>
#include <errno.h>

int main(int argc, char *argv[])
{
    DIR *directorio;
    struct dirent *entradadir;

    if (argc != 2) {
        fprintf(stderr, "Uso: %s nombre_directorio\\n", argv[0]);
        exit(1);
    }

    if ((directorio = opendir(argv[1])) == NULL) {
        fprintf(stderr, "No puedo abrir %s. Error: %s\\n",
                argv[1], strerror(errno));
        exit(EXIT_FAILURE);
    }

    while ((entradadir = readdir(directorio)) != NULL)
        printf("%s\\n", entradadir->d_name);

    closedir(directorio);
    return EXIT_SUCCESS;
}`}
      />

      <DocH2 id="dispositivos">Archivos de dispositivos</DocH2>
      <DocP>
        Permiten a los procesos comunicarse con dispositivos periféricos usando
        las mismas syscalls que para archivos ordinarios. Existen dos subtipos:
      </DocP>
      <DocUl>
        <DocLi>
          <strong className="text-primary">Modo bloque:</strong> trabajan con
          bloques de tamaño fijo (≥ 512 bytes). El kernel gestiona un buffer
          caché que acelera la transferencia. Ejemplo: discos duros, USBs.
        </DocLi>
        <DocLi>
          <strong className="text-secondary">Modo carácter:</strong> la
          información se transfiere byte a byte sin buffer caché. Ejemplo:
          terminales, teclados, impresoras.
        </DocLi>
      </DocUl>
      <DocP>
        También existen <strong className="text-tertiary">pseudo dispositivos</strong>{" "}
        (software) en <InlineCode>/dev</InlineCode> que no corresponden a
        hardware real: por ejemplo, <InlineCode>/dev/null</InlineCode>,{" "}
        <InlineCode>/dev/zero</InlineCode> o <InlineCode>/dev/mem</InlineCode>.
      </DocP>

      <DocH2 id="major-minor">Funciones major() y minor()</DocH2>
      <CodeBlock
        filename="prototipo_major_minor.c"
        code={`#include <sys/sysmacros.h>

unsigned int major(dev_t dev);
unsigned int minor(dev_t dev);`}
      />
      <CodeBlock
        filename="major_minor_ejemplo.c"
        code={`#include <stdio.h>
#include <stdlib.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <unistd.h>
#include <sys/sysmacros.h>

int main(int argc, char *argv[])
{
    struct stat sb;

    if (argc != 2) {
        fprintf(stderr, "Uso: %s <ruta_dispositivo>\\n", argv[0]);
        exit(EXIT_FAILURE);
    }

    if (stat(argv[1], &sb) == -1) {
        perror("stat");
        exit(EXIT_FAILURE);
    }

    printf("Archivo: %s\\n", argv[1]);

    if (S_ISCHR(sb.st_mode))
        printf("Tipo: Dispositivo de caracteres\\n");
    else if (S_ISBLK(sb.st_mode))
        printf("Tipo: Dispositivo de bloques\\n");
    else {
        printf("No es un archivo de dispositivo.\\n");
        exit(EXIT_FAILURE);
    }

    printf("Número Mayor (Major): %u\\n", major(sb.st_rdev));
    printf("Número Menor (Minor): %u\\n", minor(sb.st_rdev));

    return EXIT_SUCCESS;
}

/* Ejemplo de salida:
   ./prog /dev/tty1  → Major: 4, Minor: 1   (carácter)
   ./prog /dev/loop0 → Major: 7, Minor: 0   (bloque)  */`}
      />

      <DocH2 id="pipes">Archivos de comunicación (pipes)</DocH2>
      <DocP>
        Las tuberías o <strong className="text-tertiary">pipes</strong> son
        archivos con estructura similar a los ordinarios, pero sus datos son{" "}
        <em>transitorios</em>: se usan para comunicar procesos de forma FIFO
        (primero en entrar, primero en salir). El kernel gestiona la
        sincronización del acceso.
      </DocP>
      <CodeBlock
        filename="terminal"
        code={`# Listar tuberías en uso
lsof | grep FIFO

# Buscar tuberías con nombre (named pipes) en el sistema de archivos
find / -type p 2>/dev/null`}
      />
    </DocPage>
  );
}