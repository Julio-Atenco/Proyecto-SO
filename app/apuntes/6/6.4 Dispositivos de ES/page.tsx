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
  title: "6.4 Dispositivos de E/S | Portafolio SO",
};

const toc = [
  { id: "dispositivos-es", label: "Dispositivos de E/S" },
  { id: "terminales", label: "Terminales y getutent()" },
  { id: "ioctl", label: "6.4.1 Función ioctl()" },
  { id: "ejemplo-ioctl-win", label: "Ejemplo: tamaño de ventana" },
  { id: "ejemplo-ioctl-net", label: "Ejemplo: IP y MAC" },
  { id: "unidad-disco", label: "6.4.2 Unidad de disco" },
];

export default function Page() {
  return (
    <DocPage
      section="6.4"
      title="Dispositivos de Entrada y Salida"
      category="Sistema de Archivos"
      prev={{ href: "/apuntes/6/6.3_Tipos_Archivos", label: "6.3 Tipos de Archivos" }}
      next={{ href: "/apuntes/7/7.1_Introduccion_Senales", label: "7.1 Introducción a Señales" }}
      toc={toc}
    >
      <DocH2 id="dispositivos-es">Dispositivos de E/S en UNIX/Linux</DocH2>
      <DocP>
        El SO administra los accesos a los dispositivos: tiempos de búsqueda,
        acceso y transferencia. Existen dos categorías:
      </DocP>
      <DocUl>
        <DocLi>
          <strong className="text-primary">Dispositivos de bloque:</strong>{" "}
          trabajan con conjuntos de 512 bytes (o múltiplos): discos duros,
          memorias USB. Identificados con <InlineCode>b</InlineCode> en{" "}
          <InlineCode>ls -l /dev</InlineCode>.
        </DocLi>
        <DocLi>
          <strong className="text-secondary">Dispositivos de carácter:</strong>{" "}
          flujo byte a byte, sin buffer caché: terminales, teclados, impresoras,
          interfaces de red. Identificados con <InlineCode>c</InlineCode>.
        </DocLi>
      </DocUl>
      <CodeBlock
        filename="terminal"
        code={`# Velocidad de lectura del disco
sudo hdparm -t /dev/sda

# Detalles completos del disco
sudo hdparm -I /dev/sda

# Listar dispositivos de bloque con major:minor
lsblk -d -o NAME,MAJ:MIN,SIZE,TYPE,MOUNTPOINT`}
      />

      <DocH2 id="terminales">Terminales y getutent()</DocH2>
      <DocP>
        Las terminales son dispositivos de carácter tratados como archivos. El
        archivo <InlineCode>/dev/tty</InlineCode> permite que un proceso acceda
        a su terminal. Para conocer en qué terminal está conectado un usuario:
      </DocP>
      <CodeBlock filename="terminal" code={`who\nw`} />
      <DocP>
        Para comunicarse programáticamente con usuarios conectados se usa el
        archivo <InlineCode>/var/run/utmp</InlineCode>, leído mediante{" "}
        <InlineCode>getutent()</InlineCode>:
      </DocP>
      <CodeBlock
        filename="prototipo_getutent.c"
        code={`#include <sys/utmp.h>
struct utmp *getutent(void);`}
      />
      <DocP>
        Cada llamada lee un registro del archivo utmp. La estructura{" "}
        <InlineCode>utmp</InlineCode> incluye campos como{" "}
        <InlineCode>ut_user</InlineCode> (nombre del usuario),{" "}
        <InlineCode>ut_line</InlineCode> (nombre del dispositivo tty),{" "}
        <InlineCode>ut_pid</InlineCode> (PID del proceso de login) y{" "}
        <InlineCode>ut_tv</InlineCode> (timestamp de inicio de sesión).
      </DocP>

      <DocH2 id="ioctl">6.4.1 Función ioctl()</DocH2>
      <DocP>
        <InlineCode>ioctl()</InlineCode> es la llamada al sistema para controlar
        dispositivos de carácter con operaciones específicas que no se ajustan
        al modelo de <InlineCode>read</InlineCode>/<InlineCode>write</InlineCode>:
      </DocP>
      <CodeBlock
        filename="prototipo_ioctl.c"
        code={`#include <sys/ioctl.h>
int ioctl(int fd, unsigned long request, char *argp, ...);

// fd      → descriptor del archivo/dispositivo abierto
// request → código de solicitud (depende del dispositivo)
// argp    → apuntador a parámetros (estructura de datos)`}
      />
      <DocNote>
        Devuelve 0 en caso de éxito y –1 en caso de error, con{" "}
        <InlineCode>errno</InlineCode> indicando el tipo de error.
      </DocNote>

      <DocH3 id="ejemplo-ioctl-win">Ejemplo: tamaño de la ventana terminal</DocH3>
      <CodeBlock
        filename="tamano_ventana.c"
        code={`#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/ioctl.h>

int main()
{
    struct winsize w;

    // TIOCGWINSZ: Get Window Size (obtener tamaño de ventana)
    if (ioctl(STDOUT_FILENO, TIOCGWINSZ, &w) == -1) {
        perror("ioctl");
        exit(EXIT_FAILURE);
    }

    printf("Filas   : %d\\n", w.ws_row);
    printf("Columnas: %d\\n", w.ws_col);
    return EXIT_SUCCESS;
}`}
      />

      <DocH3 id="ejemplo-ioctl-net">Ejemplo: dirección IP y MAC de una interfaz</DocH3>
      <CodeBlock
        filename="ip_mac_interfaz.c"
        code={`#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/ioctl.h>
#include <net/if.h>
#include <unistd.h>
#include <netinet/in.h>
#include <arpa/inet.h>

int main()
{
    int sock;
    struct ifreq ifr;
    unsigned char *mac;
    char *interface = "wlp8s0"; // Cambiar por la interfaz activa (usa: ip -br a)
    struct sockaddr_in *ipaddr;

    // 1. Crear socket para comunicarse con el kernel
    sock = socket(AF_INET, SOCK_DGRAM, 0);
    if (sock == -1) { perror("socket"); return EXIT_FAILURE; }

    strncpy(ifr.ifr_name, interface, IFNAMSIZ - 1);

    // 2. Obtener dirección IP (SIOCGIFADDR: Get InterFace ADDRess)
    if (ioctl(sock, SIOCGIFADDR, &ifr) != -1) {
        ipaddr = (struct sockaddr_in *)&ifr.ifr_addr;
        printf("IP  de %s: %s\\n", interface, inet_ntoa(ipaddr->sin_addr));
    } else {
        perror("ioctl SIOCGIFADDR");
    }

    // 3. Obtener dirección MAC (SIOCGIFHWADDR: Get InterFace HardWare ADDRess)
    if (ioctl(sock, SIOCGIFHWADDR, &ifr) != -1) {
        mac = (unsigned char *)ifr.ifr_hwaddr.sa_data;
        printf("MAC de %s: %02x:%02x:%02x:%02x:%02x:%02x\\n",
               interface,
               mac[0], mac[1], mac[2], mac[3], mac[4], mac[5]);
    } else {
        perror("ioctl SIOCGIFHWADDR");
    }

    close(sock);
    return EXIT_SUCCESS;
}`}
      />

      <DocH2 id="unidad-disco">6.4.2 Unidad de disco</DocH2>
      <DocP>
        El disco es un medio magnético organizado en{" "}
        <strong className="text-primary">pistas</strong> (círculos
        concéntricos) subdivididas en{" "}
        <strong className="text-secondary">sectores</strong> de 512 bytes (o
        múltiplo). Los tiempos involucrados en una operación de disco son:
      </DocP>
      <div className="my-4 grid gap-3 sm:grid-cols-3">
        {[
          { label: "Tiempo de búsqueda", desc: "Mover la cabeza hasta la pista correcta", color: "text-primary" },
          { label: "Retardo de giro", desc: "Esperar que el sector correcto pase bajo la cabeza", color: "text-secondary" },
          { label: "Tiempo de acceso", desc: "Suma del tiempo de búsqueda + retardo de giro", color: "text-tertiary" },
        ].map((t) => (
          <div key={t.label} className="rounded-lg border border-surf-high bg-surf-mid p-3 text-sm">
            <div className={`font-semibold ${t.color}`}>{t.label}</div>
            <div className="text-text-dim mt-1">{t.desc}</div>
          </div>
        ))}
      </div>
      <DocP>
        Cada <strong className="text-primary">partición</strong> es tratada por
        el kernel como un dispositivo separado en <InlineCode>/dev</InlineCode>.
        Cada una suele tener un sistema de archivos y opcionalmente un área de
        swap.
      </DocP>
      <CodeBlock
        filename="terminal"
        code={`# Estado del swap y memoria
swapon
free -h

# Información del área de swap
cat /proc/swaps`}
      />
    </DocPage>
  );
}