import { Context, TChildren, context, component, renderToString } from "osh";
import { COMMENT_CONFIG, blockComment, docComment } from "../comment";
import {
  INDENT_LEVEL, INDENT_STRING, PADDING, getIndentLevel, getIndentString, getPadding, isLine, indent, line,
} from "../line";

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
      test("default", () => {
        expect(getIndentLevel({})).toBe(0);
      });

      test("1", () => {
        expect(getIndentLevel({ [INDENT_LEVEL]: 1 })).toBe(1);
      });
    });

    describe("getIndentString", () => {
      test("default", () => {
        expect(getIndentString({})).toBe("  ");
      });

      test("tab", () => {
        expect(getIndentString({ [INDENT_STRING]: "\t" })).toBe("\t");
      });
    });

    describe("getPadding", () => {
      test("default", () => {
        expect(getPadding({})).toBe("");
      });

      test("tab", () => {
        expect(getPadding({ [PADDING]: "\t" })).toBe("\t");
      });
    });

    describe("isLine", () => {
      test("out of line", () => {
        let t: boolean | undefined;
        emit(component((ctx: Context) => {
          t = isLine(ctx);
          return "";
        }));
        expect(t).toBe(false);
      });

      test("inline", () => {
        let t: boolean | undefined;
        emit(line(component((ctx: Context) => {
          t = isLine(ctx);
          return "";
        })));
        expect(t).toBe(true);
      });
    });
  });

  describe("indent", () => {
    test("increase indentation level", () => {
      let indentLevel: number | undefined;
      emit(indent(component((ctx: Context) => {
        indentLevel = getIndentLevel(ctx);
        return null;
      })));
      expect(indentLevel).toBe(1);
    });

    test("increase indentation level twice", () => {
      let indentLevel: number | undefined;
      emit(indent(indent(component((ctx: Context) => {
        indentLevel = getIndentLevel(ctx);
        return null;
      }))));
      expect(indentLevel).toBe(2);
    });
  });

  describe("line", () => {
    describe("basic", () => {
      test("empty", () => {
        expect(emit(line())).toBe("\n");
      });

      test("abc", () => {
        expect(emit(line("abc"))).toBe("abc\n");
      });

      test("trimRight", () => {
        expect(emit(line("abc  "))).toBe("abc\n");
      });

      test("indent", () => {
        expect(emit(indent(line("abc")))).toBe("  abc\n");
      });

      test("padding", () => {
        expect(emit(context({
          [PADDING]: "padding",
        }, line("|abc")))).toBe("padding|abc\n");
      });
    });

    describe("block comment", () => {
      test("single line", () => {
        expect(emit(blockComment(line("|")))).toBe("block-startblock-continue|\nblock-end");
      });
    });

    describe("doc comment", () => {
      test("single line", () => {
        expect(emit(docComment(line("|")))).toBe("doc-startdoc-continue|\ndoc-end");
      });
    });
  });
});
