import { Context, TChildren, ComponentNode, component } from "osh";
import { isLine, line } from "./line";

export const COMMENT_CONFIG = Symbol("CommentConfig");

export interface CommentConfig {
  readonly blockStart: string;
  readonly blockEnd: string;
  readonly start: string;
}

export function commentConfig(ctx: Context): CommentConfig {
  const v = ctx[COMMENT_CONFIG];
  if (v === void 0) {
    throw new Error("Unable to locate CommentConfig in the context");
  }
  return v;
}

export function Comment(ctx: Context, text: string): TChildren {
  const cfg = commentConfig(ctx);
  const multilineText = text.includes("\n");
  if (isLine(ctx)) {
    if (multilineText) {
      text = text.replace("\n", " ");
    }
    return `${cfg.blockStart} ${text} ${cfg.blockEnd}`;
  }
  if (multilineText) {
    return text.split("\n").map((t) => line(`${cfg.start} ${text}`));
  }
  return line(`${cfg.start} ${text}`);
}

export function comment(text: string): ComponentNode<string> {
  return component(Comment, text);
}
