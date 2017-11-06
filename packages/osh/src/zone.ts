import { Context } from "./context";
import { TNode, TChildren, component } from "./tnode";

interface WithDisplayName {
  displayName?: string;
}

export function zone(name: string, ...children: TChildren[]): TNode {
  const fn: ((ctx: Context, c: TChildren[]) => TChildren) & WithDisplayName = (ctx: Context, c: TChildren[]) => c;
  fn.displayName = `Zone: ${name}`;
  return component(fn, children);
}
