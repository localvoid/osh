import { TNodeType, context, component, transform } from "../tnode";

describe("src/tnode.ts", () => {
  describe("context", () => {
    test("empty", () => {
      const c = context({}, "a");
      expect(c.type).toBe(TNodeType.Context);
      expect(c.context).toEqual({});
      expect(c.children).toEqual(["a"]);
    });

    test("{a: 123}", () => {
      const c = context({ a: 123 }, "a");
      expect(c.type).toBe(TNodeType.Context);
      expect(c.context).toEqual({ a: 123 });
      expect(c.children).toEqual(["a"]);
    });
  });

  test("component", () => {
    const fn = () => null;
    const props = {};
    const c = component(fn, props);
    expect(c.type).toBe(TNodeType.Component);
    expect(c.fn).toBe(fn);
    expect(c.props).toBe(props);
  });

  test("transform", () => {
    const fn = () => "";
    const c = transform(fn, "a");
    expect(c.type).toBe(TNodeType.Transform);
    expect(c.fn).toBe(fn);
    expect(c.children).toEqual(["a"]);
  });
});
