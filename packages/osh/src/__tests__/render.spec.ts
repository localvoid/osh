import { Context } from "../context";
import { TNode, TChildren, component, context, transform } from "../tnode";
import { renderToString, STACK_TRACE } from "../render";

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
    test("null", () => {
      expect(renderToString(null)).toBe("");
    });

    test("empty string", () => {
      expect(renderToString("")).toBe("");
    });

    test("abc string", () => {
      expect(renderToString("abc")).toBe("abc");
    });

    test("array", () => {
      expect(renderToString(["a", "b"])).toBe("ab");
    });

    test("numbers", () => {
      expect(renderToString(1)).toBe("1");
    });

    test("undefined", () => {
      expect(renderToString(undefined)).toBe("");
    });

    test("nested arrays", () => {
      expect(renderToString(["a", ["b"], "c"])).toBe("abc");
    });

    test("nested arrays with numbers", () => {
      expect(renderToString(["a", [1], "c"])).toBe("a1c");
    });

    test("nested arrays with nulls", () => {
      expect(renderToString(["a", [null], "c"])).toBe("ac");
    });

    test("nested arrays with undefined values", () => {
      expect(renderToString(["a", [undefined], "c"])).toBe("ac");
    });

    test("variadic args with numbers", () => {
      expect(renderToString("a", [1], "c")).toBe("a1c");
    });
  });

  describe("component return values", () => {
    test("null", () => {
      expect(renderToString(component(() => null))).toBe("");
    });

    test("empty string", () => {
      expect(renderToString(component(() => ""))).toBe("");
    });

    test("abc string", () => {
      expect(renderToString(component(() => "abc"))).toBe("abc");
    });

    test("array", () => {
      expect(renderToString(component(() => ["a", "b"]))).toBe("ab");
    });

    test("numbers", () => {
      expect(renderToString(component(() => 1))).toBe("1");
    });

    test("undefined", () => {
      expect(renderToString(component(() => undefined))).toBe("");
    });

    test("nested arrays", () => {
      expect(renderToString(component(() => ["a", ["b"], "c"]))).toBe("abc");
    });

    test("nested arrays with numbers", () => {
      expect(renderToString(component(() => ["a", [1], "c"]))).toBe("a1c");
    });

    test("nested arrays with nulls", () => {
      expect(renderToString(component(() => ["a", [null], "c"]))).toBe("ac");
    });

    test("nested arrays with undefined values", () => {
      expect(renderToString(component(() => ["a", [undefined], "c"]))).toBe("ac");
    });

    test("nested components", () => {
      expect(renderToString(component(() => component(() => "abc")))).toBe("abc");
    });
  });

  describe("context", () => {
    test("no context", () => {
      expect(renderToString(
        contextValue("abc"),
      )).toBe("");
    });

    test("empty context", () => {
      expect(renderToString(
        context(
          {},
          contextValue("abc"),
        ),
      )).toBe("");
    });

    test("123", () => {
      expect(renderToString(
        context(
          { "abc": 123 },
          contextValue("abc"),
        ),
      )).toBe("123");
    });

    test("123 + nested 456", () => {
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
    test("append 123", () => {
      expect(renderToString(
        transform(
          (s) => s + "123",
          wrap("a", ["b"], "c")),
      )).toBe("abc123");
    });
  });

  describe("stack traces", () => {
    test("errors should contain stack traces", () => {
      const c = throwError(new Error("error"));
      try {
        renderToString(c);
      } catch (e) {
        expect(e[STACK_TRACE]).toEqual([c]);
      }
    });

    test("should be in stack order", () => {
      const c = throwError(new Error("error"));
      const w = wrap(c);
      try {
        renderToString(w);
      } catch (e) {
        expect(e[STACK_TRACE]).toEqual([w, c]);
      }
    });

    test("number errors should not contain stack traces", () => {
      const c = throwError(1);
      try {
        renderToString(c);
      } catch (e) {
        expect(e[STACK_TRACE]).toBeUndefined();
      }
    });

    test("string errors should not contain stack traces", () => {
      const c = throwError("error");
      try {
        renderToString(c);
      } catch (e) {
        expect(e[STACK_TRACE]).toBeUndefined();
      }
    });

    test("null errors should not contain stack traces", () => {
      const c = throwError(null);
      try {
        renderToString(c);
      } catch (e) {
        expect(e).toBeNull();
      }
    });
  });
});
