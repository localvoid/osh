import { expect } from "iko";
import { intersperse } from "../src/helpers";

describe("src/helpers.ts", () => {
  describe("intersperse", () => {
    it("empty array", () => {
      expect(intersperse([], null)).toBeEqual([]);
    });

    it("one item", () => {
      expect(intersperse(["a"], null)).toBeEqual(["a"]);
    });

    it("two items", () => {
      expect(intersperse(["a", "b"], null)).toBeEqual(["a", null, "b"]);
    });

    it("three items", () => {
      expect(intersperse(["a", "b", "c"], null)).toBeEqual(["a", null, "b", null, "c"]);
    });

    it("two items (array)", () => {
      expect(intersperse(["a", "b"], ["1", "2"])).toBeEqual(["a", ["1", "2"], "b"]);
    });
  });
});
