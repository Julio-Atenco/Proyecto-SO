"use client";

import { useState } from "react";

/* ─── Tipos ──────────────────────────────────────────────── */
interface Programa {
  id:       string;
  titulo:   string;
  desc:     string;
  tema:     string;
  acento:   "primary" | "secondary" | "tertiary";
  compilar?: string;
  salida?:  string;
  salidaNota?: string;
  codigo:   string;
}

/* ─── Datos — solo temas del capítulo 2 y 3 de las notas ── */
const programas: Programa[] = [
  /* ── CAP 2: PROCESOS ─────────────────────────────────── */
  {
    id:      "fork-getpid",
    titulo:  "fork() — Identificar padre e hijo",
    desc:    "Crea un proceso hijo con fork() e imprime el PID de ambos con getpid() y getppid().",
    tema:    "Procesos",
    acento:  "primary",
    compilar:"gcc fork_getpid.c -o fork_getpid",
    salida:  `Soy el padre, PID=12345
Soy el hijo,  PID=12346`,
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
  },
  {
    id:      "cadena-procesos",
    titulo:  "Cadena lineal de procesos P0→P1→...→Pn",
    desc:    "Cada proceso crea un solo hijo y deja de crear más. Genera una cadena donde el PPID de cada proceso es el PID del anterior.",
    tema:    "Procesos",
    acento:  "primary",
    compilar:"gcc cadena.c -o cadena",
    salida:  `Proceso PID=12346, PPID=12345
Proceso PID=12347, PPID=12346
Proceso PID=12348, PPID=12347
Proceso PID=12349, PPID=12348
Proceso PID=12350, PPID=12349`,
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
  },
  {
    id:      "wait-ejemplo",
    titulo:  "wait() — Sincronización padre-hijo",
    desc:    "El padre espera a que el hijo termine usando wait() y recupera su código de salida con WEXITSTATUS.",
    tema:    "Procesos",
    acento:  "primary",
    compilar:"gcc wait_ejemplo.c -o wait_ejemplo",
    salida:  `Hijo PID=12346 terminando con exit(42)...
Padre: hijo terminó con código 42`,
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
  },
  {
    id:      "zombi",
    titulo:  "Estado Zombi — demostración",
    desc:    "El hijo termina pero el padre no llama a wait(). El hijo queda como zombi 15 segundos. Verifica con: ps -el | grep Z",
    tema:    "Procesos",
    acento:  "primary",
    compilar:"gcc zombi.c -o zombi",
    salida:  `Hijo terminado. PID=12346
Padre durmiendo sin llamar wait()...
/* En otra terminal: ps -el | grep Z */
5 Z  1000  12346  12345 ... defunct`,
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
  },

  /* ── CAP 2.8: HILOS ──────────────────────────────────── */
  {
    id:      "hilos-mensajes",
    titulo:  "pthread_create() — Dos hilos con mensajes",
    desc:    "Crea dos hilos con pthread_create(), cada uno imprime su mensaje. Muestra que el orden de ejecución no es determinista.",
    tema:    "Hilos",
    acento:  "secondary",
    compilar:"gcc hilos.c -o hilos -lpthread",
    salida:  `hilo 1
hilo 2
Hilo 1 retorna: 0
Hilo 2 retorna: 0`,
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
  },
  {
    id:      "mutex-contador",
    titulo:  "pthread_mutex — Contador con exclusión mutua",
    desc:    "Dos hilos incrementan y decrementan una variable global. El mutex garantiza que el resultado final siempre sea 0. Sin él, el resultado es no determinista.",
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
  },

  /* ── CAP 3: IPC — TUBERÍAS ───────────────────────────── */
  {
    id:      "pipe-ejemplo",
    titulo:  "pipe() — Tubería sin nombre entre padre e hijo",
    desc:    "El padre crea una tubería con pipe(), luego crea un hijo con fork(). El padre escribe en fd[1] y el hijo lee de fd[0].",
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
        /* Padre: escribe en la tubería */
        close(fd[0]);
        write(fd[1], "hola mundo\\n", 12);
    } else {
        /* Hijo: lee de la tubería */
        close(fd[1]);
        n = read(fd[0], linea, MAXLINEA);
        write(STDOUT_FILENO, linea, n);
    }
    return EXIT_SUCCESS;
}`,
  },
  {
    id:      "fifo-ejemplo",
    titulo:  "mkfifo() — Tubería con nombre (FIFO)",
    desc:    "Crea un archivo FIFO con mkfifo(). El hijo escribe un mensaje y el padre lo lee. A diferencia de pipe(), el FIFO persiste en el sistema de archivos.",
    tema:    "IPC — Tuberías",
    acento:  "tertiary",
    compilar:"gcc fifo_ejemplo.c -o fifo_ejemplo",
    salida:  `soy el padre, ID = 12345
