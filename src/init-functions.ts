class InitFunction {
  constructor(priority, symbolIndex) {
    this.priority = priority;
    this.symbolIndex = symbolIndex;
  }
}

class InitFunctions {
  constructor(functions) {
    this.functions = functions;
  }
}

class WasmIO {
  static readInitFunction(readable) {
    const priority = readable.readUInt32();
    const symbolIndex = readable.readUInt32();
    return new InitFunction(priority, symbolIndex);
  }

  static writeInitFunction(writable, x) {
    writable.writeUInt32(x.priority);
    writable.writeUInt32(x.symbolIndex);
  }

  static readInitFunctions(readable) {
    const functions = readable.readVector(WasmIO.readInitFunction);
    return new InitFunctions(functions);
  }

  static writeInitFunctions(writable, x) {
    writable.writeVector(x.functions, WasmIO.writeInitFunction);
  }
}
