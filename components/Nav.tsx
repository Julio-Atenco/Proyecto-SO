"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/",          label: "Inicio" },
  { href: "/apuntes",   label: "Apuntes" },
  { href: "/glosario",  label: "Glosario" },
  { href: "/programas", label: "Programas" },
];

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 bg-surface/95 backdrop-blur border-b border-border h-16 flex items-center px-6 md:px-16 gap-6">
        {/* Logo */}
        <Link href="/" className="font-mono font-bold text-primary text-lg shrink-0 hover:opacity-80 transition-opacity">
          BitácoraSO
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-7 text-sm">
          {links.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`transition-colors ${
                  active
                    ? "text-primary border-b border-primary pb-0.5"
                    : "text-text-dim hover:text-primary"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        
      </header>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden bg-surf-low border-b border-border px-6 py-4 space-y-3 text-sm z-40">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={`block transition-colors ${
                pathname === href ? "text-primary font-medium" : "text-text-dim hover:text-primary"
              }`}
            >
              {label}
            </Link>
          ))}
          <a
            href="https://github.com/Julio-Atenco"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-text-dim hover:text-primary transition-colors pt-2 border-t border-border"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 15 }}>code</span>
            GitHub Personal
          </a>
        </div>
      )}
    </>
  );
}
