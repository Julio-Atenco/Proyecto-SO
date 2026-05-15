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
  title: "3.3 Memoria compartida — Portafolio SO",
};

const toc = [
  { id: "teoria", label: "Teoría" },
  { id: "prototipos", label: "Prototipos" },
  { id: "codigo", label: "Código de ejemplo" },
  { id: "ejecucion", label: "Ejecución y salida" },
  { id: "reflexion", label: "Reflexión" },
];

const memoriaC = `/* ============================================================
   3.3 Memoria compartida (System V)
   El padre crea un segmento, escribe; el hijo lo lee.
   Compilar: gcc -Wall memoria.c -o memoria
   Ejecutar: ./memoria
============================================================ */
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/ipc.h>
#include <sys/shm.h>
#include <sys/wait.h>

#define TAM 4096

int main(void)
{
    int shmid;
    char *direccion;
    pid_t hijo;

    /* Crear segmento de 4096 bytes */
    if ((shmid = shmget(IPC_PRIVATE, TAM, IPC_CREAT | 0600)) == -1) {
        perror("shmget"); exit(EXIT_FAILURE);
    }
    printf("[Padre] segmento creado, shmid = %d\\n", shmid);
    fflush(stdout);

    if ((hijo = fork()) == 0) {
        /* HIJO: se une al segmento y lee */
        sleep(1);
        char *p = (char *) shmat(shmid, NULL, 0);
        if (p == (char *) -1) { perror("shmat hijo"); exit(EXIT_FAILURE); }
        printf("[Hijo]  leido de mem. compartida: \\"%s\\"\\n", p);
        shmdt(p);
        exit(EXIT_SUCCESS);
    } else {
        /* PADRE: une, escribe, espera al hijo y borra */
        direccion = (char *) shmat(shmid, NULL, 0);
        if (direccion == (char *) -1) { perror("shmat padre"); exit(EXIT_FAILURE); }
        strcpy(direccion, "Hola hijo, te escribo en memoria compartida");
        printf("[Padre] escrito en memoria compartida\\n");
        shmdt(direccion);
        wait(NULL);
        shmctl(shmid, IPC_RMID, NULL);
        printf("[Padre] segmento eliminado\\n");
    }
    return EXIT_SUCCESS;
}`;

const salida = `$ gcc -Wall memoria.c -o memoria
$ ./memoria
[Padre] segmento creado, shmid = 2
[Hijo]  leido de mem. compartida: "Hola hijo, te escribo en memoria compartida"
[Padre] escrito en memoria compartida
[Padre] segmento eliminado`;

