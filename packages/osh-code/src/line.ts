import { Context, TChildren, ContextNode, ComponentNode, context, component, trimRight } from "osh";
import { BlockCommentType, commentConfig, blockCommentType, continueBlockComment } from "./comment";

export const INDENT_LEVEL = Symbol("IndentLevel");
export const INDENT_STRING = Symbol("IndentString");
export const PADDING = Symbol("Padding");
export const LINE = Symbol("Line");

const LineContext = { [LINE]: true };

export function indentLevel(ctx: Context): number {
  const v = ctx[INDENT_LEVEL];
  if (v === void 0) {
    return 0;
  }
  return v;
}

export function indentString(ctx: Context): string {
  const v = ctx[INDENT_STRING];
  if (v === void 0) {
    return "  ";
  }
  return v;
}

export function padding(ctx: Context): string {
  const v = ctx[PADDING];
  if (v === void 0) {
    return "";
  }
  return v;
}

export function isLine(ctx: Context): boolean {
  return ctx[LINE] === true;
}

export function Indent(ctx: Context, children: TChildren[]): ContextNode {
  return context(
    { [INDENT_LEVEL]: indentLevel(ctx) + 1 },
    children,
  );
}

export function indent(...children: TChildren[]): ComponentNode<TChildren[]> {
  return component(Indent, children);
}

export function Line(ctx: Context, children: TChildren[]): TChildren {
  const blockComment = blockCommentType(ctx);

  if (children.length > 0 || blockComment !== BlockCommentType.Invalid) {
    return context(
      LineContext,
      [
        trimRight(
          padding(ctx),
          pad(indentLevel(ctx), indentString(ctx)),
          blockComment !== BlockCommentType.Invalid ? continueBlockComment(commentConfig(ctx), blockComment) : null,
          children,
        ),
        "\n",
      ],
    );
  }
  return "\n";
}

export function line(...children: TChildren[]): ComponentNode<TChildren[]> {
  return component(Line, children);
}

function pad(n: number, p: string): string {
  let s = "";
  while (n-- > 0) {
    s += p;
  }
  return s;
}
