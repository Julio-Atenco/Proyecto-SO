import type { Metadata } from "next";
import DocPage, {
  DocH2,
  DocP,
  DocUl,
  DocLi,
} from "@/components/DocPage";

export const metadata: Metadata = {
  title: "Inicio | BitácoraSO",
  description: "Blog de Sistemas Operativos — UTM.",
};

const toc = [
  { id: "presentacion", label: "Presentación" },
  { id: "intro",        label: "1. Introducción" },
  { id: "procesos",     label: "2. Procesos e Hilos" },
  { id: "ipc",          label: "3. Mecanismos IPC" },
];

export default function HomePage() {
  return (
    <DocPage
      section="Inicio"
      title="BitácoraSO — Sistemas Operativos"
      category="UTM · Computación"
      readTime="2 min"
      toc={toc}
    >
      {/* Hero */}
      <div className="w-full h-48 rounded-lg overflow-hidden mb-10 bg-surf-high border border-border flex items-center justify-center relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-c/15 to-secondary/10" />
        <pre className="font-mono text-xs text-secondary/60 leading-relaxed relative select-none text-center">
{`  ┌─────────────────────────────────────────┐
  │         B I T Á C O R A  S O            │
  │   Sistemas Operativos · Linux · C       │
  │   Procesos · IPC · Hilos · Memoria      │
  └─────────────────────────────────────────┘`}
        </pre>
      </div>

      {/* Presentación */}
      <DocH2 id="presentacion">Presentación</DocH2>
      <DocP>
        Bienvenido a <strong className="text-text-base">BitácoraSO</strong>, un
        blog creado con la finalidad de enseñar el funcionamiento base de los
        temas fundamentales de la materia de{" "}
        <strong className="text-text-base">Sistemas Operativos</strong>,
        orientado a estudiantes de Computación e Informática.
      </DocP>
      <DocP>
        Para un computólogo, entender las abstracciones del sistema operativo
        —procesos, hilos, memoria virtual, IPC— no es opcional: es la base
        sobre la que se construye todo el conocimiento en ciencias de la
        computación. Este blog aborda esos conceptos con ejemplos de código en
        C y explicaciones directas, sin rodeos.
      </DocP>

      <blockquote className="bg-surf-mid border-l-4 border-primary rounded p-5 my-6 italic text-text-base text-sm leading-relaxed">
        &ldquo;Entender el sistema operativo es entender la computadora misma.
        Todo lo demás es software corriendo sobre sus abstracciones.&rdquo;
      </blockquote>
      <DocH2 id="Proyecto desarrollado por">Proyecto desarrollado por</DocH2>
      <DocP>
        {" "}        
          <a href="https://github.com/LGSC-German"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline font-medium"
        >
          Luis German Sanchez Cortez
        </a>{" "}
        <a>y</a>{" "}
        
          <a href="https://github.com/Julio-Atenco"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline font-medium"
        >
          Julio Cesar Atenco Aguilar
        </a>
      </DocP>

      {/* Módulo 1 */}
      <DocH2 id="intro">1. Introducción</DocH2>
      <DocUl>
        <DocLi>
          <a href="/apuntes/1" className="hover:text-primary transition-colors">
            Sistema Operativo Linux
          </a>
        </DocLi>
      </DocUl>

      {/* Módulo 2 */}
      <DocH2 id="procesos">2. Procesos e Hilos</DocH2>
      <DocUl>
        <DocLi>
          <a href="/apuntes/2/2.1_Introduccion_Procesos" className="hover:text-primary transition-colors">
            Introducción a procesos
          </a>
        </DocLi>
        <DocLi>
          <a href="/apuntes/2/2.2_Crear_Procesos" className="hover:text-primary transition-colors">
            Crear procesos
          </a>
        </DocLi>
        <DocLi>
          <a href="/apuntes/2/2.4_Identificar_Procesos" className="hover:text-primary transition-colors">
            Identificar procesos
          </a>
        </DocLi>
        <DocLi>
          <a href="/apuntes/2/2.5_Wait" className="hover:text-primary transition-colors">
            wait()
          </a>
        </DocLi>
        <DocLi>
          <span className="pl-4 flex items-center gap-2">
            <span className="text-muted font-mono text-xs">└─</span>
            <a href="/apuntes/2/2.5_Wait/2.5.1_Waitpid" className="hover:text-primary transition-colors">
              waitpid()
            </a>
          </span>
        </DocLi>
        <DocLi>
          <a href="/apuntes/2/2.6_Exit_y__Exit" className="hover:text-primary transition-colors">
            _exit() y exit()
          </a>
        </DocLi>
        <DocLi>
          <a href="/apuntes/2/2.7_Estado_Zombi" className="hover:text-primary transition-colors">
            Estado Zombi
          </a>
        </DocLi>
        <DocLi>
          <a href="/apuntes/2/2.8_Hilos" className="hover:text-primary transition-colors">
            Hilos
          </a>
        </DocLi>
        <DocLi>
          <span className="pl-4 flex items-center gap-2">
            <span className="text-muted font-mono text-xs">└─</span>
            <a href="/apuntes/2/2.8_Hilos/2.8.2_Creacion_Hilos" className="hover:text-primary transition-colors">
              Creación de hilos
            </a>
          </span>
        </DocLi>
      </DocUl>

      {/* Módulo 3 */}
      <DocH2 id="ipc">3. Mecanismos IPC</DocH2>
      <DocUl>
        <DocLi>
          <a href="/apuntes/3" className="hover:text-primary transition-colors">
            Mecanismos IPC
          </a>
        </DocLi>
        <DocLi>
          <a href="/apuntes/3/3.1_Tuberias" className="hover:text-primary transition-colors">
            Tuberías
          </a>
        </DocLi>
        <DocLi>
          <span className="pl-4 flex items-center gap-2">
            <span className="text-muted font-mono text-xs">└─</span>
            <a href="/apuntes/3/3.1_Tuberias/3.1.1_Pipe" className="hover:text-primary transition-colors">
              pipe — sin nombre
            </a>
          </span>
        </DocLi>
        <DocLi>
          <span className="pl-4 flex items-center gap-2">
            <span className="text-muted font-mono text-xs">└─</span>
            <a href="/apuntes/3/3.1_Tuberias/3.1.2_Fifo" className="hover:text-primary transition-colors">
              fifo — con nombre
            </a>
          </span>
        </DocLi>
        <DocLi>
          <a href="/apuntes/3/3.2_SystemV" className="hover:text-primary transition-colors">
            IPC System V
          </a>
        </DocLi>
        <DocLi>
          <span className="pl-4 flex items-center gap-2">
            <span className="text-muted font-mono text-xs">└─</span>
            <a href="/apuntes/3/3.2_SystemV/3.2.1_Llaves" className="hover:text-primary transition-colors">
              Llaves
            </a>
          </span>
        </DocLi>
        <DocLi>
          <span className="pl-4 flex items-center gap-2">
            <span className="text-muted font-mono text-xs">└─</span>
            <a href="/apuntes/3/3.2_SystemV/3.2.2_Semaforos" className="hover:text-primary transition-colors">
              Semáforos
            </a>
          </span>
        </DocLi>
        <DocLi>
          <a href="/apuntes/3/3.3_Memoria_Compartida" className="hover:text-primary transition-colors">
            Memoria compartida
          </a>
        </DocLi>
        <DocLi>
          <a href="/apuntes/3/3.4_Cola_Mensajes" className="hover:text-primary transition-colors">
            Cola de mensajes
          </a>
        </DocLi>
        <DocLi>
          <a href="/apuntes/3/3.5_Comandos_IPC" className="hover:text-primary transition-colors">
            Comandos IPC
          </a>
        </DocLi>
      </DocUl>
    </DocPage>
  );
}