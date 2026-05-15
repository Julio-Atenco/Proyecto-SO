import DocPage, {
  DocH2,
  DocH3,
  DocP,
  DocUl,
  DocLi,
  DocNote,
} from "@/components/DocPage";

export const metadata = {
  title: "1. Sistema Operativo Linux — BitácoraSO",
};

const toc = [
  { id: "intro", label: "Introducción" },
  { id: "funciones", label: "Funciones del SO" },
  { id: "clasificacion", label: "Clasificación de SO" },
  { id: "lotes", label: "Por lotes" },
  { id: "tiempo-real", label: "Tiempo real" },
  { id: "multitarea", label: "Multitarea" },
  { id: "distribuidos", label: "Distribuidos" },
  { id: "red", label: "De red" },
  { id: "paralelos", label: "Paralelos" },
  { id: "moviles", label: "Móviles" },
  { id: "linux", label: "El caso de GNU/Linux" },
];

export default function Page() {
  return (
    <DocPage
      section="1"
      title="Sistema Operativo Linux"
      category="Introducción"
      readTime="9 min"
      toc={toc}
      next={{
        href: "/apuntes/2/2.1_Introduccion_Procesos",
        label: "2.1 Introducción a procesos",
      }}
    >
      <DocH2 id="intro">Introducción</DocH2>
      <DocP>
        El sistema operativo, al que también llamaremos SO, es el software
        fundamental de todo dispositivo de cómputo, ya que constituye un
        elemento indispensable para que el hardware pueda ser utilizado de
        manera efectiva por el usuario. Existen varias formas de definirlo:
      </DocP>
      <DocUl>
        <DocLi>
          <span>Un sistema operativo es el software que controla el hardware.</span>
        </DocLi>
        <DocLi>
          <span>
            Un sistema operativo es un programa que controla la ejecución de
            otros programas y actúa como interfaz entre el usuario y el
            hardware. Sus funciones principales son la comodidad, la eficiencia
            y la capacidad de evolución.
          </span>
        </DocLi>
        <DocLi>
          <span>
            Un sistema operativo es un administrador de los recursos del
            dispositivo: procesadores, memoria, dispositivos de entrada/salida,
            comunicaciones y datos.
          </span>
        </DocLi>
      </DocUl>

      <DocH2 id="funciones">Funciones principales</DocH2>
      <DocP>
        Los sistemas operativos se encargan de la administración de procesos,
        memoria, seguridad, recursos y archivos. Los <em>procesos</em>{" "}
        representan las entidades en ejecución dentro del sistema, y su
        correcta gestión debe evitar conflictos como sincronización incorrecta,
        falta de exclusión mutua o interbloqueo. La{" "}
        <em>administración de memoria</em> implica aislar procesos, asignar
        espacios y proteger las distintas secciones. La{" "}
        <em>seguridad</em> se implementa mediante políticas como la
        compartición controlada, los subsistemas confinados y el control de
        acceso. Finalmente, la <em>administración de recursos</em> debe
        considerar criterios de equidad, sensibilidad y eficiencia.
      </DocP>

      <DocH2 id="clasificacion">Clasificación de los sistemas operativos</DocH2>
      <DocP>
        Con el tiempo, los sistemas operativos se han clasificado según su uso,
        ámbito de aplicación y la arquitectura del hardware sobre la que
        operan. A continuación se describen los tipos más comunes.
      </DocP>

      <DocH3 id="lotes">Por lotes</DocH3>
      <DocP>
        Los sistemas por lotes procesan grandes cantidades de trabajos con poca
        o ninguna interacción con el usuario. Los trabajos con características
        similares se agrupan y se ejecutan en bloque, reduciendo los tiempos
        muertos del procesador. Aparecieron alrededor de 1956. Ejemplos:{" "}
        <strong>SCOPE</strong> (CDC 6600) y <strong>EXEC II</strong>{" "}
        (UNIVAC 1107).
      </DocP>

      <DocH3 id="tiempo-real">De tiempo real</DocH3>
      <DocP>
        La prioridad no es la interacción con el usuario, sino la ejecución
        correcta y oportuna de los procesos cumpliendo restricciones
        temporales estrictas. Buscan un comportamiento determinista. Se usan
        en control de tráfico aéreo, sistemas bursátiles, control industrial,
        automotriz, telecomunicaciones y multimedia. Ejemplos:{" "}
        <strong>VxWorks</strong>, <strong>FreeRTOS</strong>,{" "}
        <strong>LynxOS</strong>, <strong>QNX</strong> y{" "}
        <strong>RTLinux</strong>.
      </DocP>

      <DocH3 id="multitarea">De multitarea</DocH3>
      <DocP>
        Soportan la ejecución concurrente de dos o más tareas activas mediante
        planificación y conmutación de contexto. No requieren necesariamente
        múltiples procesadores. La multitarea puede implementarse a nivel de
        procesos o de hilos. Ejemplos modernos: <strong>UNIX</strong>,{" "}
        <strong>macOS</strong>, <strong>GNU/Linux</strong> y{" "}
        <strong>Windows</strong>.
      </DocP>

      <DocH3 id="distribuidos">Distribuidos</DocH3>
      <DocP>
        Permiten la ejecución de trabajos entre varios procesadores
        interconectados. La distribución es transparente para el usuario.
        Existen dos esquemas: <em>fuertemente acoplados</em> (comparten
        memoria y reloj global) y <em>débilmente acoplados</em> (cada
        procesador tiene memoria local y se comunica por red). Ejemplos:{" "}
        <strong>Sprite</strong>, <strong>Mach</strong>,{" "}
        <strong>Amoeba</strong>, <strong>Chorus</strong>.
      </DocP>

      <DocH3 id="red">De red</DocH3>
      <DocP>
        Permiten que dos o más computadoras compartan recursos a través de una
        red. A diferencia de los distribuidos, cada nodo conserva su propia
        autonomía. Ejemplos: <strong>Windows Server</strong>,{" "}
        <strong>GNU/Linux</strong> con NFS o Samba, y el clásico{" "}
        <strong>Novell NetWare</strong>.
      </DocP>

      <DocH3 id="paralelos">Paralelos</DocH3>
      <DocP>
        Explotan arquitecturas con múltiples procesadores o núcleos para
        ejecutar tareas simultáneamente, exigiendo mecanismos eficientes de
        sincronización. Permiten paralelismo real cuando hay varios
        procesadores, o aparente cuando se usa ejecución en segundo plano.
      </DocP>

      <DocH3 id="moviles">Para dispositivos móviles</DocH3>
      <DocP>
        Diseñados para optimizar recursos limitados, ofrecer interfaces
        táctiles, gestión de energía e integración con sensores. Ejemplos
        actuales: <strong>Android</strong> (basado en Linux) e{" "}
        <strong>iOS</strong>.
      </DocP>

      <DocH2 id="linux">El caso de GNU/Linux</DocH2>
      <DocP>
        GNU/Linux es un sistema operativo de propósito general, multitarea y
        multiusuario, basado en el kernel Linux y el conjunto de herramientas
        del proyecto GNU. Sigue la filosofía UNIX (todo es un archivo,
        herramientas pequeñas que cooperan) y es el entorno de referencia para
        el resto del portafolio: las prácticas se realizan compilando con{" "}
        <strong>gcc</strong> y ejecutando los binarios en una distribución
        GNU/Linux.
      </DocP>

      <DocNote>
        A partir del capítulo 2 se trabaja directamente con llamadas al
        sistema POSIX para crear procesos, sincronizarlos y comunicarlos. El
        portafolio asume conocimientos básicos de C y de la terminal de
        GNU/Linux.
      </DocNote>
    </DocPage>
  );
}