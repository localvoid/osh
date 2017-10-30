import { expect } from "iko";
import { Context, TChildren, context, component, renderToString } from "osh";
import { COMMENT_CONFIG, blockComment, docComment } from "../src/comment";
import {
  INDENT_LEVEL, INDENT_STRING, PADDING, getIndentLevel, getIndentString, getPadding, isLine, indent, line,
} from "../src/line";

const CONFIG = {
  inlineStart: "inline-start",
  inlineEnd: "inline-end",
  blockStart: "block-start",
  blockEnd: "block-end",
  blockContinue: "block-continue",
  docStart: "doc-start",
  docEnd: "doc-end",
  docContinue: "doc-continue",
  start: "start",
};

function emit(...children: TChildren[]): string {
  return renderToString(
    context(
      {
        [COMMENT_CONFIG]: CONFIG,
      },
      ...children,
    ),
  );
}

describe("src/line.ts", () => {
  describe("context getters", () => {
    describe("getIndentLevel", () => {
      it("default", () => {
        expect(getIndentLevel({})).toBe(0);
      });

      it("1", () => {
        expect(getIndentLevel({ [INDENT_LEVEL]: 1 })).toBe(1);
      });
    });

    describe("getIndentString", () => {
      it("default", () => {
        expect(getIndentString({})).toBe("  ");
      });

      it("tab", () => {
        expect(getIndentString({ [INDENT_STRING]: "\t" })).toBe("\t");
      });
    });

    describe("getPadding", () => {
      it("default", () => {
        expect(getPadding({})).toBe("");
      });

      it("tab", () => {
        expect(getPadding({ [PADDING]: "\t" })).toBe("\t");
      });
    });

    describe("isLine", () => {
      it("out of line", () => {
        let t: boolean | undefined;
        emit(component((ctx: Context) => {
          t = isLine(ctx);
          return "";
        }));
        expect(t).notToBeUndefined().toBe(false);
      });

      it("inline", () => {
        let t: boolean | undefined;
        emit(line(component((ctx: Context) => {
          t = isLine(ctx);
          return "";
        })));
        expect(t).notToBeUndefined().toBe(true);
      });
    });
  });

  describe("indent", () => {
    it("increase indentation level", () => {
      let indentLevel: number | undefined;
      emit(indent(component((ctx: Context) => {
        indentLevel = getIndentLevel(ctx);
        return null;
      })));
      expect(indentLevel).notToBeUndefined().toBe(1);
    });

    it("increase indentation level twice", () => {
      let indentLevel: number | undefined;
      emit(indent(indent(component((ctx: Context) => {
        indentLevel = getIndentLevel(ctx);
        return null;
      }))));
      expect(indentLevel).notToBeUndefined().toBe(2);
    });
  });

  describe("line", () => {
    describe("basic", () => {
      it("empty", () => {
        expect(emit(line())).toBe("\n");
      });

      it("abc", () => {
        expect(emit(line("abc"))).toBe("abc\n");
      });

      it("trimRight", () => {
        expect(emit(line("abc  "))).toBe("abc\n");
      });

      it("indent", () => {
        expect(emit(indent(line("abc")))).toBe("  abc\n");
      });

      it("padding", () => {
        expect(emit(context({
          [PADDING]: "padding",
        }, line("|abc")))).toBe("padding|abc\n");
      });
    });

    describe("block comment", () => {
      it("single line", () => {
        expect(emit(blockComment(line("|")))).toBe("block-startblock-continue|\nblock-end");
      });
    });

    describe("doc comment", () => {
      it("single line", () => {
        expect(emit(docComment(line("|")))).toBe("doc-startdoc-continue|\ndoc-end");
      });
    });
  });
});
