CRASH DUMP ANALYZER 1.4.0 - GUÍA EN ESPAÑOL
==========================================
(Hasta la 1.2.1 se llamaba "Crash Dump Viewer".)

Visor offline de minidumps de Windows (.dmp) en un solo archivo HTML.
Pensado para DAWs (Cubase, Nuendo, etc.), pero sirve con cualquier proceso
Windows x64, x86 o ARM64.


1. USO
------
1. Abrir CrashDumpAnalyzer.html (doble clic) en Chrome, Edge o Firefox.
2. Cargar los dumps de una de estas formas:
   - "Open .dmp files": seleccionar archivos.
   - "Open folder": se cargan todos los .dmp de la carpeta y sus
     subcarpetas.
     Rutas típicas (también aparecen en el visor, en "Where are the
     dumps?", con botón Copy):
       Cubase / Nuendo / Dorico:
         %USERPROFILE%\Documents\Steinberg\CrashDumps
         (en Windows en español el Explorador muestra Documents como
         "Documentos")
       Otros programas (Windows Error Reporting, si los dumps locales
       están activados):
         %LOCALAPPDATA%\CrashDumps
     La ruta se puede pegar tal cual en la barra de direcciones del
     Explorador: Windows expande las variables.
   - Arrastrar archivos o carpetas a la ventana. Las carpetas se recorren
     de forma recursiva.
   - "Watch folder" (solo Chrome y Edge): se elige una carpeta una vez.
     "Rescan" carga los dumps nuevos. Con "auto (15 s)" se re-escanea cada
     15 segundos mientras la página esté abierta. El permiso no queda
     guardado: hay que volver a elegir la carpeta cada vez que se abre la
     página.
   Un archivo que ya está cargado (mismo nombre, tamaño y fecha) se ignora.
3. Elegir un dump en la lista izquierda. Con 2 o más dumps aparece
   "Compare all dumps". El símbolo ⚠ indica que el dump tiene avisos o
   presión de memoria.
4. EN / ES / DE cambia el idioma (inglés, español, alemán). El idioma por
   defecto es inglés.
5. Exportar:
   - "Export report (.txt)": el dump seleccionado, o la comparación.
   - "Export all (.txt)": la comparación más un informe por cada dump.
   - "Export CSV": una fila por dump, separador ";" (Excel en español),
     UTF-8 con BOM.
   - "Export JSON": resumen estructurado de cada dump más la comparación.
     No incluye memoria cruda del proceso.
   - "Anonymise exports" (activado por defecto). Reemplaza:
       * \Users\<nombre>\ por \Users\<user>\;
       * el nombre de usuario de Windows (detectado en las rutas de los
         módulos) por <user>;
       * toda carpeta que no sea una ubicación estándar de Windows por
         <folder>\ (ej. D:\Mis Samples\Kontakt\). Las ubicaciones
         estándar son C:\Windows, C:\Program Files,
         C:\Program Files (x86) y C:\ProgramData.
     Se aplica a TXT, CSV, JSON y al resumen para soporte.
   Los .txt se guardan en UTF-8 con BOM y saltos CRLF.
6. Stack exacto (opcional): con "Load module files" o arrastrando archivos,
   se cargan los .dll, .vst3, .exe o .clap involucrados. Se usan solo si
   son la misma compilación que figura en el dump (TimeDateStamp y
   SizeOfImage idénticos). La columna "Module file" de la pestaña Modules
   muestra cuáles coincidieron. Los VST3 están en
   C:\Program Files\Common Files\VST3\<Plugin>.vst3\Contents\x86_64-win\.
   También se puede arrastrar la carpeta .vst3 completa.

6b. Nuevo en 1.4.0:
   - "Load demo dumps": carga 4 dumps sintéticos generados por la misma
     página, con software ficticio (DemoDAW, Example Synth...) y sin datos
     reales. Muestran todas las funciones: un bug repetido con la misma
     firma, un congelamiento con posible deadlock, una excepción C++
     std::bad_alloc con poca RAM, un plugin cargado en VST2 y VST3, un
     binario antiguo y una actualización que resolvió un plugin.
   - "Export report (.html)": informe autocontenido (sin scripts, con CSP
     propia y tema claro) del dump seleccionado, o de todos si está abierta
     la comparación. Se aplica "Anonymise exports".
   - "Print / PDF": el mismo informe por el diálogo de impresión del
     navegador. Para obtener un PDF, elegir "Guardar como PDF" o "Microsoft
     Print to PDF".
   - Firma del crash: CDA-XXXXXXXX. Se calcula con
     tipo | código | módulo culpable | versión | punto del código.
     Misma firma = mismo bug en la misma compilación. Aparece en el
     veredicto, en la comparación, en el soporte, en el TXT, en el CSV y en
     el JSON.
   - Tipo de excepción C++ (ej. std::bad_alloc), leído de las estructuras
     RTTI de MSVC. Requiere que el dump traiga esa memoria o que se haya
     cargado el archivo del módulo.
   - Comparación > "Fix first": ranking de módulos culpables con acción
     sugerida.

7. Notas propias ("Import notes" / "Export notes"):
   - En la pestaña Diagnosis, la tarjeta "My notes" permite escribir una
     nota para el culpable o para cualquier módulo de terceros, para todas
     las versiones o solo para la versión cargada.
   - Las notas viven solo mientras la página está abierta: "Export notes"
     las guarda en crash-dump-analyzer-notes.json, e "Import notes" las vuelve
     a cargar (sin duplicar). Los archivos exportados con la 1.2.x
     (formato "crash-dump-viewer-notes") se siguen aceptando.
   - Cuando el culpable o un módulo del stack tiene notas, aparecen en el
     diagnóstico y en el informe .txt. En la comparación, el culpable se
     marca con 📝.
   - "Clear" no borra las notas.

8. Ícono:
   - El favicon y el logo del encabezado están dentro del HTML como SVG.
   - La carpeta Icono\ trae:
       CrashDumpAnalyzer.ico      16, 24, 32, 48, 64, 128 y 256 px
       CrashDumpAnalyzer-256.png
       CrashDumpAnalyzer.svg
   - Para un acceso directo con ícono:
       1) Clic derecho en CrashDumpAnalyzer.html > Mostrar más opciones >
          Crear acceso directo.
       2) Propiedades del acceso directo > Cambiar icono > elegir
          Icono\CrashDumpAnalyzer.ico.

