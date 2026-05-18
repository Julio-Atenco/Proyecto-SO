import DocPage, {
  DocH2,
  DocH3,
  DocP,
  DocNote,
  DocWarning,
  InlineCode,
} from "@/components/DocPage";

export const metadata = {
  title: "5.5 Reasignación y Protección | Portafolio SO",
};

const toc = [
  { id: "problemas", label: "Problemas de la multiprogramación" },
  { id: "reasignacion", label: "Problema de reasignación" },
  { id: "proteccion", label: "Registros base y límite" },
];

export default function Page() {
  return (
    <DocPage
      section="5.5"
      title="Reasignación y Protección"
      category="Administración de Memoria"
      prev={{ href: "/apuntes/5/5.4_Particiones_Fijas", label: "5.4 Particiones Fijas" }}
      next={{ href: "/apuntes/5/5.6_Intercambio", label: "5.6 Intercambio" }}
      toc={toc}
    >
      <DocH2 id="problemas">Problemas esenciales de la multiprogramación</DocH2>
      <DocP>
        La multiprogramación presenta dos problemas fundamentales que el sistema
        operativo debe resolver:
      </DocP>
      <DocP>
        <strong className="text-primary">1. Reasignación (relocation):</strong>{" "}
        los procesos se cargan en diferentes posiciones de memoria en cada
        ejecución, por lo que las direcciones del programa deben ajustarse a
        esa ubicación real.
      </DocP>
      <DocP>
        <strong className="text-danger">2. Protección:</strong> un proceso no
        debe poder leer ni escribir en la memoria de otro proceso ni en la del
        sistema operativo.
      </DocP>

      <DocH2 id="reasignacion">El problema de reasignación</DocH2>
      <DocP>
        Cuando el ligador (linker) genera un binario, las direcciones internas
        son relativas al inicio del archivo. Si ese programa se carga en la
        partición 1 (que comienza en la dirección 100k), una instrucción{" "}
        <InlineCode>CALL 100</InlineCode> debe transformarse en{" "}
        <InlineCode>CALL 100k + 100</InlineCode>. Si se carga en la partición 2
        (que empieza en 200k), la misma instrucción necesita convertirse en{" "}
        <InlineCode>CALL 200k + 100</InlineCode>.
      </DocP>
      <DocP>
        Sin reasignación, el programa podría saltar a direcciones dentro del
        espacio del sistema operativo, corrompiendo el kernel o provocando un
        fallo del sistema.
      </DocP>

      <DocH2 id="proteccion">Solución: registros base y límite</DocH2>
      <DocP>
        La reasignación en tiempo de carga no resuelve por sí sola la
        protección. La solución habitual es usar dos registros especiales de
        hardware:
      </DocP>
      <DocP>
        <strong className="text-primary">Registro base:</strong> se carga con
        la dirección de inicio de la partición cuando se planifica el proceso.
        Cada dirección virtual generada por el proceso tiene el contenido del
        registro base sumado automáticamente antes de acceder a la memoria
        física.
      </DocP>
      <DocP>
        <strong className="text-secondary">Registro límite:</strong> contiene la
        longitud de la partición. Toda dirección generada se verifica contra
        este límite; si la supera, el hardware genera una excepción (fallo de
        segmentación) y el SO termina el proceso.
      </DocP>

      <DocH3 id="ejemplo-registros">Ejemplo de funcionamiento</DocH3>
      <div className="my-4 overflow-x-auto rounded-lg border border-surf-high bg-surf-mid p-4 font-mono text-sm">
        <p className="text-text-dim mb-2">// Registro base = 100k, registro límite = 50k</p>
        <p className="text-primary">Instrucción: CALL 100</p>
        <p className="text-secondary">→ Dirección física = 100 + 100k = 100100</p>
        <p className="text-text-dim mt-2">// Verificación: 100 &lt; 50k → OK, acceso permitido</p>
        <p className="mt-2 text-primary">Instrucción: CALL 60000</p>
        <p className="text-danger">→ 60000 &gt; límite 50k → ¡Violación de memoria!</p>
      </div>

      <DocNote>
        Este mecanismo es implementado directamente en hardware (MMU) para que
        no haya penalización de rendimiento. El SO sólo carga los valores de los
        registros al hacer un cambio de contexto.
      </DocNote>
      <DocWarning>
        La reasignación y la protección son conceptos distintos pero
        complementarios. La reasignación resuelve dónde está el proceso; la
        protección evita que un proceso acceda a memoria ajena.
      </DocWarning>
    </DocPage>
  );
}
