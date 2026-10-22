<p align="center"><img src="icon/CrashDumpAnalyzer-256.png" width="96" alt=""></p>

<h1 align="center">Crash Dump Analyzer</h1>

<p align="center">Find out which plugin or driver crashed your DAW — from the <code>.dmp</code> files it leaves behind.<br>
One HTML file · runs 100% offline in your browser · nothing is uploaded.</p>

<p align="center">
<a href="https://YOUR-GITHUB-USERNAME.github.io/crash-dump-analyzer/"><b>▶ Try it online</b></a> ·
<a href="../../releases/latest"><b>⬇ Download</b></a>
</p>

![Diagnosis of a crash (demo dump)](screenshots/diagnosis.png)

> The screenshots use the **built-in demo dumps**: fictional software ("DemoDAW", "Example Synth"), no real data.

## Why

When Cubase (or Nuendo, Dorico, or any Windows program) crashes, it writes a minidump
(`.dmp`) — for Steinberg apps in `%USERPROFILE%\Documents\Steinberg\CrashDumps`.
Those files are unreadable without a debugger such as WinDbg. Crash Dump Analyzer reads them and
explains, in plain language, what crashed and what to do about it.

## What it shows

- **The culprit**: the plugin (VST3/VST2/CLAP/AAX), audio/ASIO driver, graphics driver,
  application component or Windows module, with a confidence level and the reason.
- **What happened**: exception type, the exact faulting x64 instruction and which register held
  the bad pointer (e.g. `mov rax,[rcx+0x18]` with `RCX = 0` → NULL pointer), the C++ exception
  type (`std::bad_alloc`…), the thread (UI, audio, worker) and what it was doing.
- **Freezes**: what the main thread was stuck in, an overview of all threads and hints of a
  possible deadlock.
- **Memory** at the moment of the crash: process memory, free RAM, Windows commit vs. limit.
- **Warnings**: the same plugin loaded as VST2 and VST3, very old plugin binaries, plugins the
  vendor lists as legacy.
- **Crash signature** (`CDA-XXXXXXXX`): the same signature means the same bug in the same build.
- **Many dumps at once**: timeline, *fix first* ranking, repeat offenders, plugin versions that
  changed between crashes.
- **For support tickets**: an English summary ready to paste, a printable report / PDF, and
  TXT, CSV, JSON and self-contained HTML exports — anonymised by default (user name and personal
  folders removed).
- **Personal notes** per plugin (saved to / loaded from a `.json` file).
- Optional **exact x64 stack unwinding** if you also load the `.dll` / `.vst3` / `.exe` files
  involved (only exact build matches are used).
- Interface in **English, Spanish and German**.

![Comparison of several dumps](screenshots/comparison.png)

## How to use

1. Open `CrashDumpAnalyzer.html` (online link above, or download it and double-click).
   Chrome or Edge recommended (tested in Chromium). Firefox is not tested yet; "Watch folder"
   needs Chrome or Edge.
2. Drag your `.dmp` files or a whole folder onto the page — or press **Load demo dumps** to try it.
3. Read the **Diagnosis** tab; with two or more dumps use **Compare all dumps**.
4. Use **Support summary**, **Print / PDF** or **Export report (.html)** to send the details to
   the plugin developer.

## Privacy

- The page sets a Content-Security-Policy with `connect-src 'none'`: it **cannot** open network
  connections, even when opened from GitHub Pages. Files are read locally with the File API.
- No cookies, no localStorage, no analytics. Notes and the watched-folder permission live only
  in the open tab.
- Exports are anonymised by default. A `.dmp` file itself contains process memory: be careful
  when sharing the dump, not the report.

## Limitations

- Windows minidumps only (x64 fully; x86 and ARM64 basic). macOS crash reports are not supported.
- No debug symbols: code locations are *module + offset*, not function names. Stack frames come
  from a heuristic scan unless module files are loaded.
- A diagnostic aid, not a fix. Not affiliated with Steinberg or any plugin vendor.

## For developers

Everything is in `CrashDumpAnalyzer.html`: a DOM-free **CORE** block (minidump parser, analyzer,
x64 decoder and unwinder, report builders, demo-dump generator) between
`/*CORE-BEGIN*/` and `/*CORE-END*/`, and a **UI** block. No build step, no dependencies.

```
node tests/core_test.js CrashDumpAnalyzer.html            # demo dumps only
node tests/core_test.js CrashDumpAnalyzer.html <folder>    # plus your own .dmp files
```

Technical documentation (Spanish): [`docs/`](docs/) — structure offsets, algorithms and rules.

## License

[MIT](LICENSE)
