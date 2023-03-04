import { WasmIO } from "./WasmIO.js";
import { WasmBuffer } from "./WasmBuffer.js";
import { Section } from "./Section.js";

class LinkingSection {
    constructor(subsections) {
        this.subsections = subsections;
    }

    static read(readable) {
        const version = readable.readUint32();
        if (version !== 2) {
            throw new Error("linking section is not on version 2");
        }

        const subsections = [];
        while (!readable.eof()) {
            const subsection = readable.read(Section);
            subsections.push(subsection);
        }

        return new LinkingSection(subsections);
    }

    static write(writable, x) {
        writable.writeUint32(2);
        for (const subsection of x.subsections) {
            writable.write(subsection);
        }
    }
}

WasmIO.registerReadFunction(LinkingSection, LinkingSection.read);
WasmIO.registerWriteFunction(LinkingSection, LinkingSection.write);

export { LinkingSection };
