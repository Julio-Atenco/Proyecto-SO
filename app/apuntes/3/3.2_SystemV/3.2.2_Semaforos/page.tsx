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
  title: "3.2.2 Semáforos en System V — Portafolio SO",
};

const toc = [
  { id: "teoria", label: "Teoría" },
  { id: "estructura", label: "Estructura del semáforo" },
  { id: "prototipos", label: "Prototipos" },
  { id: "codigo", label: "Código de ejemplo" },
  { id: "ejecucion", label: "Ejecución y salida" },
  { id: "reflexion", label: "Reflexión" },
];

const semaforoC = `/* ============================================================
   3.2.2 Semaforos en derivados de System V
   Sincronizacion padre-hijo con semget / semctl / semop.
   Compilar: gcc -Wall semaforo.c -o semaforo
   Ejecutar: ./semaforo
============================================================ */
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/ipc.h>
#include <sys/sem.h>
#include <sys/wait.h>

/* En Linux es necesario definir esta union nosotros mismos */
union semun {
    int val;
    struct semid_ds *buf;
    unsigned short *array;
};

void P(int semid)                           /* operacion esperar (wait) */
{
    struct sembuf sb = {0, -1, 0};
    semop(semid, &sb, 1);
}

void V(int semid)                           /* operacion senalar (signal) */
{
    struct sembuf sb = {0, +1, 0};
    semop(semid, &sb, 1);
}

int main(void)
{
    int semid;
    union semun arg;
    pid_t hijo;

    /* Crear un conjunto con 1 semaforo */
    if ((semid = semget(IPC_PRIVATE, 1, IPC_CREAT | 0600)) == -1) {
        perror("semget"); exit(EXIT_FAILURE);
    }

    /* Inicializar semaforo en 0 (hijo debera esperar) */
    arg.val = 0;
    semctl(semid, 0, SETVAL, arg);

    setbuf(stdout, NULL);
    if ((hijo = fork()) == 0) {
        printf("[Hijo]  esperando senal del padre...\\n");
        P(semid);                           /* bloquea hasta V */
        printf("[Hijo]  recibi la senal, continuo!\\n");
        exit(EXIT_SUCCESS);
    } else {
        printf("[Padre] trabajando 1 segundo antes de liberar al hijo\\n");
        sleep(1);
        printf("[Padre] liberando semaforo\\n");
        V(semid);
        wait(NULL);
        semctl(semid, 0, IPC_RMID);
        printf("[Padre] semaforo eliminado\\n");
    }
    return EXIT_SUCCESS;
}`;

const salida = `$ gcc -Wall semaforo.c -o semaforo
$ ./semaforo
[Hijo]  esperando senal del padre...
[Padre] trabajando 1 segundo antes de liberar al hijo
[Padre] liberando semaforo
[Hijo]  recibi la senal, continuo!
[Padre] semaforo eliminado`;

