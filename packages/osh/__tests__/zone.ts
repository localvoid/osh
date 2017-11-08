import { expect } from "iko";
import { TNodeType } from "../src/tnode";
import { WithDisplayName, zone } from "../src/zone";

describe("src/zone.ts", () => {
  const n = zone("Test", "children");

  it("component node type", () => {
    expect(n.type).toBe(TNodeType.Component);
  });

  it("component name", () => {
    expect((n.fn as WithDisplayName).displayName).toBe("Zone: Test");
  });

  it("children", () => {
    expect(n.props).toBeEqual(["children"]);
  });
});
