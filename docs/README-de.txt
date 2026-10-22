CRASH DUMP ANALYZER 1.6.0 - BENUTZERHANDBUCH (DEUTSCH)
======================================================
(Bis 1.2.1 hieß das Programm "Crash Dump Viewer".)

Offline-Viewer für Windows-Minidumps (.dmp) und macOS-Berichte (.ips / .crash
Absturzberichte, .hang / .spin Hang-Berichte) in einer einzigen HTML-Datei.
Gedacht für DAWs (Cubase, Nuendo usw.), funktioniert aber mit jedem
Windows-Prozess (x64, x86, ARM64) und jeder macOS-Anwendung.

macOS-UNTERSTÜTZUNG = BETA (1.5.0): der .ips/.crash/.hang-Leser wurde nur mit
synthetischen Berichten (den Demo-Dumps) und einer handgeschriebenen
Test-.crash geprüft. Der Autor hat keinen Mac: NICHT mit echten Berichten
und nicht auf einem echten Mac getestet. Tester mit Cubase-.ips/.hang-Dateien
gesucht. Siehe 6c.


1. BEDIENUNG
------------
1. CrashDumpAnalyzer.html (Doppelklick) in Chrome, Edge oder Firefox öffnen.
2. Dumps auf eine dieser Arten laden:
   - "Open crash files": Dateien auswählen (.dmp, .mdmp, .hdmp, .ips,
     .crash, .hang, .spin). Der Typ wird am Inhalt erkannt, nicht an der
     Endung.
   - "Open folder": alle .dmp / .ips / .crash / .hang / .spin des Ordners
     und seiner Unterordner werden geladen.
     Typische Orte (auch im Viewer unter "Where are the dumps?", mit
     Copy-Schaltfläche):
       Cubase / Nuendo / Dorico:
         %USERPROFILE%\Documents\Steinberg\CrashDumps
         (ein deutsches Windows zeigt Documents als "Dokumente")
       Andere Programme (Windows Error Reporting, nur wenn lokale Dumps
       aktiviert sind):
         %LOCALAPPDATA%\CrashDumps
       macOS (jede Anwendung; vom System geschrieben):
         ~/Library/Logs/DiagnosticReports
         /Library/Logs/DiagnosticReports   (alle Benutzer; Administrator)
       Im Finder: Gehe zu > Gehe zum Ordner... und den Pfad einfügen.
       Dieselben Berichte erscheinen in Konsole.app > Absturzberichte.
     Der Windows-Pfad kann unverändert in die Adressleiste des Explorers
     eingefügt werden: Windows ersetzt die Variablen.
   - Dateien oder Ordner auf das Fenster ziehen. Ordner werden rekursiv
     durchsucht. Einschränkung von Chrome/Edge/Brave: bei manchen Pfaden
     (beobachtet mit einem Ordner namens "@Source") kann der Browser die
     abgelegten Elemente nicht lesen (interner EncodingError); seit 1.5.0
     werden einzelne Dateien trotzdem geladen und bei einem Ordner erscheint
     die Meldung „The browser could not read the dropped items…“: „Open
     folder“ verwenden.
   - "Watch folder" (nur Chrome und Edge): einen Ordner einmal wählen.
     "Rescan" lädt die neuen Dumps. Mit "auto (15 s)" wird alle 15 Sekunden
     neu gescannt, solange die Seite offen ist. Die Berechtigung wird nicht
     gespeichert: der Ordner muss bei jedem Öffnen der Seite neu gewählt
     werden.
   Eine bereits geladene Datei (gleicher Name, Größe und Datum) wird
   ignoriert.
3. Einen Dump in der linken Liste wählen. Ab 2 Dumps erscheint "Compare
   all dumps". Das Symbol ⚠ bedeutet, dass der Dump Warnungen oder
   Speicherdruck hat.
4. EN / ES / DE wechselt die Sprache (Englisch, Spanisch, Deutsch).
   Standard ist Englisch.
