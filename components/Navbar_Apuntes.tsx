"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const sections = [
  {
    title: "1. Introducción",
    items: [
      { href: "/docs/1_Introduccion_Sistema_Operativo", label: "Sistema Operativo" },
    ],
  },
  {
    title: "2. Procesos e Hilos",
    items: [
      { href: "/docs/2_Procesos_Hilos/2.1_Introduccion_Procesos", label: "Introducción a procesos" },
      { href: "/docs/2_Procesos_Hilos/2.2_Crear_Procesos", label: "Crear procesos" },
      { href: "/docs/2_Procesos_Hilos/2.4_Identificar_Procesos", label: "Identificar procesos" },
      { href: "/docs/2_Procesos_Hilos/2.5_Wait", label: "Wait()" },
      { href: "/docs/2_Procesos_Hilos/2.5_Wait/2.5.1_Waitpid", label: "Waitpid()" },
      { href: "/docs/2_Procesos_Hilos/2.6_Exit_y__Exit", label: "Exit / _exit" },
      { href: "/docs/2_Procesos_Hilos/2.7_Estado_Zombi", label: "Estado Zombi" },
      { href: "/docs/2_Procesos_Hilos/2.8_Hilos", label: "Hilos" },
      { href: "/docs/2_Procesos_Hilos/2.8_Hilos/2.8.2_Creacion_Hilos", label: "Creación de hilos" },
    ],
  },
  {
    title: "3. IPC",
    items: [
      { href: "/docs/3_IPC/3.1_Tuberias", label: "Tuberías" },
      { href: "/docs/3_IPC/3.1_Tuberias/3.1.1_Pipe", label: "Pipe" },
      { href: "/docs/3_IPC/3.1_Tuberias/3.1.2_Fifo", label: "Fifo" },
      { href: "/docs/3_IPC/3.2_SystemV", label: "System V" },
      { href: "/docs/3_IPC/3.2_SystemV/3.2.1_Llaves", label: "Llaves" },
      { href: "/docs/3_IPC/3.2_SystemV/3.2.2_Semaforos", label: "Semáforos" },
      { href: "/docs/3_IPC/3.3_Memoria_Compartida", label: "Memoria compartida" },
      { href: "/docs/3_IPC/3.4_Cola_Mensajes", label: "Cola de mensajes" },
      { href: "/docs/3_IPC/3.5_Comandos_IPC", label: "Comandos IPC" },
    ],
  },
];

export default function SidebarNav() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-[var(--color-surf-low)] border-r border-[var(--color-border)] p-4 overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4 text-[var(--color-primary)]">📘 Linux Docs</h2>
      <nav className="space-y-6 text-sm">
        {sections.map((section) => (
          <div key={section.title}>
            <p className="font-mono text-xs uppercase tracking-wider text-[var(--color-muted)] mb-2">
              {section.title}
            </p>
            <ul className="space-y-1 pl-2">
              {section.items.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className={`block transition-colors ${
                      pathname === href
                        ? "text-[var(--color-primary)] font-medium"
                        : "text-[var(--color-text-dim)] hover:text-[var(--color-primary)]"
                    }`}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
