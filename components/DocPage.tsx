import Link from "next/link";
import {
  ChevronRight,
  Clock,
  GraduationCap,
  ArrowLeft,
  ArrowRight,
  Lightbulb,
  AlertTriangle,
  Pencil,
} from "lucide-react";

/* ─── Tipos ─────────────────────────────────────────────── */
export interface TocItem {
  id: string;
  label: string;
}

export interface NavLink {
  href: string;
  label: string;
}

interface DocPageProps {
  /** Número de sección, e.g. "2.1" */
  section: string;
  title: string;
  /** Etiqueta de categoría, e.g. "Procesos e Hilos" */
  category: string;
  /** Tiempo estimado de lectura, e.g. "8 min" */
  readTime?: string;
  /** Ítems del índice lateral */
  toc?: TocItem[];
  prev?: NavLink;
  next?: NavLink;
  children: React.ReactNode;
}

/* ─── Componente principal ──────────────────────────────── */
export default function DocPage({
  section,
  title,
  category,
  readTime = "5 min",
  toc = [],
  prev,
  next,
  children,
}: DocPageProps) {
  return (
    <div className="flex gap-0 min-h-full">
      {/* Contenido del artículo */}
      <article className="flex-1 min-w-0 px-8 md:px-14 py-10">
        {/* Breadcrumb */}
        <nav className="font-mono text-xs text-muted mb-6 flex items-center gap-1.5 flex-wrap">
          <Link href="/" className="hover:text-primary transition-colors">
            Inicio
          </Link>
          <ChevronRight size={13} className="shrink-0" />
          <Link
            href="/apuntes"
            className="hover:text-primary transition-colors"
          >
            Portafolio SO
          </Link>
          <ChevronRight size={13} className="shrink-0" />
          <span className="text-primary">{section}</span>
        </nav>

        {/* Header */}
        <header className="mb-8">
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="bg-primary-c/15 text-primary text-xs px-2.5 py-0.5 rounded-full font-mono">
              {category}
            </span>
            <span className="bg-surf-top text-muted text-xs px-2.5 py-0.5 rounded-full font-mono">
              § {section}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-text-base leading-tight mb-4">
            {title}
          </h1>
          <div className="flex items-center gap-5 text-xs font-mono text-muted">
            <span className="flex items-center gap-1">
              <Clock size={14} />
              {readTime} de lectura
            </span>
            <span className="flex items-center gap-1">
              <GraduationCap size={14} />
              Sistemas Operativos — UTM
            </span>
          </div>
        </header>

        {/* Contenido */}
        <div className="prose-so">{children}</div>

        {/* Navegación prev / next */}
        {(prev || next) && (
          <div className="mt-12 pt-8 border-t border-border grid grid-cols-1 sm:grid-cols-2 gap-4">
            {prev ? (
              <Link
                href={prev.href}
                className="group flex flex-col bg-surf-low border border-border rounded-lg p-4 hover:border-primary transition-colors"
              >
                <span className="font-mono text-[11px] text-muted flex items-center gap-1 mb-1">
                  <ArrowLeft size={14} />
                  Anterior
                </span>
                <span className="text-sm font-medium text-text-base group-hover:text-primary transition-colors">
                  {prev.label}
                </span>
              </Link>
            ) : (
              <div />
            )}

            {next && (
              <Link
                href={next.href}
                className="group flex flex-col bg-surf-low border border-border rounded-lg p-4 hover:border-primary transition-colors sm:text-right"
              >
                <span className="font-mono text-[11px] text-muted flex items-center gap-1 mb-1 sm:justify-end">
                  Siguiente
                  <ArrowRight size={14} />
                </span>
                <span className="text-sm font-medium text-text-base group-hover:text-primary transition-colors">
                  {next.label}
                </span>
              </Link>
            )}
          </div>
        )}
      </article>

      {/* TOC lateral (solo si hay ítems) */}
      {toc.length > 0 && (
        <aside className="hidden xl:block w-52 shrink-0 py-10 pr-6">
          <div className="sticky top-8">
            <p className="font-mono text-[10px] text-muted uppercase tracking-widest mb-4">
              En esta página
            </p>
            <ul className="space-y-2">
              {toc.map(({ id, label }) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    className="block text-[13px] text-text-dim hover:text-primary transition-colors border-l-2 border-transparent hover:border-primary pl-3"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-8 pt-5 border-t border-border">
              <a
                href="https://github.com/Julio-Atenco"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-primary hover:underline text-xs"
              >
                <Pencil size={15} />
                Editar en GitHub
              </a>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
}

/* ─── Sub-componentes de tipografía doc ─────────────────── */

export function DocH2({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  return (
    <h2
      id={id}
      className="scroll-mt-6 text-xl font-bold text-primary mt-10 mb-4 flex items-center gap-2"
    >
      {children}
    </h2>
  );
}

export function DocH3({
  id,
  children,
}: {
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <h3
      id={id}
      className="scroll-mt-6 text-base font-semibold text-text-base mt-6 mb-3"
    >
      {children}
    </h3>
  );
}

export function DocP({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-text-dim text-sm leading-relaxed mb-4">{children}</p>
  );
}

export function DocUl({ children }: { children: React.ReactNode }) {
  return (
    <ul className="space-y-1.5 mb-4 pl-4 border-l-2 border-border">
      {children}
    </ul>
  );
}

export function DocLi({ children }: { children: React.ReactNode }) {
  return (
    <li className="text-text-dim text-sm flex gap-2 leading-relaxed">
      <span className="text-secondary shrink-0 mt-0.5">—</span>
      {children}
    </li>
  );
}

export function DocNote({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-surf-mid border border-secondary/30 rounded-lg p-5 my-6 flex items-start gap-3">
      <Lightbulb size={20} className="text-secondary shrink-0 mt-0.5" />
      <p className="text-text-dim text-sm leading-relaxed">{children}</p>
    </div>
  );
}

export function DocWarning({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-surf-mid border border-danger/30 rounded-lg p-5 my-6 flex items-start gap-3">
      <AlertTriangle size={20} className="text-danger shrink-0 mt-0.5" />
      <p className="text-text-dim text-sm leading-relaxed">{children}</p>
    </div>
  );
}

export function CodeBlock({
  filename,
  lang = "c",
  children,
}: {
  filename: string;
  lang?: string;
  children: string;
}) {
  return (
    <div className="rounded-lg overflow-hidden border border-border my-6">
      <div className="bg-surf-high px-4 py-2 border-b border-border flex items-center justify-between">
        <span className="font-mono text-xs text-muted">{filename}</span>
        <span className="font-mono text-[10px] text-muted uppercase">
          {lang}
        </span>
      </div>
      <pre className="p-5 bg-surf-low overflow-x-auto">
        <code className="font-mono text-xs text-secondary leading-relaxed">
          {children}
        </code>
      </pre>
    </div>
  );
}

export function InlineCode({ children }: { children: React.ReactNode }) {
  return (
    <code className="font-mono text-xs bg-surf-high text-secondary px-1.5 py-0.5 rounded">
      {children}
    </code>
  );
}