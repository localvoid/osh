import { Context } from "./context";
import { ComponentNode, TChildren, component } from "./tnode";

export function componentFactory(fn: (context: Context) => TChildren): () => ComponentNode;
export function componentFactory<T>(fn: (context: Context, props: T) => TChildren): (props: T) => ComponentNode<T>;
export function componentFactory(fn: (context: Context, props: any) => TChildren): (props?: any) => ComponentNode<any> {
  const c = (props?: any) => {
    return component(fn, props);
  };
  (c as any).displayName = ((fn as any).displayName !== void 0) ? (fn as any).displayName : fn.name;
  return c;
}
