import { TChildren, ContextNode, ComponentNode, Context, context, component } from "osh";
import { INDENT_LEVEL, INDENT_STRING, line } from "../line";
import { COMMENT_CONFIG } from "../comment";

export function JSCode(ctx: Context, children: TChildren[]): ContextNode {
  const indentLevel = ctx[INDENT_LEVEL];
  return context(
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
    ...children,
  );
}

export function jsCode(...children: TChildren[]): ComponentNode<TChildren[]> {
  return component(JSCode, children);
}
