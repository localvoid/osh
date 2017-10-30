import { TChildren, TransformNode, transform } from "./tnode";

/**
 * trimTransformer trims whitespaces from a string.
 *
 * @param s String.
 * @returns Trimmed string.
 */
export function trimTransformer(s: string): string {
  return s.trim();
}

/**
 * trim is a factory function for `trimTransformer` transformer.
 *
 * `trimTransformer` trims whitespaces from a string.
 *
 * @param children Children nodes.
 * @returns Transformer node.
 */
export function trim(...children: TChildren[]): TransformNode {
  return transform(trimTransformer, ...children);
}

const LEADING_WHITESPACE = /^\s+/;
const TRAILING_WHITESPACE = /\s+$/;

/**
 * trimLeftTransformer trims whitespaces at the start of a string.
 *
 * @param s String.
 * @returns Trimmed string.
 */
export function trimLeftTransformer(s: string): string {
  return s.replace(LEADING_WHITESPACE, "");
}

/**
 * trimRightTransformer trims whitespaces at the end of a string.
 *
 * @param s String.
 * @returns Trimmed string.
 */
export function trimRightTransformer(s: string): string {
  return s.replace(TRAILING_WHITESPACE, "");
}

/**
 * trimLeft is a factory function for `trimLeftTransformer` transformer.
 *
 * `trimLeftTransformer` trims whitespaces at the start of a string.
 *
 * @param children Children nodes.
 * @returns Transformer node.
 */
export function trimLeft(...children: TChildren[]): TransformNode {
  return transform(trimLeftTransformer, ...children);
}

/**
 * trimRight is a factory function for `trimRightTransformer` transformer.
 *
 * `trimRightTransformer` trims whitespaces at the end of a string.
 *
 * @param children Children nodes.
 * @returns Transformer node.
 */
export function trimRight(...children: TChildren[]): TransformNode {
  return transform(trimRightTransformer, ...children);
}

/**
 * toLowerCaseTransformer converts string to lower case.
 *
 * @param s String.
 * @returns Lower cased string.
 */
export function toLowerCaseTransformer(s: string): string {
  return s.toLowerCase();
}

/**
 * toUpperCaseTransformer converts string to upper case.
 *
 * @param s String.
 * @returns Upper cased string.
 */
export function toUpperCaseTransformer(s: string): string {
  return s.toUpperCase();
}

/**
 * toLowerCase is a factory function for `toLowerCaseTransformer` transformer.
 *
 * `toLowerCaseTransformer` converts string to lower case.
 *
 * @param children Children nodes.
 * @returns Transformer node.
 */
export function toLowerCase(...children: TChildren[]): TransformNode {
  return transform(toLowerCaseTransformer, ...children);
}

/**
 * toUpperCase is a factory function for `toUpperCaseTransformer` transformer.
 *
 * `toUpperCaseTransformer` converts string to upper case.
 *
 * @param children Children nodes.
 * @returns Transformer node.
 */
export function toUpperCase(...children: TChildren[]): TransformNode {
  return transform(toUpperCaseTransformer, ...children);
}

/**
 * capitalizeTransformer capitalizes first character of a string.
 *
 * @param s String.
 * @returns Capitalized string.
 */
export function capitalizeTransformer(s: string): string {
  if (s.length > 0) {
    return s[0].toUpperCase() + s.substring(1);
  }
  return s;
}

/**
 * capitalize is a factory function for `capitalizeTransformer` transformer.
 *
 * `capitalizeTransformer` capitalizes first character of a string.
 *
 * @param children Children nodes.
 * @returns Transformer node.
 */
export function capitalize(...children: TChildren[]): TransformNode {
  return transform(capitalizeTransformer, ...children);
}

/**
 * replace is a factory function for transformer nodes that replace `searchValue` with `replaceValue` in a rendered
 * string.
 *
 * @param searchValue Search string or RegExp value.
 * @param replaceVluae Replace string.
 * @returns Transformer node.
 */
export function replace(searchValue: string | RegExp, replaceValue: string, ...children: TChildren[]): TransformNode {
  return transform((s) => s.replace(searchValue, replaceValue), ...children);
}
