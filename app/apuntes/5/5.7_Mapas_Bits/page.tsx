import DocPage, {
  DocH2,
  DocP,
  DocNote,
  DocWarning,
  InlineCode,
} from "@/components/DocPage";

export const metadata = {
  title: "5.7 Mapas de Bits | Portafolio SO",
};

const toc = [
  { id: "mapa-bits", label: "Mapa de bits" },
  { id: "tamano-unidad", label: "Tamaño de la unidad de asignación" },
  { id: "ventajas-desventajas", label: "Ventajas y desventajas" },
];

export default function Page() {
  return (
    <DocPage
      section="5.7"
      title="Administración con Mapas de Bits"
      category="Administración de Memoria"
      prev={{ href: "/apuntes/5/5.6_Intercambio", label: "5.6 Intercambio" }}
      next={{ href: "/apuntes/5/5.8_Listas_Ligadas", label: "5.8 Listas Ligadas" }}
      toc={toc}
    >
      <DocH2 id="mapa-bits">Mapa de bits</DocH2>
      <DocP>
        Con un <strong className="text-primary">mapa de bits</strong>, la
        memoria se divide en unidades de asignación de tamaño fijo (desde unas
        pocas palabras hasta varios kilobytes). A cada unidad le corresponde{" "}
        <strong className="text-secondary">un bit</strong> en el mapa:
      </DocP>
      <div className="my-4 flex items-center gap-6 rounded-lg border border-surf-high bg-surf-mid p-4 font-mono text-sm">
        <div className="flex items-center gap-2">
          <span className="rounded bg-secondary/20 px-2 py-1 text-secondary">0</span>
          <span className="text-text-dim">= unidad libre</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded bg-danger/20 px-2 py-1 text-danger">1</span>
          <span className="text-text-dim">= unidad ocupada</span>
        </div>
      </div>
      <DocP>
        El mapa de bits para una memoria de{" "}
        <strong className="text-primary">32n bits</strong> utilizará{" "}
        <strong className="text-primary">n bits</strong>, ocupando sólo{" "}
        <strong className="text-tertiary">1/33 de la memoria total</strong>,
        independientemente de cuántos procesos residan en ella.
      </DocP>

      <DocH2 id="tamano-unidad">Tamaño de la unidad de asignación</DocH2>
      <DocP>
        El tamaño de la unidad de asignación es una decisión de diseño con
        implicaciones opuestas:
      </DocP>
      <div className="my-4 overflow-x-auto rounded-lg border border-surf-high">
        <table className="w-full text-sm">
          <thead className="bg-surf-high">
            <tr>
              <th className="px-4 py-2 text-left text-text-dim">Tamaño de unidad</th>
              <th className="px-4 py-2 text-left text-primary">Mapa de bits</th>
              <th className="px-4 py-2 text-left text-danger">Fragmentación interna</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surf-high">
            <tr className="bg-surf-low">
              <td className="px-4 py-2 text-text-base">Pequeña</td>
              <td className="px-4 py-2 text-primary">Grande (más bits)</td>
              <td className="px-4 py-2 text-secondary">Mínima</td>
            </tr>
            <tr className="bg-surf-mid">
              <td className="px-4 py-2 text-text-base">Grande</td>
              <td className="px-4 py-2 text-secondary">Pequeño (pocos bits)</td>
              <td className="px-4 py-2 text-danger">Mayor desperdicio</td>
            </tr>
          </tbody>
        </table>
      </div>

      <DocH2 id="ventajas-desventajas">Ventajas y desventajas</DocH2>
      <DocP>
        <strong className="text-secondary">Ventaja:</strong> el mapa de bits
        ocupa una cantidad <em>fija y predecible</em> de memoria; su tamaño
        sólo depende del tamaño total de la RAM y del tamaño de la unidad de
        asignación.
      </DocP>
      <DocP>
        <strong className="text-danger">Desventaja principal:</strong> para
        asignar un proceso de <InlineCode>k</InlineCode> unidades, el
        administrador debe buscar en el mapa una cadena de{" "}
        <strong className="text-danger">k ceros consecutivos</strong>. Esta
        búsqueda es una operación inherentemente lenta sobre estructuras de
        bits, lo que hace que los mapas de bits sean poco frecuentes en
        implementaciones reales de alta performance.
      </DocP>
      <DocNote>
        Los mapas de bits son más comunes en sistemas embebidos o microcontroladores
        donde la simplicidad y el espacio fijo importan más que la velocidad de
        asignación.
      </DocNote>
      <DocWarning>
        Si la unidad de asignación es grande y el proceso no ocupa un múltiplo
        exacto de ella, la última unidad asignada queda parcialmente desperdiciada.
        Este desperdicio se conoce como <strong>fragmentación interna</strong>.
      </DocWarning>
    </DocPage>
  );
}
