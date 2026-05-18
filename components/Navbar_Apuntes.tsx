"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  ChevronRight,
  CornerDownRight,
  GraduationCap,
  Code2,
} from "lucide-react";

/* ─── Estructura ────────────────────────────────────────── */
const sections = [
  {
    id: "intro",
    title: "1. Introducción",
    items: [
      { href: "/apuntes/1", label: "Sistema Operativo Linux" },
    ],
  },
  {
    id: "procesos",
    title: "2. Procesos e Hilos",
    items: [
      { href: "/apuntes/2/2.1_Introduccion_Procesos", label: "Introducción a procesos" },
      { href: "/apuntes/2/2.2_Crear_Procesos",        label: "Crear procesos" },
      { href: "/apuntes/2/2.4_Identificar_Procesos",  label: "Identificar procesos" },
      { href: "/apuntes/2/2.5_Wait",                  label: "wait()" },
      { href: "/apuntes/2/2.5_Wait/2.5.1_Waitpid",    label: "waitpid()", indent: true },
      { href: "/apuntes/2/2.6_Exit_y__Exit",          label: "_exit() y exit()" },
      { href: "/apuntes/2/2.7_Estado_Zombi",          label: "Estado Zombi" },
      { href: "/apuntes/2/2.8_Hilos",                 label: "Hilos" },
      { href: "/apuntes/2/2.8_Hilos/2.8.2_Creacion_Hilos", label: "Creación de hilos", indent: true },
    ],
  },
  {
    id: "ipc",
    title: "3. Mecanismos IPC",
    items: [
      { href: "/apuntes/3",                             label: "Mecanismos IPC" },
      { href: "/apuntes/3/3.1_Tuberias",                label: "Tuberías" },
      { href: "/apuntes/3/3.1_Tuberias/3.1.1_Pipe",     label: "pipe — sin nombre", indent: true },
      { href: "/apuntes/3/3.1_Tuberias/3.1.2_Fifo",     label: "fifo — con nombre", indent: true },
      { href: "/apuntes/3/3.2_SystemV",                 label: "IPC System V" },
      { href: "/apuntes/3/3.2_SystemV/3.2.1_Llaves",    label: "Llaves",            indent: true },
      { href: "/apuntes/3/3.2_SystemV/3.2.2_Semaforos", label: "Semáforos",         indent: true },
      { href: "/apuntes/3/3.3_Memoria_Compartida",      label: "Memoria compartida" },
      { href: "/apuntes/3/3.4_Cola_Mensajes",           label: "Cola de mensajes" },
      { href: "/apuntes/3/3.5_Comandos_IPC",            label: "Comandos IPC" },
    ],
  },
  {
    id: "memoria",
    title: "5. Administración de Memoria",
    items: [
      { href: "/apuntes/5/5.1_Introduccion_Memoria",    label: "5.1 Introducción" },
      { href: "/apuntes/5/5.2_Sin_Intercambio",         label: "5.2 – 5.3 Sin Intercambio" },
      { href: "/apuntes/5/5.4_Particiones_Fijas",       label: "5.4 Particiones Fijas" },
      { href: "/apuntes/5/5.5_Reasignacion_Proteccion", label: "5.5 Reasignación y Protección" },
      { href: "/apuntes/5/5.6_Intercambio",             label: "5.6 Intercambio (Swap)" },
      { href: "/apuntes/5/5.7_Mapas_Bits",              label: "5.7 Mapas de Bits" },
      { href: "/apuntes/5/5.8_Listas_Ligadas",          label: "5.8 Listas Ligadas" },
      { href: "/apuntes/5/5.9_Memoria_Virtual",         label: "5.9 Memoria Virtual" },
      { href: "/apuntes/5/5.10_Funciones_Memoria",      label: "5.10 Funciones de Memoria" },
    ],
  },
  {
    id: "archivos",
    title: "6. Sistema de Archivos",
    items: [
      { href: "/apuntes/6/6.1_Introduccion_SA",   label: "6.1 Introducción" },
      { href: "/apuntes/6/6.2_Estructura_Logica", label: "6.2 Estructura Lógica" },
      { href: "/apuntes/6/6.3_Tipos_Archivos",    label: "6.3 Tipos de Archivos" },
      { href: "/apuntes/6/6.4_Dispositivos_ES",   label: "6.4 Dispositivos E/S" },
    ],
  },
  {
    id: "senales",
    title: "7. Señales",
    items: [
      { href: "/apuntes/7/7.1_Introduccion_Senales", label: "7.1 Introducción" },
      { href: "/apuntes/7/7.2_Tipos_Senales",        label: "7.2 Tipos de Señales" },
      { href: "/apuntes/7/7.3_Tratamiento_Senales",  label: "7.3 Tratamiento de Señales" },
      { href: "/apuntes/7/7.4_Alarma_Pausa",         label: "7.4 Alarma y Pausa" },
    ],
  },
];

