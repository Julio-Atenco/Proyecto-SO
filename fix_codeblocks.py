import re

files = [
    "app/apuntes/2/2.2_Crear_Procesos/page.tsx",
    "app/apuntes/2/2.4_Identificar_Procesos/page.tsx",
    "app/apuntes/2/2.7_Estado_Zombi/page.tsx",
    "app/apuntes/2/2.6_Exit_y__Exit/page.tsx",
    "app/apuntes/2/2.8_Hilos/page.tsx",
    "app/apuntes/2/2.5_Wait/2.5.1_Waitpid/page.tsx",
    "app/apuntes/2/2.5_Wait/page.tsx",
    "app/apuntes/3/3.1_Tuberias/3.1.1_Pipe/page.tsx",
    "app/apuntes/3/3.3_Memoria_Compartida/page.tsx",
    "app/apuntes/3/3.2_SystemV/3.2.2_Semaforos/page.tsx",
    "app/apuntes/3/3.2_SystemV/3.2.1_Llaves/page.tsx",
]

# Busca: <CodeBlock ...>  {`código`}  </CodeBlock>
# donde los props NO contienen code= (formato viejo)
patron = re.compile(
    r'(<CodeBlock\b(?:(?!code=).)*?)>\s*\{`([\s\S]*?)`\}\s*</CodeBlock>',
    re.DOTALL
)

total = 0
for ruta in files:
    try:
        contenido = open(ruta, encoding="utf-8").read()
        nuevo, n = patron.subn(r'\1 code={`\2`} />', contenido)
        open(ruta, "w", encoding="utf-8").write(nuevo)
        print(f"✓  {ruta}  ({n} reemplazo{'s' if n != 1 else ''})")
        total += n
    except FileNotFoundError:
        print(f"⚠  No encontrado: {ruta}")
    except Exception as e:
        print(f"✗  Error en {ruta}: {e}")

print(f"\n{'─'*50}")
print(f"Total: {total} CodeBlocks corregidos")
print("Ahora corre: npm run build")