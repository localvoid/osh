import { TChildren, TNode, ComponentNode, Context, context, component } from "osh";
import { INDENT_LEVEL, INDENT_STRING, COMMENT_CONFIG, scope, declSymbol } from "osh-code";

const RESERVED_KEYWORDS = Symbol("ReservedKeywords");

const RESERVED_KEYWORDS_SYMBOLS = [
  "break",
  "default",
  "func",
  "interface",
  "select",
  "case",
  "defer",
  "go",
  "map",
  "struct",
  "chan",
  "else",
  "goto",
  "package",
  "switch",
  "const",
  "fallthrough",
  "if",
  "range",
  "type",
  "continue",
  "for",
  "import",
  "return",
  "var",
].map((s) => declSymbol(s, s));

export function GOCode(ctx: Context, children: TChildren[]): TNode {
  const indentLevel = ctx[INDENT_LEVEL];
  return scope({
    type: RESERVED_KEYWORDS,
    symbols: RESERVED_KEYWORDS_SYMBOLS,
    children: context(
      {
        [INDENT_LEVEL]: indentLevel === void 0 ? 0 : indentLevel,
        [INDENT_STRING]: "\t",
        [COMMENT_CONFIG]: {
          inlineStart: "/*",
          inlineEnd: "*/",
          blockStart: "/*",
          blockEnd: "*/",
          blockContinue: null,
          docStart: null,
          docEnd: null,
          docContinue: "//",
          start: "//",
        },
      },
      children,
    ),
  });
}

export function goCode(...children: TChildren[]): ComponentNode<TChildren[]> {
  return component(GOCode, children);
}
