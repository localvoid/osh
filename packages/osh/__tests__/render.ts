import { expect } from "iko";
import { Context } from "../src/context";
import { TNode, TChildren, component, context, transform } from "../src/tnode";
import { renderToString } from "../src/render";

function Wrap(ctx: Context, children: TChildren[]): TChildren {
  return children;
}

function wrap(...children: TChildren[]): TNode {
  return component(Wrap, children);
}

function ContextValue(ctx: Context, key: any): TChildren {
  return ctx[key];
}

function contextValue(key: any): TNode {
  return component(ContextValue, key);
}

describe("src/helpers.ts", () => {
  describe("basic nodes", () => {
    it("null", () => {
      expect(renderToString(wrap(null))).toBe("");
    });

    it("empty string", () => {
      expect(renderToString(wrap(""))).toBe("");
    });

    it("abc string", () => {
      expect(renderToString(wrap("abc"))).toBe("abc");
    });

    it("array", () => {
      expect(renderToString(wrap("a", "b"))).toBe("ab");
    });

    it("nested arrays", () => {
      expect(renderToString(wrap("a", ["b"], "c"))).toBe("abc");
    });
  });

  describe("context", () => {
    it("no context", () => {
      expect(renderToString(
        contextValue("abc"),
      )).toBe("");
    });

    it("empty context", () => {
      expect(renderToString(
        context(
          {},
          contextValue("abc"),
        ),
      )).toBe("");
    });

    it("123", () => {
      expect(renderToString(
        context(
          { "abc": 123 },
          contextValue("abc"),
        ),
      )).toBe("123");
    });

    it("123 + nested 456", () => {
      expect(renderToString(
        context(
          { "abc": 123 },
          context(
            { "abc": 456 },
            contextValue("abc"),
          ),
        ),
      )).toBe("456");
    });
  });

  describe("transform", () => {
    it("append 123", () => {
      expect(renderToString(
        transform(
          (s) => s + "123",
          wrap("a", ["b"], "c")),
      ),
      ).toBe("abc123");
    });
  });
});
