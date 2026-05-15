import DocPage, {
  DocH2,
  DocH3,
  DocP,
  DocUl,
  DocLi,
  DocNote,
  CodeBlock,
  InlineCode,
} from "@/components/DocPage";

export const metadata = {
  title: "3.4 Cola de mensajes — Portafolio SO",
};

const toc = [
  { id: "teoria", label: "Teoría" },
  { id: "prototipos", label: "Prototipos" },
  { id: "msgbuf", label: "Estructura msgbuf" },
  { id: "codigo", label: "Código de ejemplo" },
  { id: "ejecucion", label: "Ejecución y salida" },
  { id: "reflexion", label: "Reflexión" },
];

const mcolaC = `/* ============================================================
   3.4 Cola de mensajes (System V)
   ./mcola s : envia un mensaje con la hora del sistema.
   ./mcola r : recibe el mensaje de la cola.
   Compilar: gcc -Wall mcola.c -o mcola
============================================================ */
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>
#include <unistd.h>
#include <errno.h>
#include <sys/types.h>
#include <sys/ipc.h>
#include <sys/msg.h>

struct msgbuf {
    long mtype;
    char mtext[80];
};

void send_msg(int qid, int msgtype)
{
    struct msgbuf msg;
    time_t t;
    msg.mtype = msgtype;
    time(&t);
    snprintf(msg.mtext, sizeof(msg.mtext),
             "El mensaje salio el: %s", ctime(&t));
    if (msgsnd(qid, &msg, sizeof(msg.mtext), IPC_NOWAIT) == -1) {
        perror("ERROR en msgsnd"); exit(EXIT_FAILURE);
    }
    printf("Mensaje enviado: %s", msg.mtext);
}

void get_msg(int qid, int msgtype)
{
    struct msgbuf msg;
    if (msgrcv(qid, &msg, sizeof(msg.mtext), msgtype,
               MSG_NOERROR | IPC_NOWAIT) == -1) {
        if (errno != ENOMSG) { perror("ERROR en msgrcv"); exit(EXIT_FAILURE); }
        printf("No hay mensajes disponibles\\n");
    } else {
        printf("Mensaje recibido: %s", msg.mtext);
    }
}

int main(int argc, char *argv[])
{
    int qid, modo, msgtype = 1;
    key_t llave;

    if (argc < 2) { printf("Use: %s s|r\\n", argv[0]); exit(EXIT_FAILURE); }

    llave = ftok(argv[0], 'a');
    if (llave == -1) { perror("ftok"); exit(EXIT_FAILURE); }

    if      (strcmp(argv[1], "s") == 0) modo = 1;
    else if (strcmp(argv[1], "r") == 0) modo = 2;
    else { printf("Use: %s s|r\\n", argv[0]); exit(EXIT_FAILURE); }

    if ((qid = msgget(llave, IPC_CREAT | 0666)) == -1) {
        perror("msgget"); exit(EXIT_FAILURE);
    }

    if (modo == 1) send_msg(qid, msgtype);
    else           get_msg (qid, msgtype);
    return EXIT_SUCCESS;
}`;

const salida = `$ gcc -Wall mcola.c -o mcola
$ ./mcola s
Mensaje enviado: El mensaje salio el: Fri May 15 05:54:39 2026
$ ./mcola r
Mensaje recibido: El mensaje salio el: Fri May 15 05:54:39 2026
$ ./mcola r
No hay mensajes disponibles`;

