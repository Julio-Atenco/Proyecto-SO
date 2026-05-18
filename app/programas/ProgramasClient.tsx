"use client";

import { useState } from "react";

/* ─── Tipos ──────────────────────────────────────────────── */
interface Programa {
  id:          string;
  titulo:      string;
  desc:        string;
  tema:        string;
  acento:      "primary" | "secondary" | "tertiary";
  compilar?:   string;
  salida?:     string;
  salidaNota?: string;
  codigo:      string;
  aprendimos:  string[];
  mejoras:     string[];
}

/* ═══════════════════════════════════════════════════════════
   DATOS
═══════════════════════════════════════════════════════════ */
const programas: Programa[] = [

  /* ── CAP 2: PROCESOS ─────────────────────────────────── */
  {
    id:      "fork-getpid",
    titulo:  "fork() — Identificar padre e hijo",
    desc:    "Crea un proceso hijo con fork() e imprime el PID de ambos con getpid() y getppid().",
    tema:    "Procesos",
    acento:  "primary",
    compilar:"gcc fork_getpid.c -o fork_getpid",
    salida:  `Soy el padre, PID=12345\nSoy el hijo,  PID=12346`,
    salidaNota: "los PID los asigna el kernel; el orden puede variar",
    codigo: `#include <stdio.h>
#include <stdlib.h>
#include <sys/types.h>
#include <unistd.h>

int main(void) {
    pid_t hijo = fork();

    if (hijo == 0)
        fprintf(stdout, "Soy el hijo,  PID=%ld\\n", (long)getpid());
    else if (hijo > 0)
        fprintf(stdout, "Soy el padre, PID=%ld\\n", (long)getpid());
    else {
        perror("fork");
        return EXIT_FAILURE;
    }
    return EXIT_SUCCESS;
}`,
    aprendimos: [
      "fork() duplica el proceso; el hijo recibe 0 y el padre recibe el PID del hijo.",
      "Ambos procesos tienen espacios de memoria independientes después del fork.",
      "El orden de ejecución entre padre e hijo no está garantizado por el sistema.",
    ],
    mejoras: [
      "Agregar wait(NULL) en el padre para evitar que el hijo quede zombi.",
      "Usar waitpid() para esperar al hijo específico y recuperar su código de salida.",
      "Imprimir también el PPID del hijo con getppid() para ver la relación padre–hijo.",
    ],
  },
  {
    id:      "cadena-procesos",
    titulo:  "Cadena lineal de procesos P0→P1→...→Pn",
    desc:    "Cada proceso crea un solo hijo y deja de crear más. Genera una cadena donde el PPID de cada proceso es el PID del anterior.",
    tema:    "Procesos",
    acento:  "primary",
    compilar:"gcc cadena.c -o cadena",
    salida:  `Proceso PID=12346, PPID=12345\nProceso PID=12347, PPID=12346\nProceso PID=12348, PPID=12347`,
    salidaNota: "n=5 → cadena de 5 hijos",
    codigo: `#include <stdio.h>
#include <stdlib.h>
#include <sys/types.h>
#include <unistd.h>

int main(void) {
    pid_t hijo;
    int n = 5;

    for (int i = 0; i < n; i++) {
        hijo = fork();
        if (hijo > 0)
            break;  /* El padre deja de crear más procesos */
        fprintf(stderr, "Proceso PID=%ld, PPID=%ld\\n",
                (long)getpid(), (long)getppid());
    }
    return EXIT_SUCCESS;
}`,
    aprendimos: [
      "El break en el padre evita que cada proceso cree más de un hijo, formando la cadena.",
      "Cada proceso hijo se convierte en padre del siguiente, creando una jerarquía lineal.",
      "El PPID de cada proceso refleja exactamente quién fue su creador.",
    ],
    mejoras: [
      "Reemplazar 'break' con 'exit(0)' para que el padre termine inmediatamente tras crear al hijo.",
      "Añadir wait() en cada padre para que espere a su hijo antes de terminar.",
      "Extender el programa para imprimir el nivel de profundidad de cada proceso en la cadena.",
    ],
  },
  {
    id:      "wait-ejemplo",
    titulo:  "wait() — Sincronización padre-hijo",
    desc:    "El padre espera a que el hijo termine usando wait() y recupera su código de salida con WEXITSTATUS.",
    tema:    "Procesos",
    acento:  "primary",
    compilar:"gcc wait_ejemplo.c -o wait_ejemplo",
    salida:  `Hijo PID=12346 terminando con exit(42)...\nPadre: hijo terminó con código 42`,
    codigo: `#include <stdio.h>
#include <stdlib.h>
#include <sys/types.h>
#include <sys/wait.h>
#include <unistd.h>

int main(void) {
    pid_t pid;
    int status;

    pid = fork();

    if (pid == 0) {
        printf("Hijo PID=%ld terminando con exit(42)...\\n", (long)getpid());
        exit(42);
    } else if (pid > 0) {
        wait(&status);
        if (WIFEXITED(status))
            printf("Padre: hijo terminó con código %d\\n", WEXITSTATUS(status));
    } else {
        perror("fork");
        return EXIT_FAILURE;
    }
    return EXIT_SUCCESS;
}`,
    aprendimos: [
      "wait() bloquea al padre hasta que cualquier hijo cambia de estado.",
      "WIFEXITED(status) verifica que el hijo terminó normalmente con exit().",
      "WEXITSTATUS(status) extrae el código de salida pasado a exit().",
    ],
    mejoras: [
      "Usar waitpid(pid, &status, 0) para esperar a un hijo específico.",
      "Agregar WIFSIGNALED(status) para detectar si el hijo fue terminado por una señal.",
      "Usar WNOHANG con waitpid() para consultar el estado sin bloquear al padre.",
    ],
  },
  {
    id:      "zombi",
    titulo:  "Estado Zombi — demostración",
    desc:    "El hijo termina pero el padre no llama a wait(). El hijo queda como zombi 15 segundos. Verifica con: ps -el | grep Z",
    tema:    "Procesos",
    acento:  "primary",
    compilar:"gcc zombi.c -o zombi",
    salida:  `Hijo terminado. PID=12346\nPadre durmiendo sin llamar wait()...\n/* En otra terminal: ps -el | grep Z */\n5 Z  1000  12346  12345 ... defunct`,
    salidaNota: "ejecutar ps desde otra terminal mientras el padre duerme",
    codigo: `#include <stdio.h>
#include <stdlib.h>
#include <sys/types.h>
#include <unistd.h>

int main(void) {
    pid_t pid = fork();

    if (pid == 0) {
        printf("Hijo terminado. PID=%ld\\n", (long)getpid());
        exit(EXIT_SUCCESS);
    } else {
        printf("Padre durmiendo sin llamar wait()...\\n");
        sleep(15);  /* Hijo queda zombi durante 15 segundos */
    }
    return EXIT_SUCCESS;
}`,
    aprendimos: [
      "Un proceso zombi existe porque su entrada en la tabla de procesos se mantiene hasta que el padre llama wait().",
      "Los zombis no consumen CPU pero sí ocupan espacio en la tabla de procesos del kernel.",
      "Si el padre termina sin llamar wait(), init (PID 1) adopta al zombi y lo limpia.",
    ],
    mejoras: [
      "Agregar signal(SIGCHLD, SIG_IGN) para que el kernel descarte automáticamente los zombis.",
      "Implementar un manejador de SIGCHLD que llame waitpid(-1, NULL, WNOHANG) en bucle.",
      "Aumentar el tiempo de sleep y observar el zombi con 'top' o 'htop' además de 'ps'.",
    ],
  },

  /* ── CAP 2.8: HILOS ──────────────────────────────────── */
  {
    id:      "hilos-mensajes",
    titulo:  "pthread_create() — Dos hilos con mensajes",
    desc:    "Crea dos hilos con pthread_create(), cada uno imprime su mensaje. Muestra que el orden de ejecución no es determinista.",
    tema:    "Hilos",
    acento:  "secondary",
    compilar:"gcc hilos.c -o hilos -lpthread",
    salida:  `hilo 1\nhilo 2\nHilo 1 retorna: 0\nHilo 2 retorna: 0`,
    salidaNota: "el orden de 'hilo 1' y 'hilo 2' puede invertirse",
    codigo: `#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>

void *funcion_mensaje(void *ptr);

int main(void) {
    pthread_t hilo1, hilo2;
    char *mensaje1 = "hilo 1";
    char *mensaje2 = "hilo 2";
    int uno, dos;

    uno = pthread_create(&hilo1, NULL, funcion_mensaje, (void *)mensaje1);
    dos = pthread_create(&hilo2, NULL, funcion_mensaje, (void *)mensaje2);

    pthread_join(hilo1, NULL);
    pthread_join(hilo2, NULL);

    printf("Hilo 1 retorna: %d\\n", uno);
    printf("Hilo 2 retorna: %d\\n", dos);
    return EXIT_SUCCESS;
}

void *funcion_mensaje(void *ptr) {
    char *mensaje = (char *)ptr;
    printf("%s\\n", mensaje);
    pthread_exit(NULL);
}`,
    aprendimos: [
      "Los hilos comparten el espacio de direcciones del proceso: heap, datos globales y archivos abiertos.",
      "pthread_join() bloquea al hilo llamante hasta que el hilo objetivo termina.",
      "El planificador del kernel decide el orden de ejecución; nunca asumas un orden fijo.",
    ],
    mejoras: [
      "Pasar una estructura con múltiples datos (mensaje + ID) para demostrar paso de argumentos complejos.",
      "Usar pthread_self() dentro de la función para imprimir el TID de cada hilo.",
      "Agregar un contador global de ejecuciones y protegerlo con un mutex para introducir sincronización.",
    ],
  },
  {
    id:      "mutex-contador",
    titulo:  "pthread_mutex — Contador con exclusión mutua",
    desc:    "Dos hilos incrementan y decrementan una variable global. El mutex garantiza que el resultado final siempre sea 0.",
    tema:    "Hilos",
    acento:  "secondary",
    compilar:"gcc mutex_contador.c -o mutex_contador -lpthread",
    salida:  `Valor final del contador: 0`,
    salidaNota: "con mutex siempre 0; sin mutex el resultado varía",
    codigo: `#include <pthread.h>
#include <stdio.h>
#include <stdlib.h>

#define ITERACIONES 100000

int contador = 0;
pthread_mutex_t mutex = PTHREAD_MUTEX_INITIALIZER;

void *incrementar(void *arg) {
    for (int i = 0; i < ITERACIONES; i++) {
        pthread_mutex_lock(&mutex);
        contador++;
        pthread_mutex_unlock(&mutex);
    }
    pthread_exit(NULL);
}

void *decrementar(void *arg) {
    for (int i = 0; i < ITERACIONES; i++) {
        pthread_mutex_lock(&mutex);
        contador--;
        pthread_mutex_unlock(&mutex);
    }
    pthread_exit(NULL);
}

int main(void) {
    pthread_t hilo1, hilo2;

    pthread_create(&hilo1, NULL, incrementar, NULL);
    pthread_create(&hilo2, NULL, decrementar, NULL);
    pthread_join(hilo1, NULL);
    pthread_join(hilo2, NULL);

    printf("Valor final del contador: %d\\n", contador);
    pthread_mutex_destroy(&mutex);
    return EXIT_SUCCESS;
}`,
    aprendimos: [
      "Sin mutex, el resultado de contador es no determinista por la condición de carrera entre hilos.",
      "pthread_mutex_lock/unlock garantiza que la sección crítica es ejecutada por un solo hilo a la vez.",
      "PTHREAD_MUTEX_INITIALIZER es la forma estática de inicializar un mutex en tiempo de compilación.",
    ],
    mejoras: [
      "Compilar sin mutex (comentando lock/unlock) y ejecutar varias veces para observar la condición de carrera.",
      "Usar pthread_mutex_trylock() para intentar el bloqueo sin esperar y manejar el caso de fallo.",
      "Sustituir el mutex por un semáforo POSIX (sem_init/sem_wait/sem_post) y comparar el comportamiento.",
    ],
  },

  /* ── CAP 3: IPC ──────────────────────────────────────── */
  {
    id:      "pipe-ejemplo",
    titulo:  "pipe() — Tubería sin nombre entre padre e hijo",
    desc:    "El padre crea una tubería con pipe(), luego fork(). El padre escribe en fd[1] y el hijo lee de fd[0].",
    tema:    "IPC — Tuberías",
    acento:  "tertiary",
    compilar:"gcc pipe_ejemplo.c -o pipe_ejemplo",
    salida:  `hola mundo`,
    codigo: `#include <stdio.h>
#include <stdlib.h>
#include <sys/types.h>
#include <sys/wait.h>
#include <unistd.h>

#define MAXLINEA 80

int main(void) {
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
    } else if (hijo > 0) {
        close(fd[0]);
        write(fd[1], "hola mundo\\n", 12);
    } else {
        close(fd[1]);
        n = read(fd[0], linea, MAXLINEA);
        write(STDOUT_FILENO, linea, n);
    }
    return EXIT_SUCCESS;
}`,
    aprendimos: [
      "pipe() crea dos descriptores: fd[0] (lectura) y fd[1] (escritura) conectados en el kernel.",
      "Es esencial cerrar el extremo que no se usa en cada proceso para evitar bloqueos.",
      "La tubería es unidireccional; para comunicación bidireccional se necesitan dos tuberías.",
    ],
    mejoras: [
      "Crear dos tuberías para comunicación bidireccional entre padre e hijo.",
      "Usar dup2() para redirigir la salida estándar del hijo al fd[1] de la tubería.",
      "Implementar una tubería con múltiples hijos donde cada uno pasa datos al siguiente.",
    ],
  },
  {
    id:      "fifo-ejemplo",
    titulo:  "mkfifo() — Tubería con nombre (FIFO)",
    desc:    "Crea un FIFO con mkfifo(). El hijo escribe y el padre lee. A diferencia de pipe(), el FIFO persiste en el sistema de archivos.",
    tema:    "IPC — Tuberías",
    acento:  "tertiary",
    compilar:"gcc fifo_ejemplo.c -o fifo_ejemplo",
    salida:  `soy el padre, ID = 12345\nsoy el hijo, ID=12346\nsoy el hijo,ID...`,
    salidaNota: "el hijo escribe, el padre lee e imprime el mensaje",
    codigo: `#include <stdio.h>
#include <stdlib.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <unistd.h>

int main(void) {
    pid_t hijo;
    int file;
    char mensaje[20];

    unlink("namepipe");
    umask(~0666);

    if (mkfifo("namepipe", 0666) == -1) {
        perror("error en mkfifo");
        exit(EXIT_FAILURE);
    }

    if ((hijo = fork()) == 0) {
        fprintf(stdout, "soy el hijo, ID=%ld\\n", (long)getpid());
        if ((file = open("namepipe", O_WRONLY)) == -1) {
            perror("error en open");
            exit(EXIT_FAILURE);
        }
        write(file, "soy el hijo,ID...\\n", 20);
        close(file);
        exit(EXIT_SUCCESS);
    }

    if (hijo > 0) {
        fprintf(stdout, "soy el padre, ID = %ld\\n", (long)getpid());
        if ((file = open("namepipe", O_RDONLY)) == -1) {
            perror("error en open O_RDONLY");
            exit(EXIT_FAILURE);
        }
        read(file, mensaje, 20);
        fprintf(stdout, "%s\\n", mensaje);
        close(file);
    }
    return EXIT_SUCCESS;
}`,
    aprendimos: [
      "A diferencia de pipe(), un FIFO tiene un nombre en el sistema de archivos y puede usarse entre procesos no emparentados.",
      "El open() en modo O_RDONLY bloquea hasta que otro proceso abra el mismo FIFO en O_WRONLY, y viceversa.",
      "El FIFO persiste en disco; es necesario llamar unlink() para eliminarlo al terminar.",
    ],
    mejoras: [
      "Separar el lector y el escritor en dos programas independientes para demostrar IPC entre procesos no emparentados.",
      "Usar O_NONBLOCK en open() para evitar el bloqueo cuando el otro extremo aún no está abierto.",
      "Agregar un bucle de lectura para procesar múltiples mensajes enviados por varios escritores.",
    ],
  },
  {
    id:      "semaforos-posix",
    titulo:  "sem_init() — Semáforos POSIX entre hilos",
    desc:    "Dos hilos comparten una variable global protegida por un semáforo POSIX. El resultado siempre es 0.",
    tema:    "IPC — Semáforos",
    acento:  "secondary",
    compilar:"gcc semaforos_posix.c -o semaforos_posix -lpthread",
    salida:  `Valor de Contador=0`,
    salidaNota: "elimina sem_wait/sem_post para ver la condición de carrera",
    codigo: `#include <pthread.h>
#include <semaphore.h>
#include <stdio.h>
#include <stdlib.h>

#define VALOR 1000

void *funcion1(void *valor);
void *funcion2(void *valor);

int contador = 0;
sem_t semaforo;

int main(void) {
    pthread_t hilo1, hilo2;
    pthread_attr_t attr;

    sem_init(&semaforo, 0, 1);
    pthread_attr_init(&attr);

    pthread_create(&hilo1, &attr, funcion1, NULL);
    pthread_create(&hilo2, &attr, funcion2, NULL);
    pthread_join(hilo1, NULL);
    pthread_join(hilo2, NULL);

    printf("Valor de Contador=%d\\n", contador);
    return EXIT_SUCCESS;
}

void *funcion1(void *valor) {
    for (int i = 0; i < VALOR; i++) {
        sem_wait(&semaforo);
        contador += 1;
        sem_post(&semaforo);
    }
    pthread_exit(EXIT_SUCCESS);
}

void *funcion2(void *valor) {
    for (int i = 0; i < VALOR; i++) {
        sem_wait(&semaforo);
        contador -= 1;
        sem_post(&semaforo);
    }
    pthread_exit(EXIT_SUCCESS);
}`,
    aprendimos: [
      "sem_init con pshared=0 crea un semáforo visible solo para los hilos del mismo proceso.",
      "sem_wait decrementa el semáforo; si vale 0, bloquea al hilo hasta que otro llame sem_post.",
      "La diferencia entre semáforo (conteo) y mutex (binario) está en que el semáforo puede tener valores > 1.",
    ],
    mejoras: [
      "Usar sem_open() en lugar de sem_init() para crear un semáforo con nombre compartible entre procesos.",
      "Inicializar el semáforo con valor 2 para permitir acceso simultáneo a dos hilos (semáforo contador).",
      "Implementar el problema del productor-consumidor usando dos semáforos: 'llenos' y 'vacios'.",
    ],
  },
  {
    id:      "memoria-compartida",
    titulo:  "shmget() — Memoria compartida entre procesos",
    desc:    "El padre crea un segmento de memoria compartida, escribe un valor y el hijo lo lee directamente.",
    tema:    "IPC — Memoria Compartida",
    acento:  "tertiary",
    compilar:"gcc shm_ejemplo.c -o shm_ejemplo",
    salida:  `Padre escribió: 42\nHijo leyó:     42`,
    codigo: `#include <stdio.h>
#include <stdlib.h>
#include <sys/types.h>
#include <sys/ipc.h>
#include <sys/shm.h>
#include <sys/wait.h>
#include <unistd.h>

int main(void) {
    int shmid;
    int *datos;
    pid_t pid;

    shmid = shmget(IPC_PRIVATE, sizeof(int), IPC_CREAT | 0600);
    if (shmid == -1) { perror("shmget"); exit(EXIT_FAILURE); }

    pid = fork();

    if (pid == 0) {
        datos = (int *)shmat(shmid, NULL, 0);
        printf("Hijo leyó:     %d\\n", *datos);
        shmdt(datos);
        exit(EXIT_SUCCESS);
    } else {
        datos = (int *)shmat(shmid, NULL, 0);
        *datos = 42;
        printf("Padre escribió: %d\\n", *datos);
        shmdt(datos);
        wait(NULL);
        shmctl(shmid, IPC_RMID, NULL);
    }
    return EXIT_SUCCESS;
}`,
    aprendimos: [
      "La memoria compartida es el mecanismo IPC más rápido porque evita copias entre espacios de usuario y kernel.",
      "shmat() devuelve un puntero al segmento; a partir de ahí se accede como a memoria normal.",
      "El segmento persiste en el kernel hasta llamar shmctl(IPC_RMID) o reiniciar el sistema.",
    ],
    mejoras: [
      "Agregar un semáforo para sincronizar el acceso: el hijo no debe leer antes de que el padre escriba.",
      "Usar ftok() en lugar de IPC_PRIVATE para que procesos no emparentados puedan encontrar el mismo segmento.",
      "Extender el segmento a un arreglo de estructuras para simular una base de datos en memoria compartida.",
    ],
  },

  /* ═══════════════════════════════════════════════════════
     CAP 5: ADMINISTRACIÓN DE MEMORIA
  ═══════════════════════════════════════════════════════ */
  {
    id:      "tamano-pagina",
    titulo:  "sysconf() — Tamaño de página del sistema",
    desc:    "Obtiene el tamaño de la página de memoria del sistema usando sysconf(_SC_PAGESIZE) y getpagesize().",
    tema:    "Memoria",
    acento:  "primary",
    compilar:"gcc tamano_pagina.c -o tamano_pagina",
    salida:  `Tamaño de página (sysconf):   4096\nTamaño de página (getpagesize): 4096`,
    codigo: `#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>

int main(void) {
    long page_sc  = sysconf(_SC_PAGESIZE);
    int  page_gps = getpagesize();

    printf("Tamaño de página (sysconf):   %ld\\n", page_sc);
    printf("Tamaño de página (getpagesize): %d\\n",  page_gps);

    printf("\\nEso equivale a %.1f KB o %.4f MB\\n",
           page_sc / 1024.0, page_sc / (1024.0 * 1024.0));

    return EXIT_SUCCESS;
}`,
    aprendimos: [
      "El tamaño de página estándar en arquitecturas x86/x86-64 es 4 096 bytes (4 KB).",
      "sysconf(_SC_PAGESIZE) es la forma portátil POSIX de consultar el tamaño de página.",
      "La PTE (Page Table Entry) gestiona el mapeo entre direcciones virtuales y físicas a granularidad de página.",
    ],
    mejoras: [
      "Consultar también sysconf(_SC_PHYS_PAGES) y sysconf(_SC_AVPHYS_PAGES) para obtener la RAM total y disponible.",
      "Imprimir el contenido de /proc/meminfo para comparar con los valores de sysconf.",
      "Usar mmap() con MAP_HUGETLB para experimentar con HugePages de 2 MB.",
    ],
  },
  {
    id:      "sysinfo-memoria",
    titulo:  "sysinfo() — Estadísticas de RAM y swap",
    desc:    "Obtiene información de la memoria principal y el área de swap usando la llamada al sistema sysinfo().",
    tema:    "Memoria",
    acento:  "primary",
    compilar:"gcc sysinfo_memoria.c -o sysinfo_memoria",
    salida:  `Tiempo del sistema: 2 dias, 14:32:07\nTotal RAM : 7827296 KB\nLibre RAM : 412048 KB\nSwap total: 976896 KB\nProcesos  : 312`,
    salidaNota: "los valores dependen del sistema donde se ejecute",
    codigo: `#include <stdio.h>
#include <stdlib.h>
#include <sys/sysinfo.h>

#define minuto 60
#define hora   (minuto * 60)
#define dia    (hora   * 24)
#define KB     1024

int main(void) {
    struct sysinfo si;

    if (sysinfo(&si) != 0) {
        perror("sysinfo");
        return EXIT_FAILURE;
    }

    printf("Tiempo del sistema: %ld dias, %ld:%02ld:%02ld\\n",
           si.uptime / dia,
           (si.uptime % dia)  / hora,
           (si.uptime % hora) / minuto,
           si.uptime % minuto);

    printf("Total RAM : %lu KB\\n", si.totalram  / KB);
    printf("Libre RAM : %lu KB\\n", si.freeram   / KB);
    printf("Swap total: %lu KB\\n", si.totalswap / KB);
    printf("Procesos  : %u\\n",    si.procs);

    /* Porcentaje de uso de RAM */
    double uso = 100.0 * (1.0 - (double)si.freeram / si.totalram);
    printf("Uso de RAM: %.1f%%\\n", uso);

    return EXIT_SUCCESS;
}`,
    aprendimos: [
      "sysinfo() recupera su información directamente de /proc/meminfo y /proc/loadavg.",
      "Los campos totalram y freeram están en bytes; hay que dividir entre mem_unit para el valor real.",
      "El campo procs muestra el número total de procesos activos en el sistema en ese instante.",
    ],
    mejoras: [
      "Mostrar también los campos loads[0/1/2] que contienen el promedio de carga de 1, 5 y 15 minutos.",
      "Calcular y mostrar el porcentaje de uso de swap junto con el de RAM.",
      "Ejecutar en un bucle con sleep(1) para crear un monitor de memoria en tiempo real.",
    ],
  },
  {
    id:      "mmap-ejemplo",
    titulo:  "mmap() — Mapeo anónimo de memoria",
    desc:    "Asigna un bloque de memoria con mmap() usando MAP_ANONYMOUS, escribe en él y lo libera con munmap().",
    tema:    "Memoria",
    acento:  "primary",
    compilar:"gcc mmap_ejemplo.c -o mmap_ejemplo",
    salida:  `Bloque mapeado en: 0x7f3a2c000000\nValores escritos: 0 1 2 3 4\nPrimero: 0 | Último: 4\nMemoria liberada correctamente`,
    codigo: `#include <stdio.h>
#include <stdlib.h>
#include <sys/mman.h>
#include <string.h>

#define N 5

int main(void) {
    /* Asignar N enteros con mmap anónimo */
    int *arr = mmap(NULL,
                    N * sizeof(int),
                    PROT_READ | PROT_WRITE,
                    MAP_PRIVATE | MAP_ANONYMOUS,
                    -1, 0);

    if (arr == MAP_FAILED) {
        perror("mmap");
        return EXIT_FAILURE;
    }

    printf("Bloque mapeado en: %p\\n", (void *)arr);

    /* Escribir y leer */
    for (int i = 0; i < N; i++) arr[i] = i;

    printf("Valores escritos:");
    for (int i = 0; i < N; i++) printf(" %d", arr[i]);
    printf("\\n");

    printf("Primero: %d | Último: %d\\n", arr[0], arr[N-1]);

    /* Liberar */
    if (munmap(arr, N * sizeof(int)) == 0)
        printf("Memoria liberada correctamente\\n");
    else
        perror("munmap");

    return EXIT_SUCCESS;
}`,
    aprendimos: [
      "MAP_ANONYMOUS crea un mapeo sin respaldo en archivo; el contenido se inicializa a cero.",
      "mmap() puede sustituir a malloc() para asignaciones grandes sin pasar por el heap.",
      "munmap() devuelve las páginas al sistema operativo inmediatamente, a diferencia de free().",
    ],
    mejoras: [
      "Usar MAP_SHARED en lugar de MAP_PRIVATE y compartir el mapeo entre padre e hijo tras un fork().",
      "Mapear un archivo real (fd != -1) para leer y modificar su contenido directamente en memoria.",
      "Marcar las páginas como solo-lectura con mprotect(arr, size, PROT_READ) después de escribir.",
    ],
  },

  /* ═══════════════════════════════════════════════════════
     CAP 6: SISTEMA DE ARCHIVOS
  ═══════════════════════════════════════════════════════ */
  {
    id:      "stat-inodo",
    titulo:  "stat() — Información del inodo de un archivo",
    desc:    "Usa stat() para obtener los metadatos del inodo: tipo, permisos, tamaño, fechas y número de enlaces.",
    tema:    "Sistema de Archivos",
    acento:  "secondary",
    compilar:"gcc stat_inodo.c -o stat_inodo",
    salida:  `Archivo     : /etc/hostname\nInodo       : 524289\nTipo        : Archivo regular\nTamaño      : 9 bytes\nEnlaces     : 1\nPermisos    : 100644 (octal)\nÚlt. acceso : Thu Jun  5 10:00:00 2025`,
    salidaNota: "los valores dependen del archivo y el sistema",
    codigo: `#include <stdio.h>
#include <stdlib.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <unistd.h>
#include <time.h>

int main(int argc, char *argv[]) {
    struct stat sb;
    const char *ruta = (argc > 1) ? argv[1] : "/etc/hostname";

    if (stat(ruta, &sb) == -1) {
        perror("stat");
        return EXIT_FAILURE;
    }

    printf("Archivo     : %s\\n", ruta);
    printf("Inodo       : %ld\\n",   (long)sb.st_ino);

    printf("Tipo        : ");
    switch (sb.st_mode & S_IFMT) {
        case S_IFREG:  printf("Archivo regular\\n"); break;
        case S_IFDIR:  printf("Directorio\\n");      break;
        case S_IFLNK:  printf("Enlace simbólico\\n");break;
        case S_IFBLK:  printf("Dispositivo bloque\\n"); break;
        case S_IFCHR:  printf("Dispositivo carácter\\n");break;
        case S_IFIFO:  printf("FIFO\\n");            break;
        default:       printf("Otro\\n");
    }

    printf("Tamaño      : %lld bytes\\n",(long long)sb.st_size);
    printf("Enlaces     : %ld\\n",       (long)sb.st_nlink);
    printf("Permisos    : %lo (octal)\\n",(unsigned long)sb.st_mode);
    printf("Últ. acceso : %s",           ctime(&sb.st_atime));

    return EXIT_SUCCESS;
}`,
    aprendimos: [
      "El inodo almacena todos los metadatos del archivo excepto su nombre, que vive en el directorio.",
      "st_mode contiene tanto el tipo de archivo como sus permisos; S_IFMT es la máscara para extraer el tipo.",
      "stat() sigue enlaces simbólicos; lstat() devuelve la info del propio enlace sin seguirlo.",
    ],
    mejoras: [
      "Aceptar múltiples rutas como argumentos y mostrar la info de cada una en una tabla.",
      "Usar lstat() para detectar y mostrar el destino de los enlaces simbólicos con readlink().",
      "Calcular y mostrar los permisos en formato legible (rwxr-xr-x) a partir de st_mode.",
    ],
  },
  {
    id:      "listar-directorio",
    titulo:  "opendir() / readdir() — Listar un directorio",
    desc:    "Abre un directorio con opendir() y lee cada entrada con readdir(), mostrando nombre, tipo e inodo.",
    tema:    "Sistema de Archivos",
    acento:  "secondary",
    compilar:"gcc listar_dir.c -o listar_dir",
    salida:  `Directorio: /tmp\n[DIR ] .                    inodo: 524289\n[DIR ] ..                   inodo: 2\n[REG ] archivo.txt          inodo: 784321\n[FIFO] mipipe               inodo: 801024`,
    salidaNota: "ejecutar con ./listar_dir /ruta para explorar otro directorio",
    codigo: `#include <stdio.h>
#include <stdlib.h>
#include <dirent.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <unistd.h>
#include <string.h>

int main(int argc, char *argv[]) {
    const char *ruta = (argc > 1) ? argv[1] : ".";
    DIR *dir;
    struct dirent *entrada;
    struct stat sb;
    char ruta_completa[512];

    if ((dir = opendir(ruta)) == NULL) {
        perror("opendir");
        return EXIT_FAILURE;
    }

    printf("Directorio: %s\\n", ruta);

    while ((entrada = readdir(dir)) != NULL) {
        snprintf(ruta_completa, sizeof(ruta_completa),
                 "%s/%s", ruta, entrada->d_name);
        lstat(ruta_completa, &sb);

        const char *tipo;
        switch (sb.st_mode & S_IFMT) {
            case S_IFDIR:  tipo = "DIR "; break;
            case S_IFREG:  tipo = "REG "; break;
            case S_IFLNK:  tipo = "LNK "; break;
            case S_IFIFO:  tipo = "FIFO"; break;
            case S_IFCHR:  tipo = "CHR "; break;
            case S_IFBLK:  tipo = "BLK "; break;
            default:       tipo = "?   ";
        }

        printf("[%s] %-24s inodo: %ld\\n",
               tipo, entrada->d_name, (long)sb.st_ino);
    }

    closedir(dir);
    return EXIT_SUCCESS;
}`,
    aprendimos: [
      "opendir() devuelve un flujo de directorio; cada llamada a readdir() avanza una entrada.",
      "La estructura dirent contiene d_name (nombre) y d_ino (número de inodo) de cada archivo.",
      "Es necesario llamar closedir() al terminar para liberar el descriptor de directorio.",
    ],
    mejoras: [
      "Implementar recursividad para listar subdirectorios y generar una vista en árbol.",
      "Ordenar las entradas alfabéticamente usando scandir() en lugar de opendir/readdir.",
      "Mostrar también el tamaño y la fecha de modificación combinando readdir() con stat().",
    ],
  },
  {
    id:      "statvfs-ejemplo",
    titulo:  "statvfs() — Estadísticas del sistema de archivos",
    desc:    "Obtiene el espacio total, libre y disponible de un sistema de archivos montado usando statvfs().",
    tema:    "Sistema de Archivos",
    acento:  "secondary",
    compilar:"gcc statvfs_ejemplo.c -o statvfs_ejemplo",
    salida:  `Sistema de archivos: /\nTamaño de bloque : 4096 bytes\nBloques totales  : 30277632\nBloques libres   : 12453891\nBloques dispon.  : 11842018\nEspacio total    : 117.5 GB\nEspacio libre    : 48.2 GB\nInodos totales   : 7798784\nInodos libres    : 7123456`,
    salidaNota: "los valores dependen de la partición del sistema",
    codigo: `#include <stdio.h>
#include <stdlib.h>
#include <sys/statvfs.h>

int main(int argc, char *argv[]) {
    struct statvfs vfs;
    const char *ruta = (argc > 1) ? argv[1] : "/";

    if (statvfs(ruta, &vfs) != 0) {
        perror("statvfs");
        return EXIT_FAILURE;
    }

    double total_gb = (double)(vfs.f_blocks * vfs.f_frsize) / (1024*1024*1024.0);
    double libre_gb = (double)(vfs.f_bfree  * vfs.f_frsize) / (1024*1024*1024.0);

    printf("Sistema de archivos: %s\\n", ruta);
    printf("Tamaño de bloque : %lu bytes\\n",  vfs.f_bsize);
    printf("Bloques totales  : %lu\\n",         (unsigned long)vfs.f_blocks);
    printf("Bloques libres   : %lu\\n",         (unsigned long)vfs.f_bfree);
    printf("Bloques dispon.  : %lu\\n",         (unsigned long)vfs.f_bavail);
    printf("Espacio total    : %.1f GB\\n",     total_gb);
    printf("Espacio libre    : %.1f GB\\n",     libre_gb);
    printf("Inodos totales   : %lu\\n",         (unsigned long)vfs.f_files);
    printf("Inodos libres    : %lu\\n",         (unsigned long)vfs.f_ffree);

    return EXIT_SUCCESS;
}`,
    aprendimos: [
      "statvfs() es la interfaz POSIX estándar; statfs() es la versión Linux-específica no portable.",
      "f_bavail puede ser menor que f_bfree porque algunos bloques están reservados para root.",
      "Un sistema de archivos puede quedarse sin inodos antes de quedarse sin espacio en disco.",
    ],
    mejoras: [
      "Calcular y mostrar el porcentaje de uso: (bloques_usados / bloques_totales) * 100.",
      "Aceptar múltiples rutas y mostrar una tabla comparativa de todos los SA montados.",
      "Leer /proc/mounts para listar automáticamente todos los sistemas de archivos montados.",
    ],
  },
  {
    id:      "major-minor-dev",
    titulo:  "major() / minor() — Números de dispositivo",
    desc:    "Extrae los números mayor y menor de un archivo de dispositivo usando stat() y las macros major()/minor().",
    tema:    "Sistema de Archivos",
    acento:  "secondary",
    compilar:"gcc major_minor.c -o major_minor",
    salida:  `Archivo: /dev/tty1\nTipo   : Dispositivo de caracteres\nMajor  : 4\nMinor  : 1\n\nArchivo: /dev/sda\nTipo   : Dispositivo de bloques\nMajor  : 8\nMinor  : 0`,
    salidaNota: "ejecutar con sudo si el archivo requiere permisos de root",
    codigo: `#include <stdio.h>
#include <stdlib.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <unistd.h>
#include <sys/sysmacros.h>

int main(int argc, char *argv[]) {
    if (argc < 2) {
        fprintf(stderr, "Uso: %s <ruta_dispositivo>\\n", argv[0]);
        fprintf(stderr, "Ejemplo: %s /dev/tty1\\n", argv[0]);
        return EXIT_FAILURE;
    }

    struct stat sb;

    if (stat(argv[1], &sb) == -1) {
        perror("stat");
        return EXIT_FAILURE;
    }

    printf("Archivo: %s\\n", argv[1]);

    if (S_ISCHR(sb.st_mode))
        printf("Tipo   : Dispositivo de caracteres\\n");
    else if (S_ISBLK(sb.st_mode))
        printf("Tipo   : Dispositivo de bloques\\n");
    else {
        printf("Tipo   : No es un archivo de dispositivo\\n");
        return EXIT_FAILURE;
    }

    printf("Major  : %u\\n", major(sb.st_rdev));
    printf("Minor  : %u\\n", minor(sb.st_rdev));

    return EXIT_SUCCESS;
}`,
    aprendimos: [
      "El número mayor identifica el tipo de dispositivo (controlador); el menor identifica la unidad específica.",
      "El kernel usa el par major:minor para indexar la tabla de controladores (drivers) del dispositivo.",
      "st_rdev de la estructura stat contiene el número de dispositivo en formato dev_t.",
    ],
    mejoras: [
      "Iterar sobre /dev con opendir/readdir para listar todos los dispositivos con sus major:minor.",
      "Usar makedev(major, minor) para crear un dev_t y pasarlo a mknod() para crear un nodo de dispositivo.",
      "Comparar la salida con 'lsblk -d -o NAME,MAJ:MIN' para verificar los resultados.",
    ],
  },

  /* ═══════════════════════════════════════════════════════
     CAP 7: SEÑALES
  ═══════════════════════════════════════════════════════ */
  {
    id:      "captura-sigint",
    titulo:  "signal() — Capturar SIGINT (Ctrl+C)",
    desc:    "Instala un manejador personalizado para SIGINT. El proceso solo termina después de recibir la señal 5 veces.",
    tema:    "Señales",
    acento:  "tertiary",
    compilar:"gcc captura_sigint.c -o captura_sigint",
    salida:  `Esperando Ctrl+C (quedan 5)...\n^CSeñal 2 recibida. Quedan 4\nEsperando Ctrl+C (quedan 4)...\n^CSeñal 2 recibida. Quedan 3\n...\nÚltima señal. Terminando.`,
    salidaNota: "presiona Ctrl+C 5 veces para terminar",
    codigo: `#include <stdio.h>
#include <signal.h>
#include <stdlib.h>
#include <unistd.h>

#define LIMITE 5

static int contador = LIMITE;

void manejador_sigint(int sig) {
    contador--;
    if (contador <= 0) {
        printf("\\nÚltima señal. Terminando.\\n");
        exit(EXIT_SUCCESS);
    }
    printf("\\nSeñal %d recibida. Quedan %d\\n", sig, contador);
    /* Reinstalar el manejador (requerido en algunos sistemas) */
    signal(SIGINT, manejador_sigint);
}

int main(void) {
    signal(SIGINT, manejador_sigint);

    while (1) {
        printf("Esperando Ctrl+C (quedan %d)...\\n", contador);
        sleep(3);
    }
    return EXIT_SUCCESS;
}`,
    aprendimos: [
      "signal() permite reemplazar la acción por defecto de una señal con una función propia.",
      "El manejador se ejecuta de forma asíncrona: puede interrumpir sleep() u otras syscalls.",
      "SIGKILL (9) y SIGSTOP (19) no pueden ser capturadas ni ignoradas por ningún proceso.",
    ],
    mejoras: [
      "Usar sigaction() en lugar de signal() para un comportamiento más portable y predecible.",
      "Agregar manejo de SIGTERM para responder también a kill desde la terminal.",
      "Usar sig_atomic_t para la variable contador y garantizar acceso seguro desde el manejador.",
    ],
  },
  {
    id:      "kill-senales",
    titulo:  "kill() y raise() — Enviar señales entre procesos",
    desc:    "El padre crea un hijo, espera 2 segundos y lo termina con SIGTERM usando kill(). El hijo también se auto-envía SIGUSR1 con raise().",
    tema:    "Señales",
    acento:  "tertiary",
    compilar:"gcc kill_senales.c -o kill_senales",
    salida:  `Hijo PID=12346 iniciado. Esperando señales...\nHijo: recibí SIGUSR1 (auto-enviada con raise)\nPadre: enviando SIGTERM al hijo 12346...\nHijo: recibí SIGTERM. Terminando limpiamente.\nPadre: hijo terminado por señal 15`,
    codigo: `#include <stdio.h>
#include <stdlib.h>
#include <signal.h>
#include <unistd.h>
#include <sys/wait.h>

void manejador(int sig) {
    if (sig == SIGUSR1)
        printf("Hijo: recibí SIGUSR1 (auto-enviada con raise)\\n");
    else if (sig == SIGTERM)
        printf("Hijo: recibí SIGTERM. Terminando limpiamente.\\n");
}

int main(void) {
    pid_t pid = fork();

    if (pid == 0) {
        /* Hijo: instala manejadores */
        signal(SIGUSR1, manejador);
        signal(SIGTERM, manejador);

        printf("Hijo PID=%ld iniciado. Esperando señales...\\n", (long)getpid());
        raise(SIGUSR1);   /* Auto-envío */
        sleep(10);        /* Espera hasta ser terminado */
        exit(EXIT_SUCCESS);
    } else {
        sleep(2);
        printf("Padre: enviando SIGTERM al hijo %ld...\\n", (long)pid);
        kill(pid, SIGTERM);

        int status;
        waitpid(pid, &status, 0);
        if (WIFSIGNALED(status))
            printf("Padre: hijo terminado por señal %d\\n", WTERMSIG(status));
        else
            printf("Padre: hijo terminó con código %d\\n", WEXITSTATUS(status));
    }
    return EXIT_SUCCESS;
}`,
    aprendimos: [
      "kill() envía cualquier señal a cualquier proceso si se tienen los permisos adecuados.",
      "raise(sig) es equivalente a kill(getpid(), sig): el proceso se envía la señal a sí mismo.",
      "WIFSIGNALED y WTERMSIG permiten al padre saber si el hijo fue terminado por una señal.",
    ],
    mejoras: [
      "Enviar SIGKILL (9) en lugar de SIGTERM para demostrar que no puede capturarse.",
      "Usar kill(0, sig) para enviar la señal a todos los procesos del mismo grupo de proceso.",
      "Implementar comunicación bidireccional usando SIGUSR1 y SIGUSR2 en ambas direcciones.",
    ],
  },
  {
    id:      "alarm-pausa",
    titulo:  "alarm() + pause() — Temporizador con señal SIGALRM",
    desc:    "Programa una alarma con alarm(), el proceso se suspende con pause() y un manejador de SIGALRM lo despierta.",
    tema:    "Señales",
    acento:  "tertiary",
    compilar:"gcc alarm_pausa.c -o alarm_pausa",
    salida:  `Alarma programada para 3 segundos.\nContando: 0 1 2 3 4 5 ...\n\n¡Alarma! SIGALRM recibida tras ~3s\nContador llegó a: 847392`,
    salidaNota: "el contador varía según la velocidad del procesador",
    codigo: `#include <stdio.h>
#include <signal.h>
#include <stdlib.h>
#include <unistd.h>

#define SEGUNDOS 3

static volatile sig_atomic_t activo = 1;
static long contador = 0;

void manejador_alarm(int sig) {
    (void)sig;
    activo = 0;
}

int main(void) {
    signal(SIGALRM, manejador_alarm);

    printf("Alarma programada para %d segundos.\\n", SEGUNDOS);
    alarm(SEGUNDOS);

    printf("Contando:");
    fflush(stdout);

    /* Contar mientras la alarma no haya disparado */
    while (activo) {
        contador++;
    }

    printf("\\n\\n¡Alarma! SIGALRM recibida tras ~%ds\\n", SEGUNDOS);
    printf("Contador llegó a: %ld\\n", contador);

    return EXIT_SUCCESS;
}`,
    aprendimos: [
      "alarm() programa una sola alarma por proceso; una segunda llamada cancela la primera.",
      "volatile sig_atomic_t garantiza que la variable sea leída correctamente desde el manejador.",
      "pause() es más eficiente que un bucle de espera activa: libera la CPU hasta que llega una señal.",
    ],
    mejoras: [
      "Usar setitimer(ITIMER_REAL, ...) para alarmas con precisión de microsegundos en lugar de alarm().",
      "Implementar un temporizador repetitivo reinstalando alarm() dentro del propio manejador.",
      "Agregar una segunda alarma con ITIMER_VIRTUAL que solo cuenta tiempo de CPU del proceso.",
    ],
  },
  {
    id:      "setjmp-longjmp",
    titulo:  "setjmp() / longjmp() — Salto no local desde manejador",
    desc:    "setjmp() guarda el contexto del programa. Al recibir SIGUSR1, longjmp() restaura ese contexto y el bucle principal continúa desde el punto guardado.",
    tema:    "Señales",
    acento:  "tertiary",
    compilar:"gcc setjmp_ejemplo.c -o setjmp_ejemplo",
    salida:  `[Estado 0] Durmiendo 5s... (kill -10 PID para interrumpir)\nkill -10 12212\nRegreso al estado 0 (longjmp activado)\n[Estado 1] Durmiendo 5s...`,
    salidaNota: "enviar 'kill -10 PID' desde otra terminal para ver el salto",
    codigo: `#include <stdio.h>
#include <signal.h>
#include <setjmp.h>
#include <stdlib.h>
#include <unistd.h>

static jmp_buf env;

void manejador_usr1(int sig) {
    (void)sig;
    /* Reinstalar y saltar de regreso al setjmp */
    signal(SIGUSR1, manejador_usr1);
    longjmp(env, 1);
}

int main(void) {
    signal(SIGUSR1, manejador_usr1);

    printf("PID de este proceso: %ld\\n", (long)getpid());
    printf("Usa: kill -10 %ld  para enviar SIGUSR1\\n\\n", (long)getpid());

    for (int i = 0; i < 5; i++) {
        if (setjmp(env) == 0)
            printf("[Estado %d] Durmiendo 5s...\\n", i);
        else
            printf("Regreso al estado %d (longjmp activado)\\n", i);

        sleep(5);
    }

    printf("Programa terminado normalmente.\\n");
    return EXIT_SUCCESS;
}`,
    aprendimos: [
      "setjmp() guarda el contexto (registros, pila, PC) y retorna 0 en la primera llamada.",
      "longjmp(env, val) restaura ese contexto haciendo que setjmp() retorne el valor val (nunca 0).",
      "Este mecanismo es útil para implementar recuperación de errores o manejo de excepciones en C.",
    ],
    mejoras: [
      "Usar sigsetjmp/siglongjmp en lugar de setjmp/longjmp para que también se restaure la máscara de señales.",
      "Implementar un sistema de manejo de excepciones con múltiples niveles de try/catch usando setjmp.",
      "Combinar con SIGALRM para implementar un timeout: si la operación tarda más de N segundos, longjmp.",
    ],
  },
];

