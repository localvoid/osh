import { TChildren, ComponentNode, Context, context, component } from "osh";
import { INDENT_LEVEL, INDENT_STRING, line } from "../line";
import { COMMENT_CONFIG } from "../comment";
import { scope, declSymbol } from "../symbol";

const RESERVED_KEYWORDS = Symbol("ReservedKeywords");

const KEYWORDS = [
  "abstract",
  "arguments",
  "await",
  "boolean",
  "break",
  "byte",
  "case",
  "catch",
  "char",
  "class",
  "const",
  "continue",
  "debugger",
  "default",
  "delete",
  "do",
  "double",
  "else",
  "enum",
  "eval",
  "export",
  "extends",
  "false",
  "final",
  "finally",
  "float",
  "for",
  "function",
  "goto",
  "if",
  "implements",
  "import",
  "in",
  "instanceof",
  "int",
  "interface",
  "let",
  "long",
  "native",
  "new",
  "null",
  "package",
  "private",
  "protected",
  "public",
  "return",
  "short",
  "static",
  "super",
  "switch",
  "synchronized",
  "this",
  "throw",
  "throws",
  "transient",
  "true",
  "try",
  "typeof",
  "var",
  "void",
  "volatile",
  "while",
  "with",
  "yield",
].map((s) => declSymbol(s, s));

function keywordConflictResolver(s: string, i: number): string {
  if (i === 0) {
    return s;
  }
  return `${s}_${i}`;
}

export function JSCode(ctx: Context, children: TChildren[]): TChildren {
  const indentLevel = ctx[INDENT_LEVEL];
  return scope(
    RESERVED_KEYWORDS,
    keywordConflictResolver,
    KEYWORDS,
    context(
      {
        [INDENT_LEVEL]: indentLevel === void 0 ? 0 : indentLevel,
        [INDENT_STRING]: "  ",
        [COMMENT_CONFIG]: {
          inlineStart: "/*",
          inlineEnd: "*/",
          blockStart: line("/*"),
          blockEnd: line(" */"),
          blockContinue: " * ",
          docStart: line("/**"),
          docEnd: line(" */"),
          docContinue: " * ",
          start: "//",
        },
      },
      children,
    ),
  );
}

export function jsCode(...children: TChildren[]): ComponentNode<TChildren[]> {
  return component(JSCode, children);
}
