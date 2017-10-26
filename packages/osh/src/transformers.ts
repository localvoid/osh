import { TChildren, TransformNode, transform } from "./tnode";

export function trimTransformer(s: string): string {
  return s.trim();
}

export function trim(...children: TChildren[]): TransformNode {
  return transform(trimTransformer, children);
}
