import DocPage, {
  DocH2,
  DocH3,
  DocP,
  DocNote,
  DocWarning,
  CodeBlock,
  InlineCode,
} from "@/components/DocPage";

export const metadata = {
  title: "7.2 Tipos de Señales | Portafolio SO",
};

const toc = [
  { id: "senales-unix", label: "Señales UNIX System V" },
  { id: "tabla-systemv", label: "Tabla de señales" },
  { id: "senales-linux", label: "Señales en Linux" },
  { id: "tabla-linux", label: "Tabla Linux" },
  { id: "kill", label: "Función kill()" },
  { id: "raise", label: "Función raise()" },
];

// Señales UNIX System V
const senalesSystemV = [
  { nombre: "SIGHUP",  num: "01", core: false, term: true,  ign: false, desc: "Desconexión de terminal o fin del líder del grupo" },
  { nombre: "SIGINT",  num: "02", core: false, term: true,  ign: false, desc: "Interrupción (Ctrl+C)" },
  { nombre: "SIGQUIT", num: "03", core: true,  term: true,  ign: false, desc: "Salir (Ctrl+\\), genera core" },
  { nombre: "SIGILL",  num: "04", core: true,  term: true,  ign: false, desc: "Instrucción ilegal" },
  { nombre: "SIGTRAP", num: "05", core: true,  term: true,  ign: false, desc: "Trace trap (depuración paso a paso)" },
  { nombre: "SIGIOT",  num: "06", core: true,  term: true,  ign: false, desc: "Fallo de hardware I/O trap" },
  { nombre: "SIGEMT",  num: "07", core: true,  term: true,  ign: false, desc: "Emulator trap instruction" },
  { nombre: "SIGFPE",  num: "08", core: true,  term: true,  ign: false, desc: "Error aritmético de coma flotante" },
  { nombre: "SIGKILL", num: "09", core: false, term: true,  ign: false, desc: "Terminación incondicional del proceso" },
  { nombre: "SIGBUS",  num: "10", core: true,  term: true,  ign: false, desc: "Error de bus (dirección no existente o impar)" },
  { nombre: "SIGSEGV", num: "11", core: true,  term: true,  ign: false, desc: "Violación de segmento" },
  { nombre: "SIGSYS",  num: "12", core: true,  term: true,  ign: false, desc: "Argumento erróneo en syscall" },
  { nombre: "SIGPIPE", num: "13", core: false, term: true,  ign: false, desc: "Escritura en pipe sin lector" },
  { nombre: "SIGALRM", num: "14", core: false, term: true,  ign: false, desc: "Alarma de reloj (temporizador expirado)" },
  { nombre: "SIGTERM", num: "15", core: false, term: true,  ign: false, desc: "Terminación de software (puede ignorarse)" },
  { nombre: "SIGUSR1", num: "16", core: false, term: true,  ign: false, desc: "Señal de usuario 1 (reservada al programador)" },
  { nombre: "SIGUSR2", num: "17", core: false, term: true,  ign: false, desc: "Señal de usuario 2 (reservada al programador)" },
  { nombre: "SIGCLD",  num: "18", core: false, term: false, ign: true,  desc: "Muerte del proceso hijo (ignorada por defecto)" },
  { nombre: "SIGPWR",  num: "19", core: false, term: false, ign: false, desc: "Fallo de alimentación" },
];

