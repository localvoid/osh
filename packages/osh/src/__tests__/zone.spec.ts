import { TNodeType } from "../tnode";
import { WithDisplayName, zone } from "../zone";

describe("src/zone.ts", () => {
  const n = zone("Test", "children");

  test("component node type", () => {
    expect(n.type).toBe(TNodeType.Component);
  });

  test("component name", () => {
    expect((n.fn as WithDisplayName).displayName).toBe("Zone: Test");
  });

  test("children", () => {
    expect(n.props).toEqual(["children"]);
  });
});