export default function Page() {
  return (
    <DocPage
      section="3.3"
      title="Memoria compartida"
      category="IPC · System V"
      readTime="8 min"
      toc={toc}
      prev={{
        href: "/apuntes/3/3.2_SystemV/3.2.2_Semaforos",
        label: "3.2.2 Semáforos en System V",
      }}
      next={{
        href: "/apuntes/3/3.4_Cola_Mensajes",
        label: "3.4 Cola de mensajes",
      }}
    >
      <DocH2 id="teoria">Teoría</DocH2>
      <DocP>
        La forma <strong>más rápida</strong> de comunicar dos procesos es hacer
        que compartan una zona de memoria: una vez mapeada en ambos espacios de
        direcciones, escribir o leer en ella es tan barato como acceder a una
        variable local, sin las copias kernel↔usuario que requieren pipes y
        colas.
      </DocP>
      <DocP>
        El flujo típico es: <InlineCode>shmget()</InlineCode> crea o accede al
        segmento; <InlineCode>shmat()</InlineCode> lo &quot;ata&quot; al
        espacio de direcciones del proceso y devuelve un puntero;{" "}
        <InlineCode>shmdt()</InlineCode> separa el segmento; y{" "}
        <InlineCode>shmctl()</InlineCode> realiza operaciones de control,
        incluida la eliminación con <InlineCode>IPC_RMID</InlineCode>.
      </DocP>

      <DocH2 id="prototipos">Prototipos</DocH2>
      <CodeBlock filename="prototipos.h">
{`#include <sys/ipc.h>
#include <sys/shm.h>

int   shmget(key_t key, size_t size, int shmflg);
void *shmat (int shmid, const void *shmaddr, int shmflg);
int   shmdt (const void *shmaddr);
int   shmctl(int shmid, int cmd, struct shmid_ds *buf);`}
      </CodeBlock>
      <DocUl>
        <DocLi>
          <span>
            <InlineCode>shmget()</InlineCode> devuelve un identificador para un
            segmento de <InlineCode>size</InlineCode> bytes. Con{" "}
            <InlineCode>IPC_CREAT</InlineCode> se crea uno nuevo si no existe;
            con <InlineCode>IPC_PRIVATE</InlineCode> siempre se crea uno nuevo
            asociado al proceso y sus descendientes.
          </span>
        </DocLi>
        <DocLi>
          <span>
            <InlineCode>shmat()</InlineCode> mapea el segmento. Si{" "}
            <InlineCode>shmaddr</InlineCode> es <InlineCode>NULL</InlineCode>{" "}
            el kernel elige la dirección.
          </span>
        </DocLi>
        <DocLi>
          <span>
            <InlineCode>shmctl(id, IPC_RMID, NULL)</InlineCode> marca el
            segmento para borrarlo cuando ya no esté atado a ningún proceso.
          </span>
        </DocLi>
      </DocUl>

      <DocWarning>
        La memoria compartida <strong>no incluye sincronización implícita</strong>.
        Si varios procesos escriben simultáneamente sin coordinarse pueden
        corromper los datos. Lo habitual es protegerla con un semáforo.
      </DocWarning>

      <DocH2 id="codigo">Código de ejemplo</DocH2>
      <DocP>
        El padre crea un segmento de 4 KB, escribe un mensaje y espera. El
        hijo se une al segmento, lee el mensaje y termina. Finalmente el padre
        libera el segmento.
      </DocP>
      <CodeBlock filename="memoria.c" lang="c">
        {memoriaC}
      </CodeBlock>

      <DocH2 id="ejecucion">Ejecución y salida</DocH2>
      <CodeBlock filename="salida" lang="bash">
        {salida}
      </CodeBlock>

      <DocH3 id="detalles">Detalles importantes</DocH3>
      <DocUl>
        <DocLi>
          <span>
            <InlineCode>fflush(stdout)</InlineCode> antes del{" "}
            <InlineCode>fork()</InlineCode> evita que el hijo herede líneas en
            el buffer y las vuelva a imprimir.
          </span>
        </DocLi>
        <DocLi>
          <span>
            El <InlineCode>sleep(1)</InlineCode> en el hijo es una forma simple
            de garantizar que el padre haya escrito antes de leer; en una
            aplicación real se usaría un semáforo.
          </span>
        </DocLi>
        <DocLi>
          <span>
            Cada proceso debe llamar a <InlineCode>shmdt()</InlineCode> cuando
            ya no necesita el segmento, y solo uno (normalmente el dueño) lo
            elimina con <InlineCode>IPC_RMID</InlineCode>.
          </span>
        </DocLi>
      </DocUl>

      <DocH2 id="reflexion">Reflexión</DocH2>
      <DocP>
        La memoria compartida pone en evidencia que el rendimiento tiene un
        precio: el programador asume toda la responsabilidad de sincronizar y
        de liberar el recurso. Es la elección correcta para grandes volúmenes
        de datos (frames de video, buffers de audio, estructuras grandes
        compartidas entre procesos), pero rara vez se usa sola.
      </DocP>
      <DocNote>
        Para comprobar que el segmento se eliminó realmente, ejecute{" "}
        <code>ipcs -m</code> después del programa. Si aún aparece, libérelo
        con <code>ipcrm -m &lt;shmid&gt;</code>.
      </DocNote>
    </DocPage>
  );
}