Para compartir el visor basta con enviar CrashDumpAnalyzer.html.


2. PESTAÑAS
-----------
Diagnosis
  Contiene, en este orden:
  - Veredicto y culpable probable.
  - "Qué pasó": excepción, análisis del puntero, hilo, actividad, memoria,
    resumen de hilos, posible deadlock y tiempo en ejecución.
  - "Qué hacer".
  - Avisos (⚠).
  - Memoria al momento del dump.
  - Resumen de todos los hilos (solo los que no están en espera, más el
    principal, el del fallo y los que tienen al culpable en el stack).
  - Otros módulos vistos en el stack.
  - Tabla de módulos de terceros con su fecha de enlace.
Support summary
  Texto en inglés listo para enviar al fabricante: aplicación, Windows,
  hora, excepción, módulo con versión, fecha de enlace e id de PDB, hilo,
  actividad, memoria, 24 frames y módulos de terceros. Tiene un botón
  Copy; si el portapapeles no está disponible, usa document.execCommand.
Exception & registers
  Agrega la tarjeta "Faulting instruction": desensamblado aproximado de la
  instrucción que falló, sus bytes, los registros usados para calcular la
  dirección y la dirección resultante comparada con la de la excepción.
  Los bytes de código salen del dump o, si no están ahí, del archivo de
  módulo cargado.
Stack
  Frames con columna "Method": exact (unwound) o scan.
Threads
  Agrega las columnas State y "First non-Windows module". Cuando el
  módulo culpable aparece en el stack del hilo, se marca "culprit".
Modules
  Agrega la columna "Module file" (✓ cuando el archivo se cargó y
  coincidió).
System & process
  Agrega la tarjeta de memoria.
Raw streams
  Sin cambios.
Compare all dumps
  - Línea de tiempo: un carril por versión de la aplicación; rojo = caída,
    ámbar = congelamiento.
  - Tabla comparativa con la versión del culpable.
  - Lectura (notas automáticas).
  - Frecuencia de culpables.
  - Cambios de módulos entre dumps: versiones que cambiaron (también
    drivers como NVIDIA o el de licencias) y módulos vistos por primera
    vez.
  - Versiones de cada módulo culpable a lo largo de los dumps.
  - Módulos de terceros presentes en 2 o más dumps.


3. CÓMO DECIDE EL CULPABLE
--------------------------
Caída (hay ExceptionStream). Se aplica la primera regla que se cumpla:
  a) 0xE06D7363 (excepción C++ de MSVC): ExceptionInformation[3] es la
     base del módulo que lanzó la excepción.                  Confianza alta.
  b) La dirección del fallo está en un módulo que no es de Windows ni del
     runtime.                                                 Confianza alta.
  c) La dirección del fallo está en un módulo descargado.     Confianza alta.
  d) El fallo ocurrió dentro de Windows o del runtime: se toma el primer
     módulo que no es de Windows en el stack.                 Confianza media.
  e) Solo aparece código de Windows.                          Confianza baja.
