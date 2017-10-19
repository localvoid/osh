import { TChildren, ContextNode, context } from "osh";
import { INDENT_STRING } from "../line";
import { COMMENT_CONFIG } from "../comment";

export function js(...children: TChildren[]): ContextNode {
  return context(
    {
      [INDENT_STRING]: "  ",
      [COMMENT_CONFIG]: {
        blockStart: "/*",
        blockEnd: "*/",
        start: "//",
      },
    },
    ...children,
  );
}