5. Exportieren:
   - "Export report (.txt)": der gewählte Dump oder der Vergleich.
   - "Export all (.txt)": der Vergleich plus ein Bericht pro Dump.
   - "Export CSV": eine Zeile pro Dump, Trennzeichen ";" (Excel in
     europäischen Gebietsschemas), UTF-8 mit BOM.
   - "Export JSON": strukturierte Zusammenfassung jedes Dumps plus
     Vergleich. Kein roher Prozessspeicher.
   - "Hide memory figures in exports" (neu in 1.5.0, standardmäßig aus):
     lässt alle Speicherwerte (installierter und freier RAM, Commit,
     privater Prozessspeicher und die Befunde, die sie nennen) aus TXT,
     CSV, JSON, HTML/PDF-Bericht und Support-Zusammenfassung weg. Die
     Oberfläche zeigt sie weiterhin.
   - "Anonymise exports" (standardmäßig ein). Ersetzt:
       * \Users\<Name>\ durch \Users\<user>\;
       * den Windows-Benutzernamen (aus den Modulpfaden erkannt) durch
         <user>;
       * jeden Ordner, der kein Standardort von Windows ist, durch
         <folder>\ (z. B. D:\Meine Samples\Kontakt\). Standardorte sind
         C:\Windows, C:\Program Files, C:\Program Files (x86) und
         C:\ProgramData.
       * in macOS-Berichten (1.5.0): /Users/<Name>/ durch /Users/<user>/,
         Ordner außerhalb von /System, /usr, /Library, /Applications,
         /private durch <folder>/, und die Berichtskennungen (incident_id,
         crashReporterKey, sleepWakeUUID, slice_uuid, Anonymous UUID) durch
         <id>.
     Gilt für TXT, CSV, JSON, HTML/PDF und die Support-Zusammenfassung.
   .txt-Dateien werden als UTF-8 mit BOM und CRLF-Zeilenenden gespeichert.
6. Exakter Stack (optional): mit "Load module files" oder per Drag & Drop
   die beteiligten .dll-, .vst3-, .exe- oder .clap-Dateien laden. Sie werden
   nur verwendet, wenn sie derselbe Build sind, den der Dump nennt
   (identischer TimeDateStamp und SizeOfImage). Die Spalte "Module file"
   im Reiter Modules zeigt die Treffer. VST3-Dateien liegen in
   C:\Program Files\Common Files\VST3\<Plugin>.vst3\Contents\x86_64-win\.
   Der ganze .vst3-Ordner kann ebenfalls gezogen werden.

6b. Neu in 1.4.0:
   - "Load demo dumps": lädt 4 synthetische Dumps, die die Seite selbst
     erzeugt, mit fiktiver Software (DemoDAW, Example Synth...) und ohne
     echte Daten. Sie zeigen alle Funktionen: einen wiederholten Bug mit
     derselben Signatur, ein Einfrieren mit möglichem Deadlock, eine
     C++-Ausnahme std::bad_alloc bei wenig RAM, ein als VST2 und VST3
     geladenes Plugin, eine alte Binärdatei und ein Update, das ein Plugin
     behoben hat.
   - "Export report (.html)": eigenständiger Bericht (ohne Skripte, mit
     eigener CSP, helles Thema) des gewählten Dumps oder aller Dumps, wenn
     der Vergleich offen ist. "Anonymise exports" gilt.
   - "Print / PDF": derselbe Bericht über den Druckdialog des Browsers. Für
     ein PDF "Als PDF speichern" oder "Microsoft Print to PDF" wählen.
   - Absturzsignatur: CDA-XXXXXXXX. Berechnet aus
     Typ | Code | Schuldiges Modul | Version | Code-Stelle.
     Gleiche Signatur = gleicher Bug im gleichen Build. Erscheint im
     Urteil, im Vergleich, in der Support-Zusammenfassung, in TXT, CSV und
     JSON.
   - C++-Ausnahmetyp (z. B. std::bad_alloc), aus den MSVC-RTTI-Strukturen
     gelesen. Braucht diesen Speicher im Dump oder die geladene Moduldatei.
   - Vergleich > "Fix first": Rangliste der schuldigen Module mit
     empfohlener Maßnahme.