Congelamiento (no hay ExceptionStream y el nombre del archivo contiene
freeze, hang, deadlock o watchdog; si no, el dump se trata como snapshot):
  Se toma el primer módulo de nivel 1 (plugin, driver de audio, ARA,
  protección anticopia o terceros) en el stack del hilo principal; si no
  hay, el primero de nivel 2 (componente del fabricante, WebView o driver
  de video). Confianza media para nivel 1 y baja para nivel 2.

ACCESS_VIOLATION (0xC0000005 / 0xC0000006):
  Operación (ExceptionInformation[0]): 0 lectura, 1 escritura,
  8 ejecución (DEP). La dirección accedida se clasifica así:
    null      menor que 0x10000
    garbage   0xFFFFFFFFFFFFFFFF, o no canónica en x64
    unloaded  dentro de un módulo ya descargado
    module    dentro de un módulo cargado
    gp        0xFFFFFFFFFFFFFFFF: Windows no conoce la dirección (fallo de
              protección general, puntero no canónico)
    unmapped  cualquier otra
    exec      operación 8
0xC0000409: el código FAST_FAIL_* se toma de ExceptionInformation[0].


4. ANÁLISIS NUEVOS EN 1.1.0
---------------------------
Memoria (streams ProcessVmCounters y SystemMemoryInfo):
  Muestra la memoria privada del proceso, su working set y pico, el uso de
  pagefile, la RAM instalada y disponible, y el commit del sistema contra
  su límite.
  Umbrales de alerta:
    - RAM libre menor al 8% o menor a 1,5 GiB.
    - Commit igual o mayor al 90% del límite.
    - Proceso usando el 60% o más de la RAM.
  Cada alerta agrega una acción (reducir carga o agrandar el pagefile).
Avisos:
  - VST2 + VST3: el mismo plugin cargado en ambos formatos. Los nombres se
    comparan normalizados (sin extensión, espacios, "x64" ni "64bit").
  - Binario antiguo: fecha de enlace PE más de 6 años anterior al dump.
    Se ignora si la fecha cae fuera del rango entre el año 2000 y la fecha
    del dump.
  - Legacy: solo plugins que el propio fabricante lista como legacy.
    Hoy: Stylus RMX (spectrasonics.net/instruments/stylusrmx.html).
Actividad ("qué estaba haciendo"):
  Se deduce de los módulos en los 30 frames superiores del stack:
    ui      user32, gdi, d2d1, dwrite, d3d, dxgi, opengl, msctf o driver
            de video
    dialog  shell32, comdlg32, windows.storage
    net     winhttp, wininet, ws2_32, licencias o protección anticopia
    audio   audioses, mmdevapi, avrt, ksuser, winmm o driver ASIO
    media   Media Foundation
    web     WebView2
    ara     ARA / Melodyne
  En un hilo de audio, la actividad parte siempre con "procesando audio".
Resumen de hilos:
  - Estado de cada hilo según dónde está su IP: wait (ntdll o win32u, es
    decir, en una llamada al sistema), third (código de terceros), host
    (la aplicación) o sys (otro módulo de Windows).
  - Primer módulo que no es de Windows en el stack de cada hilo (se
    escanean hasta 32 frames).
  - Posible deadlock (solo en congelamientos): el hilo principal está en
    wait y otros hilos en wait tienen al culpable en el stack, siempre que
    el culpable sea de nivel 1 o 2.
  - Caída: lista los otros hilos que tienen al culpable en el stack.
  - Congelamiento: lista los hilos que estaban ejecutando código de
    terceros.
Comparación:
  - c.updatedOk: el culpable cambió de versión en dumps posteriores y no
    volvió a ser el culpable.
  - c.updatedStill: el mismo módulo fue culpable con versiones distintas.
  - c.sameVersion: el mismo módulo fue culpable dos o más veces con la
    misma versión.
  - c.warnMany: un mismo aviso aparece en 2 o más dumps.


