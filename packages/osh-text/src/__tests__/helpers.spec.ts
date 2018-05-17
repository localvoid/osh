import { intersperse } from "../helpers";

describe("src/helpers.ts", () => {
  describe("intersperse", () => {
    test("empty array", () => {
      expect(intersperse([], null)).toEqual([]);
    });

    test("one item", () => {
      expect(intersperse(["a"], null)).toEqual(["a"]);
    });

    test("two items", () => {
      expect(intersperse(["a", "b"], null)).toEqual(["a", null, "b"]);
    });

    test("three items", () => {
      expect(intersperse(["a", "b", "c"], null)).toEqual(["a", null, "b", null, "c"]);
    });

    test("two items (array)", () => {
      expect(intersperse(["a", "b"], ["1", "2"])).toEqual(["a", ["1", "2"], "b"]);
    });
  });
});