6c. Neu in 1.5.0: macOS-Berichte (BETA)
   - Formate:
       .ips    macOS 12 oder neuer. Erste Zeile: JSON-Kopf (app_name,
               timestamp, bug_type, os_version, incident_id). Rest:
               JSON-Dokument mit procName, procPath, bundleInfo, exception
               {type, signal, codes, subtype}, termination, asi (Application
               Specific Information), threads [frames, threadState] und
               usedImages [base, size, path, uuid, Version].
               Absturzberichte (bug_type 309, mit threads und usedImages)
               und Hang-Berichte (bug_type 288, siehe .hang) werden
               akzeptiert. Jeder andere Typ wird mit "macOS report type N
               is not supported" abgelehnt.
       .hang   macOS 13 oder neuer (auch .spin oder eine .ips mit bug_type
               288): JSON-Kopf + spindump-Text. Gelesen wird der Abschnitt
               des Zielprozesses (das erste "Process:"), jeder "Thread
               0x..." mit DispatchQueue / Thread name und Sample-Anzahl,
               und aus seinem Aufrufbaum wird der schwerste Zweig (erstes
               Kind auf jeder Ebene; spindump sortiert nach Samples) als
               Stack genommen, vom Blatt zur Wurzel. "Binary Images:"
               liefert die Module. Analyse wie ein Einfrieren (Haupt-Thread,
               möglicher Deadlock) mit "Duration" und "Steps".
       .crash  macOS 10.x / 11 (Text): Process, Path, Version, Code Type,
               Date/Time, OS Version, Crashed Thread, Exception Type,
               Exception Codes, Application Specific Information, Blöcke
               "Thread N Crashed::", Registerzustand und Binary Images.
   - Ergebnis: dieselbe Diagnose wie unter Windows (Urteil, Schuldiger mit
     Vertrauen, Befunde, Maßnahmen, Signatur CDA-XXXXXXXX,
     Thread-Übersicht, VST2+VST3-Warnungen, Aktivität), der Vergleich mit
     "Fix first", Notizen und alle Exporte.
   - Schuldiger: oberster Frame des abgestürzten Threads, wenn er zu einem
     Nicht-System-Modul gehört (hohes Vertrauen); bei Absturz innerhalb von
     macOS der erste Nicht-System-Frame (mittel); wenn nur macOS-Frames
     vorhanden sind (niedrig). Bei nicht abgefangener C++- oder
     Objective-C-Ausnahme (Text in ASI) ist der erste Nicht-System-Frame
     der Schuldige und der Typ wird gezeigt (z. B. std::bad_alloc). Bei
     ungültiger Code-Signatur (termination namespace CODESIGNING) ist das
     Modul schuldig, dessen Pfad im Text vorkommt.
   - Erklärte Ausnahmen: EXC_BAD_ACCESS (mit NULL- / Müll- / nicht
     abgebildeter / Modul-Adresse, wie unter Windows), EXC_CRASH (abort(),
     nicht abgefangene Ausnahme, kill, ungültige Signatur), EXC_BREAKPOINT,
     EXC_BAD_INSTRUCTION, EXC_ARITHMETIC, EXC_GUARD, EXC_RESOURCE,
     EXC_CORPSE_NOTIFY.
   - Neuer Modultyp: Audio Unit (.component). Ebenfalls klassifiziert:
     .vst3, .vst, .clap, .aaxplugin, Core-Audio-HAL-Plug-ins (Audiotreiber),
     PACE/iLok, Melodyne/ARA, GPU-Treiber (AGX, AMDRadeon, AppleIntel),
     Apple-Frameworks (System) und Laufzeiten (libc++, libobjc, libswift,
     libdispatch, libsystem_*).
   - Module werden nach ihrem Bundle benannt (Serum.vst3,
     Kontakt.component), damit sie im Vergleich zu den Windows-Namen passen.
   - Rosetta 2: steht im Bericht translated=true, wird gewarnt und zu
     nativen Apple-Silicon-Builds geraten.
   - Threads: "waiting" = oberster Frame in libsystem_kernel oder
     libsystem_pthread. Frames sind von macOS symbolisiert (Methode "exact
     (symbolicated)"); kein heuristischer Scan, kein Unwinding. Der Reiter
     Threads zeigt Name, Dispatch-Queue und bei Hang-Berichten die
     Sample-Anzahl jedes Threads.
   - Unter macOS nicht verfügbar: Speicherzähler (die .ips hat keine),
     Dekodierung der fehlerhaften Anweisung, Laden von Moduldateien.
     "Watch folder" lädt auch .ips/.crash/.hang.
   - Reiter: "Raw streams" wird durch "Raw report" ersetzt (Kopf,
     exception/termination/ASI wie empfangen, Image-Tabelle mit UUID und
     Architektur). "Exception & registers" zeigt Typ, Signal, Codes, Subtyp,
     ASI, Register (ARM64: x0..x28, fp, lr, sp, pc, cpsr, far, esr; x86-64:
     rax..r15, rip, rflags, cr2) und "VM region info".
   - Demo: "Load demo dumps" lädt jetzt 7 Elemente: die 4 Windows-.dmp und
     3 macOS-Berichte (DemoDAW 1.2.0 auf einem fiktiven Mac):
       5) EXC_BAD_ACCESS in Example Sampler.vst3, Audio-Thread, natives
          Apple Silicon;
       6) SIGABRT durch nicht abgefangene std::bad_alloc aus Example
          Reverb.component (Audio Unit), Anwendung unter Rosetta 2;
       7) .hang: der Haupt-Thread wartet in Example Sampler.vst3 und der
          Lade-Thread des Plugins wartet ebenfalls -> möglicher Deadlock,
          3,00 s, 15 Samples.
     Bei gemischten Windows- und macOS-Dumps warnt der Vergleich, dass
     Namen und Signaturen plattformübergreifend nicht vergleichbar sind.
   - Beim Laden einer Datei, die weder Minidump noch macOS-Bericht ist,
     lautet die Meldung "not a Windows minidump (.dmp) nor a macOS crash
     report (.ips / .crash)".

