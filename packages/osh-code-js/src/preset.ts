import { TChildren, ComponentNode, Context, context, component } from "osh";
import { INDENT_LEVEL, INDENT_STRING, COMMENT_CONFIG, REMOVE_COMMENTS, line, scope, declSymbol } from "osh-code";
import { JSCodeOptions, JS_CODE_OPTIONS, DEFAULT_OPTIONS } from "./options";

const REMOVE_COMMENTS_CONTEXT = { [REMOVE_COMMENTS]: true };
const RESERVED_KEYWORDS = Symbol("ReservedKeywords");

const RESERVED_KEYWORDS_SYMBOLS = [
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

export interface JSCodeProps {
  readonly options: JSCodeOptions;
  readonly children: TChildren;
}

export function JSCode(ctx: Context, props: JSCodeProps): TChildren {
  const indentLevel = ctx[INDENT_LEVEL];
  return context(
    {
      [JS_CODE_OPTIONS]: props.options,
      ...(props.options.removeComments ? REMOVE_COMMENTS_CONTEXT : undefined),
    },
    scope({
      type: RESERVED_KEYWORDS,
      symbols: RESERVED_KEYWORDS_SYMBOLS,
      children: context(
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
            start: "// ",
          },
        },
        props.children,
      ),
    }),
  );
}

export function jsCode(options: Partial<JSCodeOptions> | undefined, children: TChildren): ComponentNode<JSCodeProps> {
  return component(
    JSCode,
    {
      options: { ...DEFAULT_OPTIONS, ...options },
      children,
    },
  );
}
