import { Context, TChildren, ContextNode, ComponentNode, context, component } from "osh";

export const INDENT_LEVEL = Symbol("IndentLevel");
export const INDENT_STRING = Symbol("IndentString");
export const COMMENT_CONFIG = Symbol("CommentConfig");
export const INLINE = Symbol("Inline");

export function indentLevel(ctx: Context): number {
  return ctx[INDENT_LEVEL];
}

export function indentString(ctx: Context): string {
  return ctx[INDENT_STRING];
}

export function isInline(ctx: Context): boolean {
  return ctx[INLINE] === true;
}

export interface CommentConfig {
  readonly multilineStart: string;
  readonly multilineEnd: string;
  readonly prefix: string;
}

export function commentConfig(ctx: Context): CommentConfig {
  return ctx[COMMENT_CONFIG];
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

const InlineContext = { [INLINE]: true };

export function Line(ctx: Context, children: TChildren[]): TChildren {
  if (children.length > 0) {
    return context(
      InlineContext,
      [
        pad(indentLevel(ctx), indentString(ctx)),
        children,
        "\n",
      ],
    );
  }
  return "\n";
}

export function line(...children: TChildren[]): ComponentNode<TChildren[]> {
  return component(Line, children);
}

export function Comment(ctx: Context, text: string): TChildren {
  const multiline = text.includes("\n");
  const inline = isInline(ctx);
  const cfg = commentConfig(ctx);
  if (inline) {
    if (multiline) {
      text = text.replace("\n", " ");
    }
    return `${cfg.multilineStart} ${text} ${cfg.multilineEnd}`;
  }
  if (multiline) {
    return text.split("\n").map((t) => line(`${cfg.prefix} ${text}`));
  }
  return line(`${cfg.prefix} ${text}`);
}

export function comment(text: string): ComponentNode<string> {
  return component(Comment, text);
}

function pad(n: number, p: string): string {
  let s = "";
  while (n-- > 0) {
    s += p;
  }
  return p;
}
