import { Context } from "./context";
import { ComponentNode, TChildren, component } from "./tnode";

interface MaybeDisplayName {
  displayName?: string;
}

export function componentFactory(fn: (context: Context) => TChildren): () => ComponentNode;
export function componentFactory<T>(fn: (context: Context, props: T) => TChildren): (props: T) => ComponentNode<T>;
export function componentFactory(fn: (context: Context, props: any) => TChildren): (props?: any) => ComponentNode<any> {
  const c = (props?: any) => {
    return component(fn, props);
  };
  (c as typeof c & MaybeDisplayName).displayName =
    ((fn as typeof fn & MaybeDisplayName).displayName !== void 0) ?
      (fn as typeof fn & MaybeDisplayName).displayName :
      fn.name;
  return c;
}