6d. Neu in 1.6.0: Vertrauen mit Belegen, MIDI, Heap, Muster, KI, Diagramme
   - Vertrauenspunktzahl 0-100 ("Score NN/100" neben hoch / mittel /
     niedrig, das unverändert bleibt) und Karte "Why this confidence" mit
     jedem Beleg und seinem Vorzeichen: verwendete Regel (+20 bis +60),
     Modul auf anderen Threads (+15), Anweisung mit NULL-/ungültigem Zeiger
     (+15), NULL-/ungültige Adresse (+10), Deadlock (+10), bekannter
     C++-Typ (+8), alte Binärdatei / Legacy / VST2+VST3 (+5), Modul in den
     ersten 3 Frames (+5), Speicherdruck (-10), nur Systemcode (-10),
     Heap-Beschädigung (-15), /GS-Cookie (+10), weniger als 3 Frames (-5).
     Begrenzt auf 5..95. Bei 50 oder weniger: „Schuldigen als Hinweis, nicht
     als Urteil behandeln“. Die Punktzahl steht in TXT, HTML/PDF, JSON und
     der Support-Zusammenfassung.
   - Thread-übergreifende Belege (Windows): zeigt der abgestürzte Thread nur
     Windows-Code (Regeln stack / fault-system / none) und ist EIN
     Stufe-1-Plugin auf 2 oder mehr Threads aktiv, wird dieses Plugin mit
     Grund „cross-thread“ (mittleres Vertrauen) zum Schuldigen, Urteil
     „…{module} ist der stärkste Verdächtige: es ist auf N Threads aktiv“.
   - MIDI: Modultyp „MIDI-Treiber / MIDI-Stack“ für Windows MIDI Services
     (Windows.Devices.Midi2.dll, Midi2.*.dll,
     Microsoft.Windows.Devices.Midi2.dll), WinRT-MIDI
     (Windows.Devices.Midi.dll), klassisches MIDI (midimap.dll,
     wdmaud.drv), MIDI-Treiber von Herstellern (Name mit „midi“) und auf dem
     Mac CoreMIDI-Treiber (/Library/Audio/MIDI Drivers). Aktivität
     „MIDI-Verarbeitung“. Maßnahmen: Fehler in Windows MIDI Services -> mit
     dem Dump unter github.com/microsoft/MIDI melden; mit abgezogenem Gerät /
     anderem Port testen; Herstellertreiber aktualisieren. Neue Hersteller:
     Roland, Korg, Akai, Novation, M-Audio, iConnectivity, Microsoft
     (Windows MIDI Services).
   - Heap-Beschädigung (0xC0000374) und fast-fail 3/10/11: ein Befund
     erklärt, dass das bemerkende Modul nicht unbedingt der Verursacher
     ist, eine Maßnahme mit gflags /p /enable <exe> /full (Page Heap) und
     -15 Punkte. Fast-fail 2 (/GS-Cookie): die überlaufende Funktion wird
     zuverlässig lokalisiert (+10).
   - Bekannte Muster (nur öffentliche Fakten), gemeldet wenn das Modul im
     analysierten Stack liegt: PACE/iLok (wrappersist, paceeden, tpkd),
     WebView2, Thesycon-USB-Audio (tusbaudio), ASIO4ALL, alte C-Laufzeiten
     (msvcr70..120), GDI/GDI+, D3D-Shader-Compiler.
   - „Copy prompt for an AI second opinion“ (Reiter Support summary):
     englischer Text mit Anweisungen für einen KI-Assistenten, der
     Zusammenfassung, der Punktzahl mit Belegen, den Befunden, der Ausnahme,
     den ersten 16 Frames ALLER Threads und den Drittanbieter-Modulen.
     Anonymisiert wie jeder Export; Kopieren und Herunterladen (.txt). Die
     Seite verbindet sich weiterhin mit nichts.
   - Diagramme in Diagnosis: „Stack map“ (ein Balken pro Frame des
     analysierten Threads, gefärbt: Schuldiger / Drittanbieter / Anwendung /
     System) und „Thread map“ (eine Box pro relevantem Thread; ⚠
     abgestürzt, ★ Haupt-Thread, ● enthält den Schuldigen; gestrichelte
     Linie = möglicher Deadlock). Inline-SVG, keine Abhängigkeiten, folgt
     dem dunklen Thema.

