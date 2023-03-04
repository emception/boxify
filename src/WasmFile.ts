import WasmFile from "./WasmFile.js";
import WasmBuffer from "./WasmBuffer.js";
import WasmIO from "./WasmIO.js";

class wasm_transform {
  static read(readable) {
    if (
      readable.readUInt8() != 0 ||
      readable.readChar() != "a" ||
      readable.readChar() != "s" ||
      readable.readChar() != "m" ||
      readable.readUInt8() != 1 ||
      readable.readUInt8() != 0 ||
      readable.readUInt8() != 0 ||
      readable.readUInt8() != 0
    ) {
      throw new Error("Not a WebAssembly file.");
    }

    const sections = [];
    while (!readable.eof()) {
      const section = readable.readSection();
      sections.push(section);
    }

    return new WasmFile(sections);
  }

  static write(writable, x) {
    writable.writeUInt8(0);
    writable.writeChar("a");
    writable.writeChar("s");
    writable.writeChar("m");
    writable.writeUInt8(1);
    writable.writeUInt8(0);
    writable.writeUInt8(0);
    writable.writeUInt8(0);

    for (const section of x.sections) {
      writable.write(section);
    }
  }
}

WasmIO.register(WasmFile, wasm_transform);
export default wasm_transform;