/* ─── Helpers de estilo ──────────────────────────────────── */
const acentoText:   Record<string, string> = {
  primary:   "text-primary",
  secondary: "text-secondary",
  tertiary:  "text-tertiary",
};
const acentoBadge:  Record<string, string> = {
  primary:   "bg-primary-c/15 text-primary",
  secondary: "bg-secondary/10 text-secondary",
  tertiary:  "bg-tertiary/10 text-tertiary",
};
const acentoBorder: Record<string, string> = {
  primary:   "hover:border-primary",
  secondary: "hover:border-secondary",
  tertiary:  "hover:border-tertiary",
};

const TEMAS = [
  "Todos",
  "Procesos",
  "Hilos",
  "IPC — Tuberías",
  "IPC — Semáforos",
  "IPC — Memoria Compartida",
  "Memoria",
  "Sistema de Archivos",
  "Señales",
];

/* ─── Botón copiar ───────────────────────────────────────── */
function CopyButton({ texto, label = "Copiar" }: { texto: string; label?: string }) {
  const [copiado, setCopiado] = useState(false);
  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(texto);
    } catch {
      const el = document.createElement("textarea");
      el.value = texto;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };
  return (
    <button
      onClick={copiar}
      className={`flex items-center gap-1 text-xs transition-colors ${
        copiado ? "text-secondary" : "text-primary hover:underline"
      }`}
    >
      <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
        {copiado ? "check" : "content_copy"}
      </span>
      {copiado ? "Copiado" : label}
    </button>
  );
}

