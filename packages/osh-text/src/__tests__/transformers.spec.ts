import { TNodeType, renderToString } from "osh";
import {
  trimTransformer, trimLeftTransformer, trimRightTransformer, toLowerCaseTransformer, toUpperCaseTransformer,
  capitalizeTransformer,
  trim, trimLeft, trimRight, toLowerCase, toUpperCase, capitalize, replace,
} from "../transformers";

describe("src/transformers.ts", () => {
  describe("trim", () => {
    test("empty", () => {
      expect(trimTransformer("")).toBe("");
    });

    test("no spaces", () => {
      expect(trimTransformer("abc")).toBe("abc");
    });

    test("prefix spaces", () => {
      expect(trimTransformer("  abc")).toBe("abc");
    });

    test("postfix spaces", () => {
      expect(trimTransformer("abc  ")).toBe("abc");
    });

    test("prefix and postfix spaces", () => {
      expect(trimTransformer("  abc  ")).toBe("abc");
    });

    test("prefix and postfix tabs", () => {
      expect(trimTransformer("\tabc\t")).toBe("abc");
    });
  });

  describe("trimLeft", () => {
    test("empty", () => {
      expect(trimLeftTransformer("")).toBe("");
    });

    test("no spaces", () => {
      expect(trimLeftTransformer("abc")).toBe("abc");
    });

    test("prefix spaces", () => {
      expect(trimLeftTransformer("  abc")).toBe("abc");
    });

    test("postfix spaces", () => {
      expect(trimLeftTransformer("abc  ")).toBe("abc  ");
    });

    test("prefix and postfix spaces", () => {
      expect(trimLeftTransformer("  abc  ")).toBe("abc  ");
    });

    test("prefix and postfix tabs", () => {
      expect(trimLeftTransformer("\tabc\t")).toBe("abc\t");
    });
  });

  describe("trimRight", () => {
    test("empty", () => {
      expect(trimRightTransformer("")).toBe("");
    });

    test("no spaces", () => {
      expect(trimRightTransformer("abc")).toBe("abc");
    });

    test("prefix spaces", () => {
      expect(trimRightTransformer("  abc")).toBe("  abc");
    });

    test("postfix spaces", () => {
      expect(trimRightTransformer("abc  ")).toBe("abc");
    });

    test("prefix and postfix spaces", () => {
      expect(trimRightTransformer("  abc  ")).toBe("  abc");
    });

    test("prefix and postfix tabs", () => {
      expect(trimRightTransformer("\tabc\t")).toBe("\tabc");
    });
  });

  describe("toLower", () => {
    test("empty", () => {
      expect(toLowerCaseTransformer("")).toBe("");
    });

    test("abc", () => {
      expect(toLowerCaseTransformer("abc")).toBe("abc");
    });

    test("AbC", () => {
      expect(toLowerCaseTransformer("AbC")).toBe("abc");
    });

    test("ABC", () => {
      expect(toLowerCaseTransformer("ABC")).toBe("abc");
    });
  });

  describe("toUpper", () => {
    test("empty", () => {
      expect(toUpperCaseTransformer("")).toBe("");
    });

    test("abc", () => {
      expect(toUpperCaseTransformer("abc")).toBe("ABC");
    });

    test("AbC", () => {
      expect(toUpperCaseTransformer("AbC")).toBe("ABC");
    });

    test("ABC", () => {
      expect(toUpperCaseTransformer("ABC")).toBe("ABC");
    });
  });

  describe("capitalize", () => {
    test("empty", () => {
      expect(capitalizeTransformer("")).toBe("");
    });

    test("abc", () => {
      expect(capitalizeTransformer("abc")).toBe("Abc");
    });

    test("AbC", () => {
      expect(capitalizeTransformer("AbC")).toBe("AbC");
    });

    test("ABC", () => {
      expect(capitalizeTransformer("ABC")).toBe("ABC");
    });
  });

  describe("replace", () => {
    test("replace a with z", () => {
      expect(renderToString(replace("a", "z", "abc"))).toBe("zbc");
    });

    test("replace /[ab]/g with z", () => {
      expect(renderToString(replace(/[ab]/g, "z", "abc"))).toBe("zzc");
    });
  });

  describe("factories", () => {
    test("trim", () => {
      const c = trim("abc");
      expect(c.type).toBe(TNodeType.Transform);
      expect(c.fn).toBe(trimTransformer);
      expect(c.children).toEqual(["abc"]);
    });

    test("trimLeft", () => {
      const c = trimLeft("abc");
      expect(c.type).toBe(TNodeType.Transform);
      expect(c.fn).toBe(trimLeftTransformer);
      expect(c.children).toEqual(["abc"]);
    });

    test("trimRight", () => {
      const c = trimRight("abc");
      expect(c.type).toBe(TNodeType.Transform);
      expect(c.fn).toBe(trimRightTransformer);
      expect(c.children).toEqual(["abc"]);
    });

    test("toLowerCase", () => {
      const c = toLowerCase("abc");
      expect(c.type).toBe(TNodeType.Transform);
      expect(c.fn).toBe(toLowerCaseTransformer);
      expect(c.children).toEqual(["abc"]);
    });

    test("toUpperCase", () => {
      const c = toUpperCase("abc");
      expect(c.type).toBe(TNodeType.Transform);
      expect(c.fn).toBe(toUpperCaseTransformer);
      expect(c.children).toEqual(["abc"]);
    });

    test("capitalize", () => {
      const c = capitalize("abc");
      expect(c.type).toBe(TNodeType.Transform);
      expect(c.fn).toBe(capitalizeTransformer);
      expect(c.children).toEqual(["abc"]);
    });

    test("replace", () => {
      const c = replace("a", "b", "abc");
      expect(c.type).toBe(TNodeType.Transform);
      expect(c.children).toEqual(["abc"]);
    });
  });
});
