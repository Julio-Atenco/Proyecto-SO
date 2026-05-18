import DocPage, {
  DocH2,
  DocP,
  DocUl,
  DocLi,
  DocNote,
  CodeBlock,
  InlineCode,
} from "@/components/DocPage";

export const metadata = {
  title: "5.9 Memoria Virtual | Portafolio SO",
};

const toc = [
  { id: "concepto", label: "Concepto de memoria virtual" },
  { id: "mmu", label: "Unidad de administración de memoria (MMU)" },
  { id: "paginacion-virtual", label: "Paginación virtual" },
  { id: "swap-linux", label: "Swap en Linux" },
  { id: "swappiness", label: "Parámetro swappiness" },
];

export default function Page() {
  return (
    <DocPage
      section="5.9"
      title="Memoria Virtual"
      category="Administración de Memoria"
      prev={{ href: "/apuntes/5/5.8_Listas_Ligadas", label: "5.8 Listas Ligadas" }}
      next={{ href: "/apuntes/5/5.10_Funciones_Memoria", label: "5.10 Funciones de Memoria" }}
      toc={toc}
    >
      <DocH2 id="concepto">Concepto de memoria virtual</DocH2>
      <DocP>
        La idea fundamental detrás de la{" "}
        <strong className="text-primary">memoria virtual</strong> es que el
        tamaño combinado del programa, sus datos y su pila puede{" "}
        <em>exceder</em> la cantidad de memoria física disponible. El sistema
        operativo mantiene en RAM sólo las partes del programa que se utilizan en
        cada momento y almacena el resto en el disco.
      </DocP>
      <DocP>
        La mayoría de los sistemas con memoria virtual utilizan la técnica de{" "}
        <strong className="text-secondary">paginación</strong>.
      </DocP>

      <DocH2 id="mmu">Unidad de Administración de Memoria (MMU)</DocH2>
      <DocP>
        Al usar memoria virtual, las{" "}
        <strong className="text-primary">direcciones virtuales</strong> generadas
        por el proceso no se envían directamente al bus de memoria. En cambio,
        van a la{" "}
        <strong className="text-tertiary">MMU (Memory Management Unit)</strong>,
        un chip o conjunto de chips que traduce direcciones virtuales a
        direcciones físicas.
      </DocP>

      <DocH2 id="paginacion-virtual">Páginas y marcos de página</DocH2>
      <DocUl>
        <DocLi>
          Los espacios de direcciones virtuales se dividen en unidades llamadas{" "}
          <strong className="text-primary">páginas</strong>.
        </DocLi>
        <DocLi>
          Sus equivalentes en memoria física se llaman{" "}
          <strong className="text-secondary">marcos de página (frames)</strong>.
        </DocLi>
        <DocLi>
          Páginas y marcos tienen siempre el mismo tamaño; las transferencias
          entre memoria y disco se realizan en unidades de una página completa.
        </DocLi>
      </DocUl>
      <DocP>
        <strong className="text-tertiary">Ejemplo de traducción:</strong> la
        instrucción <InlineCode>MOV REG, 0</InlineCode> genera la dirección
        virtual 0. La MMU la ubica en la página 0 (rango 0–4095) y, según su
        tabla de páginas, la mapea al marco 2 (rango 8192–12287). La dirección
        virtual 0 se transforma en la dirección física 8192.
      </DocP>

      <DocH2 id="swap-linux">Swap en Linux</DocH2>
      <DocP>
        En Linux, el área de swap actúa como la memoria secundaria de la
        paginación:
      </DocP>
      <DocUl>
        <DocLi>
          Antes de Ubuntu 17.04: la swap se almacenaba en una{" "}
          <strong className="text-primary">partición dedicada</strong> llamada
          swap.
        </DocLi>
        <DocLi>
          A partir de Ubuntu 17.04: se crea un{" "}
          <strong className="text-secondary">archivo de paginación</strong>{" "}
          llamado <InlineCode>swapfile</InlineCode> en el directorio raíz del
          sistema de archivos. No hay diferencia de rendimiento entre ambas
          opciones.
        </DocLi>
      </DocUl>
      <DocP>
        Para verificar qué método usa tu sistema:
      </DocP>
      <CodeBlock
        filename="terminal"
        code={`cat /proc/swaps
# o también:
cat /etc/fstab`}
      />

      <DocH2 id="swappiness">Parámetro swappiness</DocH2>
      <DocP>
        Linux decide cuándo enviar páginas a la swap basándose en el valor de{" "}
        <strong className="text-tertiary">swappiness</strong> (rango 0–100):
      </DocP>
      <CodeBlock
        filename="terminal"
        code={`# Ver el valor actual (predeterminado en Ubuntu: 60)
cat /proc/sys/vm/swappiness

# Cambiar temporalmente (como root):
sysctl -w vm.swappiness=20

# Cambiar permanentemente (editar /etc/sysctl.conf):
# Agregar o modificar la línea:
# vm.swappiness=20`}
      />
      <DocNote>
        El valor predeterminado de 60 indica que Linux comenzará a usar la swap
        cuando la RAM llegue al 40% de uso. Un valor de 0 desactiva el swap
        salvo que sea estrictamente necesario; un valor de 100 hace que el
        sistema use la swap agresivamente.
      </DocNote>
    </DocPage>
  );
}
