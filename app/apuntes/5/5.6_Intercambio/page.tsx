import DocPage, {
  DocH2,
  DocH3,
  DocP,
  DocUl,
  DocLi,
  DocNote,
  CodeBlock,
  InlineCode,
} from "@/components/DocPage";

export const metadata = {
  title: "5.6 Intercambio (Swap) | Portafolio SO",
};

const toc = [
  { id: "intercambio", label: "Intercambio" },
  { id: "particiones-variables", label: "Particiones variables" },
  { id: "swap-linux", label: "Swap en GNU/Linux" },
  { id: "funciones-c", label: "Funciones swapon / swapoff" },
  { id: "registro-memoria", label: "Registro del uso de memoria" },
];

export default function Page() {
  return (
    <DocPage
      section="5.6"
      title="Intercambio (Swap)"
      category="Administración de Memoria"
      prev={{ href: "/apuntes/5/5.5_Reasignacion_Proteccion", label: "5.5 Reasignación y Protección" }}
      next={{ href: "/apuntes/5/5.7_Mapas_Bits", label: "5.7 Mapas de Bits" }}
      toc={toc}
    >
      <DocH2 id="intercambio">Intercambio</DocH2>
      <DocP>
        En un sistema de tiempo compartido suele haber más procesos activos de
        los que la RAM puede albergar simultáneamente. El{" "}
        <strong className="text-primary">intercambio (swapping)</strong> consiste
        en trasladar procesos completos entre la memoria principal y el disco
        para liberar espacio en RAM y permitir que otros procesos se ejecuten.
      </DocP>

      <DocH2 id="particiones-variables">Particiones variables</DocH2>
      <DocP>
        Las particiones fijas no son atractivas cuando la memoria disponible es
        escasa, porque la mayor parte se desperdicia con programas menores que
        su partición. En cambio, las{" "}
        <strong className="text-secondary">particiones variables</strong>{" "}
        ajustan el tamaño de cada partición al proceso que la ocupa,
        aprovechando mejor la RAM. La contrapartida es una mayor complejidad en
        la asignación y liberación de memoria.
      </DocP>
      <DocP>
        Cuando se liberan múltiples particiones no contiguas se forman{" "}
        <strong className="text-tertiary">huecos</strong>. Una técnica para
        consolidarlos es la{" "}
        <strong className="text-tertiary">compactación de memoria</strong>:
        mover todos los procesos hacia la parte inferior de la RAM y unir todos
        los huecos en uno grande. Rara vez se implementa porque consume mucho
        tiempo de CPU.
      </DocP>

      <DocH2 id="swap-linux">Swap en GNU/Linux</DocH2>
      <DocP>
        En Linux, el intercambio se gestiona mediante el área de{" "}
        <strong className="text-primary">swap</strong>. Para verificar el estado
        de la swap en tu sistema:
      </DocP>
      <CodeBlock
        filename="terminal"
        code={`swapon
# Salida de ejemplo:
# NAME       TYPE      SIZE   USED PRIO
# /dev/dm-1  partition 976M  49.9M   -2`}
      />

      <DocH2 id="funciones-c">Funciones swapon() y swapoff()</DocH2>
      <DocP>
        En C, se pueden habilitar y deshabilitar áreas de intercambio
        programáticamente:
      </DocP>
      <CodeBlock
        filename="prototipo_swap.c"
        code={`#include <unistd.h>
#include <sys/swap.h>

int swapon(const char *path, int swapflags);
int swapoff(const char *path);`}
      />
      <DocUl>
        <DocLi>
          <InlineCode>swapon()</InlineCode> activa el área de intercambio para
          el archivo o dispositivo de bloque especificado en{" "}
          <InlineCode>path</InlineCode>.
        </DocLi>
        <DocLi>
          <InlineCode>swapoff()</InlineCode> detiene el intercambio del archivo
          o dispositivo indicado.
        </DocLi>
      </DocUl>
      <DocNote>
        Ambas funciones requieren privilegios de superusuario (root) para
        ejecutarse correctamente.
      </DocNote>

      <DocH2 id="registro-memoria">Registro del uso de memoria</DocH2>
      <DocP>
        Los sistemas operativos usan tres técnicas principales para llevar el
        registro de qué partes de la memoria están libres u ocupadas:
      </DocP>
      <DocUl>
        <DocLi>
          <strong className="text-primary">Mapas de bits</strong> (sección 5.7)
        </DocLi>
        <DocLi>
          <strong className="text-secondary">Listas ligadas</strong> (sección
          5.8)
        </DocLi>
        <DocLi>
          <strong className="text-tertiary">Sistemas amigables (buddy
          system)</strong>
        </DocLi>
      </DocUl>
    </DocPage>
  );
}
