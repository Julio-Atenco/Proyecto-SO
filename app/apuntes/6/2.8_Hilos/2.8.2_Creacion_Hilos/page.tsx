import DocPage, {
  DocH2, DocH3, DocP, DocUl, DocLi,
  DocNote, CodeBlock, InlineCode,
} from "@/components/DocPage";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "2.8.2 Creación de Hilos | Portafolio SO" };

const toc = [
  { id: "create",  label: "pthread_create()" },
  { id: "self",    label: "pthread_self()" },
  { id: "exit-h",  label: "pthread_exit()" },
  { id: "join",    label: "pthread_join()" },
  { id: "attr",    label: "Atributos" },
  { id: "ej1",     label: "Ej. 1 — Mensajes propios" },
  { id: "ej2",     label: "Ej. 2 — Factorial" },
  { id: "ej3",     label: "Ej. 3 — Factorial múltiple" },
  { id: "ej4",     label: "Ej. 4 — Contador con mutex" },
];

export default function Page() {
  return (
    <DocPage section="2.8.2" title="Creación de Hilos"
      category="Procesos e Hilos" readTime="15 min" toc={toc}
      prev={{ href: "/apuntes/2/2.8_Hilos", label: "Hilos — introducción" }}
    >
      <DocH2 id="create">pthread_create()</DocH2>
      <CodeBlock filename="prototipo_create.c" code={`#include <pthread.h>

int pthread_create(
    pthread_t            *thread,         /* ID del nuevo hilo (salida)  */
    const pthread_attr_t *attr,           /* Atributos (NULL = default)  */
    void *(*start_routine)(void *),       /* Función a ejecutar          */
    void                 *arg            /* Argumento para la función   */
);`} />
      <DocUl>
        <DocLi>Si <InlineCode>attr</InlineCode> es <InlineCode>NULL</InlineCode> se usan los atributos por omisión.</DocLi>
        <DocLi>Retorna <InlineCode>0</InlineCode> en éxito o un código de error en otro caso.</DocLi>
        <DocLi><InlineCode>EAGAIN</InlineCode> — recursos insuficientes o límite de hilos alcanzado.</DocLi>
        <DocLi><InlineCode>EINVAL</InlineCode> — atributo inválido.</DocLi>
        <DocLi><InlineCode>EPERM</InlineCode> — política de planificación no permitida.</DocLi>
      </DocUl>

      <DocH2 id="self">pthread_self()</DocH2>
      <DocP>Devuelve el ID del hilo que realiza la llamada.</DocP>
      <CodeBlock filename="prototipo_self.c" code={`#include <pthread.h>
pthread_t pthread_self(void);`} />

      <DocH2 id="exit-h">pthread_exit()</DocH2>
      <DocP>
        Termina el hilo que la invoca y hace disponible <InlineCode>value_ptr</InlineCode> para
        cualquier hilo que llame a <InlineCode>pthread_join()</InlineCode>.
      </DocP>
      <CodeBlock filename="prototipo_exit.c" code={`#include <pthread.h>
int pthread_exit(void *value_ptr);`} />

      <DocH2 id="join">pthread_join() — sincronización</DocH2>
      <DocP>
        Suspende al hilo que la invoca hasta que el hilo destino termine. Es el equivalente
        de <InlineCode>wait()</InlineCode> para hilos.
      </DocP>
      <CodeBlock filename="prototipo_join.c" code={`#include <pthread.h>
int pthread_join(pthread_t thread, void **value_ptr);`} />

      <DocH2 id="attr">Atributos del hilo</DocH2>
      <CodeBlock filename="prototipo_attr.c" code={`#include <pthread.h>

int pthread_attr_init(pthread_attr_t *attr);    /* Inicializa con valores por defecto */
int pthread_attr_destroy(pthread_attr_t *attr); /* Destruye el objeto de atributos   */`} />

      {/* EJEMPLO 1 — hilos.c propio */}
      <DocH2 id="ej1">Ejemplo 1 — Código propio: dos hilos con mensajes</DocH2>
      <DocP>
        Crea dos hilos que imprimen un mensaje cada uno. Muestra el uso básico de{" "}
        <InlineCode>pthread_create()</InlineCode> y <InlineCode>pthread_join()</InlineCode>.
      </DocP>
      <CodeBlock filename="hilos.c"
        outputNote="el orden de 'hilo 1' y 'hilo 2' puede invertirse entre ejecuciones"
        output={`hilo 1
hilo 2
Hilo 1 retorna: 0
Hilo 2 retorna: 0`}
        code={`/* Compilar: gcc hilos.c -o hilos -lpthread */
#include <stdio.h>
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

    printf("Hilo 1 retorna: %d\n", uno);
    printf("Hilo 2 retorna: %d\n", dos);
    return EXIT_SUCCESS;
}

void *funcion_mensaje(void *ptr) {
    char *mensaje = (char *)ptr;
    printf("%s\n", mensaje);
    pthread_exit(NULL);
}`} />
      <DocUl>
        <DocLi>Los dos hilos se crean casi simultáneamente; el orden de impresión puede variar.</DocLi>
        <DocLi>El valor de retorno de <InlineCode>pthread_create()</InlineCode> es <InlineCode>0</InlineCode> si tuvo éxito.</DocLi>
        <DocLi><InlineCode>pthread_join()</InlineCode> garantiza que <InlineCode>main</InlineCode> espera a que ambos terminen.</DocLi>
      </DocUl>

      {/* EJEMPLO 2 — factorial libro */}
      <DocH2 id="ej2">Ejemplo 2 — Un hilo calcula el factorial (del libro)</DocH2>
      <CodeBlock filename="hilos_factorial.c"
        outputNote="./hilos_factorial 5"
        output={`Factorial: 120`}
        code={`/* Compilar: gcc -Wall hilos_factorial.c -lpthread -o hilos_factorial */
#include <pthread.h>
#include <stdio.h>
#include <stdlib.h>

long prod = 1;
void *factorial(void *valor);

int main(int argc, char *argv[]) {
    pthread_t tid;
    pthread_attr_t attr;

    if (argc != 2) { fprintf(stderr, "Uso: ./hilos_factorial <n>\n"); return EXIT_FAILURE; }

    pthread_attr_init(&attr);
    pthread_create(&tid, &attr, factorial, argv[1]);
    pthread_join(tid, NULL);

    printf("Factorial: %ld\n", prod);
    return EXIT_SUCCESS;
}

void *factorial(void *valor) {
    int i = 1;
    while (i <= atol(valor)) prod *= (i++);
    pthread_exit(0);
}`} />

      {/* EJEMPLO 3 — conjunto libro */}
      <DocH2 id="ej3">Ejemplo 3 — Conjunto de hilos, uno por argumento (del libro)</DocH2>
      <CodeBlock filename="chilos_factorial.c"
        outputNote="./chilos 3 5 7"
        output={`Factorial de 3 = 6
Factorial de 5 = 120
Factorial de 7 = 5040`}
        code={`/* Compilar: gcc -Wall chilos_factorial.c -lpthread -o chilos */
#include <pthread.h>
#include <stdio.h>
#include <stdlib.h>

typedef struct dhilos { int id; long prod; } DHILOS;
DHILOS pm_hilos[10];
void *factorial(void *valor);

int main(int argc, char *argv[]) {
    pthread_t tid[argc - 1];
    pthread_attr_t attr;

    if (argc < 2) { perror("Uso: ./chilos <n1> <n2> ...\n"); exit(EXIT_FAILURE); }

    for (int i = 0; i < argc - 1; i++) {
        pthread_attr_init(&attr);
        pm_hilos[i].id   = i + 1;
        pm_hilos[i].prod = atol(argv[i + 1]);
        pthread_create(&tid[i], &attr, factorial, &pm_hilos[i]);
    }
    for (int i = 0; i < argc - 1; i++) pthread_join(tid[i], NULL);
    for (int i = 0; i < argc - 1; i++)
        printf("Factorial de %s = %ld\n", argv[i + 1], pm_hilos[i].prod);

    return EXIT_SUCCESS;
}

void *factorial(void *valor) {
    int i = 1, prod = 1;
    DHILOS *d = (DHILOS *)valor;
    while (i <= d->prod) prod *= (i++);
    d->prod = prod;
    pthread_exit(&(d->prod));
}`} />

      {/* EJEMPLO 4 — propio con mutex */}
      <DocH2 id="ej4">Ejemplo 4 — Propio: contador con condición de carrera y mutex</DocH2>
      <DocP>
        Dos hilos modifican una variable global. Sin <InlineCode>mutex</InlineCode> el resultado
        es no determinista; con él siempre es <InlineCode>0</InlineCode>.
      </DocP>
      <CodeBlock filename="contador_mutex.c"
        outputNote="con mutex el resultado siempre es 0; sin mutex varía"
        output={`Valor final del contador: 0`}
        code={`/* Compilar: gcc contador_mutex.c -o contador -lpthread */
#include <pthread.h>
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

    printf("Valor final del contador: %d\n", contador);
    pthread_mutex_destroy(&mutex);
    return EXIT_SUCCESS;
}`} />
      <DocNote>
        Prueba eliminando <InlineCode>pthread_mutex_lock/unlock</InlineCode> y observa que el resultado
        cambia en cada ejecución — eso es una <strong className="text-text-base">condición de carrera</strong>.
      </DocNote>
    </DocPage>
  );
}