7. Eigene Notizen ("Import notes" / "Export notes"):
   - Im Reiter Diagnosis erlaubt die Karte "My notes" eine Notiz zum
     Schuldigen oder zu jedem Drittanbieter-Modul, für alle Versionen oder
     nur für die geladene Version.
   - Notizen leben nur, solange die Seite offen ist: "Export notes"
     speichert sie in crash-dump-analyzer-notes.json, "Import notes" lädt sie
     wieder (ohne Duplikate). Mit 1.2.x exportierte Dateien (Format
     "crash-dump-viewer-notes") werden weiterhin akzeptiert.
   - Hat der Schuldige oder ein Modul im Stack Notizen, erscheinen sie in
     der Diagnose und im .txt-Bericht. Im Vergleich wird der Schuldige mit
     📝 markiert.
   - "Clear" löscht keine Notizen.

8. Symbol:
   - Favicon und Logo der Kopfzeile sind als SVG in der HTML eingebettet.
   - Der Ordner Icono\ (icon/ im Repository) enthält:
       CrashDumpAnalyzer.ico      16, 24, 32, 48, 64, 128 und 256 px
       CrashDumpAnalyzer-256.png
       CrashDumpAnalyzer.svg
   - Für eine Verknüpfung mit Symbol (Windows):
       1) Rechtsklick auf CrashDumpAnalyzer.html > Weitere Optionen anzeigen
          > Verknüpfung erstellen.
       2) Eigenschaften der Verknüpfung > Anderes Symbol >
          CrashDumpAnalyzer.ico wählen.

Zum Weitergeben des Viewers genügt die Datei CrashDumpAnalyzer.html.


2. REITER
---------
Diagnosis
  Enthält in dieser Reihenfolge:
  - Urteil und wahrscheinlicher Schuldiger.
  - "What happened": Ausnahme, Zeigeranalyse, Thread, Aktivität, Speicher,
    Thread-Zusammenfassung, möglicher Deadlock und Laufzeit.
  - "What to do".
  - Warnungen (⚠).
  - Speicher zum Zeitpunkt des Dumps.
  - Übersicht aller Threads (nur die nicht untätig wartenden, plus
    Haupt-Thread, fehlerhafter Thread und die mit dem Schuldigen im Stack).
  - Weitere im Stack gesehene Module.
  - Tabelle der Drittanbieter-Module mit Linkdatum.
Support summary
  Englischer Text zum Senden an den Hersteller: Anwendung, OS, Zeit,
  Ausnahme, Modul mit Version, Linkdatum und PDB-Id (UUID unter macOS),
  Thread, Aktivität, Speicher, 24 Frames und Drittanbieter-Module. Mit
  Copy-Schaltfläche; ist die Zwischenablage nicht verfügbar, wird
  document.execCommand verwendet.
Exception & registers
  Ergänzt die Karte "Faulting instruction": ungefähre Disassemblierung der
  fehlerhaften Anweisung, ihre Bytes, die zur Adressberechnung verwendeten
  Register und die resultierende Adresse im Vergleich zur Ausnahme. Die
  Code-Bytes stammen aus dem Dump oder, falls dort fehlend, aus der
  geladenen Moduldatei. macOS: Typ, Signal, Codes, Subtyp, ASI, Register,
  VM region info.
Stack
  Frames mit Spalte "Method": exact (unwound), scan oder unter macOS exact
  (symbolicated).
Threads
  Ergänzt die Spalten State und "First non-Windows module". Steht das
  schuldige Modul im Stack des Threads, wird "culprit" markiert. macOS:
  Name, Dispatch-Queue und Sample-Anzahl (Hang-Berichte).
Modules
  Ergänzt die Spalte "Module file" (✓, wenn die Datei geladen wurde und
  passt).
System & process
  Ergänzt die Speicherkarte. macOS: OS, Architektur, Rosetta, Mac-Modell,
  Bundle-Id, Berichtstyp, Vorfall-Id, Hang-Dauer.
Raw streams / Raw report
  Windows: Stream-Verzeichnis, Kommentare, Parser-Warnungen. macOS: Kopf,
  exception/termination/ASI, Image-Tabelle.
Compare all dumps
  - Zeitleiste: eine Spur pro Anwendungsversion; rot = Absturz, gelb =
    Einfrieren.
  - Vergleichstabelle mit der Version des Schuldigen.
  - Lesart (automatische Notizen).
  - Häufigkeit der Schuldigen.
  - Moduländerungen zwischen Dumps: geänderte Versionen (auch Treiber wie
    NVIDIA oder der Lizenztreiber) und erstmals gesehene Module.
  - Versionen jedes schuldigen Moduls über die Dumps hinweg.
  - Drittanbieter-Module, die in 2 oder mehr Dumps vorkommen.


