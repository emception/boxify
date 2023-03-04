class Buffer {
  constructor(buffer) {
    this.m_data = buffer;
  }

  static fromStringView(view) {
    return new Buffer(view);
  }

  static fromString(str) {
    return new Buffer(str);
  }

  view() {
    return this.m_data;
  }

  buffer() {
    return this.m_data instanceof String ? this.m_data : null;
  }

  owned() {
    return this.m_data instanceof String;
  }

  own() {
    if (!this.owned()) {
      const v = this.view();
      this.m_data = new String(v);
    }
    return this;
  }

  size() {
    return this.view().length;
  }

  slice(start, length) {
    return new Buffer(this.view().substr(start, length));
  }

  *[Symbol.iterator]() {
    yield* this.view();
  }

  [Symbol.toStringTag]() {
    return 'Buffer';
  }
}
