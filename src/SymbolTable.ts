// Import necessary modules
import { SymbolFlags, SymbolKind, SymbolInformation, SymbolTable } from "./SymbolTable.js";
import { WasmIO } from "./WasmIO.js";
import { WasmBuffer } from "./WasmBuffer.js";

// Define wasm_transform namespace
const wasm_transform = {};

// Define read and write methods for SymbolFlags
wasm_transform.WasmIO_SymbolFlags_read = (readable) => {
const flags = readable.readUint32();
return new SymbolFlags(
(flags & 0x01) !== 0,
(flags & 0x02) !== 0,
(flags & 0x04) !== 0,
(flags & 0x10) !== 0,
(flags & 0x20) !== 0,
(flags & 0x40) !== 0,
(flags & 0x80) !== 0,
);
};

wasm_transform.WasmIO_SymbolFlags_write = (writable, x) => {
writable.writeUint32(
(x.weak ? 0x01 : 0) |
(x.local ? 0x02 : 0) |
(x.hidden ? 0x04 : 0) |
(x.undefined ? 0x10 : 0) |
(x.exported ? 0x20 : 0) |
(x.explicit_name ? 0x40 : 0) |
(x.no_strip ? 0x80 : 0)
);
};

// Define read and write methods for SymbolKind
wasm_transform.WasmIO_SymbolKind_read = (readable) => {
const kind = readable.readUint8();
return SymbolKind[kind];
};

wasm_transform.WasmIO_SymbolKind_write = (writable, x) => {
const kindValue = Object.values(SymbolKind).indexOf(x);
writable.writeUint8(kindValue);
};

// Define read and write methods for SymbolInformation
wasm_transform.WasmIO_SymbolInformation_read = (readable) => {
const kind = readable.read(SymbolKind);
const flags = readable.read(SymbolFlags);
let index, name, offset, size;

switch (kind) {
    case SymbolKind.Function:
    case SymbolKind.Global:
    case SymbolKind.Event:
    case SymbolKind.Table:
        index = readable.readUint32();
        if (flags.explicit_name || !flags.undefined) {
            name = readable.read();
        }
        break;
    case SymbolKind.Data:
        name = readable.read();
        if (!flags.undefined) {
            index = readable.readUint32();
            offset = readable.readUint32();
            size = readable.readUint32();
        }
        break;
    case SymbolKind.Section:
        index = readable.readUint32();
        break;
    default:
        throw new Error("Unknown symbol type.");
}

return new SymbolInformation(kind, flags, index, name, offset, size);
};

wasm_transform.WasmIO_SymbolInformation_write = (writable, x) => {
writable.write(x.kind);
writable.write(x.flags);

switch (x.kind) {
    case SymbolKind.Function:
    case SymbolKind.Global:
    case SymbolKind.Event:
    case SymbolKind.Table:
        if (!x.index) throw new Error("Expected symbol to have an index");
        writable.writeUint32(x.index);
        if (x.flags.explicit_name || !x.flags.undefined) {
            if (!x.name) throw new Error("Expected symbol to have a name");
            writable.write(x.name);
        }
        break;
    case SymbolKind
