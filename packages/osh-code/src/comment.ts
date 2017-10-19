import { Context, TChildren, ComponentNode, component, context } from "osh";
import { isLine, line } from "./line";

export const COMMENT_CONFIG = Symbol("CommentConfig");
export const BLOCK_COMMENT = Symbol("BlockComment");

export const enum BlockCommentType {
  Invalid = 0,
  Default = 1,
  Doc = 2,
}

const blockCommentContext = { [BLOCK_COMMENT]: BlockCommentType.Default };
const docCommentContext = { [BLOCK_COMMENT]: BlockCommentType.Doc };

export interface CommentConfig {
  readonly inlineStart: TChildren | null;
  readonly inlineEnd: TChildren | null;
  readonly blockStart: TChildren | null;
  readonly blockEnd: TChildren | null;
  readonly blockContinue: TChildren | null;
  readonly docStart: TChildren | null;
  readonly docEnd: TChildren | null;
  readonly docContinue: TChildren | null;
  readonly start: TChildren | null;
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
    return `${cfg.inlineStart} ${text} ${cfg.inlineEnd}`;
  }
  if (multilineText) {
    return text.split("\n").map((t) => line(`${cfg.start} ${text}`));
  }
  return line(`${cfg.start} ${text}`);
}

export function comment(text: string): ComponentNode<string> {
  return component(Comment, text);
}

export function blockCommentType(ctx: Context): BlockCommentType {
  let v = ctx[BLOCK_COMMENT];
  if (v === void 0) {
    v = BlockCommentType.Invalid;
  }
  return v;
}

export function BlockComment(ctx: Context, children: TChildren[]): TChildren {
  const cfg = commentConfig(ctx);

  return [
    cfg.blockStart,
    context(blockCommentContext, ...children),
    cfg.blockEnd,
  ];

}

export function blockComment(...children: TChildren[]): ComponentNode<TChildren[]> {
  return component(BlockComment, children);
}

export function DocComment(ctx: Context, children: TChildren[]): TChildren {
  const cfg = commentConfig(ctx);

  return [
    cfg.docStart,
    context(docCommentContext, ...children),
    cfg.docEnd,
  ];

}

export function docComment(...children: TChildren[]): ComponentNode<TChildren[]> {
  return component(DocComment, children);
}

export function continueBlockComment(cfg: CommentConfig, type: BlockCommentType): TChildren {
  if (type === BlockCommentType.Doc) {
    return cfg.docContinue;
  }
  return cfg.blockContinue;
}