3. WIE DER SCHULDIGE BESTIMMT WIRD
---------------------------------
Absturz (ExceptionStream vorhanden). Die erste zutreffende Regel gilt:
  a) 0xE06D7363 (MSVC-C++-Ausnahme): ExceptionInformation[3] ist die Basis
     des werfenden Moduls.                                     Hohes Vertrauen.
  b) Die Fehleradresse liegt in einem Modul, das weder Windows noch
     Laufzeit ist.                                              Hohes Vertrauen.
  c) Die Fehleradresse liegt in einem entladenen Modul.         Hohes Vertrauen.
  d) Der Fehler trat in Windows oder der Laufzeit auf: das erste
     Nicht-Windows-Modul im Stack wird genommen.                Mittel.
  e) Nur Windows-Code erscheint.                                Niedrig.
Einfrieren (kein ExceptionStream und der Dateiname enthält freeze, hang,
deadlock oder watchdog; sonst gilt der Dump als Snapshot):
  Das erste Modul der Stufe 1 (Plugin, Audiotreiber, ARA, Kopierschutz oder
  Drittanbieter) im Stack des Haupt-Threads wird genommen; sonst das erste
  der Stufe 2 (Herstellerkomponente, WebView oder Grafiktreiber). Mittleres
  Vertrauen für Stufe 1, niedriges für Stufe 2.
macOS: siehe 6c.

ACCESS_VIOLATION (0xC0000005 / 0xC0000006):
  Operation (ExceptionInformation[0]): 0 Lesen, 1 Schreiben, 8 Ausführen
  (DEP). Die Zugriffsadresse wird so klassifiziert:
    null      kleiner als 0x10000
    garbage   0xFFFFFFFFFFFFFFFF oder nicht kanonisch auf x64
    unloaded  innerhalb eines bereits entladenen Moduls
    module    innerhalb eines geladenen Moduls
    gp        0xFFFFFFFFFFFFFFFF: Windows kennt die Adresse nicht
              (General-Protection-Fehler, nicht kanonischer Zeiger)
    unmapped  alles andere
    exec      Operation 8
0xC0000409: der FAST_FAIL_*-Code stammt aus ExceptionInformation[0].


4. ANALYSEN SEIT 1.1.0
----------------------
Speicher (Streams ProcessVmCounters und SystemMemoryInfo):
  Zeigt den privaten Prozessspeicher, Working Set und Spitze,
  Auslagerungsdatei-Nutzung, installierten und verfügbaren RAM und das
  System-Commit gegen sein Limit.
  Warnschwellen:
    - Freier RAM unter 8 % oder unter 1,5 GiB.
    - Commit bei 90 % des Limits oder mehr.
    - Prozess nutzt 60 % des RAM oder mehr.
  Jede Warnung ergänzt eine Maßnahme (Last reduzieren oder
  Auslagerungsdatei vergrößern).
Warnungen:
  - VST2 + VST3: dasselbe Plugin in beiden Formaten geladen. Namen werden
    normalisiert verglichen (ohne Endung, Leerzeichen, "x64" oder "64bit").
  - Alte Binärdatei: PE-Linkdatum mehr als 6 Jahre vor dem Dump. Ignoriert,
    wenn das Datum außerhalb des Bereichs zwischen dem Jahr 2000 und dem
    Dump-Datum liegt.
  - Legacy: nur Plugins, die der Hersteller selbst als Legacy führt. Heute:
    Stylus RMX (spectrasonics.net/instruments/stylusrmx.html).
Aktivität ("was es gerade tat"):
  Aus den Modulen der obersten 30 Stack-Frames abgeleitet:
    ui      user32, gdi, d2d1, dwrite, d3d, dxgi, opengl, msctf oder
            Grafiktreiber (macOS: AppKit, CoreGraphics, QuartzCore...)
    dialog  shell32, comdlg32, windows.storage
    net     winhttp, wininet, ws2_32, Lizenzierung oder Kopierschutz
    audio   audioses, mmdevapi, avrt, ksuser, winmm oder ASIO-Treiber
            (macOS: CoreAudio, AudioToolbox, CoreMIDI)
    media   Media Foundation (macOS: AVFoundation, CoreMedia)
    web     WebView2
    ara     ARA / Melodyne
  Auf einem Audio-Thread beginnt die Aktivität immer mit "Audio wird
  verarbeitet".
Thread-Übersicht:
  - Zustand jedes Threads nach der Lage seines IP: wait (ntdll oder
    win32u, d. h. in einem Systemaufruf; macOS: libsystem_kernel /
    libsystem_pthread), third (Drittanbieter-Code), host (die Anwendung)
    oder sys (anderes OS-Modul).
  - Erstes Nicht-OS-Modul im Stack jedes Threads (bis zu 32 Frames).
  - Möglicher Deadlock (nur bei Einfrieren): der Haupt-Thread ist in wait
    und andere wartende Threads haben den Schuldigen im Stack, sofern der
    Schuldige Stufe 1 oder 2 ist.
  - Absturz: listet die anderen Threads mit dem Schuldigen im Stack.
  - Einfrieren: listet die Threads, die Drittanbieter-Code ausführten.