soy el hijo, ID=12346
soy el hijo,ID...`,
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

    unlink("namepipe");       /* Borra si ya existe */
    umask(~0666);

    if (mkfifo("namepipe", 0666) == -1) {
        perror("error en mkfifo");
        exit(EXIT_FAILURE);
    }

    if ((hijo = fork()) == 0) {
        /* Hijo: abre para escritura */
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
        /* Padre: abre para lectura */
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
  },

  /* ── CAP 3.2: SEMÁFOROS POSIX ────────────────────────── */
  {
    id:      "semaforos-posix",
    titulo:  "sem_init() — Semáforos POSIX entre hilos",
    desc:    "Dos hilos comparten una variable global protegida por un semáforo POSIX. Uno incrementa y otro decrementa. El resultado siempre es 0.",
    tema:    "IPC — Semáforos",
    acento:  "secondary",
    compilar:"gcc semaforos_posix.c -o semaforos_posix -lpthread",
    salida:  `Valor de Contador=0`,
    salidaNota: "elimina el sem_wait/sem_post para ver la condición de carrera",
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

    /* pshared=0: semáforo compartido entre hilos del mismo proceso */
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
        sem_wait(&semaforo);   /* Decrementa (bloquea) */
        contador += 1;
        sem_post(&semaforo);   /* Incrementa (desbloquea) */
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
  },

  /* ── CAP 3.3: MEMORIA COMPARTIDA ────────────────────── */
  {
    id:      "memoria-compartida",
    titulo:  "shmget() — Memoria compartida entre procesos",
    desc:    "El padre crea un segmento de memoria compartida con shmget() y escribe un valor. El hijo se une con shmat() y lee directamente el mismo valor.",
    tema:    "IPC — Memoria Compartida",
    acento:  "tertiary",
    compilar:"gcc shm_ejemplo.c -o shm_ejemplo",
    salida:  `Padre escribió: 42
Hijo leyó:     42`,
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

    /* Crear segmento de 1 entero */
    shmid = shmget(IPC_PRIVATE, sizeof(int), IPC_CREAT | 0600);
    if (shmid == -1) { perror("shmget"); exit(EXIT_FAILURE); }

    pid = fork();

    if (pid == 0) {
        /* Hijo: unirse y leer */
        datos = (int *)shmat(shmid, NULL, 0);
        printf("Hijo leyó:     %d\\n", *datos);
        shmdt(datos);
        exit(EXIT_SUCCESS);
    } else {
        /* Padre: unirse, escribir y esperar */
        datos = (int *)shmat(shmid, NULL, 0);
        *datos = 42;
        printf("Padre escribió: %d\\n", *datos);
        shmdt(datos);
        wait(NULL);
        shmctl(shmid, IPC_RMID, NULL);  /* Eliminar segmento */
    }
    return EXIT_SUCCESS;
}`,
  },
];

/* ─── Helpers de estilo ───────────────────────────────────── */
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

/* Temas disponibles para filtrar */
const temas = ["Todos", "Procesos", "Hilos", "IPC — Tuberías", "IPC — Semáforos", "IPC — Memoria Compartida"];

/* ─── Botón copiar ────────────────────────────────────────── */
function CopyButton({ texto, label = "Copiar" }: { texto: string; label?: string }) {
  const [copiado, setCopiado] = useState(false);

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(texto);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      /* fallback para navegadores sin clipboard API */
      const el = document.createElement("textarea");
      el.value = texto;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    }
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

/* ─── Componente principal ────────────────────────────────── */
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
          Código fuente de los temas del portafolio. Todos compilables en Linux con GCC.
        </p>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-2 mb-10">
        {temas.map((t) => (
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
        Mostrando <span className="text-text-base font-semibold">{visibles.length}</span> de {programas.length} programas
      </p>

      {/* Lista */}
      <div className="space-y-10">
        {visibles.map(({ id, titulo, desc, tema, acento, codigo, compilar, salida, salidaNota }) => (
          <section
            key={id}
            id={id}
            className={`bg-surf-low border border-border rounded-lg overflow-hidden ${acentoBorder[acento]} transition-all`}
          >
            {/* Cabecera de la tarjeta */}
            <div className="px-6 py-5 border-b border-border flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div>
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-mono ${acentoBadge[acento]}`}>
                    {tema}
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-mono bg-surf-top text-muted">C</span>
                </div>
                <h2 className={`font-bold text-lg ${acentoText[acento]}`}>{titulo}</h2>
                <p className="text-text-dim text-sm mt-1">{desc}</p>
              </div>
            </div>

            {/* Línea de compilación */}
            {compilar && (
              <div className="px-6 py-3 border-b border-border bg-surf-mid flex items-center gap-3">
                <span className="font-mono text-[11px] text-muted uppercase tracking-wider shrink-0">
                  Compilar:
                </span>
                <code className="font-mono text-xs text-secondary flex-1">{compilar}</code>
                <CopyButton texto={compilar} label="Copiar" />
              </div>
            )}

            {/* Código fuente */}
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

            {/* Salida esperada */}
            {salida && (
              <div className="border-t border-border">
                <div className="flex items-center gap-2 px-6 py-2 bg-surf-high">
                  <span className="material-symbols-outlined text-tertiary" style={{ fontSize: 14 }}>
                    terminal
                  </span>
                  <span className="font-mono text-[10px] text-tertiary uppercase tracking-wider">
                    Salida esperada
                  </span>
                  {salidaNota && (
                    <span className="font-mono text-[10px] text-muted ml-auto italic">
                      {salidaNota}
                    </span>
                  )}
                </div>
                <pre className="px-6 py-4 bg-bg overflow-x-auto">
                  <code className="font-mono text-xs text-tertiary/90 leading-relaxed">{salida}</code>
                </pre>
              </div>
            )}
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