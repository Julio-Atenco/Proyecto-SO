import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Programas | BitácoraSO",
  description: "Código fuente y prácticas de Sistemas Operativos — UTM.",
};

/* ─── Tipos ─────────────────────────────────────────────── */
interface Programa {
  id:        string;
  titulo:    string;
  desc:      string;
  lenguaje:  string;
  tema:      string;
  acento:    "primary" | "secondary" | "tertiary";
  codigo:    string;
  compilar?: string;
}

/* ─── Datos ─────────────────────────────────────────────── */
const programas: Programa[] = [
  {
    id: "productor-consumidor",
    titulo: "Productor-Consumidor con Semáforos",
    desc:   "Solución al problema clásico usando mutex y semáforos POSIX. Buffer circular con N posiciones.",
    lenguaje: "C",
    tema:     "Concurrencia",
    acento:   "secondary",
    compilar: "gcc productor_consumidor.c -o prod_cons -lpthread",
    codigo: `#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>
#include <semaphore.h>

#define N 5  /* tamaño del buffer */

int buffer[N];
int entrada = 0, salida = 0;

sem_t vacias, llenas;
pthread_mutex_t mutex;

void *productor(void *arg) {
    int item;
    for (int i = 0; i < 10; i++) {
        item = rand() % 100;
        sem_wait(&vacias);
        pthread_mutex_lock(&mutex);

        buffer[entrada] = item;
        entrada = (entrada + 1) % N;
        printf("Producido: %d\\n", item);

        pthread_mutex_unlock(&mutex);
        sem_post(&llenas);
    }
    return NULL;
}

void *consumidor(void *arg) {
    int item;
    for (int i = 0; i < 10; i++) {
        sem_wait(&llenas);
        pthread_mutex_lock(&mutex);

        item = buffer[salida];
        salida = (salida + 1) % N;
        printf("Consumido: %d\\n", item);

        pthread_mutex_unlock(&mutex);
        sem_post(&vacias);
    }
    return NULL;
}

int main(void) {
    pthread_t tid_p, tid_c;
    sem_init(&vacias, 0, N);
    sem_init(&llenas, 0, 0);
    pthread_mutex_init(&mutex, NULL);

    pthread_create(&tid_p, NULL, productor, NULL);
    pthread_create(&tid_c, NULL, consumidor, NULL);
    pthread_join(tid_p, NULL);
    pthread_join(tid_c, NULL);

    sem_destroy(&vacias);
    sem_destroy(&llenas);
    pthread_mutex_destroy(&mutex);
    return 0;
}`,
  },
  {
    id: "fcfs",
    titulo: "Simulador FCFS",
    desc:   "Implementación de First-Come First-Served. Calcula tiempos de espera, retorno y completado.",
    lenguaje: "C",
    tema:     "Planificación",
    acento:   "primary",
    compilar: "gcc fcfs.c -o fcfs",
    codigo: `#include <stdio.h>

#define MAX 10

struct Proceso {
    int pid, llegada, rafaga;
    int completado, retorno, espera;
};

void fcfs(struct Proceso p[], int n) {
    int tiempo = 0;
    for (int i = 0; i < n; i++) {
        if (tiempo < p[i].llegada)
            tiempo = p[i].llegada;
        tiempo += p[i].rafaga;
        p[i].completado = tiempo;
        p[i].retorno   = p[i].completado - p[i].llegada;
        p[i].espera    = p[i].retorno - p[i].rafaga;
    }
}

int main(void) {
    struct Proceso p[] = {
        {1, 0, 4}, {2, 1, 3},
        {3, 2, 5}, {4, 3, 2}
    };
    int n = 4;
    fcfs(p, n);

    printf("PID  Llegada  Ráfaga  Completado  Retorno  Espera\\n");
    for (int i = 0; i < n; i++)
        printf(" %d      %d       %d       %d           %d       %d\\n",
            p[i].pid, p[i].llegada, p[i].rafaga,
            p[i].completado, p[i].retorno, p[i].espera);
    return 0;
}`,
  },
  {
    id: "memoria-virtual",
    titulo: "Simulador de Reemplazo de Páginas",
    desc:   "Compara los algoritmos FIFO, LRU y Óptimo para reemplazo de páginas en memoria virtual.",
    lenguaje: "C",
    tema:     "Memoria",
    acento:   "tertiary",
    compilar: "gcc paginas.c -o paginas",
    codigo: `#include <stdio.h>
#include <string.h>
#define MARCOS 3
#define REFS   12

int marcos[MARCOS];
int fallos = 0;

int esta_en_marcos(int pagina) {
    for (int i = 0; i < MARCOS; i++)
        if (marcos[i] == pagina) return 1;
    return 0;
}

/* FIFO — reemplaza el más antiguo */
void fifo(int ref[], int n) {
    memset(marcos, -1, sizeof(marcos));
    int siguiente = 0;
    fallos = 0;
    for (int i = 0; i < n; i++) {
        if (!esta_en_marcos(ref[i])) {
            marcos[siguiente] = ref[i];
            siguiente = (siguiente + 1) % MARCOS;
            fallos++;
            printf("Fallo: página %d cargada\\n", ref[i]);
        }
    }
    printf("Total fallos FIFO: %d\\n", fallos);
}

int main(void) {
    int referencias[] = {1,2,3,4,1,2,5,1,2,3,4,5};
    fifo(referencias, REFS);
    return 0;
}`,
  },
];

