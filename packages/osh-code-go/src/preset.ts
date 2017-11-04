import { TChildren, TNode, ComponentNode, Context, context, component } from "osh";
import { INDENT_LEVEL, INDENT_STRING, COMMENT_CONFIG, REMOVE_COMMENTS, scope, declSymbol } from "osh-code";
import { GOCodeOptions, GO_CODE_OPTIONS, DEFAULT_OPTIONS } from "./options";

const REMOVE_COMMENTS_CONTEXT = { [REMOVE_COMMENTS]: true };
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

export interface GOCodeProps {
  readonly options: GOCodeOptions;
  readonly children: TChildren;
}

export function GOCode(ctx: Context, props: GOCodeProps): TNode {
  const indentLevel = ctx[INDENT_LEVEL];
  return context(
    {
      [GO_CODE_OPTIONS]: props.options,
      ...(props.options.removeComments ? REMOVE_COMMENTS_CONTEXT : undefined),
    },
    scope({
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
            docContinue: "// ",
            start: "//",
          },
        },
        props.children,
      ),
    }),
  );
}

export function goCode(options: Partial<GOCodeOptions> | undefined, children: TChildren): ComponentNode<GOCodeProps> {
  return component(
    GOCode,
    {
      options: { ...DEFAULT_OPTIONS, ...options },
      children,
    },
  );
}
