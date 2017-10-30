import { Context, TChildren, ContextNode, ComponentNode, context, component, trimRight } from "osh";
import { CommentConfig, BlockCommentType, getCommentConfig, getBlockCommentType } from "./comment";

/**
 * INDENT_LEVEL is a symbol for a `Context` that is used to store current indentation level.
 */
export const INDENT_LEVEL = Symbol("IndentLevel");
/**
 * INDENT_STRING is a symbol for a `Context` that is used to store current indentation string.
 */
export const INDENT_STRING = Symbol("IndentString");
/**
 * PADDING is a symbol for a `Context` that is used to store current line padding.
 */
export const PADDING = Symbol("Padding");
/**
 * LINE is a symbol for a `Context` that is used to indicate when rendering is happening inside of a `Line` component.
 */
export const LINE = Symbol("Line");

const LineContext = { [LINE]: true };

/**
 * getIndentLevel retrieves indentation level from context.
 *
 * @param ctx Context.
 * @returns Indentation level.
 */
export function getIndentLevel(ctx: Context): number {
  const v = ctx[INDENT_LEVEL];
  if (v === void 0) {
    return 0;
  }
  return v;
}

/**
 * getIndentString retrieves indentation string from context.
 *
 * @param ctx Context.
 * @returns Indentation string.
 */
export function getIndentString(ctx: Context): string {
  const v = ctx[INDENT_STRING];
  if (v === void 0) {
    return "  ";
  }
  return v;
}

/**
 * getPadding retrieves line padding from context.
 *
 * @param ctx Context.
 * @returns Line padding.
 */
export function getPadding(ctx: Context): string {
  const v = ctx[PADDING];
  if (v === void 0) {
    return "";
  }
  return v;
}

/**
 * isLine returns true when it is rendered inside of a `Line` component.
 *
 * @param ctx Context.
 * @returns true when it is rendered inside of a `Line` component.
 */
export function isLine(ctx: Context): boolean {
  return ctx[LINE] === true;
}

/**
 * Indent is a component that increases current `INDENT_LEVEL`.
 *
 * @param ctx Current context.
 * @param children Children nodes.
 * @returns Children with increased indentation level.
 */
export function Indent(ctx: Context, children: TChildren[]): ContextNode {
  return context(
    { [INDENT_LEVEL]: getIndentLevel(ctx) + 1 },
    children,
  );
}

/**
 * indent is a factory for `Indent` component.
 *
 * `Indent` is a component that increases current `INDENT_LEVEL`.
 *
 * @param children Children node.
 * @returns `Indent` component node.
 */
export function indent(...children: TChildren[]): ComponentNode<TChildren[]> {
  return component(Indent, children);
}

/**
 * Line is a component representing a line.
 *
 * @param ctx Current context.
 * @param children Children nodes.
 * @returns Rendered line.
 */
export function Line(ctx: Context, children: TChildren[]): TChildren {
  const blockComment = getBlockCommentType(ctx);

  if (children.length > 0 || blockComment !== BlockCommentType.Invalid) {
    return context(
      LineContext,
      [
        trimRight(
          getPadding(ctx),
          pad(getIndentLevel(ctx), getIndentString(ctx)),
          blockComment !== BlockCommentType.Invalid ?
            getContinueBlockComment(getCommentConfig(ctx), blockComment) :
            null,
          children,
        ),
        "\n",
      ],
    );
  }
  return "\n";
}

/**
 * line is a factory for `Line` component.
 *
 * `Line` is a component representing a line.
 *
 * @param children Children nodes.
 * @returns `Line` component node.
 */
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

/**
 * getContinueBlockComment retrieves nodes that are used to represent continuation of a block comment.
 *
 * @param cfg Comment config.
 * @param type Block comment type.
 * @returns Node that are used to represent continuation of a block comment.
 */
function getContinueBlockComment(cfg: CommentConfig, type: BlockCommentType): TChildren {
  if (type === BlockCommentType.Doc) {
    return cfg.docContinue;
  }
  return cfg.blockContinue;
}