export default function Page() {
  return (
    <DocPage
      section="3.4"
      title="Cola de mensajes"
      category="IPC · System V"
      readTime="9 min"
      toc={toc}
      prev={{
        href: "/apuntes/3/3.3_Memoria_Compartida",
        label: "3.3 Memoria compartida",
      }}
      next={{
        href: "/apuntes/3/3.5_Comandos_IPC",
        label: "3.5 Comandos del sistema",
      }}
    >
      <DocH2 id="teoria">Teoría</DocH2>
      <DocP>
        Una cola de mensajes permite que los procesos intercambien{" "}
        <strong>mensajes tipificados</strong> sin necesidad de mantener abierto
        un canal: el emisor deposita el mensaje en la cola y el receptor lo
        recoge cuando puede. Cada mensaje lleva un campo numérico{" "}
        <InlineCode>mtype</InlineCode> que sirve para que el receptor filtre
        qué desea leer.
      </DocP>

      <DocH2 id="prototipos">Prototipos</DocH2>
      <CodeBlock filename="prototipos.h">
{`#include <sys/types.h>
#include <sys/ipc.h>
#include <sys/msg.h>

int     msgget(key_t key, int msgflg);
int     msgctl(int msqid, int cmd, struct msqid_ds *buf);
int     msgsnd(int msqid, const void *msgp, size_t msgsz, int msgflg);
ssize_t msgrcv(int msqid, void *msgp, size_t msgsz,
               long msgtyp, int msgflg);`}
      </CodeBlock>
      <DocUl>
        <DocLi>
          <span>
            <InlineCode>msgget()</InlineCode> crea o accede a una cola; con{" "}
            <InlineCode>IPC_PRIVATE</InlineCode> siempre crea una nueva.
          </span>
        </DocLi>
        <DocLi>
          <span>
            <InlineCode>msgctl()</InlineCode> permite consultar (
            <InlineCode>IPC_STAT</InlineCode>), modificar (
            <InlineCode>IPC_SET</InlineCode>) o eliminar (
            <InlineCode>IPC_RMID</InlineCode>) la cola.
          </span>
        </DocLi>
        <DocLi>
          <span>
            <InlineCode>msgsnd()</InlineCode> agrega un mensaje y{" "}
            <InlineCode>msgrcv()</InlineCode> lo extrae.
          </span>
        </DocLi>
      </DocUl>

      <DocH3 id="msgtyp">Significado de msgtyp</DocH3>
      <DocUl>
        <DocLi>
          <span>
            <InlineCode>msgtyp == 0</InlineCode>: lee el primer mensaje de la
            cola, sea cual sea su tipo.
          </span>
        </DocLi>
        <DocLi>
          <span>
            <InlineCode>msgtyp &gt; 0</InlineCode>: lee el primer mensaje cuyo{" "}
            <InlineCode>mtype</InlineCode> coincida.
          </span>
        </DocLi>
        <DocLi>
          <span>
            <InlineCode>msgtyp &lt; 0</InlineCode>: lee el primer mensaje con{" "}
            <InlineCode>mtype</InlineCode> menor o igual al valor absoluto.
          </span>
        </DocLi>
      </DocUl>

      <DocH2 id="msgbuf">Estructura msgbuf</DocH2>
      <CodeBlock filename="msgbuf.h">
{`struct msgbuf {
    long mtype;     /* tipo del mensaje, debe ser > 0 */
    char mtext[N];  /* cuerpo del mensaje, tamano N */
};`}
      </CodeBlock>
      <DocNote>
        La estructura no es fija: el programador define{" "}
        <code>mtext[N]</code> al tamaño que necesite y pasa{" "}
        <code>sizeof(msg.mtext)</code> a <code>msgsnd</code> /{" "}
        <code>msgrcv</code> como tamaño en bytes.
      </DocNote>

      <DocH2 id="codigo">Código de ejemplo</DocH2>
      <DocP>
        El programa actúa como <em>emisor</em> con el argumento{" "}
        <InlineCode>s</InlineCode> y como <em>receptor</em> con{" "}
        <InlineCode>r</InlineCode>. La llave se obtiene de la ruta del propio
        ejecutable, de modo que ambos procesos comparten el mismo identificador.
      </DocP>
      <CodeBlock filename="mcola.c" lang="c">
        {mcolaC}
      </CodeBlock>

      <DocH2 id="ejecucion">Ejecución y salida</DocH2>
      <CodeBlock filename="salida" lang="bash">
        {salida}
      </CodeBlock>
      <DocP>
        El primer <InlineCode>./mcola r</InlineCode> consume el mensaje
        depositado por <InlineCode>./mcola s</InlineCode>. El segundo{" "}
        <InlineCode>./mcola r</InlineCode> encuentra la cola vacía y, gracias
        al flag <InlineCode>IPC_NOWAIT</InlineCode>, devuelve inmediatamente
        sin bloquearse.
      </DocP>

      <DocH2 id="reflexion">Reflexión</DocH2>
      <DocP>
        Las colas de mensajes son una solución intermedia entre las tuberías y
        la memoria compartida: encapsulan los datos en paquetes con un tipo
        que permite enrutamiento, pero implican una copia en el kernel. Son
        ideales cuando varios productores y consumidores trabajan
        asincrónicamente, como sucede en arquitecturas cliente-servidor
        locales.
      </DocP>
    </DocPage>
  );
}