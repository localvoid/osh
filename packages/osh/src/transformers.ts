import { TChildren, TransformNode, transform } from "./tnode";

export function trimTransformer(s: string): string {
  return s.trim();
}

export function trim(...children: TChildren[]): TransformNode {
  return transform(trimTransformer, children);
}

const LEADING_WHITESPACE = /^\s+/;
const TRAILING_WHITESPACE = /\s+$/;

export function trimLeftTransformer(s: string): string {
  return s.replace(LEADING_WHITESPACE, "");
}

export function trimRightTransformer(s: string): string {
  return s.replace(TRAILING_WHITESPACE, "");
}

export function trimLeft(...children: TChildren[]): TransformNode {
  return transform(trimLeftTransformer, children);
}

export function trimRight(...children: TChildren[]): TransformNode {
  return transform(trimRightTransformer, children);
}

export function replace(searchValue: string, replaceValue: string, ...children: TChildren[]): TransformNode {
  return transform((s) => s.replace(searchValue, replaceValue), children);
}
