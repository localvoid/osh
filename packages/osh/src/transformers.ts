import { TChildren, TransformNode, transform } from "./tnode";

export function trimTransformer(s: string): string {
  return s.trim();
}

export function trim(...children: TChildren[]): TransformNode {
  return transform(trimTransformer, ...children);
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
  return transform(trimLeftTransformer, ...children);
}

export function trimRight(...children: TChildren[]): TransformNode {
  return transform(trimRightTransformer, ...children);
}

export function toLowerCaseTransformer(s: string): string {
  return s.toLowerCase();
}

export function toUpperCaseTransformer(s: string): string {
  return s.toUpperCase();
}

export function toLowerCase(...children: TChildren[]): TransformNode {
  return transform(toLowerCaseTransformer, ...children);
}

export function toUpperCase(...children: TChildren[]): TransformNode {
  return transform(toUpperCaseTransformer, ...children);
}

export function capitalizeTransformer(s: string): string {
  if (s.length > 0) {
    return s[0].toUpperCase() + s.substring(1);
  }
  return s;
}

export function capitalize(...children: TChildren[]): TransformNode {
  return transform(capitalizeTransformer, ...children);
}

export function replace(searchValue: string | RegExp, replaceValue: string, ...children: TChildren[]): TransformNode {
  return transform((s) => s.replace(searchValue, replaceValue), ...children);
}