/* ─── Componente principal ───────────────────────────────── */
export default function ProgramasClient() {
  const [filtro, setFiltro] = useState("Todos");

  const visibles = filtro === "Todos"
    ? programas
    : programas.filter((p) => p.tema === filtro);

  return (
    <div className="max-w-5xl mx-auto px-6 md:px-16 py-12">

      {/* Header */}
      <div className="mb-10">
        <div className="font-mono text-xs text-muted mb-3 flex items-center gap-2">
          <span>Inicio</span>
          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>chevron_right</span>
          <span className="text-primary">Programas</span>
        </div>
        <h1 className="text-3xl font-bold text-text-base mb-2">Programas y Prácticas</h1>
        <p className="text-text-dim text-sm">
          Código fuente de los temas del portafolio — capítulos 2, 3, 5, 6 y 7. Todos compilables en Linux con GCC.
        </p>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-2 mb-10">
        {TEMAS.map((t) => (
          <button
            key={t}
            onClick={() => setFiltro(t)}
            className={`text-xs px-3 py-1.5 rounded font-mono border transition-colors ${
              filtro === t
                ? "bg-primary-c text-bg border-primary-c"
                : "border-border text-text-dim hover:border-primary hover:text-primary"
            }`}
          >
            {t}
          </button>
        ))}
        <a
          href="https://github.com/Julio-Atenco"
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto flex items-center gap-1.5 text-xs text-text-dim hover:text-primary transition-colors border border-border rounded px-3 py-1.5"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>code</span>
          GitHub
        </a>
      </div>

      {/* Contador */}
      <p className="font-mono text-xs text-muted mb-6">
        Mostrando{" "}
        <span className="text-text-base font-semibold">{visibles.length}</span>{" "}
        de {programas.length} programas
      </p>

      {/* Lista */}
      <div className="space-y-10">
        {visibles.map(({
          id, titulo, desc, tema, acento,
          codigo, compilar, salida, salidaNota,
          aprendimos, mejoras,
        }) => (
          <section
            key={id}
            id={id}
            className={`bg-surf-low border border-border rounded-lg overflow-hidden ${acentoBorder[acento]} transition-all`}
          >
            {/* ── Cabecera ── */}
            <div className="px-6 py-5 border-b border-border flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div>
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-mono ${acentoBadge[acento]}`}>
                    {tema}
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-mono bg-surf-high text-muted">C</span>
                </div>
                <h2 className={`font-bold text-lg ${acentoText[acento]}`}>{titulo}</h2>
                <p className="text-text-dim text-sm mt-1">{desc}</p>
              </div>
            </div>

            {/* ── Compilar ── */}
            {compilar && (
              <div className="px-6 py-3 border-b border-border bg-surf-mid flex items-center gap-3">
                <span className="font-mono text-[11px] text-muted uppercase tracking-wider shrink-0">
                  Compilar:
                </span>
                <code className="font-mono text-xs text-secondary flex-1">{compilar}</code>
                <CopyButton texto={compilar} />
              </div>
            )}

            {/* ── Código ── */}
            <div>
              <div className="flex items-center gap-1.5 px-6 py-3 border-b border-border bg-surf-high">
                <span className="w-2.5 h-2.5 rounded-full bg-danger" />
                <span className="w-2.5 h-2.5 rounded-full bg-tertiary" />
                <span className="w-2.5 h-2.5 rounded-full bg-secondary" />
                <span className="font-mono text-[11px] text-muted ml-3">{id}.c</span>
                <div className="ml-auto">
                  <CopyButton texto={codigo} label="Copiar código" />
                </div>
              </div>
              <pre className="p-6 overflow-x-auto bg-bg max-h-96">
                <code className="font-mono text-xs text-secondary/90 leading-relaxed">{codigo}</code>
              </pre>
            </div>

            {/* ── Salida ── */}
            {salida && (
              <div className="border-t border-border">
                <div className="flex items-center gap-2 px-6 py-2 bg-surf-high">
                  <span className="material-symbols-outlined text-tertiary" style={{ fontSize: 14 }}>terminal</span>
                  <span className="font-mono text-[10px] text-tertiary uppercase tracking-wider">
                    Salida esperada
                  </span>
                  {salidaNota && (
                    <span className="font-mono text-[10px] text-muted ml-auto italic">{salidaNota}</span>
                  )}
                </div>
                <pre className="px-6 py-4 bg-bg overflow-x-auto">
                  <code className="font-mono text-xs text-tertiary/90 leading-relaxed">{salida}</code>
                </pre>
              </div>
            )}

            {/* ── Qué aprendimos / Cómo mejorar ── */}
            <div className="grid sm:grid-cols-2 border-t border-border divide-y sm:divide-y-0 sm:divide-x divide-border">
              {/* Qué aprendimos */}
              <div className="px-6 py-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="material-symbols-outlined text-secondary" style={{ fontSize: 16 }}>
                    school
                  </span>
                  <span className="font-mono text-[11px] text-secondary uppercase tracking-wider font-semibold">
                    Qué aprendimos
                  </span>
                </div>
                <ul className="space-y-2">
                  {aprendimos.map((punto, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-text-dim leading-relaxed">
                      <span className="text-secondary shrink-0 mt-0.5">▸</span>
                      {punto}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Cómo mejorar */}
              <div className="px-6 py-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="material-symbols-outlined text-tertiary" style={{ fontSize: 16 }}>
                    rocket_launch
                  </span>
                  <span className="font-mono text-[11px] text-tertiary uppercase tracking-wider font-semibold">
                    Cómo mejorarlo
                  </span>
                </div>
                <ul className="space-y-2">
                  {mejoras.map((punto, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-text-dim leading-relaxed">
                      <span className="text-tertiary shrink-0 mt-0.5">▸</span>
                      {punto}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </section>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-14 p-8 bg-surf-low border border-border rounded-lg text-center">
        <span className="material-symbols-outlined text-3xl text-primary/50 mb-3 block">add_circle</span>
        <h3 className="font-bold text-text-base mb-2">¿Quieres agregar un programa?</h3>
        <p className="text-text-dim text-sm mb-4">
          Contribuye al repositorio enviando un pull request en GitHub.
        </p>
        <a
          href="https://github.com/Julio-Atenco/Proyecto-SO"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-primary-c text-bg text-sm font-semibold px-5 py-2.5 rounded hover:bg-primary transition-colors"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>code</span>
          Ir al repositorio
        </a>
      </div>
    </div>
  );
}