import DocPage, {
  DocH2,
  DocH3,
  DocP,
  DocUl,
  DocLi,
  DocNote,
  DocWarning,
} from "@/components/DocPage";

export const metadata = {
  title: "5.4 Particiones Fijas | Portafolio SO",
};

const toc = [
  { id: "particiones-fijas", label: "Particiones fijas" },
  { id: "colas-independientes", label: "Colas independientes" },
  { id: "cola-unica", label: "Cola única" },
  { id: "algoritmos", label: "Algoritmos de asignación" },
];

export default function Page() {
  return (
    <DocPage
      section="5.4"
      title="Multiprogramación con Particiones Fijas"
      category="Administración de Memoria"
      prev={{ href: "/apuntes/5/5.2_Sin_Intercambio", label: "5.2 – 5.3 Sin Intercambio" }}
      next={{ href: "/apuntes/5/5.5_Reasignacion_Proteccion", label: "5.5 Reasignación y Protección" }}
      toc={toc}
    >
      <DocH2 id="particiones-fijas">Multiprogramación con particiones fijas</DocH2>
      <DocP>
        Para alojar varios procesos en memoria simultáneamente, la forma más
        sencilla es dividir la memoria en{" "}
        <strong className="text-primary">n particiones</strong> de tamaños
        potencialmente distintos. Cada partición puede contener exactamente un
        proceso; el grado de multiprogramación queda limitado al número de
        particiones.
      </DocP>

      <DocH2 id="colas-independientes">Colas de entrada independientes</DocH2>
      <DocP>
        En este esquema (Figura 5-1a) cada partición tiene su propia cola de
        trabajos esperando. Las desventajas son evidentes:
      </DocP>
      <DocUl>
        <DocLi>
          Si la cola de una partición grande está vacía, esa memoria se
          desperdicia aunque otras colas estén llenas.
        </DocLi>
        <DocLi>
          Los trabajos pequeños no pueden aprovechar particiones grandes sin
          desperdiciar espacio.
        </DocLi>
      </DocUl>

      <DocH2 id="cola-unica">Cola única (Figura 5-1b)</DocH2>
      <DocP>
        Una alternativa es mantener una{" "}
        <strong className="text-secondary">sola cola global</strong>. Cada vez
        que se libera una partición se carga el trabajo más cercano al frente de
        la cola que se ajuste a ella. Estrategias posibles:
      </DocP>
      <DocUl>
        <DocLi>
          <strong className="text-primary">Primer ajuste:</strong> cargar el
          primer trabajo de la cola que quepa. Simple pero puede desperdiciar
          particiones grandes con tareas pequeñas.
        </DocLi>
        <DocLi>
          <strong className="text-secondary">Trabajo más grande:</strong> buscar
          en toda la cola el trabajo más grande que quepa en la partición
          liberada. Discrimina a los trabajos pequeños.
        </DocLi>
        <DocLi>
          <strong className="text-tertiary">Partición pequeña reservada:</strong>{" "}
          mantener siempre disponible una partición pequeña para que los trabajos
          pequeños no queden indefinidamente postergados.
        </DocLi>
      </DocUl>

      <DocH2 id="algoritmos">Evitar inanición (starvation)</DocH2>
      <DocP>
        Para evitar que los trabajos pequeños queden excluidos indefinidamente,
        se puede aplicar la regla de{" "}
        <strong className="text-tertiary">puntos de exclusión</strong>: un
        trabajo elegible que sea excluido acumula un punto cada vez; cuando
        llega a <em>k</em> puntos ya no puede ser excluido de nuevo, forzando
        su ejecución.
      </DocP>
      <DocWarning>
        Las particiones fijas provocan <strong>fragmentación interna</strong>:
        si un proceso ocupa menos espacio que la partición asignada, el resto de
        esa partición se desperdicia y no puede usarse para otro proceso. Este
        problema se mitiga con particiones variables (ver sección 5.6).
      </DocWarning>
      <DocNote>
        Las particiones fijas fueron utilizadas en sistemas IBM OS/MFT (Multiprogramming
        with a Fixed number of Tasks). Hoy se usan técnicas más avanzadas como
        paginación y segmentación, pero entender las particiones fijas es la base
        conceptual para comprender sus limitaciones.
      </DocNote>
    </DocPage>
  );
}