4b. ANÁLISIS NUEVOS EN 1.2.0
----------------------------
Instrucción que falló (solo x64):
  Decodifica los prefijos, REX, VEX/EVEX, los mapas 1-byte, 0F, 0F38 y
  0F3A, ModRM/SIB/disp (incluido RIP-relativo) y los inmediatos. Con los
  registros del contexto calcula la dirección efectiva.
  Cada registro usado se clasifica como:
    null      menor que 0x10000
    garbage   no canónico
    addr      dirección normal
    ok        dirección normal, pero el fallo es #GP: el valor inválido es
              lo que se leyó de esa memoria
  Hallazgos adicionales:
    - Llamada virtual: call o jmp indirecto con un registro inválido.
    - Llamada virtual con #GP: la tabla de funciones estaba corrupta.
    - Instrucciones de copia (movs, stos, lods): punteros implícitos RSI y
      RDI.
Cambios entre dumps:
  Se recorren los dumps en orden cronológico y se guarda la última versión
  vista de cada módulo de terceros. Un cambio de versión es confiable. "Visto
  por primera vez" depende de los plugins que se usaron en cada sesión.
  Nota c.culpritUpdated: el culpable recién había cambiado de versión en
  ese dump.

5. LÍMITES
----------
- No usa símbolos (.pdb). Sin archivos de módulos cargados, el stack es
  heurístico.
- El desenrollado exacto solo funciona en x64 y se detiene en el primer
  frame de un módulo cuyo archivo no se cargó. Desde ahí sigue un escaneo
  heurístico. No detecta si la IP del primer frame está en un epílogo.
- Los nombres de función salen solo de la tabla de exports. Los plugins
  exportan muy pocas funciones, por lo que lo habitual es ver
  "fn 0x1A2B0+0x12" (inicio de la función según .pdata).
- El decodificador no es un desensamblador completo: las instrucciones
  poco comunes se muestran como "op 0F xx", aunque su operando de memoria
  sí se decodifica. Con EVEX y disp8 comprimido no se calcula la dirección.
- Un archivo de módulo de más de 768 MB se ignora, porque se lee completo
  en memoria.
- Sin ThreadInfoListStream (caso de Cubase), el hilo principal es el
  primero de ThreadList que no se llame watchdog, audio, prefetch, worker
  ni pool.
- Estado "wait": que la IP esté en ntdll o win32u no distingue entre un
  hilo inactivo y uno bloqueado. El "posible deadlock" es una pista, no una
  prueba.
- La vigilancia de carpetas requiere la File System Access API. Firefox
  no la tiene.


7. PRIVACIDAD Y RED
-------------------
- La CSP define connect-src 'none' y default-src 'none': la página no puede
  abrir conexiones ni cargar recursos externos.
- No usa localStorage, cookies ni IndexedDB. El permiso de la carpeta
  vigilada y las notas viven solo en la pestaña abierta.
- El visor no lee nada del equipo por su cuenta: solo los archivos que el
  usuario elige o arrastra.
- Un .dmp contiene memoria del proceso. Compartir el visor no comparte
  ningún dump.


8. HISTORIAL
------------
1.4.0  2026-10-21  Firma de crash; tipo de excepción C++; ranking "Fix first";
       informe HTML autocontenido y Print / PDF; dumps de demostración
       sintéticos; interfaz en alemán. El decodificador de instrucciones ya
       no se aplica a excepciones de software (C++, fast-fail, breakpoint,
       .NET).
1.3.0  2026-10-21  Nuevo nombre: "Crash Dump Analyzer" (archivo
       CrashDumpAnalyzer.html, íconos Icono\CrashDumpAnalyzer.*). Formato de
       notas "crash-dump-analyzer-notes"; se aceptan los archivos de la 1.2.x.
       Sin cambios en el análisis.
1.2.1  2026-10-21  Ícono de la aplicación (favicon y logo SVG embebidos,
       más .ico, .png y .svg en Icono\); panel "Where are the dumps?" con
       rutas genéricas y botón Copy (tarjeta en la pantalla inicial y
       sección desplegable en la barra lateral).
1.2.0  2026-10-21  Decodificación de la instrucción x64 que falló;
       categoría #GP; cambios de módulos entre dumps; notas propias
       (JSON); exportación CSV y JSON; anonimizado de carpetas no
       estándar.
1.1.0  2026-10-20  Memoria del proceso y del sistema; avisos (VST2+VST3,
       binarios antiguos, legacy); actividad; resumen de todos los hilos
       con posible deadlock; línea de tiempo e historial de versiones en la
       comparación; resumen para soporte en inglés con botón de copiar;
       exportación anonimizada; apertura de carpetas (botón y arrastre
       recursivo); vigilancia de carpeta; stack exacto x64 con archivos de
       módulos (exports, .pdata, UNWIND_INFO). Se corrigió el layout de
       MINIDUMP_PROCESS_VM_COUNTERS_2.
1.0.0  2026-10-18  Primera versión.
