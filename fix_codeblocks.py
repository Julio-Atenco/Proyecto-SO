import re
import subprocess

resultado = subprocess.run(
    ['grep', '-rl', '<CodeBlock', 'app/'],
    capture_output=True, text=True
)
files = [f for f in resultado.stdout.strip().split('\n') if f.endswith('.tsx')]

patron_template = re.compile(
    r'(<CodeBlock\b(?:(?!code=).)*?)>\s*\{`([\s\S]*?)`\}\s*</CodeBlock>',
    re.DOTALL
)
patron_variable = re.compile(
    r'(<CodeBlock\b(?:(?!code=).)*?)>\s*\{(\w+)\}\s*</CodeBlock>',
    re.DOTALL
)

total = 0
for ruta in files:
    try:
        contenido = open(ruta, encoding="utf-8").read()
        nuevo, n1 = patron_template.subn(r'\1 code={`\2`} />', contenido)
        nuevo, n2 = patron_variable.subn(r'\1 code={\2} />', nuevo)
        n = n1 + n2
        if n > 0:
            open(ruta, "w", encoding="utf-8").write(nuevo)
            print(f"✓  {ruta}  ({n} reemplazos)")
            total += n
    except Exception as e:
        print(f"✗  {ruta}: {e}")

print(f"\nTotal: {total} CodeBlocks corregidos")
print("Ahora corre: npm run build")
