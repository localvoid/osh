import { Context, TChildren, ComponentNode, component, context } from "osh";

export const REMOVE_COMMENTS = Symbol("RemoveComments");
export const COMMENT_CONFIG = Symbol("CommentConfig");
export const BLOCK_COMMENT = Symbol("BlockComment");

/**
 * BlockCommentType is a type of a block comment.
 */
export const enum BlockCommentType {
  Invalid = 0,
  Default = 1,
  Doc = 2,
}

const blockCommentContext = { [BLOCK_COMMENT]: BlockCommentType.Default };
const docCommentContext = { [BLOCK_COMMENT]: BlockCommentType.Doc };

/**
 * CommentConfig is an object that contains details how to emit comments.
 */
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

/**
 * getCommentConfig retrieves `CommentConfig` from context.
 *
 * @param ctx Context.
 * @returns Comment config.
 */
export function getCommentConfig(ctx: Context): CommentConfig {
  const v = ctx[COMMENT_CONFIG];
  if (v === void 0) {
    throw new Error("Unable to locate CommentConfig in the current context.");
  }
  return v;
}

/**
 * Comment is a component representing an inline comment.
 *
 * @param ctx Current context.
 * @param children Children nodes.
 * @returns Rendered comment.
 */
export function Comment(ctx: Context, children: TChildren[]): TChildren {
  if (ctx[REMOVE_COMMENTS]) {
    return null;
  }
  const cfg = getCommentConfig(ctx);
  return [cfg.inlineStart, children, cfg.inlineEnd];
}

/**
 * comment is a factory for `Comment` component.
 *
 * `Comment` is a component representing an inline comment.
 *
 * @param children Children nodes.
 * @returns `Comment` component node.
 */
export function comment(...children: TChildren[]): ComponentNode<TChildren[]> {
  return component(Comment, children);
}

/**
 * getBlockCommentType retrieves `BlockCommentType` from context.
 *
 * @param ctx Context.
 * @returns Block comment type.
 */
export function getBlockCommentType(ctx: Context): BlockCommentType {
  let v = ctx[BLOCK_COMMENT];
  if (v === void 0) {
    v = BlockCommentType.Invalid;
  }
  return v;
}

/**
 * BlockComment is a component representing a block comment.
 *
 * @param ctx Current context.
 * @param children Children nodes.
 * @returns Rendered block comment.
 */
export function BlockComment(ctx: Context, children: TChildren[]): TChildren {
  if (ctx[REMOVE_COMMENTS]) {
    return null;
  }
  const cfg = getCommentConfig(ctx);

  return [
    cfg.blockStart,
    context(blockCommentContext, ...children),
    cfg.blockEnd,
  ];

}

/**
 * blockComment is a factory for `BlockComment` component.
 *
 * `BlockComment` is a component representing a block comment.
 *
 * @param children Children nodes.
 * @returns `BlockComment` component node.
 */
export function blockComment(...children: TChildren[]): ComponentNode<TChildren[]> {
  return component(BlockComment, children);
}

/**
 * DocComment is a component representing a doc comment.
 *
 * @param ctx Current context.
 * @param children Children nodes.
 * @returns Rendered doc comment.
 */
export function DocComment(ctx: Context, children: TChildren[]): TChildren {
  if (ctx[REMOVE_COMMENTS]) {
    return null;
  }
  const cfg = getCommentConfig(ctx);

  return [
    cfg.docStart,
    context(docCommentContext, ...children),
    cfg.docEnd,
  ];

}

/**
 * docComment is a factory for `DocComment` component.
 *
 * `DocComment` is a component representing a doc comment.
 *
 * @param children Children nodes.
 * @returns `Comment` component node.
 */
export function docComment(...children: TChildren[]): ComponentNode<TChildren[]> {
  return component(DocComment, children);
}