// Señales Linux adicionales relevantes
const senalesLinux = [
  { nombre: "SIGHUP",    num: "01", desc: "Termina el proceso líder" },
  { nombre: "SIGINT",    num: "02", desc: "Ctrl+C pulsado" },
  { nombre: "SIGQUIT",   num: "03", desc: "Ctrl+\\ pulsado, termina terminal" },
  { nombre: "SIGILL",    num: "04", desc: "Instrucción ilegal" },
  { nombre: "SIGTRAP",   num: "05", desc: "Trazado de programas" },
  { nombre: "SIGABRT",   num: "06", desc: "Terminación anormal" },
  { nombre: "SIGBUS",    num: "07", desc: "Error de bus" },
  { nombre: "SIGFPE",    num: "08", desc: "Error aritmético, coma flotante" },
  { nombre: "SIGKILL",   num: "09", desc: "Eliminar proceso incondicionalmente" },
  { nombre: "SIGUSR1",   num: "10", desc: "Señal definida por el usuario" },
  { nombre: "SIGSEGV",   num: "11", desc: "Violación de segmento" },
  { nombre: "SIGUSR2",   num: "12", desc: "Señal definida por el usuario" },
  { nombre: "SIGPIPE",   num: "13", desc: "Escritura en pipe sin lectores" },
  { nombre: "SIGALRM",   num: "14", desc: "Fin del reloj ITIMER_REAL" },
  { nombre: "SIGTERM",   num: "15", desc: "Señal de terminación del software" },
  { nombre: "SIGCHLD",   num: "17", desc: "Avisa al padre que un hijo terminó" },
  { nombre: "SIGCONT",   num: "18", desc: "Proceso llevado a segundo/primer plano" },
  { nombre: "SIGSTOP",   num: "19", desc: "Suspensión de proceso (no se puede ignorar)" },
  { nombre: "SIGTSTP",   num: "20", desc: "Suspensión por Ctrl+Z" },
  { nombre: "SIGTTIN",   num: "21", desc: "Proceso en bg intenta leer de terminal" },
  { nombre: "SIGTTOU",   num: "22", desc: "Proceso en bg intenta escribir en terminal" },
  { nombre: "SIGXCPU",   num: "24", desc: "Límite de tiempo de CPU sobrepasado" },
  { nombre: "SIGXFSZ",   num: "25", desc: "Tamaño máximo de archivo sobrepasado" },
  { nombre: "SIGVTALRM", num: "26", desc: "Fin del temporizador ITIMER_VIRTUAL" },
  { nombre: "SIGPROF",   num: "27", desc: "Fin del temporizador ITIMER_PROF" },
  { nombre: "SIGWINCH",  num: "28", desc: "Cambio de tamaño de ventana (X11)" },
  { nombre: "SIGIO",     num: "29", desc: "Datos disponibles para E/S" },
  { nombre: "SIGPWR",    num: "30", desc: "Fallo de alimentación" },
  { nombre: "SIGSYS",    num: "31", desc: "Error de argumento en syscall" },
  { nombre: "SIGRTMIN",  num: "32", desc: "Inicio del rango de señales en tiempo real" },
];

