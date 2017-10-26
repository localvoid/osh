import { TChildren, TransformNode, transform } from "./tnode";

export function trimTransformer(s: string): string {
  return s.trim();
}

export function trim(...children: TChildren[]): TransformNode {
  return transform(trimTransformer, children);
}

export function replace(searchValue: string, replaceValue: string, ...children: TChildren[]): TransformNode {
  return transform((s) => s.replace(searchValue, replaceValue), children);
}
