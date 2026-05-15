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
  title: "3.5 Información de IPC por comandos — Portafolio SO",
};

const toc = [
  { id: "intro", label: "Introducción" },
  { id: "ipcs", label: "El comando ipcs" },
  { id: "ipcrm", label: "El comando ipcrm" },
  { id: "procsysvipc", label: "/proc/sysvipc" },
  { id: "sesion", label: "Sesión de ejemplo" },
  { id: "reflexion-final", label: "Reflexión final" },
];

const salidaIpcs = `$ ipcs
------ Colas de mensajes -----
key       msqid   propietario perms     bytes utilizados mensajes
0x6100c032 0      alumno      666       80                1

------ Segmentos memoria compartida ----
key         shmid   propietario perms   bytes      nattch    estado
0x00000000  884743  alumno      600     1048576    2         dest

------ Matrices semaforo -------
key         semid   propietario perms   nsems
0x6100050e  1       alumno      600     2`;

const salidaSesion = `$ ipcs -q
------ Message Queues --------
key        msqid      owner      perms      used-bytes   messages
0x6100c032 0          alumno     666        80           1

$ ipcs -q -t
------ Message Queues Send/Recv/Change Times --------
msqid    owner      send             recv             change
0        alumno     May 15 05:54:29  May 15 05:54:18  May 15 05:54:18

$ ipcrm -q 0
$ ipcs -q
------ Message Queues --------
key        msqid      owner      perms      used-bytes   messages`;

const lsProcSysvipc = `$ ls -la /proc/sysvipc
total 0
dr-xr-xr-x 5 root root 0 may 15 05:54 .
dr-xr-xr-x 364 root root 0 may 15 05:38 ..
-r--r--r-- 1 root root 0 may 15 05:54 msg
-r--r--r-- 1 root root 0 may 15 05:54 sem
-r--r--r-- 1 root root 0 may 15 05:54 shm`;

