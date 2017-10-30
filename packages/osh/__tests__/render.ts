import { expect } from "iko";
import { Context } from "../src/context";
import { TNode, TChildren, component, context, transform } from "../src/tnode";
import { renderToString, STACK_TRACE } from "../src/render";

function Wrap(ctx: Context, children: TChildren[]): TChildren {
  return children;
}

function wrap(...children: TChildren[]): TNode {
  return component(Wrap, children);
}

function ContextValue(ctx: Context, key: any): TChildren {
  return ctx[key];
}

function ThrowError(ctx: Context, e: any): TChildren {
  throw e;
}

function throwError(e: any): TNode {
  return component(ThrowError, e);
}

function contextValue(key: any): TNode {
  return component(ContextValue, key);
}

describe("src/render.ts", () => {
  describe("basic nodes", () => {
    it("null", () => {
      expect(renderToString(null)).toBe("");
    });

    it("empty string", () => {
      expect(renderToString("")).toBe("");
    });

    it("abc string", () => {
      expect(renderToString("abc")).toBe("abc");
    });

    it("array", () => {
      expect(renderToString(["a", "b"])).toBe("ab");
    });

    it("numbers", () => {
      expect(renderToString(1)).toBe("1");
    });

    it("undefined", () => {
      expect(renderToString(undefined)).toBe("");
    });

    it("nested arrays", () => {
      expect(renderToString(["a", ["b"], "c"])).toBe("abc");
    });

    it("nested arrays with numbers", () => {
      expect(renderToString(["a", [1], "c"])).toBe("a1c");
    });

    it("nested arrays with nulls", () => {
      expect(renderToString(["a", [null], "c"])).toBe("ac");
    });

    it("nested arrays with undefined values", () => {
      expect(renderToString(["a", [undefined], "c"])).toBe("ac");
    });

    it("variadic args with numbers", () => {
      expect(renderToString("a", [1], "c")).toBe("a1c");
    });
  });

  describe("component return values", () => {
    it("null", () => {
      expect(renderToString(component(() => null))).toBe("");
    });

    it("empty string", () => {
      expect(renderToString(component(() => ""))).toBe("");
    });

    it("abc string", () => {
      expect(renderToString(component(() => "abc"))).toBe("abc");
    });

    it("array", () => {
      expect(renderToString(component(() => ["a", "b"]))).toBe("ab");
    });

    it("numbers", () => {
      expect(renderToString(component(() => 1))).toBe("1");
    });

    it("undefined", () => {
      expect(renderToString(component(() => undefined))).toBe("");
    });

    it("nested arrays", () => {
      expect(renderToString(component(() => ["a", ["b"], "c"]))).toBe("abc");
    });

    it("nested arrays with numbers", () => {
      expect(renderToString(component(() => ["a", [1], "c"]))).toBe("a1c");
    });

    it("nested arrays with nulls", () => {
      expect(renderToString(component(() => ["a", [null], "c"]))).toBe("ac");
    });

    it("nested arrays with undefined values", () => {
      expect(renderToString(component(() => ["a", [undefined], "c"]))).toBe("ac");
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
      )).toBe("abc123");
    });
  });

  describe("stack traces", () => {
    it("errors should contain stack traces", () => {
      const c = throwError(new Error("error"));
      try {
        renderToString(c);
      } catch (e) {
        expect(e[STACK_TRACE]).toBeArray().toBeEqual([c]);
      }
    });

    it("should be in stack order", () => {
      const c = throwError(new Error("error"));
      const w = wrap(c);
      try {
        renderToString(w);
      } catch (e) {
        expect(e[STACK_TRACE]).toBeArray().toBeEqual([w, c]);
      }
    });

    it("number errors should not contain stack traces", () => {
      const c = throwError(1);
      try {
        renderToString(c);
      } catch (e) {
        expect(e[STACK_TRACE]).toBeUndefined();
      }
    });

    it("string errors should not contain stack traces", () => {
      const c = throwError("error");
      try {
        renderToString(c);
      } catch (e) {
        expect(e[STACK_TRACE]).toBeUndefined();
      }
    });

    it("null errors should not contain stack traces", () => {
      const c = throwError(null);
      try {
        renderToString(c);
      } catch (e) {
        expect(e).toBeNull();
      }
    });
  });
});
