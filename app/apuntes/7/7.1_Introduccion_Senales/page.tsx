import DocPage, {
  DocH2,
  DocP,
  DocUl,
  DocLi,
  DocNote,
  InlineCode,
} from "@/components/DocPage";

export const metadata = {
  title: "7.1 Introducción a las Señales | Portafolio SO",
};

const toc = [
  { id: "concepto", label: "¿Qué es una señal?" },
  { id: "formas-respuesta", label: "Formas de respuesta" },
  { id: "origen", label: "Origen de las señales" },
];

export default function Page() {
  return (
    <DocPage
      section="7.1"
      title="Introducción a las Señales"
      category="Señales"
      prev={{ href: "/apuntes/6/6.4_Dispositivos_ES", label: "6.4 Dispositivos E/S" }}
      next={{ href: "/apuntes/7/7.2_Tipos_Senales", label: "7.2 Tipos de Señales" }}
      toc={toc}
    >
      <DocH2 id="concepto">¿Qué es una señal?</DocH2>
      <DocP>
        Las <strong className="text-primary">señales</strong> son
        interrupciones de software que pueden enviarse a un proceso para
        informarle de algún evento asíncrono o situación especial. El sistema
        operativo identifica cada señal con un{" "}
        <strong className="text-secondary">número entero positivo</strong> al
        que asocia un nombre que, por convención, comienza con las letras{" "}
        <InlineCode>SIG</InlineCode>.
      </DocP>
      <DocP>
        Los procesos pueden enviarse señales unos a otros a través de la
        syscall <InlineCode>kill()</InlineCode>, y también es frecuente que
        durante su ejecución un proceso reciba señales procedentes del propio
        kernel.
      </DocP>

      <DocH2 id="formas-respuesta">Formas de respuesta ante una señal</DocH2>
      <DocP>
        Cuando un proceso recibe una señal puede reaccionar de tres maneras
        distintas:
      </DocP>
      <div className="my-4 grid gap-3 sm:grid-cols-3">
        {[
          {
            num: "1",
            title: "Ignorar la señal",
            desc: "El proceso no realiza ninguna acción. Solo es posible si el proceso tiene mayor prioridad que el emisor. Las señales SIGKILL y SIGSTOP no pueden ignorarse.",
            color: "border-text-dim/40 text-text-dim",
          },
          {
            num: "2",
            title: "Acción por defecto",
            desc: "Se invoca la rutina proporcionada por el kernel. Por lo general termina el proceso con exit(). Algunas señales además generan un archivo core con un volcado de memoria para depuración.",
            color: "border-tertiary/40 text-tertiary",
          },
          {
            num: "3",
            title: "Rutina propia",
            desc: "El programador define un manejador (handler) personalizado que se ejecuta cuando llega la señal, permitiendo acciones como limpiar recursos antes de terminar.",
            color: "border-secondary/40 text-secondary",
          },
        ].map((item) => (
          <div
            key={item.num}
            className={`rounded-lg border bg-surf-mid p-4 ${item.color}`}
          >
            <div className={`text-xs font-bold mb-1 ${item.color.split(" ")[1]}`}>
              Opción {item.num}
            </div>
            <div className="font-semibold text-text-base mb-2">{item.title}</div>
            <div className="text-sm text-text-dim">{item.desc}</div>
          </div>
        ))}
      </div>

      <DocH2 id="origen">Origen de las señales</DocH2>
      <DocP>
        Las señales pueden clasificarse por su origen en los siguientes grupos:
      </DocP>
      <DocUl>
        <DocLi>
          <strong className="text-primary">Terminación de procesos:</strong>{" "}
          señales relacionadas con el fin de la ejecución de un proceso o de
          sus hijos.
        </DocLi>
        <DocLi>
          <strong className="text-secondary">Excepciones de hardware:</strong>{" "}
          acceso fuera del espacio de direcciones, errores de coma flotante,
          instrucciones ilegales, etc. Las genera el hardware y las entrega el
          kernel.
        </DocLi>
        <DocLi>
          <strong className="text-tertiary">Errores en syscalls:</strong>{" "}
          errores irrecuperables originados durante una llamada al sistema.
        </DocLi>
        <DocLi>
          <strong className="text-primary">Proceso a proceso:</strong> un
          proceso envía una señal a otro vía{" "}
          <InlineCode>kill()</InlineCode>, o activa un temporizador y espera
          la señal de alarma.
        </DocLi>
        <DocLi>
          <strong className="text-secondary">Interacción con terminal:</strong>{" "}
          pulsaciones de teclas especiales como{" "}
          <InlineCode>Ctrl+C</InlineCode> (SIGINT) o{" "}
          <InlineCode>Ctrl+Z</InlineCode> (SIGTSTP).
        </DocLi>
        <DocLi>
          <strong className="text-tertiary">Depuración paso a paso:</strong>{" "}
          señales para ejecutar un programa instrucción por instrucción
          (SIGTRAP).
        </DocLi>
      </DocUl>
      <DocNote>
        El archivo de cabecera <InlineCode>&lt;signal.h&gt;</InlineCode>{" "}
        contiene las definiciones de todas las señales del sistema. En Linux
        puedes consultarlas también en{" "}
        <InlineCode>/usr/include/asm-generic/signal.h</InlineCode>.
      </DocNote>
    </DocPage>
  );
}