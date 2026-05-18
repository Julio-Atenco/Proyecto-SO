import DocPage, {
  DocH2,
  DocH3,
  DocP,
  DocUl,
  DocLi,
  DocNote,
} from "@/components/DocPage";

export const metadata = {
  title: "5.8 Listas Ligadas | Portafolio SO",
};

const toc = [
  { id: "listas-ligadas", label: "Listas ligadas" },
  { id: "algoritmos", label: "Algoritmos de asignación" },
  { id: "dos-listas", label: "Optimización con dos listas" },
];

export default function Page() {
  return (
    <DocPage
      section="5.8"
      title="Administración con Listas Ligadas"
      category="Administración de Memoria"
      prev={{ href: "/apuntes/5/5.7_Mapas_Bits", label: "5.7 Mapas de Bits" }}
      next={{ href: "/apuntes/5/5.9_Memoria_Virtual", label: "5.9 Memoria Virtual" }}
      toc={toc}
    >
      <DocH2 id="listas-ligadas">Listas ligadas de segmentos</DocH2>
      <DocP>
        En este enfoque, la memoria se representa como una{" "}
        <strong className="text-primary">lista ligada de segmentos</strong>,
        ordenada por dirección de inicio. Cada entrada especifica:
      </DocP>
      <div className="my-4 flex flex-wrap gap-3">
        {[
          { label: "Tipo", value: "H (hueco) o P (proceso)", color: "text-primary" },
          { label: "Dirección inicio", value: "dónde comienza el segmento", color: "text-secondary" },
          { label: "Longitud", value: "tamaño del segmento", color: "text-tertiary" },
          { label: "Apuntador", value: "siguiente entrada de la lista", color: "text-text-dim" },
        ].map((item) => (
          <div key={item.label} className="rounded-lg border border-surf-high bg-surf-mid px-4 py-2 text-sm">
            <span className="text-text-dim">{item.label}: </span>
            <span className={item.color}>{item.value}</span>
          </div>
        ))}
      </div>
      <DocP>
        Cuando un proceso termina o es intercambiado, su segmento se convierte
        en un hueco <strong className="text-secondary">(H)</strong>. Si hay
        huecos adyacentes, pueden fusionarse en uno solo para reducir la
        fragmentación externa.
      </DocP>

      <DocH2 id="algoritmos">Algoritmos de asignación de memoria</DocH2>
      <DocP>
        Cuando se necesita asignar memoria para un nuevo proceso se pueden
        utilizar varios algoritmos:
      </DocP>

      <DocH3 id="primer-ajuste">Primero en ajustarse (First Fit)</DocH3>
      <DocP>
        El administrador recorre la lista hasta encontrar el{" "}
        <strong className="text-primary">primer hueco</strong> suficientemente
        grande. Lo divide en dos partes: una para el proceso y otra que queda
        como nuevo hueco (si no es un ajuste exacto). Es el método más rápido
        porque busca lo mínimo. <strong className="text-secondary">UNIX</strong>{" "}
        lo usa para la asignación de memoria.
      </DocP>

      <DocH3 id="siguiente-ajuste">Siguiente en ajustarse (Next Fit)</DocH3>
      <DocP>
        Igual que First Fit, pero guarda un registro de dónde encontró el
        último hueco adecuado. La siguiente búsqueda comienza desde ese punto
        en lugar de desde el inicio de la lista, distribuyendo las asignaciones
        de forma más uniforme.
      </DocP>

      <DocH3 id="mejor-ajuste">Mejor ajuste (Best Fit)</DocH3>
      <DocP>
        Recorre <em>toda</em> la lista y selecciona el{" "}
        <strong className="text-tertiary">hueco más pequeño</strong> que sea
        suficientemente grande para el proceso. Minimiza el desperdicio por
        hueco, pero es más lento y tiende a generar muchos huecos diminutos e
        inutilizables (<strong className="text-danger">fragmentación
        externa</strong>).
      </DocP>

      <DocH3 id="peor-ajuste">Peor ajuste (Worst Fit)</DocH3>
      <DocP>
        Selecciona siempre el{" "}
        <strong className="text-danger">hueco más grande</strong> disponible.
        El objetivo es que el hueco restante sea lo suficientemente grande para
        ser útil en asignaciones futuras. Evita los huecos diminutos del Best
        Fit, pero también es lento al tener que recorrer toda la lista.
      </DocP>

      <DocH2 id="dos-listas">Optimización con dos listas separadas</DocH2>
      <DocP>
        Los cuatro algoritmos pueden acelerarse significativamente manteniendo{" "}
        <strong className="text-primary">dos listas independientes</strong>: una
        para procesos y otra solo para huecos. Así, la búsqueda de un hueco
        adecuado sólo recorre la lista de huecos, ignorando los segmentos de
        procesos.
      </DocP>
      <DocUl>
        <DocLi>
          <strong className="text-secondary">Ventaja:</strong> búsquedas más
          rápidas al asignar memoria.
        </DocLi>
        <DocLi>
          <strong className="text-danger">Costo:</strong> mayor complejidad al
          liberar memoria: el segmento liberado debe eliminarse de la lista de
          procesos e insertarse en la de huecos (posiblemente fusionándose con
          huecos adyacentes).
        </DocLi>
      </DocUl>
      <DocNote>
        En la práctica, First Fit suele tener el mejor desempeño general porque
        su rapidez compensa la ligera fragmentación que produce. Best Fit,
        a pesar de su nombre, no es necesariamente el mejor en la práctica.
      </DocNote>
    </DocPage>
  );
}
