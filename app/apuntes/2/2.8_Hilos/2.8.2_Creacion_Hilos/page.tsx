import DocPage, { DocH2, DocH3, DocP, DocUl, DocLi, DocNote, CodeBlock, InlineCode } from "@/components/DocPage";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "2.8.2 Creación de Hilos | Portafolio SO" };

const toc = [
  { id: "create",    label: "pthread_create()" },
  { id: "self",      label: "pthread_self()" },
  { id: "exit-hilo", label: "pthread_exit()" },
  { id: "join",      label: "pthread_join()" },
  { id: "attr",      label: "Atributos" },
  { id: "ejemplos",  label: "Ejemplos completos" },
];

export default function Page() {
  return (
    <DocPage section="2.8.2" title="Creación de Hilos"
      category="Procesos e Hilos" readTime="14 min" toc={toc}
      prev={{ href: "/apuntes/2/2.8_Hilos", label: "Hilos — introducción" }}
    >
      <DocH2 id="create">pthread_create()</DocH2>
      <DocP>
        La función <InlineCode>pthread_create()</InlineCode> se usa para crear un hilo con ciertos
        atributos; el hilo ejecutará una función determinada con los argumentos que se le indiquen.
      </DocP>
      <CodeBlock filename="prototipo_create.c" code={`#include <pthread.h>

int pthread_create(
    pthread_t *thread,                   /* ID del nuevo hilo (salida)   */
    const pthread_attr_t *attr,          /* Atributos (NULL = default)   */
    void *(*start_routine)(void *),      /* Función a ejecutar           */
    void *arg                            /* Argumento para la función    */
);`} />
      <DocUl>
        <DocLi>Si <InlineCode>attr</InlineCode> es <InlineCode>NULL</InlineCode>, se usan los atributos por omisión.</DocLi>
        <DocLi>Si tiene éxito, almacena el ID del hilo en la localidad referenciada por <InlineCode>thread</InlineCode>.</DocLi>
        <DocLi>El hilo ejecuta <InlineCode>start_routine(arg)</InlineCode>.</DocLi>
        <DocLi>Retorna <InlineCode>0</InlineCode> en caso de éxito, o un código de error en otro caso.</DocLi>
      </DocUl>
      <DocP>Errores posibles en <InlineCode>errno</InlineCode>:</DocP>
      <DocUl>
        <DocLi><InlineCode>EAGAIN</InlineCode> — recursos insuficientes o límite de hilos del sistema alcanzado.</DocLi>
        <DocLi><InlineCode>EINVAL</InlineCode> — atributo inválido.</DocLi>
        <DocLi><InlineCode>EPERM</InlineCode> — política de planificación no permitida.</DocLi>
      </DocUl>

      <DocNote>
        Un hilo termina cuando: llama a <InlineCode>pthread_exit()</InlineCode>, hace <InlineCode>return</InlineCode>{" "}
        al final de <InlineCode>start_routine</InlineCode>, es cancelado con <InlineCode>pthread_cancel()</InlineCode>,
        o el hilo principal ejecuta un <InlineCode>return</InlineCode> desde <InlineCode>main</InlineCode>.
      </DocNote>

      <DocH2 id="self">pthread_self()</DocH2>
      <DocP>Devuelve el ID del hilo que realiza la llamada.</DocP>
      <CodeBlock filename="prototipo_self.c" code={`#include <pthread.h>

pthread_t pthread_self(void);`} />

      <DocH2 id="exit-hilo">pthread_exit()</DocH2>
      <DocP>
        Termina la ejecución del hilo que la invoca y hace disponible el valor de{" "}
        <InlineCode>value_ptr</InlineCode> para cualquier proceso que invoque{" "}
        <InlineCode>pthread_join()</InlineCode> con ese hilo.
      </DocP>
      <CodeBlock filename="prototipo_exit_hilo.c" code={`#include <pthread.h>

int pthread_exit(void *value_ptr);`} />

      <DocH2 id="join">pthread_join() — sincronización</DocH2>
      <DocP>
        Suspende la ejecución del hilo que hace la llamada hasta que el hilo destino termine.
        Es el equivalente de <InlineCode>wait()</InlineCode> para hilos.
      </DocP>
      <CodeBlock filename="prototipo_join.c" code={`#include <pthread.h>

int pthread_join(pthread_t thread, void **value_ptr);`} />
      <DocP>Errores posibles:</DocP>
      <DocUl>
        <DocLi><InlineCode>EDEADLK</InlineCode> — interbloqueo detectado (dos hilos esperan uno del otro).</DocLi>
        <DocLi><InlineCode>EINVAL</InlineCode> — el hilo especificado no está unido a otro hilo.</DocLi>
        <DocLi><InlineCode>ESRCH</InlineCode> — el hilo especificado no fue encontrado.</DocLi>
      </DocUl>

      <DocH2 id="attr">Atributos de un hilo</DocH2>
      <CodeBlock filename="prototipo_attr.c" code={`#include <pthread.h>

/* Inicializa el objeto de atributos con valores por defecto */
int pthread_attr_init(pthread_attr_t *attr);

/* Destruye el objeto de atributos */
int pthread_attr_destroy(pthread_attr_t *attr);`} />

      <DocH2 id="ejemplos">Ejemplos completos</DocH2>

      <DocH3>Ejemplo 1 — Un hilo que calcula el factorial</DocH3>
      <CodeBlock filename="hilos_factorial.c" code={`/* Compilar: gcc -Wall hilos.c -lpthread -o hilos
   Ejecutar:  ./hilos <numero> */
#include <pthread.h>
#include <stdio.h>
#include <stdlib.h>

long prod = 1;
void *factorial(void *valor);

int main(int argc, char *argv[]) {
    pthread_t tid;
    pthread_attr_t attr;

    if (argc != 2) {
        fprintf(stderr, "Uso: ./hilos <entero>\\n");
        return EXIT_FAILURE;
    }

    pthread_attr_init(&attr);                        /* Atributos predeterminados */
    pthread_create(&tid, &attr, factorial, argv[1]); /* Crear hilo               */
    pthread_join(tid, NULL);                         /* Esperar su finalización  */

    printf("Factorial: %ld\\n", prod);
    return EXIT_SUCCESS;
}

void *factorial(void *valor) {
    int i = 1;
    while (i <= atol(valor))
        prod *= (i++);
    pthread_exit(0);
}`} />

      <DocH3>Ejemplo 2 — Conjunto de hilos (uno por argumento)</DocH3>
      <CodeBlock filename="chilos_factorial.c" code={`/* Compilar: gcc -Wall chilos.c -lpthread -o chilos
   Ejecutar:  ./chilos <n1> <n2> ... <n10> */
#include <pthread.h>
#include <stdio.h>
#include <stdlib.h>

typedef struct dhilos {
    int  id;
    long prod;
} DHILOS;

DHILOS pm_hilos[10];
void *factorial(void *valor);

int main(int argc, char *argv[]) {
    pthread_t tid[argc - 1];
    pthread_attr_t attr;
    int i;

    if (argc < 2) {
        perror("Uso: ./chilos <entero1> <entero2> ...\\n");
        exit(EXIT_FAILURE);
    }

    /* Crear un hilo por cada argumento */
    for (i = 0; i < argc - 1; i++) {
        pthread_attr_init(&attr);
        pm_hilos[i].id   = i + 1;
        pm_hilos[i].prod = atol(argv[i + 1]);
        pthread_create(&tid[i], &attr, factorial, &pm_hilos[i]);
    }

    /* Esperar la finalización de cada hilo */
    for (i = 0; i < argc - 1; i++)
        pthread_join(tid[i], NULL);

    /* Mostrar resultados */
    for (i = 0; i < argc - 1; i++)
        printf("Factorial de: %s = %ld\\n", argv[i + 1], pm_hilos[i].prod);

    return EXIT_SUCCESS;
}

void *factorial(void *valor) {
    int i = 1, prod = 1;
    DHILOS *datos = (DHILOS *)valor;
    while (i <= datos->prod)
        prod *= (i++);
    datos->prod = prod;
    pthread_exit(&(datos->prod));
}`} />
    </DocPage>
  );
}
