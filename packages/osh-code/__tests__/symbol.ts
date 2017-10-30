import { expect } from "iko";
import { TChildren, renderToString } from "osh";
import { scope, sym, declSymbol } from "../src/symbol";

function emit(...children: TChildren[]): string {
  return renderToString(
    ...children,
  );
}

const A = Symbol("A");
const B = Symbol("B");

describe("src/symbol.ts", () => {
  describe("scope", () => {
    it("throw when symbol doesn't exists", () => {
      expect(() => emit(sym(A, "s"))).toThrow(Error);
    });

    it("throw when symbol doesn't exists in any scope", () => {
      expect(() => emit(
        scope({
          type: A,
          symbols: [],
          children: [
            sym(A, "s"),
          ],
        }),
      )).toThrow(Error);
    });

    it("extract symbol", () => {
      expect(emit(
        scope({
          type: A,
          symbols: [
            declSymbol("s", "A"),
          ],
          children: sym(A, "s"),
        }),
      )).toBe("A");
    });

    it("extract symbol from nested scope", () => {
      expect(emit(
        scope({
          type: A,
          symbols: [
            declSymbol("s", "A"),
          ],
          children: scope({
            type: B,
            symbols: [
              declSymbol("s", "B"),
            ],
            children: sym(A, "s"),
          }),
        }),
      )).toBe("A");
    });
  });

  describe("conflict resolver", () => {
    it("default conflict resolver", () => {
      expect(emit(
        scope({
          type: A,
          symbols: [
            declSymbol("s", "A"),
          ],
          children: scope({
            type: B,
            symbols: [
              declSymbol("s", "A"),
            ],
            children: sym(B, "s"),
          }),
        }),
      )).toBe("A2");
    });

    it("custom conflict resolver", () => {
      const resolve = (s: string, i: number) => s + i;
      const getFrom = (type: symbol) => {
        return scope({
          type: A,
          conflictResolver: resolve,
          symbols: [
            declSymbol("s", "A"),
          ],
          children: scope({
            type: B,
            conflictResolver: resolve,
            symbols: [
              declSymbol("s", "A"),
            ],
            children: sym(type, "s"),
          }),
        });
      };
      expect(emit(getFrom(A))).toBe("A1");
      expect(emit(getFrom(B))).toBe("A2");
    });
  });
});
