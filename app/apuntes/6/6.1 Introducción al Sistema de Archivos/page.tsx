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
  title: "6.2 Estructura Lógica del SA | Portafolio SO",
};

const toc = [
  { id: "superbloque", label: "6.2.1 El superbloque" },
  { id: "sync", label: "Funciones sync / syncfs" },
  { id: "mount", label: "Funciones mount / umount" },
  { id: "statvfs", label: "Funciones statvfs / fstatvfs" },
  { id: "inodos", label: "6.2.2 Inodos" },
  { id: "stat", label: "Funciones stat / fstat / lstat" },
  { id: "ejemplo-stat", label: "Ejemplo completo" },
];

export default function Page() {
  return (
    <DocPage
      section="6.2"
      title="Estructura Lógica del Sistema de Archivos"
      category="Sistema de Archivos"
      prev={{ href: "/apuntes/6/6.1_Introduccion_SA", label: "6.1 Introducción SA" }}
      next={{ href: "/apuntes/6/6.3_Tipos_Archivos", label: "6.3 Tipos de Archivos" }}
      toc={toc}
    >
      <DocH2 id="superbloque">6.2.1 El superbloque</DocH2>
      <DocP>
        El superbloque contiene metadatos sobre el sistema de archivos completo:
        tamaño del SA, listas de bloques e inodos libres, índices al siguiente
        bloque/inodo libre, campos de bloqueo y banderas de modificación. El
        kernel mantiene una <strong className="text-primary">copia en memoria</strong>{" "}
        del superbloque y de la lista de inodos para acceso eficiente.
      </DocP>
      <DocP>
        Los hilos del kernel <InlineCode>sync_supers</InlineCode> y{" "}
        <InlineCode>sync_filesystems</InlineCode> se encargan de escribir
        periódicamente los datos de administración al disco, garantizando la
        integridad ante fallos. El programa <InlineCode>shutdown</InlineCode>{" "}
        los actualiza antes de apagar el sistema.
      </DocP>

      <DocH2 id="sync">Funciones sync() y syncfs()</DocH2>
      <CodeBlock
        filename="prototipo_sync.c"
        code={`#include <unistd.h>
void sync(void);      // Escribe todos los cambios pendientes al disco
int  syncfs(int fd);  // Sincroniza solo el SA que contiene el archivo fd`}
      />
      <DocNote>
        <InlineCode>sync()</InlineCode> siempre tiene éxito.{" "}
        <InlineCode>syncfs()</InlineCode> devuelve 0 en caso de éxito o –1 si{" "}
        <InlineCode>fd</InlineCode> no es un descriptor válido.
      </DocNote>

      <DocH2 id="mount">Funciones mount() y umount()</DocH2>
      <CodeBlock
        filename="prototipo_mount.c"
        code={`#include <sys/mount.h>

int mount(const char *source,         // Dispositivo o ruta de origen
          const char *target,         // Punto de montaje
          const char *filesystemtype, // "ext4", "vfat", etc.
          unsigned long mountflags,   // MS_RDONLY, MS_NOEXEC, ...
          const void *data);          // Opciones específicas del SA

int umount(const char *target);
int umount2(const char *target, int flags);`}
      />
      <DocP>
        Los tipos de SA soportados por el kernel se listan en{" "}
        <InlineCode>/proc/filesystems</InlineCode>. Se requieren privilegios de
        administrador (<InlineCode>CAP_SYS_ADMIN</InlineCode>).
      </DocP>

      <DocH2 id="statvfs">Funciones statvfs() y fstatvfs()</DocH2>
      <DocP>
        Estas funciones (interfaz estándar POSIX) devuelven estadísticas del SA
        montado:
      </DocP>
      <CodeBlock
        filename="prototipo_statvfs.c"
        code={`#include <sys/statvfs.h>
int statvfs(const char *path, struct statvfs *buf);
int fstatvfs(int fd,          struct statvfs *buf);`}
      />
      <CodeBlock
        filename="struct_statvfs.c"
        code={`struct statvfs {
    unsigned long f_bsize;   // Tamaño del bloque del SA
    unsigned long f_frsize;  // Tamaño del fragmento
    fsblkcnt_t    f_blocks;  // Tamaño del SA en unidades de fragmento
    fsblkcnt_t    f_bfree;   // Bloques libres
    fsblkcnt_t    f_bavail;  // Bloques libres para usuarios sin privilegios
    fsfilcnt_t    f_files;   // Número total de inodos
    fsfilcnt_t    f_ffree;   // Inodos libres
    fsfilcnt_t    f_favail;  // Inodos libres para usuarios sin privilegios
    unsigned long f_fsid;    // ID del SA
    unsigned long f_flag;    // Banderas de montaje (ST_RDONLY, ST_NOSUID, …)
    unsigned long f_namemax; // Longitud máxima del nombre de archivo
};`}
      />
      <CodeBlock
        filename="info_sa.c"
        code={`#include <stdio.h>
#include <stdlib.h>
#include <errno.h>
#include <sys/types.h>
#include <sys/statvfs.h>

int main()
{
    struct statvfs vfs;
    char *ruta = "/";

    if (statvfs(ruta, &vfs) != 0) {
        perror("llamado de statvfs");
        exit(EXIT_FAILURE);
    }

    printf("\\tArchivo: %s\\n", ruta);
    printf("\\tTamaño de bloques    : %ld\\n", (long) vfs.f_bsize);
    printf("\\tTamaño de fragmento  : %ld\\n", (long) vfs.f_frsize);
    printf("\\tTamaño en unidades   : %lu\\n", (unsigned long) vfs.f_blocks);
    printf("\\tBloques libres       : %lu\\n", (unsigned long) vfs.f_bfree);
    printf("\\tBloques disponibles  : %lu\\n", (unsigned long) vfs.f_bavail);
    printf("\\tNúmero de inodos     : %lu\\n", (unsigned long) vfs.f_files);
    printf("\\tInodos libres        : %lu\\n", (unsigned long) vfs.f_ffree);
    printf("\\tID del SA            : %#lx\\n",(unsigned long) vfs.f_fsid);

    printf("\\tBandera: ");
    if (vfs.f_flag == 0)
        printf("(Ninguna)\\n");
    else {
        if ((vfs.f_flag & ST_RDONLY) != 0) printf("ST_RDONLY ");
        if ((vfs.f_flag & ST_NOSUID) != 0) printf("ST_NOSUID ");
        printf("\\n");
    }
    printf("\\tLong. max nombre     : %ld\\n", (long) vfs.f_namemax);
    return EXIT_SUCCESS;
}`}
      />

      <DocH2 id="inodos">6.2.2 Nodos índice (inodos)</DocH2>
      <DocP>
        Cada archivo en UNIX/Linux tiene asociado un{" "}
        <strong className="text-primary">inodo</strong> que contiene todos sus
        metadatos. Al arrancar, el kernel carga la lista de inodos del disco en
        memoria (<strong className="text-secondary">tabla de inodos</strong>).
        Las operaciones sobre archivos acceden a esta tabla en RAM, no al disco
        directamente.
      </DocP>
      <DocUl>
        <DocLi>Identificador del propietario (UID y GID).</DocLi>
        <DocLi>Tipo de archivo (regular, directorio, dispositivo, pipe).</DocLi>
        <DocLi>Permisos de acceso.</DocLi>
        <DocLi>Fechas: último acceso, última modificación, último cambio.</DocLi>
        <DocLi>Número de enlaces duros al archivo.</DocLi>
        <DocLi>Punteros a los bloques de disco que contienen los datos.</DocLi>
        <DocLi>Tamaño del archivo en bytes.</DocLi>
      </DocUl>
      <DocWarning>
        El <strong>nombre del archivo NO forma parte del inodo</strong>. El
        nombre se almacena en el directorio y apunta al inodo correspondiente.
        Esto permite que un mismo archivo tenga múltiples nombres (enlaces
        duros).
      </DocWarning>

      <DocH2 id="stat">Funciones stat(), fstat() y lstat()</DocH2>
      <CodeBlock
        filename="prototipo_stat.c"
        code={`#include <sys/types.h>
#include <sys/stat.h>
#include <unistd.h>

int stat (const char *pathname, struct stat *statbuf); // sigue symlinks
int fstat(int fd,                struct stat *statbuf); // por descriptor
int lstat(const char *pathname,  struct stat *statbuf); // NO sigue symlinks`}
      />
      <CodeBlock
        filename="struct_stat.c"
        code={`struct stat {
    dev_t     st_dev;     // ID del dispositivo que contiene el archivo
    ino_t     st_ino;     // Número de inodo
    mode_t    st_mode;    // Tipo y permisos del archivo
    nlink_t   st_nlink;   // Número de enlaces duros
    uid_t     st_uid;     // UID del propietario
    gid_t     st_gid;     // GID del grupo
    dev_t     st_rdev;    // ID de dispositivo (si es archivo especial)
    off_t     st_size;    // Tamaño en bytes
    blksize_t st_blksize; // Tamaño de bloque para E/S
    blkcnt_t  st_blocks;  // Número de bloques de 512 B asignados
    struct timespec st_atim; // Último acceso
    struct timespec st_mtim; // Última modificación
    struct timespec st_ctim; // Último cambio de metadatos
};`}
      />
      <DocP>
        El campo <InlineCode>st_mode</InlineCode> permite identificar el tipo
        de archivo con estas máscaras:
      </DocP>
      <div className="my-3 overflow-x-auto rounded-lg border border-surf-high">
        <table className="w-full text-sm">
          <thead className="bg-surf-high">
            <tr>
              <th className="px-4 py-2 text-left text-text-dim">Máscara</th>
              <th className="px-4 py-2 text-left text-text-dim">Valor</th>
              <th className="px-4 py-2 text-left text-primary">Tipo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surf-high">
            {[
              ["S_IFREG", "0100000", "Archivo regular"],
              ["S_IFDIR", "0040000", "Directorio"],
              ["S_IFLNK", "0120000", "Enlace simbólico"],
              ["S_IFBLK", "0060000", "Dispositivo de bloque"],
              ["S_IFCHR", "0020000", "Dispositivo de carácter"],
              ["S_IFIFO", "0010000", "FIFO / tubería"],
              ["S_IFSOCK","0140000", "Socket"],
            ].map(([mask, val, tipo], i) => (
              <tr key={mask} className={i % 2 === 0 ? "bg-surf-low" : "bg-surf-mid"}>
                <td className="px-4 py-2 font-mono text-secondary">{mask}</td>
                <td className="px-4 py-2 font-mono text-text-dim">{val}</td>
                <td className="px-4 py-2 text-text-base">{tipo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <DocH3 id="ejemplo-stat">Ejemplo: información de archivos en el directorio actual</DocH3>
      <CodeBlock
        filename="info_archivos.c"
        code={`#include <stdlib.h>
#include <stdio.h>
#include <unistd.h>
#include <dirent.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <time.h>
#include <sys/sysmacros.h>

#define RUTA 255

int main(void)
{
    char ruta[RUTA];
    DIR *dir;
    struct dirent *direntrada;
    struct stat sb;

    if (getcwd(ruta, RUTA) == NULL) {
        perror("No puedo leer la ruta actual");
        exit(EXIT_FAILURE);
    }
    printf("Ruta actual: %s\\n", ruta);

    if ((dir = opendir(ruta)) == NULL) {
        perror("No puedo leer el directorio");
        exit(EXIT_FAILURE);
    }

    while ((direntrada = readdir(dir)) != NULL) {
        printf("\\n%s\\n", direntrada->d_name);

        if (lstat(direntrada->d_name, &sb) == -1) {
            perror("lstat");
            exit(EXIT_FAILURE);
        }

        printf("  ID dispositivo : [%lx, %lx]\\n",
               (long) major(sb.st_dev), (long) minor(sb.st_dev));

        printf("  Tipo de archivo: ");
        switch (sb.st_mode & S_IFMT) {
            case S_IFBLK:  printf("Dispositivo de bloque\\n");    break;
            case S_IFCHR:  printf("Dispositivo de carácter\\n");  break;
            case S_IFDIR:  printf("Directorio\\n");               break;
            case S_IFIFO:  printf("FIFO/pipe\\n");                break;
            case S_IFLNK:  printf("Enlace simbólico\\n");         break;
            case S_IFREG:  printf("Archivo regular\\n");          break;
            case S_IFSOCK: printf("Socket\\n");                   break;
            default:       printf("Desconocido\\n");              break;
        }

        printf("  Inodo          : %ld\\n",          (long) sb.st_ino);
        printf("  Modo           : %lo (octal)\\n",  (unsigned long) sb.st_mode);
        printf("  No. de enlaces : %ld\\n",          (long) sb.st_nlink);
        printf("  Propietario    : UID=%ld GID=%ld\\n",
               (long) sb.st_uid, (long) sb.st_gid);
        printf("  Tamaño         : %lld bytes\\n",   (long long) sb.st_size);
        printf("  Último acceso  : %s",               ctime(&sb.st_atime));
        printf("  Última modif.  : %s",               ctime(&sb.st_mtime));
    }
    closedir(dir);
    return EXIT_SUCCESS;
}`}
      />
    </DocPage>
  );
}