Vergleich:
  - c.updatedOk: der Schuldige hat in späteren Dumps die Version gewechselt
    und war nicht mehr schuldig.
  - c.updatedStill: dasselbe Modul war mit verschiedenen Versionen
    schuldig.
  - c.sameVersion: dasselbe Modul war zwei- oder mehrmals mit derselben
    Version schuldig.
  - c.warnMany: dieselbe Warnung erscheint in 2 oder mehr Dumps.


4b. ANALYSEN SEIT 1.2.0
-----------------------
Fehlerhafte Anweisung (nur x64):
  Dekodiert Präfixe, REX, VEX/EVEX, die Maps 1-Byte, 0F, 0F38 und 0F3A,
  ModRM/SIB/disp (inklusive RIP-relativ) und Immediates. Mit den
  Kontextregistern wird die effektive Adresse berechnet.
  Jedes verwendete Register wird klassifiziert als:
    null      kleiner als 0x10000
    garbage   nicht kanonisch
    addr      normale Adresse
    ok        normale Adresse, aber der Fehler ist ein #GP: der ungültige
              Wert ist das, was aus diesem Speicher gelesen wurde
  Zusätzliche Befunde:
    - Virtueller Aufruf: indirekter call oder jmp mit ungültigem Register.
    - Virtueller Aufruf mit #GP: die Funktionstabelle war beschädigt.
    - Kopieranweisungen (movs, stos, lods): implizite Zeiger RSI und RDI.
Änderungen zwischen Dumps:
  Die Dumps werden chronologisch durchlaufen und die zuletzt gesehene
  Version jedes Drittanbieter-Moduls gemerkt. Ein Versionswechsel ist
  zuverlässig. "Erstmals gesehen" hängt davon ab, welche Plugins in jeder
  Sitzung benutzt wurden. Hinweis c.culpritUpdated: der Schuldige hatte in
  diesem Dump gerade die Version gewechselt.

5. GRENZEN
----------
- Es werden keine Symbole (.pdb) verwendet. Ohne geladene Moduldateien ist
  der Stack heuristisch.
- Exaktes Unwinding funktioniert nur auf x64 und endet am ersten Frame
  eines Moduls, dessen Datei nicht geladen wurde. Ab dort folgt ein
  heuristischer Scan. Ein IP im Epilog des ersten Frames wird nicht
  erkannt.
- Funktionsnamen stammen nur aus der Exporttabelle. Plugins exportieren
  sehr wenige Funktionen, daher sieht man meist "fn 0x1A2B0+0x12"
  (Funktionsbeginn laut .pdata).
- Der Decoder ist kein vollständiger Disassembler: seltene Anweisungen
  erscheinen als "op 0F xx", ihr Speicheroperand wird aber dekodiert. Bei
  EVEX und komprimiertem disp8 wird die Adresse nicht berechnet.
- Eine Moduldatei über 768 MB wird ignoriert, weil sie komplett in den
  Speicher gelesen wird.
- Ohne ThreadInfoListStream (Fall Cubase) ist der Haupt-Thread der erste
  in ThreadList, der nicht watchdog, audio, prefetch, worker oder pool
  heißt.
- Zustand "wait": ein IP in ntdll oder win32u unterscheidet nicht zwischen
  einem untätigen und einem blockierten Thread. "Möglicher Deadlock" ist
  ein Hinweis, kein Beweis.
- Ordnerüberwachung braucht die File System Access API. Firefox hat sie
  nicht.
- Das Ablegen eines Ordners kann in Chrome/Edge/Brave je nach Pfad
  scheitern (webkitGetAsEntry liefert EncodingError). Einzelne Dateien
  funktionieren; für den Ordner „Open folder“ verwenden.
- macOS (Beta): nicht mit echten Berichten geprüft. In .hang-Dateien
  werden nur der Zielprozess und der schwerste Zweig jedes Threads gelesen
  (nicht der ganze Baum). Funktionsnamen setzen einen symbolisierten
  Bericht voraus (normal bei Apple-Frameworks; Plugins zeigen meist nur
  Modul+Offset). Herstellerregeln werden auf dem Pfad mit "/" zu "\"
  geprüft, daher ist die Herstellererkennung auf dem Mac schwächer als
  unter Windows.


7. DATENSCHUTZ UND NETZWERK
---------------------------
- Die CSP setzt connect-src 'none' und default-src 'none': die Seite kann
  weder Verbindungen öffnen noch externe Ressourcen laden.
- Kein localStorage, keine Cookies, kein IndexedDB. Die Berechtigung des
  überwachten Ordners und die Notizen leben nur im offenen Tab.
