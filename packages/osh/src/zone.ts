import { Context } from "./context";
import { TChildren, ComponentNode, component } from "./tnode";

export interface WithDisplayName {
  displayName?: string;
}

/**
 * zone generates a component with a specified name and instantiates a component node for this component.
 *
 * Zones are useful for debugging purposes. When exception is thrown, components stack traces will include zone
 * components.
 *
 * @param name Zone name.
 * @param children Children nodes.
 * @returns Zone component node.
 */
export function zone(name: string, ...children: TChildren[]): ComponentNode<TChildren[]> {
  const fn: ((ctx: Context, c: TChildren[]) => TChildren) & WithDisplayName = (ctx: Context, c: TChildren[]) => c;
  fn.displayName = `Zone: ${name}`;
  return component(fn, children);
}
