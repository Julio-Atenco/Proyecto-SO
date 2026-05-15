import Link from "next/link";

const pageLinks = [
  { href: "/",           label: "Inicio" },
  { href: "/apuntes",    label: "Apuntes" },
  { href: "/glosario",   label: "Glosario" },
  { href: "/programas",  label: "Programas" },
];

const externalLinks = [
  { href: "https://www.utm.mx/web/",         label: "UTM",               icon: "school" },
  { href: "https://github.com/Julio-Atenco", label: "GitHub Personal",   icon: "code" },
  { href: "https://mixteco.utm.mx/~gcgero/", label: "Página del Profesor", icon: "person" },
];

export default function Footer() {
  return (
    <footer className="bg-bg border-t border-border py-10">
      <div className="max-w-6xl mx-auto px-6 md:px-16 flex flex-col md:flex-row justify-between items-start gap-8">
        {/* Brand */}
        <div>
          <p className="font-mono font-bold text-primary text-base mb-1">BitácoraSO</p>
          <p className="text-muted text-xs leading-relaxed max-w-xs">
            Apuntes personales de la materia Sistemas Operativos.
            <br />
            Universidad Tecnológica de la Mixteca.
          </p>
          <p className="text-muted text-[11px] mt-3">
            © {new Date().getFullYear()} Julio Atenco · Todos los derechos reservados
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-wrap gap-x-12 gap-y-6 text-sm">
          {/* Internal */}
          <div>
            <p className="text-text-base font-semibold mb-3 text-xs uppercase tracking-wider font-mono">
              Páginas
            </p>
            <div className="space-y-2">
              {pageLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="block text-text-dim hover:text-primary transition-colors"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* External */}
          <div>
            <p className="text-text-base font-semibold mb-3 text-xs uppercase tracking-wider font-mono">
              Enlaces
            </p>
            <div className="space-y-2">
              {externalLinks.map(({ href, label, icon }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-text-dim hover:text-tertiary transition-colors"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
                    {icon}
                  </span>
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