- Der Viewer liest nichts selbstständig vom Rechner: nur die Dateien, die
  der Benutzer wählt oder zieht.
- Ein .dmp enthält Prozessspeicher. Den Viewer weiterzugeben gibt keinen
  Dump weiter.


8. VERLAUF
----------
1.6.0  2026-10-22  Vertrauenspunktzahl 0-100 mit Belegen und Warnung „Hinweis,
       kein Urteil“; thread-übergreifende Belegregel; Modultyp MIDI (Windows
       MIDI Services, CoreMIDI, Treiber) mit Maßnahmen; Heap-Beschädigung /
       fast-fail (Page Heap, /GS-Cookie); Tabelle bekannter Muster;
       KI-Zweitmeinungs-Prompt; SVG-Diagramme für Stack und Threads.
       Angestoßen durch den Steinberg-Forum-Thread (Psychlist1972 /
       Microsoft). Keine Parser-Änderungen; dieselben 7 Schuldigen.
1.5.0  2026-10-22  macOS (BETA): .ips- (macOS 12+) und .crash-Berichte (macOS
       10.x/11) in derselben HTML, mit derselben Diagnose, Signatur,
       Vergleich, Fix first, Notizen und Exporten; Modultyp Audio Unit;
       EXC_*-Ausnahmen; nicht abgefangene C++/ObjC-Ausnahmen aus ASI;
       ungültige Code-Signatur; Rosetta-2-Warnung; Anonymisierung von
       /Users/<Name>/ und Berichtskennungen; 2 macOS-Demo-Berichte;
       macOS-Pfade in "Where are the dumps?"; Reiter "Raw report".
       Hang-Berichte .hang / .spin (spindump) mit Dauer, Samples pro Thread
       und Deadlock-Erkennung. Reiter Threads mit Queue und Samples auf dem
       Mac. Option "Hide memory figures in exports". Korrektur des
       Modulselektors von "My notes" im dunklen Thema (color-scheme +
       <select>-Stile). 67 neue EN/ES/DE-Schlüssel (441 pro Sprache). Mehr
       Kommentare im UI-Block; CORE-Abschnitte neu nummeriert (1 bis 13).
       Test mit synthetischem x86-Dump in core_test.js. Vollständige
       Handbücher auf Englisch und Deutsch (docs/README-en.txt,
       README-de.txt).
1.4.1  2026-10-21  Korrektur: das Favicon wurde nicht angezeigt. Die Daten-URI
       des Symbols enthielt unkodierte Anführungszeichen und '#': das
       Anführungszeichen schloss das href-Attribut nach 32 Zeichen. Das SVG
       ist jetzt vollständig kodiert. Keine weiteren Änderungen.
1.4.0  2026-10-21  Absturzsignatur; C++-Ausnahmetyp; Rangliste "Fix first";
       eigenständiger HTML-Bericht und Print / PDF; synthetische
       Demo-Dumps; deutsche Oberfläche. Der Anweisungsdecoder läuft nicht
       mehr bei Software-Ausnahmen (C++, fast-fail, breakpoint, .NET).
1.3.0  2026-10-21  Neuer Name: "Crash Dump Analyzer" (Datei
       CrashDumpAnalyzer.html, Symbole CrashDumpAnalyzer.*). Notizformat
       "crash-dump-analyzer-notes"; 1.2.x-Dateien werden weiterhin
       akzeptiert. Keine Analyseänderungen.
1.2.1  2026-10-21  Anwendungssymbol (eingebettetes Favicon und SVG-Logo plus
       .ico-, .png- und .svg-Dateien); Panel "Where are the dumps?" mit
       generischen Pfaden und Copy-Schaltfläche (Karte auf dem Startbild und
       ausklappbarer Abschnitt in der Seitenleiste).
1.2.0  2026-10-21  Dekodierung der fehlerhaften x64-Anweisung; Kategorie #GP;
       Moduländerungen zwischen Dumps; eigene Notizen (JSON); CSV- und
       JSON-Export; Anonymisierung nicht standardmäßiger Ordner.
1.1.0  2026-10-20  Prozess- und Systemspeicher; Warnungen (VST2+VST3, alte
       Binärdateien, Legacy); Aktivität; Übersicht aller Threads mit
       möglichem Deadlock; Zeitleiste und Versionsverlauf im Vergleich;
       englische Support-Zusammenfassung mit Kopierschaltfläche;
       anonymisierter Export; Ordner öffnen (Schaltfläche und rekursives
       Drag & Drop); Ordnerüberwachung; exakter x64-Stack mit Moduldateien
       (Exports, .pdata, UNWIND_INFO). Layout von
       MINIDUMP_PROCESS_VM_COUNTERS_2 korrigiert.
1.0.0  2026-10-18  Erste Version.
