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
  title: "7.3 Tratamiento de Señales | Portafolio SO",
};

const toc = [
  { id: "signal", label: "Función signal()" },
  { id: "handler-valores", label: "Valores de handler" },
  { id: "ejemplo-sigint", label: "Ejemplo: capturar SIGINT" },
  { id: "como-ejecutar", label: "Cómo ejecutar y probar" },
  { id: "setjmp-longjmp", label: "7.3.1 setjmp y longjmp" },
  { id: "ejemplo-setjmp", label: "Ejemplo: setjmp/longjmp con señal" },
];

export default function Page() {
  return (
    <DocPage
      section="7.3"
      title="Tratamiento de Señales"
      category="Señales"
      prev={{ href: "/apuntes/7/7.2_Tipos_Senales", label: "7.2 Tipos de Señales" }}
      next={{ href: "/apuntes/7/7.4_Alarma_Pausa", label: "7.4 Alarma y Pausa" }}
      toc={toc}
    >
      <DocH2 id="signal">Función signal()</DocH2>
      <DocP>
        Para especificar qué tratamiento debe realizar un proceso al recibir
        una señal determinada se emplea la función{" "}
        <InlineCode>signal()</InlineCode>:
      </DocP>
      <CodeBlock
        filename="prototipo_signal.c"
        code={`#include <signal.h>

typedef void (*sighandler_t)(int);
sighandler_t signal(int signum, sighandler_t handler);

// signum  → número de la señal a interceptar
// handler → acción a ejecutar al recibirla
// Retorna → el handler anterior, o SIG_ERR en caso de error`}
      />

      <DocH2 id="handler-valores">Valores posibles de handler</DocH2>
      <div className="my-4 grid gap-3 sm:grid-cols-3">
        {[
          {
            label: "SIG_DFL",
            desc: "Ejecuta la acción por defecto del sistema operativo para esa señal (generalmente terminar el proceso).",
            color: "text-text-dim border-surf-high",
          },
          {
            label: "SIG_IGN",
            desc: "Ignora la señal completamente. No funciona con SIGKILL ni SIGSTOP.",
            color: "text-tertiary border-tertiary/40",
          },
          {
            label: "Función propia",
            desc: "Dirección de una función definida por el programador. Se llama de forma asíncrona cuando llega la señal.",
            color: "text-secondary border-secondary/40",
          },
        ].map((item) => (
          <div
            key={item.label}
            className={`rounded-lg border bg-surf-mid p-4 ${item.color}`}
          >
            <div className={`font-mono font-bold mb-2 ${item.color.split(" ")[0]}`}>
              {item.label}
            </div>
            <div className="text-sm text-text-dim">{item.desc}</div>
          </div>
        ))}
      </div>
      <DocP>
        El prototipo del manejador personalizado debe ser:
      </DocP>
      <CodeBlock
        filename="prototipo_handler.c"
        code={`#include <signal.h>

// Forma básica
void mi_handler(int sig);

// Forma extendida (los parámetros code y scp son opcionales)
void handler(int sig [, int code, struct sigcontext *scp]);

// sig  → número de la señal recibida
// code → información de hardware en el momento de la señal
// scp  → contexto del proceso (definido en <signal.h>)`}
      />
      <DocWarning>
        El comportamiento de <InlineCode>signal()</InlineCode> varía entre
        versiones de UNIX y Linux. Para código portable y robusto se
        recomienda usar <InlineCode>sigaction()</InlineCode> en su lugar.
      </DocWarning>

      <DocH2 id="ejemplo-sigint">Ejemplo: capturar SIGINT (Ctrl+C)</DocH2>
      <DocP>
        El siguiente programa intercepta la señal SIGINT y la cuenta. Solo
        termina después de recibir la señal 20 veces:
      </DocP>
      <CodeBlock
        filename="captura_sigint.c"
        code={`#include <stdio.h>
#include <signal.h>
#include <stdlib.h>
#include <unistd.h>

void sigint_handler(int sig);

int main()
{
    if (signal(SIGINT, sigint_handler) == SIG_ERR) {
        perror("signal");
        exit(EXIT_FAILURE);
    }

    while (1) {
        printf("En espera de Ctrl+C...\\n");
        sleep(99);
    }
    return EXIT_SUCCESS;
}

void sigint_handler(int sig)
{
    static int cont = 0;
    printf("Señal número %d recibida\\n", sig);

    if (cont < 20) {
        printf("Contador = %d\\n", cont++);
    } else {
        exit(EXIT_SUCCESS);
    }

    // Reinstalar el manejador (necesario en algunas versiones de UNIX)
    if (signal(SIGINT, sigint_handler) == SIG_ERR) {
        perror("signal");
        exit(EXIT_FAILURE);
    }
}`}
      />

      <DocH2 id="como-ejecutar">Cómo ejecutar y probar</DocH2>
      <DocUl>
        <DocLi>
          <strong className="text-primary">Opción 1 – Ctrl+C:</strong> ejecuta
          el programa en primer plano y presiona{" "}
          <InlineCode>Ctrl+C</InlineCode> repetidamente hasta 20 veces.
        </DocLi>
        <DocLi>
          <strong className="text-secondary">Opción 2 – kill desde otro terminal:</strong>{" "}
          envía el programa a segundo plano y usa{" "}
          <InlineCode>kill</InlineCode>:
        </DocLi>
      </DocUl>
      <CodeBlock
        filename="terminal"
        code={`# Compilar y ejecutar en segundo plano
gcc captura_sigint.c -o controlC
./controlC &
# [1] 11605   ← PID asignado por el sistema

# Enviar SIGINT (2) manualmente desde otra terminal
kill -2 11605

# Después de 20 envíos el proceso termina`}
      />

      <DocH2 id="setjmp-longjmp">7.3.1 Funciones setjmp() y longjmp()</DocH2>
      <DocP>
        La rutina de tratamiento de una señal puede hacer que el proceso
        regrese a un estado anterior de su ejecución. Para esto se utilizan las
        funciones estándar <InlineCode>setjmp()</InlineCode> y{" "}
        <InlineCode>longjmp()</InlineCode>:
      </DocP>
      <CodeBlock
        filename="prototipo_setjmp.c"
        code={`#include <setjmp.h>

int  setjmp   (jmp_buf env);              // Guarda el contexto actual
int  sigsetjmp(sigjmp_buf env, int savesigs); // Versión que guarda máscara de señales

void longjmp   (jmp_buf env,    int val); // Salta al punto guardado por setjmp
void siglongjmp(sigjmp_buf env, int val); // Versión que restaura máscara de señales`}
      />
      <DocP>
        Funcionamiento:
      </DocP>
      <DocUl>
        <DocLi>
          <InlineCode>setjmp(env)</InlineCode> guarda en{" "}
          <InlineCode>env</InlineCode> los punteros de pila, instrucción,
          registros y máscara de señal. Retorna{" "}
          <InlineCode>0</InlineCode> en la primera llamada.
        </DocLi>
        <DocLi>
          <InlineCode>longjmp(env, val)</InlineCode> restaura el contexto
          guardado y hace que la ejecución continúe como si{" "}
          <InlineCode>setjmp()</InlineCode> hubiera retornado el valor{" "}
          <InlineCode>val</InlineCode> (nunca retorna 0; si{" "}
          <InlineCode>val == 0</InlineCode> se usa 1).
        </DocLi>
      </DocUl>
      <DocNote>
        Este mecanismo es el equivalente en C de las excepciones en otros
        lenguajes. Es útil para salir limpiamente de una señal de error y
        volver a un estado conocido del programa, como el inicio de un bucle
        principal.
      </DocNote>

      <DocH3 id="ejemplo-setjmp">Ejemplo: regreso a un estado anterior al recibir SIGUSR1</DocH3>
      <CodeBlock
        filename="retorno_setjmp.c"
        code={`#include <stdio.h>
#include <signal.h>
#include <setjmp.h>
#include <stdlib.h>
#include <unistd.h>

jmp_buf env;

void sigusr1_handler(int sig);

int main()
{
    int i;
    signal(SIGUSR1, sigusr1_handler);

    for (i = 0; i < 10; i++) {
        if (setjmp(env) == 0)
            printf("Punto a regresar en el estado %d\\n", i);
        else
            printf("Regreso al punto del estado %d\\n", i);

        sleep(10); // Espera para dar tiempo a enviar la señal
    }
    return EXIT_SUCCESS;
}

void sigusr1_handler(int sig)
{
    signal(SIGUSR1, sigusr1_handler); // Reinstalar manejador
    longjmp(env, 1);                  // Saltar de vuelta al setjmp
}`}
      />
      <CodeBlock
        filename="terminal"
        code={`# Compilar y ejecutar en segundo plano
gcc retorno_setjmp.c -o retorno
./retorno &
# [1] 12212
# Punto a regresar en el estado 0

# Enviar SIGUSR1 (10) para forzar el salto
kill -10 12212
# Regreso al punto del estado 0`}
      />
    </DocPage>
  );
}