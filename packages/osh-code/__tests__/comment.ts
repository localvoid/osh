import { expect } from "iko";
import { Context, TChildren, context, component, renderToString } from "osh";
import {
  COMMENT_CONFIG, BLOCK_COMMENT, REMOVE_COMMENTS, BlockCommentType, getCommentConfig, comment, blockComment, docComment,
} from "../src/comment";

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
  return renderToString(context({ [COMMENT_CONFIG]: CONFIG }, ...children));
}

function emitWithoutComments(...children: TChildren[]): string {
  return renderToString(context({
    [COMMENT_CONFIG]: CONFIG,
    [REMOVE_COMMENTS]: true,
  }, ...children));
}

describe("src/comment.ts", () => {
  describe("comment config", () => {
    describe("getCommentConfig", () => {
      it("retrieve from context", () => {
        const b = getCommentConfig({ [COMMENT_CONFIG]: CONFIG });
        expect(b).toBe(CONFIG);
      });

      it("throw when unable to find", () => {
        expect(() => getCommentConfig({})).toThrow(Error);
      });
    });
  });

  describe("inline comment", () => {
    it("emit", () => {
      expect(emit(comment(["|", "|"]))).toBe("inline-start||inline-end");
    });
  });

  describe("block comment", () => {
    it("block type", () => {
      let type: BlockCommentType | undefined;
      emit(blockComment(component((ctx: Context) => {
        type = ctx[BLOCK_COMMENT];
        return "";
      })));
      expect(type).notToBeUndefined().toBe(BlockCommentType.Default);
    });
  });

  describe("doc comment", () => {
    it("block type", () => {
      let type: BlockCommentType | undefined;
      emit(docComment(component((ctx: Context) => {
        type = ctx[BLOCK_COMMENT];
        return "";
      })));
      expect(type).notToBeUndefined().toBe(BlockCommentType.Doc);
    });
  });

  describe("remove comments", () => {
    it("inline comment", () => {
      expect(emitWithoutComments(comment("a"))).toBe("");
    });

    it("block comment", () => {
      expect(emitWithoutComments(blockComment("a"))).toBe("");
    });

    it("doc comment", () => {
      expect(emitWithoutComments(docComment("a"))).toBe("");
    });
  });
});
