import { expect } from "iko";
import { TNodeType } from "../src/tnode";
import { renderToString } from "../src/render";
import {
  trimTransformer, trimLeftTransformer, trimRightTransformer, toLowerCaseTransformer, toUpperCaseTransformer,
  capitalizeTransformer,
  trim, trimLeft, trimRight, toLowerCase, toUpperCase, capitalize, replace,
} from "../src/transformers";

describe("src/transformers.ts", () => {
  describe("trim", () => {
    it("empty", () => {
      expect(trimTransformer("")).toBe("");
    });

    it("no spaces", () => {
      expect(trimTransformer("abc")).toBe("abc");
    });

    it("prefix spaces", () => {
      expect(trimTransformer("  abc")).toBe("abc");
    });

    it("postfix spaces", () => {
      expect(trimTransformer("abc  ")).toBe("abc");
    });

    it("prefix and postfix spaces", () => {
      expect(trimTransformer("  abc  ")).toBe("abc");
    });

    it("prefix and postfix tabs", () => {
      expect(trimTransformer("\tabc\t")).toBe("abc");
    });
  });

  describe("trimLeft", () => {
    it("empty", () => {
      expect(trimLeftTransformer("")).toBe("");
    });

    it("no spaces", () => {
      expect(trimLeftTransformer("abc")).toBe("abc");
    });

    it("prefix spaces", () => {
      expect(trimLeftTransformer("  abc")).toBe("abc");
    });

    it("postfix spaces", () => {
      expect(trimLeftTransformer("abc  ")).toBe("abc  ");
    });

    it("prefix and postfix spaces", () => {
      expect(trimLeftTransformer("  abc  ")).toBe("abc  ");
    });

    it("prefix and postfix tabs", () => {
      expect(trimLeftTransformer("\tabc\t")).toBe("abc\t");
    });
  });

  describe("trimRight", () => {
    it("empty", () => {
      expect(trimRightTransformer("")).toBe("");
    });

    it("no spaces", () => {
      expect(trimRightTransformer("abc")).toBe("abc");
    });

    it("prefix spaces", () => {
      expect(trimRightTransformer("  abc")).toBe("  abc");
    });

    it("postfix spaces", () => {
      expect(trimRightTransformer("abc  ")).toBe("abc");
    });

    it("prefix and postfix spaces", () => {
      expect(trimRightTransformer("  abc  ")).toBe("  abc");
    });

    it("prefix and postfix tabs", () => {
      expect(trimRightTransformer("\tabc\t")).toBe("\tabc");
    });
  });

  describe("toLower", () => {
    it("empty", () => {
      expect(toLowerCaseTransformer("")).toBe("");
    });

    it("abc", () => {
      expect(toLowerCaseTransformer("abc")).toBe("abc");
    });

    it("AbC", () => {
      expect(toLowerCaseTransformer("AbC")).toBe("abc");
    });

    it("ABC", () => {
      expect(toLowerCaseTransformer("ABC")).toBe("abc");
    });
  });

  describe("toUpper", () => {
    it("empty", () => {
      expect(toUpperCaseTransformer("")).toBe("");
    });

    it("abc", () => {
      expect(toUpperCaseTransformer("abc")).toBe("ABC");
    });

    it("AbC", () => {
      expect(toUpperCaseTransformer("AbC")).toBe("ABC");
    });

    it("ABC", () => {
      expect(toUpperCaseTransformer("ABC")).toBe("ABC");
    });
  });

  describe("capitalize", () => {
    it("empty", () => {
      expect(capitalizeTransformer("")).toBe("");
    });

    it("abc", () => {
      expect(capitalizeTransformer("abc")).toBe("Abc");
    });

    it("AbC", () => {
      expect(capitalizeTransformer("AbC")).toBe("AbC");
    });

    it("ABC", () => {
      expect(capitalizeTransformer("ABC")).toBe("ABC");
    });
  });

  describe("replace", () => {
    it("replace a with z", () => {
      expect(renderToString(replace("a", "z", "abc"))).toBe("zbc");
    });

    it("replace /[ab]/g with z", () => {
      expect(renderToString(replace(/[ab]/g, "z", "abc"))).toBe("zzc");
    });
  });

  describe("factories", () => {
    it("trim", () => {
      const c = trim("abc");
      expect(c.type).toBe(TNodeType.Transform);
      expect(c.fn).toBe(trimTransformer);
      expect(c.children).toBeArray().toBeEqual(["abc"]);
    });

    it("trimLeft", () => {
      const c = trimLeft("abc");
      expect(c.type).toBe(TNodeType.Transform);
      expect(c.fn).toBe(trimLeftTransformer);
      expect(c.children).toBeArray().toBeEqual(["abc"]);
    });

    it("trimRight", () => {
      const c = trimRight("abc");
      expect(c.type).toBe(TNodeType.Transform);
      expect(c.fn).toBe(trimRightTransformer);
      expect(c.children).toBeArray().toBeEqual(["abc"]);
    });

    it("toLowerCase", () => {
      const c = toLowerCase("abc");
      expect(c.type).toBe(TNodeType.Transform);
      expect(c.fn).toBe(toLowerCaseTransformer);
      expect(c.children).toBeArray().toBeEqual(["abc"]);
    });

    it("toUpperCase", () => {
      const c = toUpperCase("abc");
      expect(c.type).toBe(TNodeType.Transform);
      expect(c.fn).toBe(toUpperCaseTransformer);
      expect(c.children).toBeArray().toBeEqual(["abc"]);
    });

    it("capitalize", () => {
      const c = capitalize("abc");
      expect(c.type).toBe(TNodeType.Transform);
      expect(c.fn).toBe(capitalizeTransformer);
      expect(c.children).toBeArray().toBeEqual(["abc"]);
    });

    it("replace", () => {
      const c = replace("a", "b", "abc");
      expect(c.type).toBe(TNodeType.Transform);
      expect(c.children).toBeArray().toBeEqual(["abc"]);
    });
  });
});
