import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Glosario | BitácoraSO",
  description: "Glosario de términos de Sistemas Operativos — UTM.",
};

/* ─── Tipos ──────────────────────────────────────────────── */
interface Termino {
  nombre: string;
  tipo:   string;
  color:  "primary" | "secondary" | "tertiary" | "danger";
  def:    string;
  extra?: React.ReactNode;
}
interface Seccion { letra: string; terminos: Termino[] }

/* ─── Datos ───────────────────────────────────────────────── */
const secciones: Seccion[] = [
  {
    letra: "A",
    terminos: [
      {
        nombre: "alarm()",
        tipo:   "Señales",
        color:  "tertiary",
        def:    "Función que programa un temporizador descendente en el kernel. Cuando expira, envía la señal SIGALRM al proceso. Solo puede existir una alarma activa por proceso; una segunda llamada cancela la anterior. Devuelve los segundos restantes de la alarma previa, o 0 si no había ninguna.",
        extra: (
          <div className="bg-surf-low border border-border rounded p-4 font-mono text-xs mt-4">
            <div className="text-muted mb-2 text-[10px] uppercase tracking-widest">Uso típico</div>
            <div className="space-y-1 text-text-dim">
              <div><span className="text-tertiary">signal(SIGALRM, handler)</span>; // instalar manejador</div>
              <div><span className="text-tertiary">alarm(5)</span>;                 // disparar en 5 seg</div>
              <div><span className="text-tertiary">pause()</span>;                  // esperar la señal</div>
            </div>
          </div>
        ),
      },
    ],
  },
  {
    letra: "C",
    terminos: [
      {
        nombre: "Cambio de Contexto",
        tipo:   "Gestión de Procesos",
        color:  "secondary",
        def:    "El kernel guarda el estado del proceso actual (registros, contador de programa, pila) y carga el estado de otro proceso. Es la operación fundamental que permite la multitarea en sistemas con un solo procesador.",
      },
      {
        nombre: "Cola de Mensajes",
        tipo:   "IPC — System V",
        color:  "tertiary",
        def:    "Mecanismo IPC de System V que permite el intercambio de mensajes con formato determinado entre procesos. Se crea con msgget(), se envían mensajes con msgsnd() y se reciben con msgrcv(). Cada mensaje tiene un tipo (mtype > 0) que permite filtrado selectivo.",
        extra: (
          <div className="bg-surf-low border border-border rounded p-4 font-mono text-xs mt-4">
            <div className="text-muted mb-2 text-[10px] uppercase tracking-widest">Llamadas principales</div>
            <div className="space-y-1">
              <div className="flex gap-3"><span className="text-tertiary w-20">Crear:</span><span className="text-text-dim">msgget(key, IPC_CREAT | 0666)</span></div>
              <div className="flex gap-3"><span className="text-tertiary w-20">Enviar:</span><span className="text-text-dim">msgsnd(msqid, &amp;msg, size, flags)</span></div>
              <div className="flex gap-3"><span className="text-tertiary w-20">Recibir:</span><span className="text-text-dim">msgrcv(msqid, &amp;msg, size, type, flags)</span></div>
              <div className="flex gap-3"><span className="text-tertiary w-20">Eliminar:</span><span className="text-text-dim">msgctl(msqid, IPC_RMID, NULL)</span></div>
            </div>
          </div>
        ),
      },
      {
        nombre: "Compactación de Memoria",
        tipo:   "Administración de Memoria",
        color:  "primary",
        def:    "Técnica que mueve todos los procesos hacia la parte inferior de la RAM para consolidar los huecos dispersos en uno solo más grande. Rara vez se implementa en la práctica porque consume mucho tiempo de CPU durante el cual ningún proceso puede ejecutarse.",
      },
      {
        nombre: "Condición de Carrera",
        tipo:   "Concurrencia",
        color:  "danger",
        def:    "Situación en la que el resultado de la ejecución depende del orden o la sincronización de los procesos o hilos. Produce comportamientos no deterministas y errores difíciles de reproducir. Se evita usando mutex o semáforos.",
      },
      {
        nombre: "Copy-on-Write (COW)",
        tipo:   "Gestión de Procesos",
        color:  "primary",
        def:    "Técnica usada por fork() en GNU/Linux. El hijo no recibe una copia física inmediata de la memoria del padre; las páginas se comparten como de solo lectura hasta que alguno de los procesos intenta modificarlas. Optimiza el uso de memoria y acelera la creación de procesos.",
      },
    ],
  },
  {
    letra: "D",
    terminos: [
      {
        nombre: "Deadlock (Interbloqueo)",
        tipo:   "Concepto Crítico",
        color:  "danger",
        def:    "Estado en el que cada proceso de un grupo espera que otro proceso del mismo grupo libere un recurso, produciendo un bloqueo permanente. Se describe mediante las cuatro Condiciones de Coffman: Exclusión Mutua, Retención y Espera, Sin Apropiación y Espera Circular.",
        extra: (
          <div className="bg-surf-low border-l-4 border-danger rounded p-4 flex items-center gap-6 mt-4">
            <div className="flex-1">
              <p className="font-mono text-[11px] text-danger uppercase tracking-widest mb-2">Condiciones de Coffman</p>
              <div className="flex items-center gap-3 text-muted font-mono text-sm">
                <div className="w-10 h-10 border border-border rounded flex items-center justify-center">P1</div>
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>sync_alt</span>
                <div className="w-10 h-10 border border-border rounded flex items-center justify-center">P2</div>
              </div>
            </div>
            <span className="material-symbols-outlined text-danger opacity-50" style={{ fontSize: 40 }}>block</span>
          </div>
        ),
      },
      {
        nombre: "Descriptor de Proceso (task_struct)",
        tipo:   "Gestión de Procesos",
        color:  "primary",
        def:    "Estructura de datos que el kernel de GNU/Linux mantiene por cada proceso activo. Contiene el PID, estado, prioridad, contexto de ejecución, tabla de archivos abiertos y relaciones con otros procesos.",
        extra: (
          <div className="bg-surf-low border border-border rounded p-4 font-mono text-xs mt-4">
            <div className="text-muted mb-2 text-[10px] uppercase tracking-widest">Estados de p-&gt;state</div>
            <div className="space-y-1 text-text-dim">
              <div><span className="text-primary">TASK_RUNNING</span> — en ejecución o listo</div>
              <div><span className="text-primary">TASK_INTERRUPTIBLE</span> — dormido, puede ser despertado</div>
              <div><span className="text-primary">TASK_STOPPED</span> — detenido</div>
              <div><span className="text-danger">EXIT_ZOMBIE</span> — terminado, esperando wait()</div>
              <div><span className="text-danger">EXIT_DEAD</span> — eliminado del sistema</div>
            </div>
          </div>
        ),
      },
      {
        nombre: "Directorio",
        tipo:   "Sistema de Archivos",
        color:  "secondary",
        def:    "Archivo especial que da estructura jerárquica al sistema de archivos. Su contenido es una secuencia de entradas (inodo, nombre), llamadas enlaces (links). Los procesos pueden leer directorios, pero solo el kernel puede escribir en ellos mediante syscalls como creat(), link() o unlink().",
      },
      {
        nombre: "Dispositivo de Bloque",
        tipo:   "Sistema de Archivos",
        color:  "tertiary",
        def:    "Tipo de archivo de dispositivo que trabaja con bloques de datos de tamaño fijo (mínimo 512 bytes). El kernel gestiona un buffer caché que acelera las transferencias. Ejemplos: discos duros y memorias USB. Se identifican con la letra 'b' en la salida de ls -l /dev.",
      },
      {
        nombre: "Dispositivo de Carácter",
        tipo:   "Sistema de Archivos",
        color:  "secondary",
        def:    "Tipo de archivo de dispositivo donde la información fluye como una secuencia lineal de bytes sin buffer caché. La transferencia es más lenta que en dispositivos de bloque. Ejemplos: terminales, teclados, impresoras. Se identifican con la letra 'c' en ls -l /dev.",
      },
    ],
  },
  {
    letra: "E",
    terminos: [
      {
        nombre: "Estado Zombi",
        tipo:   "Gestión de Procesos",
        color:  "danger",
        def:    "Un proceso entra en estado zombi cuando termina su ejecución pero su proceso padre no ha recogido su estado de salida mediante wait() o waitpid(). No consume CPU ni memoria de usuario, pero sí ocupa una entrada en la tabla de procesos. Desaparece cuando el padre llama a wait().",
        extra: (
          <div className="bg-surf-low border border-border rounded p-4 font-mono text-xs mt-4">
            <div className="space-y-1 text-text-dim">
              <div>Verificar zombis: <span className="text-danger">ps -el | grep Z</span></div>
              <div>Estado en ps: <span className="text-danger">Z (defunct)</span></div>
            </div>
          </div>
        ),
      },
      {
        nombre: "exec()",
        tipo:   "Llamadas al Sistema",
        color:  "secondary",
        def:    "Familia de llamadas al sistema (execl, execv, execle, execve, execlp, execvp) que reemplazan la imagen del proceso actual con un nuevo programa. El PID no cambia, pero el código, datos, heap y stack son reemplazados. Si tiene éxito, nunca regresa al código original.",
      },
      {
        nombre: "ext4",
        tipo:   "Sistema de Archivos",
        color:  "primary",
        def:    "Sistema de archivos extendido de cuarta generación, el más usado en distribuciones Linux modernas. Soporta volúmenes de hasta 1 EiB y archivos de hasta 16 TiB, journaling para recuperación ante fallos, extents para reducir fragmentación y timestamps con precisión de nanosegundos.",
      },
    ],
  },
  {
    letra: "F",
    terminos: [
      {
        nombre: "FIFO (Tubería con nombre)",
        tipo:   "IPC — Tuberías",
        color:  "tertiary",
        def:    "Archivo especial creado con mkfifo() que funciona como una tubería pero con nombre y ruta en el sistema de archivos. A diferencia de pipe(), puede comunicar procesos no emparentados. Debe estar abierto en ambos extremos simultáneamente antes de cualquier operación E/S.",
      },
      {
        nombre: "fork()",
        tipo:   "Llamadas al Sistema",
        color:  "primary",
        def:    "Llamada al sistema que crea un nuevo proceso (hijo) como copia casi exacta del proceso actual (padre). Retorna 0 al hijo, el PID del hijo al padre, y -1 en caso de error. Ambos procesos continúan ejecutando la instrucción siguiente a fork() con espacios de memoria independientes.",
        extra: (
          <div className="bg-surf-low border border-border rounded p-4 font-mono text-xs mt-4">
            <div className="text-muted mb-2 text-[10px] uppercase tracking-widest">Valor de retorno</div>
            <div className="space-y-1">
              <div className="flex gap-3"><span className="text-primary w-16">Hijo:</span><span className="text-text-dim">retorna 0</span></div>
              <div className="flex gap-3"><span className="text-primary w-16">Padre:</span><span className="text-text-dim">retorna PID del hijo (&gt; 0)</span></div>
              <div className="flex gap-3"><span className="text-danger w-16">Error:</span><span className="text-text-dim">retorna -1</span></div>
            </div>
          </div>
        ),
      },
      {
        nombre: "Fragmentación",
        tipo:   "Administración de Memoria",
        color:  "danger",
        def:    "Interna: desperdicio dentro de una partición asignada cuando el proceso ocupa menos espacio que la partición. Externa: espacio libre total suficiente para un proceso pero disperso en huecos no contiguos. La paginación elimina la fragmentación externa pero introduce fragmentación interna en la última página.",
      },
      {
        nombre: "ftok()",
        tipo:   "IPC — System V",
        color:  "tertiary",
        def:    "Función que genera una llave (key_t) a partir de un nombre de archivo y un identificador de proyecto (proj_id). Combina los 8 bits menos significativos de proj_id con el número de inodo del archivo y el número menor del dispositivo, produciendo una llave de 32 bits única.",
      },
    ],
  },
  {
    letra: "H",
    terminos: [
      {
        nombre: "Hilo (Thread)",
        tipo:   "Gestión de Procesos",
        color:  "primary",
        def:    "Unidad básica de utilización del CPU que existe dentro de un proceso. Comparte con otros hilos del mismo proceso el espacio de direcciones, archivos abiertos y recursos del SO, pero tiene su propio contador de programa, registros y pila de ejecución.",
      },
      {
        nombre: "Huérfano (Proceso)",
        tipo:   "Gestión de Procesos",
        color:  "secondary",
        def:    "Proceso cuyo padre terminó antes que él. El kernel reasigna automáticamente al huérfano al proceso con PID 1 (init o systemd), que ejecuta wait() automáticamente evitando que quede zombi.",
      },
    ],
  },
  {
    letra: "I",
    terminos: [
      {
        nombre: "Inodo (i-node)",
        tipo:   "Sistema de Archivos",
        color:  "primary",
        def:    "Estructura de datos que el sistema de archivos UNIX/Linux mantiene por cada archivo. Contiene todos los metadatos: propietario (UID/GID), tipo, permisos, fechas de acceso/modificación/cambio, número de enlaces duros y punteros a los bloques de datos en disco. El nombre del archivo NO está en el inodo sino en el directorio.",
        extra: (
          <div className="bg-surf-low border border-border rounded p-4 font-mono text-xs mt-4">
            <div className="text-muted mb-2 text-[10px] uppercase tracking-widest">Consultar desde terminal</div>
            <div className="space-y-1 text-text-dim">
              <div><span className="text-primary">stat archivo</span> — info completa del inodo</div>
              <div><span className="text-primary">ls -i archivo</span> — número de inodo</div>
              <div><span className="text-primary">df -i</span> — uso de inodos por sistema de archivos</div>
            </div>
          </div>
        ),
      },
      {
        nombre: "IPC (Inter-Process Communication)",
        tipo:   "Comunicación",
        color:  "tertiary",
        def:    "Conjunto de mecanismos que permiten a los procesos comunicarse e intercambiar datos. En UNIX/Linux se dividen en mecanismos de flujo (pipe, fifo, sockets) y de mensajes (colas de mensajes). Los derivados de System V incluyen semáforos, memoria compartida y colas de mensajes, identificados mediante llaves (key_t).",
        extra: (
          <div className="grid grid-cols-3 gap-3 mt-4">
            {[
              { label: "Semáforos",       fn: "semget()", color: "secondary" },
              { label: "Mem. Compartida", fn: "shmget()", color: "tertiary"  },
              { label: "Cola Mensajes",   fn: "msgget()", color: "primary"   },
            ].map(({ label, fn, color }) => (
              <div key={label} className="bg-surf-high border border-border rounded p-3 text-center">
                <div className={`font-mono text-xs mb-1 ${color === "primary" ? "text-primary" : color === "secondary" ? "text-secondary" : "text-tertiary"}`}>{fn}</div>
                <div className="text-text-dim text-[11px]">{label}</div>
              </div>
            ))}
          </div>
        ),
      },
      {
        nombre: "ioctl()",
        tipo:   "Sistema de Archivos",
        color:  "secondary",
        def:    "Llamada al sistema que permite controlar dispositivos de carácter con operaciones específicas que no se ajustan al modelo read/write. Recibe el descriptor del archivo, un código de solicitud dependiente del dispositivo y un puntero a parámetros. Ejemplos: obtener el tamaño de la ventana terminal (TIOCGWINSZ) o la dirección IP de una interfaz de red (SIOCGIFADDR).",
      },
    ],
  },
  {
    letra: "K",
    terminos: [
      {
        nombre: "kill()",
        tipo:   "Señales",
        color:  "danger",
        def:    "Llamada al sistema para enviar una señal a uno o más procesos. El parámetro pid determina el destino: pid > 0 envía al proceso específico; pid = 0 al grupo del emisor; pid = -1 a todos los procesos del usuario; pid < -1 al grupo con GID = |pid|. Requiere privilegios si el emisor no es el superusuario.",
        extra: (
          <div className="bg-surf-low border border-border rounded p-4 font-mono text-xs mt-4">
            <div className="text-muted mb-2 text-[10px] uppercase tracking-widest">Desde terminal</div>
            <div className="space-y-1 text-text-dim">
              <div><span className="text-danger">kill 1234</span>     — SIGTERM al proceso 1234</div>
              <div><span className="text-danger">kill -9 1234</span>  — SIGKILL (incondicional)</div>
              <div><span className="text-danger">kill -2 1234</span>  — SIGINT (equivale a Ctrl+C)</div>
            </div>
          </div>
        ),
      },
      {
        nombre: "Kernel",
        tipo:   "Arquitectura Central",
        color:  "secondary",
        def:    "Módulo central del sistema operativo que se carga primero y permanece en memoria. Responsable de la gestión de procesos, memoria, seguridad, recursos, archivos y dispositivos de E/S. Se ejecuta en modo privilegiado (Ring 0) con acceso directo al hardware.",
      },
    ],
  },
  {
    letra: "L",
    terminos: [
      {
        nombre: "Llave (key_t)",
        tipo:   "IPC — System V",
        color:  "tertiary",
        def:    "Variable entera de 32 bits usada para identificar y acceder a los mecanismos IPC de System V. Se genera con ftok() y se usa en semget(), shmget() y msgget(). Los mecanismos del mismo proyecto deben compartir la misma llave.",
      },
    ],
  },
  {
    letra: "M",
    terminos: [
      {
        nombre: "Marco de Página (Page Frame)",
        tipo:   "Administración de Memoria",
        color:  "primary",
        def:    "División de tamaño fijo de la memoria física RAM que corresponde a una página virtual. Los marcos y las páginas tienen siempre el mismo tamaño (típicamente 4 KB en x86). La MMU mantiene una tabla de páginas que mapea cada página virtual a su marco físico correspondiente.",
      },
      {
        nombre: "Memoria Compartida",
        tipo:   "IPC — System V",
        color:  "tertiary",
        def:    "La forma más rápida de comunicación entre procesos: comparten una zona de memoria física. Se crea con shmget(), los procesos se unen con shmat() y se separan con shmdt(). Al terminar se elimina con shmctl(shmid, IPC_RMID, 0).",
        extra: (
          <div className="bg-surf-low border border-border rounded p-4 font-mono text-xs mt-4">
            <div className="text-muted mb-2 text-[10px] uppercase tracking-widest">Ciclo de vida</div>
            <div className="flex items-center gap-2 text-text-dim flex-wrap">
              <span className="text-tertiary">shmget()</span>
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>arrow_forward</span>
              <span className="text-tertiary">shmat()</span>
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>arrow_forward</span>
              <span className="text-text-dim">usar</span>
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>arrow_forward</span>
              <span className="text-tertiary">shmdt()</span>
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>arrow_forward</span>
              <span className="text-tertiary">shmctl(IPC_RMID)</span>
            </div>
          </div>
        ),
      },
      {
        nombre: "Memoria Virtual",
        tipo:   "Administración de Memoria",
        color:  "secondary",
        def:    "Técnica que permite que el tamaño combinado del programa, sus datos y pila exceda la RAM física disponible. El SO mantiene en RAM solo las partes activas del programa y el resto en disco (swap). Cada proceso tiene un espacio de direcciones virtuales propio gestionado por la MMU.",
      },
      {
        nombre: "MMU (Memory Management Unit)",
        tipo:   "Administración de Memoria",
        color:  "primary",
        def:    "Chip o conjunto de chips que traduce direcciones virtuales generadas por el proceso a direcciones físicas de la RAM. Las direcciones virtuales no llegan directamente al bus de memoria sino que pasan primero por la MMU, que consulta la tabla de páginas del proceso para realizar la traducción.",
        extra: (
          <div className="bg-surf-low border border-border rounded p-4 font-mono text-xs mt-4 text-center">
            <div className="flex items-center justify-center gap-3 text-text-dim">
              <span className="text-primary">Dirección virtual</span>
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>arrow_forward</span>
              <span className="text-secondary border border-secondary/40 rounded px-2 py-0.5">MMU</span>
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>arrow_forward</span>
              <span className="text-tertiary">Dirección física</span>
            </div>
          </div>
        ),
      },
      {
        nombre: "mmap()",
        tipo:   "Administración de Memoria",
        color:  "secondary",
        def:    "Llamada al sistema que crea una nueva asignación en el espacio de direcciones virtuales del proceso. Permite mapear archivos o dispositivos en memoria, asignar memoria anónima de gran tamaño y compartir memoria entre procesos. munmap() elimina la asignación. Es la base de la carga dinámica de bibliotecas (.so).",
      },
      {
        nombre: "Modo Usuario / Modo Kernel",
        tipo:   "Arquitectura Central",
        color:  "secondary",
        def:    "Los procesadores modernos operan en al menos dos modos de privilegio. En modo usuario el proceso ejecuta código de aplicación con acceso restringido al hardware. En modo kernel el SO ejecuta con acceso total. El cambio de modo ocurre al realizar llamadas al sistema o atender interrupciones.",
      },
      {
        nombre: "Mutex (Exclusión Mutua)",
        tipo:   "Concurrencia",
        color:  "secondary",
        def:    "Mecanismo de sincronización a nivel de hilos que se comporta como un semáforo binario. Protege una sección crítica garantizando que solo un hilo acceda al recurso a la vez. En pthreads se usa pthread_mutex_lock() para bloquear y pthread_mutex_unlock() para liberar.",
      },
    ],
  },
  {
    letra: "P",
    terminos: [
      {
        nombre: "Página",
        tipo:   "Administración de Memoria",
        color:  "primary",
        def:    "Unidad básica de la memoria virtual. División de tamaño fijo (típicamente 4 KB en arquitecturas x86/x86-64) del espacio de direcciones virtuales de un proceso. La MMU mapea páginas virtuales a marcos de página físicos. En Linux se puede consultar el tamaño con getconf PAGESIZE.",
      },
      {
        nombre: "Paginación",
        tipo:   "Administración de Memoria",
        color:  "secondary",
        def:    "Técnica de administración de memoria que divide tanto el espacio de direcciones virtuales como la RAM física en bloques de tamaño fijo (páginas y marcos). Elimina la fragmentación externa y permite que un proceso resida en marcos no contiguos. La traducción la realiza la MMU usando la tabla de páginas.",
      },
      {
        nombre: "Partición Fija",
        tipo:   "Administración de Memoria",
        color:  "tertiary",
        def:    "Esquema de administración de memoria que divide la RAM en n regiones de tamaño predefinido. Cada partición aloja exactamente un proceso. Simple de implementar pero produce fragmentación interna (espacio desperdiciado dentro de la partición si el proceso es más pequeño que ella).",
      },
      {
        nombre: "PID / PPID",
        tipo:   "Gestión de Procesos",
        color:  "primary",
        def:    "PID (Process Identifier) es el número entero positivo único asignado por el kernel a cada proceso. PPID (Parent Process Identifier) es el PID del proceso padre. Se obtienen con getpid() y getppid() respectivamente.",
      },
      {
        nombre: "pipe()",
        tipo:   "IPC — Tuberías",
        color:  "tertiary",
        def:    "Llamada al sistema que crea una tubería sin nombre para comunicación unidireccional entre procesos emparentados. Crea dos descriptores: fd[0] para lectura y fd[1] para escritura. Los datos fluyen de fd[1] a fd[0] a través de un buffer en el kernel.",
      },
      {
        nombre: "Proceso",
        tipo:   "Gestión de Procesos",
        color:  "primary",
        def:    "Programa en ejecución al que el SO asigna un PID único. Incluye código, contador de programa, registros, pila, datos y heap. Puede estar en estado Nuevo, Listo, Ejecución, Bloqueado o Terminado.",
      },
      {
        nombre: "pthread",
        tipo:   "Hilos POSIX",
        color:  "secondary",
        def:    "Librería de hilos POSIX (IEEE 1003.1-2008) disponible en GNU/Linux. Las funciones principales son pthread_create(), pthread_join(), pthread_exit() y pthread_self(). Para compilar se usa la bandera -lpthread.",
      },
    ],
  },
  {
    letra: "S",
    terminos: [
      {
        nombre: "Segmentación",
        tipo:   "Administración de Memoria",
        color:  "tertiary",
        def:    "Técnica de administración de memoria que divide el espacio de direcciones en segmentos de tamaño variable con significado lógico (código, datos, pila). A diferencia de la paginación, los segmentos tienen longitudes distintas. Puede combinarse con paginación en un esquema mixto.",
      },
      {
        nombre: "Semáforo",
        tipo:   "Control de Concurrencia",
        color:  "primary",
        def:    "Variable entera con dos operaciones atómicas: wait() (P, decrementa) y signal() (V, incrementa). En POSIX se inicializa con sem_init(), se decrementa con sem_wait() y se incrementa con sem_post(). En System V se usa semget(), semop() y semctl().",
        extra: (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            <div className="bg-surf-high border border-border rounded p-3">
              <div className="font-mono text-[10px] text-muted uppercase mb-2">POSIX</div>
              <div className="font-mono text-xs space-y-0.5 text-text-dim">
                <div><span className="text-primary">sem_init()</span> — inicializar</div>
                <div><span className="text-primary">sem_wait()</span> — P (bloquear)</div>
                <div><span className="text-primary">sem_post()</span> — V (desbloquear)</div>
              </div>
            </div>
            <div className="bg-surf-high border border-border rounded p-3">
              <div className="font-mono text-[10px] text-muted uppercase mb-2">System V</div>
              <div className="font-mono text-xs space-y-0.5 text-text-dim">
                <div><span className="text-secondary">semget()</span> — crear/acceder</div>
                <div><span className="text-secondary">semop()</span> — operar</div>
                <div><span className="text-secondary">semctl()</span> — controlar</div>
              </div>
            </div>
          </div>
        ),
      },
      {
        nombre: "Señal (Signal)",
        tipo:   "Señales",
        color:  "secondary",
        def:    "Interrupción de software que el SO o un proceso envía a otro proceso para notificarle un evento asíncrono. Se identifica con un número entero positivo y un nombre con prefijo SIG. El proceso receptor puede ignorarla, usar la acción por defecto (generalmente terminar) o instalar un manejador propio con signal().",
      },
      {
        nombre: "setjmp() / longjmp()",
        tipo:   "Señales",
        color:  "tertiary",
        def:    "Funciones estándar de C para saltos no locales. setjmp() guarda el contexto de ejecución (pila, registros, máscara de señales) en un buffer jmp_buf. longjmp() restaura ese contexto, haciendo que la ejecución continúe como si setjmp() hubiera retornado el valor val. Útil en manejadores de señal para regresar a un estado seguro del programa.",
      },
      {
        nombre: "SIGKILL (9)",
        tipo:   "Señales",
        color:  "danger",
        def:    "Señal que provoca la terminación incondicional e inmediata del proceso. No puede ser ignorada, bloqueada ni capturada por el proceso receptor. Es la única garantía de terminar un proceso en cualquier circunstancia. Se envía con kill -9 PID desde la terminal.",
      },
      {
        nombre: "Superbloque",
        tipo:   "Sistema de Archivos",
        color:  "primary",
        def:    "Estructura que describe el estado global del sistema de archivos: tamaño total, número de bloques e inodos libres, punteros a listas libres y banderas de estado. El kernel mantiene una copia en memoria para acceso eficiente. Los hilos del kernel sync_supers y sync_filesystems lo sincronizan periódicamente con el disco.",
      },
      {
        nombre: "Swap (Intercambio)",
        tipo:   "Administración de Memoria",
        color:  "secondary",
        def:    "Área en disco (partición o archivo swapfile) usada como extensión de la RAM. Cuando la memoria física se agota, el kernel mueve páginas poco usadas a la swap para liberar marcos. En Ubuntu, el parámetro swappiness (0-100, default 60) controla la agresividad con la que se usa. Se consulta con swapon y free.",
      },
      {
        nombre: "System V IPC",
        tipo:   "IPC",
        color:  "tertiary",
        def:    "Conjunto de mecanismos IPC introducidos en Unix System V: semáforos (semget), memoria compartida (shmget) y colas de mensajes (msgget). Todos comparten una llave key_t y sus objetos persisten en el sistema hasta ser eliminados explícitamente con IPC_RMID.",
      },
    ],
  },
  {
    letra: "T",
    terminos: [
      {
        nombre: "Tabla de Páginas",
        tipo:   "Administración de Memoria",
        color:  "primary",
        def:    "Estructura de datos mantenida por el kernel para cada proceso que registra la correspondencia entre páginas virtuales y marcos de página físicos. Cada entrada (PTE — Page Table Entry) almacena la dirección del marco, bits de validez, protección (lectura/escritura/ejecución) y presencia en RAM.",
      },
      {
        nombre: "TLB (Translation Lookaside Buffer)",
        tipo:   "Administración de Memoria",
        color:  "secondary",
        def:    "Caché de hardware de alta velocidad integrada en la MMU que almacena las traducciones de páginas usadas recientemente. Evita acceder a la tabla de páginas en RAM en cada referencia a memoria. Un fallo de TLB (TLB miss) obliga a consultar la tabla de páginas. Linux soporta HugePages (2 MB – 1 GB) para reducir la presión sobre el TLB.",
      },
      {
        nombre: "Tubería (Pipe)",
        tipo:   "IPC — Tuberías",
        color:  "tertiary",
        def:    "Mecanismo clásico de IPC entre procesos emparentados. Los datos fluyen en una sola dirección (half-duplex). Existen dos tipos: sin nombre (pipe()) y con nombre (fifo / mkfifo()) que tiene ruta en el sistema de archivos.",
      },
    ],
  },
  {
    letra: "W",
    terminos: [
      {
        nombre: "wait() / waitpid()",
        tipo:   "Llamadas al Sistema",
        color:  "primary",
        def:    "Llamadas al sistema que suspenden la ejecución del proceso padre hasta que un hijo termina. Esenciales para evitar procesos zombi. waitpid() permite especificar un hijo concreto y opciones como WNOHANG (no bloquear) o WCONTINUED.",
        extra: (
          <div className="bg-surf-low border border-border rounded p-4 font-mono text-xs mt-4">
            <div className="text-muted mb-2 text-[10px] uppercase tracking-widest">Macros de estado (&lt;sys/wait.h&gt;)</div>
            <div className="space-y-1 text-text-dim">
              <div><span className="text-primary">WIFEXITED(s)</span> — terminó normalmente</div>
              <div><span className="text-primary">WEXITSTATUS(s)</span> — código de exit()</div>
              <div><span className="text-primary">WIFSIGNALED(s)</span> — terminó por señal</div>
              <div><span className="text-primary">WTERMSIG(s)</span> — número de la señal</div>
            </div>
          </div>
        ),
      },
    ],
  },
];