export default function Page() {
  return (
    <DocPage
      section="3.2.2"
      title="Semáforos en derivados de System V"
      category="IPC · System V"
      readTime="9 min"
      toc={toc}
      prev={{
        href: "/apuntes/3/3.2_SystemV/3.2.1_Llaves",
        label: "3.2.1 Llaves",
      }}
      next={{
        href: "/apuntes/3/3.3_Memoria_Compartida",
        label: "3.3 Memoria compartida",
      }}
    >
      <DocH2 id="teoria">Teoría</DocH2>
      <DocP>
        Los semáforos son mecanismos utilizados por los sistemas para
        sincronizar el acceso a recursos compartidos. La dificultad principal
        de su implementación está en garantizar que las operaciones de
        incremento y decremento sean <strong>atómicas</strong>. En los sistemas
        derivados de System V esto se resuelve implementándolos dentro del
        kernel.
      </DocP>
      <DocP>
        La implementación tiene dos peculiaridades:
      </DocP>
      <DocUl>
        <DocLi>
          <span>
            Un semáforo no es un simple valor, sino un{" "}
            <strong>conjunto</strong> de valores enteros no negativos.
          </span>
        </DocLi>
        <DocLi>
          <span>
            Cada valor del conjunto puede ser cualquier entero no negativo, no
            sólo cero o uno.
          </span>
        </DocLi>
      </DocUl>

      <DocH2 id="estructura">Estructura del semáforo</DocH2>
      <DocP>
        En Linux actual, el kernel mantiene la estructura{" "}
        <InlineCode>semid_ds</InlineCode> definida en{" "}
        <InlineCode>&lt;sys/sem.h&gt;</InlineCode>:
      </DocP>
      <CodeBlock filename="semid_ds.h" code={`struct semid_ds {
    struct ipc_perm sem_perm;   /* permisos y propietarios */
    time_t          sem_otime;  /* ultima operacion */
    time_t          sem_ctime;  /* ultimo cambio */
    unsigned long   sem_nsems;  /* numero de semaforos del conjunto */
};`} />

      <DocH2 id="prototipos">Prototipos</DocH2>
      <CodeBlock filename="prototipos.h" code={`#include <sys/types.h>
#include <sys/ipc.h>
#include <sys/sem.h>

int semget(key_t key, int nsems, int semflg);
int semctl(int semid, int semnum, int cmd, ...);
int semop (int semid, struct sembuf *sops, size_t nsops);`} />
      <DocUl>
        <DocLi>
          <span>
            <InlineCode>semget()</InlineCode> crea (o accede a) un conjunto de{" "}
            <InlineCode>nsems</InlineCode> semáforos. Retorna un{" "}
            <em>identificador</em> que se usa en las demás llamadas.
          </span>
        </DocLi>
        <DocLi>
          <span>
            <InlineCode>semctl()</InlineCode> permite operaciones de control:{" "}
            <InlineCode>SETVAL</InlineCode> (inicializar valor),{" "}
            <InlineCode>GETVAL</InlineCode>, <InlineCode>IPC_RMID</InlineCode>{" "}
            (borrar conjunto), etc.
          </span>
        </DocLi>
        <DocLi>
          <span>
            <InlineCode>semop()</InlineCode> ejecuta operaciones P (decrementar
            / esperar) y V (incrementar / liberar) de forma atómica.
          </span>
        </DocLi>
      </DocUl>

      <DocWarning>
        Si el programa termina sin invocar <code>semctl(id, IPC_RMID)</code>,
        el conjunto de semáforos queda en el kernel. Habrá que limpiarlo
        manualmente con <code>ipcrm -s id</code>.
      </DocWarning>

      <DocH2 id="codigo">Código de ejemplo</DocH2>
      <DocP>
        Sincronización padre-hijo: el hijo se bloquea con{" "}
        <InlineCode>P()</InlineCode>; el padre espera un segundo y libera con{" "}
        <InlineCode>V()</InlineCode>.
      </DocP>
      <CodeBlock filename="semaforo.c" lang="c" code={semaforoC} />

      <DocH2 id="ejecucion">Ejecución y salida</DocH2>
      <CodeBlock filename="salida" lang="bash" code={salida} />

      <DocH3 id="traza">Lectura de la traza</DocH3>
      <DocUl>
        <DocLi>
          <span>
            El hijo imprime &quot;esperando&quot; y se duerme dentro de{" "}
            <InlineCode>P()</InlineCode>.
          </span>
        </DocLi>
        <DocLi>
          <span>
            El padre trabaja un segundo, después llama a{" "}
            <InlineCode>V()</InlineCode> y desbloquea al hijo.
          </span>
        </DocLi>
        <DocLi>
          <span>
            El hijo continúa, el padre espera con <InlineCode>wait()</InlineCode>{" "}
            y libera el conjunto con <InlineCode>IPC_RMID</InlineCode>.
          </span>
        </DocLi>
      </DocUl>

      <DocH2 id="reflexion">Reflexión</DocH2>
      <DocP>
        Los semáforos System V son potentes (un solo conjunto puede agrupar
        varios contadores, las operaciones <InlineCode>semop()</InlineCode>{" "}
        pueden ser un vector que se ejecuta atómicamente), pero su API es
        verbosa. POSIX ofrece una alternativa más simple con{" "}
        <InlineCode>sem_open</InlineCode>, <InlineCode>sem_wait</InlineCode> y{" "}
        <InlineCode>sem_post</InlineCode>, recomendada cuando no se necesita la
        flexibilidad de los conjuntos.
      </DocP>
      <DocNote>
        En la práctica, la combinación más común es{" "}
        <strong>memoria compartida + semáforo</strong>: la memoria transporta
        los datos y el semáforo garantiza la exclusión mutua sobre la sección
        crítica.
      </DocNote>
    </DocPage>
  );
}