import DocPage, {
  DocH2,
  DocH3,
  DocP,
  DocUl,
  DocLi,
  DocNote,
  DocWarning,
  CodeBlock,
  InlineCode,
} from "@/components/DocPage";

/* ─────────────────────────────────────────────────────────
   Apunte: Mini-Shell en C — Llamadas al sistema
   Ruta sugerida: /apuntes/3/3.6_MiniShell  (o donde prefieras)
   ───────────────────────────────────────────────────────── */

const toc = [
  { id: "que-es",        label: "¿Qué es?" },
  { id: "arquitectura",  label: "Arquitectura" },
  { id: "bucle",         label: "El bucle REPL" },
  { id: "parseo",        label: "Parseo de argumentos" },
  { id: "comandos",      label: "Comandos implementados" },
  { id: "ejecucion",     label: "Cómo se ve la ejecución" },
  { id: "mejoras",       label: "Qué se puede mejorar" },
  { id: "compilar",      label: "Compilar y correr" },
];

export default function MiniShellPage() {
  return (
    <DocPage
      section="3.6 — Mini-Shell"
      title="Mini-Shell en C con llamadas al sistema"
      category="IPC / Sistema"
      readTime="12 min"
      toc={toc}
      prev={{ href: "/apuntes/3/3.5_Comandos_IPC", label: "Comandos IPC" }}
      next={{ href: "/programas", label: "Programas" }}
    >
      {/* ─── ¿Qué es? ─────────────────────────────────────── */}
      <DocH2 id="que-es">¿Qué es este programa?</DocH2>
      <DocP>
        Es un <strong>intérprete de comandos</strong> (shell) minimalista escrito
        en C que reimplementa, desde cero y usando llamadas al sistema de Linux,
        una colección de comandos clásicos de Unix:{" "}
        <InlineCode>pwd</InlineCode>, <InlineCode>cd</InlineCode>,{" "}
        <InlineCode>ls</InlineCode>, <InlineCode>mkdir</InlineCode>,{" "}
        <InlineCode>stat</InlineCode>, <InlineCode>cat</InlineCode>,{" "}
        <InlineCode>rename</InlineCode>, <InlineCode>find</InlineCode>,{" "}
        <InlineCode>uname</InlineCode>, <InlineCode>ip</InlineCode>,{" "}
        <InlineCode>mac</InlineCode>, <InlineCode>free</InlineCode>,{" "}
        <InlineCode>unlink</InlineCode>, <InlineCode>vfstat</InlineCode>,{" "}
        <InlineCode>date</InlineCode>, <InlineCode>who</InlineCode>,{" "}
        <InlineCode>wall</InlineCode> y <InlineCode>mesg</InlineCode>.
      </DocP>
      <DocP>
        En vez de invocar los binarios reales del sistema (no usa{" "}
        <InlineCode>exec</InlineCode> ni <InlineCode>fork</InlineCode>), cada
        comando se resuelve directamente con la API del kernel:{" "}
        <InlineCode>getcwd</InlineCode>, <InlineCode>chdir</InlineCode>,{" "}
        <InlineCode>opendir/readdir</InlineCode>, <InlineCode>stat</InlineCode>,{" "}
        <InlineCode>statvfs</InlineCode>, <InlineCode>sysinfo</InlineCode>,{" "}
        <InlineCode>uname</InlineCode>, <InlineCode>ioctl</InlineCode> sobre
        sockets, <InlineCode>utmp</InlineCode>, etc. Es un ejercicio excelente
        para entender cómo funcionan por dentro las utilidades de la terminal.
      </DocP>

      <DocNote>
        El prompt dibuja una estética estilo Kali Linux:{" "}
        <InlineCode>{`┌──(minishell)-[/ruta]`}</InlineCode> y{" "}
        <InlineCode>{`└─$`}</InlineCode>. La ruta se recalcula con{" "}
        <InlineCode>getcwd()</InlineCode> en cada iteración del bucle.
      </DocNote>

      {/* ─── Arquitectura ─────────────────────────────────── */}
      <DocH2 id="arquitectura">Arquitectura general</DocH2>
      <DocP>
        El programa se organiza en tres capas:
      </DocP>
      <DocUl>
        <DocLi>
          <strong>Funciones base:</strong> <InlineCode>crearvector()</InlineCode>{" "}
          (reserva memoria), <InlineCode>caracter()</InlineCode> y{" "}
          <InlineCode>espacios()</InlineCode> (analizan la cadena de entrada),{" "}
          <InlineCode>odir()</InlineCode> (abre directorios) y{" "}
          <InlineCode>funstat()</InlineCode> (imprime metadatos de un archivo).
        </DocLi>
        <DocLi>
          <strong>Bucle principal (<InlineCode>main</InlineCode>):</strong> un
          ciclo infinito que lee una línea, identifica el comando por su prefijo
          y despacha a la función correspondiente.
        </DocLi>
        <DocLi>
          <strong>Funciones de comando:</strong> una función por comando
          (<InlineCode>PWD</InlineCode>, <InlineCode>CD</InlineCode>,{" "}
          <InlineCode>LS</InlineCode>, <InlineCode>FIND</InlineCode>…) que valida
          argumentos y ejecuta la llamada al sistema.
        </DocLi>
      </DocUl>

      {/* ─── Bucle REPL ───────────────────────────────────── */}
      <DocH2 id="bucle">El bucle REPL</DocH2>
      <DocP>
        El corazón del shell es un <InlineCode>while(1)</InlineCode> que:
        actualiza la ruta, dibuja el prompt, lee con{" "}
        <InlineCode>fgets()</InlineCode>, quita el salto de línea final, salta
        espacios iniciales y compara el comando con{" "}
        <InlineCode>strncmp()</InlineCode>.
      </DocP>

      <CodeBlock
        filename="shell-entrega.c — bucle principal"
        lang="c"
        code={`while (1)
{
    strcpy(path, getcwd(path, MAX_LEN));
    shell(path);                       // dibuja el prompt
    fgets(opcion, MAX_LEN, stdin);
    opcion[strlen(opcion)-1] = 0;      // elimina el '\\n'
    i = espacios(opcion, 0);           // salta espacios iniciales
    if (i != -1)
        strcpy(opcion, opcion+i);

    if (strncmp(opcion,"pwd",3)   == 0) PWD(opcion);
    if (strncmp(opcion,"cd",2)    == 0) CD(opcion, path);
    if (strncmp(opcion,"mkdir",5) == 0) MKDIR(opcion, 0775);
    if (strncmp(opcion,"ls",2)    == 0) LS(opcion, path);
    /* … resto de comandos … */
    if (strcmp(opcion,"exit") == 0 || strcmp(opcion,"EXIT") == 0)
        exit(1);

    strcpy(opcion, "");
    printf("\\n");
}`}
      />

      <DocWarning>
        El despacho usa <InlineCode>strncmp(opcion,"cd",2)</InlineCode> con{" "}
        cadenas <em>encadenadas con <InlineCode>if</InlineCode> independientes</em>{" "}
        (no <InlineCode>else if</InlineCode>). Esto provoca colisiones de
        prefijo: por ejemplo, escribir <InlineCode>cat</InlineCode> también
        cumple <InlineCode>strncmp(opcion,"ca",2)</InlineCode> de otros casos, y{" "}
        <InlineCode>mac</InlineCode> dispara también la verificación de{" "}
        <InlineCode>"ma…"</InlineCode>. Lo veremos en la sección de mejoras.
      </DocWarning>

      {/* ─── Parseo ───────────────────────────────────────── */}
      <DocH2 id="parseo">Parseo de argumentos</DocH2>
      <DocP>
        Toda la separación de argumentos depende de dos funciones auxiliares:
      </DocP>
      <DocUl>
        <DocLi>
          <InlineCode>espacios(cadena, i)</InlineCode>: a partir de la posición{" "}
          <InlineCode>i</InlineCode>, devuelve el índice del primer carácter
          después de los espacios. Devuelve <InlineCode>-1</InlineCode> si no hay
          espacio donde se esperaba (sirve para validar la sintaxis del comando)
          y <InlineCode>0</InlineCode> si llegó al final.
        </DocLi>
        <DocLi>
          <InlineCode>caracter(cadena, i)</InlineCode>: devuelve el índice del
          siguiente espacio (el final de un token). Sirve para extraer el primer
          argumento en comandos de dos argumentos como{" "}
          <InlineCode>rename</InlineCode> o <InlineCode>find</InlineCode>.
        </DocLi>
      </DocUl>

      <CodeBlock
        filename="shell-entrega.c — espacios()"
        lang="c"
        code={`int espacios(const char *cadena, int i)
{
    int max = strlen(cadena);
    char caracter[2];
    if (strlen(cadena)==i) return 0;
    strncpy(caracter, cadena+i, 1);
    if (strncmp(caracter," ",1)!=0) return -1;   // no había espacio -> sintaxis inválida
    i++;
    while (i < max){
        strncpy(caracter, cadena+i, 1);
        if (strncmp(caracter," ",1)!=0) return i; // primer no-espacio
        i++;
    }
    return 0;
}`}
      />

      {/* ─── Comandos ─────────────────────────────────────── */}
      <DocH2 id="comandos">Comandos implementados</DocH2>
      <DocP>
        Cada comando es un envoltorio pedagógico sobre una llamada al sistema.
        Resumen de qué API usa cada uno:
      </DocP>
      <DocUl>
        <DocLi>
          <InlineCode>pwd</InlineCode> / <InlineCode>cd</InlineCode> →{" "}
          <InlineCode>getcwd()</InlineCode> / <InlineCode>chdir()</InlineCode>
        </DocLi>
        <DocLi>
          <InlineCode>ls</InlineCode> →{" "}
          <InlineCode>opendir / readdir / closedir</InlineCode> con banderas{" "}
          <InlineCode>-l</InlineCode>, <InlineCode>-a</InlineCode>,{" "}
          <InlineCode>-i</InlineCode> y combinaciones; usa{" "}
          <InlineCode>stat()</InlineCode> y <InlineCode>major/minor</InlineCode>{" "}
          para el detalle.
        </DocLi>
        <DocLi>
          <InlineCode>mkdir</InlineCode> → <InlineCode>mkdir()</InlineCode> con{" "}
          modo <InlineCode>0775</InlineCode>.
        </DocLi>
        <DocLi>
          <InlineCode>stat</InlineCode> / <InlineCode>vfstat</InlineCode> →{" "}
          <InlineCode>stat()</InlineCode> / <InlineCode>statvfs()</InlineCode>{" "}
          (metadatos de archivo y del sistema de ficheros).
        </DocLi>
        <DocLi>
          <InlineCode>cat</InlineCode> →{" "}
          <InlineCode>open / read / write / close</InlineCode> (E/S de bajo
          nivel, sin buffering de la libc).
        </DocLi>
        <DocLi>
          <InlineCode>rename</InlineCode> / <InlineCode>unlink</InlineCode> →{" "}
          <InlineCode>rename()</InlineCode> / <InlineCode>unlink()</InlineCode>.
        </DocLi>
        <DocLi>
          <InlineCode>find</InlineCode> → recorrido recursivo de directorios con{" "}
          <InlineCode>readdir</InlineCode> + <InlineCode>funstat()</InlineCode>.
        </DocLi>
        <DocLi>
          <InlineCode>uname</InlineCode> / <InlineCode>free</InlineCode> →{" "}
          <InlineCode>uname()</InlineCode> / <InlineCode>sysinfo()</InlineCode>.
        </DocLi>
        <DocLi>
          <InlineCode>ip</InlineCode> / <InlineCode>mac</InlineCode> →{" "}
          <InlineCode>socket()</InlineCode> + <InlineCode>ioctl()</InlineCode>{" "}
          (<InlineCode>SIOCGIFADDR</InlineCode>,{" "}
          <InlineCode>SIOCGIFHWADDR</InlineCode>) sobre{" "}
          <InlineCode>docker0</InlineCode>, <InlineCode>lo</InlineCode>,{" "}
          <InlineCode>wlan0</InlineCode>.
        </DocLi>
        <DocLi>
          <InlineCode>date</InlineCode> →{" "}
          <InlineCode>time / localtime / strftime</InlineCode>.
        </DocLi>
        <DocLi>
          <InlineCode>who</InlineCode> / <InlineCode>wall</InlineCode> /{" "}
          <InlineCode>mesg</InlineCode> → base de datos{" "}
          <InlineCode>utmp</InlineCode> (<InlineCode>getutent()</InlineCode>) +
          escritura sobre <InlineCode>/dev/&lt;tty&gt;</InlineCode>.
        </DocLi>
      </DocUl>

      <DocH3>Ejemplo: cat con E/S de bajo nivel</DocH3>
      <CodeBlock
        filename="shell-entrega.c — CAT()"
        lang="c"
        code={`void CAT(char *opcion)
{
    char texto[5000];
    int i = espacios(opcion, 3);
    if (i == -1) { printf("Comando invalido: quizas es cat\\n"); return; }

    int b = open(opcion+i, O_RDONLY);
    if (b == -1) { printf("Direccion invalida: cat <direccion>\\n"); return; }

    int n = read(b, texto, sizeof(texto));
    write(STDOUT_FILENO, texto, n);
    close(b);
}`}
      />

      {/* ─── Ejecución ────────────────────────────────────── */}
      <DocH2 id="ejecucion">Cómo se ve la ejecución</DocH2>
      <DocP>
        Una sesión típica del mini-shell. El prompt se redibuja tras cada
        comando con la ruta actual:
      </DocP>

      <CodeBlock
        filename="Sesión interactiva"
        lang="bash"
        code={`$ gcc shell-entrega.c -o minishell
$ ./minishell`}
        output={`┌──(minishell)-[/home/julio/SO]
└─$ pwd
/home/julio/SO

┌──(minishell)-[/home/julio/SO]
└─$ ls -la
[8,2] dir  .
[8,2] dir  ..
[8,2] file  shell-entrega.c
[8,2] file  minishell
[8,2] dir  practicas

┌──(minishell)-[/home/julio/SO]
└─$ cd practicas

┌──(minishell)-[/home/julio/SO/practicas]
└─$ date
2025-05-18 dom 14:32:07

┌──(minishell)-[/home/julio/SO/practicas]
└─$ free
Memoria total: 16572399616
Memoria libre: 9183420416
Memoria usada: 7388979200
Swap total:  2147479552
Swap libre:  2147479552

┌──(minishell)-[/home/julio/SO/practicas]
└─$ uname
Linux julio-pc 6.8.0-40-generic #40-Ubuntu SMP x86_64

┌──(minishell)-[/home/julio/SO/practicas]
└─$ exit
$`}
        outputNote="salida ilustrativa — depende de tu sistema"
      />

      <DocP>
        El comando <InlineCode>stat</InlineCode> muestra los metadatos crudos del
        inodo:
      </DocP>

      <CodeBlock
        filename="stat de un directorio"
        lang="bash"
        code={`└─$ stat /etc`}
        output={`ID of containing device:  [8,2]
File type:                directory`}
        outputNote="major/minor del dispositivo + tipo"
      />

      {/* ─── Mejoras ──────────────────────────────────────── */}
      <DocH2 id="mejoras">Qué se puede mejorar</DocH2>
      <DocP>
        El programa funciona y es didáctico, pero tiene varios puntos a
        corregir. Ordenados de más crítico a menos:
      </DocP>

      <DocH3>1. Despacho con <code>if</code> independientes (bug grave)</DocH3>
      <DocP>
        Cada comando se prueba con un <InlineCode>if</InlineCode> separado y solo
        compara <strong>prefijos</strong>. Esto causa que comandos se disparen
        entre sí. Ejemplos reales del código:{" "}
        <InlineCode>strncmp(opcion,"stat",3)</InlineCode> compara solo 3
        caracteres (<InlineCode>"sta"</InlineCode>), y{" "}
        <InlineCode>who</InlineCode> usa <InlineCode>strncmp(...,"who",4)</InlineCode>{" "}
        con longitud 4 sobre una palabra de 3 letras.
      </DocP>
      <DocWarning>
        Solución: usar <InlineCode>strtok()</InlineCode> para separar el primer
        token y comparar con <InlineCode>strcmp()</InlineCode> exacto dentro de
        una cadena <InlineCode>if / else if</InlineCode> o un{" "}
        <InlineCode>switch</InlineCode> sobre una tabla de comandos.
      </DocWarning>

      <DocH3>2. Desbordamientos de buffer</DocH3>
      <DocUl>
        <DocLi>
          <InlineCode>opcion[strlen(opcion)-1] = 0;</InlineCode> — si{" "}
          <InlineCode>fgets</InlineCode> recibe EOF (Ctrl-D) o cadena vacía,{" "}
          <InlineCode>strlen</InlineCode> es 0 y se escribe en{" "}
          <InlineCode>opcion[-1]</InlineCode> (acceso fuera de límites).
        </DocLi>
        <DocLi>
          <InlineCode>caracter()</InlineCode> usa{" "}
          <InlineCode>char caracter[2]</InlineCode> con{" "}
          <InlineCode>strncpy(...,1)</InlineCode> sin colocar el{" "}
          <InlineCode>'\0'</InlineCode>: funciona por casualidad, pero es frágil.
        </DocLi>
        <DocLi>
          <InlineCode>CAT</InlineCode> lee a un buffer fijo de 5000 bytes y solo
          una vez: archivos grandes se truncan. Debería leerse en bucle hasta{" "}
          que <InlineCode>read()</InlineCode> devuelva 0.
        </DocLi>
        <DocLi>
          Validar siempre el retorno de <InlineCode>getcwd()</InlineCode> (puede
          devolver <InlineCode>NULL</InlineCode>) antes de{" "}
          <InlineCode>strcpy</InlineCode>.
        </DocLi>
      </DocUl>

      <DocH3>3. Fugas de recursos y errores no comprobados</DocH3>
      <DocUl>
        <DocLi>
          En <InlineCode>IP</InlineCode> y <InlineCode>MAC</InlineCode> el socket
          se crea pero <strong>nunca se cierra</strong> (falta{" "}
          <InlineCode>close(sock)</InlineCode>).
        </DocLi>
        <DocLi>
          <InlineCode>MKDIR</InlineCode> tiene una rama muerta:{" "}
          <InlineCode>else if (num == -1)</InlineCode> repetida — nunca se
          alcanza. Además no informa el error si{" "}
          <InlineCode>mkdir()</InlineCode> falla.
        </DocLi>
        <DocLi>
          En <InlineCode>VFSTAT</InlineCode> se imprime{" "}
          <InlineCode>opcion+1</InlineCode> en vez de{" "}
          <InlineCode>opcion+i</InlineCode> (nombre de archivo incorrecto en la
          salida).
        </DocLi>
        <DocLi>
          Interfaces de red <em>hardcodeadas</em> (<InlineCode>docker0</InlineCode>,{" "}
          <InlineCode>wlan0</InlineCode>). Mejor enumerarlas con{" "}
          <InlineCode>getifaddrs()</InlineCode>.
        </DocLi>
      </DocUl>

      <DocH3>4. Robustez del parseo</DocH3>
      <DocUl>
        <DocLi>
          No maneja comillas ni rutas con espacios (<InlineCode>cd "mi carpeta"</InlineCode>{" "}
          falla).
        </DocLi>
        <DocLi>
          <InlineCode>ls</InlineCode> ignora la ruta como argumento: siempre
          lista <InlineCode>path</InlineCode> (el directorio actual), nunca{" "}
          <InlineCode>ls /tmp</InlineCode>.
        </DocLi>
        <DocLi>
          Los comentarios <InlineCode>// pruebalo julio no me jala</InlineCode>{" "}
          en <InlineCode>wall</InlineCode>/<InlineCode>mesg</InlineCode> indican
          código sin probar — conviene validar con dos terminales abiertas y
          permisos adecuados.
        </DocLi>
      </DocUl>

      <DocH3>5. Estilo y mantenibilidad</DocH3>
      <DocUl>
        <DocLi>
          Reemplazar la cascada de <InlineCode>if</InlineCode> por una tabla{" "}
          <InlineCode>{`struct { char *nombre; void (*fn)(char*); }`}</InlineCode>{" "}
          recorrida en bucle: agregar comandos sin tocar{" "}
          <InlineCode>main</InlineCode>.
        </DocLi>
        <DocLi>
          Compilar con <InlineCode>-Wall -Wextra</InlineCode> y descomentar{" "}
          <InlineCode>#include &lt;errno.h&gt;</InlineCode> para mensajes de
          error precisos con <InlineCode>strerror(errno)</InlineCode>.
        </DocLi>
        <DocLi>
          Liberar memoria: <InlineCode>crearvector()</InlineCode> reserva con{" "}
          <InlineCode>malloc</InlineCode> y solo <InlineCode>find</InlineCode>{" "}
          hace <InlineCode>free</InlineCode>. Verificar que{" "}
          <InlineCode>malloc</InlineCode> no devuelva{" "}
          <InlineCode>NULL</InlineCode>.
        </DocLi>
      </DocUl>

      <DocNote>
        Refactor recomendado del despacho: tokeniza una sola vez con{" "}
        <InlineCode>strtok(opcion, " ")</InlineCode>, compara el comando con{" "}
        <InlineCode>strcmp</InlineCode> exacto y pasa el resto de argumentos por
        separado. Elimina de golpe los bugs de prefijo y simplifica cada función
        (ya no necesitan recalcular <InlineCode>espacios()</InlineCode>).
      </DocNote>

      <CodeBlock
        filename="Propuesta — tabla de despacho"
        lang="c"
        code={`typedef struct {
    const char *nombre;
    void (*fn)(char *args, char *path);
} Comando;

static const Comando tabla[] = {
    { "pwd",   cmd_pwd },
    { "cd",    cmd_cd  },
    { "ls",    cmd_ls  },
    { "cat",   cmd_cat },
    /* … */
    { NULL, NULL }
};

/* en el bucle */
char *cmd  = strtok(linea, " ");
char *args = strtok(NULL, "");        // resto de la línea
for (int k = 0; tabla[k].nombre; k++) {
    if (strcmp(cmd, tabla[k].nombre) == 0) {
        tabla[k].fn(args, path);
        break;
    }
}`}
      />

      {/* ─── Compilar ─────────────────────────────────────── */}
      <DocH2 id="compilar">Compilar y correr</DocH2>
      <CodeBlock
        filename="Terminal"
        lang="bash"
        code={`# Compilación recomendada (con advertencias activadas)
gcc -Wall -Wextra -o minishell shell-entrega.c

# Ejecutar
./minishell

# Para salir del shell
└─$ exit`}
        output={`shell-entrega.c: en algunas funciones se mostrarán
warnings de -Wall que conviene resolver (variables sin
usar, retornos sin comprobar, etc.)`}
        outputNote="usa -Wall para encontrar bugs antes de ejecutar"
      />

      <DocWarning>
        Algunos comandos (<InlineCode>wall</InlineCode>,{" "}
        <InlineCode>mesg</InlineCode>, lectura de{" "}
        <InlineCode>utmp</InlineCode>, escritura en{" "}
        <InlineCode>/dev/tty</InlineCode>) requieren permisos y sesiones de
        usuario activas. En contenedores Docker o sesiones SSH sin TTY pueden no
        producir salida visible.
      </DocWarning>
    </DocPage>
  );
}