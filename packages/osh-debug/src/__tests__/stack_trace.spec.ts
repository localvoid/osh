import { TNode, TChildren, component, context, transform, renderToString, STACK_TRACE } from "osh";
import { stackTraceToString, extractContext } from "../stack_trace";

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
    test("component", () => {
      expect(
        stackTraceToString(
          getStackTrace(
            component(function abc() { throw new Error("error"); }),
          )!,
        ),
      ).toBe("[c] abc\n");
    });

    test("transformer", () => {
      expect(
        stackTraceToString(
          getStackTrace(
            transform(function abc() { throw new Error("error"); }, ""),
          )!,
        ),
      ).toBe("[t] abc\n");
    });

    test("component with displayName", () => {
      const fn = () => { throw new Error("error"); };
      (fn as any).displayName = "abc";
      expect(
        stackTraceToString(
          getStackTrace(
            component(fn),
          )!,
        ),
      ).toBe("[c] abc\n");
    });
  });

  describe("extractContext", () => {
    test("empty", () => {
      expect(extractContext(getStackTrace(throwError())!)).toEqual({});
    });

    test("basic context", () => {
      expect(
        extractContext(
          getStackTrace(
            context({ key: 123 }, throwError()),
          )!,
        ),
      ).toEqual({ key: 123 });
    });

    test("override context", () => {
      expect(
        extractContext(
          getStackTrace(
            context({ key: 123 }, context({ key: 456 }, throwError())),
          )!,
        ),
      ).toEqual({ key: 456 });
    });
  });
});