export default function Page() {
  return (
    <DocPage
      section="3.5"
      title="Información de IPC por medio de comandos del sistema"
      category="IPC · Herramientas"
      readTime="6 min"
      toc={toc}
      prev={{
        href: "/apuntes/3/3.4_Cola_Mensajes",
        label: "3.4 Cola de mensajes",
      }}
      next={{
        href: "/apuntes/4",
        label: "4. Interbloqueos",
      }}
    >
      <DocH2 id="intro">Introducción</DocH2>
      <DocP>
        En GNU/Linux se puede obtener información de los objetos IPC mediante
        los comandos del sistema <InlineCode>ipcs</InlineCode> e{" "}
        <InlineCode>ipcrm</InlineCode>. El primero <em>lista</em> los recursos
        existentes; el segundo los <em>elimina</em>. Son herramientas
        indispensables cuando se trabaja con objetos System V porque, a
        diferencia de las tuberías, esos objetos persisten en el kernel hasta
        que alguien los libera explícitamente.
      </DocP>

      <DocH2 id="ipcs">El comando ipcs</DocH2>
      <DocP>
        Sin argumentos, <InlineCode>ipcs</InlineCode> muestra información de
        los tres tipos de IPC: colas de mensajes, segmentos de memoria
        compartida y arreglos de semáforos.
      </DocP>
      <CodeBlock filename="ipcs (sin argumentos)" lang="bash">
        {salidaIpcs}
      </CodeBlock>
      <DocH3 id="opciones">Opciones útiles</DocH3>
      <DocUl>
        <DocLi>
          <span>
            <InlineCode>ipcs -q</InlineCode> muestra solo las colas de
            mensajes.
          </span>
        </DocLi>
        <DocLi>
          <span>
            <InlineCode>ipcs -m</InlineCode> muestra solo los segmentos de
            memoria compartida.
          </span>
        </DocLi>
        <DocLi>
          <span>
            <InlineCode>ipcs -s</InlineCode> muestra solo los arreglos de
            semáforos.
          </span>
        </DocLi>
        <DocLi>
          <span>
            <InlineCode>ipcs -t</InlineCode> agrega tiempos de la última
            operación.
          </span>
        </DocLi>
        <DocLi>
          <span>
            <InlineCode>ipcs -p</InlineCode> muestra los PIDs del creador y
            del último proceso que operó sobre el recurso.
          </span>
        </DocLi>
      </DocUl>

      <DocH2 id="ipcrm">El comando ipcrm</DocH2>
      <DocP>
        <InlineCode>ipcrm</InlineCode> elimina un objeto IPC dado su
        identificador:
      </DocP>
      <CodeBlock filename="ipcrm" lang="bash">
{`ipcrm -q <msqid>   # elimina una cola de mensajes
ipcrm -m <shmid>   # elimina un segmento de memoria compartida
ipcrm -s <semid>   # elimina un arreglo de semaforos`}
      </CodeBlock>
      <DocWarning>
        Solo el propietario del recurso (o <code>root</code>) puede
        eliminarlo. Si se elimina una cola o un segmento mientras está siendo
        usado, los procesos que dependan de él recibirán errores.
      </DocWarning>

      <DocH2 id="procsysvipc">/proc/sysvipc</DocH2>
      <DocP>
        El kernel también expone los mismos datos en el sistema de archivos
        virtual <InlineCode>/proc/sysvipc/</InlineCode>, en tres archivos de
        solo lectura:
      </DocP>
      <CodeBlock filename="/proc/sysvipc" lang="bash">
        {lsProcSysvipc}
      </CodeBlock>
      <DocUl>
        <DocLi>
          <span>
            <InlineCode>msg</InlineCode> — colas de mensajes.
          </span>
        </DocLi>
        <DocLi>
          <span>
            <InlineCode>sem</InlineCode> — conjuntos de semáforos.
          </span>
        </DocLi>
        <DocLi>
          <span>
            <InlineCode>shm</InlineCode> — segmentos de memoria compartida.
          </span>
        </DocLi>
      </DocUl>

      <DocH2 id="sesion">Sesión de ejemplo</DocH2>
      <DocP>
        A continuación se muestra una sesión completa: se inspecciona la cola
        creada por el programa <InlineCode>mcola</InlineCode> (sección 3.4),
        se consulta el detalle con tiempos y finalmente se elimina con{" "}
        <InlineCode>ipcrm</InlineCode>.
      </DocP>
      <CodeBlock filename="sesion" lang="bash">
        {salidaSesion}
      </CodeBlock>

      <DocNote>
        Una buena práctica al desarrollar programas con objetos System V es
        ejecutar <code>ipcs</code> antes y después de cada ejecución para
        confirmar que no quedan recursos huérfanos. Si los hay, se eliminan
        con <code>ipcrm</code> antes de volver a probar.
      </DocNote>

      <DocH2 id="reflexion-final">Reflexión final del capítulo</DocH2>
      <DocP>
        A lo largo del capítulo 3 se recorrieron los principales mecanismos
        IPC de UNIX System V: tuberías (anónimas y con nombre), semáforos,
        memoria compartida y colas de mensajes, además de las herramientas de
        línea de comandos para inspeccionarlos. Cada mecanismo resuelve un
        problema distinto y los proyectos reales casi siempre combinan
        varios: memoria compartida con semáforos para datos compartidos,
        colas de mensajes para arquitecturas productor-consumidor, FIFO para
        scripts de shell o programas separados que necesitan dialogar.
      </DocP>
      <DocP>
        La lección transversal es la responsabilidad del programador: los
        recursos System V no se limpian solos, así que cada{" "}
        <InlineCode>semget</InlineCode>, <InlineCode>shmget</InlineCode> o{" "}
        <InlineCode>msgget</InlineCode> debe tener su contraparte{" "}
        <InlineCode>IPC_RMID</InlineCode>, y conviene comprobarlo con{" "}
        <InlineCode>ipcs</InlineCode>.
      </DocP>
    </DocPage>
  );
}