// app/layout.tsx
import React from "react";
import Link from "next/link";
import "@/app/globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="flex h-screen bg-[var(--color-bg)] text-[var(--color-text-base)] font-sans">
        {/* Sidebar */}
        <aside className="w-64 bg-[var(--color-surf-low)] border-r border-[var(--color-border)] p-4 overflow-y-auto">
          <h2 className="text-lg font-semibold mb-4">📘 Linux Docs</h2>
          <nav className="space-y-2 text-sm">
            <div>
              <p className="font-medium text-[var(--color-primary)]">1. Introducción</p>
              <Link href="/1_Introduccion_Sistema_Operativo" className="block pl-4 hover:text-[var(--color-secondary)]">
                Sistema Operativo
              </Link>
            </div>

            <div>
              <p className="font-medium text-[var(--color-primary)]">2. Procesos e Hilos</p>
              <ul className="pl-4 space-y-1">
                <li><Link href="/2_Procesos_Hilos/2.1_Introduccion_Procesos">Introducción a procesos</Link></li>
                <li><Link href="/2_Procesos_Hilos/2.2_Crear_Procesos">Crear procesos</Link></li>
                <li><Link href="/2_Procesos_Hilos/2.4_Identificar_Procesos">Identificar procesos</Link></li>
                <li><Link href="/2_Procesos_Hilos/2.5_Wait">Wait()</Link></li>
                <li><Link href="/2_Procesos_Hilos/2.5_Wait/2.5.1_Waitpid">Waitpid()</Link></li>
                <li><Link href="/2_Procesos_Hilos/2.6_Exit_y__Exit">Exit / _exit</Link></li>
                <li><Link href="/2_Procesos_Hilos/2.7_Estado_Zombi">Estado Zombi</Link></li>
                <li><Link href="/2_Procesos_Hilos/2.8_Hilos">Hilos</Link></li>
                <li><Link href="/2_Procesos_Hilos/2.8_Hilos/2.8.2_Creacion_Hilos">Creación de hilos</Link></li>
              </ul>
            </div>

            <div>
              <p className="font-medium text-[var(--color-primary)]">3. IPC</p>
              <ul className="pl-4 space-y-1">
                <li><Link href="/3_IPC/3.1_Tuberias">Tuberías</Link></li>
                <li><Link href="/3_IPC/3.1_Tuberias/3.1.1_Pipe">Pipe</Link></li>
                <li><Link href="/3_IPC/3.1_Tuberias/3.1.2_Fifo">Fifo</Link></li>
                <li><Link href="/3_IPC/3.2_SystemV">System V</Link></li>
                <li><Link href="/3_IPC/3.2_SystemV/3.2.1_Llaves">Llaves</Link></li>
                <li><Link href="/3_IPC/3.2_SystemV/3.2.2_Semaforos">Semáforos</Link></li>
                <li><Link href="/3_IPC/3.3_Memoria_Compartida">Memoria compartida</Link></li>
                <li><Link href="/3_IPC/3.4_Cola_Mensajes">Cola de mensajes</Link></li>
                <li><Link href="/3_IPC/3.5_Comandos_IPC">Comandos IPC</Link></li>
              </ul>
            </div>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6 overflow-y-auto grid-bg">
          {children}
        </main>
      </body>
    </html>
  );
}