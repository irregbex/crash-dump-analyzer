# Genera pe_ref.json (referencia independiente con la librería pefile) para pe_unwind_test.js.
# Uso: python make_pe_ref.py modulo_x64.dll > pe_ref.json      (requiere: pip install pefile)
import pefile, sys, json
pe = pefile.PE(sys.argv[1])
ex = sorted([(e.address, e.name.decode()) for e in pe.DIRECTORY_ENTRY_EXPORT.symbols if e.name]) if hasattr(pe, 'DIRECTORY_ENTRY_EXPORT') else []
funcs = []
for rf in pe.DIRECTORY_ENTRY_EXCEPTION:
    ui = rf.unwindinfo
    if ui is None or ui.FrameRegister or (ui.Flags & 4):
        continue  # solo funciones sin registro de frame ni cadena: el tamaño de frame se calcula directo
    size, ok, pushes = 0, True, 0
    for c in ui.UnwindCodes:
        n = type(c).__name__
        if n == 'PrologEpilogOpPushReg': size += 8; pushes += 1
        elif n in ('PrologEpilogOpAllocSmall', 'PrologEpilogOpAllocLarge'): size += c.get_alloc_size()
        elif n in ('PrologEpilogOpSaveReg', 'PrologEpilogOpSaveRegFar', 'PrologEpilogOpSaveXMM', 'PrologEpilogOpSaveXMMFar'): pass
        else: ok = False
    if ok:
        funcs.append({'begin': rf.struct.BeginAddress, 'end': rf.struct.EndAddress, 'prolog': ui.SizeOfProlog, 'size': size, 'pushes': pushes})
print(json.dumps({'ts': pe.FILE_HEADER.TimeDateStamp, 'soi': pe.OPTIONAL_HEADER.SizeOfImage, 'nexp': len(ex), 'exp': ex,
                  'npdata': len(pe.DIRECTORY_ENTRY_EXCEPTION), 'funcs': funcs}))
