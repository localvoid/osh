import { expect } from "iko";
import { TNodeType, context, component, transform } from "../src/tnode";

describe("src/tnode.ts", () => {
  describe("context", () => {
    it("empty", () => {
      const c = context({}, "a");
      expect(c.type).toBe(TNodeType.Context);
      expect(c.context).toBeObject().toBeEqual({});
      expect(c.children).toBeArray().toBeEqual(["a"]);
    });

    it("{a: 123}", () => {
      const c = context({ a: 123 }, "a");
      expect(c.type).toBe(TNodeType.Context);
      expect(c.context).toBeObject().toBeEqual({ a: 123 });
      expect(c.children).toBeArray().toBeEqual(["a"]);
    });
  });

  it("component", () => {
    const fn = () => null;
    const props = {};
    const c = component(fn, props);
    expect(c.type).toBe(TNodeType.Component);
    expect(c.fn).toBe(fn);
    expect(c.props).toBe(props);
  });

  it("transform", () => {
    const fn = () => "";
    const c = transform(fn, "a");
    expect(c.type).toBe(TNodeType.Transform);
    expect(c.fn).toBe(fn);
    expect(c.children).toBeEqual(["a"]);
  });
});
