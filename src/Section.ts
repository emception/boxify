import { WasmBuffer } from './WasmIO.js';
import { CustomSectionContent, Section } from './Section.js';

const wasm_transform = {};

wasm_transform.WasmIO = class {
  static read(readable) {}

  static write(writable, x) {}
};

wasm_transform.WasmIO.read = function (readable) {
  return new CustomSectionContent(
    readable.read_string(),
    readable.read_bytes()
  );
};

wasm_transform.WasmIO.write = function (writable, x) {
  writable.write_string(x.name);
  writable.write_bytes(x.buffer);
};

wasm_transform.WasmIO.read = function (readable) {
  return new Section(
    readable.read_uint8(),
    readable.read_string_view()
  );
};

wasm_transform.WasmIO.write = function (writable, x) {
  writable.write_uint8(x.id);
  writable.write_padded_uint32(x.buffer.length);
  writable.write_bytes(x.buffer);
};

export default wasm_transform;