const acentoText: Record<string, string>   = { primary: "text-primary", secondary: "text-secondary", tertiary: "text-tertiary" };
const acentoBadge: Record<string, string>  = { primary: "bg-primary-c/15 text-primary", secondary: "bg-secondary/10 text-secondary", tertiary: "bg-tertiary/10 text-tertiary" };
const acentoBorder: Record<string, string> = { primary: "hover:border-primary", secondary: "hover:border-secondary", tertiary: "hover:border-tertiary" };

/* ─── Page ──────────────────────────────────────────────── */
export default function ProgramasPage() {
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
          Código fuente de las prácticas de laboratorio. Todos compilables en Linux con GCC.
        </p>
      </div>

      {/* Filtros rápidos */}
      <div className="flex flex-wrap gap-2 mb-10">
        {["Todos", "Concurrencia", "Planificación", "Memoria", "Archivos"].map((f) => (
          <button
            key={f}
            className={`text-xs px-3 py-1.5 rounded font-mono border transition-colors ${
              f === "Todos"
                ? "bg-primary-c text-bg border-primary-c"
                : "border-border text-text-dim hover:border-primary hover:text-primary"
            }`}
          >
            {f}
          </button>
        ))}
        <a
          href="https://github.com/Julio-Atenco"
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto flex items-center gap-1.5 text-xs text-text-dim hover:text-primary transition-colors border border-border rounded px-3 py-1.5"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>code</span>
          Ver en GitHub
        </a>
      </div>

      {/* Lista de programas */}
      <div className="space-y-10">
        {programas.map(({ id, titulo, desc, lenguaje, tema, acento, codigo, compilar }) => (
          <section
            key={id}
            id={id}
            className={`bg-surf-low border border-border rounded-lg overflow-hidden ${acentoBorder[acento]} transition-all`}
          >
            {/* Card header */}
            <div className="px-6 py-5 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-mono ${acentoBadge[acento]}`}>{tema}</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-mono bg-surf-top text-muted">{lenguaje}</span>
                </div>
                <h2 className={`font-bold text-lg ${acentoText[acento]}`}>{titulo}</h2>
                <p className="text-text-dim text-sm mt-1">{desc}</p>
              </div>
              <a
                href="https://github.com/Julio-Atenco"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-text-dim hover:text-primary transition-colors border border-border rounded px-3 py-1.5 shrink-0"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>download</span>
                Descargar
              </a>
            </div>

            {/* Compilar */}
            {compilar && (
              <div className="px-6 py-3 border-b border-border bg-surf-mid flex items-center gap-3">
                <span className="font-mono text-[11px] text-muted uppercase tracking-wider shrink-0">Compilar:</span>
                <code className="font-mono text-xs text-secondary">{compilar}</code>
                <button className="ml-auto shrink-0 text-text-dim hover:text-primary transition-colors">
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>content_copy</span>
                </button>
              </div>
            )}

            {/* Código */}
            <div className="relative">
              <div className="flex items-center gap-1.5 px-6 py-3 border-b border-border bg-surf-high">
                <span className="w-2.5 h-2.5 rounded-full bg-danger" />
                <span className="w-2.5 h-2.5 rounded-full bg-tertiary" />
                <span className="w-2.5 h-2.5 rounded-full bg-secondary" />
                <span className="font-mono text-[11px] text-muted ml-3">{id}.c</span>
                <button className="ml-auto flex items-center gap-1 text-xs text-primary hover:underline">
                  <span className="material-symbols-outlined" style={{ fontSize: 14 }}>content_copy</span>
                  Copiar código
                </button>
              </div>
              <pre className="p-6 overflow-x-auto bg-bg max-h-96">
                <code className="font-mono text-xs text-secondary/90 leading-relaxed">{codigo}</code>
              </pre>
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
          href="https://github.com/Julio-Atenco"
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