const letrasIndice      = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
const letrasDisponibles = secciones.map((s) => s.letra);

const colorMap: Record<string, string> = {
  primary:   "bg-primary-c/15 text-primary",
  secondary: "bg-secondary/10 text-secondary",
  tertiary:  "bg-tertiary/10 text-tertiary",
  danger:    "bg-danger/10 text-danger",
};
const textColor: Record<string, string> = {
  primary:   "text-primary",
  secondary: "text-secondary",
  tertiary:  "text-tertiary",
  danger:    "text-danger",
};

const categorias = [
  { icon: "memory",       label: "Gestión de Procesos",      color: "primary"   },
  { icon: "sync",         label: "Concurrencia / Hilos",     color: "secondary" },
  { icon: "hub",          label: "IPC",                      color: "tertiary"  },
  { icon: "terminal",     label: "Llamadas al Sistema",      color: "primary"   },
  { icon: "hardware",     label: "Administración de Memoria",color: "secondary" },
  { icon: "folder_open",  label: "Sistema de Archivos",      color: "tertiary"  },
  { icon: "notifications",label: "Señales",                  color: "primary"   },
];

/* ─── Page ───────────────────────────────────────────────── */
export default function GlosarioPage() {
  const total = secciones.reduce((acc, s) => acc + s.terminos.length, 0);

  return (
    <div className="flex">
      {/* ── Sidebar ── */}
      <aside className="hidden lg:flex fixed left-0 top-16 bottom-0 w-60 flex-col p-5 overflow-y-auto bg-surf-low border-r border-border">
        <div className="mb-6">
          <p className="font-bold text-primary font-mono text-sm mb-0.5">Glosario SO</p>
          <p className="text-muted text-xs">{total} términos · {secciones.length} letras</p>
        </div>

        {/* Índice alfabético */}
        <div className="mb-6">
          <p className="font-mono text-[10px] text-muted uppercase tracking-widest mb-3">Índice</p>
          <div className="flex flex-wrap gap-1.5">
            {letrasIndice.map((letra) => {
              const activa = letrasDisponibles.includes(letra);
              return (
                <a
                  key={letra}
                  href={activa ? `#${letra}` : undefined}
                  className={`w-7 h-7 flex items-center justify-center rounded text-xs font-mono font-bold transition-colors ${
                    activa
                      ? "border border-border text-text-base hover:bg-primary hover:text-bg hover:border-primary cursor-pointer"
                      : "text-muted opacity-30 cursor-default"
                  }`}
                >
                  {letra}
                </a>
              );
            })}
          </div>
        </div>

        {/* Categorías */}
        <div>
          <p className="font-mono text-[10px] text-muted uppercase tracking-widest mb-3">Categorías</p>
          <div className="space-y-1 text-sm">
            {categorias.map(({ icon, label, color }) => (
              <div key={label} className="flex items-center gap-2 text-text-dim py-1">
                <span className={`material-symbols-outlined ${textColor[color]}`} style={{ fontSize: 16 }}>{icon}</span>
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Links */}
        <div className="mt-auto pt-4 border-t border-border space-y-2">
          <a
            href="https://mixteco.utm.mx/~gcgero/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[12px] text-muted hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>school</span>
            Notas del profesor
          </a>
        </div>
      </aside>

      {/* ── Contenido ── */}
      <main className="lg:ml-60 flex-1 px-6 md:px-14 py-12 max-w-4xl">
        {/* Header */}
        <div className="mb-10">
          <div className="font-mono text-xs text-muted mb-3 flex items-center gap-2">
            <span>Inicio</span>
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>chevron_right</span>
            <span className="text-primary">Glosario</span>
          </div>
          <h1 className="text-3xl font-bold text-text-base mb-2">Glosario de Sistemas Operativos</h1>
          <p className="text-text-dim text-sm">
            <span className="text-text-base font-semibold">{total} términos</span> de los
            capítulos 1, 2, 3, 5, 6 y 7 de las notas — UTM 2025.
          </p>
        </div>

        {/* Buscador visual */}
        <div className="flex gap-3 mb-10">
          <div className="flex-1 flex items-center gap-2 bg-surf-low border border-border rounded px-4 py-2.5 focus-within:border-primary transition-colors">
            <span className="material-symbols-outlined text-muted" style={{ fontSize: 18 }}>search</span>
            <input
              type="text"
              placeholder="Buscar término... (usa Ctrl+F del navegador)"
              className="bg-transparent text-sm text-text-base placeholder:text-muted outline-none w-full"
            />
          </div>
        </div>

        {/* Secciones */}
        <div className="space-y-14">
          {secciones.map(({ letra, terminos }) => (
            <section key={letra} id={letra} className="scroll-mt-24">
              <div className="flex items-center gap-4 mb-6">
                <span className="text-4xl font-bold text-primary font-mono">{letra}</span>
                <div className="h-px bg-border flex-1" />
                <span className="font-mono text-[11px] text-muted">
                  {terminos.length} término{terminos.length > 1 ? "s" : ""}
                </span>
              </div>

              <div className="space-y-5">
                {terminos.map(({ nombre, tipo, color, def, extra }) => (
                  <article
                    key={nombre}
                    className="p-6 bg-surf-low border border-border rounded-lg hover:border-primary transition-colors group"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                      <h3 className={`font-bold text-lg ${textColor[color]} group-hover:opacity-80 transition-opacity`}>
                        {nombre}
                      </h3>
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-mono shrink-0 ${colorMap[color]}`}>
                        {tipo}
                      </span>
                    </div>
                    <p className="text-text-dim text-sm leading-relaxed">{def}</p>
                    {extra}
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}