function isInSection(pathname: string, items: { href: string }[]) {
  return items.some((i) => pathname.startsWith(i.href));
}

export default function SidebarNav() {
  const pathname = usePathname();

  const [open, setOpen] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(
      sections.map((s) => [s.id, isInSection(pathname, s.items)])
    )
  );

  const toggle = (id: string) =>
    setOpen((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <aside className="w-60 shrink-0 bg-surf-low border-r border-border flex flex-col overflow-y-auto h-full">
      {/* Header */}
      <div className="sticky top-0 bg-surf-low border-b border-border px-4 py-4 z-10">
        <p className="font-mono font-bold text-primary text-sm leading-none mb-0.5">
          Portafolio SO
        </p>
        <p className="font-mono text-[11px] text-muted">Linux · UTM 2025</p>
      </div>

      {/* Nav */}
      <nav className="px-3 py-4 space-y-1 flex-1 overflow-y-auto">
        {sections.map((section) => {
          const sectionActive = isInSection(pathname, section.items);
          const isOpen = open[section.id];

          return (
            <div key={section.id}>
              {/* Encabezado colapsable */}
              <button
                type="button"
                onClick={() => toggle(section.id)}
                aria-expanded={isOpen}
                className={`w-full flex items-center justify-between px-2 py-1.5 rounded text-left transition-colors group ${
                  sectionActive ? "bg-primary-c/10" : "hover:bg-surf-high"
                }`}
              >
                <span
                  className={`font-mono text-[11px] uppercase tracking-wider font-semibold ${
                    sectionActive
                      ? "text-primary"
                      : "text-muted group-hover:text-text-dim"
                  }`}
                >
                  {section.title}
                </span>
                <ChevronRight
                  size={14}
                  className={`text-muted shrink-0 transition-transform duration-200 ${
                    isOpen ? "rotate-90" : ""
                  }`}
                />
              </button>

              {/* Items */}
              {isOpen && (
                <ul className="mt-0.5 mb-1 space-y-0.5">
                  {section.items.map(
                    ({
                      href,
                      label,
                      indent,
                    }: {
                      href: string;
                      label: string;
                      indent?: boolean;
                    }) => {
                      const active = pathname === href;
                      return (
                        <li key={href}>
                          <Link
                            href={href}
                            className={`flex items-center gap-1.5 rounded py-1.5 text-[13px] transition-colors leading-snug border-l-2 ${
                              indent ? "pl-5" : "pl-2"
                            } ${
                              active
                                ? "bg-primary-c/15 text-primary font-medium border-primary"
                                : "text-text-dim hover:text-text-base hover:bg-surf-high border-transparent"
                            }`}
                          >
                            {indent && (
                              <CornerDownRight
                                size={12}
                                className="text-muted shrink-0"
                              />
                            )}
                            <span className="truncate">{label}</span>
                          </Link>
                        </li>
                      );
                    }
                  )}
                </ul>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-border px-4 py-3 space-y-2 shrink-0">
        <a
          href="https://mixteco.utm.mx/~gcgero/cursos/Un_vistazo_a_los_Sistemas_Operativos.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-[12px] text-muted hover:text-primary transition-colors"
        >
          <GraduationCap size={14} />
          Notas del profesor
        </a>
        
      </div>
    </aside>
  );
}