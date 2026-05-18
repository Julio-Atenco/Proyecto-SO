import DocPage, {
  DocH2,
  DocP,
  DocNote,
} from "@/components/DocPage";

export const metadata = {
  title: "5.2 Administración sin Intercambio | Portafolio SO",
};

const toc = [
  { id: "sin-intercambio", label: "Sin intercambio o paginación" },
  { id: "multiprogramacion", label: "Modelos de multiprogramación" },
  { id: "formula", label: "Fórmula de uso de CPU" },
];

export default function Page() {
  return (
    <DocPage
      section="5.2 – 5.3"
      title="Sin Intercambio y Modelos de Multiprogramación"
      category="Administración de Memoria"
      prev={{ href: "/apuntes/5/5.1_Introduccion_Memoria", label: "5.1 Introducción" }}
      next={{ href: "/apuntes/5/5.4_Particiones_Fijas", label: "5.4 Particiones Fijas" }}
      toc={toc}
    >
      <DocH2 id="sin-intercambio">5.2 Administración sin intercambio o paginación</DocH2>
      <DocP>
        Los sistemas de administración de la memoria se pueden clasificar en dos
        tipos:
      </DocP>
      <DocP>
        <strong className="text-primary">1. Con desplazamiento:</strong> los
        procesos se trasladan durante la ejecución entre la memoria principal y
        el disco (y viceversa).
      </DocP>
      <DocP>
        <strong className="text-secondary">2. Sin desplazamiento:</strong> los
        procesos permanecen en RAM durante toda su ejecución. El esquema más
        sencillo es aquel en que sólo existe{" "}
        <strong className="text-tertiary">un proceso en memoria</strong> en cada
        instante, lo que implica un uso muy ineficiente de la CPU cuando ese
        proceso espera operaciones de E/S.
      </DocP>

      <DocH2 id="multiprogramacion">5.3 Modelos de multiprogramación</DocH2>
      <DocP>
        El uso de la CPU puede mejorarse mediante la{" "}
        <strong className="text-primary">multiprogramación</strong>: mantener
        varios procesos en memoria simultáneamente para que, mientras uno
        espera E/S, otro use la CPU. En teoría, si el proceso promedio hace
        cálculos el 20% del tiempo y se tienen cinco procesos en memoria, la
        CPU debería estar ocupada el 100% del tiempo. Sin embargo, ese modelo
        es optimista porque supone que los cinco procesos no esperarán E/S al
        mismo tiempo.
      </DocP>

      <DocH2 id="formula">Fórmula de uso de CPU</DocH2>
      <DocP>
        Un modelo probabilístico más realista: sea{" "}
        <strong className="text-secondary">p</strong> la fracción del tiempo que
        un proceso está en estado de espera de E/S. Si{" "}
        <strong className="text-secondary">n</strong> procesos residen en
        memoria simultáneamente, la probabilidad de que todos esperen E/S al
        mismo tiempo (CPU inactiva) es{" "}
        <strong className="text-tertiary">p&sup;n</strong>. El uso de la CPU
        queda definido entonces como:
      </DocP>
      <div className="my-4 rounded-lg border border-surf-high bg-surf-mid px-6 py-4 text-center font-mono text-lg text-primary">
        CPU = 1 − p<sup>n</sup>
      </div>
      <DocP>
        Por ejemplo, si cada proceso está esperando E/S el 80% del tiempo
        (p = 0.8) y hay 5 procesos en memoria (n = 5):
      </DocP>
      <div className="my-4 rounded-lg border border-surf-high bg-surf-mid px-6 py-4 text-center font-mono text-base text-secondary">
        CPU = 1 − 0.8⁵ = 1 − 0.328 ≈ <strong>67%</strong>
      </div>
      <DocNote>
        Cuantos más procesos residan en memoria, mayor será el aprovechamiento
        de la CPU, pero cada proceso adicional aporta un incremento marginal
        decreciente. Esto justifica la multiprogramación con un número razonable
        de procesos.
      </DocNote>
    </DocPage>
  );
}