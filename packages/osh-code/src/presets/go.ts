import { TChildren, ContextNode, ComponentNode, Context, context, component } from "osh";
import { INDENT_LEVEL, INDENT_STRING } from "../line";
import { COMMENT_CONFIG } from "../comment";

export function GOCode(ctx: Context, children: TChildren[]): ContextNode {
  const indentLevel = ctx[INDENT_LEVEL];
  return context(
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
    ...children,
  );
}

export function goCode(...children: TChildren[]): ComponentNode<TChildren[]> {
  return component(GOCode, children);
}
