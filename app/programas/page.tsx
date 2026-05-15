import type { Metadata } from "next";
import ProgramasClient from "./ProgramasClient";

export const metadata: Metadata = {
  title: "Programas | BitácoraSO",
  description: "Código fuente y prácticas de Sistemas Operativos — UTM.",
};

export default function ProgramasPage() {
  return <ProgramasClient />;
}