export default function Page() {
  return (
    <DocPage
      section="7.2"
      title="Tipos de Señales"
      category="Señales"
      prev={{ href: "/apuntes/7/7.1_Introduccion_Senales", label: "7.1 Introducción" }}
      next={{ href: "/apuntes/7/7.3_Tratamiento_Senales", label: "7.3 Tratamiento de Señales" }}
      toc={toc}
    >
      <DocH2 id="senales-unix">Señales UNIX System V</DocH2>
      <DocP>
        En UNIX System V hay 19 señales definidas. Cada señal tiene asociada
        una acción por defecto que puede ser: generar un archivo{" "}
        <strong className="text-tertiary">core</strong> (volcado de memoria),{" "}
        <strong className="text-danger">terminar</strong> el proceso, o{" "}
        <strong className="text-secondary">ignorarse</strong>.
      </DocP>

      <DocH2 id="tabla-systemv">Tabla de señales UNIX System V</DocH2>
      <div className="my-4 overflow-x-auto rounded-lg border border-surf-high text-sm">
        <table className="w-full">
          <thead className="bg-surf-high">
            <tr>
              <th className="px-3 py-2 text-left text-secondary">Nombre</th>
              <th className="px-3 py-2 text-center text-text-dim">Nº</th>
              <th className="px-3 py-2 text-center text-tertiary">Core</th>
              <th className="px-3 py-2 text-center text-danger">Term</th>
              <th className="px-3 py-2 text-center text-text-dim">Ign</th>
              <th className="px-3 py-2 text-left text-text-dim">Descripción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surf-high">
            {senalesSystemV.map((s, i) => (
              <tr key={s.nombre} className={i % 2 === 0 ? "bg-surf-low" : "bg-surf-mid"}>
                <td className="px-3 py-1.5 font-mono text-primary">{s.nombre}</td>
                <td className="px-3 py-1.5 text-center font-mono text-text-dim">{s.num}</td>
                <td className="px-3 py-1.5 text-center">{s.core ? <span className="text-tertiary">✓</span> : <span className="text-surf-high">—</span>}</td>
                <td className="px-3 py-1.5 text-center">{s.term ? <span className="text-danger">✓</span> : <span className="text-surf-high">—</span>}</td>
                <td className="px-3 py-1.5 text-center">{s.ign  ? <span className="text-secondary">✓</span> : <span className="text-surf-high">—</span>}</td>
                <td className="px-3 py-1.5 text-text-dim">{s.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <DocWarning>
        <strong>SIGKILL (9)</strong> y <strong>SIGSTOP (19)</strong> no pueden
        ser ignoradas ni capturadas por el proceso. Son las únicas señales que
        el kernel entrega de forma incondicional.
      </DocWarning>

      <DocH2 id="senales-linux">7.2.1 Señales en Linux</DocH2>
      <DocP>
        Linux extiende el conjunto de señales de UNIX. Las definiciones se
        encuentran en{" "}
        <InlineCode>/usr/include/asm-generic/signal.h</InlineCode>. Nótese que
        algunos números difieren respecto a UNIX System V.
      </DocP>

      <DocH2 id="tabla-linux">Tabla de señales Linux</DocH2>
      <div className="my-4 overflow-x-auto rounded-lg border border-surf-high text-sm">
        <table className="w-full">
          <thead className="bg-surf-high">
            <tr>
              <th className="px-3 py-2 text-left text-secondary">Nombre</th>
              <th className="px-3 py-2 text-center text-text-dim">Nº</th>
              <th className="px-3 py-2 text-left text-text-dim">Descripción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surf-high">
            {senalesLinux.map((s, i) => (
              <tr key={s.nombre} className={i % 2 === 0 ? "bg-surf-low" : "bg-surf-mid"}>
                <td className="px-3 py-1.5 font-mono text-primary">{s.nombre}</td>
                <td className="px-3 py-1.5 text-center font-mono text-text-dim">{s.num}</td>
                <td className="px-3 py-1.5 text-text-dim">{s.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <DocH2 id="kill">Función kill()</DocH2>
      <DocP>
        Para enviar una señal desde un proceso a otro (o a un grupo de
        procesos) se usa la syscall <InlineCode>kill()</InlineCode>:
      </DocP>
      <CodeBlock
        filename="prototipo_kill.c"
        code={`#include <sys/types.h>
#include <signal.h>

int kill(pid_t pid, int sig);`}
      />
      <DocP>
        El parámetro <InlineCode>pid</InlineCode> determina el destino:
      </DocP>
      <div className="my-3 overflow-x-auto rounded-lg border border-surf-high text-sm">
        <table className="w-full">
          <thead className="bg-surf-high">
            <tr>
              <th className="px-4 py-2 text-left text-primary">Valor de pid</th>
              <th className="px-4 py-2 text-left text-text-dim">Destino de la señal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surf-high">
            {[
              ["pid > 0", "El proceso con ese PID específico"],
              ["pid = 0", "Todos los procesos del mismo grupo que el emisor"],
              ["pid = -1", "Todos los procesos cuyo UID real = UID efectivo del emisor (excepto init)"],
              ["pid < -1", "Todos los procesos cuyo GID = valor absoluto de pid"],
            ].map(([val, desc], i) => (
              <tr key={val} className={i % 2 === 0 ? "bg-surf-low" : "bg-surf-mid"}>
                <td className="px-4 py-2 font-mono text-primary">{val}</td>
                <td className="px-4 py-2 text-text-dim">{desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <DocP>
        Devuelve <InlineCode>0</InlineCode> en caso de éxito o{" "}
        <InlineCode>-1</InlineCode> si falla (por ejemplo, si el proceso
        emisor no tiene privilegios sobre el receptor).
      </DocP>
      <CodeBlock
        filename="terminal"
        code={`# Enviar SIGTERM (15) a un proceso
kill 1234

# Enviar SIGKILL (9) de forma explícita
kill -9 1234

# Enviar SIGINT (2) como lo haría Ctrl+C
kill -2 1234`}
      />

      <DocH3 id="raise">Función raise()</DocH3>
      <DocP>
        Un proceso puede enviarse señales a sí mismo con{" "}
        <InlineCode>raise()</InlineCode>:
      </DocP>
      <CodeBlock
        filename="prototipo_raise.c"
        code={`#include <signal.h>
int raise(int sig);
// Retorna 0 en caso de éxito, distinto de 0 en caso de error`}
      />
      <DocNote>
        <InlineCode>raise(sig)</InlineCode> es equivalente a llamar{" "}
        <InlineCode>kill(getpid(), sig)</InlineCode>. Es útil para que un
        proceso se auto-suspenda, termine limpiamente o active su propio
        manejador de señal.
      </DocNote>
    </DocPage>
  );
}