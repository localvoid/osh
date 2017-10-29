import { expect } from "iko";
import { join } from "../src/helpers";

describe("src/helpers.ts", () => {
  describe("join", () => {
    it("empty array", () => {
      expect(join([], null)).toBeEqual([]);
    });

    it("one item", () => {
      expect(join(["a"], null)).toBeEqual(["a"]);
    });

    it("two items", () => {
      expect(join(["a", "b"], null)).toBeEqual(["a", null, "b"]);
    });

    it("three items", () => {
      expect(join(["a", "b", "c"], null)).toBeEqual(["a", null, "b", null, "c"]);
    });

    it("two items (array)", () => {
      expect(join(["a", "b"], ["1", "2"])).toBeEqual(["a", ["1", "2"], "b"]);
    });
  });
});
