import { expect } from "iko";
import { TNode, TChildren, component, context, transform, renderToString, STACK_TRACE } from "osh";
import { stackTraceToString, extractContext } from "../src/stack_trace";

function getStackTrace(...children: TChildren[]): TNode[] | undefined {
  try {
    renderToString(...children);
  } catch (e) {
    return e[STACK_TRACE];
  }
  return undefined;
}

function throwError() {
  return component(() => { throw new Error("error"); });
}

describe("src/stack_trace.ts", () => {
  describe("stackTraceToString", () => {
    it("component", () => {
      expect(
        stackTraceToString(
          getStackTrace(
            component(function abc() { throw new Error("error"); }),
          )!,
        ),
      ).toBeString().toBe("[c] abc\n");
    });

    it("transformer", () => {
      expect(
        stackTraceToString(
          getStackTrace(
            transform(function abc() { throw new Error("error"); }, ""),
          )!,
        ),
      ).toBeString().toBe("[t] abc\n");
    });

    it("component with displayName", () => {
      const fn = () => { throw new Error("error"); };
      (fn as any).displayName = "abc";
      expect(
        stackTraceToString(
          getStackTrace(
            component(fn),
          )!,
        ),
      ).toBeString().toBe("[c] abc\n");
    });
  });

  describe("extractContext", () => {
    it("empty", () => {
      expect(extractContext(getStackTrace(throwError())!)).toBeObject().toBeEqual({});
    });

    it("basic context", () => {
      expect(
        extractContext(
          getStackTrace(
            context({ key: 123 }, throwError()),
          )!,
        ),
      ).toBeObject().toBeEqual({ key: 123 });
    });

    it("override context", () => {
      expect(
        extractContext(
          getStackTrace(
            context({ key: 123 }, context({ key: 456 }, throwError())),
          )!,
        ),
      ).toBeObject().toBeEqual({ key: 456 });
    });
  });
});
