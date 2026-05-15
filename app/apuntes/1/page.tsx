import DocPage, { DocH2, DocH3, DocP, DocUl, DocLi, DocNote, InlineCode } from "@/components/DocPage";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "1. Introducción al SO Linux | Portafolio SO" };

const toc = [
  { id: "que-es", label: "¿Qué es un SO?" },
  { id: "clasificacion", label: "Clasificación" },
  { id: "lotes", label: "Por lotes" },
  { id: "tiempo-real", label: "Tiempo real" },
  { id: "multitarea", label: "Multitarea" },
  { id: "distribuidos", label: "Distribuidos" },
  { id: "moviles", label: "Dispositivos móviles" },
];

export default function Page() {
  return (
    <DocPage section="1" title="Introducción al Sistema Operativo Linux"
      category="Introducción" readTime="12 min" toc={toc}
      next={{ href: "/apuntes/2/2.1_Introduccion_Procesos", label: "Introducción a procesos" }}
    >
      <DocH2 id="que-es">¿Qué es un sistema operativo?</DocH2>
      <DocP>
        Un sistema operativo es un conjunto de programas encargado de administrar los recursos de un
        dispositivo de cómputo. Proporciona, por un lado, una interfaz que permite la interacción del usuario
        con el sistema y, por otro, un núcleo o <strong className="text-text-base">kernel</strong> responsable
        de la comunicación directa con el hardware.
      </DocP>
      <DocP>Entre las definiciones más aceptadas encontramos:</DocP>
      <DocUl>
        <DocLi>Un sistema operativo es el software que controla el hardware.</DocLi>
        <DocLi>Un programa que controla la ejecución de otros programas y actúa como interfaz entre el usuario y el hardware; sus funciones principales son la comodidad, la eficiencia y la capacidad de evolución (W. Stallings).</DocLi>
        <DocLi>Un administrador de los recursos del dispositivo: procesadores, almacenamiento, E/S, comunicación y datos.</DocLi>
      </DocUl>
      <DocP>
        Los sistemas operativos se encargan de la administración de procesos, memoria, seguridad, recursos y archivos.
        Entre los problemas más comunes en la gestión de procesos se encuentran la sincronización incorrecta,
        la falta de exclusión mutua y el interbloqueo.
      </DocP>

      <DocH2 id="clasificacion">Clasificación de los sistemas operativos</DocH2>
      <DocP>
        Con el paso del tiempo, los sistemas operativos han sido clasificados de acuerdo con su uso,
        su ámbito de aplicación y la arquitectura del hardware sobre la que operan.
      </DocP>

      <DocH3 id="lotes">Sistemas operativos por lotes</DocH3>
      <DocP>
        Procesan grandes cantidades de trabajos con poca o ninguna interacción entre los usuarios y los programas
        en ejecución. Los trabajos con características similares se agrupan y se ejecutan de manera conjunta,
        reduciendo los tiempos muertos del procesador. Fueron introducidos alrededor de <strong className="text-text-base">1956</strong>.
      </DocP>
      <DocUl>
        <DocLi>Ejemplos representativos: <InlineCode>SCOPE</InlineCode> (DC6600) y <InlineCode>EXEC II</InlineCode> (UNIVAC 1107).</DocLi>
        <DocLi>Ofrecen alto aprovechamiento del procesador con ejecución secuencial de trabajos.</DocLi>
      </DocUl>

      <DocH3 id="tiempo-real">Sistemas operativos de tiempo real</DocH3>
      <DocP>
        La prioridad no es la interacción con el usuario, sino la ejecución correcta y oportuna de los
        procesos, cumpliendo restricciones temporales estrictas. Se busca un comportamiento <strong className="text-text-base">determinista</strong>.
      </DocP>
      <DocP>Aplicaciones: control de tráfico aéreo, sistemas bursátiles, control de refinerías, automoción, telecomunicaciones.</DocP>
      <DocNote>Ejemplos: VxWorks, FreeRTOS, LynxOS, QNX y RTLinux.</DocNote>

      <DocH3 id="multitarea">Sistemas operativos de multitarea</DocH3>
      <DocP>
        Se caracterizan por soportar la ejecución concurrente de dos o más tareas activas. El principio fundamental
        consiste en mantener varias tareas en memoria principal y alternar su ejecución mediante mecanismos de
        planificación y <strong className="text-text-base">conmutación de contexto</strong>.
      </DocP>
      <DocP>
        La multitarea puede implementarse a nivel de procesos o a nivel de <strong className="text-text-base">hilos (threads)</strong>.
        Un proceso tiene su propio espacio de direcciones, mientras que los hilos comparten los recursos del proceso al
        que pertenecen, permitiendo mayor concurrencia.
      </DocP>
      <DocNote>Ejemplos modernos: UNIX, macOS, GNU/Linux y Windows.</DocNote>

      <DocH3 id="distribuidos">Sistemas operativos distribuidos</DocH3>
      <DocP>
        Permiten la ejecución y distribución de trabajos entre un conjunto de procesadores. Esta distribución
        resulta <strong className="text-text-base">transparente</strong> para el usuario, quien percibe el sistema como una única entidad.
      </DocP>
      <DocUl>
        <DocLi><strong className="text-text-base">Fuertemente acoplados:</strong> los procesadores comparten memoria principal y un reloj global.</DocLi>
        <DocLi><strong className="text-text-base">Débilmente acoplados:</strong> cada procesador tiene su propia memoria local y se comunica a través de mecanismos de interconexión.</DocLi>
      </DocUl>

      <DocH3 id="moviles">Sistemas operativos para dispositivos móviles</DocH3>
      <DocP>
        Se caracterizan por optimizar el uso de recursos limitados, ofrecer interfaces orientadas al usuario final
        y soportar una amplia variedad de aplicaciones. Entre los más conocidos: Android, iOS, BlackBerry OS, Symbian,
        Windows Mobile.
      </DocP>
      <DocUl>
        <DocLi><strong className="text-text-base">Symbian:</strong> ampliamente utilizado en Nokia, desarrollado en C++, multitarea con modelo basado en hilos.</DocLi>
        <DocLi><strong className="text-text-base">iOS:</strong> basado en Mac OS X, arquitectura en capas (aplicaciones, middleware Cocoa Touch / Media / Core Services, kernel XNU).</DocLi>
        <DocLi><strong className="text-text-base">Android:</strong> basado en kernel GNU/Linux, código abierto bajo licencia Apache, usa SQLite, soporta multitarea y tethering.</DocLi>
      </DocUl>
    </DocPage>
  );
}
