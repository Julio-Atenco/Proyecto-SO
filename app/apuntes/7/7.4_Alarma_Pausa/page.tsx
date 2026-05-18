import DocPage, {
  DocH2,
  DocP,
  DocNote,
  DocWarning,
  CodeBlock,
  InlineCode,
} from "@/components/DocPage";

export const metadata = {
  title: "7.4 Alarma y Pausa | Portafolio SO",
};

const toc = [
  { id: "alarm", label: "Función alarm()" },
  { id: "pause", label: "Función pause()" },
  { id: "ejemplo-alarm", label: "Ejemplo: contador con alarma" },
];

export default function Page() {
  return (
    <DocPage
      section="7.4"
      title="Función Alarma y Pausa"
      category="Señales"
      prev={{ href: "/apuntes/7/7.3_Tratamiento_Senales", label: "7.3 Tratamiento de Señales" }}
      toc={toc}
    >
      <DocH2 id="alarm">Función alarm()</DocH2>
      <DocP>
        <InlineCode>alarm()</InlineCode> configura un temporizador descendente
        en el kernel. Cuando expira, el kernel envía automáticamente la señal{" "}
        <strong className="text-primary">SIGALRM</strong> al proceso que la
        programó. Si no se captura, la acción por defecto es terminar el
        proceso.
      </DocP>
      <CodeBlock
        filename="prototipo_alarm.c"
        code={`#include <unistd.h>

unsigned int alarm(unsigned int seconds);

// seconds → tiempo en segundos hasta que se envía SIGALRM
//           Si seconds == 0, cancela cualquier alarma pendiente
//
// Retorna → segundos restantes de una alarma previa (0 si no había)`}
      />
      <DocWarning>
        Cada proceso solo puede tener{" "}
        <strong>una alarma activa</strong> a la vez. Llamar a{" "}
        <InlineCode>alarm()</InlineCode> cuando ya hay una pendiente cancela
        la anterior y programa la nueva.
      </DocWarning>

      <DocH2 id="pause">Función pause()</DocH2>
      <DocP>
        <InlineCode>pause()</InlineCode> suspende la ejecución del proceso
        que la invoca hasta que llegue cualquier señal. Una vez que se
        captura la señal y su manejador retorna,{" "}
        <InlineCode>pause()</InlineCode> también retorna.
      </DocP>
      <CodeBlock
        filename="prototipo_pause.c"
        code={`#include <unistd.h>

int pause(void);

// Retorna → -1 siempre (con errno = EINTR)
//           El valor -1 indica que fue interrumpida por una señal`}
      />
      <DocP>
        La combinación habitual es usar <InlineCode>alarm()</InlineCode> para
        programar un tiempo límite y <InlineCode>pause()</InlineCode> para
        esperar eficientemente (sin consumir CPU) a que algo suceda.
      </DocP>

      <DocH2 id="ejemplo-alarm">Ejemplo: contador detenido por una alarma</DocH2>
      <DocP>
        El siguiente programa lanza un contador en un bucle y programa una
        alarma de 2 segundos. Cuando el kernel entrega SIGALRM, el manejador
        activa una bandera que detiene el bucle:
      </DocP>
      <CodeBlock
        filename="contador_alarma.c"
        code={`#include <signal.h>
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>

#define SEG  2
#define TRUE  1
#define FALSE 0

void accion(int signum);

int salir = TRUE; // Bandera de control del bucle

int main(int argc, char *argv[])
{
    int i = 0;

    printf("Recibirás una alarma en %d segundo(s)\\n", SEG);

    signal(SIGALRM, accion); // Instalar el manejador
    alarm(SEG);               // Programar la alarma

    // El bucle corre hasta que la señal cambie la bandera
    while (salir)
        printf("Contemos: %d\\n", i++);

    return EXIT_SUCCESS;
}

void accion(int signum)
{
    printf("\\nRecibí señal %d (SIGALRM)\\n", signum);
    salir = FALSE; // Detener el bucle en main
}`}
      />
      <DocNote>
        La variable <InlineCode>salir</InlineCode> debería declararse como{" "}
        <InlineCode>volatile sig_atomic_t</InlineCode> en código de producción
        para garantizar que el compilador no optimice su lectura dentro del
        bucle y que las escrituras del manejador sean visibles de inmediato
        en <InlineCode>main()</InlineCode>.
      </DocNote>
      <DocP>
        Ejemplo de salida típica:
      </DocP>
      <CodeBlock
        filename="salida_ejemplo.txt"
        code={`Recibirás una alarma en 2 segundo(s)
Contemos: 0
Contemos: 1
Contemos: 2
...
Contemos: 9473821

Recibí señal 14 (SIGALRM)`}
      />
    </DocPage>
  );
}